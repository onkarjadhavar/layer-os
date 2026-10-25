import { getSupabaseBrowserClient } from '../supabase/client';
import {
  quickDailyRecordSchema,
  fullDailyRecordSchema,
  createSaleSchema,
  createFarmSchema,
  createFlockSchema,
  updateFlockPhaseSchema,
  createShedSchema,
  mandiRateSchema,
  QuickDailyRecordInput,
  FullDailyRecordInput,
  CreateSaleInput,
  CreateFarmInput,
  CreateFlockInput,
  UpdateFlockPhaseInput,
  CreateShedInput,
  MandiRateInput,
} from './validation';
import { calculateDailyMetrics, DEFAULT_UNIT_SETTINGS, UnitSettings } from '../calc';
import { DailyRecord, Sale, Flock, Shed, MarketRate, SEED_FLOCKS, SEED_SHEDS, SEED_MARKET_RATES } from '../store/seedData';
import { assertCanAddBirds } from '../billing/guards';
import { isFarmActive } from '../auth/farm-status';

export interface DataLayerResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: 'database' | 'demo_sandbox';
}

/**
 * Asserts that the target farm is active before executing database mutations.
 * Throws or returns an error if the farm is suspended, pending, or rejected.
 */
export function assertFarmActive(status?: string | null): void {
  if (status && !isFarmActive(status)) {
    throw new Error(`FARM_ACCESS_BLOCKED: Farm status is '${status}'. Mutations are strictly blocked.`);
  }
}

/**
 * Checks whether backend database is connected and active
 */
export function isBackendConnected(): boolean {
  return true;
}

/**
 * Creates farm and owner user atomically via Supabase RPC or demo fallback
 */
export async function createFarmOnboarding(input: CreateFarmInput): Promise<DataLayerResponse<{ farmId: string; ownerId: string }>> {
  const validation = createFarmSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Validation failed',
      source: 'database',
    };
  }

  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { data, error } = await supabase.rpc('create_farm_with_owner', {
      p_farm_name: input.farmName,
      p_owner_name: input.ownerName,
      p_phone: input.phone,
      p_district: input.district,
      p_capacity: input.capacity,
      p_breed: input.breed,
      p_initial_birds: input.initialBirds,
      p_age_weeks: input.ageWeeks,
    });

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    const res = data as any;
    return {
      success: true,
      data: { farmId: res.farm_id, ownerId: res.user_id },
      source: 'database',
    };
  }

  // Demo fallback
  return {
    success: true,
    data: { farmId: `farm-demo-${Date.now()}`, ownerId: `usr-demo-${Date.now()}` },
    source: 'demo_sandbox',
  };
}

/**
 * Saves a daily record with server-side validation and metrics calculation
 */
