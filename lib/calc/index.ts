/**
 * LayerOS Pure TypeScript Calculation Engine
 * Core financial & poultry production mathematics
 */

export interface UnitSettings {
  traySizeEggs: number; // default 30
  gattaSizeTrays: number; // default 7 trays = 210 eggs (Western Maharashtra standard)
  cartonSizeTrays: number; // default 12 trays = 360 eggs
  feedBagWeightKg: number; // default 50 kg
  defaultRateUnit: 'per_egg' | 'per_100' | 'per_tray' | 'per_gatta';
}

export const DEFAULT_UNIT_SETTINGS: UnitSettings = {
  traySizeEggs: 30,
  gattaSizeTrays: 7, // 7 * 30 = 210 eggs
  cartonSizeTrays: 12, // 12 * 30 = 360 eggs
  feedBagWeightKg: 50,
  defaultRateUnit: 'per_100',
};

export type EggUnit = 'per_egg' | 'per_100' | 'tray' | 'gatta' | 'carton';

/**
 * Computes closing birds count
 */
export function calculateClosingBirds(
  opening: number,
  mortality: number = 0,
  culls: number = 0,
  transfersIn: number = 0,
  transfersOut: number = 0
): number {
  return opening - mortality - culls + transfersIn - transfersOut;
}

/**
 * Hen-Day % (HD%): Eggs collected / Average live birds in the day * 100
 */
export function calculateHDPercent(
  eggs: number,
  openingBirds: number,
  closingBirds?: number
): number {
  const closing = closingBirds !== undefined ? closingBirds : openingBirds;
  const avgBirds = (openingBirds + closing) / 2;
  if (avgBirds <= 0) return 0;
  return Number(((eggs / avgBirds) * 100).toFixed(2));
}

/**
 * Feed intake per bird in grams: (feedKg * 1000) / closingBirds
 */
export function calculateFeedPerBirdGrams(
  feedKg: number,
  closingBirds: number
): number {
  if (closingBirds <= 0) return 0;
  return Number(((feedKg * 1000) / closingBirds).toFixed(1));
}

/**
 * Mortality %: (mortality / openingBirds) * 100
 */
export function calculateMortalityPercent(
  mortality: number,
  openingBirds: number
): number {
  if (openingBirds <= 0) return 0;
  return Number(((mortality / openingBirds) * 100).toFixed(3));
}

/**
 * Total egg count multiplier for a specific unit
 */
export function getEggsPerUnit(unit: EggUnit, settings: UnitSettings = DEFAULT_UNIT_SETTINGS): number {
  switch (unit) {
    case 'per_egg':
      return 1;
    case 'per_100':
      return 100;
    case 'tray':
      return settings.traySizeEggs;
    case 'gatta':
      return settings.gattaSizeTrays * settings.traySizeEggs;
    case 'carton':
      return settings.cartonSizeTrays * settings.traySizeEggs;
    default:
      return 1;
  }
}

/**
 * Converts egg count from one unit to another
 */
export function convertEggUnits(
  quantity: number,
  fromUnit: EggUnit,
  toUnit: EggUnit,
  settings: UnitSettings = DEFAULT_UNIT_SETTINGS
): number {
  const totalEggs = quantity * getEggsPerUnit(fromUnit, settings);
  const targetPerUnit = getEggsPerUnit(toUnit, settings);
  return Number((totalEggs / targetPerUnit).toFixed(2));
}

/**
 * Converts price rate from one unit to another
 * e.g., ₹5.40 per egg -> ₹540 per 100 -> ₹162 per tray (30) -> ₹1,134 per gatta (7 trays / 210 eggs)
 */
export function convertEggRate(
  rate: number,
  fromUnit: EggUnit,
  toUnit: EggUnit,
  settings: UnitSettings = DEFAULT_UNIT_SETTINGS
): number {
  const ratePerSingleEgg = rate / getEggsPerUnit(fromUnit, settings);
  const targetMultiplier = getEggsPerUnit(toUnit, settings);
  return Number((ratePerSingleEgg * targetMultiplier).toFixed(2));
}

export interface DailyCalculationInput {
  openingBirds: number;
  mortality: number;
  culls?: number;
  eggsCollected: number;
  feedKg: number;
  feedPricePerKg: number; // e.g. ₹35/kg
  sellingPricePerEgg: number; // e.g. ₹5.40/egg
  otherCashExpenses?: number; // e.g. ₹12,000
  otherIncome?: number; // empty bags, manure, etc.
  allocatedOverheads?: {
    labourDaily?: number;
    electricityDaily?: number;
    medicineDaily?: number;
    pulletAmortizationDaily?: number;
    shedDepreciationDaily?: number;
    loanInterestDaily?: number;
    mortalityLossDaily?: number;
  };
}

export interface DailyCalculationResult {
  closingBirds: number;
  productionPct: number;
  hdPct: number;
  feedPerBirdG: number;
  mortalityPct: number;
  eggSalesRevenue: number;
  otherIncome: number;
  totalRevenue: number;
  feedCost: number;
  otherCashExpenses: number;
  totalCashExpenses: number;
  simpleOperatingProfit: number;
  operatingCostPerEgg: number;
  marginPerEggOperating: number;
  allocatedOverheadsTotal: number;
  trueCostTotal: number;
  trueCostPerEgg: number;
  trueProfit: number;
  marginPerEggTrue: number;
  breakEvenEggPrice: number;
  breakEvenEggPricePer100: number;
  breakEvenEggPricePerGatta: number;
  breakEvenStatus: 'safe' | 'warning' | 'loss';
  fcrDozen: number;
}

