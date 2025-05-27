import { Request, Response } from "express";
import Message from "../models/message.model";

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.userId;

        if (!receiverId || !content) {
            return res.status(400).json({ message: "Receiver and content are required." });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            content
        })

        res.status(201).json({
            success: true,
            message: "Message sent successfully!",
            newMessage
        });
    } catch (error) {
        // console.log("Error sending message:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send message.",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export const getMessages = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.userId;
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId },
            ],
        }).sort({ timestamp: 1 });

        res.status(200).json({
            success: true,
            messages,
        });
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages.",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export const markAsSeen = async (req: Request, res: Response) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.messageId,
            { seen: true },
            { new: true }
        );

        if (!message) return res.status(404).json({ message: "Message not found." });

        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({ message: "Failed to mark as seen." });
    }
}