const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    message: String,
    statusCode: Number,
    apiEndpoint: String,
});

module.exports = mongoose.model('Error', errorSchema);;
