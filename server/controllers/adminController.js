const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// 1. Get Overall Stats
exports.getDashboardStats = async (req, res) => {
    try {
        // Run queries in parallel for maximum speed
        const [totalUsers, totalMessages, totalGroups, onlineUsers] = await Promise.all([
            User.countDocuments(),
            Message.countDocuments(),
            Conversation.countDocuments({ isGroupChat: true }),
            User.countDocuments({ status: 'Online' })
        ]);

        res.status(200).json({
            success: true,
            stats: { totalUsers, totalMessages, totalGroups, onlineUsers }
        });
    } catch (err) {
        res.status(500).json({ message: "Analytics fetch failed" });
    }
};

// 2. Get All Users for Management
exports.getAllUsersAdmin = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Delete/Wipe User
exports.deleteUserAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isAdmin) return res.status(403).json({ message: "Cannot delete an administrator" });

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "User account deleted from system" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};