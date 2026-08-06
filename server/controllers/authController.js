const User = require('../models/User');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');

// Register User
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(), 
            password,
            otp,
            otpExpiry: Date.now() + 15 * 60 * 1000 
        });

        
        try {
            await sendEmail({
                email: user.email, 
                subject: "Your ChatApp Verification Code",
                message: `Hello ${firstName}, your OTP is: ${otp}. It expires in 15 minutes.`
            });

            res.status(201).json({ 
                success: true, 
                message: `OTP sent to ${user.email}` 
            });

        } catch (mailError) {
            
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ message: "Email failed to send. Check SMTP config." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, otp, otpExpiry: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save({ validateBeforeSave: false });
        
        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first" });

        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie('token', null, {
            expires: new Date(Date.now()), // Expire immediately
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 1. Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found with this email." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset OTP",
                message: `Your OTP for password reset is: ${otp}. Valid for 10 minutes.`
            });
            res.status(200).json({ success: true, message: "OTP sent to email" });
        } catch (err) {
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ message: "Email could not be sent" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email,
            otp,
            otpExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Update password (the pre-save hook in User model will hash this)
        user.password = newPassword;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};