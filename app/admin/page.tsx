'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  Clock,
  FileText,
  Users,
  Settings,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Eye,
  Calendar,
  Download,
  ArrowUpRight,
  Phone,
  MessageSquare,
  TrendingUp,
  Bird,
  Home,
  RefreshCw,
} from 'lucide-react';
import { Language, translations } from '@/lib/i18n/translations';
import {
  AdminAuditEntry,
  AdminFarmSummary,
  PlatformAdminUser,
  PlatformKPIs,
  PlatformSettings,
} from '@/lib/admin/types';
import {
  getPlatformKPIs,
  listAdminFarms,
  changeFarmStatus,
  extendFarmPlan,
  recordSupportViewAccess,
  listAdminAuditLogs,
  getPlatformSettings,
  updatePlatformSettings,
  exportFarmsToCsv,
  exportAuditLogsToCsv,
} from '@/lib/admin/actions';
import { FarmStatus, FARM_STATUS_CONFIGS } from '@/lib/auth/farm-status';
import { DEMO_ADMINS, parseAdminSessionCookie } from '@/lib/admin/auth';

type AdminTab = 'dashboard' | 'farms' | 'approvals' | 'audit' | 'operators' | 'settings';

export default function PlatformAdminPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('mr');
  const t = translations[lang];

  // Current admin session
  const [currentAdmin] = useState<PlatformAdminUser>(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/layeros_admin_session=([^;]+)/);
      if (match) {
        const session = parseAdminSessionCookie(match[1]);
        if (session) return session.admin;
      }
    }
    return DEMO_ADMINS[0];
  });
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Data states
  const [kpis, setKpis] = useState<PlatformKPIs | null>(null);
  const [farms, setFarms] = useState<AdminFarmSummary[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditEntry[]>([]);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<FarmStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    farm: AdminFarmSummary | null;
    targetStatus: FarmStatus | null;
    actionType: 'approve' | 'suspend' | 'reactivate' | 'reject';
    reason: string;
    error: string;
  }>({
    isOpen: false,
    farm: null,
    targetStatus: null,
    actionType: 'approve',
    reason: '',
    error: '',
  });

  const [extendModal, setExtendModal] = useState<{
    isOpen: boolean;
    farm: AdminFarmSummary | null;
    days: number;
    reason: string;
    error: string;
  }>({
    isOpen: false,
    farm: null,
    days: 30,
    reason: '',
    error: '',
  });

  const [supportModal, setSupportModal] = useState<{
    isOpen: boolean;
    farm: AdminFarmSummary | null;
  }>({
    isOpen: false,
    farm: null,
  });

  // Load initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [kpisRes, farmsRes, auditRes, settingsRes] = await Promise.all([
        getPlatformKPIs(),
        listAdminFarms(),
        listAdminAuditLogs(),
        getPlatformSettings(),
      ]);
      setKpis(kpisRes);
      setFarms(farmsRes);
      setAuditLogs(auditRes);
      setSettings(settingsRes);
    } catch (e) {
      console.error('Error loading admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {
      // Ignore network errors
    }
    router.push('/admin/login');
  };

  // Status Action Handler
  const openActionModal = (
    farm: AdminFarmSummary,
    targetStatus: FarmStatus,
    actionType: 'approve' | 'suspend' | 'reactivate' | 'reject'
  ) => {
    setActionModal({
      isOpen: true,
      farm,
      targetStatus,
      actionType,
      reason: '',
      error: '',
    });
  };

  const submitActionModal = async () => {
    if (!actionModal.farm || !actionModal.targetStatus) return;

    if (!actionModal.reason || actionModal.reason.trim().length < 5) {
      setActionModal((prev) => ({
        ...prev,
        error: 'Reason is strictly required (minimum 5 characters) for DPDP audit compliance.',
      }));
      return;
    }

    const res = await changeFarmStatus(
      {
        farmId: actionModal.farm.id,
        newStatus: actionModal.targetStatus,
        reason: actionModal.reason.trim(),
      },
      currentAdmin
    );

    if (!res.success) {
      setActionModal((prev) => ({ ...prev, error: res.error || 'Failed to update farm status.' }));
      return;
    }

    setActionModal((prev) => ({ ...prev, isOpen: false }));
    loadData();
  };

  // Extend Plan Handler
  const submitExtendModal = async () => {
    if (!extendModal.farm) return;
    if (!extendModal.reason || extendModal.reason.trim().length < 5) {
      setExtendModal((prev) => ({
        ...prev,
        error: 'Reason is required for plan duration modification.',
      }));
      return;
    }

    const res = await extendFarmPlan(
      {
        farmId: extendModal.farm.id,
        daysToAdd: extendModal.days,
        reason: extendModal.reason.trim(),
      },
      currentAdmin
    );

    if (!res.success) {
      setExtendModal((prev) => ({ ...prev, error: res.error || 'Failed to extend plan.' }));
      return;
    }

    setExtendModal((prev) => ({ ...prev, isOpen: false }));
    loadData();
  };

  // Support View Handler
  const openSupportView = async (farm: AdminFarmSummary) => {
    await recordSupportViewAccess(farm.id, currentAdmin, 'Admin portal read-only support inspection');
    setSupportModal({ isOpen: true, farm });
    loadData();
  };

  // Filtered farms list
  const filteredFarms = farms.filter((f) => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      return (
        f.name.toLowerCase().includes(q) ||
        f.ownerName.toLowerCase().includes(q) ||
        f.phone.includes(q) ||
        f.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingFarms = farms.filter((f) => f.status === 'pending_approval');

  // CSV download helper
  const downloadCsv = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#07130E] text-[#0B1E15] dark:text-[#E8F5EE] flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <header className="bg-white/90 dark:bg-[#0E2018]/90 backdrop-blur-md border-b border-[#DCD3C3] dark:border-[#1F3D2F] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1F4D3A] text-white flex items-center justify-center font-black shadow-md shadow-[#1F4D3A]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base tracking-tight">{t.adminTitle}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {currentAdmin.role === 'super_admin' ? t.adminRoleSuperAdmin : t.adminRoleOperator}
                </span>
              </div>
              <p className="text-[11px] text-[#52685D] dark:text-[#8AA89B] hidden sm:block">
                {t.adminSubtitle}
              </p>
            </div>
          </div>

          {/* Right Controls: Home link, Language, Admin Profile, Sign Out */}
          <div className="flex items-center gap-2">
            <Link
              href="/?landing=true"
              className="px-2.5 py-1.5 rounded-xl border border-[#DCD3C3] dark:border-[#1F3D2F] text-xs font-bold hover:border-[#1F4D3A] flex items-center gap-1.5 min-h-[38px]"
              title={t.backToHome}
            >
              <Home className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#42BF87]" />
              <span className="hidden md:inline">{t.backToHome}</span>
            </Link>

            {/* Trilingual Selector */}
            <div className="inline-flex rounded-xl p-0.5 bg-[#F4F1EA] dark:bg-[#152B20] border border-[#DCD3C3] dark:border-[#1F3D2F]">
              {(['mr', 'hi', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 text-xs font-bold rounded-lg transition-all min-h-[32px] ${
                    lang === l
                      ? 'bg-[#1F4D3A] text-white shadow-sm'
                      : 'text-[#4A5D53] dark:text-[#8AA89B]'
                  }`}
                >
                  {l === 'mr' ? 'मराठी' : l === 'hi' ? 'हिंदी' : 'EN'}
                </button>
              ))}
            </div>

            {/* Admin identity & Sign Out */}
            {loading && (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7A9386]" />
            )}
            <button
              onClick={handleLogout}
              id="btn-admin-logout"
              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-100 dark:hover:bg-rose-900 transition-all min-h-[38px]"
              title={t.adminLogoutBtn}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.adminLogoutBtn}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Mobile horizontal scroll friendly) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto no-scrollbar flex items-center gap-2 py-2 border-t border-[#EFEBE0] dark:border-[#152B20]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all min-h-[40px] ${
              activeTab === 'dashboard'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'text-[#52685D] dark:text-[#8AA89B] hover:bg-white dark:hover:bg-[#152B20]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.adminNavDashboard}</span>
          </button>

          <button
            onClick={() => setActiveTab('farms')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all min-h-[40px] ${
              activeTab === 'farms'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'text-[#52685D] dark:text-[#8AA89B] hover:bg-white dark:hover:bg-[#152B20]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{t.adminNavFarms}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 dark:bg-white/10">
              {farms.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all min-h-[40px] ${
              activeTab === 'approvals'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'text-[#52685D] dark:text-[#8AA89B] hover:bg-white dark:hover:bg-[#152B20]'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>{t.adminNavApprovals}</span>
            {pendingFarms.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white animate-pulse">
                {pendingFarms.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all min-h-[40px] ${
              activeTab === 'audit'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'text-[#52685D] dark:text-[#8AA89B] hover:bg-white dark:hover:bg-[#152B20]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.adminNavAuditLog}</span>
          </button>

          <button
            onClick={() => setActiveTab('operators')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all min-h-[40px] ${
              activeTab === 'operators'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'text-[#52685D] dark:text-[#8AA89B] hover:bg-white dark:hover:bg-[#152B20]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.adminNavOperators}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all min-h-[40px] ${
              activeTab === 'settings'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'text-[#52685D] dark:text-[#8AA89B] hover:bg-white dark:hover:bg-[#152B20]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t.adminNavSettings}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* TAB 1: DASHBOARD (KPIS) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Pending Approvals Notice Banner if > 0 */}
            {pendingFarms.length > 0 && (
              <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                      {pendingFarms.length} {t.adminPendingFarms}
                    </h2>
                    <p className="text-xs text-amber-800 dark:text-amber-300">
                      New layer farms are waiting for administrator review and verification.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('approvals')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all min-h-[40px]"
                >
                  <span>Review Approvals</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Total Farms */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm">
                <div className="flex items-center justify-between text-[#7A9386] mb-2">
                  <span className="text-xs font-bold">{t.adminTotalFarms}</span>
                  <Building2 className="w-4 h-4 text-[#1F4D3A] dark:text-[#42BF87]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black">{kpis?.totalFarms ?? 0}</div>
                <div className="text-[11px] text-[#7A9386] mt-1">Multi-shed active layer operations</div>
              </div>

              {/* Active Farms */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm">
                <div className="flex items-center justify-between text-[#7A9386] mb-2">
                  <span className="text-xs font-bold">{t.adminActiveFarms}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {kpis?.activeFarms ?? 0}
                </div>
                <div className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-1">
                  Full data logging & telemetry enabled
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm">
                <div className="flex items-center justify-between text-[#7A9386] mb-2">
                  <span className="text-xs font-bold">{t.adminPendingFarms}</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                  {kpis?.pendingFarms ?? 0}
                </div>
                <div className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-1">
                  Requires phone or KYC approval
                </div>
              </div>

              {/* Suspended Farms */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm">
                <div className="flex items-center justify-between text-[#7A9386] mb-2">
                  <span className="text-xs font-bold">{t.adminSuspendedFarms}</span>
                  <Lock className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                  {kpis?.suspendedFarms ?? 0}
                </div>
                <div className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-1">
                  Blocked from mutations; zero data loss
                </div>
              </div>

              {/* Total Birds Managed */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm">
                <div className="flex items-center justify-between text-[#7A9386] mb-2">
                  <span className="text-xs font-bold">{t.adminTotalBirds}</span>
                  <Bird className="w-4 h-4 text-[#1F4D3A] dark:text-[#42BF87]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black">
                  {(kpis?.totalBirds ?? 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#7A9386] mt-1">Total active laying birds</div>
              </div>

              {/* Estimated MRR */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm">
                <div className="flex items-center justify-between text-[#7A9386] mb-2">
                  <span className="text-xs font-bold">{t.adminEstimatedMRR}</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{(kpis?.estimatedMRR ?? 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#7A9386] mt-1">Grower Pro + Enterprise tiers</div>
              </div>

              {/* Expiring Plans in 7 Days */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm col-span-2">
                <div className="flex items-center justify-between text-[#7A9386] mb-2">
                  <span className="text-xs font-bold">{t.adminExpiringIn7Days}</span>
                  <Calendar className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                  {kpis?.expiringIn7Days ?? 0}
                </div>
                <div className="text-[11px] text-[#7A9386] mt-1">
                  Eligible for grace extension or automated renewal reminders
                </div>
              </div>
            </div>

            {/* Quick Farm List Preview */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black">Recent Enrolled Farms</h2>
                <button
                  onClick={() => setActiveTab('farms')}
                  className="text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] hover:underline"
                >
                  View All Farms →
                </button>
              </div>

              <div className="divide-y divide-[#EAE3D5] dark:divide-[#1A3326]">
                {farms.slice(0, 4).map((f) => (
                  <div key={f.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm">{f.name}</div>
                      <div className="text-xs text-[#7A9386]">
                        {f.ownerName} • {f.phone} • {f.district}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                          FARM_STATUS_CONFIGS[f.status].badgeBg
                        } ${FARM_STATUS_CONFIGS[f.status].badgeText} ${
                          FARM_STATUS_CONFIGS[f.status].badgeBorder
                        }`}
                      >
                        {f.status}
                      </span>
                      <button
                        onClick={() => openSupportView(f)}
                        className="p-2 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] hover:bg-[#EDE8DC] text-xs font-bold min-h-[38px] min-w-[38px] flex items-center justify-center"
                        title={t.adminSupportViewAction}
                      >
                        <Eye className="w-4 h-4 text-[#1F4D3A] dark:text-[#42BF87]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL FARMS */}
        {activeTab === 'farms' && (
          <div className="space-y-4">
            {/* Controls Bar: Search, Status filter tabs, Export CSV */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#7A9386] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.adminSearchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] text-xs focus:outline-none focus:ring-2 focus:ring-[#1F4D3A] min-h-[44px]"
                />
              </div>

              {/* Status Filter Chips & Export Button */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {(['all', 'active', 'pending_approval', 'suspended', 'rejected'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all min-h-[38px] ${
                        statusFilter === st
                          ? 'bg-[#1F4D3A] text-white shadow-sm'
                          : 'bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] text-[#52685D] dark:text-[#8AA89B]'
                      }`}
                    >
                      {st === 'all'
                        ? t.adminFilterAll
                        : st === 'pending_approval'
                        ? t.adminPendingFarms
                        : st}
                    </button>
                  )
                )}

                <button
                  onClick={() => downloadCsv(exportFarmsToCsv(filteredFarms), `layeros-farms-${Date.now()}.csv`)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] hover:border-[#1F4D3A] text-xs font-bold flex items-center gap-1.5 shrink-0 min-h-[38px]"
                  title={t.adminExportCsv}
                >
                  <Download className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#42BF87]" />
                  <span>{t.adminExportCsv}</span>
                </button>
              </div>
            </div>

            {/* Farm List Cards (Mobile friendly & Desktop responsive) */}
            <div className="grid grid-cols-1 gap-3">
              {filteredFarms.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-[#0E2018] rounded-3xl border border-[#DCD3C3] dark:border-[#1F3D2F]">
                  <p className="text-xs text-[#7A9386]">No farms match the search and filter criteria.</p>
                </div>
              ) : (
                filteredFarms.map((farm) => {
                  const cfg = FARM_STATUS_CONFIGS[farm.status];
                  return (
                    <div
                      key={farm.id}
                      className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm space-y-3"
                    >
                      {/* Top Row: Farm Name, Badge, Plan */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-sm sm:text-base">{farm.name}</h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wide ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}
                            >
                              {farm.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#52685D] dark:text-[#8AA89B] mt-0.5">
                            {farm.ownerName} • {farm.phone} • {farm.email}
                          </p>
                        </div>

                        {/* Plan & Capacity Tag */}
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] text-xs font-bold border border-[#DCD3C3] dark:border-[#1F3D2F]">
                            {farm.planId.toUpperCase()} • Ends {farm.planEndsAt.substring(0, 10)}
                          </span>
                          <span className="px-2.5 py-1 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] text-xs font-bold border border-[#DCD3C3] dark:border-[#1F3D2F]">
                            {(farm.currentBirdCount || 0).toLocaleString('en-IN')} birds
                          </span>
                        </div>
                      </div>

                      {/* Status Reason if present */}
                      {farm.statusReason && (
                        <div className="p-2.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#152B20] text-[11px] text-[#4A5D53] dark:text-[#A1C1B1] border border-[#EAE3D5] dark:border-[#1F3D2F]">
                          <span className="font-bold text-[#0B1E15] dark:text-white">
                            {t.statusReasonLabel}:{' '}
                          </span>
                          {farm.statusReason}
                        </div>
                      )}

                      {/* Action Triggers Row */}
                      <div className="pt-2 border-t border-[#EAE3D5] dark:border-[#1A3326] flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] text-[#7A9386]">
                          Enrolled: {farm.enrolledAt.substring(0, 10)}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Approve Button (for pending) */}
                          {farm.status === 'pending_approval' && (
                            <button
                              onClick={() => openActionModal(farm, 'active', 'approve')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 min-h-[38px]"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{t.adminApproveAction}</span>
                            </button>
                          )}

                          {/* Reject Button (for pending, Super Admin only) */}
                          {farm.status === 'pending_approval' && (
                            <button
                              onClick={() => openActionModal(farm, 'rejected', 'reject')}
                              className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 min-h-[38px]"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{t.adminRejectAction}</span>
                            </button>
                          )}

                          {/* Suspend Button (for active) */}
                          {farm.status === 'active' && (
                            <button
                              onClick={() => openActionModal(farm, 'suspended', 'suspend')}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 min-h-[38px]"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>{t.adminSuspendAction}</span>
                            </button>
                          )}

                          {/* Reactivate Button (for suspended) */}
                          {farm.status === 'suspended' && (
                            <button
                              onClick={() => openActionModal(farm, 'active', 'reactivate')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 min-h-[38px]"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>{t.adminReactivateAction}</span>
                            </button>
                          )}

                          {/* Extend Plan / Trial */}
                          <button
                            onClick={() =>
                              setExtendModal({
                                isOpen: true,
                                farm,
                                days: 30,
                                reason: '',
                                error: '',
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] border border-[#DCD3C3] dark:border-[#1F3D2F] hover:border-[#1F4D3A] text-xs font-bold flex items-center gap-1.5 min-h-[38px]"
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#42BF87]" />
                            <span>{t.adminExtendPlanAction}</span>
                          </button>

                          {/* Support View (Impersonation) */}
                          <button
                            onClick={() => openSupportView(farm)}
                            className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 text-xs font-bold flex items-center gap-1.5 min-h-[38px]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t.adminSupportViewAction}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PENDING APPROVALS QUEUE */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black">{t.adminNavApprovals}</h2>
                <p className="text-xs text-[#52685D] dark:text-[#8AA89B]">
                  Verify farm credentials, contact owner, and activate layer farm accounts.
                </p>
              </div>
            </div>

            {pendingFarms.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#0E2018] rounded-3xl border border-[#DCD3C3] dark:border-[#1F3D2F] space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold">All caught up!</h3>
                <p className="text-xs text-[#7A9386]">No new farm enrollments require approval.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingFarms.map((farm) => (
                  <div
                    key={farm.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#0E2018] border-2 border-amber-300 dark:border-amber-700/60 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black">{farm.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                            AWAITING VERIFICATION
                          </span>
                        </div>
                        <p className="text-xs text-[#52685D] dark:text-[#8AA89B] mt-1">
                          Owner: <span className="font-bold text-[#0B1E15] dark:text-white">{farm.ownerName}</span> •
                          Location: {farm.district}, {farm.state}
                        </p>
                      </div>

                      {/* Contact Action Buttons */}
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${farm.phone}`}
                          className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 min-h-[40px]"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call: {farm.phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/${farm.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold flex items-center gap-1.5 min-h-[40px]"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    {/* Farm Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#152B20] text-xs">
                      <div>
                        <div className="text-[10px] text-[#7A9386]">Sheds & Capacity</div>
                        <div className="font-bold">{farm.shedCount || 1} Sheds • {farm.totalCapacity.toLocaleString()} Birds</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#7A9386]">Target Plan</div>
                        <div className="font-bold uppercase">{farm.planId}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#7A9386]">Enrolled Timestamp</div>
                        <div className="font-bold">{farm.enrolledAt.substring(0, 16).replace('T', ' ')}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#7A9386]">Email Address</div>
                        <div className="font-bold">{farm.email || 'None'}</div>
                      </div>
                    </div>

                    {/* Action decision buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => openActionModal(farm, 'rejected', 'reject')}
                        className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-xs font-bold min-h-[42px]"
                      >
                        {t.adminRejectAction}
                      </button>
                      <button
                        onClick={() => openActionModal(farm, 'active', 'approve')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-emerald-600/20 min-h-[42px]"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{t.adminApproveAction}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: IMMUTABLE AUDIT LOG */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black">{t.adminNavAuditLog}</h2>
                <p className="text-xs text-[#52685D] dark:text-[#8AA89B]">
                  Append-only, immutable record of all platform status changes and support actions for DPDP Act compliance.
                </p>
              </div>
              <button
                onClick={() => downloadCsv(exportAuditLogsToCsv(auditLogs), `layeros-audit-log-${Date.now()}.csv`)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] hover:border-[#1F4D3A] text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto min-h-[38px]"
              >
                <Download className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#42BF87]" />
                <span>Export Audit CSV</span>
              </button>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm divide-y divide-[#EAE3D5] dark:divide-[#1A3326]">
              {auditLogs.map((entry) => (
                <div key={entry.id} className="py-3.5 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1F4D3A] dark:text-[#42BF87]">
                        [{entry.action}]
                      </span>
                      <span className="font-bold">{entry.farmName || 'Global'}</span>
                      {entry.previousStatus && entry.newStatus && (
                        <span className="text-[11px] text-[#7A9386]">
                          ({entry.previousStatus} → {entry.newStatus})
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#7A9386]">
                      {entry.createdAt.substring(0, 16).replace('T', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#35483F] dark:text-[#C5D8CE] pl-2 border-l-2 border-[#1F4D3A] dark:border-[#42BF87]">
                    &quot;{entry.reason}&quot;
                  </p>

                  <div className="text-[10px] text-[#7A9386] flex items-center gap-3">
                    <span>Admin: {entry.adminEmail} ({entry.adminRole})</span>
                    {entry.ip && <span>IP: {entry.ip}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: OPERATORS & TEAM */}
        {activeTab === 'operators' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black">{t.adminNavOperators}</h2>
                <p className="text-xs text-[#52685D] dark:text-[#8AA89B]">
                  Platform administrative users with role-based access to supervision tools.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEMO_ADMINS.map((adm) => (
                <div
                  key={adm.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#1F4D3A]/10 text-[#1F4D3A] dark:text-[#42BF87] flex items-center justify-center font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-black text-sm">{adm.email}</div>
                        <div className="text-[11px] text-[#7A9386]">Created: {adm.createdAt.substring(0, 10)}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase ${
                        adm.role === 'super_admin'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                      }`}
                    >
                      {adm.role === 'super_admin' ? t.adminRoleSuperAdmin : t.adminRoleOperator}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8F6F0] dark:bg-[#152B20] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A9386]">Privileges:</span>
                      <span className="font-bold">
                        {adm.role === 'super_admin'
                          ? 'Full Control, Approval, Settings'
                          : 'Suspend & Support View Only'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A9386]">Status:</span>
                      <span className="text-emerald-600 font-bold">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PLATFORM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-base font-black">{t.adminNavSettings}</h2>
              <p className="text-xs text-[#52685D] dark:text-[#8AA89B]">
                Configure global behavior for farm onboarding, default trials, and support contact details.
              </p>
            </div>

            {settings && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#DCD3C3] dark:border-[#1F3D2F] shadow-sm space-y-5">
                {/* Enrollment Mode Toggle */}
                <div>
                  <label className="block text-xs font-bold text-[#35483F] dark:text-[#A1C1B1] mb-2">
                    {t.adminSettingsEnrollmentMode}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, enrollmentMode: 'auto_approve' })}
                      className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all min-h-[48px] ${
                        settings.enrollmentMode === 'auto_approve'
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                          : 'border-[#DCD3C3] dark:border-[#1F3D2F]'
                      }`}
                    >
                      <div className="font-black">{t.adminSettingsAutoApprove}</div>
                      <div className="text-[10px] text-[#7A9386]">Farms activate immediately</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, enrollmentMode: 'manual_approval' })}
                      className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all min-h-[48px] ${
                        settings.enrollmentMode === 'manual_approval'
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                          : 'border-[#DCD3C3] dark:border-[#1F3D2F]'
                      }`}
                    >
                      <div className="font-black">{t.adminSettingsManualApproval}</div>
                      <div className="text-[10px] text-[#7A9386]">Requires admin review first</div>
                    </button>
                  </div>
                </div>

                {/* Default Trial Days */}
                <div>
                  <label className="block text-xs font-bold text-[#35483F] dark:text-[#A1C1B1] mb-1.5">
                    {t.adminSettingsTrialDays}
                  </label>
                  <input
                    type="number"
                    value={settings.defaultTrialDays}
                    onChange={(e) => setSettings({ ...settings, defaultTrialDays: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] border border-[#DCD3C3] dark:border-[#1F3D2F] text-xs font-bold min-h-[44px]"
                  />
                </div>

                {/* Support Helpline Number */}
                <div>
                  <label className="block text-xs font-bold text-[#35483F] dark:text-[#A1C1B1] mb-1.5">
                    {t.adminSettingsSupportPhone}
                  </label>
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] border border-[#DCD3C3] dark:border-[#1F3D2F] text-xs font-bold min-h-[44px]"
                  />
                </div>

                {/* WhatsApp Helpline */}
                <div>
                  <label className="block text-xs font-bold text-[#35483F] dark:text-[#A1C1B1] mb-1.5">
                    Support WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={settings.supportWhatsapp}
                    onChange={(e) => setSettings({ ...settings, supportWhatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] border border-[#DCD3C3] dark:border-[#1F3D2F] text-xs font-bold min-h-[44px]"
                  />
                </div>

                {/* Save Settings Button */}
                <button
                  type="button"
                  onClick={async () => {
                    const res = await updatePlatformSettings(settings, currentAdmin);
                    if (res.success) {
                      alert('Platform settings saved successfully.');
                    } else {
                      alert(res.error || 'Failed to save settings.');
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#1F4D3A] hover:bg-[#16382A] text-white text-xs font-black shadow-md min-h-[48px]"
                >
                  {t.adminSettingsSaveBtn}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: STATUS CHANGE CONFIRMATION WITH MANDATORY REASON */}
      {actionModal.isOpen && actionModal.farm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0E2018] rounded-3xl p-6 shadow-2xl border border-[#DCD3C3] dark:border-[#1F3D2F] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black capitalize">
                {actionModal.actionType} Farm Status
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                AUDITED
              </span>
            </div>

            <p className="text-xs text-[#52685D] dark:text-[#8AA89B]">
              Target: <span className="font-bold text-[#0B1E15] dark:text-white">{actionModal.farm.name}</span>
              <br />
              Transition: <span className="font-mono">{actionModal.farm.status} → {actionModal.targetStatus}</span>
            </p>

            {actionModal.error && (
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-800 text-xs">
                {actionModal.error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#35483F] dark:text-[#A1C1B1] mb-1">
                {t.adminReasonPrompt}
              </label>
              <textarea
                rows={3}
                required
                value={actionModal.reason}
                onChange={(e) => setActionModal({ ...actionModal, reason: e.target.value, error: '' })}
                placeholder={t.adminReasonPlaceholder}
                className="w-full p-3 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] border border-[#DCD3C3] dark:border-[#1F3D2F] text-xs focus:ring-2 focus:ring-[#1F4D3A] focus:outline-none"
              />
              <p className="text-[10px] text-[#7A9386] mt-1">
                Mandatory under DPDP Act. This justification is permanently written to the audit log.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal({ ...actionModal, isOpen: false })}
                className="px-4 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] text-xs font-bold min-h-[44px]"
              >
                {t.adminCancelAction}
              </button>
              <button
                type="button"
                onClick={submitActionModal}
                className="px-5 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#16382A] text-white text-xs font-black min-h-[44px]"
              >
                {t.adminConfirmAction}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EXTEND PLAN DURATION */}
      {extendModal.isOpen && extendModal.farm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0E2018] rounded-3xl p-6 shadow-2xl border border-[#DCD3C3] dark:border-[#1F3D2F] space-y-4">
            <h3 className="text-base font-black">Extend Subscription / Trial</h3>
            <p className="text-xs text-[#52685D] dark:text-[#8AA89B]">
              Farm: <span className="font-bold text-[#0B1E15] dark:text-white">{extendModal.farm.name}</span>
            </p>

            {extendModal.error && (
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-800 text-xs">
                {extendModal.error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1.5">Extension Period</label>
              <div className="grid grid-cols-3 gap-2">
                {[30, 60, 90].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setExtendModal({ ...extendModal, days: d })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all min-h-[40px] ${
                      extendModal.days === d
                        ? 'bg-[#1F4D3A] text-white border-[#1F4D3A]'
                        : 'border-[#DCD3C3] dark:border-[#1F3D2F]'
                    }`}
                  >
                    +{d} Days
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Reason for Extension</label>
              <input
                type="text"
                value={extendModal.reason}
                onChange={(e) => setExtendModal({ ...extendModal, reason: e.target.value, error: '' })}
                placeholder="e.g. Trial extension for festival season"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] border border-[#DCD3C3] dark:border-[#1F3D2F] text-xs min-h-[44px]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExtendModal({ ...extendModal, isOpen: false })}
                className="px-4 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] text-xs font-bold min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitExtendModal}
                className="px-5 py-2.5 rounded-xl bg-[#1F4D3A] text-white text-xs font-black min-h-[44px]"
              >
                Apply Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SUPPORT VIEW / IMPERSONATION INSPECTION */}
      {supportModal.isOpen && supportModal.farm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0E2018] rounded-3xl p-6 shadow-2xl border border-[#DCD3C3] dark:border-[#1F3D2F] space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Audited Banner */}
            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs flex items-center gap-2">
              <Eye className="w-4 h-4 shrink-0" />
              <span>
                <strong>READ-ONLY SUPPORT VIEW:</strong> This inspection session has been recorded in the platform audit trail under the DPDP Act.
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">{supportModal.farm.name}</h3>
                <p className="text-xs text-[#7A9386]">
                  Owner: {supportModal.farm.ownerName} • Phone: {supportModal.farm.phone}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black border ${
                  FARM_STATUS_CONFIGS[supportModal.farm.status].badgeBg
                } ${FARM_STATUS_CONFIGS[supportModal.farm.status].badgeText}`}
              >
                {supportModal.farm.status}
              </span>
            </div>

            {/* Farm telemetry summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#152B20] text-xs">
              <div>
                <div className="text-[10px] text-[#7A9386]">District / State</div>
                <div className="font-bold">{supportModal.farm.district}, {supportModal.farm.state}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#7A9386]">Current Birds</div>
                <div className="font-bold">{(supportModal.farm.currentBirdCount || 0).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#7A9386]">Total Capacity</div>
                <div className="font-bold">{supportModal.farm.totalCapacity.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#7A9386]">Active Subscription Plan</div>
                <div className="font-bold uppercase">{supportModal.farm.planId}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#7A9386]">Plan Valid Until</div>
                <div className="font-bold">{supportModal.farm.planEndsAt.substring(0, 10)}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#7A9386]">Sheds Count</div>
                <div className="font-bold">{supportModal.farm.shedCount || 1} Sheds</div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#EAE3D5] dark:border-[#1A3326]">
              <button
                type="button"
                onClick={() => setSupportModal({ isOpen: false, farm: null })}
                className="px-5 py-2.5 rounded-xl bg-[#1F4D3A] text-white text-xs font-bold min-h-[44px]"
              >
                Close Support View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
