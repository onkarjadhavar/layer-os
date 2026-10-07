'use client';

import React from 'react';
import {
  Egg,
  CircleDollarSign,
  Receipt,
  HeartPulse,
  TrendingUp,
  Skull,
  Wheat,
  Share2,
} from 'lucide-react';

interface QuickActionGridProps {
  onSelectAction: (actionKey: string) => void;
}

export function QuickActionGrid({ onSelectAction }: QuickActionGridProps) {
  const actions = [
    { key: 'quick-log', label: 'अंडी नोंदणी', sub: 'गोळा झालेली अंडी', icon: Egg, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
    { key: 'sales', label: 'अंडी विक्री', sub: 'नवीन चलन / बिल', icon: CircleDollarSign, color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40' },
    { key: 'expenses', label: 'खर्च नोंद', sub: 'रोख व बँक खर्च', icon: Receipt, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
    { key: 'health', label: 'लसीकरण', sub: 'वेळापत्रक व औषध', icon: HeartPulse, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
    { key: 'market-rates', label: 'बाजार भाव', sub: 'पुणे, मुंबई, नाशिक', icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' },
    { key: 'mortality', label: 'मृत्यू नोंद', sub: 'कारण व प्रमाण', icon: Skull, color: 'text-red-600 bg-red-50 dark:bg-red-950/40' },
    { key: 'feed', label: 'खुराक वाटप', sub: 'साठा व वापर', icon: Wheat, color: 'text-emerald-800 bg-emerald-100/60 dark:bg-emerald-950/60' },
    { key: 'reports', label: 'दैनिक अहवाल', sub: 'WhatsApp शेअर', icon: Share2, color: 'text-green-700 bg-green-50 dark:bg-green-950/40' },
  ];

  return (
    <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] shadow-xs">
      <div className="pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
        <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
          झटपट कृती पॅनल (Quick Actions)
        </h3>
        <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
          एका क्लिकवर संबंधित नोंद उघडा
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {actions.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onSelectAction(item.key)}
              className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] hover:border-[#1F4D3A] dark:hover:border-[#3BA378] text-left flex items-start gap-3 transition-all hover:shadow-xs active:scale-95 touch-target"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-[#0B1E15] dark:text-white truncate">
                  {item.label}
                </div>
                <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium truncate mt-0.5">
                  {item.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
