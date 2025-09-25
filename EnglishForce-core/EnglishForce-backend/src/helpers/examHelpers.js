import db from '../sequelize/models/index.js';
import * as geminiService from '../services/exam/gemini.service.js';

// IELTS Band conversion tables (based on official IELTS scoring)
const IELTS_LISTENING_BANDS = {
  39: 9.0, 37: 8.5, 35: 8.0, 32: 7.5, 30: 7.0, 26: 6.5, 23: 6.0,
  18: 5.5, 16: 5.0, 13: 4.5, 11: 4.0, 8: 3.5, 6: 3.0, 4: 2.5, 3: 2.0
};

const IELTS_READING_BANDS = {
  39: 9.0, 37: 8.5, 35: 8.0, 33: 7.5, 30: 7.0, 27: 6.5, 23: 6.0,
  19: 5.5, 15: 5.0, 13: 4.5, 10: 4.0, 8: 3.5, 6: 3.0, 4: 2.5, 3: 2.0
};

// Helper function to calculate IELTS band from correct answers
const calculateBandFromCorrect = (correct, total, bandTable) => {
  if (total === 0) return 0;
  
  // Convert to standard 40-question format
  const normalizedCorrect = Math.round((correct / total) * 40);
  
  // Find the appropriate band
  for (const [threshold, band] of Object.entries(bandTable).sort((a, b) => b[0] - a[0])) {
    if (normalizedCorrect >= parseInt(threshold)) {
      return band;
    }
  }
  return 1.0; // Minimum band
};

// Helper function to calculate TOEIC scores
const calculateToeicScoreFromCorrect = (correctListening, correctReading) => {
  // TOEIC scoring formula (simplified)
  // Listening: 0-100 correct answers → 5-495 points
  // Reading: 0-100 correct answers → 5-495 points
  
  const listening_score = Math.min(495, Math.max(5, Math.round(correctListening * 4.9 + 5)));
  const reading_score = Math.min(495, Math.max(5, Math.round(correctReading * 4.9 + 5)));
  const total_score = listening_score + reading_score;
  
  return { listening_score, reading_score, total_score };
};

// For IELTS scoring
const calculateIeltsScore = (correctListening, correctReading, writingScores, speakingScores, allQuestions, rootPartMap) => {
  // Count questions by section
  const listeningQuestions = allQuestions.filter(q => {
    const rootPart = rootPartMap.get(q.exam_part_id);
    const rootName = rootPart?.name?.toLowerCase() || '';
    return rootName.includes('listening');
  }).length;

  const readingQuestions = allQuestions.filter(q => {
    const rootPart = rootPartMap.get(q.exam_part_id);
    const rootName = rootPart?.name?.toLowerCase() || '';
    return rootName.includes('reading');
  }).length;

  // Calculate bands for each section
  const listening_band = calculateBandFromCorrect(correctListening, listeningQuestions, IELTS_LISTENING_BANDS);
  const reading_band = calculateBandFromCorrect(correctReading, readingQuestions, IELTS_READING_BANDS);
  
  // Calculate average scores for writing and speaking
  const writing_band = writingScores.length > 0
    ? writingScores.reduce((sum, score) => sum + score, 0) / writingScores.length
    : 0;

  const speaking_band = speakingScores.length > 0
    ? speakingScores.reduce((sum, score) => sum + score, 0) / speakingScores.length
    : 0;

  // Calculate overall band (average of 4 skills, rounded to nearest 0.5)
  const overall_raw = (listening_band + reading_band + writing_band + speaking_band) / 4;
  const overall_band = Math.round(overall_raw * 2) / 2; // Round to nearest 0.5

  return {
    score: (overall_band / 9) * 100,
    description: `IELTS Overall Band: ${overall_band}, Listening: ${listening_band}, Reading: ${reading_band}, Writing: ${writing_band.toFixed(1)}, Speaking: ${speaking_band.toFixed(1)}`
  };
};

const calculateToeicScore = (correctListening, correctReading) => {
  const { listening_score, reading_score, total_score } = calculateToeicScoreFromCorrect(correctListening, correctReading);

  return {
    score: (total_score / 990) * 100,
    description: `TOEIC Total Score: ${total_score}, Listening: ${listening_score}, Reading: ${reading_score}`
  };
};

