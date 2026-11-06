'use client';

import React from 'react';
import { AdminFarmSummary, PlatformAdminUser } from '@/lib/admin/types';
import { useI18n } from '@/lib/i18n/context';
import {
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  Phone,
  User,
  MapPin,
  Bird,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface AdminApprovalsTabProps {
  farms: AdminFarmSummary[];
  currentAdmin: PlatformAdminUser;
  onOpenActionModal: (
    farm: AdminFarmSummary,
    action: 'approve' | 'suspend' | 'reactivate' | 'reject'
  ) => void;
  onSelectFarm: (farm: AdminFarmSummary) => void;
}

export function AdminApprovalsTab({
  farms,
  currentAdmin,
  onOpenActionModal,
  onSelectFarm,
}: AdminApprovalsTabProps) {
  const { t } = useI18n();
  const isSuperAdmin = currentAdmin.role === 'super_admin';

  const pendingFarms = farms.filter((f) => f.status === 'pending_approval');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pb-2 border-b border-[var(--color-border)] dark:border-[#1A3024]">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white">
            Approvals Queue
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 tabular-nums">
            {pendingFarms.length} {pendingFarms.length === 1 ? 'Pending Review' : 'Pending Reviews'}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
          Verify farm identities, capacity validation, and authorize multi-tenant commercial operations.
        </p>
      </div>

      {/* Operator Permission Banner */}
      {!isSuperAdmin && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
          <span>
            <strong>ऑपरेटर सूचना / Notice:</strong> फार्म मंजुरी (Approval) किंवा नाकारणे (Rejection) केवळ <strong>Super Admin</strong> खात्यावरूनच करता येते. ऑपरेटर केवळ तपशील तपासू शकतात.
          </span>
        </div>
      )}

      {/* Queue List */}
      {pendingFarms.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024]">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--color-text-main)] dark:text-white">
            सर्व फार्म मंजूर आहेत (All Farms Approved)
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">
            सध्या मंजुरीच्या प्रतीक्षेत कोणताही नवीन पोल्ट्री फार्म नाही. नवीन नोंदणी होताच ती येथे दिसेल.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingFarms.map((farm) => (
            <div
              key={farm.id}
              className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-amber-500/30 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
                    <h3 className="font-bold text-base text-[var(--color-text-main)] dark:text-white">
                      {farm.name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    प्रलंबित (Pending)
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-semibold text-[var(--color-text-main)] dark:text-white">{farm.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <Phone className="w-3.5 h-3.5 text-[var(--color-amber)]" />
                    <span>{farm.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{farm.district}, {farm.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bird className="w-3.5 h-3.5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
                    <span>कमाल क्षमता: <strong className="text-[var(--color-text-main)] dark:text-white">{farm.totalCapacity.toLocaleString('en-IN')}</strong> पक्षी</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[var(--color-border)] dark:border-[#1A3024] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectFarm(farm)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-main)] dark:text-white hover:bg-[var(--color-surface-subtle)] cursor-pointer"
                >
                  तपशील पहा (Inspect)
                </button>

                {isSuperAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenActionModal(farm, 'reject')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-300 dark:border-rose-800 transition-colors cursor-pointer"
                    >
                      नाकारा (Reject)
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenActionModal(farm, 'approve')}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>मंजूर करा (Approve)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default AdminApprovalsTab;

