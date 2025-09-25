import db from '../sequelize/models/index.js';
const { UserCourseInteraction, User, Course } = db;

export const createInteraction = async ({ user_id, coursePublicId, score }) => {
  const course = await db.Course.findOne({ where: { public_id: coursePublicId } });
  if (!course) throw new Error("Course not found");

  return await db.UserCourseInteraction.create({
    user_id,
    course_id: course.id,
    score,
  });
};

export const getAllInteractions = async () => {
  return await UserCourseInteraction.findAll({
    include: [{ model: User }, { model: Course }]
  });
};

export const getInteractionByPublicId = async (publicId) => {
  const interaction = await UserCourseInteraction.findOne({
    where: { public_id: publicId },
    include: [{ model: User }, { model: Course }]
  });
  if (!interaction) throw new Error('Interaction not found');
  return interaction;
};

export const updateInteraction = async (publicId, updateData) => {
  const interaction = await getInteractionByPublicId(publicId);
  return await interaction.update(updateData);
};

export const deleteInteraction = async (publicId) => {
  const interaction = await getInteractionByPublicId(publicId);
  return await interaction.destroy();
};
