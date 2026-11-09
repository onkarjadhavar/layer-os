'use client';

import React from 'react';
import {
  AdminAuditEntry,
  AdminFarmSummary,
  PlatformAdminUser,
  PlatformKPIs,
} from '@/lib/admin/types';
import { FarmStatus, FARM_STATUS_CONFIGS } from '@/lib/auth/farm-status';
import { useI18n } from '@/lib/i18n/context';
import {
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  Bird,
  IndianRupee,
  Calendar,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Download,
  Eye,
  Lock,
  Unlock,
  AlertCircle,
} from 'lucide-react';

interface AdminOverviewTabProps {
  kpis: PlatformKPIs | null;
  farms: AdminFarmSummary[];
  auditLogs: AdminAuditEntry[];
  currentAdmin: PlatformAdminUser;
  onRefresh: () => void;
  isLoading: boolean;
  onSelectFarm: (farm: AdminFarmSummary) => void;
  onOpenActionModal: (
    farm: AdminFarmSummary,
    action: 'approve' | 'suspend' | 'reactivate' | 'reject'
  ) => void;
  onOpenExtendModal: (farm: AdminFarmSummary) => void;
  onOpenSupportView: (farm: AdminFarmSummary) => void;
  onNavigateTab: (tab: any) => void;
  onExportCsv: () => void;
}

