// services/examStructure.service.js
import db from '../../sequelize/models/index.js';
import { v4 as uuidv4 } from 'uuid';

const { Exam, ExamPart, Question, Answer } = db;

/**
 * Creates a complete exam with all its hierarchical structure
 * Supports the full TOEIC/IELTS/TOEFL structure with sections, parts, questions, and answers
 */
export const createExamWithStructure = async (examData) => {
  const queryInterface = db.sequelize.getQueryInterface();
  const transaction = await db.sequelize.transaction();
  console.log('====examData', JSON.stringify(examData));
  try {
    const { name, description, duration, type, parts } = examData;

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
        duration: parseInt(duration),
        type,
      }],
      { returning: true, transaction }
    );

    const examId = examResult.id;
    if (!examId) throw new Error('Failed to create exam.');

    // Process each top-level section (e.g., Listening, Reading)
    for (const sectionData of parts || []) {
      const sectionId = await createSection(examId, sectionData, queryInterface, transaction);
      
      // Process questions directly under the section (if any)
      if (sectionData.questions && Array.isArray(sectionData.questions)) {
        await createQuestions(examId, sectionId, sectionData.questions, queryInterface, transaction);
      }
      
      // Process child parts within this section
      if (sectionData.parts && Array.isArray(sectionData.parts)) {
        for (const partData of sectionData.parts) {
          await createPart(examId, sectionId, partData, queryInterface, transaction);
        }
      }
    }

    await transaction.commit();
    
    return { 
      public_id: examResult.public_id, 
      name: examResult.name,
      type: examResult.type
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating exam with structure:', error);
    throw error;
  }
};

/**
 * Creates a top-level section (e.g., Listening, Reading)
 */
async function createSection(examId, sectionData, queryInterface, transaction) {
  const [sectionResult] = await queryInterface.bulkInsert(
    'exam_parts',
    [{
      public_id: uuidv4(),
      exam_id: examId,
      name: sectionData.name,
      description: sectionData.description,
      order_index: sectionData.order_index || 0,
      record: sectionData.record || null,
      thumbnail: sectionData.thumbnail || null,
      parent_part_id: null,
    }],
    { returning: true, transaction }
  );
  console.log('====sectionResult', JSON.stringify(sectionResult));

  return sectionResult.id;
}

/**
 * Creates a child part within a section
 */
async function createPart(examId, parentPartId, partData, queryInterface, transaction) {
  const [partResult] = await queryInterface.bulkInsert(
    'exam_parts',
    [{
      public_id: uuidv4(),
      exam_id: examId,
      parent_part_id: parentPartId,
      name: partData.name,
      description: partData.description,
      order_index: partData.order_index || 0,
      record: partData.record || null,
      thumbnail: partData.thumbnail || null,
    }],
    { returning: true, transaction }
  );
  console.log('=====partResult', JSON.stringify(partResult));
  const partId = partResult.id;
  
  // Process questions for this part
  if (partData.questions && Array.isArray(partData.questions)) {
    await createQuestions(examId, partId, partData.questions, queryInterface, transaction);
  }
  
  // Process nested parts (for complex structures)
  if (partData.parts && Array.isArray(partData.parts)) {
    for (const childPartData of partData.parts) {
      await createPart(examId, partId, childPartData, queryInterface, transaction);
    }
  }
  
  return partId;
}

/**
 * Creates questions for a given part
 */
async function createQuestions(examId, partId, questions, queryInterface, transaction) {
  for (const questionData of questions) {
    const [questionResult] = await queryInterface.bulkInsert(
      'questions',
      [{
        public_id: uuidv4(),
        exam_id: examId,
        exam_part_id: partId,
        content: questionData.content || null,
        type: questionData.type || 'single_choice',
        thumbnail: questionData.thumbnail || null,
        record: questionData.record || null,
        order_index: questionData.order_index || 0,
      }],
      { returning: true, transaction }
    );

    const questionId = questionResult.id;
    
    // Process answers for this question
    if (questionData.answers && Array.isArray(questionData.answers)) {
      const answers = questionData.answers.map(answer => ({
        public_id: uuidv4(),
        question_id: questionId,
        content: answer.content,
        is_correct: answer.is_correct || false,
      }));
      
      if (answers.length > 0) {
        await queryInterface.bulkInsert('answers', answers, { transaction });
      }
    }
  }
}