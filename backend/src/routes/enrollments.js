const express = require('express');
const router = express.Router();
const Enrollment = require('../models-auto/Enrollment');
const Course = require('../models-auto/Course');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Get student's enrolled courses
router.get('/my-courses', authMiddleware, checkRole('student'), async (req, res) => {
  try {
    const enrollments = await Enrollment.findByStudentId(req.user.id);
    
    res.json({ 
      enrollments,
      total: enrollments.length
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ error: 'Error fetching enrolled courses' });
  }
});

// Check if student is enrolled in a course
router.get('/check/:courseId', authMiddleware, checkRole('student'), async (req, res) => {
  try {
    const isEnrolled = await Enrollment.checkEnrollment(req.user.id, req.params.courseId);
    
    res.json({ 
      enrolled: isEnrolled,
      course_id: req.params.courseId
    });
  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({ error: 'Error checking enrollment status' });
  }
});

// Create enrollment (will be completed via Stripe)
router.post('/purchase', authMiddleware, checkRole('student'), async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const isEnrolled = await Enrollment.checkEnrollment(req.user.id, courseId);
    if (isEnrolled) {
      return res.status(400).json({ error: 'You are already enrolled in this course' });
    }

    // Create pending enrollment (will be updated when payment is confirmed)
    const enrollment = await Enrollment.create(req.user.id, courseId);

    res.status(201).json({
      message: 'Enrollment created. Complete payment to access the course.',
      enrollment
    });
  } catch (error) {
    console.error('Create enrollment error:', error);
    res.status(500).json({ error: 'Error creating enrollment' });
  }
});

module.exports = router;

