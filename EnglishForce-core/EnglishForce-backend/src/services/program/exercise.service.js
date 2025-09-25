import db from "../../sequelize/models/index.js";

export const getAllExercises = async () => {
  return await db.Exercise.findAll({ include: db.ExerciseAnswer });
};

export const getExerciseByPublicId = async (publicId) => {
  const exercise = await db.Exercise.findOne({
    where: { public_id: publicId },
    include: db.ExerciseAnswer
  });
  if (!exercise) throw new Error('Exercise not found');
  return exercise;
};

export const createExercise = async (data) => {
  return await db.Exercise.create(data);
};

export const updateExercise = async (publicId, data) => {
  const exercise = await getExerciseByPublicId(publicId);
  await exercise.update(data);
  return exercise;
};

export const deleteExercise = async (publicId) => {
  const exercise = await getExerciseByPublicId(publicId);
  await exercise.destroy();
};
