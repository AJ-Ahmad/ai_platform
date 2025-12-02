# Free Deployment Guide for MasterAIwithUS

Deploy your educational platform for free with these steps.

## Quick Overview

- **Frontend**: Vercel (free, unlimited bandwidth)
- **Backend**: Railway (free $5/month credit) or Render (free tier)
- **Database**: PostgreSQL on Railway/Render (free)
- **Total Cost**: $0/month

---

## Step 1: Prepare Your Code

### Push to GitHub

1. Create a GitHub account (if you don't have one): https://github.com/signup
2. Create a new repository
3. Push your code:

```bash
cd "C:\Users\Ahmad Zainlee\Desktop\New project\ai_platform"
git init
git add .
git commit -m "Initial commit - MasterAIwithUS platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/masteraiwithus.git
git push -u origin main
```

---

## Step 2: Deploy Backend (Railway - Recommended)

Railway offers $5/month free credit and is easiest for beginners.

### 2.1 Sign Up & Deploy

1. Go to: **https://railway.app**
2. Click "Start a New Project"
3. Sign up with GitHub
4. Click "Deploy from GitHub repo"
5. Select your repository
6. Select the `backend` folder

### 2.2 Add PostgreSQL Database

1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically provision a database

### 2.3 Configure Environment Variables

In Railway project settings, add these variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_long_random_secret_key_here_at_least_32_characters
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
FRONTEND_URL=https://your-app.vercel.app
```

### 2.4 Update Database to PostgreSQL

Railway will provide DATABASE_URL automatically. Update your backend code:

Create `backend/src/config/database-postgres.js`:
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize tables
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK(role IN ('teacher', 'student')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        video_urls TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        thumbnail_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK(payment_status IN ('pending', 'completed', 'failed')),
        purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        stripe_payment_id TEXT,
        UNIQUE(student_id, course_id)
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initializeDatabase();

module.exports = pool;
```

Your backend will be deployed at: `https://your-app.up.railway.app`

---

## Step 3: Deploy Backend (Alternative - Render)

If you prefer Render (truly free, no credit card):

### 3.1 Sign Up

1. Go to: **https://render.com**
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Select `backend` directory

### 3.2 Configure

- **Name**: masteraiwithus-backend
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js`
- **Plan**: Free

### 3.3 Add PostgreSQL

1. Click "New" → "PostgreSQL"
2. Select free plan
3. Copy the Internal Database URL

### 3.4 Environment Variables

Add in Render dashboard:
```
NODE_ENV=production
DATABASE_URL=postgresql://...  (from step 3.3)
JWT_SECRET=your_long_random_secret_key
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
FRONTEND_URL=https://your-app.vercel.app
```

Your backend will be at: `https://masteraiwithus-backend.onrender.com`

---

## Step 4: Deploy Frontend (Vercel - Recommended)

Vercel is the best for React/Vite apps and is completely free.

### 4.1 Sign Up & Deploy

1. Go to: **https://vercel.com**
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.2 Environment Variables

Add in Vercel project settings:
```
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_STRIPE_PUBLIC_KEY
```

Your frontend will be at: `https://your-app.vercel.app`

### 4.3 Update Backend CORS

After deployment, update backend `.env`:
```
FRONTEND_URL=https://your-app.vercel.app
```

And update `backend/src/server.js` CORS configuration:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

## Step 5: Deploy Frontend (Alternative - Netlify)

### 5.1 Sign Up & Deploy

1. Go to: **https://netlify.com**
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 5.2 Environment Variables

Add in Netlify:
```
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
```

---

## Step 6: Configure Stripe Webhooks

Once deployed, configure Stripe webhooks for production:

1. Go to: **https://dashboard.stripe.com/webhooks**
2. Click "Add endpoint"
3. Enter URL: `https://your-backend.up.railway.app/api/payments/webhook`
4. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret
6. Update your backend environment variable `STRIPE_WEBHOOK_SECRET`

---

## Step 7: Test Your Live Application

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Register as a teacher and create a course
3. Register as a student and purchase a course
4. Test the full flow

---

## Cost Breakdown

### Completely Free Tier Limits:

**Vercel (Frontend)**:
- Unlimited bandwidth
- Unlimited websites
- Automatic HTTPS
- Free forever

**Railway (Backend)**:
- $5/month free credit
- ~500 hours/month runtime
- PostgreSQL included
- After free credit: ~$5/month

**Render (Alternative)**:
- 750 hours/month free
- PostgreSQL 1GB free
- May sleep after inactivity
- 100% free forever

**Recommended**: Start with Railway ($5/month credit is enough), then upgrade if needed.

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel:

1. Buy domain from Namecheap/GoDaddy (~$10/year)
2. In Vercel project settings → Domains
3. Add your domain
4. Update DNS records as instructed

Your site will be: `https://masteraiwithus.com`

---

## Continuous Deployment

Both Vercel and Railway/Render support automatic deployment:

- Push to GitHub `main` branch
- Automatic deployment triggers
- Your site updates in 1-2 minutes

---

## Monitoring & Logs

### Railway:
- Click on service → "Logs" tab
- Real-time error monitoring

### Render:
- Dashboard → Select service → "Logs"

### Vercel:
- Project → "Deployments" → Click deployment → "Functions" logs

---

## Troubleshooting

### Backend not connecting:
- Check environment variables are set correctly
- Verify DATABASE_URL is configured
- Check Railway/Render logs for errors

### Frontend shows errors:
- Verify VITE_API_URL points to correct backend
- Check browser console for CORS errors
- Ensure backend FRONTEND_URL is set

### Database connection fails:
- Railway: Check PostgreSQL service is running
- Verify DATABASE_URL format is correct
- Check database connection limits

---

## Upgrade Paths (When You Grow)

### More Users:
- Railway: $5/month for 2GB RAM
- Render: $7/month for 512MB RAM
- Vercel: Always free for frontend

### Custom Domain:
- Namecheap: $10/year
- Google Domains: $12/year

### Professional Stripe:
- Activate live mode (free)
- 2.9% + $0.30 per transaction

---

## Security Checklist Before Going Public

- [ ] Change JWT_SECRET to a strong random string (32+ characters)
- [ ] Use production Stripe keys (not test keys)
- [ ] Enable HTTPS (automatic on Vercel/Railway/Render)
- [ ] Configure proper CORS origins
- [ ] Set secure cookie settings
- [ ] Add rate limiting to API endpoints
- [ ] Review database security rules
- [ ] Test all user flows thoroughly

---

## Your Deployment is Ready!

Your **MasterAIwithUS** platform is now live and accessible worldwide at:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.up.railway.app

Share your link and start onboarding teachers and students!

