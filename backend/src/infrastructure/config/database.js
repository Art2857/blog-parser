const knex = require('knex');
const knexConfig = require('../../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

if (!config) {
  throw new Error(`No database configuration found for environment: ${environment}`);
}

const db = knex(config);


db.raw('SELECT 1')
  .then(() => {
    console.log(`Database connected successfully (${environment})`);
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });

module.exports = db;
