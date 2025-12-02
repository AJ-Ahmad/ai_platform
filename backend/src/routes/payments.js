const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Create Stripe checkout session
router.post('/create-checkout-session', authMiddleware, checkRole('student'), async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const isEnrolled = await Enrollment.checkEnrollment(req.user.id, courseId);
    if (isEnrolled) {
      return res.status(400).json({ error: 'You are already enrolled in this course' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.description,
              images: course.thumbnail_url ? [course.thumbnail_url] : []
            },
            unit_amount: Math.round(course.price * 100) // Stripe expects amount in cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses/${courseId}`,
      metadata: {
        courseId: courseId.toString(),
        studentId: req.user.id.toString(),
        studentEmail: req.user.email
      }
    });

    // Create pending enrollment with session ID
    await Enrollment.create(req.user.id, courseId, session.id);

    res.json({ 
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
});

// Stripe webhook to handle payment confirmation
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Update enrollment status to completed
      await Enrollment.updateByStripePaymentId(session.id, 'completed');
      
      console.log('Payment successful for session:', session.id);
      console.log('Course:', session.metadata.courseId, 'Student:', session.metadata.studentId);
    } catch (error) {
      console.error('Error updating enrollment:', error);
    }
  }

  // Handle failed payment
  if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
    const session = event.data.object;

    try {
      await Enrollment.updateByStripePaymentId(session.id, 'failed');
      console.log('Payment failed for session:', session.id);
    } catch (error) {
      console.error('Error updating enrollment:', error);
    }
  }

  res.json({ received: true });
});

// Verify payment session
router.get('/verify-session/:sessionId', authMiddleware, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    if (session.payment_status === 'paid') {
      // Update enrollment if not already done
      const enrollment = await Enrollment.findByStripePaymentId(session.id);
      
      if (enrollment && enrollment.payment_status !== 'completed') {
        await Enrollment.updateByStripePaymentId(session.id, 'completed');
      }

      res.json({ 
        success: true, 
        payment_status: 'paid',
        course_id: session.metadata.courseId
      });
    } else {
      res.json({ 
        success: false, 
        payment_status: session.payment_status
      });
    }
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({ error: 'Error verifying payment session' });
  }
});

module.exports = router;

