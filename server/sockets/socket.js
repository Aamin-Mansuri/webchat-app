const socketIO = require("socket.io");
const User = require("../models/User");
const Message = require('../models/Message');

let io;
const userSocketMap = {}; 

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim());

const socketHandler = (server) => {
    io = socketIO(server, {
        cors: { origin: allowedOrigins, credentials: true },
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        // --- SEEN LOGIC ---
        socket.on("mark-as-seen", async ({ chatId, senderId }) => {
            try {
                await Message.updateMany(
                    { conversationId: chatId, sender: senderId, seen: false },
                    { $set: { seen: true } }
                );
                const senderSid = userSocketMap[senderId];
                if (senderSid) io.to(senderSid).emit("messages-seen-sync", { chatId });
            } catch (err) { console.error(err); }
        });

        // --- TYPING & CALLING LOGIC ---
        socket.on("typing", ({ receiverId }) => {
            const sid = userSocketMap[receiverId];
            if (sid) io.to(sid).emit("displayTyping", userId);
        });

        socket.on("stopTyping", ({ receiverId }) => {
            const sid = userSocketMap[receiverId];
            if (sid) io.to(sid).emit("hideTyping");
        });

        // NOTE: Redundant "sendMessage" listener REMOVED to prevent double messages

        socket.on("disconnect", () => {
            if (userId) {
                delete userSocketMap[userId];
                io.emit("getOnlineUsers", Object.keys(userSocketMap));
            }
        });
    });
};

module.exports = { socketHandler, getReceiverSocketId: (id) => userSocketMap[id], getIO: () => io };