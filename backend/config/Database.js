require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test koneksi
pool.getConnection((err, conn) => {
  if (err) {
    console.error('Connection error:', err.message);
  } else {
    console.log('Connected to database!');
    conn.release();
  }
});

module.exports = pool.promise();
