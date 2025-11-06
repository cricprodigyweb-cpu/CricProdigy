import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayerStats extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Batting Stats
  batting: {
    matches: number;
    innings: number;
    runs: number;
    highestScore: number;
    average: number;
    strikeRate: number;
    centuries: number;
    halfCenturies: number;
    sixes: number;
    fours: number;
    ballsFaced: number;
  };
  
  // Bowling Stats
  bowling: {
    matches: number;
    innings: number;
    wickets: number;
    bestBowling: string;
    average: number;
    economy: number;
    strikeRate: number;
    fiveWickets: number;
    maidens: number;
    runsConceded: number;
    ballsBowled: number;
  };
  
  // Fielding Stats
  fielding: {
    matches: number;
    catches: number;
    runOuts: number;
    stumpings: number;
  };
  
  // Fitness & Training
  fitness: {
    lastUpdated: Date;
    weight: number;
    height: number;
    bmi: number;
    bodyFatPercentage: number;
    vo2Max: number;
    restingHeartRate: number;
  };
  
  // Training Sessions
  training: {
    totalHours: number;
    weeklyHours: number;
    sessionsCompleted: number;
    lastSessionDate: Date;
    focusAreas: string[];
  };
  
  // Performance Metrics
  performance: {
    overallRating: number;
    battingRating: number;
    bowlingRating: number;
    fieldingRating: number;
    fitnessRating: number;
    consistency: number;
    improvementRate: number;
  };
  
  // Goals & Achievements
  goals: {
    current: {
      title: string;
      target: number;
      current: number;
      deadline: Date;
      type: 'batting' | 'bowling' | 'fielding' | 'fitness';
    }[];
    completed: {
      title: string;
      completedAt: Date;
    }[];
  };
  
  // Coach Notes
  coachNotes: {
    coachId: mongoose.Types.ObjectId;
    coachName: string;
    note: string;
    category: 'batting' | 'bowling' | 'fielding' | 'fitness' | 'mental';
    createdAt: Date;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const PlayerStatsSchema = new Schema<IPlayerStats>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    batting: {
      matches: { type: Number, default: 0 },
      innings: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0 },
      centuries: { type: Number, default: 0 },
      halfCenturies: { type: Number, default: 0 },
      sixes: { type: Number, default: 0 },
      fours: { type: Number, default: 0 },
      ballsFaced: { type: Number, default: 0 },
    },
    
    bowling: {
      matches: { type: Number, default: 0 },
      innings: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      bestBowling: { type: String, default: '0/0' },
      average: { type: Number, default: 0 },
      economy: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0 },
      fiveWickets: { type: Number, default: 0 },
      maidens: { type: Number, default: 0 },
      runsConceded: { type: Number, default: 0 },
      ballsBowled: { type: Number, default: 0 },
    },
    
    fielding: {
      matches: { type: Number, default: 0 },
      catches: { type: Number, default: 0 },
      runOuts: { type: Number, default: 0 },
      stumpings: { type: Number, default: 0 },
    },
    
    fitness: {
      lastUpdated: { type: Date, default: Date.now },
      weight: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      bmi: { type: Number, default: 0 },
      bodyFatPercentage: { type: Number, default: 0 },
      vo2Max: { type: Number, default: 0 },
      restingHeartRate: { type: Number, default: 0 },
    },
    
    training: {
      totalHours: { type: Number, default: 0 },
      weeklyHours: { type: Number, default: 0 },
      sessionsCompleted: { type: Number, default: 0 },
      lastSessionDate: { type: Date },
      focusAreas: [{ type: String }],
    },
    
    performance: {
      overallRating: { type: Number, default: 0 },
      battingRating: { type: Number, default: 0 },
      bowlingRating: { type: Number, default: 0 },
      fieldingRating: { type: Number, default: 0 },
      fitnessRating: { type: Number, default: 0 },
      consistency: { type: Number, default: 0 },
      improvementRate: { type: Number, default: 0 },
    },
    
    goals: {
      current: [{
        title: String,
        target: Number,
        current: Number,
        deadline: Date,
        type: { type: String, enum: ['batting', 'bowling', 'fielding', 'fitness'] },
      }],
      completed: [{
        title: String,
        completedAt: Date,
      }],
    },
    
    coachNotes: [{
      coachId: { type: Schema.Types.ObjectId, ref: 'User' },
      coachName: String,
      note: String,
      category: { type: String, enum: ['batting', 'bowling', 'fielding', 'fitness', 'mental'] },
      createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

export default mongoose.models.PlayerStats || mongoose.model<IPlayerStats>('PlayerStats', PlayerStatsSchema);
