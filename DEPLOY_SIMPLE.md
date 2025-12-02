# Deploy MasterAIwithUS in 15 Minutes (FREE)

Simple guide for non-technical users to deploy your platform for free.

## What You'll Get

- Your website live at: `https://yourname-masterai.vercel.app`
- Backend API at: `https://masteraiwithus.up.railway.app`
- 100% Free (no credit card needed to start)

---

## Step 1: Upload Code to GitHub (5 minutes)

### 1.1 Create GitHub Account
- Go to: https://github.com/signup
- Sign up with your email
- Verify your email

### 1.2 Create New Repository
- Click the "+" icon (top right) → "New repository"
- Name: `masteraiwithus`
- Description: "Educational platform"
- Make it Public
- Click "Create repository"

### 1.3 Upload Your Code
- On GitHub, click "uploading an existing file"
- Drag and drop your entire `ai_platform` folder
- Click "Commit changes"

Done! Your code is on GitHub.

---

## Step 2: Deploy Backend on Railway (5 minutes)

### 2.1 Sign Up
- Go to: https://railway.app
- Click "Login with GitHub"
- Authorize Railway

### 2.2 Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your `masteraiwithus` repository
- Railway will start deploying

### 2.3 Add Database
- Click "+ New"
- Select "Database"
- Choose "Add PostgreSQL"
- Wait 30 seconds for it to deploy

### 2.4 Add Environment Variables
- Click on your backend service
- Go to "Variables" tab
- Click "Raw Editor"
- Paste this:

```
NODE_ENV=production
JWT_SECRET=masteraiwithus_super_secret_key_12345_change_later
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=https://your-site.vercel.app
```

- Click "Update Variables"
- Your backend will redeploy automatically

### 2.5 Get Your Backend URL
- Click "Settings" tab
- Find "Public Networking"
- Copy the URL (something like: `masteraiwithus-production.up.railway.app`)
- Save this URL for Step 3

---

## Step 3: Deploy Frontend on Vercel (5 minutes)

### 3.1 Sign Up
- Go to: https://vercel.com
- Click "Sign Up"
- Choose "Continue with GitHub"
- Authorize Vercel

### 3.2 Import Project
- Click "Add New..." → "Project"
- Find your `masteraiwithus` repository
- Click "Import"

### 3.3 Configure Build
- Framework Preset: **Vite**
- Root Directory: Click "Edit" → Select `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### 3.4 Add Environment Variables
Click "Environment Variables" and add:

**Name**: `VITE_API_URL`
**Value**: `https://YOUR-RAILWAY-URL-FROM-STEP-2/api`

**Name**: `VITE_STRIPE_PUBLIC_KEY`
**Value**: `pk_test_your_stripe_public_key`

- Click "Deploy"
- Wait 2 minutes

### 3.5 Get Your Website URL
- Once deployed, you'll see: "Congratulations!"
- Your site is live at: `https://something.vercel.app`
- Click "Visit" to see your platform

---

## Step 4: Update Backend with Frontend URL

- Go back to Railway
- Click on your backend service
- Go to "Variables"
- Find `FRONTEND_URL`
- Replace value with your Vercel URL: `https://your-site.vercel.app`
- Save

---

## Step 5: Get Stripe Keys (Optional - for payments)

If you want to accept real payments:

1. Go to: https://dashboard.stripe.com/register
2. Sign up (free, no credit card)
3. After signup, go to: https://dashboard.stripe.com/test/apikeys
4. Copy your keys:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)
5. Update in Railway (backend) and Vercel (frontend)
6. Redeploy both

---

## You're Live!

Your **MasterAIwithUS** platform is now public and accessible worldwide!

### Share Your Links:
- **Website**: https://your-site.vercel.app
- **API**: https://your-backend.up.railway.app

### Test It:
1. Visit your website
2. Click "Register"
3. Create a teacher account
4. Add a course
5. Register as a student (different email)
6. Browse and purchase courses

---

## What's Free?

- **Vercel**: Unlimited bandwidth, unlimited projects, free forever
- **Railway**: $5/month credit (enough for ~500 hours)
- **Stripe**: Free to use, they take 2.9% + $0.30 per transaction

Total monthly cost: **$0** (Railway's $5 credit is enough for most small apps)

---

## Troubleshooting

### Frontend shows errors?
- Make sure VITE_API_URL is correct in Vercel
- Check it ends with `/api`
- Redeploy frontend

### Backend not responding?
- Check Railway logs for errors
- Make sure DATABASE_URL is set (automatic)
- Restart the backend service

### Can't register users?
- Check Railway logs
- Make sure PostgreSQL is running
- Verify JWT_SECRET is set

---

## Custom Domain (Optional)

Want your own domain like `masteraiwithus.com`?

1. Buy domain from Namecheap (~$10/year)
2. In Vercel: Settings → Domains → Add domain
3. Update DNS records as shown
4. Wait 10 minutes

Done! Your site is at `https://masteraiwithus.com`

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Stripe Docs: https://stripe.com/docs

Congratulations on deploying your platform!

