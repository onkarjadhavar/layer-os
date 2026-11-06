'use client';

import React, { useMemo } from 'react';
import { AdminFarmSummary, PlatformKPIs } from '@/lib/admin/types';
import {
  TrendingUp,
  MapPin,
  Bird,
  Building2,
  PieChart,
  BarChart2,
} from 'lucide-react';

interface AdminAnalyticsTabProps {
  farms: AdminFarmSummary[];
  kpis: PlatformKPIs | null;
}

export function AdminAnalyticsTab({ farms, kpis }: AdminAnalyticsTabProps) {
  // District breakdown
  const districtDistribution = useMemo(() => {
    const counts: Record<string, { farms: number; birds: number }> = {};
    for (const f of farms) {
      const d = f.district || 'Other';
      if (!counts[d]) counts[d] = { farms: 0, birds: 0 };
      counts[d].farms += 1;
      counts[d].birds += f.currentBirdCount ?? f.totalCapacity ?? 0;
    }
    return Object.entries(counts).sort((a, b) => b[1].birds - a[1].birds);
  }, [farms]);

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[var(--color-border)] dark:border-[#1A3024]">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white">
          Platform Analytics
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
          Macro commercial layer industry trends, bird capacity density, and regional distribution across Maharashtra.
        </p>
      </div>

      {/* Regional Density Table */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
        <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white mb-1 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
          <span>Regional Poultry Production Density (Maharashtra)</span>
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          Commercial bird flock distributions per key poultry hub districts.
        </p>

        {districtDistribution.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--color-text-muted)]">No data recorded</div>
        ) : (
          <div className="space-y-3">
            {districtDistribution.map(([district, data]) => {
              const totalBirds = kpis?.totalBirds || 1;
              const pct = Math.min(100, Math.round((data.birds / totalBirds) * 100));
              return (
                <div key={district} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[var(--color-text-main)] dark:text-white font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-forest)] dark:bg-[var(--color-sage)]" />
                      {district}
                    </span>
                    <span className="tabular-nums text-[var(--color-text-muted)]">
                      {data.farms} {data.farms === 1 ? 'farm' : 'farms'} • <strong className="text-[var(--color-text-main)] dark:text-white">{data.birds.toLocaleString('en-IN')}</strong> birds ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[var(--color-forest)] dark:bg-[var(--color-sage)] h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminAnalyticsTab;

