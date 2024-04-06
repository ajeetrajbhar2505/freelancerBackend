// userController.js
const User = require('../models/user');
const Token = require('../models/Token');
const ErrorModel = require('../models/errorSchema');
const { generateToken, verifyToken } = require('..//controllers/tokenController'); // Assuming emailService.js is the file where the functions are implemented
const path = require('path');


// Controller function to create a new user
exports.createUser = async (req, res) => {
    try {
        // Extract user data from the request body
        const { username, password, email } = req.body;

        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(210).json({ status: 300, message: 'Username or email already exists' });
        }

        // Create a new user instance
        const newUser = new User({ username, password, email });

        // Save the user to the database
        await newUser.save();

        // Generate token and respond with success message and token
        generateToken({ userId: newUser._id.toString(), email: newUser.email, dateTime: new Date() }, async (err, token) => {
            if (err) {
                // Handle any errors
                const error = new ErrorModel({
                    message: err.message,
                    statusCode: err.statusCode,
                    apiEndpoint: req.originalUrl,
                });
                await error.save();
                return res.status(500).json({ status: 500, message: "Failed to generate token" });
            }
            res.status(201).json({ status: 201, message: 'User created successfully', token });
        });
    } catch (err) {
        // Handle any errors
        console.error(err);
        const error = new ErrorModel({
            message: err.message,
            statusCode: err.statusCode,
            apiEndpoint: req.originalUrl,
        });
        await error.save();
        res.status(500).json({ status: 500, message: 'Server error' });
    }
};




exports.authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ $or: [{ username: email, password: password }, { email: email, password: password }] });

        if (user) {
            if (!user.email_verified) {
                return res.status(201).json({ status: 201, message: "Please verify your email" });
            }

            generateToken({ userId: user._id.toString(), email: user.email, dateTime: new Date() }, function (err, token) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ status: 500, message: "Failed to generate token" });
                }
                return res.status(200).json({ status: 200, message: "OTP sent successfully", token: token });
            });
        } else {
            return res.status(210).json({ status: 300, message: "Credentials are incorrect" });
        }
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
};


// Controller function to create a new user
exports.getOTP = async (req, res) => {
    try {

        const { email } = req.body;
        const user = await User.findOne({ $or: [{ username: email }, { email: email }] });

        if (user) {
            if (!user.email_verified) {
                return res.status(201).json({ status: 201, message: "Please verify your email" });
            }

            generateToken({ userId: user._id.toString(), email: user.email, dateTime: new Date() }, function (err, token) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ status: 500, message: "Failed to generate token" });
                }
                return res.status(200).json({ status: 200, message: "OTP sent successfully", token: token });
            });
        } else {
            return res.status(210).json({ status: 300, message: "User does not exists" });
        }
    } catch (err) {
        // Handle any errors
        console.error(err);
        const error = new ErrorModel({
            message: err.message,
            statusCode: err.statusCode,
            apiEndpoint: req.originalUrl,
        });
        await error.save();
        res.status(500).json({ status: 500, message: 'Server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {

        if (!req.headers.authorization) return res.status(401).sendFile(path.join(__dirname, '../public/html/index.html'));

        const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the format "Bearer token"
        const { userId } = await verifyToken(token);

        const tokenData = await Token.findOne({ userId }).sort({ dateTime: -1 });

        if (!tokenData) {
            return res.status(401).sendFile(path.join(__dirname, '../public/html/index.html'));
        }

        const otp = tokenData.otp;
        const { otp: enteredOtp } = req.body;

        if (otp != enteredOtp) {
            return res.status(210).json({ status: 300, message: 'Invalid OTP' });
        }

        // Update the token document to mark it as verified
        const isEmailverfyurl = req.originalUrl == '/api/users/verify-email' ? true : false
        if (isEmailverfyurl) {
            await User.findByIdAndUpdate(tokenData.userId, { email_verified: true });
        }
        else {
            await Token.findByIdAndUpdate(tokenData._id, { verified: true });
        }

        return res.status(200).json({ status: 200, message: 'OTP verified successfully' });
    } catch (err) {
        // Handle any errors
        const error = new ErrorModel({
            message: err.message,
            statusCode: err.statusCode,
            apiEndpoint: req.originalUrl,
        });
        await error.save();
        if (err.name === 'TokenExpiredError') {
            try {
                // Attempt to delete the token document
                await Token.deleteOne({ otp: req.body.otp });
                return res.status(401).json({ status: 401, message: 'Token expired' });
            } catch (deleteError) {
                // If deleting the token fails, still return a response indicating token expiration
                return res.status(401).json({ status: 401, message: 'Token expired' });
            }
        }
        // Other errors are considered server errors
        res.status(500).json({ status: 500, message: 'Server error' });
    }
};


exports.resetPassword = async (req, res) => {
    try {

        if (!req.headers.authorization) return res.status(401).sendFile(path.join(__dirname, '../public/html/index.html'));

        const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the format "Bearer token"
        const { userId } = await verifyToken(token);

        const tokenData = await Token.findOne({ userId }).sort({ dateTime: -1 });

        if (!tokenData) {
            return res.status(401).sendFile(path.join(__dirname, '../public/html/index.html'));
        }

        const { password } = req.body
        try {
            const userData = await User.findOne({ userId,password }).sort({ dateTime: -1 });
            if (userData) {
                return res.status(210).json({ status: 300, message: 'Password already exists' });
            }
            await User.findByIdAndUpdate(tokenData.userId, { password: password });
            return res.status(200).json({ status: 200, message: 'Password updated successfully' });

        } catch (error) {
            return res.status(500).json({ status: 500, message: 'Failed to update password' });
        }

    } catch (err) {
        // Handle any errors
        const error = new ErrorModel({
            message: err.message,
            statusCode: err.statusCode,
            apiEndpoint: req.originalUrl,
        });
        await error.save();
        if (err.name === 'TokenExpiredError') {
            try {
                // Attempt to delete the token document
                await Token.deleteOne({ otp: req.body.otp });
                return res.status(401).json({ status: 401, message: 'Token expired' });
            } catch (deleteError) {
                // If deleting the token fails, still return a response indicating token expiration
                return res.status(401).json({ status: 401, message: 'Token expired' });
            }
        }
        // Other errors are considered server errors
        res.status(500).json({ status: 500, message: 'Server error' });
    }
};
