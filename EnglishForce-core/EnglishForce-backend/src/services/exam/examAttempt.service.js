import { Model } from 'sequelize';
import db from '../../sequelize/models/index.js';
const { Exam, Question, Answer, ExamAttempt, User } = db;

export const getNumberOfExamAttempts = async () => {
  return await db.ExamAttempt.count();
};


export const getPaginatedAttempts = async (page = 1) => {
    const pageSize = 6;
    const offset = (page - 1) * pageSize;

    const { count, rows } = await ExamAttempt.findAndCountAll({
        offset,
        limit: pageSize,
        order: [['created_at', 'DESC']],
        include: [
            { model: User, attributes: ['username'] },
            { model: Exam, attributes: ['name', 'public_id'] }
        ],
    });

    return {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
        attempts: rows,
    };
};


export const getExamAttemptByUserId = async (publicId, userId, limit_number = 5) => {
    const exam = await Exam.findOne({ where: { public_id: publicId } });
    if (!exam) return null;

    const attempts = await ExamAttempt.findAll({
        where: {
            exam_id: exam.id,
            user_id: userId
        },
        limit: limit_number,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'score', 'start', 'end', 'created_at']
    });
    return attempts;
}