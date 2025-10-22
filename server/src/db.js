// server/src/db.js
const { Pool } = require('pg');
require('dotenv').config();
console.log("process.env.DATABASE_URL",process.env.DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});


module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
