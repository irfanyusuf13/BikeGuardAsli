const pool = require('../config/database');
const { BaseApiResponse } = require('../config/utils');

// Controller to create a new QR code
exports.createQRCode = async (req, res) => {
    const { code, expiration_date, associated_parking_slot } = req.body;
    
    try {
        const result = await pool.query(
            `INSERT INTO qrcodes (code, expiration_date, associated_parking_slot) 
            VALUES ($1, $2, $3) RETURNING *`,
            [code, expiration_date, associated_parking_slot]
        );
        
        const qrData = result.rows[0];
        res.status(201).json(BaseApiResponse("QR code created successfully", QRCodeResponse(qrData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to create QR code", null));
    }
};

// Controller to retrieve a QR code by ID
exports.getQRCodeById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(`SELECT * FROM qrcodes WHERE id = $1`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("QR code not found", null));
        }

        const qrData = result.rows[0];
        res.status(200).json(BaseApiResponse("QR code retrieved successfully", QRCodeResponse(qrData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to retrieve QR code", null));
    }
};

// Controller to update QR code status (is_valid) or expiration date
exports.updateQRCode = async (req, res) => {
    const { id } = req.params;
    const { is_valid, expiration_date, associated_parking_slot } = req.body;

    try {
        const result = await pool.query(
            `UPDATE qrcodes SET is_valid = COALESCE($1, is_valid), expiration_date = COALESCE($2, expiration_date), 
             associated_parking_slot = COALESCE($3, associated_parking_slot) WHERE id = $4 RETURNING *`,
            [is_valid, expiration_date, associated_parking_slot, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("QR code not found", null));
        }

        const qrData = result.rows[0];
        res.status(200).json(BaseApiResponse("QR code updated successfully", QRCodeResponse(qrData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to update QR code", null));
    }
};

// Controller to delete a QR code by ID
exports.deleteQRCodeById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`DELETE FROM qrcodes WHERE id = $1 RETURNING *`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("QR code not found", null));
        }

        res.status(200).json(BaseApiResponse("QR code deleted successfully", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to delete QR code", null));
    }
};

// Controller to get all QR codes
exports.getAllQRCodes = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM qrcodes`);
        
        const qrCodes = result.rows.map(QRCodeResponse);
        res.status(200).json(BaseApiResponse("QR codes retrieved successfully", qrCodes));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to retrieve QR codes", null));
    }
};
