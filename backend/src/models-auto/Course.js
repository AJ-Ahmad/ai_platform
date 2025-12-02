// Auto-switching Course model
const usePostgres = process.env.DATABASE_URL ? true : false;

if (usePostgres) {
  module.exports = require('../models/Course-postgres');
} else {
  module.exports = require('../models/Course');
}

