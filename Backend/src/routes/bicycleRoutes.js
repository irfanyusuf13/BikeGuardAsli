const express = require('express');
const router = express.Router();

const BicycleController = require('../controllers/bicycleController');

//Bicycle Routes
router.post('/create', BicycleController.createBicycle);
router.get('/all', BicycleController.getAllBicycles);
router.get('/:id', BicycleController.getBicycleById);
router.put('/update/:id', BicycleController.updateBicycleLockStatus);
router.delete('/delete/:id', BicycleController.deleteBicycleById);

module.exports = router;