'use client';

import React from 'react';
import { NavTab } from './Sidebar';
import { useI18n } from '@/lib/i18n/context';
import { useLayerOS } from '@/lib/store';
import {
  X,
  ClipboardList,
  Layers,
  Receipt,
  HeartPulse,
  TrendingUp,
  LineChart,
  HelpCircle,
  Settings,
  RotateCcw,
} from 'lucide-react';

interface MobileMoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
}

export function MobileMoreDrawer({ isOpen, onClose, onSelectTab }: MobileMoreDrawerProps) {
  const { t } = useI18n();
  const { isDemoMode, resetDemoData } = useLayerOS();

  if (!isOpen) return null;

  const items: Array<{ id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }> = [
    { id: 'full-entry', label: t.fullEntryTitle, icon: ClipboardList },
    { id: 'flocks', label: t.navFlocks, icon: Layers },
    { id: 'expenses', label: t.navExpenses, icon: Receipt },
    { id: 'health', label: t.navHealth, icon: HeartPulse },
    { id: 'market-rates', label: t.navMarketRates, icon: TrendingUp },
    { id: 'forecast', label: t.navForecast, icon: LineChart, badge: "AI" },
    { id: 'public-tools', label: "मोफत कॅल्क्युलेटर (Tools)", icon: HelpCircle },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm lg:hidden">
      <div className="bg-white dark:bg-[#16241D] rounded-t-3xl p-5 border-t border-[#E7E2D6] dark:border-[#263B30] max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E7E2D6] dark:border-[#263B30]">
          <div>
            <h2 className="text-lg font-black text-[#0B1E15] dark:text-white">
              सर्व मॉड्यूल्स (All Modules)
            </h2>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-0.5">
              आपल्या पोल्ट्री व्यवस्थापनाचे संपूर्ण पर्याय
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1F3027] text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-4">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] text-left flex flex-col justify-between hover:border-[#1F4D3A] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF3EF] dark:bg-[#182B22] text-[#1F4D3A] dark:text-[#3BA378] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-[#D9A441] text-[#0B1E15]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-black text-[#0B1E15] dark:text-white line-clamp-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Reset Demo Button */}
        {isDemoMode && (
          <div className="pt-2 border-t border-[#E7E2D6] dark:border-[#263B30]">
            <button
              onClick={() => {
                resetDemoData();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 border border-amber-300 text-xs font-black"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.resetDemoData}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
