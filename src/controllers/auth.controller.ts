import User from "../models/user.model";
import bcrypt from "bcryptjs";

import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";

const registerUser = async (
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

        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: {
                name: user.name,
                email: user.email,
                token: generateToken(user._id.toString()),
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

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user ) {
        return res.status(401).json({success: false, message: "Invalid email " });
    }

    const isPasswordMatched = await bcrypt.compare(password, user?.password);
    if(!isPasswordMatched) {
        return res.status(401).json({success: false, message: "Invalid password" });
    }

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString()),
        },
    });

  }
 catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { registerUser,loginUser };