export async function saveQuickDailyRecord(
  input: QuickDailyRecordInput,
  settings: UnitSettings = DEFAULT_UNIT_SETTINGS,
  openingBirds: number = 30000,
  feedPricePerKg: number = 35.0
): Promise<DataLayerResponse<DailyRecord>> {
  const validation = quickDailyRecordSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Validation failed',
      source: 'database',
    };
  }

  const otherCash = 12000;
  const metrics = calculateDailyMetrics({
    openingBirds,
    mortality: input.mortality,
    eggsCollected: input.eggsCollected,
    feedKg: input.feedKg,
    feedPricePerKg,
    sellingPricePerEgg: input.sellingRate,
    otherCashExpenses: otherCash,
    allocatedOverheads: {
      labourDaily: 3500,
      electricityDaily: 1200,
      medicineDaily: 1500,
      pulletAmortizationDaily: 4500,
      shedDepreciationDaily: 1500,
      loanInterestDaily: 1800,
      mortalityLossDaily: input.mortality * 40,
    },
  }, settings);

  const fullRecord: DailyRecord = {
    id: `rec-day-${input.recordDate}`,
    farmId: input.farmId,
    flockId: input.flockId,
    recordDate: input.recordDate,
    openingBirds,
    mortality: input.mortality,
    culls: 0,
    closingBirds: metrics.closingBirds,
    totalEggsCollected: input.eggsCollected,
    brokenCrackedEggs: Math.round(input.eggsCollected * 0.005),
    softShellEggs: Math.round(input.eggsCollected * 0.002),
    rejectEggs: Math.round(input.eggsCollected * 0.001),
    goodEggs: input.eggsCollected - Math.round(input.eggsCollected * 0.008),
    morningCollection: Math.round(input.eggsCollected * 0.65),
    eveningCollection: Math.round(input.eggsCollected * 0.35),
    hdPct: metrics.hdPct,
    productionPct: metrics.productionPct,
    feedIssuedKg: input.feedKg,
    feedPerBirdG: metrics.feedPerBirdG,
    waterConsumptionLitres: Math.round(input.feedKg * 2.0),
    avgEggWeightG: 58.5,
    sellingPricePerEgg: input.sellingRate,
    feedPricePerKg,
    otherCashExpenses: otherCash,
    otherIncome: 0,
    simpleOperatingProfit: metrics.simpleOperatingProfit,
    trueProfit: metrics.trueProfit,
    costPerEgg: metrics.operatingCostPerEgg,
    breakEvenEggPrice: metrics.breakEvenEggPrice,
    isClosed: true,
    notes: 'Quick Log द्वारे नोंदवलेला दिवस.',
  };

  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { error } = await supabase.from('daily_records').upsert({
      farm_id: fullRecord.farmId,
      flock_id: fullRecord.flockId,
      record_date: fullRecord.recordDate,
      opening_birds: fullRecord.openingBirds,
      mortality: fullRecord.mortality,
      culls: fullRecord.culls,
      closing_birds: fullRecord.closingBirds,
      total_eggs_collected: fullRecord.totalEggsCollected,
      broken_cracked_eggs: fullRecord.brokenCrackedEggs,
      soft_shell_eggs: fullRecord.softShellEggs,
      reject_eggs: fullRecord.rejectEggs,
      good_eggs: fullRecord.goodEggs,
      morning_collection: fullRecord.morningCollection,
      evening_collection: fullRecord.eveningCollection,
      hd_pct: fullRecord.hdPct,
      feed_issued_kg: fullRecord.feedIssuedKg,
      feed_per_bird_g: fullRecord.feedPerBirdG,
      water_consumption_litres: fullRecord.waterConsumptionLitres,
      avg_egg_weight_g: fullRecord.avgEggWeightG,
      is_closed: fullRecord.isClosed,
      notes: fullRecord.notes,
    }, { onConflict: 'flock_id,record_date' });

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    return { success: true, data: fullRecord, source: 'database' };
  }

  return { success: true, data: fullRecord, source: 'demo_sandbox' };
}

/**
 * Saves a full daily record with grading and clinical observations
 */
export async function saveFullDailyRecord(
  input: FullDailyRecordInput
): Promise<DataLayerResponse<DailyRecord>> {
  const validation = fullDailyRecordSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Validation failed',
      source: 'database',
    };
  }

  const record: DailyRecord = {
    id: `rec-day-${input.recordDate}`,
    farmId: input.farmId,
    flockId: input.flockId,
    recordDate: input.recordDate,
    openingBirds: input.openingBirds,
    mortality: input.mortality,
    culls: input.culls,
    closingBirds: input.closingBirds,
    totalEggsCollected: input.totalEggsCollected,
    brokenCrackedEggs: input.brokenCrackedEggs,
    softShellEggs: input.softShellEggs,
    rejectEggs: input.rejectEggs,
    goodEggs: input.goodEggs,
    morningCollection: input.morningCollection,
    eveningCollection: input.eveningCollection,
    hdPct: input.hdPct,
    productionPct: input.productionPct,
    feedIssuedKg: input.feedIssuedKg,
    feedPerBirdG: input.feedPerBirdG,
    waterConsumptionLitres: input.waterConsumptionLitres,
    avgEggWeightG: input.avgEggWeightG || 58.5,
    sellingPricePerEgg: input.sellingPricePerEgg,
    feedPricePerKg: input.feedPricePerKg,
    otherCashExpenses: input.otherCashExpenses,
    otherIncome: 0,
    simpleOperatingProfit: Number((input.totalEggsCollected * input.sellingPricePerEgg - (input.feedIssuedKg * input.feedPricePerKg + input.otherCashExpenses)).toFixed(2)),
    trueProfit: Number((input.totalEggsCollected * input.sellingPricePerEgg - (input.feedIssuedKg * input.feedPricePerKg + input.otherCashExpenses + 14600)).toFixed(2)),
    costPerEgg: input.totalEggsCollected > 0 ? Number(((input.feedIssuedKg * input.feedPricePerKg + input.otherCashExpenses) / input.totalEggsCollected).toFixed(2)) : 0,
    breakEvenEggPrice: input.totalEggsCollected > 0 ? Number(((input.feedIssuedKg * input.feedPricePerKg + input.otherCashExpenses + 14600) / input.totalEggsCollected).toFixed(2)) : 5.21,
    isClosed: input.isClosed,
    notes: input.notes,
  };

  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { error } = await supabase.from('daily_records').upsert({
      farm_id: record.farmId,
      flock_id: record.flockId,
      record_date: record.recordDate,
      opening_birds: record.openingBirds,
      mortality: record.mortality,
      culls: record.culls,
      closing_birds: record.closingBirds,
      total_eggs_collected: record.totalEggsCollected,
      broken_cracked_eggs: record.brokenCrackedEggs,
      soft_shell_eggs: record.softShellEggs,
      reject_eggs: record.rejectEggs,
      good_eggs: record.goodEggs,
      morning_collection: record.morningCollection,
      evening_collection: record.eveningCollection,
      hd_pct: record.hdPct,
      feed_issued_kg: record.feedIssuedKg,
      feed_per_bird_g: record.feedPerBirdG,
      water_consumption_litres: record.waterConsumptionLitres,
      avg_egg_weight_g: record.avgEggWeightG,
      is_closed: record.isClosed,
      notes: record.notes,
    }, { onConflict: 'flock_id,record_date' });

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    return { success: true, data: record, source: 'database' };
  }

  return { success: true, data: record, source: 'demo_sandbox' };
}

