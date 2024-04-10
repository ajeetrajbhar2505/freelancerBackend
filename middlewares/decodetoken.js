const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorModel = require('../models/errorSchema');


// Authorization function middleware
async function decodedToken(req, res, next) {

    const { token } = req.body

    if (!token) {
        // Token is missing
        return res.status(401).sendFile(path.join(__dirname, '../public/html/index.html'));
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ status: 200, data: decoded });

    } catch (err) {
        // Handle any errors
        const error = new ErrorModel({
            message: err.message,
            statusCode: err.statusCode,
            apiEndpoint: req.originalUrl,
        });
        await error.save();
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }

}


// Authorization function middleware
async function createToken(req, res, next) {
    const { text } = req.body;

    // // Check if all required token details are provided
    // if (!userId || !email || !dateTime || !otp) {
    //     return res.status(400).json({ status: 400, message: "Invalid token details" });
    // }

    try {
        const tokenData = { text };
        console.log(tokenData);
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '15m' });
        return res.status(200).json({ status: 200, data: token });
    } catch (err) {
        console.log(err);
        // Handle any errors
        console.error(err);
        const error = new ErrorModel({
            message: err.message,
            stack: err.stack,
            apiEndpoint: req.originalUrl,
            timestamp: new Date(),
        });
        await error.save();
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
}


module.exports = {
    createToken, decodedToken
}