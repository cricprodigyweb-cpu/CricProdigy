import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  category: 'batting' | 'bowling' | 'fielding' | 'fitness' | 'mental-strength' | 'nutrition';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  instructor: mongoose.Types.ObjectId;
  modules: {
    title: string;
    order: number;
    lessons: {
      title: string;
      description: string;
      type: 'video' | 'pdf' | 'drill' | 'quiz';
      content: string; // URL or content reference
      duration?: number; // in minutes
      order: number;
    }[];
  }[];
  enrolledCount: number;
  rating: number;
  reviews: {
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  isPremium: boolean;
  requiredTier: 'free' | 'pro' | 'premium';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['batting', 'bowling', 'fielding', 'fitness', 'mental-strength', 'nutrition'],
      required: true 
    },
    skillLevel: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true 
    },
    thumbnail: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    modules: [{
      title: String,
      order: Number,
      lessons: [{
        title: String,
        description: String,
        type: { type: String, enum: ['video', 'pdf', 'drill', 'quiz'] },
        content: String,
        duration: Number,
        order: Number,
      }],
    }],
    enrolledCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    }],
    isPremium: { type: Boolean, default: false },
    requiredTier: { 
      type: String, 
      enum: ['free', 'pro', 'premium'],
      default: 'free' 
    },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
