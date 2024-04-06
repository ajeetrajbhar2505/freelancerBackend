// user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    createdAt: { type: Date, default: Date.now },
    email_verified : { type: Boolean, default: false, required: true}
});

module.exports = mongoose.model('User', userSchema);
