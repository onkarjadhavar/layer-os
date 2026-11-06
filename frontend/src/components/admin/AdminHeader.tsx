'use client';

import React from 'react';
import { AdminTab, PlatformAdminUser } from '@/lib/admin/types';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import {
  Search,
  RefreshCw,
  Sun,
  Moon,
  Clock,
  Menu,
  ChevronRight,
  Shield,
  ShieldAlert,
  LogOut,
} from 'lucide-react';

interface AdminHeaderProps {
  currentTab: AdminTab;
  currentAdmin: PlatformAdminUser;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  pendingApprovalsCount: number;
  onOpenMobileMenu: () => void;
  onLogout?: () => void;
}

const TAB_TITLES: Record<AdminTab, { title: string; category: string }> = {
  dashboard: { title: 'Platform Overview', category: 'Platform' },
  farms: { title: 'Farms Directory', category: 'Platform' },
  approvals: { title: 'Approvals Queue', category: 'Platform' },
  operators: { title: 'Users & Roles', category: 'Platform' },
  subscriptions: { title: 'Subscriptions', category: 'Business' },
  billing: { title: 'Billing & Payments', category: 'Business' },
  analytics: { title: 'Platform Analytics', category: 'Business' },
  support: { title: 'Support Center', category: 'Operations' },
  audit: { title: 'Audit Logs (DPDP 2023)', category: 'Operations' },
  health: { title: 'System Health', category: 'Operations' },
  settings: { title: 'Platform Settings', category: 'Configuration' },
};

export function AdminHeader({
  currentTab,
  currentAdmin,
  searchQuery,
  onSearchChange,
  onRefresh,
  isLoading,
  pendingApprovalsCount,
  onOpenMobileMenu,
  onLogout,
}: AdminHeaderProps) {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const tabInfo = TAB_TITLES[currentTab] || { title: 'Console', category: 'Admin' };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[var(--color-surface)]/95 dark:bg-[#132219]/95 backdrop-blur-md border-b border-[var(--color-border)] dark:border-[#1A3024] px-4 sm:px-6 transition-colors">
      <div className="h-full flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Trigger + Breadcrumb Hierarchy */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)] border border-[var(--color-border)] shrink-0 cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold min-w-0">
            <span className="hidden sm:inline text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/80 hover:text-[var(--color-text-main)] transition-colors">
              LayerOS
            </span>
            <ChevronRight className="hidden sm:inline w-3 h-3 text-[var(--color-border)] dark:text-[#233C2E] shrink-0" />
            <span className="hidden md:inline text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70">
              {tabInfo.category}
            </span>
            <ChevronRight className="hidden md:inline w-3 h-3 text-[var(--color-border)] dark:text-[#233C2E] shrink-0" />
            <span className="text-sm sm:text-base font-black text-[var(--color-text-main)] dark:text-white truncate">
              {tabInfo.title}
            </span>
          </nav>
        </div>

        {/* Right: Controls & Global Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Search */}
          <div className="relative hidden lg:block w-52 xl:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search farms, owners..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[var(--color-border)] dark:border-[#1A3024] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-medium text-[var(--color-text-main)] dark:text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-forest)] transition-all"
            />
          </div>

          {/* Pending Approvals Pill */}
          {pendingApprovalsCount > 0 && (
            <div
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
              title={`${pendingApprovalsCount} farm(s) awaiting approval`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{pendingApprovalsCount} प्रलंबित (Pending)</span>
            </div>
          )}

          {/* Live Refresh Trigger */}
          <button
            type="button"
            id="admin-header-refresh-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl text-[var(--color-text-main)] dark:text-white hover:bg-[var(--color-surface-subtle)] dark:hover:bg-[#1A3024] border border-[var(--color-border)] dark:border-[#1A3024] transition-all cursor-pointer"
            title="Refresh Platform Data"
            aria-label="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)] ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Accessible Trilingual Language Selector */}
          <LanguageSwitcher />

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[var(--color-text-main)] dark:text-white hover:bg-[var(--color-surface-subtle)] dark:hover:bg-[#1A3024] border border-[var(--color-border)] dark:border-[#1A3024] transition-all cursor-pointer"
            title={theme === 'dark' ? t.themeLight : t.themeDark}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[var(--color-amber)]" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--color-forest)]" />
            )}
          </button>

          {/* Admin Avatar & Quick Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-[var(--color-border)] dark:border-[#1A3024]">
            <div
              className="w-7 h-7 rounded-full bg-[var(--color-forest)] text-white flex items-center justify-center font-bold text-xs shrink-0"
              title={`Active session: ${currentAdmin.email} (${currentAdmin.role})`}
            >
              {currentAdmin.email.charAt(0).toUpperCase()}
            </div>
            {onLogout && (
              <button
                type="button"
                id="admin-header-btn-logout"
                onClick={onLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
                title="लॉगआउट (Sign out)"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>लॉगआउट</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
export default AdminHeader;

