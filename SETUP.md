# Quick Setup Guide for MasterAIwithUS

Follow these steps to get your educational platform up and running.

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend `.env` file
Create `backend/.env`:
```env
PORT=5000
JWT_SECRET=masteraiwithus_secret_key_change_in_production_12345
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` file
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
```

## Step 3: Get Stripe Keys

1. Sign up at https://stripe.com
2. Go to Developers > API keys
3. Copy your test keys:
   - Publishable key (pk_test_...) → frontend `.env`
   - Secret key (sk_test_...) → backend `.env`

## Step 4: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

## Step 5: Access the Platform

Open your browser and go to: http://localhost:5173

## First Time Usage

1. Click "Register" to create an account
2. Choose role: "Teacher" or "Student"
3. Fill in your details and submit

### As a Teacher:
- Go to Dashboard
- Click "Create New Course"
- Add course title, description, price, and video URLs
- Submit to create your first course

### As a Student:
- Browse courses in the catalog
- Click on a course to view details
- Click "Enroll Now" to purchase (use test card: 4242 4242 4242 4242)
- Access your courses in "My Courses"

## Stripe Test Cards

For testing payments:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future expiration date
- Use any 3-digit CVC

## Video URL Format

For YouTube videos, use embed format:
- Regular: `https://www.youtube.com/watch?v=VIDEO_ID`
- Embed: `https://www.youtube.com/embed/VIDEO_ID`

For Vimeo:
- `https://player.vimeo.com/video/VIDEO_ID`

## Common Issues

### Port already in use
If port 5000 or 5173 is already in use:
- Change PORT in backend/.env
- Update VITE_API_URL in frontend/.env accordingly

### Cannot connect to backend
- Ensure backend is running on http://localhost:5000
- Check browser console for errors
- Verify VITE_API_URL in frontend/.env

### Stripe payments not working
- Verify Stripe keys are correct (test mode)
- Check browser console for errors
- Use test card numbers provided above

## Need Help?

Check the main README.md for detailed documentation, API endpoints, and deployment instructions.

