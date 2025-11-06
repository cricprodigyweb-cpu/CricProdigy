# Deployment Guide - Crikprodigy

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** - For version control and Vercel integration
2. **Vercel Account** - For hosting the application
3. **MongoDB Atlas Account** - For production database
4. **Razorpay Account** - For payment processing
5. **Google Cloud Console** (Optional) - For OAuth
6. **AWS/Firebase Account** (Optional) - For media storage

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist IP addresses:
   - Add `0.0.0.0/0` for Vercel (allows all IPs)
   - Or specific Vercel IP ranges
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/crikprodigy?retryWrites=true&w=majority
   ```

## Step 2: Configure Razorpay

1. Sign up at [Razorpay](https://razorpay.com)
2. Complete KYC verification
3. Navigate to Settings → API Keys
4. Generate API keys for production
5. Set up webhooks:
   - URL: `https://your-domain.com/api/payments/webhook`
   - Events: `payment.captured`, `payment.failed`, `subscription.charged`
6. Save the webhook secret

## Step 3: Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-domain.com/api/auth/callback/google`
5. Copy Client ID and Client Secret

## Step 4: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Crikprodigy platform"

# Add remote repository
git remote add origin https://github.com/yourusername/crikprodigy.git

# Push to main branch
git push -u origin main
```

## Step 5: Deploy on Vercel

### Via Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-generated-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
   ```

6. Click "Deploy"

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Add environment variables
vercel env add MONGODB_URI
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
# ... add all other variables
```

## Step 6: Configure Custom Domain

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add `crikprodigy.com`
4. Update DNS records at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. Wait for DNS propagation (can take up to 48 hours)

## Step 7: Update Environment Variables

After deployment, update:

1. **NEXTAUTH_URL** to your custom domain:
   ```
   NEXTAUTH_URL=https://crikprodigy.com
   ```

2. **Google OAuth Redirect URI**:
   - Add `https://crikprodigy.com/api/auth/callback/google`

3. **Razorpay Webhook URL**:
   - Update to `https://crikprodigy.com/api/payments/webhook`

## Step 8: Test Production Deployment

### Test Authentication
1. Visit `https://crikprodigy.com`
2. Try signing up with email
3. Test Google OAuth login

### Test Course Enrollment
1. Browse courses
2. Enroll in a free course
3. Check dashboard for enrolled course

### Test Payment Flow
1. Go to subscription page
2. Select a paid plan
3. Complete Razorpay checkout
4. Verify subscription activation

### Test Video Upload (if implemented)
1. Upload a test video
2. Check storage integration
3. Verify trainer can access for review

## Step 9: Set Up Monitoring

### Vercel Analytics
1. Enable Analytics in Vercel project settings
2. Monitor page views, performance, and errors

### MongoDB Atlas Monitoring
1. Set up alerts for:
   - High connection count
   - Slow queries
   - Storage usage

### Error Tracking (Optional)
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Datadog for comprehensive monitoring

## Step 10: Configure CI/CD

Vercel automatically deploys on push to main branch.

### Optional: GitHub Actions

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint
      - name: Build project
        run: npm run build
```

## Environment-Specific Configuration

### Development
```bash
NEXTAUTH_URL=http://localhost:3000
```

### Staging
```bash
NEXTAUTH_URL=https://staging.crikprodigy.com
```

### Production
```bash
NEXTAUTH_URL=https://crikprodigy.com
```

## Security Checklist

- [ ] All environment variables are set
- [ ] NEXTAUTH_SECRET is a strong random string
- [ ] MongoDB is using Atlas with authentication
- [ ] Database user has minimum required permissions
- [ ] Razorpay webhook signature verification is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented (if needed)
- [ ] SSL/HTTPS is enforced

## Performance Optimization

### Next.js Optimizations
- ✅ Image optimization with next/image
- ✅ Font optimization with next/font
- ✅ Code splitting (automatic with App Router)

### Database Optimizations
- Add indexes on frequently queried fields
- Implement connection pooling
- Use projection to fetch only required fields

### CDN Configuration
- Vercel automatically provides CDN
- Consider Cloudflare for additional layer

## Backup Strategy

### Database Backups
- MongoDB Atlas provides automated backups
- Configure backup schedule in Atlas settings
- Test restore process regularly

### Code Backups
- GitHub serves as primary backup
- Consider mirroring to another service

## Troubleshooting

### Deployment Fails
1. Check build logs in Vercel
2. Verify all dependencies are in package.json
3. Ensure environment variables are set correctly

### Database Connection Issues
1. Check MongoDB Atlas IP whitelist
2. Verify connection string format
3. Ensure database user has correct permissions

### Payment Integration Issues
1. Check Razorpay dashboard for failed payments
2. Verify webhook signature validation
3. Check webhook logs in Vercel

### Authentication Issues
1. Verify NEXTAUTH_URL matches your domain
2. Check Google OAuth redirect URIs
3. Verify NEXTAUTH_SECRET is set

## Maintenance

### Regular Tasks
- Monitor application logs weekly
- Review MongoDB performance metrics
- Check Razorpay transaction reports
- Update dependencies monthly
- Review and optimize database queries
- Backup verification

### Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Support and Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Razorpay API Docs: https://razorpay.com/docs
