import * as userCourseService from "../../services/userCourse.service.js"
import * as courseService from "../../services/course.service.js"
import * as userService from "../../services/user.service.js"
import * as programService from "../../services/program/program.service.js"
import * as examService from "../../services/exam/exam.service.js"
import * as examAttemptService from "../../services/exam/examAttempt.service.js"



// Tạo mới bản ghi user_course
export const createUserCourseController = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'Missing userId or courseId' });
    }

    // Kiểm tra xem user đã đăng ký khóa học này chưa
    const existing = await userCourseService.getUserCourse(userId, courseId);
    if (existing) {
      return res.status(400).json({ error: 'User already enrolled in this course.' });
    }

    const userCourse = await userCourseService.createUserCourse(userId, courseId);
    res.status(201).json(userCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


export const createUserCoursesFromCartController = async (req, res) => {
  try {
    const { courseIds } = req.body;
    const userId = req.user.id;
    if (!userId || !Array.isArray(courseIds)) {
      return res.status(400).json({ error: 'Missing userId or courseIds array' });
    }

    const results = [];
    for (const courseId of courseIds) {
      // Kiểm tra xem user đã đăng ký khóa học này chưa
      const existing = await userCourseService.getUserCourse(userId, courseId);
      if (existing) {
        results.push({ courseId, status: 'already enrolled' });
      } else {
        const newRecord = await userCourseService.createUserCourse(userId, courseId);
        results.push({ courseId, status: 'enrolled', record: newRecord });
      }
    }
    return res.status(201).json({ results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// User review 
export const updateUserCourseRatingController = async (req, res) => { // PATCH METHOD
  try {
    var { coursePublicId, rating, comment } = req.body;
    var courseId = await courseService.findCourseIdByPublicId(coursePublicId);
    if (!comment) comment = null
    if (!rating) rating = null

    const userId = req.user.id;
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'Missing userId or courseId' });
    }
    const userCourse = await userCourseService.updateUserCourse(userId, courseId, rating, comment);

    return res.status(200).json({ userCourse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}



// Lấy danh sách các User_Course của một user
export const getUserCoursesController = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    const userCourses = await userCourseService.getUserCoursesByUser(userId);
    res.status(200).json(userCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa bản ghi user_course (hủy đăng ký khóa học)
export const deleteUserCourseController = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'Missing userId or courseId' });
    }
    const deleted = await userCourseService.deleteUserCourse(userId, courseId);
    if (!deleted) {
      return res.status(404).json({ error: 'Record not found.' });
    }
    res.status(200).json(deleted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//
// Các hàm liên quan đến 2 bảng Users , Courses
//

// Lấy danh sách các khóa học của một user
export const getCoursesController = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    var userCourses = await userCourseService.getCoursesByUser(userId);
    res.status(200).json(userCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getCourseOverviewController = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const { coursePublicId } = req.params;
    const courseId = await courseService.findCourseIdByPublicId(coursePublicId);
    if (!courseId) {
      return res.status(400).json({ error: 'Missing CourseId' });
    }

    var course = await courseService.getCourseById(courseId);
    var owned = null;
    const reviews = await userCourseService.getRatingsByCourseId(courseId);
    var overview = await userCourseService.getOverviewRatingByCourseId(courseId);
    if (userId) owned = await userCourseService.checkUserCourseExists(userId, courseId);

    if (!overview) overview = {
      "courseid": courseId,
      "average_rating": null,
      "total_rating": 0
    }

    var userCourse = null;
    if (owned) userCourse = await userCourseService.getUserCourse(userId, courseId);
    return res.status(200).json({
      course,
      owned,
      reviews,
      overview,
      userCourse,
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


export const getStatisticsController = async (req, res) => {
  try {
    const totalUsers = await userService.getNumberOfUsers();
    const totalCourses = await courseService.getNumberOfCourses();
    const totalEnrollments = await userCourseService.getNumberOfEnrollments();

    const totalPrograms = await programService.getNumberOfPrograms();
    const totalExams = await examService.getNumberOfExams();
    const totalExamAttempts = await examAttemptService.getNumberOfExamAttempts();

    return res.status(200).json({
      totalCourses,
      totalEnrollments,
      totalUsers,
      totalPrograms,
      totalExams,
      totalExamAttempts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}