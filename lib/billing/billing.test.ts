import { describe, it, expect, vi } from 'vitest';
import crypto from 'crypto';
import {
  SUBSCRIPTION_PLANS,
  getSubscriptionPlan,
  checkPlanUsageLimits,
  PlanId,
} from './plans';
import {
  verifyRazorpayWebhookSignature,
  verifyRazorpayPaymentSignature,
} from './razorpay';
import {
  assertPlanBirdLimit,
  assertPlanShedLimit,
  assertPlanStaffLimit,
  assertPlanAILimit,
  PlanLimitError,
} from './guards';
import { POST as webhookHandler } from '../../app/api/webhooks/razorpay/route';
import { NextRequest } from 'next/server';

describe('Phase 6: SaaS Layer - Plan Definitions & Usage Checks', () => {
  it('correctly provides Starter plan boundaries', () => {
    const starter = getSubscriptionPlan('starter');
    expect(starter.id).toBe('starter');
    expect(starter.priceINR.monthly).toBe(0);
    expect(starter.limits.maxBirds).toBe(5000);
    expect(starter.limits.maxSheds).toBe(1);
    expect(starter.limits.maxStaff).toBe(1);
    expect(starter.limits.aiAdvisorEnabled).toBe(false);
  });

  it('correctly provides Grower Pro plan matching Maharashtra commercial farm scale', () => {
    const grower = getSubscriptionPlan('grower');
    expect(grower.id).toBe('grower');
    expect(grower.priceINR.monthly).toBe(999);
    expect(grower.priceINR.yearly).toBe(9990);
    expect(grower.limits.maxBirds).toBe(35000);
    expect(grower.limits.maxSheds).toBe(4);
    expect(grower.limits.maxStaff).toBe(5);
    expect(grower.limits.aiAdvisorEnabled).toBe(true);
    expect(grower.limits.whatsappExportEnabled).toBe(true);
  });

  it('evaluates plan usage limits and detects overages', () => {
    // Within limits for starter
    const okCheck = checkPlanUsageLimits('starter', {
      birdCount: 4000,
      shedCount: 1,
      staffCount: 1,
    });
    expect(okCheck.isWithinLimits).toBe(true);
    expect(okCheck.birdCapacityExceeded).toBe(false);

    // Over bird limit
    const birdExceeded = checkPlanUsageLimits('starter', {
      birdCount: 5001,
      shedCount: 1,
      staffCount: 1,
    });
    expect(birdExceeded.isWithinLimits).toBe(false);
    expect(birdExceeded.birdCapacityExceeded).toBe(true);

    // Over staff limit
    const staffExceeded = checkPlanUsageLimits('starter', {
      birdCount: 2000,
      shedCount: 1,
      staffCount: 2,
    });
    expect(staffExceeded.isWithinLimits).toBe(false);
    expect(staffExceeded.staffLimitExceeded).toBe(true);
  });
});

describe('Phase 6: SaaS Layer - Cryptographic Signature Verification', () => {
  const TEST_SECRET = 'whsec_test_layeros_secret_key_12345';
  const samplePayload = JSON.stringify({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_test_123456',
          amount: 99900,
          currency: 'INR',
        },
      },
    },
  });

  it('validates authentic Razorpay webhook HMAC-SHA256 signature', () => {
    const validSignature = crypto
      .createHmac('sha256', TEST_SECRET)
      .update(samplePayload)
      .digest('hex');

    const isValid = verifyRazorpayWebhookSignature(samplePayload, validSignature, TEST_SECRET);
    expect(isValid).toBe(true);
  });

  it('rejects tampered or forged webhook payload', () => {
    const validSignature = crypto
      .createHmac('sha256', TEST_SECRET)
      .update(samplePayload)
      .digest('hex');

    const tamperedPayload = samplePayload.replace('99900', '199900');
    const isValid = verifyRazorpayWebhookSignature(tamperedPayload, validSignature, TEST_SECRET);
    expect(isValid).toBe(false);
  });

  it('rejects invalid or missing signatures gracefully', () => {
    expect(verifyRazorpayWebhookSignature(samplePayload, 'bad_signature', TEST_SECRET)).toBe(false);
    expect(verifyRazorpayWebhookSignature('', 'bad_signature', TEST_SECRET)).toBe(false);
    expect(verifyRazorpayWebhookSignature(samplePayload, '', TEST_SECRET)).toBe(false);
  });

  it('verifies client checkout payment signature using orderId|paymentId formula', () => {
    const keySecret = 'rzp_key_secret_test_98765';
    const orderId = 'order_test_abc123';
    const paymentId = 'pay_test_xyz789';

    const validPaymentSig = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const verified = verifyRazorpayPaymentSignature({
      orderId,
      paymentId,
      signature: validPaymentSig,
      keySecret,
    });
    expect(verified).toBe(true);

    const forged = verifyRazorpayPaymentSignature({
      orderId: 'order_test_other',
      paymentId,
      signature: validPaymentSig,
      keySecret,
    });
    expect(forged).toBe(false);
  });
});

