// services/exam.service.js
import db from '../../sequelize/models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import {
  insertPartTree,
  addUserDataToQuestions,
  buildNestedParts,
  getExamById,
  createExamAttempt,
  getExamData,
  processMultipleChoiceAnswers,
  processWritingAnswers,
  processSpeakingAnswers,
  calculateExamScore } from '../../helpers/examHelpers.js';
const { Exam, Question, Answer, ExamAttempt, ExamPart, QuestionGroup } = db;


export const getNumberOfExams = async () => {
  return await db.Exam.count();
};

export const findExamIdByPublicId = async (publicId) => {
  const Exam = await Exam.findOne({ where: { public_id: publicId } });
  if (!Exam) throw new Error('Exam not found with that public_id');
  return Exam.id;
}


export const getAllExams = async (page = 1, query = '', type = '') => {
  const pageSize = 6;
  const offset = (page - 1) * pageSize;

  // Build where clause
  const whereClause = {};

  // Add name search filter
  if (query) {
    whereClause.name = {
      [Op.iLike]: `%${query}%` // PostgreSQL: không phân biệt hoa thường
    };
  }

  // Add type filter
  if (type) {
    whereClause.type = type;
  }

  const { count, rows } = await Exam.findAndCountAll({
    where: whereClause,
    attributes: ['public_id', 'name', 'description', 'duration', 'type'],
    limit: pageSize,
    offset: offset,
    order: [['id', 'DESC']]
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / pageSize),
    currentPage: page,
    exams: rows
  };
};


export const getExamWithFullHierarchy = async (publicId, onlyCorrectAnswers = false, attemptId = null) => {
  const exam = await db.Exam.findOne({
    where: { public_id: publicId },
    attributes: ['id', 'public_id', 'name', 'description', 'duration', 'type'],
  });

  if (!exam) throw new Error('Exam not found');

  // Step 1: Lấy tất cả các ExamParts của bài thi
  const allParts = await db.ExamPart.findAll({
    where: { exam_id: exam.id },
    order: [['order_index', 'ASC']],
    include: [
      {
        model: db.Question,
        attributes: ['id', 'public_id', 'content', 'type', 'thumbnail', 'record', 'order_index'],
        separate: true, // ⚠️ BẮT BUỘC nếu muốn order hoạt động
        order: [['order_index', 'ASC']],
        include: [
          {
            model: db.Answer,
            where: onlyCorrectAnswers ? { is_correct: true } : undefined,
            attributes: ['id', 'public_id', 'content', 'is_correct'],
            order: [['id', 'ASC']],
          }
        ]
      }
    ]
  });


  // Step 2: Convert về object thuần + chuẩn bị Map theo ID
  const partMap = {};
  allParts.forEach(part => {
    part = part.toJSON(); // make plain
    part.Children = [];
    partMap[part.id] = part;
  });

  // Step 3: Gắn part con vào cha (parent_part_id)
  // Ở đây CHildren nên chỉ gắn part.id thay vì part , để tránh trường hợp ông bà nhận thg con , sau đó thg con nhận cháu
  // => ông bà không nhận cháu
  allParts.forEach(part => {
    if (part.parent_part_id) partMap[part.parent_part_id]?.Children.push(part.id);
  });

  var rootParts = [];
  allParts.forEach(part => {
    if (!part.parent_part_id) rootParts.push(partMap[part.id]);
  });
  rootParts = rootParts.map(root => buildNestedParts(root, partMap));

  // If attemptId is provided, fetch user answers and add them to questions
  if (attemptId) {
    const userAnswers = await Answer.findAll({
    where: { exam_attempt_id: attemptId }
    });
    const userAnswersMap = {};

    // Create a map of user answers by question_id
    userAnswers.forEach(answer => {
      userAnswersMap[answer.question_id] = answer;
    });


    rootParts = rootParts.map(part => addUserDataToQuestions(part, userAnswersMap));
  }

  return {
    public_id: exam.public_id,
    name: exam.name,
    description: exam.description,
    duration: exam.duration,
    type: exam.type,
    parts: rootParts
  };
};

export const getExamShort = async (publicId) => {
  const exam = await db.Exam.findOne({
    where: { public_id: publicId },
    attributes: ['public_id', 'name', 'description', 'duration', 'type'],
  });

  return exam ? exam.toJSON() : null;
};

