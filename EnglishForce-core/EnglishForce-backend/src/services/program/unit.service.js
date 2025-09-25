import db from "../../sequelize/models/index.js";
const { Unit, Lesson, Program, UserProgress } = db;

export const getAllUnits = async () => {
  return await Unit.findAll({
    include: [{ model: Lesson, order: [['order_index', 'ASC']] }],
    order: [['order_index', 'ASC']],
  });
};

export const getUnitByPublicId = async (publicId, userId = null) => {
  return await Unit.findOne({
    where: { public_id: publicId },
    include: [
      {
        model: Lesson,
        separate: true, // để order hoạt động trong include
        order: [['order_index', 'ASC']],
        include: userId
          ? [{
              model: UserProgress,
              where: { user_id: userId },
              required: false,
            }]
          : []
      },
    ],
  });
};

export const getUnitsByProgramPublicId = async (programPublicId) => {
  const program = await Program.findOne({ where: { public_id: programPublicId } });
  if (!program) return [];

  return await Unit.findAll({
    where: { program_id: program.id },
    include: [{ model: Lesson }],
    order: [['order_index', 'ASC']],
  });
};



export const updateUnit = async (publicId, data) => {
  const unit = await db.Unit.findOne({ where: { public_id: publicId } });
  if (!unit) return null;

  await unit.update(data);
  return unit;
};


export const createUnit = async ({ program_public_id, name, description, order_index }) => {
  const program = await db.Program.findOne({ where: { public_id: program_public_id } });
  if (!program) {
    throw new Error('Program not found with that public_id');
  }

  const newUnit = await db.Unit.create({
    program_id: program.id,
    name,
    description,
    order_index,
  });

  return newUnit;
};


export const deleteUnit = async (publicUnitId) => {
  const unit = await db.Unit.findOne({ where: { public_id: publicUnitId } });
  if (!unit) throw new Error('Unit not found');

  await unit.destroy(); // Sequelize sẽ xóa cascade Lesson và Exercise nếu đã khai báo onDelete
};
