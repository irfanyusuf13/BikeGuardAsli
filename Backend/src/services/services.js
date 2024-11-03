const db = require('../db/dbconfig');
const pool = db; 

async function registerUser(user) {
    const { username, email, password } = user;
    const query = 'INSERT INTO Account (username, email, password) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [username, email, password]);
    return result.rows[0]; 
}

async function loginUser(user) {
    const { username, password } = user;
    const query = 'SELECT * FROM Account WHERE username = $1 AND password = $2';
    const result = await pool.query(query, [username, password]);
    return result.rows; 
}

async function getAllUserProfile(userId) {
    const query = 'SELECT * FROM Account WHERE id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0]; 
}

module.exports = {
    registerUser,
    loginUser,
    getAllUserProfile
};