// room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of user IDs
});

module.exports = mongoose.model('Room', roomSchema);
