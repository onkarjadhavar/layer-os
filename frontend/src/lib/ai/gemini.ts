/**
 * Server-only Gemini AI Integration for LayerOS (/lib/ai/gemini.ts)
 * 
 * Provides:
 * 1. Strict tenant isolation (only current farm's aggregate metrics passed).
 * 2. Complete PII stripping (no phone numbers, customer addresses, vehicle plates).
 * 3. Trilingual support (Marathi default, Hindi, English).
 * 4. Resilient timeout and graceful fallback to rule-based algorithms.
 */
import type { DailyRecord, Flock, Farm, MarketRate, Customer } from '../store/seedData';
import { answerLayerOsQuery, AIAnalysisOutput } from './index';

export interface SanitizedFarmContext {
  farmName: string;
  district: string;
  totalCapacity: number;
  flock: {
    batchCode: string;
    breed: string;
    ageWeeks: number;
    currentPhase: string;
    currentBirdCount: number;
  };
  todayMetrics: {
    recordDate: string;
    liveBirds: number;
    eggsCollected: number;
    hdPct: number;
    feedIssuedKg: number;
    feedPerBirdGrams: number;
    mortalityCount: number;
    costPerEgg: number;
    breakEvenRate: number;
    sellingRate: number;
    cashOperatingProfit: number;
    trueProfit: number;
  };
  mandiRates: Array<{
    mandiName: string;
    ratePerEgg: number;
    trend: string;
  }>;
  receivablesSummary: {
    totalOutstanding: number;
    overdueOver21Days: number;
    topDebtorCategory: string; // Redacted debtor name/category, zero PII
  };
}

/**
 * Builds a strictly PII-stripped, tenant-scoped context payload
 */
export function buildSanitizedContext(
  farm: Farm,
  flock: Flock,
  today: DailyRecord,
  marketRates: MarketRate[],
  customers: Customer[]
): SanitizedFarmContext {
  // Aggregate receivables without exposing phone numbers, personal contacts, or addresses
  const totalOutstanding = customers.reduce((sum, c) => sum + c.currentOutstanding, 0);
  const overdueOver21Days = customers.reduce((sum, c) => sum + c.days16to30 + c.days30Plus, 0);
  const highestDebtor = [...customers].sort((a, b) => b.currentOutstanding - a.currentOutstanding)[0];

  return {
    farmName: farm.name,
    district: farm.district,
    totalCapacity: farm.totalCapacity,
    flock: {
      batchCode: flock.batchCode,
      breed: flock.breed,
      ageWeeks: flock.ageWeeks,
      currentPhase: flock.currentPhase,
      currentBirdCount: flock.currentBirdCount,
    },
    todayMetrics: {
      recordDate: today.recordDate,
      liveBirds: today.closingBirds,
      eggsCollected: today.totalEggsCollected,
      hdPct: today.hdPct,
      feedIssuedKg: today.feedIssuedKg,
      feedPerBirdGrams: today.feedPerBirdG,
      mortalityCount: today.mortality,
      costPerEgg: today.costPerEgg,
      breakEvenRate: today.breakEvenEggPrice,
      sellingRate: today.sellingPricePerEgg,
      cashOperatingProfit: today.simpleOperatingProfit,
      trueProfit: today.trueProfit,
    },
    mandiRates: marketRates.map(m => ({
      mandiName: m.mandiName,
      ratePerEgg: m.ratePerEgg,
      trend: m.trend,
    })),
    receivablesSummary: {
      totalOutstanding,
      overdueOver21Days,
      topDebtorCategory: highestDebtor ? `${highestDebtor.customerType.toUpperCase()} segment` : 'None',
    },
  };
}

export interface AIResponsePayload {
  success: boolean;
  source: 'gemini' | 'rule_based';
  model: string;
  badge: string;
  text: string;
  structuredAnalysis?: AIAnalysisOutput;
  disclaimer: string;
}

/**
 * Server-only invocation of Google Gemini API with fallback
 */
