const pool = require('../config/database-postgres');

class Enrollment {
  // Create new enrollment
  static async create(studentId, courseId, stripePaymentId = null) {
    try {
      const result = await pool.query(
        'INSERT INTO enrollments (student_id, course_id, stripe_payment_id, payment_status) VALUES ($1, $2, $3, $4) RETURNING *',
        [studentId, courseId, stripePaymentId, 'pending']
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find enrollment by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM enrollments WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check if student is enrolled in course
  static async checkEnrollment(studentId, courseId) {
    try {
      const result = await pool.query(
        'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2 AND payment_status = $3',
        [studentId, courseId, 'completed']
      );
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get student's enrolled courses
  static async findByStudentId(studentId) {
    try {
      const result = await pool.query(
        `SELECT e.*, c.*, u.name as teacher_name
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         JOIN users u ON c.teacher_id = u.id
         WHERE e.student_id = $1 AND e.payment_status = $2
         ORDER BY e.purchase_date DESC`,
        [studentId, 'completed']
      );
      return result.rows.map(row => ({
        ...row,
        video_urls: JSON.parse(row.video_urls)
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get course enrollments (for teachers)
  static async findByCourseId(courseId) {
    try {
      const result = await pool.query(
        `SELECT e.*, u.name as student_name, u.email as student_email
         FROM enrollments e
         JOIN users u ON e.student_id = u.id
         WHERE e.course_id = $1 AND e.payment_status = $2
         ORDER BY e.purchase_date DESC`,
        [courseId, 'completed']
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get enrollment count for a course
  static async getEnrollmentCount(courseId) {
    try {
      const result = await pool.query(
        'SELECT COUNT(*) as count FROM enrollments WHERE course_id = $1 AND payment_status = $2',
        [courseId, 'completed']
      );
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw error;
    }
  }

  // Update enrollment status
  static async updateStatus(id, status) {
    try {
      const result = await pool.query(
        'UPDATE enrollments SET payment_status = $1 WHERE id = $2',
        [status, id]
      );
      return { changes: result.rowCount };
    } catch (error) {
      throw error;
    }
  }

  // Update enrollment by stripe payment ID
  static async updateByStripePaymentId(stripePaymentId, status) {
    try {
      const result = await pool.query(
        'UPDATE enrollments SET payment_status = $1 WHERE stripe_payment_id = $2',
        [status, stripePaymentId]
      );
      return { changes: result.rowCount };
    } catch (error) {
      throw error;
    }
  }

  // Find enrollment by stripe payment ID
  static async findByStripePaymentId(stripePaymentId) {
    try {
      const result = await pool.query(
        'SELECT * FROM enrollments WHERE stripe_payment_id = $1',
        [stripePaymentId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Enrollment;

