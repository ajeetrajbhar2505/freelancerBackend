// roomController.js
const Room = require('../models/room');
const ErrorModel = require('../models/errorSchema');

// Controller function to create a new room
exports.createRoom = async (req, res) => {
    try {
        // Generate a UUID for the room
        const roomId = generateUUID();
        const { users } = req.body;

        // Create a new room instance
        const newRoom = new Room({ roomId, users });

        // Save the room to the database
        await newRoom.save();

        // Respond with success message and the new room data
        res.status(201).json({status: 201, message: 'Room created successfully', room: newRoom });
    } catch (err) {
         // Handle any errors
         const error = new ErrorModel({
            message: err.message,
            statusCode: err.statusCode,
            apiEndpoint: req.originalUrl,
        });
        await error.save();
        res.status(500).json({status: 500, message: 'Server error' });
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
