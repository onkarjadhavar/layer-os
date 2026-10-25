import { describe, it, expect } from 'vitest';
import {
  calculateClosingBirds,
  calculateHDPercent,
  calculateFeedPerBirdGrams,
  calculateMortalityPercent,
  calculateDailyMetrics,
  DEFAULT_UNIT_SETTINGS,
} from './index';

describe('Phase 3 Gate: 30-Day End-to-End Month Calculation', () => {
  it('accurately computes 30 continuous days of production, feed, and financial metrics matching exact hand calculations', () => {
    let currentOpening = 30000;
    const dailyMortality = 5;
    const dailyEggsCollected = 27300;
    const brokenEggs = 120;
    const softShell = 30;
    const dailyFeedKg = 3300;
    const feedPricePerKg = 35.00;
    const sellingPricePerEgg = 5.40;
    const dailyOtherCash = 12000;

    let totalEggsCollected = 0;
    let totalGoodEggs = 0;
    let totalFeedIssuedKg = 0;
    let totalRevenue = 0;
    let totalFeedExpense = 0;
    let totalOtherExpense = 0;
    let totalOperatingProfit = 0;

    const days = 30;

    for (let day = 1; day <= days; day++) {
      const closing = calculateClosingBirds(currentOpening, dailyMortality, 0);
      const goodEggs = dailyEggsCollected - brokenEggs - softShell;
      const hdPct = calculateHDPercent(dailyEggsCollected, currentOpening, closing);
      const feedGrams = calculateFeedPerBirdGrams(dailyFeedKg, closing);
      const mortPct = calculateMortalityPercent(dailyMortality, currentOpening);

      // Verify each day's formulas
      expect(closing).toBe(currentOpening - 5);
      expect(goodEggs).toBe(27150);
      expect(hdPct).toBeGreaterThan(91.0);
      expect(hdPct).toBeLessThan(91.6);
      expect(feedGrams).toBeGreaterThanOrEqual(110.0);
      expect(feedGrams).toBeLessThan(111.0);
      expect(mortPct).toBeCloseTo(0.017, 2);

      const metrics = calculateDailyMetrics({
        openingBirds: currentOpening,
        mortality: dailyMortality,
        eggsCollected: dailyEggsCollected,
        feedKg: dailyFeedKg,
        feedPricePerKg,
        sellingPricePerEgg,
        otherCashExpenses: dailyOtherCash,
      }, DEFAULT_UNIT_SETTINGS);

      // Daily operating profit: 27,300 * 5.40 (147,420) - (3300 * 35 = 115,500) - 12000 = 19920
      expect(metrics.simpleOperatingProfit).toBe(19920);

      totalEggsCollected += dailyEggsCollected;
      totalGoodEggs += goodEggs;
      totalFeedIssuedKg += dailyFeedKg;
      totalRevenue += metrics.totalRevenue;
      totalFeedExpense += metrics.feedCost;
      totalOtherExpense += dailyOtherCash;
      totalOperatingProfit += metrics.simpleOperatingProfit;

      // Next day starts with today's closing
      currentOpening = closing;
    }

    // End-of-month assertions matching hand-calculations
    expect(currentOpening).toBe(29850); // 30,000 - (30 * 5)
    expect(totalEggsCollected).toBe(819000); // 27,300 * 30
    expect(totalGoodEggs).toBe(814500); // 27,150 * 30
    expect(totalFeedIssuedKg).toBe(99000); // 3,300 * 30 = 99 MT
    expect(totalRevenue).toBe(4422600); // 27,300 * 30 * ₹5.40
    expect(totalFeedExpense).toBe(3465000); // 99,000 * ₹35.00
    expect(totalOtherExpense).toBe(360000); // 30 * ₹12,000
    expect(totalOperatingProfit).toBe(597600); // 4,422,600 - 3,465,000 - 360,000 = ₹5,97,600

    // Cumulative 30-day operating profit exact reconciliation
    const reconciledProfit = totalRevenue - totalFeedExpense - totalOtherExpense;
    expect(totalOperatingProfit).toBe(reconciledProfit);
  });

  it('correctly calculates Hen-Day % using true international average live birds', () => {
    // 30,000 opening, 30 mortality -> closing 29,970 -> average 29,985
    // 27,290 eggs
    const hd = calculateHDPercent(27290, 30000, 29970);
    // 27290 / 29985 * 100 = 91.0121... -> 91.01%
    expect(hd).toBe(91.01);
  });
});
