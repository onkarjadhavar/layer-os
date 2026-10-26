'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useLayerOS } from '@/lib/store';
import { LayerOSLogo } from '@/components/common/LayerOSLogo';
import {
  LayoutDashboard,
  Zap,
  ClipboardList,
  Layers,
  CircleDollarSign,
  Receipt,
  HeartPulse,
  TrendingUp,
  LineChart,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'quick-log'
  | 'full-entry'
  | 'flocks'
  | 'sales'
  | 'expenses'
  | 'health'
  | 'market-rates'
  | 'forecast'
  | 'reports'
  | 'public-tools'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  groupTitle?: string;
  items: NavItem[];
}

export function Sidebar({ currentTab, onSelectTab }: SidebarProps) {
  const { t } = useI18n();
  const { logout, isDatabaseConnected } = useLayerOS();

  const navigationGroups: NavGroup[] = [
    {
      groupTitle: 'मुख्य विभाग (Overview)',
      items: [
        { id: 'home', label: t.navHome, icon: LayoutDashboard },
      ],
    },
    {
      groupTitle: 'दैनंदिन कामकाज (Operations)',
      items: [
        { id: 'quick-log', label: t.navQuickLog, icon: Zap, badge: '३०s' },
        { id: 'full-entry', label: t.fullEntryTitle, icon: ClipboardList },
        { id: 'flocks', label: t.navFlocks, icon: Layers },
      ],
    },
    {
      groupTitle: 'विक्री व बाजार (Commercial)',
      items: [
        { id: 'sales', label: t.navSales, icon: CircleDollarSign },
        { id: 'market-rates', label: t.navMarketRates, icon: TrendingUp },
        { id: 'forecast', label: t.navForecast, icon: LineChart, badge: 'AI' },
      ],
    },
    {
      groupTitle: 'हिशोब व आरोग्य (Accounts & Health)',
      items: [
        { id: 'expenses', label: t.navExpenses, icon: Receipt },
        { id: 'health', label: t.navHealth, icon: HeartPulse },
        { id: 'reports', label: t.navReports, icon: FileSpreadsheet },
      ],
    },
    {
      groupTitle: 'व्यवस्थापन (Admin)',
      items: [
        { id: 'public-tools', label: t.navPublicTools, icon: HelpCircle },
        { id: 'settings', label: t.navSettings, icon: Settings },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[var(--color-forest-deep)] text-white flex-shrink-0 h-screen sticky top-0 border-r border-[#193F30] shadow-md z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <LayerOSLogo size={36} showText />
      </div>

      {/* Categorized Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navigationGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {group.groupTitle && (
              <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-sage)]/80 select-none">
                {group.groupTitle}
              </div>
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-forest)] text-white font-bold shadow-xs border border-[var(--color-sage)]/40'
                      : 'text-[var(--color-sage-pale)]/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-[var(--color-amber)]' : 'text-[var(--color-sage)]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-[var(--color-amber)] text-[var(--color-forest-deep)]'
                          : 'bg-white/15 text-[var(--color-amber)]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Logout Action */}
      <div className="p-3 border-t border-white/10">
        <button
          type="button"
          id="sidebar-btn-logout"
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-xs text-[var(--color-sage-pale)]/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[var(--color-amber)]" />
          <span>लॉगआउट (Logout)</span>
        </button>
      </div>

      {/* Live System Status Indicator */}
      <div className="px-4 py-3 border-t border-white/10 bg-[#0B251B] text-xs text-[var(--color-sage-pale)]/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
          <span>{isDatabaseConnected ? 'PostgreSQL Live' : 'Offline Storage'}</span>
        </div>
        <span className="text-[10px] text-[var(--color-sage)] font-bold">v2.4</span>
      </div>
    </aside>
  );
}
export default Sidebar;