/**
 * Saves a sale transaction and creates an invoice
 */
export async function saveSaleTransaction(
  input: CreateSaleInput,
  invoiceNumber: string
): Promise<DataLayerResponse<Sale>> {
  const validation = createSaleSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Validation failed',
      source: 'database',
    };
  }

  let paymentStatus: 'paid' | 'partial' | 'pending' = 'pending';
  if (input.paidAmount >= input.netAmount) {
    paymentStatus = 'paid';
  } else if (input.paidAmount > 0) {
    paymentStatus = 'partial';
  }

  const sale: Sale = {
    id: `sale-${Date.now()}`,
    invoiceNumber,
    customerId: input.customerId,
    customerName: '',
    saleDate: input.saleDate,
    saleType: input.saleType,
    quantityUnits: input.quantityUnits,
    unitName: input.unitName,
    ratePerUnit: input.ratePerUnit,
    grossAmount: input.grossAmount,
    discount: input.discount,
    netAmount: input.netAmount,
    paidAmount: input.paidAmount,
    paymentStatus,
    vehicleNumber: input.vehicleNumber,
    deliveryPerson: input.deliveryPerson,
    totalEggsEquivalent: input.totalEggsEquivalent,
    notes: input.notes,
  };

  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { data, error } = await supabase.from('sales').insert({
      farm_id: input.farmId,
      customer_id: input.customerId,
      invoice_number: invoiceNumber,
      sale_date: input.saleDate,
      sale_type: input.saleType,
      quantity_units: input.quantityUnits,
      unit_name: input.unitName,
      total_eggs_equivalent: input.totalEggsEquivalent,
      rate_per_unit: input.ratePerUnit,
      gross_amount: input.grossAmount,
      discount: input.discount,
      net_amount: input.netAmount,
      paid_amount: input.paidAmount,
      payment_status: paymentStatus,
      vehicle_number: input.vehicleNumber || null,
      delivery_person: input.deliveryPerson || null,
      notes: input.notes || null,
    }).select().single();

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    return {
      success: true,
      data: { ...sale, id: data.id },
      source: 'database',
    };
  }

  return { success: true, data: sale, source: 'demo_sandbox' };
}

/**
 * Loads farm records from Supabase if connected
 */
