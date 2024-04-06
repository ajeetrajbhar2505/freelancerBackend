// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Example routes
router.post('/signup', userController.createUser);
router.post('/login', userController.authenticateUser);
router.post('/getOTP', userController.getOTP);
router.post('/resetPassword', userController.resetPassword);
router.post('/verify-otp', userController.verifyOTP);
router.post('/verify-email', userController.verifyOTP);

// Add other routes as needed

module.exports = router;
