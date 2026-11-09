'use client';

import React from 'react';
import { Link } from '@/components/common/Link';
import { AdminTab, PlatformAdminUser } from '@/lib/admin/types';
import { useI18n } from '@/lib/i18n/context';
import {
  LayoutDashboard,
  Building2,
  Clock,
  Users,
  CreditCard,
  Receipt,
  TrendingUp,
  Headphones,
  ShieldCheck,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  Shield,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  currentAdmin: PlatformAdminUser;
  pendingApprovalsCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  superAdminOnly?: boolean;
}

interface NavGroup {
  groupKey: string;
  title: string;
  items: NavItem[];
}

export function AdminSidebar({
  currentTab,
  onSelectTab,
  currentAdmin,
  pendingApprovalsCount,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const { t } = useI18n();

  const isSuperAdmin = currentAdmin.role === 'super_admin';

  const navigationGroups: NavGroup[] = [
    {
      groupKey: 'platform',
      title: 'PLATFORM',
      items: [
        {
          id: 'dashboard',
          label: t.adminTabDashboard || 'Overview',
          icon: LayoutDashboard,
        },
        {
          id: 'farms',
          label: t.adminTabFarms || 'Farms Directory',
          icon: Building2,
        },
        {
          id: 'approvals',
          label: t.adminTabApprovals || 'Approvals Queue',
          icon: Clock,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeColor: 'bg-amber-500 text-white',
        },
        {
          id: 'operators',
          label: t.adminTabOperators || 'Users & Roles',
          icon: Users,
        },
      ],
    },
    {
      groupKey: 'business',
      title: 'BUSINESS',
      items: [
        {
          id: 'subscriptions',
          label: 'Subscriptions',
          icon: CreditCard,
        },
        {
          id: 'billing',
          label: 'Billing & MRR',
          icon: Receipt,
        },
        {
          id: 'analytics',
          label: 'Platform Analytics',
          icon: TrendingUp,
        },
      ],
    },
    {
      groupKey: 'operations',
      title: 'OPERATIONS',
      items: [
        {
          id: 'support',
          label: 'Support Center',
          icon: Headphones,
        },
        {
          id: 'audit',
          label: t.adminTabAudit || 'Audit Logs (DPDP)',
          icon: ShieldCheck,
        },
        {
          id: 'health',
          label: 'System Health',
          icon: Activity,
        },
      ],
    },
    {
      groupKey: 'configuration',
      title: 'CONFIGURATION',
      items: [
        {
          id: 'settings',
          label: t.adminTabSettings || 'Platform Settings',
          icon: Settings,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#10221A] text-white border-r border-[#193F30] select-none">
      {/* 1. Header: Brand & Identity */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-white/10 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 min-w-0 group" title="LayerOS Platform Home">
          <img
            src="/images/layer-os-circular-logo.png"
            alt="Layer OS Circular Logo"
            width={34}
            height={34}
            className="w-[32px] h-[32px] object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 leading-tight">
              <div className="flex items-center gap-1.5 font-black text-sm text-white tracking-tight">
                <span>Layer<span className="text-[var(--color-amber)]">OS</span></span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider bg-white/10 text-[var(--color-sage)]">
                  Admin
                </span>
              </div>
              <span className="text-[10px] font-medium text-[var(--color-sage-pale)]/70 truncate">
                Platform Control Center
              </span>
            </div>
          )}
        </Link>

        {/* Mobile Close Button / Desktop Collapse Trigger */}
        {onCloseMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* 2. Admin Role Indicator Banner */}
      {!isCollapsed && (
        <div className="px-3.5 py-2.5 border-b border-white/5 bg-[#0B1A13]/70">
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <span className="text-[var(--color-sage-pale)]/70 font-medium">भूrole / Role:</span>
            <span
              className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wide flex items-center gap-1 ${
                isSuperAdmin
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>{isSuperAdmin ? 'Super Admin' : 'Operator'}</span>
            </span>
          </div>
        </div>
      )}

      {/* 3. Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {navigationGroups.map((group) => (
          <div key={group.groupKey} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-sage)]/70 select-none">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isRestricted = item.superAdminOnly && !isSuperAdmin;

              if (isRestricted) return null;

              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[var(--color-forest)] text-white font-bold shadow-xs border border-[var(--color-sage)]/35'
                      : 'text-[var(--color-sage-pale)]/80 hover:bg-white/10 hover:text-white'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-[var(--color-amber)]'
                        : 'text-[var(--color-sage)] group-hover:text-white'
                    }`}
                  />
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums shrink-0 ${
                            item.badgeColor || 'bg-white/20 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 4. Footer: User Profile Card & Logout */}
      <div className="p-3 border-t border-white/10 bg-[#0B1A13]/90 shrink-0">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[var(--color-forest)] text-white border border-[var(--color-sage)]/40 flex items-center justify-center font-bold text-xs shrink-0">
                {currentAdmin.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 leading-tight">
                <p className="text-xs font-bold text-white truncate" title={currentAdmin.email}>
                  {currentAdmin.email}
                </p>
                <p className="text-[10px] text-[var(--color-sage)] font-medium capitalize">
                  {currentAdmin.role.replace('_', ' ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <Link
                href="/?landing=true"
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-[var(--color-sage-pale)]/80 hover:bg-white/10 hover:text-white transition-colors"
                title="View Public Farm Landing"
              >
                <ExternalLink className="w-3 h-3 text-[var(--color-sage)]" />
                <span className="truncate">Public Site</span>
              </Link>
              <button
                type="button"
                id="admin-sidebar-btn-logout"
                onClick={onLogout}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors cursor-pointer"
                title="Sign out of Admin Console"
              >
                <LogOut className="w-3 h-3" />
                <span>लॉगआउट</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-[var(--color-forest)] text-white border border-[var(--color-sage)]/40 flex items-center justify-center font-bold text-xs"
              title={currentAdmin.email}
            >
              {currentAdmin.email.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-rose-300 hover:bg-white/10 rounded-lg cursor-pointer"
              title="लॉगआउट (Sign out)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden md:block shrink-0 h-screen sticky top-0 transition-all duration-200 z-30 ${
          isCollapsed ? 'w-[68px]' : 'w-[250px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-[280px] max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
export default AdminSidebar;

