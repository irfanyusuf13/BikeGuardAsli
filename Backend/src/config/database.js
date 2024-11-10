require('dotenv').config();  
const { Pool } = require('pg'); 
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
pool.connect()
    .then(() => {
        console.log('Connected to the BikeGuard database');
    })
    .catch(error => {
        console.error('Connection error', error);
    });
module.exports = pool;