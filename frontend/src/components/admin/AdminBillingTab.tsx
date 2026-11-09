'use client';

import React from 'react';
import { AdminFarmSummary, PlatformKPIs } from '@/lib/admin/types';
import {
  IndianRupee,
  Receipt,
  TrendingUp,
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface AdminBillingTabProps {
  kpis: PlatformKPIs | null;
  farms: AdminFarmSummary[];
}

export function AdminBillingTab({ kpis, farms }: AdminBillingTabProps) {
  const mrr = kpis?.estimatedMRR || 0;
  const arr = mrr * 12;
  const payingFarms = farms.filter((f) => f.planId !== 'starter').length;

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[var(--color-border)] dark:border-[#1A3024]">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white">
          Billing & Payments
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
          Enterprise revenue overview, payment gateway status, and billing lifecycle.
        </p>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            <span>Estimated MRR</span>
            <IndianRupee className="w-4 h-4 text-[var(--color-amber)]" />
          </div>
          <div className="text-3xl font-black text-[var(--color-text-main)] dark:text-white tabular-nums">
            ₹{mrr.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] mt-1">
            मासिक अपेक्षित महसूल (Monthly recurring revenue)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            <span>Annual Run Rate (ARR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            ₹{arr.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] mt-1">
            वार्षिक महसूल अंदाज (Annualized projected run rate)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            <span>Paying Enterprises</span>
            <Building2 className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
          </div>
          <div className="text-3xl font-black text-[var(--color-text-main)] dark:text-white tabular-nums">
            {payingFarms} <span className="text-sm font-semibold text-[var(--color-text-muted)]">/ {farms.length}</span>
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] mt-1">
            सशुल्क व्यावसायिक फार्म्स (Commercial tiers)
          </div>
        </div>
      </div>

      {/* Gateway & Settlement Health */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
            <span>Payment Gateway & Invoicing Engine</span>
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active UPI / NetBanking</span>
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70">
          LayerOS uses Razorpay and direct UPI merchant settlements with instant subscription token renewal and GST invoice PDF generation.
        </p>
      </div>
    </div>
  );
}
export default AdminBillingTab;

