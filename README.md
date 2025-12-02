# MasterAIwithUS - Educational Platform

A full-stack educational platform where teachers can create and manage courses, and students can browse, purchase, and access course content.

## Features

### For Teachers
- Create, edit, and delete courses
- Add video URLs (YouTube, Vimeo, etc.)
- Set course pricing
- View enrollment statistics
- Track student enrollments

### For Students
- Browse course catalog
- Search courses
- View course details
- Purchase courses via Stripe
- Access enrolled courses
- Watch course videos

## Tech Stack

### Backend
- Node.js with Express
- SQLite database
- JWT authentication
- Bcrypt for password hashing
- Stripe for payment processing

### Frontend
- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios for API calls
- Stripe.js for payments

## Project Structure

```
ai_platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── roleCheck.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Course.js
│   │   │   └── Enrollment.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── courses.js
│   │   │   ├── enrollments.js
│   │   │   └── payments.js
│   │   └── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── student/
│   │   │   │   ├── CourseCatalog.jsx
│   │   │   │   ├── CourseDetails.jsx
│   │   │   │   ├── MyCourses.jsx
│   │   │   │   └── PaymentSuccess.jsx
│   │   │   ├── teacher/
│   │   │   │   ├── TeacherDashboard.jsx
│   │   │   │   ├── CreateCourse.jsx
│   │   │   │   ├── EditCourse.jsx
│   │   │   │   └── CourseEnrollments.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Stripe account (for payment processing)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Stripe Configuration

### Get Your Stripe Keys

1. Sign up for a Stripe account at https://stripe.com
2. Go to Developers > API keys
3. Copy your Publishable key (starts with `pk_`) and Secret key (starts with `sk_`)
4. For testing, use test mode keys (starts with `pk_test_` and `sk_test_`)

### Configure Webhook (for production)

1. Go to Developers > Webhooks in Stripe Dashboard
2. Add endpoint: `https://your-domain.com/api/payments/webhook`
3. Select events to listen to:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
4. Copy the webhook signing secret and add it to your `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Courses
- `GET /api/courses` - Get all courses (public)
- `GET /api/courses/:id` - Get single course (public)
- `GET /api/courses/my-courses/list` - Get teacher's courses (teacher only)
- `POST /api/courses` - Create course (teacher only)
- `PUT /api/courses/:id` - Update course (teacher only, own courses)
- `DELETE /api/courses/:id` - Delete course (teacher only, own courses)
- `GET /api/courses/:id/enrollments` - Get course enrollments (teacher only, own courses)

### Enrollments
- `GET /api/enrollments/my-courses` - Get student's enrolled courses (student only)
- `GET /api/enrollments/check/:courseId` - Check if enrolled (student only)
- `POST /api/enrollments/purchase` - Create enrollment (student only)

### Payments
- `POST /api/payments/create-checkout-session` - Create Stripe checkout session (student only)
- `POST /api/payments/webhook` - Stripe webhook endpoint
- `GET /api/payments/verify-session/:sessionId` - Verify payment session

## Database Schema

### Users Table
- id (INTEGER, PRIMARY KEY)
- email (TEXT, UNIQUE)
- password (TEXT, hashed)
- name (TEXT)
- role (TEXT: 'teacher' or 'student')
- created_at (DATETIME)

### Courses Table
- id (INTEGER, PRIMARY KEY)
- teacher_id (INTEGER, FOREIGN KEY)
- title (TEXT)
- description (TEXT)
- video_urls (TEXT, JSON array)
- price (REAL)
- thumbnail_url (TEXT, nullable)
- created_at (DATETIME)
- updated_at (DATETIME)

### Enrollments Table
- id (INTEGER, PRIMARY KEY)
- student_id (INTEGER, FOREIGN KEY)
- course_id (INTEGER, FOREIGN KEY)
- payment_status (TEXT: 'pending', 'completed', 'failed')
- purchase_date (DATETIME)
- stripe_payment_id (TEXT)

## User Roles

### Teacher
- Create and manage courses
- View enrollment statistics
- See list of enrolled students
- Cannot purchase courses

### Student
- Browse and search courses
- Purchase courses
- Access enrolled courses
- View course videos
- Cannot create courses

## Development Workflow

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend server: `cd frontend && npm run dev`
3. Access the application at `http://localhost:5173`
4. Create a teacher account to add courses
5. Create a student account to browse and purchase courses

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Deployment

### Backend Deployment Options
- **Heroku**: Easy deployment with Heroku CLI
- **Railway**: Simple deployment with GitHub integration
- **Render**: Free tier available with good performance
- **DigitalOcean**: VPS for more control

### Frontend Deployment Options
- **Vercel**: Optimized for React/Vite apps (recommended)
- **Netlify**: Easy deployment with continuous deployment
- **GitHub Pages**: Free hosting for static sites
- **Cloudflare Pages**: Fast global CDN

### Environment Variables for Production

Backend:
- Set `NODE_ENV=production`
- Use strong JWT secret
- Use production Stripe keys
- Configure CORS for your frontend domain

Frontend:
- Update `VITE_API_URL` to your backend URL
- Use production Stripe publishable key

### Database Migration for Production

For production, consider migrating from SQLite to PostgreSQL:

1. Install PostgreSQL adapter: `npm install pg`
2. Update database configuration in `backend/src/config/database.js`
3. Migrate data from SQLite to PostgreSQL

## Security Considerations

1. Change JWT_SECRET to a strong random string in production
2. Use HTTPS for all production deployments
3. Enable CORS only for your frontend domain
4. Keep Stripe secret keys secure
5. Regularly update dependencies
6. Implement rate limiting for API endpoints
7. Add input validation and sanitization
8. Use environment variables for all sensitive data

## Testing

### Test Payment Flow
Use Stripe test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiration date and any 3-digit CVC

### Test Users
Create test accounts:
- Teacher: email@teacher.com / password123
- Student: email@student.com / password123

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify all environment variables are set
- Check Node.js version compatibility

### Frontend won't connect to backend
- Verify backend is running
- Check VITE_API_URL in frontend .env
- Check browser console for CORS errors

### Stripe payments not working
- Verify Stripe keys are correct (test vs production)
- Check webhook endpoint is accessible
- Review Stripe dashboard for error logs

### Database errors
- Delete `masteraiwithus.db` file and restart backend to recreate
- Check file permissions in backend directory

## Contributing

This is a personal project for educational purposes. Feel free to fork and modify for your own use.

## License

ISC

## Support

For issues or questions, please create an issue in the repository.

---

Built with Node.js, React, and Stripe by MasterAIwithUS Team