describe('Phase 6: SaaS Layer - Webhook HTTP Route Handler', () => {
  const TEST_SECRET = 'whsec_test_secret_for_route_999';

  it('returns 400 if x-razorpay-signature header is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/webhooks/razorpay', {
      method: 'POST',
      body: JSON.stringify({ event: 'payment.captured' }),
    });

    const res = await webhookHandler(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('Missing x-razorpay-signature');
  });

  it('returns 400 if x-razorpay-signature is invalid', async () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = TEST_SECRET;
    const body = JSON.stringify({ event: 'payment.captured' });

    const req = new NextRequest('http://localhost:3000/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': 'invalid_hex_signature',
      },
      body,
    });

    const res = await webhookHandler(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('Invalid webhook signature');
  });

  it('processes payment.captured event successfully with valid signature', async () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = TEST_SECRET;

    const payloadObj = {
      entity: 'event',
      account_id: 'acc_test_1',
      event: 'payment.captured',
      contains: ['payment'],
      payload: {
        payment: {
          entity: {
            id: 'pay_live_test_001',
            amount: 99900,
            currency: 'INR',
            status: 'captured',
            order_id: 'order_live_test_001',
            method: 'upi',
            notes: {
              farmId: 'farm-sahyadri-01',
              planId: 'grower',
              billingCycle: 'monthly',
            },
          },
        },
      },
      created_at: 1760000000,
    };

    const rawBody = JSON.stringify(payloadObj);
    const validSignature = crypto
      .createHmac('sha256', TEST_SECRET)
      .update(rawBody)
      .digest('hex');

    const req = new NextRequest('http://localhost:3000/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': validSignature,
      },
      body: rawBody,
    });

    const res = await webhookHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('success');
    expect(json.farmId).toBe('farm-sahyadri-01');
    expect(json.planId).toBe('grower');
  });
});

describe('Phase 6: SaaS Layer - Server-Side Plan Limit Enforcement', () => {
  it('blocks adding birds when Starter plan 5,000 limit is exceeded', () => {
    // 4,000 birds + 1,000 new = 5,000 <= 5,000 -> passes
    expect(() => assertPlanBirdLimit('starter', 4000, 1000)).not.toThrow();

    // 4,000 birds + 1,500 new = 5,500 > 5,000 -> throws PlanLimitError
    expect(() => assertPlanBirdLimit('starter', 4000, 1500)).toThrow(PlanLimitError);
    try {
      assertPlanBirdLimit('starter', 4000, 1500);
    } catch (err: any) {
      expect(err.code).toBe('BIRD_LIMIT_EXCEEDED');
      expect(err.currentValue).toBe(5500);
      expect(err.limitValue).toBe(5000);
    }
  });

  it('allows 30,000 reference day flock under Grower Pro plan, but blocks 40,000', () => {
    // Reference day flock of 30,000 birds passes under grower plan (max 35,000)
    expect(() => assertPlanBirdLimit('grower', 0, 30000)).not.toThrow();

    // 40,000 birds exceeds Grower limit (35,000)
    expect(() => assertPlanBirdLimit('grower', 0, 40000)).toThrow(PlanLimitError);
  });

  it('allows unlimited birds under Enterprise plan', () => {
    expect(() => assertPlanBirdLimit('enterprise', 100000, 200000)).not.toThrow();
  });

  it('blocks staff invitations on Starter plan when limit of 1 is reached', () => {
    // Current 1 staff (owner) + 1 invite = 2 > max 1
    expect(() => assertPlanStaffLimit('starter', 1)).toThrow(PlanLimitError);
    try {
      assertPlanStaffLimit('starter', 1);
    } catch (err: any) {
      expect(err.code).toBe('STAFF_LIMIT_EXCEEDED');
    }
  });

  it('allows up to 5 staff members on Grower Pro plan', () => {
    // 3 staff + 1 new = 4 <= 5 -> passes
    expect(() => assertPlanStaffLimit('grower', 3)).not.toThrow();

    // 5 staff + 1 new = 6 > 5 -> throws
    expect(() => assertPlanStaffLimit('grower', 5)).toThrow(PlanLimitError);
  });

  it('enforces AI feature entitlement per plan tier', () => {
    // Starter plan does not include Gemini AI advisor
    expect(() => assertPlanAILimit('starter')).toThrow(PlanLimitError);
    try {
      assertPlanAILimit('starter');
    } catch (err: any) {
      expect(err.code).toBe('AI_NOT_INCLUDED');
    }

    // Grower and Enterprise include AI
    expect(() => assertPlanAILimit('grower')).not.toThrow();
    expect(() => assertPlanAILimit('enterprise')).not.toThrow();
  });

  it('allows instantaneous unlocking of limits upon plan upgrade', () => {
    let farmPlan: PlanId = 'starter';
    const flockChicks = 30000;

    // Fails on starter
    expect(() => assertPlanBirdLimit(farmPlan, 0, flockChicks)).toThrow(PlanLimitError);

    // Upgrade to Grower Pro
    farmPlan = 'grower';

    // Now passes immediately!
    expect(() => assertPlanBirdLimit(farmPlan, 0, flockChicks)).not.toThrow();
  });
});
