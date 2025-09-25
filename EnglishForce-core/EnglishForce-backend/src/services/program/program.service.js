import db from "../../sequelize/models/index.js";
const { Program, Unit, Lesson, UserProgress } = db;
import { deleteCloudinaryFile } from "../../config/cloudinary.config.js";

import { Sequelize } from 'sequelize';


export const getNumberOfPrograms = async () => {
  return await db.Program.count();
};

export const getPaginatedPrograms = async (page = 1) => {
  const limit = 6;
  const offset = (page - 1) * limit;

  const { count, rows } = await Program.findAndCountAll({
    offset,
    limit,
    order: [['order_index', 'ASC']]
  });

  return {
    programs: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};


export const getAllProgramsWithProgressStatus = async (userId) => {
  // 1. Truy vấn tổng số lesson theo program_id
  const lessonCounts = await db.sequelize.query(`
    SELECT p.id AS program_id, COUNT(l.id) AS total_lessons
    FROM programs p
    JOIN units u ON u.program_id = p.id
    JOIN lessons l ON l.unit_id = u.id
    GROUP BY p.id
  `, { type: Sequelize.QueryTypes.SELECT });

  const lessonCountMap = Object.fromEntries(
    lessonCounts.map(row => [row.program_id, parseInt(row.total_lessons)])
  );

  // 2. Truy vấn số bài học đã học của user theo program_id
  const userProgressCounts = await db.UserProgress.findAll({
    where: { user_id: userId },
    attributes: [
      'program_id',
      [Sequelize.fn('COUNT', Sequelize.col('lesson_id')), 'learned']
    ],
    group: ['program_id']
  });

  const learnedMap = {};
  userProgressCounts.forEach(row => {
    learnedMap[row.program_id] = parseInt(row.get('learned'));
  });

  // 3. Truy vấn danh sách Program
  const programs = await db.Program.findAll({
    order: [['order_index', 'ASC']]
  });

  // 4. Gắn trạng thái tiến độ
  return programs.map(program => {
    const programId = program.id;
    const totalLessons = lessonCountMap[programId] || 0;
    const learned = learnedMap[programId] || 0;

    let progressStatus = 'not_started';
    if (totalLessons > 0 && learned === totalLessons) {
      progressStatus = 'completed';
    } else if (learned > 0) {
      progressStatus = 'in_progress';
    }

    return {
      ...program.toJSON(),
      progressStatus,
      totalLessons,
      learnedLessons: learned
    };
  });
};


export const getProgramByPublicId = async (public_id) => {
  const program = await Program.findOne({
    where: { public_id },
    include: [{
      model: Unit,
      as: 'Units',
      order: [['order_index', 'ASC']]
    }]
  });

  return program;
};

export const getProgramWithProgress = async (programPublicId, userId) => {
  const program = await Program.findOne({
    where: { public_id: programPublicId },
    include: [
      {
        model: Unit,
        include: [{ model: Lesson }],
        order: [['order_index', 'ASC']],
      }
    ]
  });

  if (!program) return null;

  // Tính tiến độ từng Unit
  for (const unit of program.Units) {
    const lessonIds = unit.Lessons.map(lesson => lesson.id);
    const totalLessons = lessonIds.length;

    let completedCount = 0;
    if (totalLessons > 0) {
      completedCount = await UserProgress.count({
        where: {
          user_id: userId,
          lesson_id: lessonIds,
          program_id: program.id
        }
      });
    }

    let progressStatus = 'not_started';
    if (completedCount === 0) progressStatus = 'not_started';
    else if (completedCount === totalLessons) progressStatus = 'completed';
    else progressStatus = 'in_progress';

    unit.dataValues.progressStatus = progressStatus;
    unit.dataValues.progressPercent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  }

  return program;
};




export const deleteByPublicId = async (publicId) => {
  const program = await db.Program.findOne({ where: { public_id: publicId } });
  if (!program) {
    throw new Error('Program not found');
  }
  await program.destroy();
  // CASCADE will delete relational Units, Lessons 
};



export const createProgramService = async ({ name, description, order_index, thumbnail }) => {
  return await db.Program.create({
    name,
    description,
    order_index,
    thumbnail,
  });
};


export const updateProgramByPublicId = async (public_id, { name, description, order_index, thumbnail, isUpload }) => {
  const program = await Program.findOne({ where: { public_id } });
  if (!program) return null;

  // Nếu là file mới upload → xoá ảnh cũ
  if (isUpload && program.thumbnail_public_id) {
    try {
      await deleteCloudinaryFile(program.thumbnail_public_id, 'image');
    } catch (err) {
      console.warn('⚠️ Failed to delete old thumbnail:', err.message);
    }
  }

  // Cập nhật dữ liệu
  program.name = name ?? program.name;
  program.description = description ?? program.description;
  program.order_index = order_index ?? program.order_index;

  if (thumbnail) {
    program.thumbnail = thumbnail;

    // Nếu là upload, trích public_id từ Cloudinary URL
    if (isUpload && thumbnail.includes('/')) {
      const parts = thumbnail.split('/');
      const filename = parts.at(-1).split('.')[0];
      program.thumbnail_public_id = `uploads/${filename}`;
    } else {
      program.thumbnail_public_id = null;
    }
  }

  await program.save();
  return program;
};
