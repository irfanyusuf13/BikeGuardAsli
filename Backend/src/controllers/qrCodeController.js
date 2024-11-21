const pool = require('../config/database');
const { BaseApiResponse, QRCodeResponse } = require('../config/utils'); // pastikan QRCodeResponse diimpor

// Controller untuk membuat QR Code baru
exports.createQRCode = async (req, res) => {
    const { code, expiration_date, associated_parking_slot, user_id } = req.body;  // Ambil user_id dari request body

    if (!user_id) {
        return res.status(400).json(BaseApiResponse("User ID harus disertakan", null));
    }

    try {
        // Cek role user berdasarkan user_id yang dikirimkan
        const userCheck = await pool.query('SELECT role FROM users WHERE id = $1', [user_id]);

        if (userCheck.rows.length === 0 || userCheck.rows[0].role !== 'admin') {
            return res.status(403).json(BaseApiResponse("Akses ditolak. Hanya admin yang dapat membuat QR code.", null));
        }

        // Jika user adalah admin, lanjutkan membuat QR Code
        const result = await pool.query(
            `INSERT INTO qrcodes (code, expiration_date, associated_parking_slot) VALUES ($1, $2, $3) RETURNING *`,
            [code, expiration_date, associated_parking_slot]
        );
        const qrData = result.rows[0];
        res.status(201).json(BaseApiResponse("QR Code berhasil dibuat", QRCodeResponse(qrData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Gagal membuat QR Code", null));
    }
};

// Controller to verify a QR code
exports.verifyQRCode = async (req, res) => {
    const { code } = req.body; // QR code is sent in the request body

    try {
        // Query to find the QR Code by code value
        const result = await pool.query(
            `SELECT * FROM qrcodes WHERE code = $1`, 
            [code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("QR Code not found", null));
        }

        const qrData = result.rows[0];

        // Check if the QR code is valid and not expired
        const currentDate = new Date();
        const expirationDate = new Date(qrData.expiration_date);

        if (!qrData.is_valid) {
            return res.status(400).json(BaseApiResponse("QR Code is invalid", null));
        }

        if (expirationDate < currentDate) {
            return res.status(400).json(BaseApiResponse("QR Code has expired", null));
        }

        // If valid and not expired, return success response
        res.status(200).json(BaseApiResponse("QR Code is valid", QRCodeResponse(qrData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to verify QR Code", null));
    }
};

// Controller to get all QR codes
exports.getAllQRCodes = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM qrcodes`);
        const qrCodes = result.rows.map(QRCodeResponse);
        res.status(200).json(BaseApiResponse("QR Codes retrieved successfully", qrCodes));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to retrieve QR Codes", null));
    }
};

// Controller to retrieve a QR code by ID
exports.getQRCodeById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM qrcodes WHERE id = $1`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("QR Code not found", null));
        }

        const qrData = result.rows[0];
        res.status(200).json(BaseApiResponse("QR Code retrieved successfully", QRCodeResponse(qrData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to retrieve QR Code", null));
    }
};

// Controller to update QR code validity
exports.updateQRCode = async (req, res) => {
    const { id } = req.params;
    const { is_valid, expiration_date } = req.body;

    try {
        const result = await pool.query(
            `UPDATE qrcodes SET is_valid = $1, expiration_date = $2 WHERE id = $3 RETURNING *`,
            [is_valid, expiration_date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("QR Code not found", null));
        }

        const qrData = result.rows[0];
        res.status(200).json(BaseApiResponse("QR Code updated successfully", QRCodeResponse(qrData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to update QR Code", null));
    }
};

// Controller to delete a QR code by ID
exports.deleteQRCodeById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`DELETE FROM qrcodes WHERE id = $1 RETURNING *`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("QR Code not found", null));
        }

        res.status(200).json(BaseApiResponse("QR Code deleted successfully", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Failed to delete QR Code", null));
    }
};
