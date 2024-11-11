const pool = require('../config/database');
const { BaseApiResponse, MonitoringSystemResponse  } = require('../config/utils');

// Controller to get the status of the monitoring system
exports.getSystemStatus = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM monitoring_system WHERE id = 1`);

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Monitoring system status not found", null));
        }

        const monitorData = result.rows[0];
        // Format the response to include status, active_slots, available_slots, recent_activity
        const formattedResponse = {
            status: monitorData.status,
            activeSlots: monitorData.active_slots,
            availableSlots: monitorData.available_slots,
            recentActivity: monitorData.recent_activity
        };
        
        res.status(200).json(BaseApiResponse("Monitoring system status retrieved successfully", formattedResponse));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to retrieve monitoring system status", null));
    }
};

// Controller to update monitoring system status
exports.updateSystemStatus = async (req, res) => {
    const { status, active_slots, available_slots, recent_activity } = req.body;

    try {
        const result = await pool.query(
            `UPDATE monitoring_system SET 
                status = COALESCE($1, status), 
                active_slots = COALESCE($2, active_slots), 
                available_slots = COALESCE($3, available_slots), 
                recent_activity = COALESCE($4, recent_activity)
            WHERE id = 1 
            RETURNING *`,
            [status, active_slots, available_slots, recent_activity]
        );

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Monitoring system status not found", null));
        }

        const monitorData = result.rows[0];
        res.status(200).json(BaseApiResponse("Monitoring system status updated successfully", MonitoringSystemResponse(monitorData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to update monitoring system status", null));
    }
};

// Controller to log a recent activity in the monitoring system
exports.logRecentActivity = async (req, res) => {
    const { recent_activity } = req.body;

    try {
        const result = await pool.query(
            `UPDATE monitoring_system SET 
                recent_activity = $1
            WHERE id = 1 
            RETURNING *`,
            [recent_activity]
        );

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Monitoring system status not found", null));
        }

        const monitorData = result.rows[0];
        res.status(200).json(BaseApiResponse("Recent activity logged successfully", MonitoringSystemResponse(monitorData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to log recent activity", null));
    }
};
