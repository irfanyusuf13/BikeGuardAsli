const pool = require('../config/database');
const { BaseApiResponse, ParkingSlotResponse } = require('../config/utils'); // Pastikan ParkingSlotResponse diimpor

// Controller untuk membuat slot parkir baru
exports.createParkingSlot = async (req, res) => {
    const { location, user_id } = req.body;  // Ambil user_id dari request body (misalnya dari form login)

    if (!user_id) {
        return res.status(400).json(BaseApiResponse("User ID harus disertakan", null));
    }

    try {
        // Cek role user berdasarkan user_id yang dikirimkan
        const userCheck = await pool.query('SELECT role FROM users WHERE id = $1', [user_id]);

        if (userCheck.rows.length === 0 || userCheck.rows[0].role !== 'admin') {
            return res.status(403).json(BaseApiResponse("Akses ditolak. Hanya admin yang dapat membuat slot parkir.", null));
        }

        // Jika user adalah admin, lanjutkan membuat slot parkir
        const result = await pool.query(
            `INSERT INTO parking_slots (location) VALUES ($1) RETURNING *`,
            [location]
        );
        const slotData = result.rows[0];
        res.status(201).json(BaseApiResponse("Slot parkir berhasil dibuat", ParkingSlotResponse(slotData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Gagal membuat slot parkir", null));
    }
};


// Controller untuk mengambil semua slot parkir dan statusnya
exports.getAllParkingSlots = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT parking_slots.*, 
                    users.name AS reservedBy, 
                    CASE 
                        WHEN parking_slots.reserved_by IS NOT NULL THEN 'Unavailable' 
                        ELSE 'Available' 
                    END AS status
            FROM parking_slots
            LEFT JOIN users ON parking_slots.reserved_by = users.id`
        );

        const parkingSlots = result.rows.map(row => ({
            id: row.id,
            location: row.location,
            isOccupied: row.is_occupied,
            reservedBy: row.reservedBy,  
            status: row.status           
        }));

        res.status(200).json(BaseApiResponse("Semua slot parkir berhasil diambil", parkingSlots));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Gagal mengambil semua slot parkir", null));
    }
};


// Controller untuk mengunci slot parkir sepeda
exports.lockBicycle = async (req, res) => {
    const { parking_slot_id, reserved_by } = req.body;

    try {
        // Periksa apakah slot parkir tersedia
        const slotCheck = await pool.query(
            `SELECT * FROM parking_slots WHERE id = $1 AND reserved_by IS NULL`,
            [parking_slot_id]
        );

        if (slotCheck.rows.length === 0) {
            return res.status(400).json(BaseApiResponse("Slot parkir tidak tersedia", null));
        }

        // Periksa apakah pengguna ada berdasarkan user_id (reserved_by)
        const userCheck = await pool.query(
            `SELECT id, name FROM users WHERE id = $1`,
            [reserved_by]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Pengguna tidak ditemukan", null));
        }

        const username = userCheck.rows[0].name;  // Ambil nama pengguna

        // Mengunci slot parkir dengan mengupdate reserved_by dengan user_id
        const updateSlot = await pool.query(
            `UPDATE parking_slots 
            SET reserved_by = $1, is_occupied = TRUE 
            WHERE id = $2 RETURNING *`,
            [reserved_by, parking_slot_id]  // reserved_by tetap user_id
        );

        const slotData = updateSlot.rows[0];

        // Menggabungkan data slot parkir dengan nama pengguna
        const responseData = {
            ...slotData,
            reserved_by_name: username  // Menambahkan nama pengguna ke respons
        };

        res.status(200).json(BaseApiResponse("Slot parkir berhasil diparkir", responseData));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Gagal memarkir slot parkir", null));
    }
};

    // Controller untuk membatalkan pemesanan dan membuka kunci slot parkir oleh pengguna
    exports.unlockBicycle = async (req, res) => {
        const { parking_slot_id, user_id } = req.body;

        try {
            // Memastikan bahwa slot parkir terkunci dan memiliki pemesan yang sesuai
            const slotCheck = await pool.query(
                `SELECT * FROM parking_slots WHERE id = $1 AND reserved_by IS NOT NULL`,
                [parking_slot_id]
            );

            if (slotCheck.rows.length === 0) {
                return res.status(400).json(BaseApiResponse("Slot parkir tidak terkunci atau tidak ada pemesan", null));
            }

            // Memeriksa apakah user_id yang membatalkan pemesanan sama dengan reserved_by
            const reservedBy = slotCheck.rows[0].reserved_by;
            if (reservedBy !== user_id) {
                return res.status(400).json(BaseApiResponse("Anda tidak dapat membatalkan pemesanan slot parkir ini", null));
            }

            // Membatalkan pemesanan dan membuka kunci slot parkir
            const updateSlot = await pool.query(
                `UPDATE parking_slots 
                SET reserved_by = NULL, is_occupied = FALSE 
                WHERE id = $1 RETURNING *`,
                [parking_slot_id]
            );

            const slotData = updateSlot.rows[0];
            res.status(200).json(BaseApiResponse("Slot parkir berhasil dibatalkan", ParkingSlotResponse(slotData)));
        } catch (error) {
            console.error(error);
            res.status(500).json(BaseApiResponse("Gagal membatalkan pemesanan slot parkir", null));
        }
    };


// Controller untuk menghapus slot parkir berdasarkan ID
exports.deleteParkingSlotById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM parking_slots WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Slot parkir tidak ditemukan", null));
        }

        res.status(200).json(BaseApiResponse("Slot parkir berhasil dihapus", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Gagal menghapus slot parkir", null));
    }
};

// Controller untuk mengambil detail slot parkir berdasarkan ID
exports.getParkingSlotById = async (req, res) => {
    const { id } = req.params;  // Mengambil ID dari parameter URL

    try {
        // Query untuk mendapatkan slot parkir berdasarkan ID
        const result = await pool.query(
            `SELECT parking_slots.*, 
                    users.name AS reservedBy, 
                    CASE 
                        WHEN parking_slots.reserved_by IS NOT NULL THEN 'Unavailable' 
                        ELSE 'Available' 
                    END AS status
            FROM parking_slots
            LEFT JOIN users ON parking_slots.reserved_by = users.id
            WHERE parking_slots.id = $1`,
            [id]
        );

        // Jika slot parkir tidak ditemukan
        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Slot parkir tidak ditemukan", null));
        }

        const slotData = result.rows[0];

        // Format data sebelum mengirimkan respons
        const responseData = {
            id: slotData.id,
            location: slotData.location,
            isOccupied: slotData.is_occupied,
            reservedBy: slotData.reservedBy,
            status: slotData.status
        };

        res.status(200).json(BaseApiResponse("Detail slot parkir berhasil diambil", responseData));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Gagal mengambil detail slot parkir", null));
    }
};

