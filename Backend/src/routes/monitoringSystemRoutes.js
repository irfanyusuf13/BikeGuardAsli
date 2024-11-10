const express = require('express');
const router = express.Router();

const MonitoringSystemController = require('../controllers/monitoringSystemController');

// MonitoringSystem Routes
router.get('/status', MonitoringSystemController.getSystemStatus);
router.put('/status', MonitoringSystemController.updateSystemStatus);
router.put('/activity', MonitoringSystemController.logRecentActivity);

module.exports = router;