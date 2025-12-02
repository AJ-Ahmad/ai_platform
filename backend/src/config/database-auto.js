// Smart database configuration
// Uses PostgreSQL if DATABASE_URL is set (production)
// Uses SQLite for local development

const usePostgres = process.env.DATABASE_URL ? true : false;

if (usePostgres) {
  console.log('Using PostgreSQL database');
  module.exports = require('./database-postgres');
} else {
  console.log('Using SQLite database (local development)');
  module.exports = require('./database');
}

