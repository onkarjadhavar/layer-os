'use client';

import React from 'react';
import { NavTab } from './Sidebar';
import { useI18n } from '@/lib/i18n/context';
import {
  LayoutDashboard,
  Zap,
  CircleDollarSign,
  FileSpreadsheet,
  Menu,
} from 'lucide-react';

interface MobileTabBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMoreMenu: () => void;
}

export function MobileTabBar({ currentTab, onSelectTab, onOpenMoreMenu }: MobileTabBarProps) {
  const { t } = useI18n();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#16241D]/95 backdrop-blur-md border-t border-[#E7E2D6] dark:border-[#263B30] px-2 py-1.5 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-5 gap-1 items-center max-w-lg mx-auto">
        {/* 1. Home (मुख्य) */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`touch-target flex flex-col items-center justify-center rounded-2xl py-1 transition-all active:scale-95 ${
            currentTab === 'home'
              ? 'text-[#1F4D3A] dark:text-[#42BF87] font-black'
              : 'text-[#4D6558] dark:text-[#CBDCD4] font-semibold'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${currentTab === 'home' ? 'bg-[#EAF3EF] dark:bg-[#182B22]' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[56px] text-center">
            {t.navHome}
          </span>
        </button>

        {/* 2. Quick Log (दैनिक नोंद - Highlighted Center Action) */}
        <button
          type="button"
          onClick={() => onSelectTab('quick-log')}
          className={`touch-target flex flex-col items-center justify-center rounded-2xl py-1 transition-all active:scale-95 relative ${
            currentTab === 'quick-log'
              ? 'text-[#1F4D3A] dark:text-[#42BF87] font-black'
              : 'text-[#4D6558] dark:text-[#CBDCD4] font-semibold'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${currentTab === 'quick-log' ? 'bg-[#FCF6E9] dark:bg-[#2E2413]' : ''}`}>
            <Zap className="w-5 h-5 text-[#D9A441] fill-[#D9A441]" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[56px] text-center flex items-center gap-0.5 font-black text-[#D9A441]">
            नोंद <span className="text-[9px] bg-[#D9A441] text-[#0B1E15] px-1 rounded-full">३०s</span>
          </span>
        </button>

        {/* 3. Sales (विक्री) */}
        <button
          type="button"
          onClick={() => onSelectTab('sales')}
          className={`touch-target flex flex-col items-center justify-center rounded-2xl py-1 transition-all active:scale-95 ${
            currentTab === 'sales'
              ? 'text-[#1F4D3A] dark:text-[#42BF87] font-black'
              : 'text-[#4D6558] dark:text-[#CBDCD4] font-semibold'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${currentTab === 'sales' ? 'bg-[#EAF3EF] dark:bg-[#182B22]' : ''}`}>
            <CircleDollarSign className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[56px] text-center">
            {t.navSales}
          </span>
        </button>

        {/* 4. Reports (अहवाल) */}
        <button
          type="button"
          onClick={() => onSelectTab('reports')}
          className={`touch-target flex flex-col items-center justify-center rounded-2xl py-1 transition-all active:scale-95 ${
            currentTab === 'reports'
              ? 'text-[#1F4D3A] dark:text-[#42BF87] font-black'
              : 'text-[#4D6558] dark:text-[#CBDCD4] font-semibold'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${currentTab === 'reports' ? 'bg-[#EAF3EF] dark:bg-[#182B22]' : ''}`}>
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[56px] text-center">
            {t.navReports}
          </span>
        </button>

        {/* 5. More / Menu (मेन्यू) */}
        <button
          type="button"
          onClick={onOpenMoreMenu}
          className="touch-target flex flex-col items-center justify-center rounded-2xl py-1 text-[#4D6558] dark:text-[#CBDCD4] font-semibold hover:text-[#0B1E15] active:scale-95 transition-all"
        >
          <div className="p-1 rounded-xl">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[56px] text-center">
            {t.navMore}
          </span>
        </button>
      </div>
    </nav>
  );
}
