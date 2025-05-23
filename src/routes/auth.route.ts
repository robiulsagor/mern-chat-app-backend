import express, { Request, Response, NextFunction } from "express"
import { loginUser, refreshToken, registerUser } from "../controllers/auth.controller"
import { asyncHandler } from "../utils/asyncHelper";

const router = express.Router()

router.post('/register', asyncHandler(registerUser));

router.post('/login', asyncHandler(loginUser))

router.get('/refresh', asyncHandler(refreshToken))

// experimental api
// router.get('/verify-token', asyncHandler(verify))

router.get('/refresh-token', asyncHandler(refreshToken))

export default router