const { Pool } = require('pg');
require('dotenv').config;
const { HOST1, USER, PASSWORD, DB_PORT, DB } = process.env;

const pool = new Pool({
  host: HOST1,
  user: USER,
  password: PASSWORD,
  port: DB_PORT,
  database: DB,
});

pool.connect()
  .then(() => console.log('postgres db connected!!'))
  .catch((err) => console.log(err.message));

module.exports = {
  pool,
};
