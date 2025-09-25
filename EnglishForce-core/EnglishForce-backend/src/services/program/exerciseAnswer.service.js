import db from "../../sequelize/models/index.js" ;

export const createExerciseAnswer = async ({ exercise_public_id, content, is_correct }) => {
  // Find Exercise by public_id
  const exercise = await db.Exercise.findOne({
    where: { public_id: exercise_public_id }
  });

  if (!exercise) {
    throw new Error("Exercise not found");
  }

  // Create the answer
  const answer = await db.ExerciseAnswer.create({
    exercise_id: exercise.id,
    content,
    is_correct
  });

  return answer;
};

export const getExerciseAnswerByPublicId = async (publicId) => {
  const answer = await db.ExerciseAnswer.findOne({ where: { public_id: publicId } });
  if (!answer) throw new Error('Answer not found');
  return answer;
};

export const getAnswersByExercise = async (exercisePublicId) => {
  const exercise = await db.Exercise.findOne({ where: { public_id: exercisePublicId } });
  if (!exercise) throw new Error('Exercise not found');
  return await db.ExerciseAnswer.findAll({
    where: { exercise_id: exercise.id },
    order: [['id', 'ASC']]
  });
};

export const updateExerciseAnswer = async (publicId, data) => {
  const answer = await getExerciseAnswerByPublicId(publicId);
  await answer.update(data);
  return answer;
};

export const deleteExerciseAnswer = async (publicId) => {
  const answer = await getExerciseAnswerByPublicId(publicId);
  return await answer.destroy();
};
