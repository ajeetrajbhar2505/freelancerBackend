// message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messageText: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    lastSeen: { type: String },
    lastMessage: { type: String }
});


module.exports = mongoose.model('Message', messageSchema);
