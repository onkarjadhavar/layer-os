import { describe, it, expect, beforeEach } from 'vitest';
import {
  enqueueOfflineMutation,
  getPendingMutations,
  markMutationSynced,
  markMutationFailed,
  flushOfflineQueue,
  clearOfflineQueue,
  QueuedMutation,
} from './sync-queue';

describe('LayerOS Offline Sync Queue (Phase 8)', () => {
  beforeEach(async () => {
    await clearOfflineQueue();
  });

  it('enqueues a daily quick log mutation into the queue', async () => {
    const item = await enqueueOfflineMutation({
      id: 'mut-1',
      type: 'CREATE_DAILY_LOG',
      farmId: 'farm-123',
      payload: {
        date: '2026-10-22',
        totalEggsCollected: 28000,
        mortality: 12,
        feedIssuedKg: 3300,
      },
      timestamp: 1729555200000,
    });

    expect(item.id).toBe('mut-1');
    expect(item.status).toBe('pending');
    expect(item.retryCount).toBe(0);

    const pending = await getPendingMutations();
    expect(pending.length).toBe(1);
    expect(pending[0].payload.totalEggsCollected).toBe(28000);
  });

  it('marks mutation as synced and deletes from pending queue', async () => {
    await enqueueOfflineMutation({
      id: 'mut-2',
      type: 'RECORD_SALE',
      farmId: 'farm-123',
      payload: { customerId: 'cust-1', trays: 100, rate: 160 },
      timestamp: 1729555200000,
    });

    let pending = await getPendingMutations();
    expect(pending.length).toBe(1);

    await markMutationSynced('mut-2');
    pending = await getPendingMutations();
    expect(pending.length).toBe(0);
  });

  it('increments retry count on failure and marks failed after 5 retries', async () => {
    await enqueueOfflineMutation({
      id: 'mut-3',
      type: 'RECORD_EXPENSE',
      farmId: 'farm-123',
      payload: { category: 'feed', amount: 50000 },
      timestamp: 1729555200000,
    });

    for (let i = 0; i < 4; i++) {
      await markMutationFailed('mut-3', 'Network error');
    }

    let pending = await getPendingMutations();
    expect(pending[0].retryCount).toBe(4);
    expect(pending[0].status).toBe('pending');

    // 5th failure marks it failed
    await markMutationFailed('mut-3', 'Final error');
    pending = await getPendingMutations();
    expect(pending[0].status).toBe('failed');
  });

  it('flushes pending queue through processor function', async () => {
    await enqueueOfflineMutation({
      id: 'mut-4',
      type: 'CREATE_DAILY_LOG',
      farmId: 'farm-1',
      payload: { eggs: 27000 },
      timestamp: 1729555200000,
    });

    await enqueueOfflineMutation({
      id: 'mut-5',
      type: 'RECORD_SALE',
      farmId: 'farm-1',
      payload: { eggs: 15000 },
      timestamp: 1729555200000,
    });

    const processedIds: string[] = [];
    const result = await flushOfflineQueue(async (mutation: QueuedMutation) => {
      processedIds.push(mutation.id);
      return true; // simulated server sync success
    });

    expect(result.syncedCount).toBe(2);
    expect(result.failedCount).toBe(0);
    expect(processedIds).toEqual(['mut-4', 'mut-5']);

    const remaining = await getPendingMutations();
    expect(remaining.length).toBe(0);
  });
});
