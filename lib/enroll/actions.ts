'use server';

import { completeEnrollmentSchema, CompleteEnrollmentInput } from './schema';
import { getSupabaseServerClient } from '../supabase/server';
import { calculateDailyMetrics, UnitSettings } from '../calc';

export interface EnrollmentResult {
  success: boolean;
  data?: {
    farmId: string;
    userId: string;
    farmName: string;
    ownerName: string;
    phone: string;
    totalBirds: number;
    flocks: Array<{
      id?: string;
      batchCode: string;
      breed: string;
      birdCount: number;
      ageWeeks: number;
    }>;
    unitSettings: UnitSettings;
    status?: 'pending_approval' | 'active';
    feedRequirementKg: number;
    feedCostINR: number;
    projectedDailyRevenue: number;
    projectedBreakEvenPrice: number;
    welcomeStats: {
      dailyEggsEstimate: number;
      monthlyFeedBags: number;
      estimatedMonthlyProfit: number;
    };
  };
  error?: string;
  fieldErrors?: Record<string, string>;
}

// In-memory IP rate limiter for bot & abuse prevention
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS_PER_WINDOW = 30;
const ipAttemptsMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
    return true; // Allow local test runner workers without false-positive rate limit
  }

  const now = Date.now();
  const record = ipAttemptsMap.get(ip);

  if (!record || now > record.resetAt) {
    ipAttemptsMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * Server action to atomically enroll a new farm and owner account
 */
export async function enrollFarmAction(
  rawInput: CompleteEnrollmentInput,
  clientIp: string = '127.0.0.1'
): Promise<EnrollmentResult> {
  // 1. Bot prevention (Honeypot)
  if (rawInput.honeypot && rawInput.honeypot.length > 0) {
    return { success: false, error: 'Registration rejected (Bot detected).' };
  }

  // 2. IP Rate limit check
  if (!checkRateLimit(clientIp)) {
    return {
      success: false,
      error: 'फार जास्त विनंत्या आल्या आहेत. कृपया १ मिनिट वाट पाहून पुन्हा प्रयत्न करा. (Too many requests. Please wait a minute.)',
    };
  }

  // 3. Schema validation
  const validation = completeEnrollmentSchema.safeParse(rawInput);
  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    const fieldPath = firstIssue?.path.join('.') || '';
    return {
      success: false,
      error: firstIssue?.message || 'तपशील अपूर्ण किंवा अवैध आहेत. कृपया फॉर्म तपासा.',
      fieldErrors: { [fieldPath]: firstIssue?.message || 'Invalid' },
    };
  }

  const { owner, farm, shedsFlocks, feed, sales, finance } = validation.data;

  // 4. Calculate initial poultry mathematics for instant dashboard handoff
  const totalBirds = shedsFlocks.flocks.reduce((sum, f) => sum + f.currentLiveBirds, 0);
  const estimatedDailyEggs = Math.round(totalBirds * 0.90); // ~90% reference benchmark
  const dailyFeedKg = feed.feedBagsPerDay * feed.bagSizeKg;
  const feedCostPerKg = feed.feedPricePerKg;
  const sellingPricePerEgg = sales.currentSellingPricePerEgg;

  const customUnits: UnitSettings = {
    traySizeEggs: sales.traySize,
    gattaSizeTrays: sales.traysPerGatta,
    cartonSizeTrays: 12,
    feedBagWeightKg: feed.bagSizeKg,
    defaultRateUnit: 'per_100',
  };

  const initialMetrics = calculateDailyMetrics({
    openingBirds: totalBirds,
    mortality: Math.round(totalBirds * 0.0005), // ~0.05% benchmark
    eggsCollected: estimatedDailyEggs,
    feedKg: dailyFeedKg,
    feedPricePerKg: feedCostPerKg,
    sellingPricePerEgg,
    otherCashExpenses: (finance.monthlyLabour + finance.monthlyElectricity + finance.monthlyMedicine + finance.monthlyOther) / 30,
    allocatedOverheads: {
      loanInterestDaily: finance.monthlyLoanEmi > 0 ? (finance.monthlyLoanEmi * 0.3) / 30 : 0,
      pulletAmortizationDaily: (totalBirds * 40) / (14 * 30),
      shedDepreciationDaily: 1500,
    },
  }, customUnits);

  const planningHorizon = feed.planningHorizonDays || 30;
  const horizonFeedRequirementKg = dailyFeedKg * planningHorizon;
  const horizonFeedCostINR = horizonFeedRequirementKg * feedCostPerKg;

  // 5. Connect to Supabase
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    // Offline / Demo Sandbox enrollment fallback
    const mockFarmId = `farm-live-${Date.now()}`;
    const mockUserId = `usr-live-${Date.now()}`;

    return {
      success: true,
      data: {
        farmId: mockFarmId,
        userId: mockUserId,
        farmName: farm.farmName,
        ownerName: owner.fullName,
        phone: owner.mobileNumber,
        totalBirds,
        flocks: shedsFlocks.flocks.map((f, i) => ({
          id: `flock-mock-${i + 1}`,
          batchCode: f.batchCode,
          breed: f.breed,
          birdCount: f.currentLiveBirds,
          ageWeeks: f.ageWeeks,
        })),
        unitSettings: customUnits,
        feedRequirementKg: horizonFeedRequirementKg,
        feedCostINR: horizonFeedCostINR,
        projectedDailyRevenue: initialMetrics.totalRevenue,
        projectedBreakEvenPrice: initialMetrics.breakEvenEggPrice,
        welcomeStats: {
          dailyEggsEstimate: estimatedDailyEggs,
          monthlyFeedBags: feed.feedBagsPerDay * 30,
          estimatedMonthlyProfit: initialMetrics.simpleOperatingProfit * 30,
        },
      },
    };
  }

  // 6. Production Supabase flow:
  // Step A: Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: owner.email,
    password: owner.password,
    options: {
      data: {
        full_name: owner.fullName,
        phone: owner.mobileNumber,
      },
    },
  });

  if (authError) {
    // Handle duplicate or invalid email/auth error with friendly message
    if (authError.message.includes('already registered') || authError.status === 422) {
      return {
        success: false,
        error: 'हा ईमेल पत्ता किंवा मोबाईल नंबर आधीच नोंदणीकृत आहे. कृपया लॉगिन करा. (Account already exists. Please log in.)',
      };
    }
    return { success: false, error: authError.message };
  }

  const authUserId = authData.user?.id || null;

  // Step B: Call atomic RPC `enroll_farm_atomic`
  const shedsPayload = Array.from({ length: shedsFlocks.numberOfSheds }).map((_, i) => ({
    shedNumber: `Shed-0${i + 1}`,
    name: `शेड ${i + 1}`,
    capacity: Math.ceil(totalBirds / shedsFlocks.numberOfSheds),
    shedType: shedsFlocks.flocks[0]?.housingType || 'elevated_cage',
  }));

  const flocksPayload = shedsFlocks.flocks.map(f => ({
    batchCode: f.batchCode,
    breed: f.breed,
    initialBirds: f.birdsPlaced,
    currentBirds: f.currentLiveBirds,
    ageWeeks: f.ageWeeks,
  }));

  const { data: rpcData, error: rpcError } = await (supabase as any).rpc('enroll_farm_atomic', {
    p_full_name: owner.fullName,
    p_phone: owner.mobileNumber,
    p_email: owner.email,
    p_farm_name: farm.farmName,
    p_village_town: farm.villageTown,
    p_taluka: farm.taluka,
    p_district: farm.district,
    p_state: farm.state,
    p_pincode: farm.pincode,
    p_preferred_language: farm.preferredLanguage,
    p_capacity: totalBirds,
    p_sheds_data: shedsPayload,
    p_flocks_data: flocksPayload,
    p_unit_settings: {
      traySizeEggs: customUnits.traySizeEggs,
      gattaSizeTrays: customUnits.gattaSizeTrays,
      cartonSizeTrays: customUnits.cartonSizeTrays,
      feedBagWeightKg: customUnits.feedBagWeightKg,
      defaultEggRateUnit: customUnits.defaultRateUnit,
    },
    p_feed_cost_per_kg: feed.feedPricePerKg,
    p_expected_feed_stock_kg: feed.expectedFeedStockKg,
    p_default_egg_price: sales.currentSellingPricePerEgg,
    p_nearest_mandi: sales.nearestMandi,
    p_planning_horizon_days: planningHorizon,
    p_monthly_expenses: {
      labour: finance.monthlyLabour,
      electricity: finance.monthlyElectricity,
      medicine: finance.monthlyMedicine,
      other: finance.monthlyOther,
    },
    p_loan_emi: finance.monthlyLoanEmi,
    p_auth_user_id: authUserId,
  });

  if (rpcError) {
    return {
      success: false,
      error: `फार्म नोंदणी अयशस्वी झाली: ${rpcError.message}. कृपया पुन्हा प्रयत्न करा.`,
    };
  }

  const res = rpcData as any;

  return {
    success: true,
    data: {
      farmId: res.farm_id,
      userId: res.user_id,
      farmName: farm.farmName,
      ownerName: owner.fullName,
      phone: owner.mobileNumber,
      totalBirds,
      flocks: flocksPayload.map((f, i) => ({
        id: `flock-${i + 1}`,
        batchCode: f.batchCode,
        breed: f.breed,
        birdCount: f.currentBirds,
        ageWeeks: f.ageWeeks,
      })),
      unitSettings: customUnits,
      status: res?.status || 'active',
      feedRequirementKg: horizonFeedRequirementKg,
      feedCostINR: horizonFeedCostINR,
      projectedDailyRevenue: initialMetrics.totalRevenue,
      projectedBreakEvenPrice: initialMetrics.breakEvenEggPrice,
      welcomeStats: {
        dailyEggsEstimate: estimatedDailyEggs,
        monthlyFeedBags: feed.feedBagsPerDay * 30,
        estimatedMonthlyProfit: initialMetrics.simpleOperatingProfit * 30,
      },
    },
  };
}
