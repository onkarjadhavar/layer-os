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
  Sparkles,
  Building2,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface MobileMoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
}

export function MobileMoreDrawer({ isOpen, onClose, onSelectTab }: MobileMoreDrawerProps) {
  const { t } = useI18n();
  const { farm, flock, user, isDemoMode, resetDemoData, logout } = useLayerOS();

  if (!isOpen) return null;

  const items: Array<{
    id: NavTab;
    title: string;
    sub: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    badge?: string;
  }> = [
    {
      id: 'flocks',
      title: t.navFlocks,
      sub: 'बॅचेस, शेड व पक्षी संख्या',
      icon: Layers,
      color: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      id: 'expenses',
      title: t.navExpenses,
      sub: 'खुराक, औषधे व इतर खर्च',
      icon: Receipt,
      color: 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      id: 'health',
      title: t.navHealth,
      sub: 'लसींचे वेळापत्रक व औषधे',
      icon: HeartPulse,
      color: 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
    },
    {
      id: 'market-rates',
      title: t.navMarketRates,
      sub: 'पुणे, मुंबई व नाशिक दर',
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    },
    {
      id: 'forecast',
      title: t.navForecast,
      sub: '३० दिवसांचा नफा अंदाज',
      icon: LineChart,
      color: 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
      badge: 'AI',
    },
    {
      id: 'full-entry',
      title: t.fullEntryTitle,
      sub: 'सविस्तर २-मिनिट नोंद',
      icon: ClipboardList,
      color: 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300',
    },
    {
      id: 'public-tools',
      title: 'मोफत कॅल्क्युलेटर',
      sub: 'FCR, ब्रेक-इव्हन व खुराक',
      icon: HelpCircle,
      color: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300',
    },
    {
      id: 'settings',
      title: t.navSettings,
      sub: 'युनिट्स, भाषा व बॅकअप',
      icon: Settings,
      color: 'bg-slate-50 text-slate-800 dark:bg-slate-900/60 dark:text-slate-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#103528]/95 rounded-t-3xl p-5 border-t border-[var(--color-border)] dark:border-[#263B30] max-h-[88vh] overflow-y-auto pb-safe shadow-2xl">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-[var(--color-border)] dark:bg-[#2C4435] rounded-full mx-auto mb-4" />

        {/* Header with Farm Overview */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] dark:border-[#263B30]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#194B38] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Building2 className="w-5 h-5 text-[#87A96B]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17251D] dark:text-white">
                {farm.name}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] dark:text-[#E8EFE2]/70 font-medium mt-0.5 tabular-nums">
                {flock.batchCode} • {flock.currentBirdCount.toLocaleString('en-IN')} {t.birds} • <span className="capitalize">{user?.role}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1F3027] text-gray-500 touch-target flex items-center justify-center cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Module Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-4">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-[var(--color-background)] dark:bg-[#103528]/40 border border-[var(--color-border)] dark:border-[#2C4435] text-left flex items-center justify-between hover:border-[#194B38] dark:hover:border-[#87A96B] active:scale-[0.98] transition-all touch-target cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#17251D] dark:text-white truncate">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-[#D5811F] text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] dark:text-[#E8EFE2]/70 font-medium truncate mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A1B3AA] flex-shrink-0 ml-1" />
              </button>
            );
          })}
        </div>

        {/* Demo Data Reset option */}
        {isDemoMode && (
          <div className="pt-3 border-t border-[var(--color-border)] dark:border-[#263B30]">
            <button
              type="button"
              onClick={() => {
                resetDemoData();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#F6E5C9]/60 dark:bg-[#D5811F]/20 border border-[#D5811F]/30 text-[#5A3E2B] dark:text-[#F6E5C9] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#F6E5C9] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#D5811F]" />
              <span>{t.resetDemoData}</span>
            </button>
          </div>
        )}

        {/* Logout Action */}
        <div className="pt-3 border-t border-[var(--color-border)] dark:border-[#263B30] mt-3">
          <button
            type="button"
            id="mobile-btn-logout"
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="w-full py-3 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>लॉगआउट (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
