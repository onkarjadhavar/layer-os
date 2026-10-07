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
    <aside className="hidden lg:flex flex-col w-64 bg-[#1F4D3A] text-white flex-shrink-0 h-screen sticky top-0 border-r border-[#173A2C] shadow-lg">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#D9A441] text-[#0B1E15] flex items-center justify-center font-black text-xl shadow-md">
          🥚
        </div>
        <div>
          <div className="text-xl font-black tracking-tight flex items-center gap-1">
            Layer<span className="text-[#D9A441]">OS</span>
          </div>
          <div className="text-[11px] text-emerald-100 font-bold leading-tight">
            {t.tagline}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-white text-[#1F4D3A] shadow-md font-black'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#1F4D3A]' : 'text-emerald-300'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                    isActive
                      ? 'bg-[#1F4D3A] text-white'
                      : 'bg-[#D9A441] text-[#0B1E15]'
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
      <div className="p-4 border-t border-white/10 bg-[#173A2C]/60 text-xs text-emerald-100">
        <div className="flex items-center justify-between font-bold">
          <span>LayerOS v2.4</span>
          <span className="text-emerald-400">● ऑनलाईन</span>
        </div>
        <div className="text-[11px] mt-0.5 font-medium">महाराष्ट्रातील पोल्ट्रीसाठी विशेष डिझाईन</div>
      </div>
    </aside>
  );
}
