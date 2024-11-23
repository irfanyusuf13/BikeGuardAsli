const express = require('express');
const router = express.Router();

const ParkingSlotController = require('../controllers/parkingSlotController');

// ParkingSlot Routes
router.post('/create', ParkingSlotController.createParkingSlot);
router.post('/lock', ParkingSlotController.lockBicycle);
router.post('/unlock', ParkingSlotController.unlockBicycle);
router.get('/all', ParkingSlotController.getAllParkingSlots);
router.get('/:id', ParkingSlotController.getParkingSlotById);  
router.delete('/delete/:id', ParkingSlotController.deleteParkingSlotById);

module.exports = router;
