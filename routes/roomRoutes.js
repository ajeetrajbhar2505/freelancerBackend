// roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Route to create a new room
router.post('/createRoom', roomController.createRoom);

module.exports = router;
