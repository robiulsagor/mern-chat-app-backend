import express from "express"
import { authMiddleware } from "../middlewares/auth";
import { updateProfile } from "../controllers/user.controller";
import upload from "../utils/multer";
import { asyncHandler } from "../utils/asyncHelper";

const router = express.Router()

router.put('/update-profile', authMiddleware, upload.single('image'), asyncHandler(updateProfile))

export default router