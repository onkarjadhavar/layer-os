'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n/context';
import {
  AdminAuditEntry,
  AdminFarmSummary,
  AdminTab,
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
  exportFarmsToCsv,
  exportAuditLogsToCsv,
} from '@/lib/admin/actions';
import { FarmStatus } from '@/lib/auth/farm-status';
import { getAdminSession, clearAdminSession } from '@/lib/admin/auth';
import { API_BASE_URL } from '@/services/api-client';

// Admin Modular Components
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminOverviewTab } from '@/components/admin/AdminOverviewTab';
import { AdminFarmsTab } from '@/components/admin/AdminFarmsTab';
import { AdminFarmDetailsDrawer } from '@/components/admin/AdminFarmDetailsDrawer';
import { AdminApprovalsTab } from '@/components/admin/AdminApprovalsTab';
import { AdminSubscriptionsTab } from '@/components/admin/AdminSubscriptionsTab';
import { AdminBillingTab } from '@/components/admin/AdminBillingTab';
import { AdminAnalyticsTab } from '@/components/admin/AdminAnalyticsTab';
import { AdminSupportTab } from '@/components/admin/AdminSupportTab';
import { AdminAuditLogsTab } from '@/components/admin/AdminAuditLogsTab';
import { AdminSystemHealthTab } from '@/components/admin/AdminSystemHealthTab';
import { AdminSettingsTab } from '@/components/admin/AdminSettingsTab';
import { AdminOperatorsTab } from '@/components/admin/AdminOperatorsTab';

// Modals
import { AdminActionModal } from '@/components/admin/AdminActionModal';
import { AdminExtendModal } from '@/components/admin/AdminExtendModal';
import { AdminSupportModal } from '@/components/admin/AdminSupportModal';

