import express from "express";
import { getCoursesController, getCourseByPublicIdController, updateCourseController, addCourseController, deleteCourseController, getCoursesBySearch, getTopRatedCoursesController } from "../../controllers/course/courseController.js";
import { authMiddleware, adminMiddleware, authMiddlewareWithoutError } from "../../middleware/authorize.js";
import { uploadImage, uploadVideo } from "../../config/cloudinary.config.js";

const router = express.Router();



// Search khóa học
router.get("/search", getCoursesBySearch);

router.get('/top-rated', getTopRatedCoursesController);

router.get("/", authMiddlewareWithoutError, getCoursesController);
// Lấy thông tin khóa học theo ID
router.get("/:publicId", authMiddleware, getCourseByPublicIdController);

// Cập nhật thông tin khóa học
router.put("/:publicId", authMiddleware, adminMiddleware, uploadImage.single('thumbnail'), updateCourseController);


// Thêm khóa học mới
router.post("/", authMiddleware, adminMiddleware, uploadImage.single('thumbnail'), addCourseController);

// Xóa khóa học
router.delete("/:publicId", authMiddleware, adminMiddleware, deleteCourseController);


export default router;