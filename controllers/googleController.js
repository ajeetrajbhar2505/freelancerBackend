
const path = require('path')

// Controller function to create a new room
exports.google = async (req, res) => {
    try {
        return res.status(200).sendFile(path.join(__dirname, '../public/img/comingSoon.jpeg'));

    } catch (error) {
        return res.status(400).sendFile(path.join(__dirname, '../public/img/comingSoon.jpeg'));
    }
}


