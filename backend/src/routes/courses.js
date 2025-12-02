const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Course = require('../models-auto/Course');
const Enrollment = require('../models-auto/Enrollment');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Validation rules
const courseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('video_urls').isArray({ min: 1 }).withMessage('At least one video URL is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
];

// Get all courses (public)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    let courses;
    if (search) {
      courses = await Course.search(search);
    } else {
      courses = await Course.findAll();
    }

    // Add enrollment count for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.getEnrollmentCount(course.id);
        return { ...course, enrollment_count: enrollmentCount };
      })
    );

    res.json({ courses: coursesWithStats });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// Get single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const enrollmentCount = await Enrollment.getEnrollmentCount(course.id);
    
    res.json({ 
      course: { ...course, enrollment_count: enrollmentCount }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Error fetching course' });
  }
});

// Get teacher's own courses
router.get('/my-courses/list', authMiddleware, checkRole('teacher'), async (req, res) => {
  try {
    const courses = await Course.findByTeacherId(req.user.id);
    
    // Add enrollment count for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.getEnrollmentCount(course.id);
        return { ...course, enrollment_count: enrollmentCount };
      })
    );

    res.json({ courses: coursesWithStats });
  } catch (error) {
    console.error('Get teacher courses error:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// Create new course (teachers only)
router.post('/', authMiddleware, checkRole('teacher'), courseValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, video_urls, price, thumbnail_url } = req.body;

    const course = await Course.create(
      req.user.id,
      title,
      description,
      video_urls,
      price,
      thumbnail_url
    );

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Error creating course' });
  }
});

// Update course (teachers only, own courses)
router.put('/:id', authMiddleware, checkRole('teacher'), courseValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if the teacher owns this course
    if (course.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own courses' });
    }

    const { title, description, video_urls, price, thumbnail_url } = req.body;
    
    await Course.update(req.params.id, {
      title,
      description,
      video_urls,
      price,
      thumbnail_url
    });

    const updatedCourse = await Course.findById(req.params.id);

    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Error updating course' });
  }
});

// Delete course (teachers only, own courses)
router.delete('/:id', authMiddleware, checkRole('teacher'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if the teacher owns this course
    if (course.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own courses' });
    }

    await Course.delete(req.params.id);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Error deleting course' });
  }
});

// Get enrollments for a course (teachers only, own courses)
router.get('/:id/enrollments', authMiddleware, checkRole('teacher'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if the teacher owns this course
    if (course.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only view enrollments for your own courses' });
    }

    const enrollments = await Enrollment.findByCourseId(req.params.id);

    res.json({ 
      course_id: req.params.id,
      course_title: course.title,
      enrollments,
      total_enrollments: enrollments.length
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Error fetching enrollments' });
  }
});

module.exports = router;

