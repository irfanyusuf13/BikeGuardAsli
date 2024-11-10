const pool = require('../config/database');
const { BaseApiResponse } = require('../config/utils');


// Controller to create a new bicycle
exports.createBicycle = async (req, res) => {
    const { owner_id, parking_slot_id, qr_code } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO bicycles (owner_id, parking_slot_id, qr_code) VALUES ($1, $2, $3) RETURNING *`,
            [owner_id, parking_slot_id, qr_code]
        );
        const bikeData = result.rows[0];
        res.status(201).json(BaseApiResponse("Bicycle created successfully", BicycleResponse(bikeData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to create bicycle", null));
    }
};

// Controller to retrieve a bicycle by ID
exports.getBicycleById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT bicycles.*, users.name AS owner_name FROM bicycles JOIN users ON bicycles.owner_id = users.id WHERE bicycles.id = $1`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Bicycle not found", null));
        }
        const bikeData = result.rows[0];
        res.status(200).json(BaseApiResponse("Bicycle retrieved successfully", BicycleResponse(bikeData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to retrieve bicycle", null));
    }
};

// Controller to update bicycle lock status
exports.updateBicycleLockStatus = async (req, res) => {
    const { id } = req.params;
    const { is_locked } = req.body;
    try {
        const result = await pool.query(
            `UPDATE bicycles SET is_locked = $1 WHERE id = $2 RETURNING *`,
            [is_locked, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Bicycle not found", null));
        }
        const bikeData = result.rows[0];
        res.status(200).json(BaseApiResponse("Bicycle lock status updated", BicycleResponse(bikeData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to update bicycle lock status", null));
    }
};

// Controller to delete a bicycle
exports.deleteBicycleById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM bicycles WHERE id = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Bicycle not found", null));
        }
        res.status(200).json(BaseApiResponse("Bicycle deleted successfully", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to delete bicycle", null));
    }
};

// Controller to get all bicycles
exports.getAllBicycles = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT bicycles.*, users.name AS owner_name FROM bicycles JOIN users ON bicycles.owner_id = users.id`
        );
        const bicycles = result.rows.map(bikeData => BicycleResponse(bikeData));
        res.status(200).json(BaseApiResponse("Bicycles retrieved successfully", bicycles));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to retrieve bicycles", null));
    }
};
