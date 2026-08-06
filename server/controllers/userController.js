const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

// Get User Profile
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password"); 
    res.status(200).json({ success: true, user });
};
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, about } = req.body;
        const updateData = {};

        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (about) updateData.about = about;

        // CHECK IF FILE EXISTS (from Multer)
        if (req.file) {
            // 1. Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });

            // 2. Add avatar data to update object
            updateData.avatar = {
                public_id: result.public_id,
                url: result.secure_url, // Use secure_url for HTTPS
            };

            // 3. Delete the local temp file saved by Multer
            fs.unlinkSync(req.file.path);
        }

        // 4. Update the user in DB
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true } // This returns the modified document
        ).select("-password");

        res.status(200).json({
            success: true,
            user: updatedUser, // CRITICAL: Send this back
        });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message });
    }
};

exports.removeAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // 1. Check if user has a custom avatar (if it has a public_id)
        if (user.avatar && user.avatar.public_id) {
            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        // 2. Reset to default values
        user.avatar = {
            public_id: null,
            url: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' // Default placeholder
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile photo removed",
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.handleBlockUser = async (req, res) => {
    try {
        const targetId = req.params.id;
        const user = await User.findById(req.user._id);

        if (user.blockedUsers.includes(targetId)) {
            user.blockedUsers.pull(targetId); // Unblock
        } else {
            user.blockedUsers.push(targetId); // Block
        }
        
        await user.save();
        res.status(200).json({ success: true, blockedUsers: user.blockedUsers });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// Search Users
exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.search;
        
        if (!query) {
            return res.status(200).json({ success: true, users: [] });
        }

        // Search in firstName, lastName, or email
        const users = await User.find({
            $and: [
                {
                    $or: [
                        { firstName: { $regex: query, $options: "i" } },
                        { lastName: { $regex: query, $options: "i" } },
                        { email: { $regex: query, $options: "i" } },
                    ]
                },
                { _id: { $ne: req.user._id } } // Exclude the logged-in user (yourself)
            ]
        }).select("firstName lastName email avatar status");

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Search Controller Error:", error);
        res.status(500).json({ message: "Server error during search" });
    }
};

// Block/Unblock User
exports.blockUser = async (req, res) => {
    const user = await User.findById(req.user.id);
    const targetId = req.params.id;

    if (user.blockedUsers.includes(targetId)) {
        user.blockedUsers.pull(targetId);
    } else {
        user.blockedUsers.push(targetId);
    }
    await user.save();
    res.status(200).json({ success: true, message: "User status updated" });
};