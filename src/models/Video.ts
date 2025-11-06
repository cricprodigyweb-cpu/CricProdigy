import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: string;
  category: 'batting' | 'bowling' | 'fielding' | 'match' | 'practice';
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  feedback: {
    trainerId: mongoose.Types.ObjectId;
    comment: string;
    annotations: {
      timestamp: number;
      comment: string;
    }[];
    rating?: number;
    createdAt: Date;
  }[];
  visibility: 'private' | 'trainers-only' | 'public';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    videoUrl: { type: String, required: true },
    thumbnail: String,
    category: { 
      type: String, 
      enum: ['batting', 'bowling', 'fielding', 'match', 'practice'],
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'reviewed', 'approved', 'rejected'],
      default: 'pending' 
    },
    feedback: [{
      trainerId: { type: Schema.Types.ObjectId, ref: 'User' },
      comment: String,
      annotations: [{
        timestamp: Number,
        comment: String,
      }],
      rating: Number,
      createdAt: { type: Date, default: Date.now },
    }],
    visibility: { 
      type: String, 
      enum: ['private', 'trainers-only', 'public'],
      default: 'trainers-only' 
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
