const db = require('../config/database');

class Course {
  // Create new course
  static create(teacherId, title, description, videoUrls, price, thumbnailUrl = null) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO courses (teacher_id, title, description, video_urls, price, thumbnail_url)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const videoUrlsJson = JSON.stringify(videoUrls);
      
      db.run(query, [teacherId, title, description, videoUrlsJson, price, thumbnailUrl], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ 
            id: this.lastID, 
            teacher_id: teacherId,
            title, 
            description, 
            video_urls: videoUrls,
            price,
            thumbnail_url: thumbnailUrl
          });
        }
      });
    });
  }

  // Find course by ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, u.name as teacher_name, u.email as teacher_email
        FROM courses c
        JOIN users u ON c.teacher_id = u.id
        WHERE c.id = ?
      `;
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          row.video_urls = JSON.parse(row.video_urls);
          resolve(row);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Get all courses
  static findAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, u.name as teacher_name, u.email as teacher_email
        FROM courses c
        JOIN users u ON c.teacher_id = u.id
        ORDER BY c.created_at DESC
      `;
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const courses = rows.map(row => ({
            ...row,
            video_urls: JSON.parse(row.video_urls)
          }));
          resolve(courses);
        }
      });
    });
  }

  // Find courses by teacher ID
  static findByTeacherId(teacherId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, u.name as teacher_name
        FROM courses c
        JOIN users u ON c.teacher_id = u.id
        WHERE c.teacher_id = ?
        ORDER BY c.created_at DESC
      `;
      db.all(query, [teacherId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const courses = rows.map(row => ({
            ...row,
            video_urls: JSON.parse(row.video_urls)
          }));
          resolve(courses);
        }
      });
    });
  }

  // Update course
  static update(id, updates) {
    return new Promise((resolve, reject) => {
      // Handle video_urls separately if it's in updates
      if (updates.video_urls) {
        updates.video_urls = JSON.stringify(updates.video_urls);
      }
      
      updates.updated_at = new Date().toISOString();
      
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);
      
      const query = `UPDATE courses SET ${fields} WHERE id = ?`;
      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  // Delete course
  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM courses WHERE id = ?';
      db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  // Search courses
  static search(searchTerm) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, u.name as teacher_name
        FROM courses c
        JOIN users u ON c.teacher_id = u.id
        WHERE c.title LIKE ? OR c.description LIKE ?
        ORDER BY c.created_at DESC
      `;
      const term = `%${searchTerm}%`;
      db.all(query, [term, term], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const courses = rows.map(row => ({
            ...row,
            video_urls: JSON.parse(row.video_urls)
          }));
          resolve(courses);
        }
      });
    });
  }
}

module.exports = Course;