/**
 * Calculates complete daily operating and true profit summary
 */
export function calculateDailyMetrics(
  input: DailyCalculationInput,
  settings: UnitSettings = DEFAULT_UNIT_SETTINGS
): DailyCalculationResult {
  const culls = input.culls || 0;
  const closingBirds = calculateClosingBirds(input.openingBirds, input.mortality, culls);
  
  // Production % against closing live birds
  const productionPct = closingBirds > 0 
    ? Number(((input.eggsCollected / closingBirds) * 100).toFixed(2))
    : 0;

  // Hen-Day % against average live birds
  const hdPct = calculateHDPercent(input.eggsCollected, input.openingBirds, closingBirds);

  // Feed in grams per bird
  const feedPerBirdG = calculateFeedPerBirdGrams(input.feedKg, closingBirds);

  // Mortality %
  const mortalityPct = calculateMortalityPercent(input.mortality, input.openingBirds);

  // Egg sales revenue
  const eggSalesRevenue = Number((input.eggsCollected * input.sellingPricePerEgg).toFixed(2));
  const otherIncome = input.otherIncome || 0;
  const totalRevenue = Number((eggSalesRevenue + otherIncome).toFixed(2));

  // Costs
  const feedCost = Number((input.feedKg * input.feedPricePerKg).toFixed(2));
  const otherCashExpenses = input.otherCashExpenses || 0;
  const totalCashExpenses = Number((feedCost + otherCashExpenses).toFixed(2));

  // Simple Operating Profit (Cash View)
  const simpleOperatingProfit = Number((totalRevenue - totalCashExpenses).toFixed(2));

  // Operating Cost per egg
  const operatingCostPerEgg = input.eggsCollected > 0
    ? Number((totalCashExpenses / input.eggsCollected).toFixed(2))
    : 0;

  const marginPerEggOperating = Number((input.sellingPricePerEgg - operatingCostPerEgg).toFixed(2));

  // Overheads breakdown
  const o = input.allocatedOverheads || {};
  const allocatedOverheadsTotal = Number((
    (o.labourDaily || 0) +
    (o.electricityDaily || 0) +
    (o.medicineDaily || 0) +
    (o.pulletAmortizationDaily || 0) +
    (o.shedDepreciationDaily || 0) +
    (o.loanInterestDaily || 0) +
    (o.mortalityLossDaily || 0)
  ).toFixed(2));

  // True Profit & True Cost
  const trueCostTotal = Number((totalCashExpenses + allocatedOverheadsTotal).toFixed(2));
  const trueCostPerEgg = input.eggsCollected > 0
    ? Number((trueCostTotal / input.eggsCollected).toFixed(2))
    : 0;
  const trueProfit = Number((totalRevenue - trueCostTotal).toFixed(2));
  const marginPerEggTrue = Number((input.sellingPricePerEgg - trueCostPerEgg).toFixed(2));

  // Break-even Egg Price (based on True Cost)
  const breakEvenEggPrice = trueCostPerEgg;
  const breakEvenEggPricePer100 = convertEggRate(breakEvenEggPrice, 'per_egg', 'per_100', settings);
  const breakEvenEggPricePerGatta = convertEggRate(breakEvenEggPrice, 'per_egg', 'gatta', settings);

  // Safety Status: Safe if selling >= breakEven + ₹0.30, Warning if breakEven <= selling < breakEven + ₹0.30, Loss if selling < breakEven
  let breakEvenStatus: 'safe' | 'warning' | 'loss' = 'safe';
  if (input.sellingPricePerEgg < breakEvenEggPrice) {
    breakEvenStatus = 'loss';
  } else if (input.sellingPricePerEgg - breakEvenEggPrice < 0.30) {
    breakEvenStatus = 'warning';
  }

  // FCR per dozen eggs: feedKg / (eggs / 12)
  const fcrDozen = input.eggsCollected > 0
    ? Number((input.feedKg / (input.eggsCollected / 12)).toFixed(3))
    : 0;

  return {
    closingBirds,
    productionPct,
    hdPct,
    feedPerBirdG,
    mortalityPct,
    eggSalesRevenue,
    otherIncome,
    totalRevenue,
    feedCost,
    otherCashExpenses,
    totalCashExpenses,
    simpleOperatingProfit,
    operatingCostPerEgg,
    marginPerEggOperating,
    allocatedOverheadsTotal,
    trueCostTotal,
    trueCostPerEgg,
    trueProfit,
    marginPerEggTrue,
    breakEvenEggPrice,
    breakEvenEggPricePer100,
    breakEvenEggPricePerGatta,
    breakEvenStatus,
    fcrDozen,
  };
}

/**
 * Indian currency formatter (Lakh / Crore comma separation)
 * e.g. 147420 -> "₹1,47,420"
 */
export function formatIndianCurrency(amount: number, showDecimals: boolean = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const parts = absAmount.toFixed(showDecimals ? 2 : 0).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  return `${isNegative ? '-' : ''}₹${integerPart}${decimalPart}`;
}

/**
 * Indian standard number formatting (without ₹)
 */
export function formatIndianNumber(num: number): string {
  const parts = num.toString().split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return `${integerPart}${decimalPart}`;
}
