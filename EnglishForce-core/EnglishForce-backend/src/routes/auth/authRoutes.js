import express from "express";
import { register, login, changePassword, refreshToken } from "../../controllers/authController.js"
import { authMiddleware } from "../../middleware/authorize.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/change-password",authMiddleware, changePassword) ;
router.post("/refresh-token", refreshToken);

export default router;
