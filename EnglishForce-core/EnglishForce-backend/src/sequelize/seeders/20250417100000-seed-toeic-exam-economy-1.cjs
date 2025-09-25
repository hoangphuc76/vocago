// CREATE:  npx sequelize-cli db:seed --seed 20250417100000-seed-toeic-exam-economy-1.cjs
// DELETE:  npx sequelize-cli db:seed:undo --seed 20250417100000-seed-toeic-exam-economy-1.cjs

'use strict';
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const examData = require('./ExamData/TOEIC1.cjs');
const examDataArray = fs.readdirSync(path.join(__dirname, 'ExamData'))
  .filter(file => file.endsWith('.cjs'))
  .map(file => require(path.join(__dirname, 'ExamData', file)));

/**
 * Đệ quy chèn các part, question và answer vào DB
 */
async function insertPartTree({ part, examId, parentPartId, queryInterface }) {
  const [partResult] = await queryInterface.bulkInsert(
    'exam_parts',
    [{
      public_id: uuidv4(),
      exam_id: examId,
      name: part.name || null,
      description: part.description || null,
      order_index: part.order_index || 0,
      parent_part_id: parentPartId || null,
      record: part.record || null,
      thumbnail: part.thumbnail || null,
    }],
    { returning: true }
  );

  const partId = partResult.id;

  // Insert câu hỏi nếu có
  for (const questionData of part.questions || []) {
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
      { returning: true }
    );

    const questionId = questionResult.id;

    // Insert đáp án cho mỗi câu hỏi
    const answers = (questionData.answers || []).map(answer => ({
      public_id: uuidv4(),
      question_id: questionId,
      content: answer.content,
      is_correct: answer.is_correct,
    }));

    if (answers.length > 0) {
      await queryInterface.bulkInsert('answers', answers);
    }
  }

  // Đệ quy cho part con (nếu có)
  for (const childPart of part.parts || []) {
    await insertPartTree({ part: childPart, examId, parentPartId: partId, queryInterface });
  }
}

async function ImportExamIntoDB(queryInterface, Sequelize,examData) {
  const { name, description, duration, parts, type } = examData.exam;

  // Insert exam chính
  const [examResult] = await queryInterface.bulkInsert(
    'exams',
    [{
      public_id: uuidv4(),
      name,
      description,
      duration,
      type,
    }],
    { returning: true }
  );

  const examId = examResult.id;
  if (!examId) throw new Error('Insert exam failed.');

  // Duyệt qua mỗi section cấp 1 (ví dụ: Listening, Reading)
  for (const section of parts) {
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
      { returning: true }
    );

    const sectionId = sectionResult.id;

    for (const part of section.parts || []) {
      await insertPartTree({ part, examId, parentPartId: sectionId, queryInterface });
    }
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (const exam of examDataArray) {
      await ImportExamIntoDB(queryInterface, Sequelize,exam) ;
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('answers', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('exam_parts', null, {});
    await queryInterface.bulkDelete('exams', null, {});
  },
};
