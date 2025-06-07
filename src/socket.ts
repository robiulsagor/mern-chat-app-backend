import { Server } from "socket.io";

let io;
const onlineUsers = new Map();

export const initSocket = server => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
        }
    })

    io.on("connection", (socket) => {
        console.log("New client connected: ", socket.id);

        socket.on("setup", (userId: string) => {
            console.log("📨 Setup called by:", userId);
            socket.userId = userId;
            onlineUsers.set(userId, socket.id);

            socket.emit("onlineUsers", Array.from(onlineUsers.keys()));

            socket.broadcast.emit("userOnline", userId)
        })

        socket.on("sendMessage", (message) => {
            const reveiverSocketId = onlineUsers.get(message.receiverId);
            if (reveiverSocketId) {
                io.to(reveiverSocketId).emit("newMessage", message);
            }
        })

        socket.on("disconnect", () => {
            console.log("Client disconnected: ", socket.id);
            onlineUsers.delete(socket.userId);
            socket.broadcast.emit("userOffline", socket.userId);
        })

    })
}

export const getIo = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};
