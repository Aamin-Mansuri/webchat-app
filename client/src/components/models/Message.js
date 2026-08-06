const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    file: { url: String, fileType: String },
    seen: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Message', messageSchema);