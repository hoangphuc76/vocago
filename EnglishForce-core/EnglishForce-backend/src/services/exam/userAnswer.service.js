// services/exam/userAnswer.service.js
import db from '../../sequelize/models/index.js';

const { Answer, Question } = db;

// Create a user answer record (for writing/speaking or other types tied to an exam attempt)
export const createUserAnswer = async (payload) => {
  const {
    exam_attempt_id,
    question_id,
    question_public_id,
    text_answer,
    audio_record_url,
    score,
    strengths,
    weaknesses,
    suggestions,
  } = payload;

  if (!exam_attempt_id) {
    throw new Error('exam_attempt_id is required');
  }

  let resolvedQuestionId = question_id;
  if (!resolvedQuestionId && question_public_id) {
    const question = await Question.findOne({ where: { public_id: question_public_id } });
    if (!question) throw new Error('Question not found');
    resolvedQuestionId = question.id;
  }
  if (!resolvedQuestionId) {
    throw new Error('question_id or question_public_id is required');
  }

  const newAnswer = await Answer.create({
    exam_attempt_id,
    question_id: resolvedQuestionId,
    text_answer: text_answer || null,
    audio_record_url: audio_record_url || null,
    score: typeof score === 'number' ? score : score || null,
    strengths: strengths || null,
    weaknesses: weaknesses || null,
    suggestions: suggestions || null,
    content: '',
    is_correct: null,
  });

  return newAnswer;
};

// Get all user answers for a given exam attempt
export const getUserAnswersByAttemptId = async (attemptId) => {
  if (!attemptId) throw new Error('attemptId is required');
  const userAnswers = await Answer.findAll({
    where: { exam_attempt_id: attemptId },
    order: [['id', 'ASC']],
  });
  return userAnswers;
};


