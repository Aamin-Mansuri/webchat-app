const User = require('../models/User');

const isBlocked = async (senderId, receiverId) => {
    // Find the receiver and check if the sender's ID is in their blockedUsers array
    const receiver = await User.findById(receiverId);
    if (!receiver) return false;
    
    return receiver.blockedUsers.includes(senderId);
};

module.exports = isBlocked;