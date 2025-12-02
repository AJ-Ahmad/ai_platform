const db = require('../config/database');

class User {
  // Create new user
  static create(email, password, name, role) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)';
      db.run(query, [email, password, name, role], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, email, name, role });
        }
      });
    });
  }

  // Find user by email
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      db.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Find user by ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, email, name, role, created_at FROM users WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get all users (for admin purposes)
  static findAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, email, name, role, created_at FROM users';
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Update user
  static update(id, updates) {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);
      
      const query = `UPDATE users SET ${fields} WHERE id = ?`;
      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  // Delete user
  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM users WHERE id = ?';
      db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
}

module.exports = User;