export async function askLayerOsAI(options: {
  query: string;
  language: 'mr' | 'en' | 'hi';
  context: SanitizedFarmContext;
  // Raw data for fallback
  rawToday: DailyRecord;
  rawCustomers: Customer[];
}): Promise<AIResponsePayload> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  // 1. Fallback if API key is not configured
  if (!apiKey || apiKey.trim() === '') {
    const fallbackAnswer = answerLayerOsQuery(options.query, options.rawToday, options.rawCustomers);
    return {
      success: true,
      source: 'rule_based',
      model: 'rule-based-engine',
      badge: 'Rule-based analysis (AI offline)',
      text: fallbackAnswer,
      disclaimer: 'AI offline / Rule-based engine active. Set GEMINI_API_KEY to activate Gemini 2.5 Flash.',
    };
  }

  // 2. Prepare Gemini Prompt
  const languageInstructions = {
    mr: 'IMPORTANT: Respond fluently in authentic Marathi (मराठी) with proper poultry terminology (उदा. खुराक, अंडी, हेन-डे उत्पादन, ब्रेक-इव्हन दर, मजुरी).',
    hi: 'IMPORTANT: Respond fluently in clear Hindi (हिंदी) with standard layer poultry terms (उदा. दाना, अंडा उत्पादन, हेन-डे %, ब्रेक-इवन भाव).',
    en: 'IMPORTANT: Respond clearly in professional English with commercial poultry ERP terminology (Hen-Day HD%, feed conversion, break-even cost, margin).',
  };

  const systemPrompt = `You are LayerOS Commercial Poultry AI Advisor, an expert poultry veterinarian and layer-farm economist for Maharashtra and wider India.
${languageInstructions[options.language]}
You have access ONLY to the following verified farm metrics for today. Zero PII is present. Base your analysis strictly on these numbers:
Farm: ${options.context.farmName} (${options.context.district}, Capacity: ${options.context.totalCapacity.toLocaleString('en-IN')})
Flock: ${options.context.flock.batchCode} (${options.context.flock.breed}, Age: ${options.context.flock.ageWeeks} weeks, Phase: ${options.context.flock.currentPhase})
Live Birds: ${options.context.todayMetrics.liveBirds.toLocaleString('en-IN')}
Eggs Collected Today: ${options.context.todayMetrics.eggsCollected.toLocaleString('en-IN')} (Hen-Day: ${options.context.todayMetrics.hdPct}%)
Feed Consumption: ${options.context.todayMetrics.feedIssuedKg} kg (${options.context.todayMetrics.feedPerBirdGrams}g / bird)
Mortality: ${options.context.todayMetrics.mortalityCount} birds
Financials: Cost per Egg ₹${options.context.todayMetrics.costPerEgg}, Break-Even Rate ₹${options.context.todayMetrics.breakEvenRate}, Selling Rate ₹${options.context.todayMetrics.sellingRate}
Cash Operating Profit: ₹${options.context.todayMetrics.cashOperatingProfit.toLocaleString('en-IN')} | True Net Profit: ₹${options.context.todayMetrics.trueProfit.toLocaleString('en-IN')}
Market Rates: ${options.context.mandiRates.map(m => `${m.mandiName}: ₹${m.ratePerEgg} (${m.trend})`).join(', ')}
Receivables: Total ₹${options.context.receivablesSummary.totalOutstanding.toLocaleString('en-IN')} (Overdue: ₹${options.context.receivablesSummary.overdueOver21Days.toLocaleString('en-IN')})

Rules:
- Give concise, actionable, and numbers-backed answers (max 3-4 sentences).
- If asked about feeding, refer to the 110-112g target per bird.
- If asked about selling, compare selling price with break-even price.
- Never invent metrics not provided.
`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${systemPrompt}\n\nUser Question: ${options.query}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 500,
    }
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(8000), // 8-second hard timeout
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error HTTP ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText || typeof candidateText !== 'string') {
      throw new Error('Invalid or empty response from Gemini API');
    }

    return {
      success: true,
      source: 'gemini',
      model: 'gemini-2.5-flash',
      badge: 'Gemini 2.5 Flash (Live)',
      text: candidateText.trim(),
      disclaimer: 'Generated by Gemini 2.5 Flash on live farm data.',
    };
  } catch (err: unknown) {
    // Graceful fallback to rule-based engine on any error or timeout
    const fallbackAnswer = answerLayerOsQuery(options.query, options.rawToday, options.rawCustomers);
    const errorMessage = err instanceof Error ? err.message : 'Unknown AI error';
    return {
      success: true,
      source: 'rule_based',
      model: 'rule-based-engine',
      badge: 'Rule-based analysis (AI offline)',
      text: fallbackAnswer,
      disclaimer: `Gemini unavailable (${errorMessage}). Seamlessly served by LayerOS rule-based engine.`,
    };
  }
}
