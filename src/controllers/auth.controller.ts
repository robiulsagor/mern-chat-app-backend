import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";

export const registerUser = async (
    req: Request,
    res: Response
) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }

        const checkExists = await User.findOne({ email });
        if (checkExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists!",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

         const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        }).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }).status(201).json({
            success: true,
            message: "User registered successfully!",
            user: {
                name: user.name,
                email: user.email,
                token: generateAccessToken(user._id.toString()),
                bio: user.bio || "",
            },
        })
    }
    catch (error) {
        console.error("Error in registerController: ", error);

        res.status(500).json({
            success: false,
            message: "Server error. - "
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email " });
        }

        const isPasswordMatched = await bcrypt.compare(password, user?.password);
        if (!isPasswordMatched) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        }).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }).status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                name: user.name,
                email: user.email,
                token: accessToken,
                bio: user.bio || "",
            },
        });

    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const verify = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized, No token found!" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized, Invalid token!" });
        }

        const user = await User.findById(decoded?.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized, User not found!" });
        }

        res.status(200).json({ success: true, message: "Yes, Valid token found!" , user})
    }
    catch (error) {
        console.error("Error in verifyController: ", error);
        res.status(500).json({ success: false, message: `Error: ${error}` });
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized, No token found!" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as jwt.JwtPayload;

    if (!decoded) {
        return res.status(401).json({ success: false, message: "Unauthorized, Invalid token!" });
    }

    const user = await User.findById(decoded?.userId);
    if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized, User not found!," });
    }

    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge:  60 * 60 * 1000, // 1 hour
    }).cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }).status(200).json({
        success: true,
        message: "Token refreshed successfully",
        token: newAccessToken
    });
}

export const logoutUser = async (req: Request, res: Response) => {
    res.cookie("accessToken", "").cookie("refreshToken", "").status(200).json({
            success: true,
            message: "User logged user",
        });
}