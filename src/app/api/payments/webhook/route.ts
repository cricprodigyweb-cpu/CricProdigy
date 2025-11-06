import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    await connectDB();

    // Handle payment success
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const { userId, tier, period } = payment.notes;

      const startDate = new Date();
      const endDate = new Date(startDate);
      
      if (period === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Create subscription record
      await Subscription.create({
        userId,
        tier,
        razorpayPaymentId: payment.id,
        status: 'active',
        amount: payment.amount / 100,
        currency: payment.currency,
        startDate,
        endDate,
        paymentHistory: [{
          amount: payment.amount / 100,
          razorpayPaymentId: payment.id,
          status: 'captured',
          paidAt: new Date(),
        }],
      });

      // Update user subscription
      await User.findByIdAndUpdate(userId, {
        subscriptionTier: tier,
        subscriptionExpiry: endDate,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
