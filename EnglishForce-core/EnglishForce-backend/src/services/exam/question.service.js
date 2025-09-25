import db from '../../sequelize/models/index.js';
const { Exam, Question, Answer, ExamAttempt, ExamPart } = db;

export const getQuestionsNumBerByExam = async (id) => {
  const count = await Question.count({
    where: { exam_id: id }
  });
  return count;
};


export const getQuestionsByExamPublicId = async (examPublicId) => {
  const exam = await Exam.findOne({ where: { public_id: examPublicId } });
  if (!exam) throw new Error('Exam not found');

  return await Question.findAll({
    where: { exam_id: exam.id },
    order: [['id', 'ASC']]
  });
};


export const getQuestionsByExamPartPublicId = async (partPublicId) => {
  const part = await db.ExamPart.findOne({
    where: { public_id: partPublicId },
    include: [{
      model: db.Question,
      as: 'Questions'
    }]
  });

  if (!part) {
    throw new Error('Exam Part not found');
  }

  return part.Questions; // Trả về danh sách Questions
};


export const createQuestion = async (data) => {
  const { exam_public_id, exam_part_public_id, content, type, thumbnail, record, order_index } = data;

  // Find Exam
  const exam = await Exam.findOne({ where: { public_id: exam_public_id } });
  if (!exam) throw new Error('Exam not found');

  let examPart = null;
  if (exam_part_public_id) {
    examPart = await ExamPart.findOne({ where: { public_id: exam_part_public_id, exam_id: exam.id } });
    if (!examPart) throw new Error('Exam Part not found');
  }

  // Create Question
  return await Question.create({
    content,
    type,
    thumbnail: thumbnail || null,
    record: record || null,
    exam_id: exam.id,
    exam_part_id: examPart ? examPart.id : null,
    order_index,
  });
};

export const deleteQuestion = async (publicId) => {
  const question = await Question.findOne({ where: { public_id: publicId } });
  if (!question) throw new Error('Question not found');
  await question.destroy();
};




export const getQuestionByPublicId = async (publicId) => {
  const question = await db.Question.findOne({
    where: { public_id: publicId },
    include: [
      {
        model: db.Answer,
        attributes: ['public_id', 'content', 'is_correct',],
      },
    ],
  });

  if (!question) {
    throw new Error('Question not found');
  }

  return question;
};


export const updateQuestion = async (publicId, data) => {
  const question = await db.Question.findOne({ where: { public_id: publicId } });
  if (!question) throw new Error('Question not found');

  // Update thumbnail
  if (data.thumbnailFile) {
    if (question.thumbnail_public_id) {
      await deleteCloudinaryFile(question.thumbnail_public_id, 'image');
    }
    question.thumbnail = data.thumbnailFile.path;
    question.thumbnail_public_id = data.thumbnailFile.filename;
  } else if (data.thumbnailLink) {
    if (question.thumbnail_public_id) {
      await deleteCloudinaryFile(question.thumbnail_public_id, 'image');
      question.thumbnail_public_id = null;
    }
    question.thumbnail = data.thumbnailLink;
  }

  // Update record
  if (data.recordFile) {
    if (question.record_public_id) {
      await deleteCloudinaryFile(question.record_public_id, 'video');
    }
    question.record = data.recordFile.path;
    question.record_public_id = data.recordFile.filename;
  } else if (data.recordLink) {
    if (question.record_public_id) {
      await deleteCloudinaryFile(question.record_public_id, 'video');
      question.record_public_id = null;
    }
    question.record = data.recordLink;
  }

  // Update others
  if (data.content !== undefined) question.content = data.content;
  if (data.type !== undefined) question.type = data.type;
  if (data.order_index !== undefined) question.order_index = data.order_index;

  await question.save();
  return question;
};