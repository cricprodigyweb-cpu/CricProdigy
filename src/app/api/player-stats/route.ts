import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import PlayerStats from '@/models/PlayerStats';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create player stats
    let playerStats = await PlayerStats.findOne({ userId: user._id });
    
    if (!playerStats) {
      // Create default stats for new user
      playerStats = await PlayerStats.create({
        userId: user._id,
        batting: {
          matches: 0,
          innings: 0,
          runs: 0,
          highestScore: 0,
          average: 0,
          strikeRate: 0,
          centuries: 0,
          halfCenturies: 0,
          sixes: 0,
          fours: 0,
          ballsFaced: 0,
        },
        bowling: {
          matches: 0,
          innings: 0,
          wickets: 0,
          bestBowling: '0/0',
          average: 0,
          economy: 0,
          strikeRate: 0,
          fiveWickets: 0,
          maidens: 0,
          runsConceded: 0,
          ballsBowled: 0,
        },
        fielding: {
          matches: 0,
          catches: 0,
          runOuts: 0,
          stumpings: 0,
        },
        fitness: {
          lastUpdated: new Date(),
          weight: 0,
          height: 0,
          bmi: 0,
          bodyFatPercentage: 0,
          vo2Max: 0,
          restingHeartRate: 72,
        },
        training: {
          totalHours: 0,
          weeklyHours: 0,
          sessionsCompleted: 0,
          focusAreas: [],
        },
        performance: {
          overallRating: 0,
          battingRating: 0,
          bowlingRating: 0,
          fieldingRating: 0,
          fitnessRating: 0,
          consistency: 0,
          improvementRate: 0,
        },
        goals: {
          current: [],
          completed: [],
        },
        coachNotes: [],
      });
    }

    return NextResponse.json({ success: true, data: playerStats });
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player statistics' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { section, data } = body;

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update player stats
    const updateData: any = {};
    updateData[section] = data;

    const playerStats = await PlayerStats.findOneAndUpdate(
      { userId: user._id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: playerStats });
  } catch (error) {
    console.error('Error updating player stats:', error);
    return NextResponse.json(
      { error: 'Failed to update player statistics' },
      { status: 500 }
    );
  }
}
