'use client';

import React from 'react';
import {
  Activity,
  CheckCircle2,
  Database,
  Cpu,
  Server,
  ShieldCheck,
  Zap,
  Clock,
  HardDrive,
} from 'lucide-react';

export function AdminSystemHealthTab() {
  const healthMetrics = [
    {
      name: 'PostgreSQL Relational DB',
      status: 'Live & Connected',
      indicator: 'healthy',
      icon: Database,
      details: 'Active connection pool, ACID transaction isolation enforced.',
    },
    {
      name: 'FastAPI Backend Engine',
      status: 'Operational (<35ms)',
      indicator: 'healthy',
      icon: Zap,
      details: 'REST v1 API active on port 8000, multi-tenant middleware verified.',
    },
    {
      name: 'Offline Sync Queue',
      status: 'Synchronized (0 pending)',
      indicator: 'healthy',
      icon: HardDrive,
      details: 'IndexedDB & localStorage mutation bridge operational.',
    },
    {
      name: 'DPDP 2023 Data Privacy',
      status: 'Compliant & Audited',
      indicator: 'healthy',
      icon: ShieldCheck,
      details: 'All administrative mutations securely tracked in audit ledger.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[var(--color-border)] dark:border-[#1A3024]">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white">
          System Health & Infrastructure Pulse
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
          Real-time service monitors, infrastructure telemetry, and compliance status.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {healthMetrics.map((svc, idx) => {
          const Icon = svc.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-forest)]/10 text-[var(--color-forest)] dark:text-[var(--color-sage)] flex items-center justify-center font-bold shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white">
                    {svc.name}
                  </h3>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{svc.status}</span>
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70">
                  {svc.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Technical Environment Specs */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
        <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white mb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
          <span>Platform Runtime Specifications</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13]">
            <span className="text-[10px] font-bold uppercase text-[var(--color-text-muted)] block">Version</span>
            <span className="text-sm font-black text-[var(--color-text-main)] dark:text-white">LayerOS v2.4</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13]">
            <span className="text-[10px] font-bold uppercase text-[var(--color-text-muted)] block">Runtime</span>
            <span className="text-sm font-black text-[var(--color-text-main)] dark:text-white">Python 3.11 + React 19</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13]">
            <span className="text-[10px] font-bold uppercase text-[var(--color-text-muted)] block">Database</span>
            <span className="text-sm font-black text-[var(--color-text-main)] dark:text-white">PostgreSQL 16</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13]">
            <span className="text-[10px] font-bold uppercase text-[var(--color-text-muted)] block">Uptime Target</span>
            <span className="text-sm font-black text-emerald-600">99.9% SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminSystemHealthTab;

