const pool = require('../config/database');
const { BaseApiResponse, ParkingSlotResponse } = require('../config/utils'); // Pastikan ParkingSlotResponse diimpor

// Controller untuk membuat slot parkir baru
exports.createParkingSlot = async (req, res) => {
    const { location } = req.body;
    try {
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

// Controller untuk mengambil slot parkir berdasarkan ID
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
            return res.status(404).json(BaseApiResponse("Slot parkir tidak ditemukan", null));
        }

        const slotData = result.rows[0];
        slotData.bicycles = result.rows.map(row => row.bicycle_id).filter(Boolean); // Kumpulkan semua ID sepeda yang terparkir
        res.status(200).json(BaseApiResponse("Slot parkir berhasil diambil", ParkingSlotResponse(slotData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Gagal mengambil slot parkir", null));
    }
};

// Controller untuk memperbarui status slot parkir dan pengguna yang memesan
exports.updateParkingSlotStatus = async (req, res) => {
    const { id } = req.params;
    const { is_occupied, reserved_by } = req.body;

    try {
        const result = await pool.query(
            `UPDATE parking_slots SET is_occupied = $1, reserved_by = $2 WHERE id = $3 RETURNING *`,
            [is_occupied, reserved_by, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse("Slot parkir tidak ditemukan", null));
        }

        const slotData = result.rows[0];
        res.status(200).json(BaseApiResponse("Status slot parkir berhasil diperbarui", ParkingSlotResponse(slotData)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Gagal memperbarui status slot parkir", null));
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

// Controller untuk mengambil semua slot parkir
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
                // Tambahkan ID sepeda tambahan ke slot parkir yang ada
                if (row.bicycle_id) slot.bicycles.push(row.bicycle_id);
            } else {
                // Inisialisasi slot parkir baru dengan daftar sepeda
                acc.push({
                    ...row,
                    bicycles: row.bicycle_id ? [row.bicycle_id] : []
                });
            }
            return acc;
        }, []);

        res.status(200).json(BaseApiResponse("Semua slot parkir berhasil diambil", parkingSlots.map(ParkingSlotResponse)));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse("Gagal mengambil semua slot parkir", null));
    }
};
