# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub repository
- [ ] All dependencies are installed (`npm install` works)
- [ ] Application builds locally (`npm run build` completes successfully)
- [ ] Gemini API key is obtained from https://aistudio.google.com/app/apikey
- [ ] `.env` file is NOT committed to Git (it's in .gitignore)

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Select your repository
5. Click "Import"

**Option B: Using Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel
```

### Step 3: Configure Environment Variables

⚠️ **CRITICAL STEP** - Don't skip this!

1. In Vercel dashboard, go to your project
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Click "Add Variable"
5. Add the following:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your actual Gemini API key (starts with "AI...")
   - **Environments:** Check all (Preview, Development, Production)
6. Click "Save"

### Step 4: Redeploy (if needed)

After adding environment variables:
1. Go to "Deployments" tab
2. Click the three dots (⋮) on the latest deployment
3. Click "Redeploy"

OR trigger a new deployment:
```bash
git commit --allow-empty -m "Trigger redeployment"
git push
```

## 🔍 Verify Deployment

1. Open your deployed URL (e.g., `https://your-project.vercel.app`)
2. Test the application:
   - [ ] Enter some review text
   - [ ] Click "Analyze with AI"
   - [ ] Results should appear (rating, sentiment, pros, cons, summary)
   - [ ] Dark mode toggle works
   - [ ] Mobile responsive design works

## 🛠 Troubleshooting

### Build Fails
- Check "Functions" tab in Vercel for error logs
- Ensure `npm run build` works locally first
- Check Node.js version compatibility (should be 18+)

### API Not Working / Analysis Fails
- Most common issue: Missing `GEMINI_API_KEY` environment variable
- Verify API key is correct (no extra spaces)
- Check Vercel Functions logs for errors
- Test with sample reviews first

### Environment Variables Not Working
- Remember: Env vars require a **redeploy** to take effect
- Double-check the variable name is exactly `GEMINI_API_KEY`
- Ensure it's set for all environments (Production, Preview, Development)

## 📊 What Gets Deployed

- **Frontend:** Next.js static pages and React components
- **Backend:** API routes (serverless functions)
- **Styling:** TailwindCSS with dark/light mode
- **AI Integration:** Google Gemini API calls

## 🔐 Security Notes

- ✅ `.env` file is gitignored (never commit it!)
- ✅ API keys stored securely in Vercel
- ✅ Serverless functions run in isolated environment
- ✅ HTTPS enabled automatically by Vercel

## 🎯 Post-Deployment

### Update Custom Domain (Optional)
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Monitor Performance
- View analytics in Vercel dashboard
- Check Function execution times
- Monitor bandwidth usage

### Automatic Deployments
- Every push to `main` branch auto-deploys to Production
- Pull requests create Preview deployments
- Disable in Settings → Git if needed

## 📝 Configuration Files Added

These files make deployment seamless:

1. **vercel.json** - Vercel deployment configuration
2. **next.config.mjs** - Optimized for standalone deployment
3. **.env.example** - Template for environment variables
4. **.gitignore** - Prevents sensitive files from being committed

## 🆘 Need Help?

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment Guide: https://nextjs.org/docs/deployment
- Vercel Support: https://vercel.com/support

---

**Quick Start Command:**
```bash
vercel --prod
```
(Remember to set environment variables first!)
