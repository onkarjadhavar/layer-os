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
    { key: 'quick-log', label: 'अंडी नोंदणी', sub: 'गोळा झालेली अंडी', icon: Egg, iconColor: 'text-[#C9A23C]', bg: 'bg-[#FFF8DC] dark:bg-[#3D3416]' },
    { key: 'sales', label: 'अंडी विक्री', sub: 'नवीन चलन / बिल', icon: CircleDollarSign, iconColor: 'text-[#1A6B4A]', bg: 'bg-[#E8F5EE] dark:bg-[#0F2E21]' },
    { key: 'expenses', label: 'खर्च नोंद', sub: 'रोख व बँक खर्च', icon: Receipt, iconColor: 'text-[#2A6490]', bg: 'bg-[#EDF5FA] dark:bg-[#112838]' },
    { key: 'health', label: 'लसीकरण', sub: 'वेळापत्रक व औषध', icon: HeartPulse, iconColor: 'text-[#A63229]', bg: 'bg-[#FBF0EF] dark:bg-[#2E1412]' },
    { key: 'market-rates', label: 'बाजार भाव', sub: 'पुणे, मुंबई, नाशिक', icon: TrendingUp, iconColor: 'text-[#013E37]', bg: 'bg-[#E8F3F1] dark:bg-[#0C2B26]' },
    { key: 'mortality', label: 'मृत्यू नोंद', sub: 'कारण व प्रमाण', icon: Skull, iconColor: 'text-[#A63229]', bg: 'bg-[#FBF0EF] dark:bg-[#2E1412]' },
    { key: 'feed', label: 'खुराक वाटप', sub: 'साठा व वापर', icon: Wheat, iconColor: 'text-[#013E37]', bg: 'bg-[#E8F3F1] dark:bg-[#0C2B26]' },
    { key: 'reports', label: 'दैनिक अहवाल', sub: 'WhatsApp शेअर', icon: Share2, iconColor: 'text-[#1A6B4A]', bg: 'bg-[#E8F5EE] dark:bg-[#0F2E21]' },
  ];

  return (
    <div className="card-layer p-5 border border-[#E8E4DA] dark:border-[#1E3F36] bg-white dark:bg-[#122A23]">
      <div className="pb-3.5 border-b border-[#E8E4DA] dark:border-[#1E3F36]">
        <h3 className="text-sm font-bold text-[#0C1F1A] dark:text-white">
          झटपट कृती पॅनल (Quick Actions)
        </h3>
        <p className="text-xs font-normal text-[#6B8A7F] dark:text-[#6E9487] mt-0.5">
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
              className="p-3.5 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36] hover:border-[#013E37] dark:hover:border-[#3DAE7E] text-left flex items-start gap-3 transition-all hover:shadow-sm active:scale-[0.98] touch-target"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                <Icon className={`w-[18px] h-[18px] ${item.iconColor}`} />
              </div>
              <div className="min-w-0 pt-0.5">
                <div className="text-xs font-bold text-[#0C1F1A] dark:text-white truncate">
                  {item.label}
                </div>
                <div className="text-[11px] text-[#6B8A7F] dark:text-[#6E9487] font-normal truncate mt-0.5">
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
