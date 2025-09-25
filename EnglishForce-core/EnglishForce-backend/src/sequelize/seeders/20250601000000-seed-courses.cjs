// npx sequelize-cli db:seed --seed 20250601000000-seed-courses.cjs
// npx sequelize-cli db:seed:undo --seed 20250601000000-seed-courses.cjs


'use strict';

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const courseData = require('./CourseData/courseList.cjs');

    for (const course of courseData) {
      const coursePublicId = uuidv4();

      const [createdCourse] = await queryInterface.bulkInsert(
        'courses',
        [{
          public_id: coursePublicId,
          name: course.name,
          instructor: course.instructor,
          description: course.description,
          thumbnail: course.thumbnail,
          thumbnail_public_id: null,
          price: course.price
        }],
        { returning: true }
      );

      const courseId = createdCourse?.id;

      if (!courseId) {
        const [fetchedCourse] = await queryInterface.sequelize.query(
          `SELECT id FROM courses WHERE public_id = :publicId`,
          {
            replacements: { publicId: coursePublicId },
            type: Sequelize.QueryTypes.SELECT
          }
        );
        courseId = fetchedCourse.id;
      }

      const sectionRows = course.sections.map((section) => ({
        public_id: uuidv4(),
        name: section.name,
        description: section.description,
        course_id: courseId,
        video_link: section.video_link,
        video_public_id: null,
        order_index: section.order_index
      }));

      await queryInterface.bulkInsert('course_sections', sectionRows);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('course_sections', null, {});
    await queryInterface.bulkDelete('courses', null, {});
  }
};
