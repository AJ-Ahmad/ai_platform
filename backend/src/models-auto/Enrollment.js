// Auto-switching Enrollment model
const usePostgres = process.env.DATABASE_URL ? true : false;

if (usePostgres) {
  module.exports = require('../models/Enrollment-postgres');
} else {
  module.exports = require('../models/Enrollment');
}

