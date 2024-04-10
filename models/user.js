// user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    profile:{ type: String, required: false,default : '' },
    email: { type: String, unique: true, required: true },
    online: { type: Boolean, required: true, default : false },
    verified: { type: Boolean, required: true, default : false },
    createdAt: { type: Date, default: Date.now },
    email_verified : { type: Boolean, default: false, required: true}
});

module.exports = mongoose.model('User', userSchema);
