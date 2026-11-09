'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useLayerOS } from '@/lib/store';
import {
  Home,
  Warehouse,
  HelpCircle,
  Info,
  LogOut,
  Sparkles,
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
  onOpenHelp?: () => void;
  onOpenAbout?: () => void;
}

export function Sidebar({ currentTab, onSelectTab, onOpenHelp, onOpenAbout }: SidebarProps) {
  const { t } = useI18n();
  const { logout, isDatabaseConnected, farm } = useLayerOS();

  const isDashboardActive = currentTab === 'home';
  const isFarmInfoActive = currentTab === 'flocks';

  return (
    <aside
      className="hidden lg:flex flex-col w-[240px] xl:w-[260px] bg-[#173F20] text-white flex-shrink-0 h-screen sticky top-0 z-30 select-none shadow-xl border-r border-[#12351B]"
      style={{ backgroundColor: '#173F20' }}
    >
      {/* 1. Sidebar Brand Header: Layer OS Circular Logo + Wordmark */}
      <div className="pt-6 pb-6 px-5 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#28572B]/60 p-1 flex items-center justify-center shrink-0 border border-white/15 shadow-sm">
          <img
            src="/images/layer-os-circular-logo.png"
            alt="Layer OS"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-xl tracking-tight text-white leading-none">
            Layer OS
          </span>
          <span className="text-[10px] text-[#A6C48A] font-medium tracking-wide mt-1">
            Poultry OS
          </span>
        </div>
      </div>

      {/* 2. Navigation Links: Dashboard, Farm Info, Help & Support, About */}
      <nav className="flex-1 px-4 py-2 space-y-2">
        {/* Dashboard Link */}
        <button
          type="button"
          id="sidebar-nav-dashboard"
          onClick={() => onSelectTab('home')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
            isDashboardActive
              ? 'bg-[#28572B] text-white shadow-sm border border-white/10'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
              isDashboardActive
                ? 'bg-[#D5811F] text-[#173F20] shadow-sm'
                : 'bg-white/10 text-white'
            }`}
          >
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-wide">
            {t.navHome || 'Dashboard'}
          </span>
        </button>

        {/* Farm Info Link */}
        <button
          type="button"
          id="sidebar-nav-farm-info"
          onClick={() => onSelectTab('flocks')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
            isFarmInfoActive
              ? 'bg-[#28572B] text-white shadow-sm border border-white/10'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isFarmInfoActive
                ? 'bg-[#D5811F] text-[#173F20]'
                : 'bg-white/10 text-white/80'
            }`}
          >
            <Warehouse className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-sm tracking-wide">
            {t.navFlocks || 'Farm Info'}
          </span>
        </button>

        {/* Help & Support Link */}
        <button
          type="button"
          id="sidebar-nav-help"
          onClick={() => {
            if (onOpenHelp) onOpenHelp();
          }}
          className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white/80">
            <HelpCircle className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm tracking-wide">
            {t.help || 'Help & Support'}
          </span>
        </button>

        {/* About Link */}
        <button
          type="button"
          id="sidebar-nav-about"
          onClick={() => {
            if (onOpenAbout) onOpenAbout();
          }}
          className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white/80">
            <Info className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm tracking-wide">
            {t.about || 'About'}
          </span>
        </button>
      </nav>

      {/* 3. Bottom Sidebar Farm Landscape Illustration & Tagline */}
      <div className="p-4 pb-6 flex flex-col items-center">
        <div className="w-full rounded-2xl overflow-hidden bg-[#12351B]/50 p-1 border border-white/10">
          <img
            src="/images/sidebar-farm-illustration.png"
            alt="Poultry Farm Illustration"
            className="w-full h-auto object-contain rounded-xl opacity-90 transition-opacity hover:opacity-100"
          />
        </div>
        <p className="mt-3 text-[12px] font-serif italic text-[#F6E5C9] text-center font-medium tracking-wide">
          Smart Poultry Better Tomorrow
        </p>

        {/* Subtle Database Connectivity Indicator */}
        <div className="mt-2 text-[10px] text-[#A6C48A]/70 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isDatabaseConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span>{isDatabaseConnected ? 'Live Farm Connected' : 'Offline Mode'}</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
