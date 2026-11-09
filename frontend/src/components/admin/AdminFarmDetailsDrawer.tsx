'use client';

import React from 'react';
import { AdminFarmSummary, PlatformAdminUser } from '@/lib/admin/types';
import { FARM_STATUS_CONFIGS } from '@/lib/auth/farm-status';
import {
  X,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Bird,
  Calendar,
  CreditCard,
  ShieldAlert,
  ArrowUpRight,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface AdminFarmDetailsDrawerProps {
  farm: AdminFarmSummary | null;
  onClose: () => void;
  currentAdmin: PlatformAdminUser;
  onOpenActionModal: (
    farm: AdminFarmSummary,
    action: 'approve' | 'suspend' | 'reactivate' | 'reject'
  ) => void;
  onOpenExtendModal: (farm: AdminFarmSummary) => void;
  onOpenSupportView: (farm: AdminFarmSummary) => void;
}

export function AdminFarmDetailsDrawer({
  farm,
  onClose,
  currentAdmin,
  onOpenActionModal,
  onOpenExtendModal,
  onOpenSupportView,
}: AdminFarmDetailsDrawerProps) {
  if (!farm) return null;

  const isSuperAdmin = currentAdmin.role === 'super_admin';
  const cfg = FARM_STATUS_CONFIGS[farm.status] || FARM_STATUS_CONFIGS.active;
  const statusLabels: Record<string, string> = {
    active: 'सक्रिय (Active)',
    pending_approval: 'प्रलंबित (Pending)',
    suspended: 'स्थगित (Suspended)',
    rejected: 'नाकारलेले (Rejected)',
    cancelled: 'रद्द (Cancelled)',
  };

  const endsDate = new Date(farm.planEndsAt);
  const daysRemaining = Math.ceil((endsDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-lg bg-[var(--color-surface)] dark:bg-[#132219] h-full shadow-2xl flex flex-col z-10 border-l border-[var(--color-border)] dark:border-[#1A3024] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="h-16 px-5 border-b border-[var(--color-border)] dark:border-[#1A3024] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-forest)]/10 text-[var(--color-forest)] dark:text-[var(--color-sage)] flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-black text-[var(--color-text-main)] dark:text-white truncate">
                {farm.name}
              </h2>
              <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                ID: {farm.id}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)] cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status & Quick Action Ribbon */}
          <div className="p-3.5 rounded-2xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] border border-[var(--color-border)] dark:border-[#1A3024] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">
                वर्तमान स्थिती / Status
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}>
                {statusLabels[farm.status] || farm.status}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {farm.status === 'pending_approval' && isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => onOpenActionModal(farm, 'approve')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  मंजूर करा
                </button>
              )}
              {farm.status === 'active' && (
                <button
                  type="button"
                  onClick={() => onOpenActionModal(farm, 'suspend')}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 cursor-pointer flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>स्थगित करा</span>
                </button>
              )}
              {farm.status === 'suspended' && (
                <button
                  type="button"
                  onClick={() => onOpenActionModal(farm, 'reactivate')}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 cursor-pointer flex items-center gap-1"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>पुन्हा सुरू करा</span>
                </button>
              )}
            </div>
          </div>

          {/* Operational Metrics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2.5">
              Operational Scale
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] border border-[var(--color-border)] dark:border-[#1A3024]">
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] block">Live Birds</span>
                <span className="text-lg font-black text-[var(--color-text-main)] dark:text-white tabular-nums">
                  {(farm.currentBirdCount ?? farm.totalCapacity).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] border border-[var(--color-border)] dark:border-[#1A3024]">
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] block">Total Capacity</span>
                <span className="text-lg font-black text-[var(--color-forest)] dark:text-[var(--color-sage)] tabular-nums">
                  {farm.totalCapacity.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Owner & Contact Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2.5">
              Owner & Contact
            </h3>
            <div className="p-3.5 rounded-2xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] border border-[var(--color-border)] dark:border-[#1A3024] space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
                <span className="font-bold text-[var(--color-text-main)] dark:text-white">{farm.ownerName}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[var(--color-text-muted)]">
                <Phone className="w-3.5 h-3.5 text-[var(--color-amber)]" />
                <span>{farm.phone}</span>
              </div>
              {farm.email && (
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <Mail className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span>{farm.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <span>{farm.district}, {farm.state}</span>
              </div>
            </div>
          </div>

          {/* Subscription Tier & Expiration */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Subscription Plan
              </h3>
              <button
                type="button"
                onClick={() => onOpenExtendModal(farm)}
                className="text-xs font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3 h-3" />
                <span>मुदत वाढवा (Extend)</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] border border-[var(--color-border)] dark:border-[#1A3024] space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-muted)]">Plan Tier:</span>
                <span className="px-2 py-0.5 rounded font-bold text-xs uppercase bg-[var(--color-forest)]/10 text-[var(--color-forest)] dark:text-[var(--color-sage)] border border-[var(--color-forest)]/20">
                  {farm.planId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-muted)]">Valid Until:</span>
                <span className="font-bold tabular-nums text-[var(--color-text-main)] dark:text-white">
                  {endsDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-muted)]">Days Remaining:</span>
                <span className={`font-black tabular-nums ${daysRemaining <= 7 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {daysRemaining > 0 ? `${daysRemaining} दिवस` : 'कालबाह्य (Expired)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--color-border)] dark:border-[#1A3024] bg-[var(--color-surface-subtle)]/50 dark:bg-[#0E1A13]/50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenSupportView(farm)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[var(--color-forest)] hover:bg-[#143F2F] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-amber)]" />
            <span>सपोर्ट व्ह्यू उघडा (Support View)</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-main)] dark:text-white hover:bg-[var(--color-surface)] cursor-pointer"
          >
            बंद करा
          </button>
        </div>
      </div>
    </div>
  );
}
export default AdminFarmDetailsDrawer;
