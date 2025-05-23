import express, { Request, Response, NextFunction } from "express"
import { loginUser, registerUser } from "../controllers/auth.controller"
import { asyncHandler } from "../utils/asyncHelper";

const router = express.Router()

router.post('/register', asyncHandler(registerUser));

router.post('/login', asyncHandler(loginUser))

export default router