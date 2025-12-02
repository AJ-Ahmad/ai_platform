// Auto-switching User model
const usePostgres = process.env.DATABASE_URL ? true : false;

if (usePostgres) {
  module.exports = require('../models/User-postgres');
} else {
  module.exports = require('../models/User');
}

