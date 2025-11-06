import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  tier: 'pro' | 'premium';
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  amount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentHistory: {
    amount: number;
    razorpayPaymentId: string;
    status: string;
    paidAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tier: { 
      type: String, 
      enum: ['pro', 'premium'],
      required: true 
    },
    razorpaySubscriptionId: String,
    razorpayPaymentId: String,
    status: { 
      type: String, 
      enum: ['active', 'cancelled', 'expired', 'pending'],
      default: 'pending' 
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    paymentHistory: [{
      amount: Number,
      razorpayPaymentId: String,
      status: String,
      paidAt: Date,
    }],
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
