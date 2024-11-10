const pool = require('../config/database');
const { BaseApiResponse } = require('../config/utils');

// Controller to create a new parking slot
exports.createParkingSlot = async (req, res) => {
    const { location } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO parking_slots (location) VALUES ($1) RETURNING *`,
            [location]
        );
        const slotData = result.rows[0];
        res.status(201).json(BaseApiResponse("Parking slot created successfully", ParkingSlotResponse(slotData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to create parking slot", null));
    }
};

// Controller to retrieve a parking slot by ID
exports.getParkingSlotById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT parking_slots.*, users.name AS reservedBy, bicycles.id AS bicycle_id
            FROM parking_slots
            LEFT JOIN users ON parking_slots.reserved_by = users.id
            LEFT JOIN bicycles ON parking_slots.id = bicycles.parking_slot_id
            WHERE parking_slots.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Parking slot not found", null));
        }

        const slotData = result.rows[0];
        slotData.bicycles = result.rows.map(row => row.bicycle_id).filter(Boolean); // Collect all parked bicycle IDs
        res.status(200).json(BaseApiResponse("Parking slot retrieved successfully", ParkingSlotResponse(slotData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to retrieve parking slot", null));
    }
};

// Controller to update parking slot's occupancy status and reserved_by user
exports.updateParkingSlotStatus = async (req, res) => {
    const { id } = req.params;
    const { is_occupied, reserved_by } = req.body;

    try {
        const result = await pool.query(
            `UPDATE parking_slots SET is_occupied = $1, reserved_by = $2 WHERE id = $3 RETURNING *`,
            [is_occupied, reserved_by, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Parking slot not found", null));
        }

        const slotData = result.rows[0];
        res.status(200).json(BaseApiResponse("Parking slot status updated", ParkingSlotResponse(slotData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to update parking slot status", null));
    }
};

// Controller to delete a parking slot by ID
exports.deleteParkingSlotById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM parking_slots WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Parking slot not found", null));
        }

        res.status(200).json(BaseApiResponse("Parking slot deleted successfully", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to delete parking slot", null));
    }
};

// Controller to get all parking slots
exports.getAllParkingSlots = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT parking_slots.*, users.name AS reservedBy, bicycles.id AS bicycle_id
            FROM parking_slots
            LEFT JOIN users ON parking_slots.reserved_by = users.id
            LEFT JOIN bicycles ON parking_slots.id = bicycles.parking_slot_id`
        );

        const parkingSlots = result.rows.reduce((acc, row) => {
            const slot = acc.find(s => s.id === row.id);
            if (slot) {
                // Append additional bicycle to existing parking slot
                if (row.bicycle_id) slot.bicycles.push(row.bicycle_id);
            } else {
                // Initialize new parking slot with bicycle list
                acc.push({
                    ...row,
                    bicycles: row.bicycle_id ? [row.bicycle_id] : []
                });
            }
            return acc;
        }, []);

        res.status(200).json(BaseApiResponse("Parking slots retrieved successfully", parkingSlots.map(ParkingSlotResponse)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to retrieve parking slots", null));
    }
};
