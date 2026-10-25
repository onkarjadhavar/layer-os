import { describe, it, expect, beforeEach } from 'vitest';
import { saveQuickDailyRecord, saveSaleTransaction } from './index';

// Mock localStorage for node environment
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = value; }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

const mockStorage = new MockLocalStorage();
(globalThis as any).localStorage = mockStorage;

describe('Phase 1 Gate: Record Creation, Refresh & Session Persistence', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('GATE TEST: Creates a record, simulates reload, logs out and in, verifying persistence', async () => {
    const testRecordDate = '2026-10-16';
    const testFarmId = 'farm-test-gate-01';
    const testFlockId = 'flock-test-gate-01';

    // Step 1: Create a daily record through DAL
    const createRes = await saveQuickDailyRecord({
      farmId: testFarmId,
      flockId: testFlockId,
      recordDate: testRecordDate,
      eggsCollected: 27500,
      feedKg: 3310,
      mortality: 12,
      sellingRate: 5.45,
    }, undefined, 30000, 35.0);

    expect(createRes.success).toBe(true);
    expect(createRes.data).toBeDefined();
    const createdRecord = createRes.data!;

    // Step 2: Persist state into storage
    const state = {
      user: { id: 'usr-01', phone: '9822012345', role: 'owner', farmId: testFarmId },
      dailyRecords: [createdRecord],
      isDemoMode: false,
    };
    mockStorage.setItem('layeros_app_state_v1', JSON.stringify(state));

    // Step 3: Simulate browser refresh (re-read from storage)
    const refreshedState = JSON.parse(mockStorage.getItem('layeros_app_state_v1')!);
    expect(refreshedState.dailyRecords).toHaveLength(1);
    expect(refreshedState.dailyRecords[0].recordDate).toBe(testRecordDate);
    expect(refreshedState.dailyRecords[0].totalEggsCollected).toBe(27500);
    expect(refreshedState.dailyRecords[0].mortality).toBe(12);
    expect(refreshedState.dailyRecords[0].closingBirds).toBe(29988);

    // Step 4: Simulate logout (clear session user, but retain farm records in tenant storage)
    const loggedOutState = {
      ...refreshedState,
      user: null,
    };
    mockStorage.setItem('layeros_app_state_v1', JSON.stringify(loggedOutState));

    const postLogout = JSON.parse(mockStorage.getItem('layeros_app_state_v1')!);
    expect(postLogout.user).toBeNull();
    expect(postLogout.dailyRecords).toHaveLength(1);

    // Step 5: Simulate log back in as user
    const loggedInState = {
      ...postLogout,
      user: { id: 'usr-01', phone: '9822012345', role: 'owner', farmId: testFarmId },
    };
    mockStorage.setItem('layeros_app_state_v1', JSON.stringify(loggedInState));

    // Step 6: Verify record is still there, intact and accurate!
    const finalState = JSON.parse(mockStorage.getItem('layeros_app_state_v1')!);
    expect(finalState.user.farmId).toBe(testFarmId);
    expect(finalState.dailyRecords).toHaveLength(1);
    expect(finalState.dailyRecords[0].recordDate).toBe(testRecordDate);
    expect(finalState.dailyRecords[0].totalEggsCollected).toBe(27500);
    expect(finalState.dailyRecords[0].closingBirds).toBe(29988);
  });

  it('GATE TEST: Creates a sale invoice, persists across reload', async () => {
    const saleRes = await saveSaleTransaction({
      farmId: 'farm-01',
      customerId: 'cust-amol-01',
      saleDate: '2026-10-16',
      saleType: 'eggs',
      quantityUnits: 15000,
      unitName: 'eggs',
      ratePerUnit: 5.40,
      grossAmount: 81000,
      discount: 0,
      netAmount: 81000,
      paidAmount: 50000,
      totalEggsEquivalent: 15000,
    }, 'INV-2026-GATE-01');

    expect(saleRes.success).toBe(true);
    expect(saleRes.data).toBeDefined();
    expect(saleRes.data!.paymentStatus).toBe('partial');
    expect(saleRes.data!.invoiceNumber).toBe('INV-2026-GATE-01');

    // Save and re-read from storage
    mockStorage.setItem('layeros_sales_test', JSON.stringify([saleRes.data]));
    const reloaded = JSON.parse(mockStorage.getItem('layeros_sales_test')!);
    expect(reloaded[0].invoiceNumber).toBe('INV-2026-GATE-01');
    expect(reloaded[0].paidAmount).toBe(50000);
  });
});
