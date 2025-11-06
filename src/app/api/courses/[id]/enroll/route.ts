import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import Progress from '@/models/Progress';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id: courseId } = await params;
    const userId = session.user.id;

    // Check if course exists and user has required subscription
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    
    // Check subscription tier requirements
    const tierHierarchy: Record<string, number> = { free: 0, pro: 1, premium: 2 };
    if ((tierHierarchy[user.subscriptionTier] || 0) < (tierHierarchy[course.requiredTier] || 0)) {
      return NextResponse.json(
        { error: 'Upgrade subscription to access this course' },
        { status: 403 }
      );
    }

    // Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return NextResponse.json(
        { message: 'Already enrolled' },
        { status: 200 }
      );
    }

    // Enroll user
    user.enrolledCourses.push(courseId);
    await user.save();

    // Create progress tracker
    await Progress.create({
      userId,
      courseId,
      percentComplete: 0,
    });

    // Update course enrolled count
    course.enrolledCount += 1;
    await course.save();

    return NextResponse.json(
      { message: 'Enrolled successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}
