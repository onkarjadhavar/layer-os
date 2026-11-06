'use client';

import React from 'react';
import { AdminFarmSummary } from '@/lib/admin/types';
import { FarmStatus } from '@/lib/auth/farm-status';
import {
  X,
  AlertCircle,
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface AdminActionModalProps {
  isOpen: boolean;
  farm: AdminFarmSummary | null;
  targetStatus: FarmStatus | null;
  reason: string;
  onReasonChange: (r: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const ACTION_DESCRIPTIONS: Record<
  FarmStatus,
  { title: string; desc: string; btnColor: string; icon: any }
> = {
  active: {
    title: 'फार्म मंजूर करा (Approve Farm)',
    desc: 'हा फार्म सक्रिय केल्यास शेतकरी दैनिक नोंदी, विक्री व आर्थिक व्यवहार करू शकतील.',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    icon: CheckCircle,
  },
  suspended: {
    title: 'फार्म स्थगित करा (Suspend Farm)',
    desc: 'फार्म स्थगित केल्यास शेतकरी तात्पुरता डॅशबोर्ड वापरू शकणार नाहीत. डेटा सुरक्षित राहील.',
    btnColor: 'bg-rose-600 hover:bg-rose-700 text-white',
    icon: Lock,
  },
  rejected: {
    title: 'फार्म नाकारा (Reject Farm)',
    desc: 'नोंदणी नाकारल्यास संबंधित खात्याला परवानगी दिली जाणार नाही.',
    btnColor: 'bg-rose-700 hover:bg-rose-800 text-white',
    icon: XCircle,
  },
  pending_approval: {
    title: 'फार्म प्रलंबित ठेवा (Set Pending)',
    desc: 'हा फार्म पुन्हा पुनरावलोकनासाठी प्रलंबित स्थितीत ठेवला जाईल.',
    btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
    icon: AlertCircle,
  },
  cancelled: {
    title: 'फार्म रद्द करा (Cancel Farm)',
    desc: 'हा फार्म कायमस्वरूपी रद्द मानला जाईल.',
    btnColor: 'bg-gray-700 hover:bg-gray-800 text-white',
    icon: XCircle,
  },
};

export function AdminActionModal({
  isOpen,
  farm,
  targetStatus,
  reason,
  onReasonChange,
  onClose,
  onSubmit,
  isLoading,
}: AdminActionModalProps) {
  if (!isOpen || !farm || !targetStatus) return null;

  const actionInfo = ACTION_DESCRIPTIONS[targetStatus] || {
    title: 'स्थिती बदला',
    desc: 'फार्मची स्थिती बदलली जाईल.',
    btnColor: 'bg-emerald-600 text-white',
    icon: CheckCircle,
  };

  const Icon = actionInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl bg-[var(--color-surface)] dark:bg-[#132219] p-6 shadow-2xl border border-[var(--color-border)] dark:border-[#1A3024] z-10 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--color-text-main)] dark:text-white">
                {actionInfo.title}
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

        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{actionInfo.desc}</p>

        <div>
          <label className="block text-xs font-bold text-[var(--color-text-main)] dark:text-white mb-1.5">
            बदलाचे कारण (Mandatory Audit Reason) *
          </label>
          <textarea
            required
            rows={3}
            placeholder="उदा. कागदपत्रे तपासली / शेतकरी विनंतीनुसार / देयक थकबाकी..."
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
            रद्द करा (Cancel)
          </button>
          <button
            type="button"
            disabled={!reason.trim() || isLoading}
            onClick={onSubmit}
            className={`px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 ${actionInfo.btnColor}`}
          >
            {isLoading ? 'प्रक्रिया सुरू आहे...' : 'पुष्टी करा (Confirm Action)'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default AdminActionModal;

