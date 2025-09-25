import db from "../../sequelize/models/index.js";
const { Lesson, Exercise, ExerciseAnswer } = db;

export const getAllLessons = async () => {
  return await Lesson.findAll({
    include: [{ model: Exercise }],
    order: [['order_index', 'ASC']],
  });
};

export const getLessonByPublicId = async (publicId) => {
    return await Lesson.findOne({
      where: { public_id: publicId },
      include: [
        {
          model: db.Exercise,
          include: [
            {
              model: db.ExerciseAnswer,
              order: [['id', 'ASC']], // sắp xếp answer nếu cần
            },
          ],
        },
      ],
      order: [[db.Exercise, 'order_index', 'ASC']],
    });
  };
  
export const createLesson = async (data) => {
  const unit = await db.Unit.findOne({ where: { public_id: data.unit_public_id } });
  if (!unit) {
    throw new Error('Unit not found with that public_id');
  }

  const newLesson = await db.Lesson.create({
    name: data.name,
    description: data.description,
    order_index: data.order_index || 0,
    unit_id: unit.id,
  });

  return newLesson;
};


export const updateLesson = async (publicId, data) => {
  const lesson = await Lesson.findOne({ where: { public_id: publicId } });
  if (!lesson) return null;

  await lesson.update({
    name: data.name ?? lesson.name,
    description: data.description ?? lesson.description,
    order_index: data.order_index ?? lesson.order_index,
    unit_id: data.unit_id ?? lesson.unit_id,
    type: data.type ?? lesson.type,
  });

  return lesson;
};

export const deleteLesson = async (publicId) => {
  const lesson = await Lesson.findOne({ where: { public_id: publicId } });
  if (!lesson) return false;
  await lesson.destroy();
  return true;
};

