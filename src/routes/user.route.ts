import express from "express"
import { authMiddleware } from "../middlewares/auth";
import { getAllUsers, updateProfile } from "../controllers/user.controller";
import upload from "../utils/multer";
import { asyncHandler } from "../utils/asyncHelper";

const router = express.Router()

router.get('/get-users', authMiddleware, asyncHandler(getAllUsers))

router.put('/update-profile', authMiddleware, upload.single('image'), asyncHandler(updateProfile))

export default router