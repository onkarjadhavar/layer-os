/**
 * LayerOS Offline Sync Queue (IndexedDB)
 * Allows poultry farmers to record daily egg collections, mortality, feed, and sales
 * when network drops in shed areas, syncing automatically when connectivity resumes.
 */

export interface QueuedMutation {
  id: string;
  type: 'CREATE_DAILY_LOG' | 'RECORD_SALE' | 'RECORD_EXPENSE' | 'UPDATE_FLOCK' | 'GENERIC_MUTATION';
  payload: Record<string, unknown>;
  farmId: string;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed';
  lastError?: string;
}

const DB_NAME = 'layeros_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'sync_queue';

// In-memory fallback for SSR and non-IndexedDB environments
const inMemoryQueue: QueuedMutation[] = [];

function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      return reject(new Error('IndexedDB not available'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by_farmId', 'farmId', { unique: false });
        store.createIndex('by_timestamp', 'timestamp', { unique: false });
        store.createIndex('by_status', 'status', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Enqueue a mutation for offline synchronization
 */
export async function enqueueOfflineMutation(
  item: Omit<QueuedMutation, 'retryCount' | 'status'>
): Promise<QueuedMutation> {
  const queuedItem: QueuedMutation = {
    ...item,
    retryCount: 0,
    status: 'pending',
  };

  if (!isIndexedDBAvailable()) {
    inMemoryQueue.push(queuedItem);
    return queuedItem;
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(queuedItem);

      req.onsuccess = () => resolve(queuedItem);
      req.onerror = () => reject(req.error);
    });
  } catch {
    inMemoryQueue.push(queuedItem);
    return queuedItem;
  }
}

/**
 * Get all pending mutations from the queue
 */
export async function getPendingMutations(): Promise<QueuedMutation[]> {
  if (!isIndexedDBAvailable()) {
    return [...inMemoryQueue];
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const items = (req.result as QueuedMutation[]) || [];
        resolve(items.filter((item) => item.status !== 'syncing'));
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [...inMemoryQueue];
  }
}

/**
 * Mark a mutation as successfully synced and delete from storage
 */
export async function markMutationSynced(id: string): Promise<void> {
  const memIndex = inMemoryQueue.findIndex((i) => i.id === id);
  if (memIndex !== -1) {
    inMemoryQueue.splice(memIndex, 1);
  }

  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // silently ignore fallback error
  }
}

/**
 * Mark a mutation as failed and increment retry count
 */
export async function markMutationFailed(id: string, errorMsg?: string): Promise<void> {
  const memItem = inMemoryQueue.find((i) => i.id === id);
  if (memItem) {
    memItem.retryCount += 1;
    memItem.status = memItem.retryCount >= 5 ? 'failed' : 'pending';
    if (errorMsg) memItem.lastError = errorMsg;
  }

  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const item = getReq.result as QueuedMutation;
      if (item) {
        item.retryCount += 1;
        item.status = item.retryCount >= 5 ? 'failed' : 'pending';
        if (errorMsg) item.lastError = errorMsg;
        store.put(item);
      }
    };
  } catch {
    // fallback
  }
}

/**
 * Clear the entire offline queue (useful for testing and reset)
 */
export async function clearOfflineQueue(): Promise<void> {
  inMemoryQueue.length = 0;
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch {
    // fallback
  }
}

/**
 * Drain and flush all pending offline mutations through the provided processor
 */
export async function flushOfflineQueue(
  processor: (mutation: QueuedMutation) => Promise<boolean>
): Promise<{ syncedCount: number; failedCount: number }> {
  const pending = await getPendingMutations();
  let syncedCount = 0;
  let failedCount = 0;

  for (const item of pending) {
    try {
      const success = await processor(item);
      if (success) {
        await markMutationSynced(item.id);
        syncedCount += 1;
      } else {
        await markMutationFailed(item.id);
        failedCount += 1;
      }
    } catch {
      await markMutationFailed(item.id);
      failedCount += 1;
    }
  }

  return { syncedCount, failedCount };
}
