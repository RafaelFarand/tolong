require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test koneksi dengan logging yang lebih detail
pool.getConnection((err, conn) => {
  if (err) {
    console.error('Database Connection Error:', {
      code: err.code,
      message: err.message,
      stack: err.stack
    });
    process.exit(1); // Hentikan aplikasi jika koneksi gagal
  } else {
    console.log('Successfully connected to database!');
    console.log('Database Info:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    conn.release();
  }
});

module.exports = pool.promise();
