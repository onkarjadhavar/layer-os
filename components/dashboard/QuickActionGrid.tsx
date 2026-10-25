'use client';

import React from 'react';
import {
  Egg,
  CircleDollarSign,
  Receipt,
  TrendingUp,
  Share2,
  HeartPulse,
  Skull,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface QuickActionGridProps {
  onSelectAction: (actionKey: string) => void;
}

export function QuickActionGrid({ onSelectAction }: QuickActionGridProps) {
  const primaryActions = [
    {
      key: 'quick-log',
      title: 'दैनिक नोंदणी',
      sub: 'अंडी, खुराक व मृत्यू ३० सेकंदात',
      icon: Egg,
      badge: '३०s नोंद',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300/80 dark:border-emerald-800/80 hover:border-emerald-600',
      iconClass: 'bg-emerald-600 text-white',
      badgeClass: 'bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200',
    },
    {
      key: 'sales',
      title: 'अंडी विक्री बिल',
      sub: 'नवीन गाडी / ग्राहक पावती',
      icon: CircleDollarSign,
      badge: 'नवीन विक्री',
      bgClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300/80 dark:border-amber-800/80 hover:border-amber-600',
      iconClass: 'bg-[#D9A441] text-[#0B1E15]',
      badgeClass: 'bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200',
    },
    {
      key: 'expenses',
      title: 'खर्च नोंद',
      sub: 'दाना, औषध, मजुरी व इतर',
      icon: Receipt,
      badge: 'खर्च',
      bgClass: 'bg-blue-50 dark:bg-blue-950/40 border-blue-300/80 dark:border-blue-800/80 hover:border-blue-600',
      iconClass: 'bg-blue-600 text-white',
      badgeClass: 'bg-blue-200/80 text-blue-900 dark:bg-blue-900 dark:text-blue-200',
    },
    {
      key: 'market-rates',
      title: 'बाजार भाव',
      sub: 'पुणे, मुंबई व नाशिक दर',
      icon: TrendingUp,
      badge: 'Mandi',
      bgClass: 'bg-purple-50 dark:bg-purple-950/40 border-purple-300/80 dark:border-purple-800/80 hover:border-purple-600',
      iconClass: 'bg-purple-600 text-white',
      badgeClass: 'bg-purple-200/80 text-purple-900 dark:bg-purple-900 dark:text-purple-200',
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-black text-[#0B1E15] dark:text-white flex items-center gap-1.5">
            <span>शेतकरी जलद सेवा (Quick Actions)</span>
          </h3>
          <p className="text-xs font-semibold text-[#55695F] dark:text-[#CBDCD4]">
            एका टॅपवर महत्त्वाचे काम सुरू करा
          </p>
        </div>
      </div>

      {/* 4 Big Tactile Action Cards (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
        {primaryActions.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectAction(item.key)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-[0.98] shadow-xs touch-target ${item.bgClass}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-xs ${item.iconClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                  {item.badge}
                </span>
              </div>
              <div>
                <div className="text-sm font-black text-[#0B1E15] dark:text-white leading-tight">
                  {item.title}
                </div>
                <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium leading-tight mt-1 line-clamp-1">
                  {item.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Secondary Fast Action Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
        <button
          type="button"
          onClick={() => onSelectAction('reports')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] whitespace-nowrap active:scale-95 transition-all shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>📲 WhatsApp दैनिक अहवाल</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAction('health')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] whitespace-nowrap active:scale-95 transition-all shadow-xs"
        >
          <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
          <span>💉 लसीकरण वेळापत्रक</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAction('mortality')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] whitespace-nowrap active:scale-95 transition-all shadow-xs"
        >
          <Skull className="w-3.5 h-3.5 text-red-500" />
          <span>💀 मृत्यू नोंद तपशील</span>
        </button>
      </div>
    </div>
  );
}
