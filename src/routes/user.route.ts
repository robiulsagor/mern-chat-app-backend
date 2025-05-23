import express from "express"
import { authMiddleware } from "../middlewares/auth";
import { updateProfile } from "../controllers/user.controller";

const router = express.Router()

router.patch('/update-profile', authMiddleware, updateProfile)
// router.get('/')

export default router