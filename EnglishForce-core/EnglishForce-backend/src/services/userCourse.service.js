import db from '../sequelize/models/index.js';
const { UserCourse, User, Course } = db;

// Tạo bản ghi mới cho bảng user_course
export const createUserCourse = async (userId, courseId) => {
  const uc = await UserCourse.create({ user_id: userId, course_id: courseId });
  return uc.get({ plain: true });
};

// Cập nhật đánh giá và bình luận
export const updateUserCourse = async (userId, courseId, rating, comment) => {
  const [count, [updated]] = await UserCourse.update(
    { rating, comment },
    {
      where: { user_id: userId, course_id: courseId },
      returning: true,
    }
  );
  return updated?.get({ plain: true }) || null;
};

// Đếm tổng số bản ghi user_course
export const getNumberOfEnrollments = async () => {
  const count = await UserCourse.count();
  return count;
};

// Lấy tất cả các khóa học của một user
export const getUserCoursesByUser = async (userId) => {
  const userCourses = await UserCourse.findAll({
    where: { user_id: userId },
    include: [{
      model: Course,
      attributes: ['public_id']
    }]
  });
  return userCourses.map(uc => uc.get({ plain: true }));
};

// Lấy đánh giá của 1 course
export const getRatingsByCourseId = async (courseId) => {
  const records = await UserCourse.findAll({
    where: { course_id: courseId },
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ],
    attributes: ['rating', 'comment']
  });

  return records.map(record => ({
    rating: record.rating,
    comment: record.comment,
    username: record.User?.username || null
  }));
};

// Tổng quan rating của 1 course
export const getOverviewRatingByCourseId = async (courseId) => {
  const records = await UserCourse.findAll({
    where: {
      course_id: courseId,
      rating: { [db.Sequelize.Op.not]: null }
    },
    attributes: [
      'course_id',
      [db.Sequelize.fn('ROUND', db.Sequelize.fn('AVG', db.Sequelize.col('rating')), 2), 'average_rating'],
      [db.Sequelize.fn('COUNT', db.Sequelize.col('rating')), 'total_rating']
    ],
    group: ['course_id'],
    raw: true
  });

  return records.length > 0 ? records[0] : null;
};

// Lấy bản ghi của user trong course cụ thể
export const getUserCourse = async (userId, courseId) => {
  const record = await UserCourse.findOne({
    where: { user_id: userId, course_id: courseId }
  });
  return record ? record.get({ plain: true }) : null;
};

// Xóa bản ghi user_course
export const deleteUserCourse = async (userId, courseId) => {
  const deleted = await UserCourse.destroy({
    where: { user_id: userId, course_id: courseId },
    returning: true // chỉ hiệu lực với Postgres
  });
  return deleted > 0;
};

// Thêm nhiều khóa học cho 1 user
export const addUserCourses = async (userId, courseIds) => {
  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    throw new Error('courseIds phải là một mảng chứa ít nhất một phần tử.');
  }

  const data = courseIds.map(courseId => ({ user_id: userId, course_id: courseId }));

  try {
    const result = await UserCourse.bulkCreate(data, { returning: true });
    return result.map(r => r.get({ plain: true }));
  } catch (error) {
    console.error('Lỗi khi thêm user_courses:', error);
    throw new Error('Không thể thêm user_courses.');
  }
};

// Lấy danh sách khóa học của user
export const getCoursesByUser = async (userId) => {
  const courses = await Course.findAll({
    include: [{
      model: UserCourse,
      where: { user_id: userId },
      attributes: []
    }]
  });

  return courses.map(c => c.get({ plain: true }));
};

// Kiểm tra xem user đã đăng ký khóa học chưa
export const checkUserCourseExists = async (userId, courseId) => {
  const exists = await UserCourse.findOne({
    where: { user_id: userId, course_id: courseId }
  });

  return !!exists;
};