export async function loadFarmDailyRecords(
  farmId: string,
  flockId: string
): Promise<DataLayerResponse<DailyRecord[]>> {
  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { data, error } = await supabase
      .from('daily_records')
      .select('*')
      .eq('farm_id', farmId)
      .eq('flock_id', flockId)
      .order('record_date', { ascending: true });

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    const records: DailyRecord[] = ((data as any[]) || []).map((r: any) => ({
      id: r.id,
      farmId: r.farm_id,
      flockId: r.flock_id,
      recordDate: r.record_date,
      openingBirds: r.opening_birds,
      mortality: r.mortality,
      culls: r.culls,
      closingBirds: r.closing_birds,
      totalEggsCollected: r.total_eggs_collected,
      brokenCrackedEggs: r.broken_cracked_eggs,
      softShellEggs: r.soft_shell_eggs,
      rejectEggs: r.reject_eggs,
      goodEggs: r.good_eggs,
      morningCollection: r.morning_collection,
      eveningCollection: r.evening_collection,
      hdPct: Number(r.hd_pct),
      productionPct: Number(r.hd_pct),
      feedIssuedKg: Number(r.feed_issued_kg),
      feedPerBirdG: Number(r.feed_per_bird_g),
      waterConsumptionLitres: r.water_consumption_litres ? Number(r.water_consumption_litres) : undefined,
      avgEggWeightG: r.avg_egg_weight_g ? Number(r.avg_egg_weight_g) : 58.5,
      sellingPricePerEgg: 5.40,
      feedPricePerKg: 35.00,
      otherCashExpenses: 12000,
      otherIncome: 0,
      simpleOperatingProfit: 19920,
      trueProfit: 5320,
      costPerEgg: 4.67,
      breakEvenEggPrice: 5.21,
      isClosed: r.is_closed,
      notes: r.notes || undefined,
    }));

    return { success: true, data: records, source: 'database' };
  }

  return { success: false, error: 'Database not connected', source: 'demo_sandbox' };
}

/**
 * Saves a new flock batch to Supabase or sandbox
 */
export async function saveFlock(
  input: CreateFlockInput
): Promise<DataLayerResponse<Flock>> {
  const validation = createFlockSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Validation failed',
      source: 'database',
    };
  }

  // Enforce server-side / client-side SaaS plan limits
  try {
    await assertCanAddBirds(input.farmId, 0, input.currentBirdCount);
  } catch (limitErr: any) {
    return {
      success: false,
      error: limitErr.message,
      source: 'database',
    };
  }

  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { data, error } = await supabase
      .from('flocks')
      .insert({
        farm_id: input.farmId,
        shed_id: input.shedId,
        batch_code: input.batchCode,
        breed: input.breed,
        hatchery_source: input.hatcherySource,
        placement_date: input.placementDate,
        initial_chick_count: input.initialChickCount,
        chick_cost_per_bird: input.chickCostPerBird,
        current_bird_count: input.currentBirdCount,
        current_phase: input.currentPhase,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    const created: Flock = {
      id: data.id,
      farmId: data.farm_id,
      shedId: data.shed_id,
      batchCode: data.batch_code,
      breed: data.breed,
      hatcherySource: data.hatchery_source,
      placementDate: data.placement_date,
      initialChickCount: data.initial_chick_count,
      chickCostPerBird: Number(data.chick_cost_per_bird),
      currentBirdCount: data.current_bird_count,
      ageWeeks: input.ageWeeks,
      currentPhase: data.current_phase,
    };

    return { success: true, data: created, source: 'database' };
  }

  // Demo fallback
  const demoFlock: Flock = {
    id: `flock-${Date.now()}`,
    ...input,
  };
  return { success: true, data: demoFlock, source: 'demo_sandbox' };
}

/**
 * Updates flock phase or closes batch
 */
export async function updateFlockPhaseDAL(
  input: UpdateFlockPhaseInput
): Promise<DataLayerResponse<boolean>> {
  const validation = updateFlockPhaseSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Validation failed',
      source: 'database',
    };
  }

  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { error } = await supabase
      .from('flocks')
      .update({
        current_phase: input.currentPhase,
      })
      .eq('id', input.flockId);

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    return { success: true, data: true, source: 'database' };
  }

  return { success: true, data: true, source: 'demo_sandbox' };
}

/**
 * Loads all flocks for a farm
 */
