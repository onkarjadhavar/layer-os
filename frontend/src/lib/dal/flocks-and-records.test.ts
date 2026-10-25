import { describe, it, expect } from 'vitest';
import {
  saveFlock,
  updateFlockPhaseDAL,
  saveShed,
  loadFarmSheds,
  saveQuickDailyRecord,
  saveMandiRate,
  loadMarketRates,
} from './index';
import { DEFAULT_UNIT_SETTINGS } from '../calc';

describe('Phase 3: Core Poultry Flocks, Sheds, and Records Integration', () => {
  const testFarmId = 'farm-sahyadri-01';
  const testShedId = 'shed-01';

  it('validates and creates a new flock batch', async () => {
    const res = await saveFlock({
      farmId: testFarmId,
      shedId: testShedId,
      batchCode: 'BATCH-2026-TEST',
      breed: 'BV-300 Layer',
      hatcherySource: "Venky's Pune",
      placementDate: '2026-03-01',
      initialChickCount: 15000,
      chickCostPerBird: 45.00,
      currentBirdCount: 15000,
      ageWeeks: 1,
      currentPhase: 'brooding',
    });

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.batchCode).toBe('BATCH-2026-TEST');
    expect(res.data?.initialChickCount).toBe(15000);
    expect(res.data?.currentPhase).toBe('brooding');
  });

  it('rejects flock creation with invalid data (negative chicks)', async () => {
    const res = await saveFlock({
      farmId: testFarmId,
      shedId: testShedId,
      batchCode: 'FAIL-BATCH',
      breed: 'BV-300',
      hatcherySource: "Venky's",
      placementDate: '2026-03-01',
      initialChickCount: -500, // Invalid
      chickCostPerBird: 45.00,
      currentBirdCount: 15000,
      ageWeeks: 1,
      currentPhase: 'brooding',
    });

    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('updates flock phase across lifecycle', async () => {
    const res = await updateFlockPhaseDAL({
      flockId: 'flock-bv300-batch-24',
      currentPhase: 'post_peak',
    });

    expect(res.success).toBe(true);
  });

  it('creates and lists sheds', async () => {
    const shedRes = await saveShed({
      farmId: testFarmId,
      shedNumber: 'S-99',
      name: 'शेड ९९ (Automated Test Shed)',
      capacity: 12000,
      shedType: 'environment_controlled',
      hasSensors: true,
    });

    expect(shedRes.success).toBe(true);
    expect(shedRes.data?.shedNumber).toBe('S-99');
    expect(shedRes.data?.capacity).toBe(12000);

    const listRes = await loadFarmSheds(testFarmId);
    expect(listRes.success).toBe(true);
    expect(listRes.data?.length).toBeGreaterThan(0);
  });

  it('saves and calculates daily quick entry', async () => {
    const record = await saveQuickDailyRecord({
      farmId: testFarmId,
      flockId: 'flock-bv300-batch-24',
      recordDate: '2026-10-15',
      eggsCollected: 27290,
      feedKg: 3300,
      mortality: 15,
      sellingRate: 5.40,
    }, DEFAULT_UNIT_SETTINGS, 30000, 35.00);

    expect(record.success).toBe(true);
    expect(record.data).toBeDefined();
    expect(record.data?.closingBirds).toBe(29985); // 30,000 - 15
    expect(record.data?.goodEggs).toBe(27072);
    expect(record.data?.hdPct).toBe(90.99);
    expect(record.data?.simpleOperatingProfit).toBe(19866); // 27,290 * 5.40 (147,366) - 115,500 - 12,000 = 19,866
  });

  it('records and retrieves market rates', async () => {
    const res = await saveMandiRate({
      mandiName: 'सोलापूर (Solapur)',
      state: 'Maharashtra',
      rateDate: '2026-10-15',
      pricePer100: 535,
      pricePerPiece: 5.35,
      trend: 'up',
    });

    expect(res.success).toBe(true);
    expect(res.data?.mandiName).toBe('सोलापूर (Solapur)');
    expect(res.data?.ratePer100).toBe(535);

    const list = await loadMarketRates();
    expect(list.success).toBe(true);
    expect(list.data?.length).toBeGreaterThan(0);
  });
});
