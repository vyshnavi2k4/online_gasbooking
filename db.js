// db.js
const mysql = require('mysql2');

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'vyshu251204',   // your MySQL root password
  database: 'online_gasbooking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// simple test
pool.getConnection((err, conn) => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
  } else {
    console.log('✅ MySQL connected');
    conn.release();
  }
});

module.exports = pool;
