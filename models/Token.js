const mongoose = require('mongoose');

// Define the token schema
const tokenSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    dateTime: { type: Date, required: true, default: Date.now },
    otp: { type: Number, required: true },
    verified: { type: Boolean, required: true, default: false }
});

// Create and export the Token model
module.exports = mongoose.model('Token', tokenSchema);
