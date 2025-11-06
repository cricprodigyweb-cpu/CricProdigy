# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:
   - User Type: **External**
   - App name: **CricProdigy**
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes: `email`, `profile`
   - Add test users (your email addresses)

## Step 2: Configure OAuth Client

### Application Type
Select **Web application**

### Application Name
`CricProdigy`

### Authorized JavaScript origins

**For Local Development:**
```
http://localhost:3000
```

**For Production:**
```
https://yourdomain.com
```

### Authorized redirect URIs

**For Local Development:**
```
http://localhost:3000/api/auth/callback/google
```

**For Production:**
```
https://yourdomain.com/api/auth/callback/google
```

## Step 3: Update Environment Variables

After creating the OAuth client, you'll receive:
- **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-xyz123abc`)

Update your `.env` file:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

## Step 4: Test the Integration

1. Restart your development server
2. Go to the signup/signin page
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected to the dashboard

## Features Implemented

✅ **Desktop Profile Menu:**
- User avatar or initial circle
- Dropdown with user info
- Dashboard link
- Settings link
- Sign out button

✅ **Mobile Profile Menu:**
- User info in mobile nav
- Dashboard link
- Settings link  
- Sign out button

✅ **Authentication State:**
- Shows "Sign up" button when not authenticated
- Shows profile menu when authenticated
- Auto-creates user account on first Google sign-in

✅ **Google Sign-In:**
- One-click authentication
- Automatic user creation
- Avatar from Google profile
- Email verification not required

## Troubleshooting

### "Error: Invalid OAuth client"
- Check that your redirect URI matches exactly (including http/https)
- Verify Client ID and Secret are correct in `.env`

### "Error: Access blocked"
- Add your email as a test user in OAuth consent screen
- Publish the app (for production)

### Profile image not showing
- Make sure Next.js config allows Google images
- Add to `next.config.js`:
```javascript
images: {
  domains: ['lh3.googleusercontent.com'],
}
```

### Session not persisting
- Check NEXTAUTH_SECRET is set in `.env`
- Clear cookies and try again

## Production Deployment

Before deploying:

1. **Update redirect URIs** in Google Console with production domain
2. **Add production domain** to Authorized JavaScript origins
3. **Set environment variables** on hosting platform:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL` (production URL)
   - `NEXTAUTH_SECRET`

4. **Publish OAuth consent screen** (if using real user emails)

## Security Notes

- **NEVER** commit `.env` file
- **NEVER** expose Client Secret publicly
- Use different credentials for dev and production
- Regularly rotate secrets
- Keep OAuth consent screen information updated

## User Flow

### First Time Sign In:
1. User clicks "Continue with Google"
2. Google authentication popup
3. User grants permissions
4. Account created automatically
5. Redirected to dashboard

### Returning User:
1. User clicks "Continue with Google"
2. Instant sign-in (if Google session active)
3. Redirected to dashboard

---

**Support:** If you encounter issues, check the browser console and server logs for specific error messages.
