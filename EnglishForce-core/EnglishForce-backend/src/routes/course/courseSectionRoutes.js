import express from "express";
import { authMiddleware, adminMiddleware } from "../../middleware/authorize.js";  
import {
    createCourseSectionController, getAllCourseSectionsController,
    getAllCourseSectionsByCourseIdController, getCourseSectionByIdController,
    deleteCourseSectionController, updateCourseSectionController
} from "../../controllers/course/courseSectionController.js";
import { uploadVideo } from "../../config/cloudinary.config.js";

const router = express.Router();


// Lấy tất cả course sections
router.get("/",authMiddleware, getAllCourseSectionsController);

// Lấy một course section theo ID
router.get("/:publicId",authMiddleware, getCourseSectionByIdController);

// Lấy tất cả sections theo course_id
router.get("/course/:course_public_id",authMiddleware, getAllCourseSectionsByCourseIdController);

// Tạo một course section mới
router.post("/",authMiddleware, adminMiddleware, uploadVideo.single('video'), createCourseSectionController);


// Xóa một course section theo ID
router.delete("/:publicId",authMiddleware, adminMiddleware, deleteCourseSectionController);

// Cập nhật course section theo sectionId
router.put("/:publicId", authMiddleware, adminMiddleware, uploadVideo.single('video'), updateCourseSectionController);

export default router;
