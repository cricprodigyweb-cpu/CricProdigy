import nodemailer from 'nodemailer';

// Normalize and validate SMTP credentials
const SMTP_EMAIL = process.env.SMTP_EMAIL;
// Some users paste the Gmail App Password with spaces (e.g. "xxxx xxxx xxxx xxxx").
// Gmail expects the 16-character password without spaces for SMTP auth.
const RAW_SMTP_APP_PASSWORD = process.env.SMTP_APP_PASSWORD ?? '';
const SMTP_APP_PASSWORD = RAW_SMTP_APP_PASSWORD.replace(/\s+/g, '');

if (!SMTP_EMAIL || !SMTP_APP_PASSWORD) {
  // Log a concise hint; avoid throwing so the app can still boot.
  console.error(
    'SMTP configuration error: missing SMTP_EMAIL or SMTP_APP_PASSWORD. Set them in your environment (.env.local/.env.production).'
  );
}

// Create transporter with SMTP configuration
const transporter = nodemailer.createTransport({
  // By default use Gmail service; you can override via env by setting host/port/secure in the future.
  service: 'gmail', // or 'hotmail', 'yahoo', etc.
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_APP_PASSWORD, // App password, not regular password (spaces removed)
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error(
      'SMTP configuration error: ',
      error?.code === 'EAUTH'
        ? 'Authentication failed. If using Gmail, ensure 2FA is enabled and use a 16-character App Password (no spaces).'
        : error
    );
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

export async function sendOTPEmail(email: string, otp: string, name: string) {
  const mailOptions = {
    from: `"CricProdigy" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: 'Verify your CricProdigy Account - OTP',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(to bottom, #0a0a0a, #111111); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1);">
                  
                  <!-- Header with Emerald Glow -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">CricProdigy</h1>
                      <p style="margin: 10px 0 0 0; color: rgba(0, 0, 0, 0.8); font-size: 14px;">Next Generation Cricket Training</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px;">Hi ${name}!</h2>
                      <p style="margin: 0 0 20px 0; color: #9ca3af; font-size: 16px; line-height: 1.6;">
                        Welcome to CricProdigy! We're excited to have you join our cricket training community.
                      </p>
                      <p style="margin: 0 0 30px 0; color: #9ca3af; font-size: 16px; line-height: 1.6;">
                        To complete your registration, please verify your email address using the OTP code below:
                      </p>
                      
                      <!-- OTP Box -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 30px 0;">
                            <div style="background: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; border-radius: 12px; padding: 20px 40px; display: inline-block;">
                              <p style="margin: 0 0 10px 0; color: #10b981; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                              <p style="margin: 0; color: #10b981; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 20px 0; color: #9ca3af; font-size: 14px; line-height: 1.6; text-align: center;">
                        This code will expire in <strong style="color: #10b981;">10 minutes</strong>
                      </p>
                      
                      <!-- Warning Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                        <tr>
                          <td style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; border-radius: 8px; padding: 15px 20px;">
                            <p style="margin: 0; color: #ef4444; font-size: 13px; line-height: 1.6;">
                              <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. CricProdigy will never ask for your OTP via phone or email.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid rgba(16, 185, 129, 0.2);">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
                        If you didn't request this code, please ignore this email.
                      </p>
                      <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 12px;">
                        © ${new Date().getFullYear()} CricProdigy. All rights reserved.
                      </p>
                      <p style="margin: 0; color: #10b981; font-size: 12px;">
                        Transforming cricket training through AI & ML technology
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `Hi ${name},

Welcome to CricProdigy!

Your OTP code is: ${otp}

This code will expire in 10 minutes.

Never share this OTP with anyone. CricProdigy will never ask for your OTP via phone or email.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} CricProdigy. All rights reserved.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
