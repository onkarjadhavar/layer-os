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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#16241D]/95 backdrop-blur-md border-t border-[#E7E2D6] dark:border-[#263B30] px-2 py-1.5 pb-safe shadow-lg">
      <div className="grid grid-cols-5 gap-1 items-center">
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`touch-target flex flex-col items-center justify-center rounded-xl py-1 px-1 transition-colors ${
            currentTab === 'home'
              ? 'text-[#1F4D3A] dark:text-[#3BA378] font-black'
              : 'text-[#2D4538] dark:text-[#CBDCD4] font-bold'
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
              ? 'text-[#1F4D3A] dark:text-[#3BA378] font-black'
              : 'text-[#2D4538] dark:text-[#CBDCD4] font-bold'
          }`}
        >
          <Zap className="w-5 h-5 text-[#D9A441]" />
          <span className="text-[10px] mt-0.5 truncate">नोंद ३०s</span>
        </button>

        {/* 3. Sales */}
        <button
          onClick={() => onSelectTab('sales')}
          className={`touch-target flex flex-col items-center justify-center rounded-xl py-1 px-1 transition-colors ${
            currentTab === 'sales'
              ? 'text-[#1F4D3A] dark:text-[#3BA378] font-black'
              : 'text-[#2D4538] dark:text-[#CBDCD4] font-bold'
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
              ? 'text-[#1F4D3A] dark:text-[#3BA378] font-black'
              : 'text-[#2D4538] dark:text-[#CBDCD4] font-bold'
          }`}
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 truncate">{t.navReports}</span>
        </button>

        {/* 5. More */}
        <button
          onClick={onOpenMoreMenu}
          className="touch-target flex flex-col items-center justify-center rounded-xl py-1 px-1 text-[#2D4538] dark:text-[#CBDCD4] font-bold hover:text-[#0B1E15]"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 truncate">{t.navMore}</span>
        </button>
      </div>
    </nav>
  );
}
