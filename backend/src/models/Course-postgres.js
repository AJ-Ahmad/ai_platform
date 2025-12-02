const pool = require('../config/database-postgres');

class Course {
  // Create new course
  static async create(teacherId, title, description, videoUrls, price, thumbnailUrl = null) {
    try {
      const videoUrlsJson = JSON.stringify(videoUrls);
      const result = await pool.query(
        'INSERT INTO courses (teacher_id, title, description, video_urls, price, thumbnail_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [teacherId, title, description, videoUrlsJson, price, thumbnailUrl]
      );
      const course = result.rows[0];
      course.video_urls = JSON.parse(course.video_urls);
      return course;
    } catch (error) {
      throw error;
    }
  }

  // Find course by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        `SELECT c.*, u.name as teacher_name, u.email as teacher_email
         FROM courses c
         JOIN users u ON c.teacher_id = u.id
         WHERE c.id = $1`,
        [id]
      );
      if (result.rows[0]) {
        result.rows[0].video_urls = JSON.parse(result.rows[0].video_urls);
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all courses
  static async findAll() {
    try {
      const result = await pool.query(
        `SELECT c.*, u.name as teacher_name, u.email as teacher_email
         FROM courses c
         JOIN users u ON c.teacher_id = u.id
         ORDER BY c.created_at DESC`
      );
      return result.rows.map(row => ({
        ...row,
        video_urls: JSON.parse(row.video_urls)
      }));
    } catch (error) {
      throw error;
    }
  }

  // Find courses by teacher ID
  static async findByTeacherId(teacherId) {
    try {
      const result = await pool.query(
        `SELECT c.*, u.name as teacher_name
         FROM courses c
         JOIN users u ON c.teacher_id = u.id
         WHERE c.teacher_id = $1
         ORDER BY c.created_at DESC`,
        [teacherId]
      );
      return result.rows.map(row => ({
        ...row,
        video_urls: JSON.parse(row.video_urls)
      }));
    } catch (error) {
      throw error;
    }
  }

  // Update course
  static async update(id, updates) {
    try {
      if (updates.video_urls) {
        updates.video_urls = JSON.stringify(updates.video_urls);
      }
      updates.updated_at = new Date();
      
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      
      const result = await pool.query(
        `UPDATE courses SET ${setClause} WHERE id = $${fields.length + 1}`,
        [...values, id]
      );
      return { changes: result.rowCount };
    } catch (error) {
      throw error;
    }
  }

  // Delete course
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM courses WHERE id = $1',
        [id]
      );
      return { changes: result.rowCount };
    } catch (error) {
      throw error;
    }
  }

  // Search courses
  static async search(searchTerm) {
    try {
      const result = await pool.query(
        `SELECT c.*, u.name as teacher_name
         FROM courses c
         JOIN users u ON c.teacher_id = u.id
         WHERE c.title ILIKE $1 OR c.description ILIKE $1
         ORDER BY c.created_at DESC`,
        [`%${searchTerm}%`]
      );
      return result.rows.map(row => ({
        ...row,
        video_urls: JSON.parse(row.video_urls)
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Course;

