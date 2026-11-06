'use client';

import React from 'react';
import { AdminFarmSummary } from '@/lib/admin/types';
import { X, Calendar, Plus, ShieldCheck } from 'lucide-react';

interface AdminExtendModalProps {
  isOpen: boolean;
  farm: AdminFarmSummary | null;
  days: number;
  onDaysChange: (d: number) => void;
  reason: string;
  onReasonChange: (r: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function AdminExtendModal({
  isOpen,
  farm,
  days,
  onDaysChange,
  reason,
  onReasonChange,
  onClose,
  onSubmit,
  isLoading,
}: AdminExtendModalProps) {
  if (!isOpen || !farm) return null;

  const quickDays = [7, 15, 30, 60, 90];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md rounded-3xl bg-[var(--color-surface)] dark:bg-[#132219] p-6 shadow-2xl border border-[var(--color-border)] dark:border-[#1A3024] z-10 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-forest)]/10 text-[var(--color-forest)] dark:text-[var(--color-sage)] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--color-text-main)] dark:text-white">
                प्लॅन मुदत वाढवा (Extend Plan)
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">{farm.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--color-text-main)] dark:text-white mb-2">
            दिवस निवडा (Select Days to Add)
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {quickDays.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onDaysChange(d)}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  days === d
                    ? 'bg-[var(--color-forest)] text-white shadow-xs'
                    : 'bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-[var(--color-text-main)] dark:text-white border border-[var(--color-border)]'
                }`}
              >
                +{d} दिवस
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--color-text-main)] dark:text-white mb-1.5">
            मुदतवाढीचे कारण (Reason for Extension) *
          </label>
          <textarea
            required
            rows={2}
            placeholder="उदा. शेतकरी विनंती / पेमेंट प्रक्रिया सुरू / ट्रायल वाढवली..."
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            className="w-full p-3 rounded-xl border border-[var(--color-border)] dark:border-[#1A3024] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-medium text-[var(--color-text-main)] dark:text-white outline-none focus:ring-1 focus:ring-[var(--color-forest)]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-main)] dark:text-white hover:bg-[var(--color-surface-subtle)] cursor-pointer"
          >
            रद्द करा
          </button>
          <button
            type="button"
            disabled={!reason.trim() || isLoading}
            onClick={onSubmit}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[var(--color-forest)] hover:bg-[#143F2F] text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'जतन होत आहे...' : `+${days} दिवस मुदत वाढवा`}
          </button>
        </div>
      </div>
    </div>
  );
}
export default AdminExtendModal;

