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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#103528]/95 backdrop-blur-md border-t border-[var(--color-border)] dark:border-[#263B30] px-2 py-1.5 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-5 gap-1 items-center max-w-lg mx-auto">
        {/* 1. Home (मुख्य) */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`touch-target flex flex-col items-center justify-center rounded-2xl py-1 transition-all active:scale-95 cursor-pointer ${
            currentTab === 'home'
              ? 'text-[#194B38] dark:text-[#87A96B] font-bold'
              : 'text-[var(--color-text-muted)] dark:text-[#E8EFE2]/70 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${currentTab === 'home' ? 'bg-[#E8EFE2] dark:bg-[#194B38]/60' : ''}`}>
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
          className={`touch-target flex flex-col items-center justify-center rounded-2xl py-1 transition-all active:scale-95 relative cursor-pointer ${
            currentTab === 'quick-log'
              ? 'text-[#194B38] dark:text-[#87A96B] font-bold'
              : 'text-[var(--color-text-muted)] dark:text-[#E8EFE2]/70 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${currentTab === 'quick-log' ? 'bg-[#F6E5C9] dark:bg-[#D5811F]/20' : ''}`}>
            <Zap className="w-5 h-5 text-[#D5811F] fill-[#D5811F]" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[56px] text-center flex items-center gap-0.5 font-bold text-[#D5811F]">
            नोंद <span className="text-[9px] bg-[#D5811F] text-white px-1 rounded-full font-bold">३०s</span>
          </span>
        </button>

        {/* 3. Sales (विक्री) */}
        <button
          type="button"
          onClick={() => onSelectTab('sales')}
          className={`touch-target flex flex-col items-center justify-center rounded-2xl py-1 transition-all active:scale-95 cursor-pointer ${
            currentTab === 'sales'
              ? 'text-[#194B38] dark:text-[#87A96B] font-bold'
              : 'text-[var(--color-text-muted)] dark:text-[#E8EFE2]/70 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${currentTab === 'sales' ? 'bg-[#E8EFE2] dark:bg-[#194B38]/60' : ''}`}>
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
          className={`touch-target flex flex-col items-center justify-center rounded-2xl py-1 transition-all active:scale-95 cursor-pointer ${
            currentTab === 'reports'
              ? 'text-[#194B38] dark:text-[#87A96B] font-bold'
              : 'text-[var(--color-text-muted)] dark:text-[#E8EFE2]/70 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${currentTab === 'reports' ? 'bg-[#E8EFE2] dark:bg-[#194B38]/60' : ''}`}>
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
          className="touch-target flex flex-col items-center justify-center rounded-2xl py-1 text-[var(--color-text-muted)] dark:text-[#E8EFE2]/70 font-medium hover:text-[#17251D] dark:hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <div className="p-1.5 rounded-xl">
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
