import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  role: 'user' | 'trainer' | 'admin';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  avatar?: string;
  subscriptionTier: 'free' | 'pro' | 'premium';
  subscriptionExpiry?: Date;
  razorpayCustomerId?: string;
  enrolledCourses: mongoose.Types.ObjectId[];
  achievements: {
    badgeId: string;
    name: string;
    earnedAt: Date;
  }[];
  preferences: {
    interests: string[];
    goals: string[];
  };
  onboarding?: {
    completed: boolean;
    completedAt?: Date;
    role?: string;
    skillLevel?: string;
    improvementAreas?: string[];
    trainingFrequency?: string;
    fitnessGoals?: string[];
    platformGoals?: string[];
  };
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },
    role: { 
      type: String, 
      enum: ['user', 'trainer', 'admin'], 
      default: 'user' 
    },
    skillLevel: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'], 
      default: 'beginner' 
    },
    avatar: { type: String },
    subscriptionTier: { 
      type: String, 
      enum: ['free', 'pro', 'premium'], 
      default: 'free' 
    },
    subscriptionExpiry: { type: Date },
    razorpayCustomerId: { type: String },
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    achievements: [{
      badgeId: String,
      name: String,
      earnedAt: Date,
    }],
    preferences: {
      interests: [String],
      goals: [String],
    },
    onboarding: {
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      role: { type: String },
      skillLevel: { type: String },
      improvementAreas: [{ type: String }],
      trainingFrequency: { type: String },
      fitnessGoals: [{ type: String }],
      platformGoals: [{ type: String }],
    },
    emailVerified: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
