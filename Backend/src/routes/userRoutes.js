const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');

// User routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.delete('/delete/:id', UserController.deleteUserById);
router.get('/all', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

module.exports = router;
