import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature, RazorpayWebhookPayload } from '@/lib/billing/razorpay';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { PlanId, BillingCycle } from '@/lib/billing/plans';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing x-razorpay-signature header' },
        { status: 400 }
      );
    }

    const rawBody = await req.text();
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.warn('⚠️ Rejected Razorpay webhook: invalid signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
    const { event } = payload;

    const supabase = await getSupabaseServerClient();

    // 1. PAYMENT CAPTURED / ORDER PAID
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload.payment?.entity;
      const orderEntity = payload.payload.order?.entity;
      const notes = paymentEntity?.notes || orderEntity?.notes || {};

      const farmId = notes.farmId;
      const planId = (notes.planId || 'grower') as PlanId;
      const billingCycle = (notes.billingCycle || 'monthly') as BillingCycle;
      const amountPaise = paymentEntity?.amount || orderEntity?.amount || 0;
      const paymentId = paymentEntity?.id || null;
      const orderId = paymentEntity?.order_id || orderEntity?.id || null;

      if (farmId && supabase) {
        const daysToAdd = billingCycle === 'yearly' ? 365 : 30;
        const periodEnd = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

        // Update subscription
        await (supabase as any)
          .from('subscriptions')
          .upsert({
            farm_id: farmId,
            plan_id: planId,
            status: 'active',
            billing_cycle: billingCycle,
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'farm_id' });

        // Record billing invoice
        await (supabase as any)
          .from('billing_invoices')
          .insert({
            farm_id: farmId,
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId,
            razorpay_signature: signature,
            amount_paise: amountPaise,
            currency: 'INR',
            status: 'paid',
            invoice_number: `INV-${Date.now().toString().slice(-6)}`,
          });
      }

      return NextResponse.json({
        status: 'success',
        event,
        farmId,
        planId,
      });
    }

    // 2. SUBSCRIPTION ACTIVATED / CHARGED
    if (event === 'subscription.activated' || event === 'subscription.charged') {
      const subEntity = payload.payload.subscription?.entity;
      const notes = subEntity?.notes || {};
      const farmId = notes.farmId;
      const planId = (notes.planId || 'grower') as PlanId;

      if (farmId && supabase) {
        const periodEnd = subEntity?.current_end
          ? new Date(subEntity.current_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        await (supabase as any)
          .from('subscriptions')
          .upsert({
            farm_id: farmId,
            plan_id: planId,
            status: 'active',
            razorpay_subscription_id: subEntity?.id,
            razorpay_customer_id: subEntity?.customer_id,
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'farm_id' });
      }

      return NextResponse.json({ status: 'success', event, farmId });
    }

    // 3. SUBSCRIPTION CANCELLED / HALTED
    if (event === 'subscription.cancelled' || event === 'subscription.halted') {
      const subEntity = payload.payload.subscription?.entity;
      const subId = subEntity?.id;

      if (subId && supabase) {
        await (supabase as any)
          .from('subscriptions')
          .update({
            status: event === 'subscription.cancelled' ? 'canceled' : 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_subscription_id', subId);
      }

      return NextResponse.json({ status: 'success', event, subscriptionId: subId });
    }

    return NextResponse.json({ status: 'ignored', event });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