// Truy ngược về phần gốc (Listening / Reading)
const findRootPartFast = async (exam_id) => {
  const parts = await db.ExamPart.findAll({
    where: { exam_id },
    attributes: ['id', 'name', 'parent_part_id']
  });

  const partMap = new Map();
  for (const part of parts) {
    partMap.set(part.id, part);
  }

  const rootCache = new Map();

  const resolveRoot = (part_id) => {
    let current = partMap.get(part_id);
    while (current?.parent_part_id) {
      current = partMap.get(current.parent_part_id);
    }
    return current;
  };

  for (const [id] of partMap) {
    rootCache.set(id, resolveRoot(id));
  }

  return rootCache; // Map: exam_part_id → rootPart
};

async function insertPartTree(part, partId, examId, parentPartId, queryInterface, transaction = null) {
  const options = transaction ? { returning: true, transaction } : { returning: true };
  console.log('====part', JSON.stringify(part));
  // Insert questions if they exist
  for (const questionData of part.questions || []) {
    console.log('====questionData', questionData)
    const [questionResult] = await queryInterface.bulkInsert(
      'questions',
      [{
        public_id: uuidv4(),
        exam_id: examId,
        exam_part_id: partId,
        content: questionData.content,
        type: questionData.type,
        thumbnail: questionData.thumbnail || null,
        record: questionData.record || null,
        order_index: questionData.order_index || 0,
      }],
      options
    );

    console.log('====questionResult', questionResult)

    const questionId = questionResult.id;
    if (!questionId) throw new Error('Insert question failed.');
    // Insert answers for each question
    const answers = (questionData.answers || []).map(answer => ({
      public_id: uuidv4(),
      question_id: questionId,
      content: answer.content,
      is_correct: answer.is_correct,
    }));
    if (answers.length > 0) {
      await queryInterface.bulkInsert('answers', answers, options);
    }
  }
}

const addUserDataToQuestions = (part, userAnswersMap) => {
  if (part.Questions) {
    part.Questions = part.Questions.map(question => {
      const userAnswer = userAnswersMap[question.id];
      if (userAnswer) {
        return {
          ...question,
          user_answer_data: {
            text_answer: userAnswer.text_answer,
            audio_record_url: userAnswer.audio_record_url,
            score: userAnswer.score,
            strengths: userAnswer.strengths,
            weaknesses: userAnswer.weaknesses,
            suggestions: userAnswer.suggestions
          }
        };
      }
      return question;
    });
  }

  if (part.Children) {
    part.Children = part.Children.map(child => addUserDataToQuestions(child, userAnswersMap));
  }

  return part;
};

const buildNestedParts = (part, partMap) => {
  part.Children = part.Children.map(childId => {
    const childPart = partMap[childId];
    return childPart ? buildNestedParts(childPart, partMap) : null;
  }).filter(Boolean);
  return part;
}

const getExamById = async (examPublicId) => {
  const exam = await db.Exam.findOne({ where: { public_id: examPublicId } });
  if (!exam) {
    throw new Error('Exam not found');
  }
  return exam;
};

const createExamAttempt = async (exam, userId, start, end, transaction) => {
  const startTime = start ? new Date(start) : new Date();
  const endTime = end ? new Date(end) : new Date();

  return await db.ExamAttempt.create({
    exam_id: exam.id,
    user_id: userId,
    start: startTime,
    end: endTime,
    score: 0,
    description: '',
  }, { transaction });
};

const getExamData = async (examId) => {
  const allQuestions = await db.Question.findAll({
    where: { exam_id: examId },
    include: [db.Answer, db.ExamPart]
  });

  const questionMap = new Map();
  allQuestions.forEach(q => questionMap.set(q.public_id, q));

  const rootPartMap = await findRootPartFast(examId);

  return { allQuestions, questionMap, rootPartMap };
};

const processMultipleChoiceAnswers = async (answers, questionMap, rootPartMap, examType) => {
  if (!answers?.length) {
    return { correct: 0, correctListening: 0, correctReading: 0 };
  }

  let correct = 0;
  let correctListening = 0;
  let correctReading = 0;

  for (const { question_public_id, answer_ids } of answers) {
    const question = questionMap.get(question_public_id);
    if (!question) continue;

    const correctAnswers = question.Answers
      .filter(a => a.is_correct)
      .map(a => a.public_id);

    const isCorrect = JSON.stringify(correctAnswers.sort()) === JSON.stringify(answer_ids.sort());

    if (isCorrect) {
      correct++;

      // Categorize by section for TOEIC and IELTS
      if (examType === 'toeic' || examType === 'ielts') {
        const rootPart = rootPartMap.get(question.exam_part_id);
        const rootName = rootPart?.name?.toLowerCase() || '';

        if (rootName.includes('listening')) {
          correctListening++;
        } else if (rootName.includes('reading')) {
          correctReading++;
        }
      }
    }
  }

  return { correct, correctListening, correctReading };
};

