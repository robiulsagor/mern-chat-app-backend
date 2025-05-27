import express from "express"
import { getMessages, markAsSeen, sendMessage } from "../controllers/message.controller"
import { asyncHandler } from "../utils/asyncHelper"
import { authMiddleware } from "../middlewares/auth"

const router = express.Router()

router.post('/send', authMiddleware, asyncHandler(sendMessage))
router.get('/:userId', authMiddleware, asyncHandler(getMessages))
router.patch('/seen/:messageId', authMiddleware, asyncHandler(markAsSeen))

export default router