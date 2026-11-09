'use client';

import React, { useState, useMemo } from 'react';
import { AdminFarmSummary, PlatformAdminUser } from '@/lib/admin/types';
import { FarmStatus, FARM_STATUS_CONFIGS } from '@/lib/auth/farm-status';
import { useI18n } from '@/lib/i18n/context';
import {
  Search,
  Filter,
  Download,
  Building2,
  Eye,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface AdminFarmsTabProps {
  farms: AdminFarmSummary[];
  currentAdmin: PlatformAdminUser;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectFarm: (farm: AdminFarmSummary) => void;
  onOpenActionModal: (
    farm: AdminFarmSummary,
    action: 'approve' | 'suspend' | 'reactivate' | 'reject'
  ) => void;
  onOpenExtendModal: (farm: AdminFarmSummary) => void;
  onOpenSupportView: (farm: AdminFarmSummary) => void;
  onExportCsv: () => void;
}

export function AdminFarmsTab({
  farms,
  currentAdmin,
  searchQuery,
  onSearchChange,
  onSelectFarm,
  onOpenActionModal,
  onOpenExtendModal,
  onOpenSupportView,
  onExportCsv,
}: AdminFarmsTabProps) {
  const { t } = useI18n();
  const isSuperAdmin = currentAdmin.role === 'super_admin';

  const [statusFilter, setStatusFilter] = useState<FarmStatus | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Extract unique districts
  const districts = useMemo(() => {
    const list = Array.from(new Set(farms.map((f) => f.district).filter(Boolean)));
    list.sort();
    return list;
  }, [farms]);

  // Filtered farms
  const filteredFarms = useMemo(() => {
    return farms.filter((f) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.ownerName.toLowerCase().includes(q) ||
        f.phone.includes(q) ||
        f.id.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchPlan =
        planFilter === 'all' ||
        f.planId === planFilter ||
        (planFilter === 'grower' && f.planId === 'grower_pro');
      const matchDistrict = districtFilter === 'all' || f.district === districtFilter;

      return matchSearch && matchStatus && matchPlan && matchDistrict;
    });
  }, [farms, searchQuery, statusFilter, planFilter, districtFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredFarms.length / pageSize));
  const paginatedFarms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFarms.slice(start, start + pageSize);
  }, [filteredFarms, currentPage, pageSize]);

  return (
    <div className="space-y-5">
      {/* 1. Header with Farm Count & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--color-border)] dark:border-[#1A3024]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white">
              Farms Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--color-forest)]/10 text-[var(--color-forest)] dark:text-[var(--color-sage)] tabular-nums">
              {filteredFarms.length} {filteredFarms.length === 1 ? 'Farm' : 'Farms'}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
            Supervise multi-tenant layer poultry enterprises, manage status lifecycle, and view analytics.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--color-text-main)] dark:text-white bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] hover:bg-[var(--color-surface-subtle)] transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[var(--color-amber)]" />
          <span>Export Directory (CSV)</span>
        </button>
      </div>

      {/* 2. Enterprise Filter & Search Ribbon */}
      <div className="p-3 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search farm name, owner, contact number or UUID..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-[var(--color-border)] dark:border-[#1A3024] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-medium text-[var(--color-text-main)] dark:text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-forest)]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 rounded-xl border border-[var(--color-border)] dark:border-[#1A3024] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-semibold text-[var(--color-text-main)] dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="all">सर्व स्थिती (All Status)</option>
            <option value="active">Active (सक्रिय)</option>
            <option value="pending_approval">Pending (प्रलंबित)</option>
            <option value="suspended">Suspended (स्थगित)</option>
            <option value="rejected">Rejected (नाकारलेले)</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 rounded-xl border border-[var(--color-border)] dark:border-[#1A3024] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-semibold text-[var(--color-text-main)] dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="all">सर्व प्लॅन्स (All Plans)</option>
            <option value="starter">Starter (₹0)</option>
            <option value="grower">Grower Pro (₹999)</option>
            <option value="enterprise">Enterprise (₹2,499)</option>
          </select>

          {/* District Filter */}
          {districts.length > 0 && (
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-2 rounded-xl border border-[var(--color-border)] dark:border-[#1A3024] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-semibold text-[var(--color-text-main)] dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="all">सर्व जिल्हे (All Districts)</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* 3. Farm Directory Data Table */}
      <div className="rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs overflow-hidden">
        {filteredFarms.length === 0 ? (
          <div className="py-16 text-center text-[var(--color-text-muted)]">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30 text-[var(--color-forest)]" />
            <p className="text-sm font-bold text-[var(--color-text-main)] dark:text-white">
              कोणताही फार्म सापडला नाही (No matching farms found)
            </p>
            <p className="text-xs mt-1">तपासा किंवा फिल्टर्स रीसेट करा.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-subtle)]/70 dark:bg-[#0E1A13]/70 border-b border-[var(--color-border)] dark:border-[#1A3024] text-[10px] uppercase font-bold text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 tracking-wider">
                  <th className="py-3 px-4">Farm Details / नाव</th>
                  <th className="py-3 px-3">Owner / मालक</th>
                  <th className="py-3 px-3">District / जिल्हा</th>
                  <th className="py-3 px-3">Birds / पक्षी</th>
                  <th className="py-3 px-3">Plan / वैधता</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/50 dark:divide-[#1A3024]/50 font-medium">
                {paginatedFarms.map((farm) => {
                  const cfg = FARM_STATUS_CONFIGS[farm.status] || FARM_STATUS_CONFIGS.active;
                  const statusLabels: Record<string, string> = {
                    active: 'सक्रिय (Active)',
                    pending_approval: 'प्रलंबित (Pending)',
                    suspended: 'स्थगित (Suspended)',
                    rejected: 'नाकारलेले (Rejected)',
                    cancelled: 'रद्द (Cancelled)',
                  };
                  const birdCount = farm.currentBirdCount ?? farm.totalCapacity;
                  const endsDate = new Date(farm.planEndsAt);
                  const isExpiringSoon = endsDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

                  return (
                    <tr
                      key={farm.id}
                      className="hover:bg-[var(--color-surface-subtle)] dark:hover:bg-[#0E1A13] transition-colors"
                    >
                      {/* Farm Name & ID */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => onSelectFarm(farm)}
                          className="font-bold text-[var(--color-text-main)] dark:text-white hover:text-[var(--color-forest)] dark:hover:text-[var(--color-sage)] text-left cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{farm.name}</span>
                        </button>
                        <span className="block text-[10px] text-[var(--color-text-muted)] font-mono">
                          UUID: {farm.id}
                        </span>
                      </td>

                      {/* Owner & Phone */}
                      <td className="py-3 px-3">
                        <p className="font-bold text-[var(--color-text-main)] dark:text-white">
                          {farm.ownerName}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
                          {farm.phone}
                        </p>
                      </td>

                      {/* District & State */}
                      <td className="py-3 px-3 text-[var(--color-text-muted)]">
                        <span className="font-semibold text-[var(--color-text-main)] dark:text-white block">
                          {farm.district}
                        </span>
                        <span className="text-[10px]">{farm.state}</span>
                      </td>

                      {/* Birds & Capacity */}
                      <td className="py-3 px-3">
                        <span className="font-black tabular-nums text-[var(--color-text-main)] dark:text-white block">
                          {birdCount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          कमाल {farm.totalCapacity.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Plan & Validity */}
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-[var(--color-surface-subtle)] dark:bg-[#1A3024] text-[var(--color-text-main)] dark:text-white border border-[var(--color-border)]">
                          {farm.planId}
                        </span>
                        <span
                          className={`block text-[10px] tabular-nums mt-0.5 ${
                            isExpiringSoon ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-[var(--color-text-muted)]'
                          }`}
                        >
                          वैध: {endsDate.toLocaleDateString('en-IN')}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}
                        >
                          {statusLabels[farm.status] || farm.status}
                        </span>
                      </td>

                      {/* Operational Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* 360 View */}
                          <button
                            type="button"
                            onClick={() => onSelectFarm(farm)}
                            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-forest)] hover:bg-[var(--color-surface-subtle)] cursor-pointer"
                            title="Inspect 360° Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Approve for pending */}
                          {farm.status === 'pending_approval' && isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => onOpenActionModal(farm, 'approve')}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                            >
                              मंजूर
                            </button>
                          )}

                          {/* Quick Reject for pending */}
                          {farm.status === 'pending_approval' && isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => onOpenActionModal(farm, 'reject')}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                            >
                              नाकारा
                            </button>
                          )}

                          {/* Suspend for active */}
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

                          {/* Reactivate for suspended */}
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

                          {/* Extend Plan */}
                          <button
                            type="button"
                            onClick={() => onOpenExtendModal(farm)}
                            className="p-1.5 rounded-lg text-[var(--color-forest)] dark:text-[var(--color-sage)] hover:bg-[var(--color-forest)]/10 cursor-pointer"
                            title="Extend Plan Duration"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>

                          {/* Support Impersonation View */}
                          <button
                            type="button"
                            onClick={() => onOpenSupportView(farm)}
                            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-amber)] hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                            title="Open Support View"
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

        {/* 4. Table Pagination Footer */}
        {filteredFarms.length > pageSize && (
          <div className="p-3 border-t border-[var(--color-border)] dark:border-[#1A3024] flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)]">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredFarms.length)} of {filteredFarms.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 py-1 font-bold text-[var(--color-text-main)] dark:text-white tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminFarmsTab;
