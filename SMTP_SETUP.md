# OTP Email Verification Setup Guide

## Overview
Your CricProdigy app now has OTP (One-Time Password) email verification during signup. Users will receive a 6-digit code via email that they must enter to complete registration.

## Setup Steps

### 1. Install Nodemailer
Run this command in your project directory:
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### 2. Configure Gmail App Password

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the steps to enable it

#### Step 2: Generate App Password
1. After enabling 2-Step Verification, go back to Security
2. Under "Signing in to Google", click on "App passwords"
3. Select app: "Mail"
4. Select device: "Other (Custom name)" and enter "CricProdigy"
5. Click "Generate"
6. Copy the 16-character password (remove spaces)

#### Step 3: Update .env File
Open your `.env` file and update these variables:
```env
SMTP_EMAIL=your-email@gmail.com
SMTP_APP_PASSWORD=abcd efgh ijkl mnop
```

**Important Notes:**
- Use your actual Gmail address for `SMTP_EMAIL`
- Paste the 16-character app password and REMOVE SPACES (e.g. `abcd efgh ijkl mnop` -> `abcdefghijklmnop`)
- **NEVER** commit the `.env` file to version control
- **NEVER** use your regular Gmail password

### 3. Using Other Email Providers

#### For Outlook/Hotmail:
```typescript
// In src/lib/email.ts, change:
service: 'outlook',  // instead of 'gmail'
```

#### For Yahoo:
```typescript
service: 'yahoo',
```

#### For Custom SMTP:
```typescript
host: 'smtp.yourdomain.com',
port: 587,
secure: false,
auth: {
  user: process.env.SMTP_EMAIL,
  pass: process.env.SMTP_APP_PASSWORD,
},
```

## How It Works

### User Flow:
1. **Sign Up**: User fills out the signup form
2. **Send OTP**: System generates a 6-digit OTP and sends it via email
3. **Verify**: User enters the OTP code
4. **Complete**: If OTP is valid, account is created and user is signed in

### Technical Flow:
1. `/api/auth/send-otp` - Generates OTP, stores in database with TTL of 10 minutes
2. Email sent using Nodemailer with beautiful HTML template
3. `/api/auth/verify-otp` - Verifies the OTP and creates the user account
4. OTP automatically deleted after verification or expiration

## Security Features

✅ **OTP Expiration**: Codes expire after 10 minutes
✅ **One-Time Use**: OTP is deleted after successful verification
✅ **Email Verification**: Ensures users own the email address
✅ **Password Hashing**: Passwords are bcrypt hashed before storage
✅ **Rate Limiting**: Consider adding rate limiting to prevent spam

## Testing

### Development Testing:
1. Check console logs for OTP codes (for debugging)
2. Use a real email address you can access
3. OTP codes are visible in console: `Generated OTP for email : 123456`

### Email Template:
The OTP email includes:
- CricProdigy branding with emerald theme
- Clear 6-digit OTP code
- Expiration notice (10 minutes)
- Security warning
- Mobile-responsive design

## Troubleshooting

### Email Not Sending?
1. **Check Credentials**: Verify `SMTP_EMAIL` and `SMTP_APP_PASSWORD` in `.env`
2. **App Password**: Make sure you're using an app password, not your regular password
3. **2FA**: Ensure 2-Factor Authentication is enabled on your Google account
4. **Firewall**: Check if port 587 (SMTP) is blocked
5. **Logs**: Check console for specific error messages

### "SMTP configuration error"
- Your credentials are incorrect
- App password may have expired
- Gmail account may have security restrictions

### "Failed to send OTP email"
- Network connectivity issues
- Gmail daily send limit reached (500 emails/day for free accounts)
- Recipient email is invalid

### OTP Expired
- User took more than 10 minutes to enter OTP
- Ask user to request a new OTP

## MongoDB TTL Index

The OTP collection automatically deletes expired records using MongoDB's TTL (Time To Live) indexes:
```javascript
expires: 600, // 600 seconds = 10 minutes
```

Make sure your MongoDB version supports TTL indexes (MongoDB 2.2+).

## Production Considerations

### Before Going Live:
1. **Remove Console Logs**: Remove `console.log` statements that print OTPs
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Email Service**: Consider using a dedicated email service like:
   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark
4. **Monitoring**: Set up monitoring for email delivery failures
5. **Error Handling**: Implement proper error notifications

### Environment Variables:
Ensure all production environments have:
```env
SMTP_EMAIL=production-email@gmail.com
SMTP_APP_PASSWORD=production-app-password
```

## API Endpoints

### POST `/api/auth/send-otp`
Generates and sends OTP to user's email
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "password": "securepassword"
}
```

### POST `/api/auth/verify-otp`
Verifies OTP and creates user account
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

## Support

If you encounter any issues:
1. Check the console logs for specific error messages
2. Verify your `.env` configuration
3. Test with a different email provider
4. Ensure MongoDB is running and accessible

## Email Template Customization

To customize the email template, edit `src/lib/email.ts`:
- Change colors (currently emerald/green theme)
- Modify text and messaging
- Add your logo
- Update footer information

---

**Security Reminder**: Never share your app password or commit it to version control!
