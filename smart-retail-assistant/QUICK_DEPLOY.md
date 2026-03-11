# 🚀 Quick Start Deployment Guide

## 3-Step Deployment (5 minutes total)

### Step 1: Push to GitHub (1 minute)

Open your terminal and run:

```bash
cd smart-retail-assistant
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel (2 minutes)

**Option A - Easiest (Recommended for first time):**

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"** (use GitHub account)
3. Click **"Add New Project"**
4. Select your `smart-retail-assistant` repository
5. Click **"Import"**
6. **Don't click Deploy yet!** → Go to Step 3 first

**Option B - Using CLI (Faster if you have Vercel account):**

```bash
npm install -g vercel
vercel login
vercel
```

### Step 3: Add API Key (CRITICAL - 2 minutes)

1. **Get your Gemini API key:**
   - Go to: https://aistudio.google.com/app/apikey
   - Sign in with Google
   - Click **"Create API Key"**
   - Copy the key (starts with "AI...")

2. **Add to Vercel:**
   - In Vercel project dashboard
   - Go to **Settings** → **Environment Variables**
   - Click **"Add Variable"**
   - Name: `GEMINI_API_KEY`
   - Value: Paste your API key
   - Check all environments (Preview, Development, Production)
   - Click **"Save"**

3. **Deploy:**
   - Go back to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment
   - Wait 2-3 minutes

## ✅ Done! Your app is live at:
```
https://your-project.vercel.app
```

---

## Test Your App

1. Open your deployed URL
2. Enter some review text
3. Click "Analyze with AI"
4. See random analysis results! 🎉

---

## Troubleshooting

**Analysis not working?**
→ Double-check API key in Vercel settings

**Build failed?**
→ Check build logs in Vercel dashboard

**Need to update code?**
→ Just push to GitHub, Vercel auto-deploys!

---

## What's Next?

- Share your live URL
- Add a custom domain (optional)
- Monitor analytics in Vercel dashboard

**Full documentation:** See `DEPLOYMENT.md` for detailed guide
