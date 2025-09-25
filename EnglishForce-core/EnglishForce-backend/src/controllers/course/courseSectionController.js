import * as courseSectionService from "../../services/courseSection.service.js"
import * as courseService from "../../services/course.service.js"

// Tạo course section mới
export async function createCourseSectionController(req, res) {
    try {
      const { name, course_public_id, video_link, order_index, description } = req.body;
      const course_id = await courseService.findCourseIdByPublicId(course_public_id) ;
      if (!name || !course_id || order_index === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const videoFile = req.file; // nếu có upload
      const section = await courseSectionService.create(
        name, course_id, order_index, description, video_link, videoFile
      );
  
      return res.status(201).json(section);
    } catch (error) {
      console.error("❌ Error creating section:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

// Lấy tất cả course sections
export async function getAllCourseSectionsController(req, res) {
    try {
        const sections = await courseSectionService.getAll();
        return res.json(sections);
    } catch (error) {
        console.error("❌ Error fetching sections:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Lấy tất cả sections theo course_public_id
export async function getAllCourseSectionsByCourseIdController(req, res) {
    try {
        const { course_public_id } = req.params;

        if (!course_public_id) {
            return res.status(400).json({ message: "Missing course_public_id parameter" });
        }

        const sections = await courseSectionService.getAllByCoursePublicId(course_public_id);
        return res.json(sections);
    } catch (error) {
        console.error("❌ Error fetching sections by course_public_id:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Lấy course section theo ID
export async function getCourseSectionByIdController(req, res) {
    try {
        const { publicId } = req.params;
        const id = await courseSectionService.findCourseSectionIdByPublicId(publicId) ;
        const section = await courseSectionService.getById(id);

        if (!section) {
            return res.status(404).json({ message: "Course section not found" });
        }

        return res.json(section);
    } catch (error) {
        console.error("❌ Error fetching section:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Xóa course section
export async function deleteCourseSectionController(req, res) {
    try {
        const { publicId } = req.params;
        const id = await courseSectionService.findCourseSectionIdByPublicId(publicId);
        const deleted = await courseSectionService.deleteSection(id);

        if (!deleted) {
            return res.status(404).json({ message: "Course section not found" });
        }

        return res.json({ message: "Course section deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting section:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const updateCourseSectionController = async (req, res) => {
    const { publicId } = req.params;
    const id = await courseSectionService.findCourseSectionIdByPublicId(publicId);
  
    try {
      const updatedSection = await courseSectionService.updateCourseSection(
        id,
        req.body,
        req.file // file video nếu có upload
      );
  
      if (!updatedSection) {
        return res.status(404).json({ message: "Course section not found" });
      }
  
      res.status(200).json(updatedSection);
    } catch (error) {
      console.error("Error updating course section:", error);
      res.status(500).json({ message: "Error updating course section" });
    }
  };