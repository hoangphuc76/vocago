import db from '../sequelize/models/index.js';
const { CourseSection, Course } = db;
import { deleteCloudinaryFile } from '../config/cloudinary.config.js';


export const findCourseSectionIdByPublicId = async (publicId) => {
  const courseSection = await CourseSection.findOne({ where: { public_id: publicId } });
  if (!courseSection) throw new Error('Course not found with that public_id');
  return courseSection.id ;
}

// Tạo section mới
export async function create(name, course_id, order_index, description, video_link, videoFile) {
  let finalVideoLink = video_link || null;
  let videoPublicId = null;

  if (videoFile) {
    finalVideoLink = videoFile.path; // Cloudinary video URL
    videoPublicId = videoFile.filename; // Cloudinary public_id
  }

  const section = await CourseSection.create({
    name,
    course_id,
    order_index,
    description,
    video_link: finalVideoLink,
    video_public_id: videoPublicId
  });

  return section.get({ plain: true });
}

// Lấy tất cả section (theo thứ tự)
export async function getAll() {
  const sections = await CourseSection.findAll({
    order: [['order_index', 'ASC']]
  });
  return sections.map(s => s.get({ plain: true }));
}

// Lấy section theo course:publicId
export async function getAllByCoursePublicId(course_public_id) {
  const course = await Course.findByPublicId(course_public_id) ;
  const course_id = course.id;
  const sections = await CourseSection.findAll({
    where: { course_id },
    order: [['order_index', 'ASC']]
  });
  return sections.map(s => s.get({ plain: true }));
}

// Lấy section theo id
export async function getById(id) {
  const section = await CourseSection.findByPk(id);
  return section ? section.get({ plain: true }) : null;
}

// Xóa section theo id
export async function deleteSection(id) {
  // Delete video in Cloudinary
  const section = await CourseSection.findByPk(id);
  if (!section) return false;
  if (section.video_public_id) {
    try {
      await deleteCloudinaryFile(section.video_public_id, 'video');
    } catch (err) {
      console.error('Failed to delete video from Cloudinary:', err);
    }
  }

  // Delete Course Section in Database
  const deletedCount = await CourseSection.destroy({
    where: { id }
  });
  return deletedCount > 0;
}

// Xóa tất cả section của 1 course
export async function deleteSectionsByCourseId(course_id) {
  // Delete video in Cloudinary
  const sections = await CourseSection.findAll({ where: { course_id } });
  for (const section of sections) {
    if (section.video_public_id) {
      try {
        await deleteCloudinaryFile(section.video_public_id, 'video');
      } catch (err) {
        console.error(`❌ Failed to delete Cloudinary video for section ${JSON.stringify(section)}:`, err);
      }
    }
  }

  // Delete Course Section in Database
  const deleted = await CourseSection.destroy({
    where: { course_id },
    returning: true
  });
  return deleted; 
}

// Cập nhật section
export const updateCourseSection = async (id, data, file) => {
  const section = await CourseSection.findByPk(id);
  if (!section) return null;

  const updates = {
    name: data.name,
    description: data.description,
    order_index: data.order_index,
  };

  if (file) {
    // Nếu upload file mới → xóa video cũ
    if (section.video_public_id) {
      try {
        await deleteCloudinaryFile(section.video_public_id, 'video');
      } catch (err) {
        console.error('Failed to delete old video from Cloudinary:', err);
      }
    }

    updates.video_link = file.path;
    updates.video_public_id = file.filename; // multer-storage-cloudinary
  } else if (data.video_link && data.video_link !== section.video_link) {
    // Nếu chọn video link mới → xóa video cũ
    if (section.video_public_id) {
      try {
        await deleteCloudinaryFile(section.video_public_id, 'video');
      } catch (err) {
        console.error('Failed to delete old video from Cloudinary:', err);
      }
    }

    updates.video_link = data.video_link;
    updates.video_public_id = null;
  }

  const [count, [updated]] = await CourseSection.update(updates, {
    where: { id },
    returning: true,
  });

  return updated?.get({ plain: true }) || null;
};
