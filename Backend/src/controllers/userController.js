const pool = require('../config/database');
const { BaseApiResponse } = require('../config/utils');

// Controller untuk membuat pengguna baru
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (role && role !== 'user') {
        return res.status(403).json({ message: 'Access denied: Invalid role for user registration' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, 'user') RETURNING *`,
            [name, email, password]
        );

        res.status(200).json(BaseApiResponse('Successfully created user', result.rows[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json(BaseApiResponse(error.message, null));
    }
};


exports.login = async (req, res) => {
    const { email, password, role } = req.body; // Menambahkan role ke body request

    try {
        // Query untuk memeriksa email, password, dan role
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1 AND password = $2 AND role = $3`, 
            [email, password, role]
        );

        // Jika tidak ditemukan user yang sesuai
        if (result.rows.length === 0) 
            return res.status(404).json(BaseApiResponse('User Not Found or Role Mismatch', null));

        // Jika ditemukan, kembalikan data user
        return res.status(200).json(BaseApiResponse("Login Successful", result.rows[0]));
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json(BaseApiResponse(error.message, null));
    }
};

// Controller untuk menghapus pengguna berdasarkan ID
exports.deleteUserById = async (req, res) => {
    const id  = req.params.id;

    try {
        await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
        return res.status(200).json(BaseApiResponse("Sucessfully deleted user", null));
    } 
    
    catch (error) {
        console.log(error);
        return res.status(500).json(BaseApiResponse(error.message, null));
    }
};

// Controller untuk mengambil semua pengguna
exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);
        return res.status(200).json(BaseApiResponse("Succesfully get all users", result.rows));
    } 
    
    catch (error) {
        console.log(error);
        return res.status(500).json(BaseApiResponse(error.message, null));
    }
};

// Controller untuk mengambil pengguna berdasarkan ID
exports.getUserById = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

        if(result.rows.length == 0) 
            return res.status(404).json(BaseApiResponse('User Not Found', null));
        
        return res.status(200).json(BaseApiResponse("Succesfully get user", result.rows[0]));
    } 
    
    catch (error) {
        console.log(error);
        return res.status(500).json(BaseApiResponse(error.message, null));
    }
};
