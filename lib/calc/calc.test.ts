import { describe, it, expect } from 'vitest';
import {
  calculateClosingBirds,
  calculateHDPercent,
  calculateFeedPerBirdGrams,
  calculateMortalityPercent,
  calculateDailyMetrics,
  convertEggUnits,
  convertEggRate,
  formatIndianCurrency,
  DEFAULT_UNIT_SETTINGS,
} from './index';

describe('LayerOS Calculation Engine - Reference Day Fixture & Unit Tests', () => {
  it('accurately reproduces the Reference Day operational numbers', () => {
    // Reference day: Birds 30,000 | Eggs 27,300 | Feed 3,300 kg | Mortality 15
    const openingBirds = 30000;
    const mortality = 15;
    const eggsCollected = 27300;
    const feedKg = 3300;
    const feedPricePerKg = 35; // ₹35/kg -> ₹1,15,500
    const sellingPricePerEgg = 5.40; // ₹5.40/egg -> ₹1,47,420
    const otherExpenses = 12000;

    const closingBirds = calculateClosingBirds(openingBirds, mortality);
    expect(closingBirds).toBe(29985);

    // Production % = 27,300 / 29,985 = 91.0%
    const productionPct = Math.round((eggsCollected / closingBirds) * 100);
    expect(productionPct).toBe(91);

    // HD% on opening/closing average
    const hdPct = calculateHDPercent(eggsCollected, openingBirds, closingBirds);
    expect(hdPct).toBe(91.02);

    // Feed per bird = 3300 kg * 1000 / 29985 birds = 110.05 g ~ 110 g
    const feedPerBirdG = calculateFeedPerBirdGrams(feedKg, closingBirds);
    expect(Math.round(feedPerBirdG)).toBe(110);

    // Mortality % = 15 / 30000 = 0.05%
    const mortPct = calculateMortalityPercent(mortality, openingBirds);
    expect(mortPct).toBe(0.05);

    // Run complete daily metrics
    const metrics = calculateDailyMetrics({
      openingBirds,
      mortality,
      eggsCollected,
      feedKg,
      feedPricePerKg,
      sellingPricePerEgg,
      otherCashExpenses: otherExpenses,
      allocatedOverheads: {
        labourDaily: 3500,
        electricityDaily: 1200,
        medicineDaily: 1500,
        pulletAmortizationDaily: 4500,
        shedDepreciationDaily: 1500,
        loanInterestDaily: 1800,
        mortalityLossDaily: 600,
      },
    });

    // Egg sales revenue: 27,300 * 5.40 = ₹1,47,420
    expect(metrics.eggSalesRevenue).toBe(147420);

    // Feed cost: 3300 * 35 = ₹1,15,500
    expect(metrics.feedCost).toBe(115500);

    // Total cash expenses: 1,15,500 + 12,000 = ₹1,27,500
    expect(metrics.totalCashExpenses).toBe(127500);

    // Simple Operating Profit: 1,47,420 - 1,27,500 = ₹19,920
    expect(metrics.simpleOperatingProfit).toBe(19920);

    // Feed + other expenses per egg: 127500 / 27300 = ₹4.6703... -> ₹4.67
    expect(metrics.operatingCostPerEgg).toBe(4.67);

    // Operating margin per egg: 5.40 - 4.67 = ₹0.73
    expect(metrics.marginPerEggOperating).toBe(0.73);

    // Total allocated overheads: 3500 + 1200 + 1500 + 4500 + 1500 + 1800 + 600 = ₹14,600
    expect(metrics.allocatedOverheadsTotal).toBe(14600);

    // True Cost Total: 1,27,500 + 14,600 = ₹1,42,100
    expect(metrics.trueCostTotal).toBe(142100);

    // True Cost Per Egg: 142100 / 27300 = ₹5.205 -> ₹5.21
    expect(metrics.trueCostPerEgg).toBe(5.21);

    // True Profit: 1,47,420 - 1,42,100 = ₹5,320 (lower than simple profit, as expected!)
    expect(metrics.trueProfit).toBe(5320);

    // Break-even egg price equals True Cost per egg
    expect(metrics.breakEvenEggPrice).toBe(5.21);

    // Break-even per 100 = 5.21 * 100 = ₹521
    expect(metrics.breakEvenEggPricePer100).toBe(521);

    // Status: selling at ₹5.40 vs break-even ₹5.21 (within 0.30 margin -> warning)
    expect(metrics.breakEvenStatus).toBe('warning');
  });

  it('correctly handles egg unit conversions with custom farm settings', () => {
    // Default settings: tray = 30 eggs, gatta = 7 trays = 210 eggs, carton = 12 trays = 360 eggs
    expect(convertEggUnits(10, 'gatta', 'per_egg')).toBe(2100);
    expect(convertEggUnits(2100, 'per_egg', 'gatta')).toBe(10);
    expect(convertEggUnits(2100, 'per_egg', 'tray')).toBe(70);
    expect(convertEggUnits(70, 'tray', 'gatta')).toBe(10);

    // Price rate conversions:
    // ₹5.40 per egg -> ₹540 per 100 eggs
    expect(convertEggRate(5.40, 'per_egg', 'per_100')).toBe(540);
    // ₹5.40 per egg -> ₹162 per tray (30)
    expect(convertEggRate(5.40, 'per_egg', 'tray')).toBe(162);
    // ₹5.40 per egg -> ₹1,134 per gatta (210)
    expect(convertEggRate(5.40, 'per_egg', 'gatta')).toBe(1134);

    // Custom regional setting: say Ahmednagar gatta = 6 trays (180 eggs)
    const ahmednagarSettings = {
      ...DEFAULT_UNIT_SETTINGS,
      gattaSizeTrays: 6,
    };
    expect(convertEggUnits(1, 'gatta', 'per_egg', ahmednagarSettings)).toBe(180);
    expect(convertEggRate(5.40, 'per_egg', 'gatta', ahmednagarSettings)).toBe(972);
  });

  it('formats Indian currency and numbers with Lakh/Crore notation', () => {
    expect(formatIndianCurrency(147420)).toBe('₹1,47,420');
    expect(formatIndianCurrency(19920)).toBe('₹19,920');
    expect(formatIndianCurrency(1250000)).toBe('₹12,50,000');
    expect(formatIndianCurrency(-5000)).toBe('-₹5,000');
  });
});