export function AdminPage() {
  const navigate = useNavigate();
  const router = { push: (url: string) => navigate(url) };
  const { t } = useI18n();

  // Current admin session
  const [currentAdmin, setCurrentAdmin] = useState<PlatformAdminUser | null>(() => {
    const session = getAdminSession();
    return session ? session.admin : null;
  });

  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab') as AdminTab;
      if (urlTab) return urlTab;
    }
    return 'dashboard';
  });

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'dashboard') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Sidebar collapse & mobile drawer state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('layeros_admin_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('layeros_admin_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global Data states
  const [kpis, setKpis] = useState<PlatformKPIs | null>(null);
  const [farms, setFarms] = useState<AdminFarmSummary[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditEntry[]>([]);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Inspection state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrawerFarm, setSelectedDrawerFarm] = useState<AdminFarmSummary | null>(null);

  // Modals state
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    farm: AdminFarmSummary | null;
    targetStatus: FarmStatus | null;
    actionType: 'approve' | 'suspend' | 'reactivate' | 'reject';
    reason: string;
    error: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    farm: null,
    targetStatus: null,
    actionType: 'approve',
    reason: '',
    error: '',
    isLoading: false,
  });

  const [extendModal, setExtendModal] = useState<{
    isOpen: boolean;
    farm: AdminFarmSummary | null;
    days: number;
    reason: string;
    error: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    farm: null,
    days: 30,
    reason: '',
    error: '',
    isLoading: false,
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
    const session = getAdminSession();
    if (!session || !session.admin) {
      navigate('/admin/login', { replace: true });
      return;
    }
    setCurrentAdmin(session.admin);
    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      clearAdminSession();
      await fetch(`${API_BASE_URL}/api/v1/admin/auth`, { method: 'DELETE' }).catch(() => {});
    } catch {
      // Ignore network errors
    }
    navigate('/admin/login', { replace: true });
  };

  // Status Action Handlers
  const handleOpenActionModal = (
    farm: AdminFarmSummary,
    action: 'approve' | 'suspend' | 'reactivate' | 'reject'
  ) => {
    const targetStatusMap: Record<string, FarmStatus> = {
      approve: 'active',
      suspend: 'suspended',
      reactivate: 'active',
      reject: 'rejected',
    };

    setActionModal({
      isOpen: true,
      farm,
      targetStatus: targetStatusMap[action] || 'active',
      actionType: action,
      reason: '',
      error: '',
      isLoading: false,
    });
  };

  const handleSubmitActionModal = async () => {
    if (!actionModal.farm || !actionModal.targetStatus || !currentAdmin) return;

    setActionModal((prev) => ({ ...prev, isLoading: true }));

    const res = await changeFarmStatus(
      {
        farmId: actionModal.farm.id,
        newStatus: actionModal.targetStatus,
        reason: actionModal.reason.trim(),
      },
      currentAdmin
    );

    if (!res.success) {
      alert(res.error || 'Failed to update farm status.');
      setActionModal((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    setActionModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    if (selectedDrawerFarm?.id === actionModal.farm.id) {
      setSelectedDrawerFarm(null);
    }
    loadData();
  };

  // Extend Plan Handlers
  const handleOpenExtendModal = (farm: AdminFarmSummary) => {
    setExtendModal({
      isOpen: true,
      farm,
      days: 30,
      reason: '',
      error: '',
      isLoading: false,
    });
  };

  const handleSubmitExtendModal = async () => {
    if (!extendModal.farm || !currentAdmin) return;

    setExtendModal((prev) => ({ ...prev, isLoading: true }));

    const res = await extendFarmPlan(
      {
        farmId: extendModal.farm.id,
        daysToAdd: extendModal.days,
        reason: extendModal.reason.trim(),
      },
      currentAdmin
    );

    if (!res.success) {
      alert(res.error || 'Failed to extend plan.');
      setExtendModal((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    setExtendModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    loadData();
  };

  // Support View Handlers
  const handleOpenSupportView = (farm: AdminFarmSummary) => {
    setSupportModal({
      isOpen: true,
      farm,
    });
  };

  const handleConfirmSupportView = async () => {
    if (!supportModal.farm || !currentAdmin) return;
    await recordSupportViewAccess(supportModal.farm.id, currentAdmin, 'Admin portal read-only support inspection');
    const farmId = supportModal.farm.id;
    setSupportModal({ isOpen: false, farm: null });
    router.push(`/dashboard/farms/${farmId}`);
  };

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

  const handleExportFarmsCsv = () => {
    const csv = exportFarmsToCsv(farms);
    downloadCsv(csv, `layeros_farms_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportAuditCsv = () => {
    const csv = exportAuditLogsToCsv(auditLogs);
    downloadCsv(csv, `layeros_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const pendingApprovalsCount = useMemo(() => {
    return farms.filter((f) => f.status === 'pending_approval').length;
  }, [farms]);

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[var(--color-forest)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-main)] flex transition-colors font-sans antialiased">
      {/* 1. Left Vertical Sidebar (Desktop Sticky + Mobile Drawer) */}
      <AdminSidebar
        currentTab={activeTab}
        onSelectTab={handleSelectTab}
        currentAdmin={currentAdmin}
        pendingApprovalsCount={pendingApprovalsCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          currentTab={activeTab}
          currentAdmin={currentAdmin}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={loadData}
          isLoading={loading}
          pendingApprovalsCount={pendingApprovalsCount}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onLogout={handleLogout}
        />

        {/* Tab Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <AdminOverviewTab
              kpis={kpis}
              farms={farms}
              auditLogs={auditLogs}
              currentAdmin={currentAdmin}
              onRefresh={loadData}
              isLoading={loading}
              onSelectFarm={(f) => setSelectedDrawerFarm(f)}
              onOpenActionModal={handleOpenActionModal}
              onOpenExtendModal={handleOpenExtendModal}
              onOpenSupportView={handleOpenSupportView}
              onNavigateTab={handleSelectTab}
              onExportCsv={handleExportFarmsCsv}
            />
          )}

          {activeTab === 'farms' && (
            <AdminFarmsTab
              farms={farms}
              currentAdmin={currentAdmin}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectFarm={(f) => setSelectedDrawerFarm(f)}
              onOpenActionModal={handleOpenActionModal}
              onOpenExtendModal={handleOpenExtendModal}
              onOpenSupportView={handleOpenSupportView}
              onExportCsv={handleExportFarmsCsv}
            />
          )}

          {activeTab === 'approvals' && (
            <AdminApprovalsTab
              farms={farms}
              currentAdmin={currentAdmin}
              onOpenActionModal={handleOpenActionModal}
              onSelectFarm={(f) => setSelectedDrawerFarm(f)}
            />
          )}

          {activeTab === 'subscriptions' && (
            <AdminSubscriptionsTab
              farms={farms}
              onOpenExtendModal={handleOpenExtendModal}
              onSelectFarm={(f) => setSelectedDrawerFarm(f)}
            />
          )}

          {activeTab === 'billing' && (
            <AdminBillingTab
              kpis={kpis}
              farms={farms}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalyticsTab
              farms={farms}
              kpis={kpis}
            />
          )}

          {activeTab === 'support' && (
            <AdminSupportTab
              farms={farms}
              onOpenSupportView={handleOpenSupportView}
            />
          )}

          {activeTab === 'audit' && (
            <AdminAuditLogsTab
              auditLogs={auditLogs}
              onExportCsv={handleExportAuditCsv}
            />
          )}

          {activeTab === 'operators' && (
            <AdminOperatorsTab
              currentAdmin={currentAdmin}
            />
          )}

          {activeTab === 'health' && (
            <AdminSystemHealthTab />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab
              settings={settings}
              currentAdmin={currentAdmin}
              onRefresh={loadData}
            />
          )}
        </main>
      </div>

      {/* 3. Slide-over Farm 360° Details Drawer */}
      <AdminFarmDetailsDrawer
        farm={selectedDrawerFarm}
        onClose={() => setSelectedDrawerFarm(null)}
        currentAdmin={currentAdmin}
        onOpenActionModal={handleOpenActionModal}
        onOpenExtendModal={handleOpenExtendModal}
        onOpenSupportView={handleOpenSupportView}
      />

      {/* 4. Action Confirmation Modal */}
      <AdminActionModal
        isOpen={actionModal.isOpen}
        farm={actionModal.farm}
        targetStatus={actionModal.targetStatus}
        reason={actionModal.reason}
        onReasonChange={(r) => setActionModal((prev) => ({ ...prev, reason: r }))}
        onClose={() => setActionModal((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleSubmitActionModal}
        isLoading={actionModal.isLoading}
      />

      {/* 5. Extend Plan Modal */}
      <AdminExtendModal
        isOpen={extendModal.isOpen}
        farm={extendModal.farm}
        days={extendModal.days}
        onDaysChange={(d) => setExtendModal((prev) => ({ ...prev, days: d }))}
        reason={extendModal.reason}
        onReasonChange={(r) => setExtendModal((prev) => ({ ...prev, reason: r }))}
        onClose={() => setExtendModal((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleSubmitExtendModal}
        isLoading={extendModal.isLoading}
      />

      {/* 6. Support View Confirmation Modal */}
      <AdminSupportModal
        isOpen={supportModal.isOpen}
        farm={supportModal.farm}
        onClose={() => setSupportModal({ isOpen: false, farm: null })}
        onConfirm={handleConfirmSupportView}
      />
    </div>
  );
}
export default AdminPage;
