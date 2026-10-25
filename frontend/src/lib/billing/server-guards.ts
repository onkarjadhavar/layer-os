import { getSubscriptionPlan, PlanId, FarmSubscriptionState } from './plans';
import { getSupabaseServerClient } from '../supabase/server';
import {
  assertPlanBirdLimit,
  assertPlanShedLimit,
  assertPlanStaffLimit,
  assertPlanAILimit,
  PlanLimitError,
} from './guards';

export { PlanLimitError };

/**
 * Server-only: Retrieves subscription using server client with cookies
 */
export async function getFarmSubscriptionServer(farmId: string): Promise<FarmSubscriptionState> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data } = await (supabase as any)
      .from('subscriptions')
      .select('*')
      .eq('farm_id', farmId)
      .single();

    if (data) {
      return {
        farmId: data.farm_id,
        planId: data.plan_id as PlanId,
        status: data.status,
        billingCycle: data.billing_cycle,
        currentPeriodStart: data.current_period_start,
        currentPeriodEnd: data.current_period_end,
        razorpaySubscriptionId: data.razorpay_subscription_id || undefined,
        cancelAtPeriodEnd: data.cancel_at_period_end,
      };
    }
  }

  // Demo fallback
  const isDemo = farmId === 'farm-sahyadri-01' || farmId.startsWith('demo_');
  return {
    farmId,
    planId: isDemo ? 'grower' : 'starter',
    status: 'active',
    billingCycle: 'monthly',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
  };
}

/**
 * Server guard: asserts staff invitations do not exceed plan limit
 */
export async function assertCanInviteStaffServer(
  farmId: string,
  currentStaffCount: number,
  explicitPlanId?: PlanId
): Promise<void> {
  const planId = explicitPlanId || (await getFarmSubscriptionServer(farmId)).planId;
  assertPlanStaffLimit(planId, currentStaffCount);
}

/**
 * Server guard: asserts AI usage is included in farm's plan
 */
export async function assertCanUseAIServer(
  farmId: string,
  explicitPlanId?: PlanId
): Promise<void> {
  const planId = explicitPlanId || (await getFarmSubscriptionServer(farmId)).planId;
  assertPlanAILimit(planId);
}

/**
 * Server guard: asserts birds count
 */
export async function assertCanAddBirdsServer(
  farmId: string,
  currentBirds: number,
  additionalBirds: number,
  explicitPlanId?: PlanId
): Promise<void> {
  const planId = explicitPlanId || (await getFarmSubscriptionServer(farmId)).planId;
  assertPlanBirdLimit(planId, currentBirds, additionalBirds);
}
