// userRoutes.js
const express = require('express');
const router = express.Router();
const tokenController = require('../middlewares/decodetoken');

router.post('/createToken', tokenController.createToken);
router.post('/decodeToken', tokenController.decodedToken);

// Add other routes as needed

module.exports = router;
