const jwt = require('jsonwebtoken');
const sendToken = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    const isProduction = process.env.NODE_ENV === "production";

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // In production the client and server are almost always on different
        // domains (e.g. vercel.app + onrender.com), which requires
        // SameSite=None + Secure for the browser to send the cookie back.
        // Locally, both run on http://localhost so Lax/insecure is required instead.
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token
    });
};

module.exports = sendToken;
