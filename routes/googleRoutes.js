// roomRoutes.js
const express = require('express');
const router = express.Router();
const googleController = require('../controllers/googleController');

// Route to create a new room
router.get('/google', googleController.google);

module.exports = router;
