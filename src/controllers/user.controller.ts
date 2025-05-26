import { Request, Response } from "express";
import User from "../models/user.model";
import cloudinary from "../utils/cloudinary";

export const getUser = async (req: Request, res: Response) => { };

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { bio } = req.body;
        const userId = req.userId;

        let profilePictureUrl;

        if (req.file) {
            const result = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "chat-app",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                stream.end(req.file!.buffer);
            })
            profilePictureUrl = result.secure_url;
        }

        const updatedFields: any = {
            bio
        }

        if (profilePictureUrl) {
            updatedFields.profilePicture = profilePictureUrl;
        }

        console.log("Updating user with fields:", updatedFields);


        const user = await User.findOneAndUpdate({ _id: req.userId }, {
            $set: updatedFields
        }, { new: true, runValidators: true })
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }


        res.status(200).json({
            success: true,
            message: "User data updated!",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error || "Something went wrong!",
        });
    }
};
