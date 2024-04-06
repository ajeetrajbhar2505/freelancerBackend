// chatSocket.js
const Message = require('../models/message');
const Room = require('../models/room');

// Socket logic for real-time messaging with rooms
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Load all rooms when a user connects
        Room.find({}, (err, rooms) => {
            if (err) {
                console.error(err);
                return;
            }
            socket.emit('rooms', rooms); // Emit rooms to the connecting client
        });

        // Listen for 'joinRoom' event
        socket.on('joinRoom', (room) => {
            socket.join(room); // Join the specified room
            console.log(`User joined room: ${room}`);
        });

        // Listen for 'message' event
        socket.on('message', async (data) => {
            try {
                // Extract message data from the received data
                const { sender, receiver, messageText, room } = data;

                // Create a new message instance
                const newMessage = new Message({ sender, receiver, messageText });

                // Save the message to the database
                await newMessage.save();

                // Emit the message to all clients in the specified room
                io.to(room).emit('message', newMessage);
            } catch (err) {
                console.error(err);
            }
        });

        // Listen for 'disconnect' event
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
