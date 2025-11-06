import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedLessons: string[]; // lesson IDs
  quizScores: {
    lessonId: string;
    score: number;
    attempts: number;
    lastAttempt: Date;
  }[];
  percentComplete: number;
  lastAccessedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [String],
    quizScores: [{
      lessonId: String,
      score: Number,
      attempts: Number,
      lastAttempt: Date,
    }],
    percentComplete: { type: Number, default: 0 },
    lastAccessedAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  { timestamps: true }
);

ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);
