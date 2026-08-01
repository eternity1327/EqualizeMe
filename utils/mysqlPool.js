/**
 * utils/mysqlPool.js
 *
 * Central MySQL connection pool. All routes that need the database
 * import { pool } from here and use pool.execute(...) / pool.query(...).
 *
 * Credentials come from .env (never hardcode them in this file).
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'equalizeme',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
