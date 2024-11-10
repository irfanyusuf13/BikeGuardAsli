const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/adminController');

// Admin routes
router.post('/create', AdminController.createAdmin);
router.get('/all', AdminController.getAllAdmins);
router.get('/:id', AdminController.getAdminById);
router.delete('/delete/:id', AdminController.deleteAdminById);

module.exports = router;
