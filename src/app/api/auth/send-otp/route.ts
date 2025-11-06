import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { generateOTP, sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    console.log('Generated OTP for', email, ':', otp); // For development debugging

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Store OTP in database
    await OTP.create({
      email,
      otp,
      name,
      password: hashedPassword,
    });

    // Send OTP via email
    try {
      await sendOTPEmail(email, otp, name);
      
      return NextResponse.json(
        {
          message: 'OTP sent successfully',
          email,
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Delete the OTP if email sending fails
      await OTP.deleteMany({ email });
      
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
