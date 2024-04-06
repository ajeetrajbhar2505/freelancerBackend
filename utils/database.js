// database.js
const mongoose = require('mongoose');
const uri = process.env.mongo_url;

function connection() {
    return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = connection;
