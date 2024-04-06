// message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messageText: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