export function AdminOverviewTab({
  kpis,
  farms,
  auditLogs,
  currentAdmin,
  onRefresh,
  isLoading,
  onSelectFarm,
  onOpenActionModal,
  onOpenExtendModal,
  onOpenSupportView,
  onNavigateTab,
  onExportCsv,
}: AdminOverviewTabProps) {
  const { t } = useI18n();

  const isSuperAdmin = currentAdmin.role === 'super_admin';

  // Compute tier breakdowns
  const starterCount = farms.filter((f) => f.planId === 'starter').length;
  const growerCount = farms.filter((f) => f.planId === 'grower' || f.planId === 'grower_pro').length;
  const enterpriseCount = farms.filter((f) => f.planId === 'enterprise').length;

  const totalCapacity = farms.reduce((sum, f) => sum + (f.totalCapacity || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Page Heading with Enterprise Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--color-border)] dark:border-[#1A3024]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white">
            Platform Overview
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/80 mt-0.5">
            Monitor and manage your LayerOS platform operations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            id="admin-overview-refresh-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--color-text-main)] dark:text-white bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] border border-[var(--color-border)] dark:border-[#1A3024] hover:bg-[var(--color-surface)] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--color-forest)] dark:text-[var(--color-sage)] ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t.refresh || 'Refresh'}</span>
          </button>

          <button
            type="button"
            id="admin-overview-export-btn"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--color-text-main)] dark:text-white bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] border border-[var(--color-border)] dark:border-[#1A3024] hover:bg-[var(--color-surface)] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[var(--color-amber)]" />
            <span>CSV Export</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('farms')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-forest)] hover:bg-[#143F2F] shadow-xs transition-all cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Manage Farms</span>
          </button>
        </div>
      </div>

      {/* 2. Compact, Balanced 7-Metric KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* KPI 1: Total Farms */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 uppercase tracking-wider">
            <span>Total Farms</span>
            <Building2 className="w-3.5 h-3.5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
          </div>
          <div className="text-2xl font-black text-[var(--color-text-main)] dark:text-white tabular-nums mt-1">
            {kpis ? kpis.totalFarms : '—'}
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)] font-medium">नोंदणीकृत पोल्ट्री फार्म्स</div>
        </div>

        {/* KPI 2: Active Farms */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <span>Active Farms</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums mt-1">
            {kpis ? kpis.activeFarms : '—'}
          </div>
          <div className="text-[10px] text-emerald-600/80 font-medium">सक्रिय व्यावसायिक कारभार</div>
        </div>

        {/* KPI 3: Pending Approvals */}
        <div className={`p-3.5 rounded-2xl border shadow-xs flex flex-col justify-between min-h-[96px] ${
          (kpis?.pendingFarms || 0) > 0
            ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30 text-amber-800 dark:text-amber-200'
            : 'bg-[var(--color-surface)] dark:bg-[#132219] border-[var(--color-border)] dark:border-[#1A3024]'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <span className={kpis?.pendingFarms ? 'text-amber-700 dark:text-amber-400' : 'text-[var(--color-text-muted)]'}>Pending</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-black tabular-nums mt-1">
            {kpis ? kpis.pendingFarms : '—'}
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)] font-medium">मंजुरीची प्रतीक्षा</div>
        </div>

        {/* KPI 4: Suspended Farms */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
            <span>Suspended</span>
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-400 tabular-nums mt-1">
            {kpis ? kpis.suspendedFarms : '—'}
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)] font-medium">स्थगित खाती</div>
        </div>

        {/* KPI 5: Total Birds */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 uppercase tracking-wider">
            <span>Birds Managed</span>
            <Bird className="w-3.5 h-3.5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
          </div>
          <div className="text-2xl font-black text-[var(--color-text-main)] dark:text-white tabular-nums mt-1">
            {kpis ? (kpis.totalBirds || 0).toLocaleString('en-IN') : '—'}
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)] font-medium">एकूण जिवंत पक्षी</div>
        </div>

        {/* KPI 6: Monthly Recurring Revenue */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--color-amber)] uppercase tracking-wider">
            <span>Monthly MRR</span>
            <IndianRupee className="w-3.5 h-3.5 text-[var(--color-amber)]" />
          </div>
          <div className="text-2xl font-black text-[var(--color-text-main)] dark:text-white tabular-nums mt-1">
            ₹{kpis ? (kpis.estimatedMRR || 0).toLocaleString('en-IN') : '0'}
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)] font-medium">अपेक्षित मासिक महसूल</div>
        </div>

        {/* KPI 7: Expiring Subscriptions */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 uppercase tracking-wider">
            <span>Expiring (7D)</span>
            <Calendar className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          </div>
          <div className="text-2xl font-black text-[var(--color-text-main)] dark:text-white tabular-nums mt-1">
            {kpis ? kpis.expiringIn7Days : '0'}
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)] font-medium">नूतनीकरणाची गरज</div>
        </div>
      </div>

      {/* 3. Analytics Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Farm Lifecycle Status Breakdown */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-main)] dark:text-white">
              Farm Status Breakdown
            </h3>
            <span className="text-xs font-bold text-[var(--color-text-muted)] tabular-nums">
              {farms.length} Total
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Active / मंजूर फार्म्स
                </span>
                <span className="tabular-nums font-bold text-[var(--color-text-main)] dark:text-white">
                  {kpis?.activeFarms || 0}
                </span>
              </div>
              <div className="w-full bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${farms.length ? ((kpis?.activeFarms || 0) / farms.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Pending Review / प्रलंबित
                </span>
                <span className="tabular-nums font-bold text-[var(--color-text-main)] dark:text-white">
                  {kpis?.pendingFarms || 0}
                </span>
              </div>
              <div className="w-full bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${farms.length ? ((kpis?.pendingFarms || 0) / farms.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Suspended / स्थगित
                </span>
                <span className="tabular-nums font-bold text-[var(--color-text-main)] dark:text-white">
                  {kpis?.suspendedFarms || 0}
                </span>
              </div>
              <div className="w-full bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${farms.length ? ((kpis?.suspendedFarms || 0) / farms.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Tier Distribution */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-main)] dark:text-white">
              Subscription Distribution
            </h3>
            <span className="text-xs font-bold text-[var(--color-amber)]">₹{kpis?.estimatedMRR || 0}/mo</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-sage)]" />
                <span className="text-xs font-semibold text-[var(--color-text-main)] dark:text-white">Starter (₹0)</span>
              </div>
              <span className="text-xs font-bold tabular-nums text-[var(--color-text-muted)]">{starterCount} farms</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-forest)]" />
                <span className="text-xs font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)]">Grower Pro (₹999)</span>
              </div>
              <span className="text-xs font-bold tabular-nums text-[var(--color-forest)] dark:text-[var(--color-sage)]">{growerCount} farms</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-amber)]" />
                <span className="text-xs font-semibold text-[var(--color-text-main)] dark:text-white">Enterprise (₹2,499)</span>
              </div>
              <span className="text-xs font-bold tabular-nums text-[var(--color-text-muted)]">{enterpriseCount} farms</span>
            </div>
          </div>
        </div>

        {/* Platform Operational Pulse */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-main)] dark:text-white">
                Platform Operational Pulse
              </h3>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Engine
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70">
              Commercial layer bird infrastructure capacity across Maharashtra regions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[var(--color-border)] dark:border-[#1A3024]">
            <div className="p-2.5 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13]">
              <span className="text-[10px] font-bold uppercase text-[var(--color-text-muted)] block">Total Capacity</span>
              <span className="text-base font-black text-[var(--color-text-main)] dark:text-white tabular-nums">
                {totalCapacity.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13]">
              <span className="text-[10px] font-bold uppercase text-[var(--color-text-muted)] block">Capacity Usage</span>
              <span className="text-base font-black text-[var(--color-forest)] dark:text-[var(--color-sage)] tabular-nums">
                {totalCapacity ? Math.round(((kpis?.totalBirds || 0) / totalCapacity) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Enrolled Farms Data Table */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-main)] dark:text-white">
              Recently Enrolled Farms
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
              Live multi-tenant commercial poultry farm instances on PostgreSQL.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('farms')}
            className="text-xs font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({farms.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {farms.length === 0 ? (
          <div className="py-12 text-center text-[var(--color-text-muted)]">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">कोणताही फार्म नोंदणीकृत नाही (No farms enrolled yet)</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] dark:border-[#1A3024] text-[10px] uppercase font-bold text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 tracking-wider">
                  <th className="py-2.5 px-3">Farm Name / नाव</th>
                  <th className="py-2.5 px-3">Owner / मालक</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Birds / पक्षी</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/60 dark:divide-[#1A3024]/60 font-medium">
                {farms.slice(0, 5).map((farm) => {
                  const cfg = FARM_STATUS_CONFIGS[farm.status] || FARM_STATUS_CONFIGS.active;
                  const statusLabels: Record<string, string> = {
                    active: 'सक्रिय (Active)',
                    pending_approval: 'प्रलंबित (Pending)',
                    suspended: 'स्थगित (Suspended)',
                    rejected: 'नाकारलेले (Rejected)',
                    cancelled: 'रद्द (Cancelled)',
                  };
                  return (
                    <tr
                      key={farm.id}
                      className="hover:bg-[var(--color-surface-subtle)] dark:hover:bg-[#0E1A13] transition-colors"
                    >
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => onSelectFarm(farm)}
                          className="font-bold text-[var(--color-text-main)] dark:text-white hover:text-[var(--color-forest)] dark:hover:text-[var(--color-sage)] cursor-pointer text-left"
                        >
                          {farm.name}
                        </button>
                        <span className="block text-[10px] text-[var(--color-text-muted)] font-mono">
                          ID: {farm.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[var(--color-text-main)] dark:text-white">
                        {farm.ownerName}
                      </td>
                      <td className="py-3 px-3 text-[var(--color-text-muted)] font-mono">
                        {farm.phone}
                      </td>
                      <td className="py-3 px-3 text-[var(--color-text-muted)]">
                        {farm.district}, {farm.state}
                      </td>
                      <td className="py-3 px-3 font-bold tabular-nums text-[var(--color-text-main)] dark:text-white">
                        {(farm.currentBirdCount ?? farm.totalCapacity).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-[var(--color-surface-subtle)] dark:bg-[#1A3024] text-[var(--color-text-main)] dark:text-white border border-[var(--color-border)]">
                          {farm.planId}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}
                        >
                          {statusLabels[farm.status] || farm.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectFarm(farm)}
                            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-forest)] hover:bg-[var(--color-surface-subtle)] cursor-pointer"
                            title="Inspect Farm Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {farm.status === 'pending_approval' && isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => onOpenActionModal(farm, 'approve')}
                              className="px-2 py-1 rounded text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                            >
                              मंजूर करा
                            </button>
                          )}

                          {farm.status === 'active' && (
                            <button
                              type="button"
                              onClick={() => onOpenActionModal(farm, 'suspend')}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                              title="Suspend Farm"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {farm.status === 'suspended' && (
                            <button
                              type="button"
                              onClick={() => onOpenActionModal(farm, 'reactivate')}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                              title="Reactivate Farm"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenSupportView(farm)}
                            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-amber)] hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                            title="Open Read-only Support View"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Live Recent Activity Feed */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-main)] dark:text-white">
              Recent Administrative Activity
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
              Immutable DPDP 2023 compliance audit trail.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('audit')}
            className="text-xs font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Logs ({auditLogs.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {auditLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--color-text-muted)]">
            कोणतीही कृती नोंदवलेली नाही (No audit entries recorded yet)
          </div>
        ) : (
          <div className="space-y-2">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[var(--color-forest)]/10 text-[var(--color-forest)] dark:text-[var(--color-sage)] flex items-center justify-center shrink-0 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[var(--color-text-main)] dark:text-white truncate">
                      {log.action} — <span className="text-[var(--color-forest)] dark:text-[var(--color-sage)]">{log.farmName || 'Platform'}</span>
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] truncate">
                      बाय / By: {log.adminEmail} • कारण: {log.reason}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)] font-mono shrink-0 tabular-nums">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminOverviewTab;
