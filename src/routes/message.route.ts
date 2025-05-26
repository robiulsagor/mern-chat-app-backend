import express from "express"
import { sendMessage } from "../controllers/message.controller"
import { asyncHandler } from "../utils/asyncHelper"
import { authMiddleware } from "../middlewares/auth"

const router = express.Router()

router.post('/send', authMiddleware, asyncHandler(sendMessage))

export default router