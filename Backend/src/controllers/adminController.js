const pool = require('../config/database');
const { BaseApiResponse } = require('../config/utils');

// Controller untuk membuat admin (pengguna dengan role admin)
exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Menyimpan admin dengan role 'admin' di dalam tabel users
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, 'admin') RETURNING *`, 
            [name, email, password]
        );
        
        res.status(200).json(BaseApiResponse('Successfully created admin', result.rows[0]));
    } 
    catch (error) {
        console.log(error);
        res.status(500).json(BaseApiResponse(error.message, null));
    }
};

exports.loginAdmin = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1 AND password = $2 AND role = $3`, [email, password, role]);

        if(result.rows.length == 0) 
            return res.status(404).json(BaseApiResponse('User Not Found', null));
        
        return res.status(200).json(BaseApiResponse("Login Succesful", result.rows[0])); // Mengembalikan data user yang baru ditambahkan
    } 
    
    catch (error) {
        console.log(error);
        return res.status(500).json(BaseApiResponse(error.message, null));
    }
}

// Controller untuk mendapatkan semua pengguna dengan role 'admin'
exports.getAllAdmins = async (req, res) => {
    try {
        // Mengambil semua pengguna dengan role 'admin'
        const result = await pool.query(`SELECT * FROM users WHERE role = 'admin'`);
        res.status(200).json(BaseApiResponse('Successfully fetched all admins', result.rows));
    } 
    catch (error) {
        console.log(error);
        res.status(500).json(BaseApiResponse(error.message, null));
    }
};

// Controller untuk mendapatkan admin berdasarkan ID
exports.getAdminById = async (req, res) => {
    const id = req.params.id;

    try {
        // Mengambil admin berdasarkan ID
        const result = await pool.query(`SELECT * FROM users WHERE id = $1 AND role = 'admin'`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse('Admin not found', null));
        }

        res.status(200).json(BaseApiResponse('Successfully fetched admin', result.rows[0]));
    } 
    catch (error) {
        console.log(error);
        res.status(500).json(BaseApiResponse(error.message, null));
    }
};

// Controller untuk menghapus admin berdasarkan ID
exports.deleteAdminById = async (req, res) => {
    const id = req.params.id;

    try {
        // Menghapus admin berdasarkan ID
        const result = await pool.query(`DELETE FROM users WHERE id = $1 AND role = 'admin' RETURNING *`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json(BaseApiResponse('Admin not found', null));
        }

        res.status(200).json(BaseApiResponse('Successfully deleted admin', result.rows[0]));
    } 
    catch (error) {
        console.log(error);
        res.status(500).json(BaseApiResponse(error.message, null));
    }
};
