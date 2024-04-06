const jwt = require('jsonwebtoken');
const User = require('../models/user');
const path = require('path');

// Authorization function middleware
async function authorizeToken(req, res, next) {
    // Get the token from the request headers
    if (!req.headers.authorization) return res.status(401).sendFile(path.join(__dirname, '../public/html/index.html'));
    
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        // Token is missing
        return res.status(401).sendFile(path.join(__dirname, '../public/html/index.html'));
    }

    try {
        // Verify the token
        const [ userId ] = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the decoded token
        const user = await User.findOne({ userId });

        if (!user) {
            // User not found
            return res.status(401).sendFile(path.join(__dirname, '../public/html/index.html'));
        }

        // Continue with the route handling
        next();
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            try {
                await Token.deleteOne({ userId });
                return res.status(401).json({ status: 401, message: 'Token expired' });
            } catch (deleteError) {
                return res.status(401).json({ status: 401, message: 'Token expired' });
            }
        }
        res.status(500).json({ status: 500, message: 'Server error' });
    }
}

module.exports = authorizeToken;
