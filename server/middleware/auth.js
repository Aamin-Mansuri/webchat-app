const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @description Middleware to verify if the user is logged in via JWT stored in HttpOnly Cookies
 */
exports.isAuthenticated = async (req, res, next) => {
    try {
        // 1. Get token from cookies
        const { token } = req.cookies;

        // 2. If no token, user is not logged in
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Please login to access this resource." 
            });
        }

        // 3. Verify the JWT Token
        let decodedData;
        try {
            decodedData = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            // If token is invalid or expired, clear the cookie to stop error loops
            res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            });
            return res.status(401).json({ 
                success: false, 
                message: "Session expired. Please login again." 
            });
        }

        // 4. Find the user in the Database
        // We use .select("-password") for security
        req.user = await User.findById(decodedData.id);

        // 5. Handle "Ghost User" - Token exists but user was deleted from DB
        if (!req.user) {
            res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            });
            return res.status(401).json({ 
                success: false, 
                message: "User account no longer exists." 
            });
        }

        // 6. User is valid, move to the next controller
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error in Authentication." 
        });
    }
};
exports.isAdmin = (req, res, next) => {
    // Check if user exists (set by isAuthenticated) and has isAdmin property
    if (!req.user || req.user.isAdmin !== true) {
        return res.status(403).json({ 
            success: false, 
            message: `Role: ${req.user?.role || 'User'} is not allowed to access this resource.` 
        });
    }
    next();
};

exports.isVerified = (req, res, next) => {
    if (!req.user.isVerified) {
        return res.status(403).json({ 
            success: false, 
            message: "Please verify your email address to continue." 
        });
    }
    next();
};