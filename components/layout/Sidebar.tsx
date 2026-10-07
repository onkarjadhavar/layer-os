'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
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

export function Sidebar({ currentTab, onSelectTab }: SidebarProps) {
  const { t } = useI18n();

  const navigationItems: Array<{ id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }> = [
    { id: 'home', label: t.navHome, icon: LayoutDashboard },
    { id: 'quick-log', label: t.navQuickLog, icon: Zap, badge: "३०s" },
    { id: 'full-entry', label: t.fullEntryTitle, icon: ClipboardList },
    { id: 'flocks', label: t.navFlocks, icon: Layers },
    { id: 'sales', label: t.navSales, icon: CircleDollarSign },
    { id: 'expenses', label: t.navExpenses, icon: Receipt },
    { id: 'health', label: t.navHealth, icon: HeartPulse },
    { id: 'market-rates', label: t.navMarketRates, icon: TrendingUp },
    { id: 'forecast', label: t.navForecast, icon: LineChart, badge: "AI" },
    { id: 'reports', label: t.navReports, icon: FileSpreadsheet },
    { id: 'public-tools', label: "मोफत कॅल्क्युलेटर (Tools)", icon: HelpCircle },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[260px] bg-[#013E37] text-white flex-shrink-0 h-screen sticky top-0 shadow-xl">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-white/[0.08] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center font-black text-xl shadow-sm">
          🥚
        </div>
        <div>
          <div className="text-lg font-extrabold tracking-tight flex items-center gap-0.5" style={{ fontFamily: '"DM Sans", Inter, sans-serif' }}>
            Layer<span className="text-[#FFEFB3]">OS</span>
          </div>
          <div className="text-[10px] text-white/60 font-medium leading-tight tracking-wide uppercase">
            {t.tagline}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                isActive
                  ? 'bg-[#FFEFB3] text-[#013E37] shadow-sm font-bold'
                  : 'text-white/80 hover:bg-white/[0.07] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#013E37]' : 'text-white/50'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-[#013E37] text-[#FFEFB3]'
                      : 'bg-[#FFEFB3]/20 text-[#FFEFB3]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3.5 border-t border-white/[0.08] text-[11px] text-white/50">
        <div className="flex items-center justify-between font-semibold">
          <span>LayerOS v2.4</span>
          <span className="flex items-center gap-1 text-[#3DAE7E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3DAE7E] animate-pulse" />
            ऑनलाईन
          </span>
        </div>
        <div className="text-[10px] mt-0.5 font-normal text-white/40">महाराष्ट्रातील पोल्ट्रीसाठी विशेष डिझाईन</div>
      </div>
    </aside>
  );
}
