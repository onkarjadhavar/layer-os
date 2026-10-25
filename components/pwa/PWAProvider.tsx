'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { flushOfflineQueue, getPendingMutations } from '@/lib/offline/sync-queue';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function getServerSnapshot() {
  return true;
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getServerSnapshot);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState(false);

  useEffect(() => {
    // Service Worker Management
    if ('serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        const handleLoad = () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
              console.log('LayerOS Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
              console.warn('Service Worker registration skipped:', error);
            });
        };

        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      } else {
        // In dev mode, unregister any stale SW to prevent outdated chunk caching on mobile devices
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        }).catch(() => {});
        if ('caches' in window) {
          caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key));
          }).catch(() => {});
        }

        // Suppress Next.js dev overlay badges from obscuring mobile bottom navigation
        const suppressDevPortal = () => {
          const portals = document.querySelectorAll('nextjs-portal');
          portals.forEach((p) => {
            const el = p as HTMLElement;
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('pointer-events', 'none', 'important');
          });
        };
        suppressDevPortal();
        const observer = new MutationObserver(suppressDevPortal);
        observer.observe(document.body, { childList: true, subtree: false });
        return () => observer.disconnect();
      }
    }
  }, []);

  useEffect(() => {
    const checkPending = async () => {
      try {
        const pending = await getPendingMutations();
        setPendingCount(pending.length);
      } catch {
        // ignore
      }
    };

    checkPending();

    if (isOnline) {
      const triggerSync = async () => {
        setIsSyncing(true);
        try {
          const { syncedCount } = await flushOfflineQueue(async (_mutation) => {
            return true;
          });
          if (syncedCount > 0) {
            setSyncSuccessToast(true);
            setTimeout(() => setSyncSuccessToast(false), 4000);
          }
        } finally {
          setIsSyncing(false);
          checkPending();
        }
      };

      triggerSync();
    }
  }, [isOnline]);

  return (
    <>
      {/* Offline Alert Ribbon */}
      {!isOnline && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <WifiOff className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span>
              📴 ऑफलाइन मोड सक्रिय: नोंदी स्थानिकरित्या जतन केल्या जात आहेत. नेटवर्क उपलब्ध झाल्यावर आपोआप सिंक होईल.
            </span>
            {pendingCount > 0 && (
              <span className="bg-amber-800 px-2 py-0.5 rounded-full text-[10px]">
                {pendingCount} नोंदी प्रलंबित
              </span>
            )}
          </div>
        </aside>
      )}

      {/* Syncing Indicator */}
      {isSyncing && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-2 right-4 z-50 bg-[#1F4D3A] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D9A441]" />
          <span>नोंदी सिंक होत आहेत...</span>
        </aside>
      )}

      {/* Sync Success Toast */}
      {syncSuccessToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl animate-in zoom-in-95"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>सर्व ऑफलाइन नोंदी यशस्वीरीत्या सिंक झाल्या!</span>
        </aside>
      )}

      {children}
    </>
  );
}
