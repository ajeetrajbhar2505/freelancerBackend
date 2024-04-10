const jwt = require('jsonwebtoken');
const User = require('../models/user');
const path = require('path');
const Token = require('../models/Token');


// Authorization function middleware
async function authorizeToken(req, res, next) {
    // Get the token from the request headers
    if (!req.headers.authorization) return res.status(401).sendFile(path.join(__dirname, '../public/html/index.html'));

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        // Token is missing
        return res.status(401).json({ status: 401, message: 'Invalid token' });
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the decoded token
        const userId = decodedToken.userId

        const existingUser = await User.findOne({ _id : userId });

        if (!existingUser) {
            // User not found
            return res.status(401).sendFile(path.join(__dirname, '../public/html/index.html'));
        }

        const tokenVerified = await Token.findOne({ otp: decodedToken.otp });

        if (!tokenVerified || !tokenVerified.verified) {
            // OTP not verified
            return res.status(210).json({ status: 401, message: 'OTP not verified' });
        }

        // Continue with the route handling
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            try {
                await Token.deleteOne({ userId: decodedToken.userId });
                return res.status(401).json({ status: 401, message: 'Token expired' });
            } catch (deleteError) {
                return res.status(401).json({ status: 401, message: 'Token expired' });
            }
        }
        res.status(500).json({ status: 500, message: 'Server error' });
    }
}


module.exports = authorizeToken;
