const express = require('express');
const router = express.Router();
const controller = require('../controllers/UserController');
const verifyToken = require('../middleware/VerifyToken'); 

// Register and Login routes
router.post('/register', controller.register);
router.post('/login', controller.login);

// User-related routes
router.get('/:id', verifyToken, controller.getUser); // Get user by ID
router.put('/:id', verifyToken, controller.updateUser); // Edit user
router.delete('/:id', verifyToken, controller.deleteUser); // Delete user

module.exports = router;
