import express from "express";
import { getPagingUsersController , updateUserRoleController, getMyUserAccountController } from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getPagingUsersController);
router.get("/profile",authMiddleware, getMyUserAccountController) ;

router.patch("/:publicId",authMiddleware,adminMiddleware, updateUserRoleController ) ;

export default router;
