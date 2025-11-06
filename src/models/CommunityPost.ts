import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  media: {
    type: 'image' | 'video';
    url: string;
  }[];
  likes: mongoose.Types.ObjectId[];
  comments: {
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  tags: string[];
  visibility: 'public' | 'followers' | 'premium';
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    media: [{
      type: { type: String, enum: ['image', 'video'] },
      url: String,
    }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      content: String,
      createdAt: { type: Date, default: Date.now },
    }],
    tags: [String],
    visibility: { 
      type: String, 
      enum: ['public', 'followers', 'premium'],
      default: 'public' 
    },
    isModerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.CommunityPost || mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema);
