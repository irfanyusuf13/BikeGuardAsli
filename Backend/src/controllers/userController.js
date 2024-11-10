const pool = require('../config/database');
const { BaseApiResponse } = require('../config/utils');

// Controller untuk membuat pengguna baru
exports.register = async (req, res) => {
    const { name, email, password } =  req.body;

    try {
        const result = await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
             RETURNING *`, 
             [name, email, password]
            );

        res.status(200).json(BaseApiResponse('Succesfully Create User', result.rows[0]));
    } 
    
    catch (error) {
        console.log(error);
        res.status(500).json(BaseApiResponse(error.message, null));
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1 AND password = $2`, [email, password]);

        if(result.rows.length == 0) 
            return res.status(404).json(BaseApiResponse('User Not Found', null));
        
        return res.status(200).json(BaseApiResponse("Login Succesful", result.rows[0])); // Mengembalikan data user yang baru ditambahkan
    } 
    
    catch (error) {
        console.log(error);
        return res.status(500).json(BaseApiResponse(error.message, null));
    }
}

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
