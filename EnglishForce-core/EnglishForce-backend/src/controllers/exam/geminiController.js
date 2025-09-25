// controllers/exam/geminiController.js
import * as geminiService from '../../services/exam/gemini.service.js';
import * as vocabQuizService from '../../services/exam/vocabQuiz.service.js';
import * as userAnswerService from '../../services/exam/userAnswer.service.js';
import db from '../../sequelize/models/index.js';

const { Question } = db;

export const scoreWritingAnswer = async (req, res) => {
  try {
    const { question_public_id, text_answer } = req.body;

    // Get the question
    const question = await Question.findOne({ where: { public_id: question_public_id } });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Score the answer using Gemini
    const result = await geminiService.scoreWritingAnswer(question.content, text_answer, question.thumbnail);
    
    // Return the result
    res.json(result);
  } catch (error) {
    console.error('Error scoring writing answer:', error);
    res.status(500).json({ message: error.message });
  }
};

export const scoreSpeakingAnswer = async (req, res) => {
  try {
    const { question_public_id, audio_transcript } = req.body;

    // Get the question
    const question = await Question.findOne({ where: { public_id: question_public_id } });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Score the answer using Gemini
    const result = await geminiService.scoreSpeakingAnswer(question.content, audio_transcript);
    
    // Return the result
    res.json(result);
  } catch (error) {
    console.error('Error scoring speaking answer:', error);
    res.status(500).json({ message: error.message });
  }
};

export const submitAndScoreUserAnswer = async (req, res) => {
  try {
    const { exam_attempt_id, question_public_id, text_answer, audio_record_url } = req.body;

    // Get the question
    const question = await Question.findOne({ where: { public_id: question_public_id } });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    let scoreResult = null;
    
    // Score the answer based on question type
    if (question.type === 'writing' && text_answer) {
      scoreResult = await geminiService.scoreWritingAnswer(question.content, text_answer);
    } else if (question.type === 'speaking' && audio_record_url) {
      // For speaking, we would need to transcribe the audio first
      // This is a simplified version - in practice you would use a speech-to-text service
      const audio_transcript = "This is a placeholder transcript"; // Placeholder
      scoreResult = await geminiService.scoreSpeakingAnswer(question.content, audio_transcript);
    }

    // Save the user answer
    const userAnswerData = {
      exam_attempt_id,
      question_id: question.id,
      text_answer: text_answer || null,
      audio_record_url: audio_record_url || null
    };

    // Add scoring results if available
    if (scoreResult) {
      userAnswerData.score = scoreResult.score;
      userAnswerData.strengths = scoreResult.strengths;
      userAnswerData.weaknesses = scoreResult.weaknesses;
      userAnswerData.suggestions = scoreResult.suggestions;
    }

    const userAnswer = await userAnswerService.createUserAnswer(userAnswerData);

    res.status(201).json({
      message: 'User answer submitted successfully',
      userAnswer,
      scoreResult
    });
  } catch (error) {
    console.error('Error submitting user answer:', error);
    res.status(500).json({ message: error.message });
  }
};

// Generate vocabulary multiple-choice quiz using Gemini
export const generateVocabularyQuiz = async (req, res) => {
  try {
    const { words, questionsPerWord, language } = req.body;

    const result = await vocabQuizService.generateVocabularyQuiz({
      words,
      questionsPerWord,
      language,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error generating vocabulary quiz:', error);
    res.status(500).json({ message: error.message });
  }
};
