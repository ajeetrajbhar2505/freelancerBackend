// room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: { type: String, unique: true, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of user IDs
});

module.exports = mongoose.model('Room', roomSchema);
