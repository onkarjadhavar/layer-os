import crypto from 'crypto';
import { PlanId, BillingCycle, SUBSCRIPTION_PLANS } from './plans';

export interface RazorpayOrderResult {
  id: string;
  entity: string;
  amount: number; // in paise
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid';
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: 
    | 'payment.authorized'
    | 'payment.captured'
    | 'payment.failed'
    | 'order.paid'
    | 'subscription.authenticated'
    | 'subscription.activated'
    | 'subscription.charged'
    | 'subscription.halted'
    | 'subscription.cancelled'
    | 'subscription.paused'
    | 'subscription.resumed';
  contains: string[];
  payload: {
    payment?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        invoice_id?: string;
        method: string;
        email?: string;
        contact?: string;
        notes?: Record<string, string>;
      };
    };
    order?: {
      entity: {
        id: string;
        amount: number;
        amount_paid: number;
        status: string;
        notes?: Record<string, string>;
      };
    };
    subscription?: {
      entity: {
        id: string;
        plan_id: string;
        customer_id: string;
        status: string;
        current_end: number;
        notes?: Record<string, string>;
      };
    };
  };
  created_at: number;
}

/**
 * Verifies Razorpay Webhook signature using constant-time HMAC-SHA256 comparison.
 * Protects against timing attacks and spoofed webhook calls.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret?: string
): boolean {
  const secret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature || !rawBody) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const actualBuffer = Buffer.from(signature, 'utf8');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (err) {
    console.error('Razorpay signature verification error:', err);
    return false;
  }
}

/**
 * Verifies Razorpay client-side payment completion signature
 * Formula: HMAC_SHA256(order_id + "|" + razorpay_payment_id, key_secret)
 */
export function verifyRazorpayPaymentSignature({
  orderId,
  paymentId,
  signature,
  keySecret,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  keySecret?: string;
}): boolean {
  const secret = keySecret || process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !orderId || !paymentId || !signature) {
    return false;
  }

  try {
    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const actualBuffer = Buffer.from(signature, 'utf8');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (err) {
    console.error('Razorpay payment signature check failed:', err);
    return false;
  }
}

/**
 * Creates an order via Razorpay API or generates a safe demo sandbox order
 */
export async function createRazorpayOrder({
  farmId,
  planId,
  billingCycle,
  userEmail,
  userPhone,
}: {
  farmId: string;
  planId: PlanId;
  billingCycle: BillingCycle;
  userEmail?: string;
  userPhone?: string;
}): Promise<RazorpayOrderResult> {
  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan) {
    throw new Error(`Invalid plan specified: ${planId}`);
  }

  const priceInr = plan.priceINR[billingCycle];
  const amountPaise = priceInr * 100;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const receipt = `rcpt_${farmId.slice(0, 8)}_${Date.now()}`;
  const notes = {
    farmId,
    planId,
    billingCycle,
    userEmail: userEmail || '',
    userPhone: userPhone || '',
  };

  // If live credentials exist, hit Razorpay Orders API
  if (keyId && keySecret) {
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        receipt,
        notes,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Razorpay Order API failed:', errorText);
      throw new Error(`Razorpay Order creation failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Safe Sandbox / Demo Order
  return {
    id: `order_mock_${Date.now()}`,
    entity: 'order',
    amount: amountPaise,
    amount_paid: 0,
    amount_due: amountPaise,
    currency: 'INR',
    receipt,
    status: 'created',
    attempts: 0,
    notes,
    created_at: Math.floor(Date.now() / 1000),
  };
}
