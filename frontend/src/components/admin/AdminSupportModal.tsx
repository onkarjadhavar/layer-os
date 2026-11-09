'use client';

import React from 'react';
import { AdminFarmSummary } from '@/lib/admin/types';
import { X, ArrowUpRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminSupportModalProps {
  isOpen: boolean;
  farm: AdminFarmSummary | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function AdminSupportModal({
  isOpen,
  farm,
  onClose,
  onConfirm,
}: AdminSupportModalProps) {
  if (!isOpen || !farm) return null;

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
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--color-text-main)] dark:text-white">
                सपोर्ट सत्र उघडा (Support View)
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

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>DPDP 2023 ऑडिट नोंद (Audit Compliance):</span>
          </p>
          <p>
            या फार्मचे कामकाज तपासण्यासाठी ॲडमिन सपोर्ट सत्र सुरू केले जाईल. हे सत्र केवळ तांत्रिक साहाय्यासाठी व निरीक्षण स्वरूपात वापरले जाईल.
          </p>
        </div>

        <div className="text-xs text-[var(--color-text-muted)] space-y-1 bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] p-3 rounded-xl border border-[var(--color-border)]">
          <p><strong>फार्म मालक:</strong> {farm.ownerName} ({farm.phone})</p>
          <p><strong>जिल्हा:</strong> {farm.district}, {farm.state}</p>
          <p><strong>पक्षी क्षमता:</strong> {farm.totalCapacity.toLocaleString('en-IN')}</p>
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
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[var(--color-forest)] hover:bg-[#143F2F] text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-amber)]" />
            <span>सपोर्ट डॅशबोर्ड उघडा</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default AdminSupportModal;

