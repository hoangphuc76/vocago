// npx sequelize-cli db:seed --seed 20250504-program-seeder.cjs
// npx sequelize-cli db:seed:undo --seed 20250504-program-seeder.cjs

'use strict';
const { v4: uuidv4 } = require('uuid');
const programData = require('./ProgramData/program1.cjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [program] = await queryInterface.bulkInsert(
      'programs',
      [{
        name: programData.name,
        description: programData.description,
        thumbnail: programData.thumbnail,
        order_index: programData.order_index,
        public_id: uuidv4()
      }],
      { returning: true }
    );

    const unitSymbolMap = new Map();
    const lessonSymbolMap = new Map();
    const exerciseSymbolMap = new Map();

    const allUnits = [];
    const allLessons = [];
    const allExercises = [];
    const allAnswers = [];

    // 1. Build raw data
    for (const unit of programData.units) {
      const unitSymbol = Symbol(unit.name);
      unitSymbolMap.set(unitSymbol, null); // null for now

      const unitPublicId = uuidv4();
      allUnits.push({
        program_id: program.id,
        name: unit.name,
        description: unit.description,
        order_index: unit.order_index,
        public_id: unitPublicId,
        _unitSymbol: unitSymbol
      });

      for (const lesson of unit.lessons) {
        const lessonSymbol = Symbol(lesson.name);
        lessonSymbolMap.set(lessonSymbol, unitSymbol);

        const lessonPublicId = uuidv4();
        allLessons.push({
          unit_id: null, // to resolve later
          name: lesson.name,
          description: lesson.description,
          order_index: lesson.order_index,
          public_id: lessonPublicId,
          _unitSymbol: unitSymbol,
          _lessonSymbol: lessonSymbol
        });

        for (const exercise of lesson.exercises) {
          const exerciseSymbol = Symbol();
          exerciseSymbolMap.set(exerciseSymbol, lessonSymbol);

          const exercisePublicId = uuidv4();
          allExercises.push({
            lesson_id: null,
            question: exercise.question,
            type: exercise.type,
            order_index: exercise.order_index,
            explanation: exercise.explanation || null,
            thumbnail: exercise.thumbnail || null,
            record: exercise.record || null,
            public_id: exercisePublicId,
            _lessonSymbol: lessonSymbol,
            _exerciseSymbol: exerciseSymbol
          });

          for (const answer of exercise.answers) {
            allAnswers.push({
              content: answer.content,
              is_correct: answer.is_correct,
              exercise_id: null,
              _exerciseSymbol: exerciseSymbol
            });
          }
        }
      }
    }

    // 2. Insert Units
    const unitResults = await queryInterface.bulkInsert(
      'units',
      allUnits.map(({ _unitSymbol, ...rest }) => rest),
      { returning: true }
    );

    const unitIdMap = new Map();
    unitResults.forEach((u, i) => {
      const symbol = allUnits[i]._unitSymbol;
      unitIdMap.set(symbol, u.id);
    });

    // 3. Insert Lessons
    const resolvedLessons = allLessons.map(lesson => ({
      ...lesson,
      unit_id: unitIdMap.get(lesson._unitSymbol)
    }));

    const lessonResults = await queryInterface.bulkInsert(
      'lessons',
      resolvedLessons.map(({ _unitSymbol, _lessonSymbol, ...rest }) => rest),
      { returning: true }
    );

    const lessonIdMap = new Map();
    lessonResults.forEach((l, i) => {
      const symbol = allLessons[i]._lessonSymbol;
      lessonIdMap.set(symbol, l.id);
    });

    // 4. Insert Exercises
    const resolvedExercises = allExercises.map(ex => ({
      ...ex,
      lesson_id: lessonIdMap.get(ex._lessonSymbol)
    }));

    const exerciseResults = await queryInterface.bulkInsert(
      'exercises',
      resolvedExercises.map(({ _lessonSymbol, _exerciseSymbol, ...rest }) => rest),
      { returning: true }
    );

    const exerciseIdMap = new Map();
    exerciseResults.forEach((e, i) => {
      const symbol = allExercises[i]._exerciseSymbol;
      exerciseIdMap.set(symbol, e.id);
    });

    // 5. Insert Answers
    const resolvedAnswers = allAnswers
      .map(ans => {
        const exerciseId = exerciseIdMap.get(ans._exerciseSymbol);
        if (!exerciseId) {
          console.warn(`❌ Missing exercise_id for answer: '${ans.content}'`);
        }
        return {
          content: ans.content,
          is_correct: ans.is_correct,
          exercise_id: exerciseId,
          public_id: uuidv4()
        };
      })
      .filter(ans => ans.exercise_id);

    await queryInterface.bulkInsert('exercise_answers', resolvedAnswers);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('exercise_answers', null, {});
    await queryInterface.bulkDelete('exercises', null, {});
    await queryInterface.bulkDelete('lessons', null, {});
    await queryInterface.bulkDelete('units', null, {});
    await queryInterface.bulkDelete('programs', null, {});
  }
};
