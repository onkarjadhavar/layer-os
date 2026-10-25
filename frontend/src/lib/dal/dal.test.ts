import { describe, it, expect } from 'vitest';
import {
  quickDailyRecordSchema,
  createSaleSchema,
  createFarmSchema,
  unitSettingsSchema,
} from './validation';
import { saveQuickDailyRecord, isBackendConnected } from './index';

describe('LayerOS Data-Access Layer & Zod Validation Suite', () => {
  it('enforces strict validation on daily record mutations', () => {
    // Valid input passes
    const valid = quickDailyRecordSchema.safeParse({
      farmId: 'farm-01',
      flockId: 'flock-01',
      recordDate: '2026-10-08',
      eggsCollected: 27300,
      feedKg: 3300,
      mortality: 15,
      sellingRate: 5.40,
    });
    expect(valid.success).toBe(true);

    // Negative mortality fails
    const invalidMort = quickDailyRecordSchema.safeParse({
      farmId: 'farm-01',
      flockId: 'flock-01',
      recordDate: '2026-10-08',
      eggsCollected: 27300,
      feedKg: 3300,
      mortality: -5,
      sellingRate: 5.40,
    });
    expect(invalidMort.success).toBe(false);

    // Invalid date format fails
    const invalidDate = quickDailyRecordSchema.safeParse({
      farmId: 'farm-01',
      flockId: 'flock-01',
      recordDate: '08-10-2026', // non YYYY-MM-DD
      eggsCollected: 27300,
      feedKg: 3300,
      mortality: 15,
      sellingRate: 5.40,
    });
    expect(invalidDate.success).toBe(false);
  });

  it('validates farm creation and Indian phone number requirements', () => {
    const validFarm = createFarmSchema.safeParse({
      farmName: 'Sahyadri Layer Farm',
      ownerName: 'Sachin Gaikwad',
      phone: '9822012345',
      district: 'Pune',
      capacity: 35000,
      breed: 'BV300',
      initialBirds: 30000,
      ageWeeks: 34,
    });
    expect(validFarm.success).toBe(true);

    // Invalid phone number (< 10 digits or invalid starting digit)
    const invalidPhone = createFarmSchema.safeParse({
      farmName: 'Sahyadri Layer Farm',
      ownerName: 'Sachin Gaikwad',
      phone: '12345',
      district: 'Pune',
    });
    expect(invalidPhone.success).toBe(false);
  });

  it('validates sale creation schemas', () => {
    const validSale = createSaleSchema.safeParse({
      farmId: 'farm-01',
      customerId: 'cust-01',
      saleDate: '2026-10-08',
      saleType: 'eggs',
      quantityUnits: 15000,
      unitName: 'eggs',
      ratePerUnit: 5.40,
      grossAmount: 81000,
      discount: 0,
      netAmount: 81000,
      paidAmount: 81000,
    });
    expect(validSale.success).toBe(true);

    // Negative quantity fails
    const negativeQty = createSaleSchema.safeParse({
      farmId: 'farm-01',
      customerId: 'cust-01',
      saleDate: '2026-10-08',
      quantityUnits: -100,
      unitName: 'eggs',
      ratePerUnit: 5.40,
      grossAmount: 0,
      netAmount: 0,
    });
    expect(negativeQty.success).toBe(false);
  });

  it('executes saveQuickDailyRecord and computes metrics in demo fallback mode', async () => {
    const res = await saveQuickDailyRecord({
      farmId: 'farm-sahyadri-01',
      flockId: 'flock-01',
      recordDate: '2026-10-08',
      eggsCollected: 27300,
      feedKg: 3300,
      mortality: 15,
      sellingRate: 5.40,
    });

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    if (res.data) {
      expect(res.data.closingBirds).toBe(29985);
      expect(res.data.hdPct).toBe(91.02);
      expect(res.data.simpleOperatingProfit).toBe(19920);
      expect(res.data.breakEvenEggPrice).toBe(5.21);
    }
  });

  it('correctly reports backend connection status', () => {
    // In local unit testing without env variables set, backend is disconnected
    expect(typeof isBackendConnected()).toBe('boolean');
  });
});
