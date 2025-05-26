import express, { Request, Response, NextFunction } from "express"
import { loginUser, refreshToken, verify, registerUser, logoutUser } from "../controllers/auth.controller"
import { asyncHandler } from "../utils/asyncHelper";

const router = express.Router()

router.post('/register', asyncHandler(registerUser));

router.post('/login', asyncHandler(loginUser))

router.get('/logout', logoutUser)

// experimental api
router.get('/verify-token', asyncHandler(verify))

router.get('/refresh-token', asyncHandler(refreshToken))

export default router