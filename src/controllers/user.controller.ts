import { Request, Response } from "express";
import User from "../models/user.model";

export const getUser = async (req: Request, res: Response)=> {

}


export const updateProfile = async (req: Request, res: Response)=> {
    try {
        const user = await User.findOneAndUpdate({_id: req.userId}, req.body, {
            new: true
        })

        res.status(200).json({
            success: true,
            message: "User data updated!",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error || "Something went wrong!"
        })
    }
}