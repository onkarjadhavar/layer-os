'use server';

import { PlanId, BillingCycle, FarmSubscriptionState, getSubscriptionPlan } from './plans';
import { createRazorpayOrder, verifyRazorpayPaymentSignature } from './razorpay';
import { getFarmSubscriptionServer } from './server-guards';
import { getSupabaseServerClient } from '../supabase/server';

export interface BillingActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BillingInvoiceRecord {
  id: string;
  farmId: string;
  paymentId: string | null;
  orderId: string | null;
  amountInr: number;
  status: string;
  invoiceNumber: string;
  createdAt: string;
}

/**
 * Server Action: Fetches active farm subscription state
 */
export async function getFarmSubscriptionAction(
  farmId: string
): Promise<BillingActionResult<FarmSubscriptionState>> {
  try {
    const sub = await getFarmSubscriptionServer(farmId);
    return { success: true, data: sub };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Creates Razorpay order for subscription upgrade
 */
export async function createCheckoutOrderAction(
  farmId: string,
  planId: PlanId,
  billingCycle: BillingCycle,
  userEmail?: string,
  userPhone?: string
): Promise<BillingActionResult<{ orderId: string; amountPaise: number; currency: string; keyId?: string }>> {
  try {
    const order = await createRazorpayOrder({
      farmId,
      planId,
      billingCycle,
      userEmail,
      userPhone,
    });

    return {
      success: true,
      data: {
        orderId: order.id,
        amountPaise: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Verifies Razorpay payment signature and upgrades subscription
 */
export async function verifyPaymentAndUpgradeAction(
  farmId: string,
  planId: PlanId,
  billingCycle: BillingCycle,
  paymentId: string,
  orderId: string,
  signature: string
): Promise<BillingActionResult<FarmSubscriptionState>> {
  try {
    const isMockOrder = orderId.startsWith('order_mock_');
    const hasLiveKeys = Boolean(process.env.RAZORPAY_KEY_SECRET);

    // If live keys exist and not a mock order, verify strict cryptographic signature
    if (hasLiveKeys && !isMockOrder) {
      const isValid = verifyRazorpayPaymentSignature({
        orderId,
        paymentId,
        signature,
      });

      if (!isValid) {
        return { success: false, error: 'Invalid payment signature. Verification failed.' };
      }
    }

    const plan = getSubscriptionPlan(planId);
    const days = billingCycle === 'yearly' ? 365 : 30;
    const periodEnd = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    const supabase = await getSupabaseServerClient();
    if (supabase) {
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

      await (supabase as any)
        .from('billing_invoices')
        .insert({
          farm_id: farmId,
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
          amount_paise: plan.priceINR[billingCycle] * 100,
          currency: 'INR',
          status: 'paid',
          invoice_number: `INV-${Date.now().toString().slice(-6)}`,
        });
    }

    return {
      success: true,
      data: {
        farmId,
        planId,
        status: 'active',
        billingCycle,
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Fetches billing and invoice history for a farm
 */
export async function getBillingInvoicesAction(
  farmId: string
): Promise<BillingActionResult<BillingInvoiceRecord[]>> {
  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) {
      // Mock seed invoice for demo mode
      return {
        success: true,
        data: [
          {
            id: 'inv-seed-01',
            farmId,
            paymentId: 'pay_mock_initial_01',
            orderId: 'order_mock_initial_01',
            amountInr: 999,
            status: 'paid',
            invoiceNumber: 'INV-2026-089',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      };
    }

    const { data, error } = await (supabase as any)
      .from('billing_invoices')
      .select('*')
      .eq('farm_id', farmId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    const records: BillingInvoiceRecord[] = (data || []).map((row: any) => ({
      id: row.id,
      farmId: row.farm_id,
      paymentId: row.razorpay_payment_id,
      orderId: row.razorpay_order_id,
      amountInr: Number((row.amount_paise / 100).toFixed(2)),
      status: row.status,
      invoiceNumber: row.invoice_number || `INV-${row.id.slice(0, 6)}`,
      createdAt: row.created_at,
    }));

    return { success: true, data: records };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
