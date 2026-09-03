const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const { getReceiverSocketId, getIO } = require("../sockets/socket");
const fs = require("fs");


exports.sendMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;
        const senderId = req.user._id;

        const messageData = {
            sender: senderId,
            conversationId: chatId,
            text: content
        };

        // Handle an attached file (uploaded via multer -> temp disk -> Cloudinary)
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "chat-files",
                    resource_type: "auto",
                });

                const mime = req.file.mimetype || "";
                let fileType = "document";
                if (mime.startsWith("image/")) fileType = "image";
                else if (mime.startsWith("video/")) fileType = "video";
                else if (mime.startsWith("audio/")) fileType = "audio";
                else if (mime === "application/pdf") fileType = "pdf";

                messageData.file = {
                    public_id: result.public_id,
                    url: result.secure_url,
                    fileType,
                };
                messageData.messageType = "media";
            } finally {
                fs.unlink(req.file.path, () => {});
            }
        }

        const newMessage = await Message.create(messageData);

        const conversation = await Conversation.findById(chatId);
        const receiverId = conversation.participants.find(p => p.toString() !== senderId.toString());

        const fullMessage = await newMessage.populate("sender", "firstName lastName avatar");

        // --- EMIT HAPPENS HERE ONLY ---
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            getIO().to(receiverSocketId).emit("getMessage", fullMessage);
        }

        res.status(201).json(fullMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. GET ALL MESSAGES (With Instant Seen Sync)
exports.allMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ conversationId: chatId })
      .populate("sender", "firstName lastName avatar")
      .sort({ createdAt: 1 });

    // Mark as seen in DB
    await Message.updateMany(
      { conversationId: chatId, sender: { $ne: req.user._id }, seen: false },
      { $set: { seen: true } }
    );

    // Notify the other user that their messages were just seen
    const conversation = await Conversation.findById(chatId);
    const otherUserId = conversation.participants.find(p => p.toString() !== req.user._id.toString());
    const otherUserSocketId = getReceiverSocketId(otherUserId);
    
    if (otherUserSocketId) {
      getIO().to(otherUserSocketId).emit("messages-seen-sync", { chatId });
    }

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. EDIT MESSAGE
exports.editMessage = async (req, res) => {
  try {
    const { messageId, newContent } = req.body;
    const message = await Message.findById(messageId);

    if (!message || message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    message.text = newContent;
    message.isEdited = true;
    await message.save();

    const conversation = await Conversation.findById(message.conversationId);
    const receiverId = conversation.participants.find(p => p.toString() !== req.user._id.toString());
    const sid = getReceiverSocketId(receiverId);
    
    if (sid) getIO().to(sid).emit("messageUpdated", message);

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. DELETE MESSAGE
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message || message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    message.text = "This message was deleted";
    message.isDeleted = true;
    message.file = undefined;
    await message.save();

    const conversation = await Conversation.findById(message.conversationId);
    const receiverId = conversation.participants.find(p => p.toString() !== req.user._id.toString());
    const sid = getReceiverSocketId(receiverId);
    
    if (sid) getIO().to(sid).emit("messageDeleted", { messageId: req.params.id, chatId: message.conversationId });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};