const express = require('express');
const router = express.Router();

const QrCodeController = require('../controllers/qrCodeController');

// QrCode Routes
router.post('/create', QrCodeController.createQRCode);
router.get('/all', QrCodeController.getAllQRCodes);
router.get('/:id', QrCodeController.getQRCodeById);
router.put('/update/:id', QrCodeController.updateQRCode);
router.delete('/delete/:id', QrCodeController.deleteQRCodeById);

module.exports = router;