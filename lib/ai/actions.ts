'use server';

import { Farm, Flock, DailyRecord, MarketRate, Customer } from '../store/seedData';
import { askLayerOsAI, buildSanitizedContext, AIResponsePayload } from './gemini';
import { assertCanUseAIServer } from '../billing/server-guards';

export interface AskAiActionParams {
  farm: Farm;
  flock: Flock;
  todayRecord: DailyRecord;
  marketRates: MarketRate[];
  customers: Customer[];
  query: string;
  language: 'mr' | 'en' | 'hi';
}

/**
 * Server Action for LayerOS AI Chat
 * Securely executes on the server; client never touches GEMINI_API_KEY.
 */
export async function askLayerOsAction(params: AskAiActionParams): Promise<AIResponsePayload> {
  // Check SaaS plan limit for AI features
  try {
    await assertCanUseAIServer(params.farm.id);
  } catch (err: any) {
    return {
      success: false,
      source: 'rule_based',
      model: 'plan-limit-guard',
      badge: 'योजना मर्यादा (Plan Upgrade Required)',
      text: err.message,
      disclaimer: 'या सुविधेसाठी ग्रोवर किंवा कमर्शियल योजना आवश्यक आहे.',
    };
  }

  const sanitized = buildSanitizedContext(
    params.farm,
    params.flock,
    params.todayRecord,
    params.marketRates,
    params.customers
  );

  return askLayerOsAI({
    query: params.query,
    language: params.language,
    context: sanitized,
    rawToday: params.todayRecord,
    rawCustomers: params.customers,
  });
}
