const pool = require('../config/database-postgres');

class User {
  // Create new user
  static async create(email, password, name, role) {
    try {
      const result = await pool.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
        [email, password, name, role]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  static async findAll() {
    try {
      const result = await pool.query(
        'SELECT id, email, name, role, created_at FROM users'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, updates) {
    try {
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      
      const result = await pool.query(
        `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1}`,
        [...values, id]
      );
      return { changes: result.rowCount };
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1',
        [id]
      );
      return { changes: result.rowCount };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;

