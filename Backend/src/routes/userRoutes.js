const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');
const AdminController = require('../controllers/adminController');

// Route untuk register dengan pengecekan role
router.post('/register', (req, res, next) => {
    const { role } = req.body;

    if (role === 'admin') {
        // Arahkan ke registerAdmin di AdminController
        return AdminController.registerAdmin(req, res, next);
    } else if (role === 'user' || !role) {
        // Default ke register di UserController
        return UserController.register(req, res, next);
    } else {
        // Handle jika role tidak valid
        return res.status(400).json({ message: 'Invalid role specified' });
    }
});

router.post('/login', UserController.login);
router.delete('/delete/:id', UserController.deleteUserById);
router.get('/all', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

module.exports = router;
