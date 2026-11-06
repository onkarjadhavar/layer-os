'use client';

import React, { useState } from 'react';
import { AdminFarmSummary } from '@/lib/admin/types';
import {
  Headphones,
  ShieldCheck,
  ArrowUpRight,
  Phone,
  Mail,
  MessageSquare,
  Building2,
  Lock,
} from 'lucide-react';

interface AdminSupportTabProps {
  farms: AdminFarmSummary[];
  onOpenSupportView: (farm: AdminFarmSummary) => void;
}

export function AdminSupportTab({ farms, onOpenSupportView }: AdminSupportTabProps) {
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || '');

  const selectedFarm = farms.find((f) => f.id === selectedFarmId);

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[var(--color-border)] dark:border-[#1A3024]">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white">
          Support Center & Diagnostics
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
          Audited customer diagnostics, farm technical assistance, and read-only support session launcher.
        </p>
      </div>

      {/* DPDP 2023 Audit Warning */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>भारतीय डेटा संरक्षण कायदा (DPDP 2023) पालन:</strong> कोणत्याही पोल्ट्री फार्मचा सपोर्ट व्ह्यू उघडण्यापूर्वी प्लॅटफॉर्म ऑडिट लॉगमध्ये नोंद केली जाते. सपोर्ट सत्र केवळ तांत्रिक अडचणी निवारणासाठी व वाचन-स्वरूपात (Read-only) वापरले पाहिजे.
        </div>
      </div>

      {/* Support Impersonation Launcher */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
        <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white mb-1">
          Launch Farm Support Inspection Session
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          Select any registered farm to launch their live dashboard view with administrative support credentials.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[#1A3024] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-semibold text-[var(--color-text-main)] dark:text-white focus:outline-none"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.ownerName} • {f.district})
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!selectedFarm}
            onClick={() => selectedFarm && onOpenSupportView(selectedFarm)}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-forest)] hover:bg-[#143F2F] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <ArrowUpRight className="w-4 h-4 text-[var(--color-amber)]" />
            <span>सपोर्ट व्ह्यू उघडा (Open View)</span>
          </button>
        </div>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] text-xs">
          <div className="flex items-center gap-2 text-[var(--color-forest)] dark:text-[var(--color-sage)] font-bold mb-1">
            <Phone className="w-4 h-4" />
            <span>Direct Helpline</span>
          </div>
          <span className="font-mono text-sm font-bold text-[var(--color-text-main)] dark:text-white">+91 76660 40924</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] text-xs">
          <div className="flex items-center gap-2 text-[var(--color-forest)] dark:text-[var(--color-sage)] font-bold mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Business</span>
          </div>
          <span className="font-mono text-sm font-bold text-[var(--color-text-main)] dark:text-white">+91 76660 40924</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] text-xs">
          <div className="flex items-center gap-2 text-[var(--color-forest)] dark:text-[var(--color-sage)] font-bold mb-1">
            <Mail className="w-4 h-4" />
            <span>Platform Support Email</span>
          </div>
          <span className="font-mono text-xs font-bold text-[var(--color-text-main)] dark:text-white">support@layeros.in</span>
        </div>
      </div>
    </div>
  );
}
export default AdminSupportTab;

