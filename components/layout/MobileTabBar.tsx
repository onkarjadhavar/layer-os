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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#122A23]/95 backdrop-blur-md border-t border-[#E8E4DA] dark:border-[#1E3F36] px-2 py-1.5 pb-safe shadow-lg">
      <div className="grid grid-cols-5 gap-1 items-center">
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`touch-target flex flex-col items-center justify-center rounded-xl py-1 px-1 transition-colors ${
            currentTab === 'home'
              ? 'text-[#013E37] dark:text-[#3DAE7E] font-bold'
              : 'text-[#6B8A7F] dark:text-[#6E9487] font-medium'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 truncate">{t.navHome}</span>
        </button>

        {/* 2. Quick Log */}
        <button
          onClick={() => onSelectTab('quick-log')}
          className={`touch-target flex flex-col items-center justify-center rounded-xl py-1 px-1 transition-colors ${
            currentTab === 'quick-log'
              ? 'text-[#013E37] dark:text-[#3DAE7E] font-bold'
              : 'text-[#6B8A7F] dark:text-[#6E9487] font-medium'
          }`}
        >
          <Zap className="w-5 h-5 text-[#C9A23C]" />
          <span className="text-[10px] mt-0.5 truncate">नोंद ३०s</span>
        </button>

        {/* 3. Sales */}
        <button
          onClick={() => onSelectTab('sales')}
          className={`touch-target flex flex-col items-center justify-center rounded-xl py-1 px-1 transition-colors ${
            currentTab === 'sales'
              ? 'text-[#013E37] dark:text-[#3DAE7E] font-bold'
              : 'text-[#6B8A7F] dark:text-[#6E9487] font-medium'
          }`}
        >
          <CircleDollarSign className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 truncate">{t.navSales}</span>
        </button>

        {/* 4. Reports */}
        <button
          onClick={() => onSelectTab('reports')}
          className={`touch-target flex flex-col items-center justify-center rounded-xl py-1 px-1 transition-colors ${
            currentTab === 'reports'
              ? 'text-[#013E37] dark:text-[#3DAE7E] font-bold'
              : 'text-[#6B8A7F] dark:text-[#6E9487] font-medium'
          }`}
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 truncate">{t.navReports}</span>
        </button>

        {/* 5. More */}
        <button
          onClick={onOpenMoreMenu}
          className="touch-target flex flex-col items-center justify-center rounded-xl py-1 px-1 text-[#6B8A7F] dark:text-[#6E9487] font-medium hover:text-[#0C1F1A]"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 truncate">{t.navMore}</span>
        </button>
      </div>
    </nav>
  );
}
