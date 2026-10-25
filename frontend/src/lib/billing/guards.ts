import { getSubscriptionPlan, PlanId, FarmSubscriptionState } from './plans';
import { getSupabaseBrowserClient } from '../supabase/client';

export class PlanLimitError extends Error {
  code: 'BIRD_LIMIT_EXCEEDED' | 'SHED_LIMIT_EXCEEDED' | 'STAFF_LIMIT_EXCEEDED' | 'AI_NOT_INCLUDED';
  currentValue: number;
  limitValue: number;
  planId: PlanId;

  constructor(
    code: 'BIRD_LIMIT_EXCEEDED' | 'SHED_LIMIT_EXCEEDED' | 'STAFF_LIMIT_EXCEEDED' | 'AI_NOT_INCLUDED',
    message: string,
    currentValue: number,
    limitValue: number,
    planId: PlanId
  ) {
    super(message);
    this.name = 'PlanLimitError';
    this.code = code;
    this.currentValue = currentValue;
    this.limitValue = limitValue;
    this.planId = planId;
  }
}

/**
 * Pure synchronous assertion for bird capacity
 */
export function assertPlanBirdLimit(
  planId: PlanId,
  currentBirds: number,
  additionalBirds: number
): void {
  const plan = getSubscriptionPlan(planId);
  const totalBirds = currentBirds + additionalBirds;

  if (totalBirds > plan.limits.maxBirds) {
    throw new PlanLimitError(
      'BIRD_LIMIT_EXCEEDED',
      `पक्षी मर्यादा ओलांडली (Bird limit exceeded). तुमची सध्याची '${plan.name.mr}' योजना जास्तीत जास्त ${plan.limits.maxBirds.toLocaleString('en-IN')} पक्षांना परवानगी देते. एकूण ${totalBirds.toLocaleString('en-IN')} पक्षी नोंदवण्यासाठी कृपया ग्रोवर किंवा कमर्शियल योजनेत श्रेणीसुधार करा.`,
      totalBirds,
      plan.limits.maxBirds,
      planId
    );
  }
}

/**
 * Pure synchronous assertion for shed count
 */
export function assertPlanShedLimit(
  planId: PlanId,
  currentShedCount: number
): void {
  const plan = getSubscriptionPlan(planId);

  if (currentShedCount + 1 > plan.limits.maxSheds) {
    throw new PlanLimitError(
      'SHED_LIMIT_EXCEEDED',
      `शेड मर्यादा ओलांडली (Shed limit reached). '${plan.name.mr}' योजना जास्तीत जास्त ${plan.limits.maxSheds} शेडला परवानगी देते. नवीन शेड जोडण्यासाठी कृपया योजना श्रेणीसुधार करा.`,
      currentShedCount + 1,
      plan.limits.maxSheds,
      planId
    );
  }
}

/**
 * Pure synchronous assertion for staff count
 */
export function assertPlanStaffLimit(
  planId: PlanId,
  currentStaffCount: number
): void {
  const plan = getSubscriptionPlan(planId);

  if (currentStaffCount + 1 > plan.limits.maxStaff) {
    throw new PlanLimitError(
      'STAFF_LIMIT_EXCEEDED',
      `कर्मचारी मर्यादा ओलांडली (Staff limit reached). '${plan.name.mr}' योजना जास्तीत जास्त ${plan.limits.maxStaff} खात्यांना परवानगी देते. अधिक सुपरवायझर किंवा अकाउंटंट जोडण्यासाठी ग्रोवर किंवा कमर्शियल योजना निवडा.`,
      currentStaffCount + 1,
      plan.limits.maxStaff,
      planId
    );
  }
}

/**
 * Pure synchronous assertion for AI Advisor usage
 */
export function assertPlanAILimit(
  planId: PlanId
): void {
  const plan = getSubscriptionPlan(planId);

  if (!plan.limits.aiAdvisorEnabled) {
    throw new PlanLimitError(
      'AI_NOT_INCLUDED',
      `जेमिनी AI सल्लागार या योजनेमध्ये उपलब्ध नाही. AI सुविधा मिळवण्यासाठी कृपया 'ग्रोवर' योजनेत श्रेणीसुधार करा.`,
      0,
      1,
      planId
    );
  }
}

/**
 * Client-safe: Retrieves subscription via browser client or fallback
 */
export async function getFarmSubscriptionClient(farmId: string): Promise<FarmSubscriptionState> {
  const supabase = getSupabaseBrowserClient();
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
 * Client-safe guard for adding birds
 */
export async function assertCanAddBirds(
  farmId: string,
  currentBirds: number,
  additionalBirds: number,
  explicitPlanId?: PlanId
): Promise<void> {
  const planId = explicitPlanId || (await getFarmSubscriptionClient(farmId)).planId;
  assertPlanBirdLimit(planId, currentBirds, additionalBirds);
}