export const createExam = async (examData) => {
  console.log('====examData', JSON.stringify(examData))
  const queryInterface = db.sequelize.getQueryInterface();
  const transaction = await db.sequelize.transaction();

  try {
    const { name, description, duration, parts, type } = examData;

    // Validate required fields
    if (!name || !duration || !type) {
      throw new Error('Missing required fields: name, duration, and type are required');
    }

    // Validate exam type
    const validTypes = ['general', 'toeic', 'ielts', 'toefl'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid exam type. Valid types are: ${validTypes.join(', ')}`);
    }

    // Insert the main exam
    const [examResult] = await queryInterface.bulkInsert(
      'exams',
      [{
        public_id: uuidv4(),
        name,
        description,
        duration,
        type,
      }],
      { returning: true, transaction }
    );

    const examId = examResult.id;
    if (!examId) throw new Error('Insert exam failed.');

    // Iterate over each top-level section (e.g., Listening, Reading)
    for (const section of parts || []) {
      const [sectionResult] = await queryInterface.bulkInsert(
        'exam_parts',
        [{
          public_id: uuidv4(),
          exam_id: examId,
          name: section.name,
          description: section.description,
          order_index: section.order_index || 0,
          record: section.record || null,
          thumbnail: section.thumbnail || null,
        }],
        { returning: true, transaction }
      );
      console.log('===section', JSON.stringify(section))
      const sectionId = sectionResult.id;
      if (!sectionId) throw new Error('Insert section failed.');
      // Process parts within this section
      await insertPartTree(section, sectionId, examId, sectionId, queryInterface, transaction);
    }

    await transaction.commit();
    return {
      public_id: examResult.public_id,
      name: examResult.name,
      type: examResult.type
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating exam:', error);
    throw error;
  }
};

export const updateExamByPublicId = async (publicId, updates) => {
  const exam = await Exam.findOne({ where: { public_id: publicId } });

  if (!exam) {
    throw new Error('Exam not found');
  }

  await exam.update(updates);
  return exam;
};

export const deleteExamByPublicId = async (publicId) => {
  const exam = await Exam.findOne({ where: { public_id: publicId } });
  if (!exam) throw new Error('Exam not found');

  await exam.destroy(); // Sequelize cascade sẽ xóa các Question vì đã set `onDelete: CASCADE`
};

export const submitExamAttempt = async (body, userId) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { exam_public_id, answers, writing_answers, speaking_answers, start, end } = body;

    // Validate and get exam
    const exam = await getExamById(exam_public_id);

    // Create exam attempt
    const attempt = await createExamAttempt(exam, userId, start, end, transaction);

    // Get questions and create maps for efficient lookup
    const { allQuestions, questionMap, rootPartMap } = await getExamData(exam.id);

    // Process different types of answers
    const mcqResults = await processMultipleChoiceAnswers(answers, questionMap, rootPartMap, exam.type);
    const writingResults = await processWritingAnswers(writing_answers, questionMap, attempt.id, transaction);
    const speakingResults = await processSpeakingAnswers(speaking_answers, questionMap, attempt.id, transaction);

    // Calculate final score
    const scoreData = calculateExamScore(
      exam.type,
      mcqResults,
      writingResults,
      speakingResults,
      allQuestions,
      rootPartMap
    );

    // Update attempt with final score
    await attempt.update({
      score: scoreData.score,
      description: scoreData.description
    }, { transaction });

    await transaction.commit();
    return attempt.public_id;

  } catch (error) {
    await transaction.rollback();
    console.error('Error submitting exam attempt:', error);
    throw error;
  }
};

export const getExamResult = async (attemptPublicId) => {
  if (!attemptPublicId) {
    throw new Error('Attempt public ID is required');
  }
  const attempt = await ExamAttempt.findOne({
    where: { public_id: attemptPublicId },
  });

  if (!attempt) throw new Error('Attempt not found');

  const exam = await db.Exam.findByPk(attempt.exam_id);
  if (!exam) throw new Error('Exam not found for this attempt');

  const examInfor = await getExamWithFullHierarchy(exam.public_id, true, attempt.id); // lấy đáp án đúng thôi và thêm user answers

  // Get user answers for WRITING and SPEAKING questions
  const userAnswers = await Answer.findAll({
    where: { exam_attempt_id: attempt.id }
  });

  return {
    ...examInfor,
    examAttemptDescription: attempt.description,
    score: attempt.score,
    attemptDuration: Number(((new Date(attempt.end) - new Date(attempt.start)) / 60000).toFixed(2)),
    userAnswers: userAnswers // Include user answers with Gemini feedback
  };
};


