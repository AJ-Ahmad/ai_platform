const db = require('../config/database');

class Enrollment {
  // Create new enrollment
  static create(studentId, courseId, stripePaymentId = null) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO enrollments (student_id, course_id, stripe_payment_id, payment_status)
        VALUES (?, ?, ?, 'pending')
      `;
      
      db.run(query, [studentId, courseId, stripePaymentId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ 
            id: this.lastID, 
            student_id: studentId,
            course_id: courseId,
            stripe_payment_id: stripePaymentId,
            payment_status: 'pending'
          });
        }
      });
    });
  }

  // Find enrollment by ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM enrollments WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Check if student is enrolled in course
  static checkEnrollment(studentId, courseId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM enrollments 
        WHERE student_id = ? AND course_id = ? AND payment_status = 'completed'
      `;
      db.get(query, [studentId, courseId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? true : false);
        }
      });
    });
  }

  // Get student's enrolled courses
  static findByStudentId(studentId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.*, c.*, u.name as teacher_name
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        JOIN users u ON c.teacher_id = u.id
        WHERE e.student_id = ? AND e.payment_status = 'completed'
        ORDER BY e.purchase_date DESC
      `;
      db.all(query, [studentId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const enrollments = rows.map(row => ({
            ...row,
            video_urls: JSON.parse(row.video_urls)
          }));
          resolve(enrollments);
        }
      });
    });
  }

  // Get course enrollments (for teachers)
  static findByCourseId(courseId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.*, u.name as student_name, u.email as student_email
        FROM enrollments e
        JOIN users u ON e.student_id = u.id
        WHERE e.course_id = ? AND e.payment_status = 'completed'
        ORDER BY e.purchase_date DESC
      `;
      db.all(query, [courseId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get enrollment count for a course
  static getEnrollmentCount(courseId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COUNT(*) as count 
        FROM enrollments 
        WHERE course_id = ? AND payment_status = 'completed'
      `;
      db.get(query, [courseId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }

  // Update enrollment status
  static updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE enrollments SET payment_status = ? WHERE id = ?';
      db.run(query, [status, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  // Update enrollment by stripe payment ID
  static updateByStripePaymentId(stripePaymentId, status) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE enrollments SET payment_status = ? WHERE stripe_payment_id = ?';
      db.run(query, [status, stripePaymentId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  // Find enrollment by stripe payment ID
  static findByStripePaymentId(stripePaymentId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM enrollments WHERE stripe_payment_id = ?';
      db.get(query, [stripePaymentId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = Enrollment;

