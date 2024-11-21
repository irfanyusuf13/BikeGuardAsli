const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/adminController');

// Admin routes
router.post('/register', AdminController.registerAdmin);
router.post('/login', AdminController.loginAdmin);
router.get('/all', AdminController.getAllAdmins);
router.get('/:id', AdminController.getAdminById);
router.delete('/delete/:id', AdminController.deleteAdminById);

module.exports = router;
