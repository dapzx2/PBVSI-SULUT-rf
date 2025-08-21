# Deployment Guide - PBVSI Sulut Website

## Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Git installed on your computer

### Step 1: Push to GitHub

1. Create a new repository on GitHub:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `pbvsi-sulut-website`
   - Make it public or private
   - Don't initialize with README (we already have files)

2. Push your code to GitHub:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit: PBVSI Sulut volleyball website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pbvsi-sulut-website.git
   git push -u origin main
   \`\`\`

### Step 2: Deploy to Vercel

1. **Option A: Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

2. **Option B: Deploy via Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   vercel login
   vercel --prod
   \`\`\`

### Step 3: Configure Domain (Optional)

1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Domains"
3. Add your custom domain (e.g., `pbvsisulut.com`)
4. Follow DNS configuration instructions

### Environment Variables

If you add any API keys or secrets later, add them in:
- Vercel Dashboard → Project → Settings → Environment Variables

### Automatic Deployments

- Every push to `main` branch will trigger automatic deployment
- Preview deployments for pull requests
- Rollback capability in Vercel dashboard

## Alternative Deployment Options

### Deploy to Netlify

1. Connect GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Deploy

### Deploy to Railway

1. Connect GitHub to Railway
2. Select Next.js template
3. Deploy automatically

### Deploy to DigitalOcean App Platform

1. Create new app from GitHub
2. Select repository
3. Configure build settings
4. Deploy

## Performance Optimizations

The website is already optimized with:
- ✅ Next.js App Router
- ✅ Image optimization
- ✅ Static generation where possible
- ✅ Responsive design
- ✅ SEO-friendly structure
- ✅ Fast loading animations

## Monitoring

After deployment, monitor:
- Page load speeds
- Core Web Vitals
- Error rates
- User analytics

## Support

For deployment issues:
- Check Vercel documentation
- Review build logs
- Contact support if needed
