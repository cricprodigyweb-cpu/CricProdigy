import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const SUBSCRIPTION_PLANS = {
  pro: {
    monthly: { amount: 49900, period: 'monthly' }, // ₹499
    yearly: { amount: 499900, period: 'yearly' },  // ₹4999
  },
  premium: {
    monthly: { amount: 149900, period: 'monthly' }, // ₹1499
    yearly: { amount: 1499900, period: 'yearly' },  // ₹14999
  },
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tier, period } = body;

    if (!tier || !period || !SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS]) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
      );
    }

    const plan = SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS][period as 'monthly' | 'yearly'];

    const options = {
      amount: plan.amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session.user.id,
        tier,
        period,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
