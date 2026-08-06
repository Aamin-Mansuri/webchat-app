const Conversation = require('../models/Conversation');

// Check that this is named EXACTLY 'accessChat'
exports.accessChat = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "UserId param not sent with request" });
        }

        let isChat = await Conversation.find({
            isGroupChat: false,
            $and: [
                { participants: { $elemMatch: { $eq: req.user._id } } },
                { participants: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("participants", "-password")
            .populate("lastMessage");

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            const chatData = {
                groupName: "sender",
                isGroupChat: false,
                participants: [req.user._id, userId],
            };

            const createdChat = await Conversation.create(chatData);
            const fullChat = await Conversation.findOne({ _id: createdChat._id }).populate(
                "participants",
                "-password"
            );
            res.status(200).json(fullChat);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check that this is named EXACTLY 'fetchChats'
exports.fetchChats = async (req, res) => {
    try {
        const results = await Conversation.find({
            participants: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("participants", "-password")
            .populate("groupAdmin", "-password")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        res.status(200).send(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};