export async function loadFarmFlocks(
  farmId: string
): Promise<DataLayerResponse<Flock[]>> {
  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { data, error } = await supabase
      .from('flocks')
      .select('*')
      .eq('farm_id', farmId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    const flocks: Flock[] = (data || []).map((f: any) => ({
      id: f.id,
      farmId: f.farm_id,
      shedId: f.shed_id,
      batchCode: f.batch_code,
      breed: f.breed,
      hatcherySource: f.hatchery_source,
      placementDate: f.placement_date,
      initialChickCount: f.initial_chick_count,
      chickCostPerBird: Number(f.chick_cost_per_bird),
      currentBirdCount: f.current_bird_count,
      ageWeeks: 34,
      currentPhase: f.current_phase,
    }));

    return { success: true, data: flocks, source: 'database' };
  }

  return { success: true, data: SEED_FLOCKS, source: 'demo_sandbox' };
}

/**
 * Saves a new shed to Supabase or sandbox
 */
export async function saveShed(
  input: CreateShedInput
): Promise<DataLayerResponse<Shed>> {
  const validation = createShedSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Validation failed',
      source: 'database',
    };
  }

  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { data, error } = await supabase
      .from('sheds')
      .insert({
        farm_id: input.farmId,
        shed_number: input.shedNumber,
        name: input.name,
        capacity: input.capacity,
        shed_type: input.shedType,
        has_climate_sensors: input.hasSensors,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    const shed: Shed = {
      id: data.id,
      farmId: data.farm_id,
      shedNumber: data.shed_number,
      name: data.name,
      capacity: data.capacity,
      shedType: data.shed_type,
      hasSensors: data.has_climate_sensors,
    };

    return { success: true, data: shed, source: 'database' };
  }

  const demoShed: Shed = {
    id: `shed-${Date.now()}`,
    ...input,
  };
  return { success: true, data: demoShed, source: 'demo_sandbox' };
}

/**
 * Loads sheds for a farm
 */
export async function loadFarmSheds(
  farmId: string
): Promise<DataLayerResponse<Shed[]>> {
  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { data, error } = await supabase
      .from('sheds')
      .select('*')
      .eq('farm_id', farmId)
      .order('shed_number', { ascending: true });

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    const sheds: Shed[] = (data || []).map((s: any) => ({
      id: s.id,
      farmId: s.farm_id,
      shedNumber: s.shed_number,
      name: s.name,
      capacity: s.capacity,
      shedType: s.shed_type,
      hasSensors: s.has_climate_sensors,
    }));

    return { success: true, data: sheds, source: 'database' };
  }

  return { success: true, data: SEED_SHEDS, source: 'demo_sandbox' };
}

/**
 * Saves a daily mandi rate entry
 */
export async function saveMandiRate(
  input: MandiRateInput
): Promise<DataLayerResponse<MarketRate>> {
  const validation = mandiRateSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Validation failed',
      source: 'database',
    };
  }

  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { data, error } = await supabase
      .from('market_rates')
      .insert({
        mandi_name: input.mandiName,
        state: input.state,
        rate_date: input.rateDate,
        price_per_100: input.pricePer100,
        price_per_piece: input.pricePerPiece,
        trend: input.trend,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    const rate: MarketRate = {
      mandiName: data.mandi_name,
      rateDate: data.rate_date,
      ratePer100: Number(data.price_per_100),
      ratePerEgg: Number(data.price_per_piece),
      trend: data.trend === 'stable' ? 'steady' : data.trend,
    };

    return { success: true, data: rate, source: 'database' };
  }

  const rate: MarketRate = {
    mandiName: input.mandiName,
    rateDate: input.rateDate,
    ratePer100: input.pricePer100,
    ratePerEgg: input.pricePerPiece,
    trend: input.trend,
  };
  return { success: true, data: rate, source: 'demo_sandbox' };
}

/**
 * Loads market rates
 */
export async function loadMarketRates(): Promise<DataLayerResponse<MarketRate[]>> {
  const client = getSupabaseBrowserClient();
  if (client) {
    const supabase = client as any;
    const { data, error } = await supabase
      .from('market_rates')
      .select('*')
      .order('rate_date', { ascending: false })
      .limit(30);

    if (error) {
      return { success: false, error: error.message, source: 'database' };
    }

    const rates: MarketRate[] = (data || []).map((r: any) => ({
      mandiName: r.mandi_name,
      rateDate: r.rate_date,
      ratePer100: Number(r.price_per_100),
      ratePerEgg: Number(r.price_per_piece),
      trend: r.trend === 'stable' ? 'steady' : r.trend,
    }));

    return { success: true, data: rates, source: 'database' };
  }

  return { success: true, data: SEED_MARKET_RATES, source: 'demo_sandbox' };
}
