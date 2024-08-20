const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Define routes
router.get('/users/:userId', userController.getUserById);

module.exports = router;
