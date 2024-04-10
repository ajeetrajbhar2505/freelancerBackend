// roomController.js
const Room = require('../models/room');
const ErrorModel = require('../models/errorSchema');
const path = require('path')
const { verifyToken } = require('..//controllers/tokenController'); // Assuming emailService.js is the file where the functions are implemented

// Controller function to create a new room
exports.createRoom = async (req, res) => {
    try {
        // Check if authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).sendFile(path.join(__dirname, '../public/html/index.html'));
        }

        // Extract token from authorization header
        const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the format "Bearer token"

        // Verify token and get userId
        const { userId } = await verifyToken(token);

        // Extract receiverId from request body
        const { receiverId } = req.body;

        // Check if room already exists for the user
        const existingRoom = await Room.findOne({ users: userId });

        // If room already exists, update the receiver id in existing users array
        if (existingRoom) {
            const updatedRoom = await Room.findOneAndUpdate(
                { _id: existingRoom._id },
                { $addToSet: { users: receiverId } },
                { new: true }
            );
            return res.status(200).json({ status: 200, message: 'User added successfully' });
        }

        // Else, create a new room instance
        const newRoom = new Room({ users: [userId.toString(), receiverId.toString()] });

        // Save the room to the database
        await newRoom.save();

        // Respond with success message and the new room data
        res.status(201).json({ status: 201, message: 'User added successfully' });
    } catch (err) {
        // Handle any errors
        console.error(err);
        const error = new ErrorModel({
            message: err.message,
            stack: err.stack,
            apiEndpoint: req.originalUrl,
            timestamp: new Date(),
        });
        await error.save();
        res.status(500).json({ status: 500, message: 'Server error' });
    }
};


// Function to generate a UUID (for demonstration purposes)
function generateUUID() {
    // Generate a random UUID (not a secure method)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
