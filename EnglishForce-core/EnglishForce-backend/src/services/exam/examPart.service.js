import db from '../../sequelize/models/index.js';
import { deleteCloudinaryFile } from '../../config/cloudinary.config.js';

export const createExamPart = async (data) => {
    const { exam_public_id, name, description, parent_part_public_id } = data;

    // Find Exam
    const exam = await db.Exam.findOne({ where: { public_id: exam_public_id } });
    if (!exam) throw new Error('Exam not found');

    // Find Parent Part 
    let parentPart = null;
    if (parent_part_public_id) {
        parentPart = await db.ExamPart.findOne({ where: { public_id: parent_part_public_id } });
        if (!parentPart) throw new Error('Parent Part not found');
    }

    // Create
    const part = await db.ExamPart.create({
        exam_id: exam.id,
        name,
        description,
        parent_part_id: parentPart ? parentPart.id : null
    });
    return part;
};

export const getExamPartByPublicId = async (publicId) => {
    const part = await db.ExamPart.findOne({
        where: { public_id: publicId },
        include: [
            { model: db.ExamPart, as: 'Children' },
            { model: db.ExamPart, as: 'Parent' },
            { model: db.Question },
        ]
    });
    if (!part) throw new Error('Exam Part not found');
    return part;
};


export const updateExamPart = async (publicId, data) => {
  const part = await db.ExamPart.findOne({ where: { public_id: publicId } });
  if (!part) throw new Error('Exam Part not found');

  // Xử lý thumbnail
  if (data.thumbnailFile) {
    if (part.thumbnail_public_id) {
      await deleteCloudinaryFile(part.thumbnail_public_id, 'image');
    }
    part.thumbnail = data.thumbnailFile.path;
    part.thumbnail_public_id = data.thumbnailFile.filename;
  } else if (data.thumbnailLink) {
    // Nếu người dùng nhập link
    if (part.thumbnail_public_id) {
      await deleteCloudinaryFile(part.thumbnail_public_id, 'image');
      part.thumbnail_public_id = null;
    }
    part.thumbnail = data.thumbnailLink;
  }

  // Xử lý record
  if (data.recordFile) {
    if (part.record_public_id) {
      await deleteCloudinaryFile(part.record_public_id, 'video');
    }
    part.record = data.recordFile.path;
    part.record_public_id = data.recordFile.filename;
  } else if (data.recordLink) {
    // Nếu người dùng nhập link
    if (part.record_public_id) {
      await deleteCloudinaryFile(part.record_public_id, 'video');
      part.record_public_id = null;
    }
    part.record = data.recordLink;
  }

  // Cập nhật name và description nếu có
  if (data.name !== undefined) part.name = data.name;
  if (data.description !== undefined) part.description = data.description;

  await part.save();
  return part;
};


export const deleteExamPart = async (publicId) => {
    const part = await db.ExamPart.findOne({ where: { public_id: publicId } });
    if (!part) throw new Error('Exam Part not found');

    await part.destroy();
};