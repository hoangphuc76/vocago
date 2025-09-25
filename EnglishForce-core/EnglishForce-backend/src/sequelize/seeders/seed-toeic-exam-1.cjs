// CREATE:  npx sequelize-cli db:seed --seed seed-toeic-exam-1.cjs
// DELETE:  npx sequelize-cli db:seed:undo --seed seed-toeic-exam-1.cjs

'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [exam] = await queryInterface.bulkInsert('exams', [{
      public_id: uuidv4(),
      name: 'TOEIC Full Practice Test',
      description: 'Complete TOEIC mock exam with Listening and Reading parts.',
      duration: 120,
    }], { returning: true });

    const examId = exam.id;
    if (!examId) throw new Error('Insert exam failed.');

    // Insert parent parts: Listening and Reading
    const [listeningPart, readingPart] = await queryInterface.bulkInsert('exam_parts', [
      {
        public_id: uuidv4(),
        exam_id: examId,
        name: 'Listening',
        description: 'TOEIC Listening Section',
        order_index: 0,
      },
      {
        public_id: uuidv4(),
        exam_id: examId,
        name: 'Reading',
        description: 'TOEIC Reading Section',
        order_index: 1,
      }
    ], { returning: true });

    const childParts = [
      { name: 'Part 1: Photographs', parentId: listeningPart.id, type: 'listening' },
      { name: 'Part 2: Q&A', parentId: listeningPart.id, type: 'listening' },
      { name: 'Part 3: Conversations', parentId: listeningPart.id, type: 'listening' },
      { name: 'Part 4: Talks', parentId: listeningPart.id, type: 'listening' },
      { name: 'Part 5: Incomplete Sentences', parentId: readingPart.id, type: 'reading' },
      { name: 'Part 6: Text Completion', parentId: readingPart.id, type: 'reading' },
      { name: 'Part 7: Reading Comprehension', parentId: readingPart.id, type: 'reading' },
    ];

    for (let i = 0; i < childParts.length; i++) {
      const part = childParts[i];
      const [childPart] = await queryInterface.bulkInsert('exam_parts', [{
        public_id: uuidv4(),
        exam_id: examId,
        name: part.name,
        parent_part_id: part.parentId,
        order_index: i,
        description: `${part.name} Description`,
      }], { returning: true });

      // Insert 2 sample questions for each part
      const questions = await queryInterface.bulkInsert('questions', [
        {
          public_id: uuidv4(),
          exam_id: examId,
          exam_part_id: childPart.id,
          content: `${part.name} - Question 1`,
          type: part.type,
          thumbnail: part.name.includes('Photographs') ? 'https://example.com/img1.jpg' : null,
          record: part.type === 'listening' ? 'https://example.com/audio1.mp3' : null
        },
        {
          public_id: uuidv4(),
          exam_id: examId,
          exam_part_id: childPart.id,
          content: `${part.name} - Question 2`,
          type: part.type,
          thumbnail: null,
          record: part.type === 'listening' ? 'https://example.com/audio2.mp3' : null
        }
      ], { returning: true });

      for (const question of questions) {
        await queryInterface.bulkInsert('answers', [
          {
            public_id: uuidv4(),
            question_id: question.id,
            content: 'Answer A',
            is_correct: true,
          },
          {
            public_id: uuidv4(),
            question_id: question.id,
            content: 'Answer B',
            is_correct: false,
          }
        ]);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('answers', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('exam_parts', null, {});
    await queryInterface.bulkDelete('exams', null, {});
    await queryInterface.bulkDelete('exam_attempts', null, {});
  }
};