const processWritingAnswers = async (writingAnswers, questionMap, attemptId, transaction) => {
  if (!writingAnswers?.length) {
    return { scores: [] };
  }

  try {
    // Prepare tasks for batch scoring
    const writingTasks = writingAnswers
      .map(({ question_public_id, text_answer }) => {
        const question = questionMap.get(question_public_id);
        if (!question) return null;

        return {
          questionText: question.content,
          questionImage: question.thumbnail,
          userAnswer: text_answer
        };
      })
      .filter(Boolean);

    // Score all writing answers at once
    const geminiResult = await geminiService.scoreMultipleWritingAnswers(writingTasks);
    console.log('Gemini writing result:', JSON.stringify(geminiResult));

    const scores = [];

    // Save user answers with feedback
    for (let i = 0; i < writingAnswers.length; i++) {
      const { question_public_id, text_answer } = writingAnswers[i];
      const question = questionMap.get(question_public_id);
      if (!question) continue;

      const taskResult = geminiResult.tasks.find(t => t.task_number === i + 1);
      const score = taskResult?.overall_score || 0;

      await db.Answer.create({
        question_id: question.id,
        exam_attempt_id: attemptId,
        content: '',
        is_correct: true,
        text_answer: text_answer,
        score: score,
        strengths: taskResult?.strengths || '',
        weaknesses: taskResult?.weaknesses || '',
        suggestions: taskResult?.suggestions || ''
      }, { transaction });

      if (score > 0) scores.push(score);
    }

    return { scores };

  } catch (error) {
    console.error('Error processing writing answers:', error);
    return { scores: [] };
  }
};

const processSpeakingAnswers = async (speakingAnswers, questionMap, attemptId, transaction) => {
  if (!speakingAnswers?.length) {
    return { scores: [] };
  }

  const scores = [];

  for (const { question_public_id, audio_record_url } of speakingAnswers) {
    const question = questionMap.get(question_public_id);
    if (!question) continue;

    try {
      const geminiResult = await geminiService.scoreSpeakingAnswer(question.content, audio_record_url);

      if (!geminiResult?.overall_score) {
        console.error('Invalid Gemini result for speaking answer:', geminiResult);
        continue;
      }

      await db.Answer.create({
        exam_attempt_id: attemptId,
        question_id: question.id,
        audio_record_url: audio_record_url,
        content: '',
        is_correct: true, // Fixed typo: was 'isCorrect'
        score: geminiResult.overall_score,
        strengths: geminiResult.strengths || '',
        weaknesses: geminiResult.weaknesses || '',
        suggestions: geminiResult.suggestions || ''
      }, { transaction });
      if (geminiResult.overall_score > 0) {
        scores.push(geminiResult.overall_score);
      }

    } catch (error) {
      console.error('Error scoring speaking answer:', error);
      // Continue with other answers
    }
  }

  return { scores };
};

const calculateExamScore = (examType, mcqResults, writingResults, speakingResults, allQuestions, rootPartMap) => {
  const { correct, correctListening, correctReading } = mcqResults;
  const total = allQuestions.length;

  switch (examType) {
    case 'toeic':
      return calculateToeicScore(correctListening, correctReading);

    case 'ielts':
      return calculateIeltsScore(
        correctListening,
        correctReading,
        writingResults.scores,
        speakingResults.scores,
        allQuestions,
        rootPartMap
      );

    default:
      const score = total > 0 ? (correct / total) * 100 : 0;
      return {
        score: score,
        description: `General Exam Score: ${score.toFixed(2)}%`
      };
  }
};

export {
  calculateIeltsScore,
  findRootPartFast,
  calculateToeicScore,
  insertPartTree,
  addUserDataToQuestions,
  buildNestedParts,
  getExamById,
  createExamAttempt,
  getExamData,
  processMultipleChoiceAnswers,
  processWritingAnswers,
  processSpeakingAnswers,
  calculateExamScore
};