const express = require('express');
const router = express.Router();

const ParkingSlotController = require('../controllers/parkingSlotController');

// ParkingSlot Routes
router.post('/create', ParkingSlotController.createParkingSlot);
router.get('/all', ParkingSlotController.getAllParkingSlots);
router.get('/:id', ParkingSlotController.getParkingSlotById);
router.put('/update/:id', ParkingSlotController.updateParkingSlotStatus);
router.delete('/delete/:id', ParkingSlotController.deleteParkingSlotById);

module.exports = router;