import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { answers } = body;

    await connectDB();

    // Find user and update with onboarding data
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Extract specific data from answers
    const role = answers[1]; // Playing role
    const skillLevel = answers[2]; // Skill level
    const improvementAreas = answers[3]; // Areas to improve
    const trainingFrequency = answers[4]; // Training frequency
    const fitnessGoals = answers[5]; // Fitness goals
    const platformGoals = answers[6]; // Platform goals

    // Update user with onboarding data
    user.onboarding = {
      completed: true,
      completedAt: new Date(),
      role,
      skillLevel,
      improvementAreas,
      trainingFrequency,
      fitnessGoals,
      platformGoals,
    };

    // Also update skillLevel at root level if it exists
    if (skillLevel) {
      user.skillLevel = skillLevel;
    }

    await user.save();

    return NextResponse.json(
      {
        message: 'Onboarding completed successfully',
        onboarding: user.onboarding,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
