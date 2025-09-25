import db from "../../sequelize/models/index.js";

export const createProgressService = async ({ lessonPublicId, userId, score }) => {
  // 1. Tìm lesson và program thông qua unit
  const lesson = await db.Lesson.findOne({
    where: { public_id: lessonPublicId },
    include: {
      model: db.Unit,
      include: db.Program
    }
  });

  if (!lesson) throw new Error('Lesson not found');
  if (!lesson.Unit || !lesson.Unit.Program) throw new Error('Program not found via Lesson');

  const programId = lesson.Unit.Program.id;

  // 2. Kiểm tra đã tồn tại UserProgress chưa
  const existingProgress = await db.UserProgress.findOne({
    where: {
      user_id: userId,
      lesson_id: lesson.id
    }
  });

  if (existingProgress) {
    // Nếu đã có → cập nhật score = max
    const newScore = Math.max(parseFloat(existingProgress.score || 0), parseFloat(score));
    await existingProgress.update({
      score: newScore,
      completed_at: new Date()
    });
  } else {
    // Nếu chưa có → tạo mới
    await db.UserProgress.create({
      user_id: userId,
      lesson_id: lesson.id,
      program_id: programId,
      score,
      completed_at: new Date()
    });
  }
};