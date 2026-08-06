const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isGroupChat: { type: Boolean, default: false },
    groupName: String,
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    groupIcon: {
        public_id: String,
        url: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/166/166258.png' }
    },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    unreadCounts: { type: Map, of: Number, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);