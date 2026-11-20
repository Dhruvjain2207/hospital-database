const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection without killing the server process
pool.getConnection((err, connection) => {
  if (err) {
    console.error('⚠️  Database connection warning:', err.message);
    console.error('👉 Make sure MySQL is running and backend/.env has the correct DB_PASSWORD');
  } else {
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'hospital_db');
    connection.release();
  }
});

module.exports = pool;
