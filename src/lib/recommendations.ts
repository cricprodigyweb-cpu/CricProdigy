import { connectDB } from './mongodb';
import Course from '@/models/Course';
import Progress from '@/models/Progress';
import User from '@/models/User';

interface RecommendationInput {
  userId: string;
  limit?: number;
}

/**
 * Basic AI recommendation engine for courses
 * Considers user's skill level, completed courses, and interests
 */
export async function getPersonalizedRecommendations({
  userId,
  limit = 5,
}: RecommendationInput) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) {
    return [];
  }

  const completedCourses = await Progress.find({
    userId,
    percentComplete: 100,
  }).select('courseId');

  const completedCourseIds = completedCourses.map((p) => p.courseId);

  // Get courses matching user's skill level and interests
  const query: any = {
    _id: { $nin: [...user.enrolledCourses, ...completedCourseIds] },
    skillLevel: user.skillLevel,
  };

  // Filter by user interests if available
  if (user.preferences?.interests?.length > 0) {
    query.category = { $in: user.preferences.interests };
  }

  const recommendations = await Course.find(query)
    .populate('instructor', 'name avatar')
    .sort({ rating: -1, enrolledCount: -1 })
    .limit(limit);

  // If not enough recommendations, add popular courses
  if (recommendations.length < limit) {
    const popularCourses = await Course.find({
      _id: { $nin: [...user.enrolledCourses, ...completedCourseIds] },
    })
      .populate('instructor', 'name avatar')
      .sort({ enrolledCount: -1, rating: -1 })
      .limit(limit - recommendations.length);

    recommendations.push(...popularCourses);
  }

  return recommendations;
}

/**
 * Calculate user engagement score
 * Based on completed lessons, quiz scores, and consistency
 */
export function calculateEngagementScore(progressData: any[]) {
  if (progressData.length === 0) return 0;

  let totalScore = 0;

  progressData.forEach((progress) => {
    // Progress completion weight (40%)
    totalScore += (progress.percentComplete / 100) * 0.4;

    // Quiz performance weight (30%)
    if (progress.quizScores?.length > 0) {
      const avgQuizScore =
        progress.quizScores.reduce((sum: number, q: any) => sum + q.score, 0) /
        progress.quizScores.length;
      totalScore += (avgQuizScore / 100) * 0.3;
    }

    // Activity recency weight (30%)
    const daysSinceLastAccess = Math.floor(
      (Date.now() - new Date(progress.lastAccessedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const recencyScore = Math.max(0, 1 - daysSinceLastAccess / 30);
    totalScore += recencyScore * 0.3;
  });

  return Math.round((totalScore / progressData.length) * 100);
}

/**
 * Generate insights report for user
 */
export async function generateUserInsights(userId: string) {
  await connectDB();

  const user = await User.findById(userId);
  const progressData = await Progress.find({ userId });

  const insights = {
    engagementScore: calculateEngagementScore(progressData),
    strengths: [] as string[],
    areasToImprove: [] as string[],
    recommendedDrills: [] as string[],
    nextMilestone: '',
  };

  // Analyze category-wise performance
  const categoryPerformance: Record<string, number[]> = {};

  for (const progress of progressData) {
    const course = await Course.findById(progress.courseId);
    if (course) {
      if (!categoryPerformance[course.category]) {
        categoryPerformance[course.category] = [];
      }
      categoryPerformance[course.category].push(progress.percentComplete);
    }
  }

  // Identify strengths (categories with >70% avg completion)
  // Identify areas to improve (categories with <50% avg completion)
  Object.entries(categoryPerformance).forEach(([category, scores]) => {
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avgScore > 70) {
      insights.strengths.push(category);
    } else if (avgScore < 50) {
      insights.areasToImprove.push(category);
    }
  });

  // Set next milestone
  const completedCourses = progressData.filter((p) => p.percentComplete === 100).length;
  const nextMilestoneCount = Math.ceil((completedCourses + 1) / 5) * 5;
  insights.nextMilestone = `Complete ${nextMilestoneCount} courses`;

  return insights;
}
