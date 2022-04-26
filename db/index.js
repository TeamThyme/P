const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'colinfitzhenry',
  password: '',
  port: 5432,
  database: 'postgres',
});

pool.connect()
  .then(() => console.log('postgres db connected!!'))
  .catch((err) => console.log('Error in db'));

module.exports = {
  pool,
};
