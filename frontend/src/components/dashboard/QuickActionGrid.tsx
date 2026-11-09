'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Egg,
  CircleDollarSign,
  Receipt,
  TrendingUp,
  Share2,
  HeartPulse,
  Skull,
} from 'lucide-react';

interface QuickActionGridProps {
  onSelectAction: (actionKey: string) => void;
}

export function QuickActionGrid({ onSelectAction }: QuickActionGridProps) {
  const { language } = useI18n();

  const primaryActions = [
    {
      key: 'quick-log',
      title:
        language === 'en'
          ? 'Daily Entry'
          : language === 'hi'
          ? 'दैनिक प्रविष्टि'
          : 'दैनिक नोंदणी',
      sub:
        language === 'en'
          ? 'Eggs, feed & mortality in 30s'
          : language === 'hi'
          ? 'अंडा, दाना व मृत्यु 30 सेकंड में'
          : 'अंडी, खुराक व मृत्यू ३० सेकंदात',
      icon: Egg,
      badge: language === 'en' ? '30s Log' : language === 'hi' ? '30s नोंद' : '३०s नोंद',
      iconBg: 'bg-[var(--color-forest)] text-white',
      badgeBg: 'bg-[var(--color-sage-pale)] text-[var(--color-forest)] dark:bg-[#1A3024] dark:text-[var(--color-sage)]',
    },
    {
      key: 'sales',
      title:
        language === 'en'
          ? 'Egg Sales Invoice'
          : language === 'hi'
          ? 'अंडा बिक्री बिल'
          : 'अंडी विक्री बिल',
      sub:
        language === 'en'
          ? 'New vehicle / trader slip'
          : language === 'hi'
          ? 'नई गाड़ी / व्यापारी पर्ची'
          : 'नवीन गाडी / व्यापारी पावती',
      icon: CircleDollarSign,
      badge: language === 'en' ? 'New Sale' : language === 'hi' ? 'नई बिक्री' : 'नवीन विक्री',
      iconBg: 'bg-[var(--color-amber)] text-[var(--color-forest-deep)]',
      badgeBg: 'bg-[var(--color-amber-soft)] text-[var(--color-walnut)] dark:bg-[#2A1E0D] dark:text-[var(--color-amber)]',
    },
    {
      key: 'expenses',
      title:
        language === 'en'
          ? 'Expense Record'
          : language === 'hi'
          ? 'खर्च प्रविष्टि'
          : 'खर्च नोंद',
      sub:
        language === 'en'
          ? 'Feed, medicines, wages, misc'
          : language === 'hi'
          ? 'दाना, दवा, मजदूरी व अन्य'
          : 'दाना, औषध, मजुरी व इतर',
      icon: Receipt,
      badge: language === 'en' ? 'Expenses' : language === 'hi' ? 'खर्च' : 'खर्च नोंद',
      iconBg: 'bg-[var(--color-walnut)] text-white dark:bg-[#8B6B54]',
      badgeBg: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]',
    },
    {
      key: 'market-rates',
      title:
        language === 'en'
          ? 'Mandi Rates'
          : language === 'hi'
          ? 'मंडी भाव'
          : 'बाजार भाव',
      sub:
        language === 'en'
          ? 'Pune, Mumbai, Sangli & Nashik'
          : language === 'hi'
          ? 'पुणे, मुंबई, सांगली व नासिक दर'
          : 'पुणे, मुंबई, सांगली व नाशिक दर',
      icon: TrendingUp,
      badge: language === 'en' ? 'Mandi Rates' : language === 'hi' ? 'मंडी दर' : 'बाजार भाव',
      iconBg: 'bg-[var(--color-surface-subtle)] text-[var(--color-forest)] dark:text-[var(--color-sage)]',
      badgeBg: 'bg-[var(--color-surface-subtle)] text-[var(--color-forest)] dark:text-[var(--color-sage)]',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-0.5">
        <div>
          <h3 className="text-sm font-bold text-[var(--color-text-main)]">
            {language === 'en'
              ? 'Quick Farm Actions'
              : language === 'hi'
              ? 'किसान त्वरित सेवाएं'
              : 'शेतकरी जलद सेवा (Quick Actions)'}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] font-medium">
            {language === 'en'
              ? 'Start key tasks in one tap'
              : language === 'hi'
              ? 'एक टैप में महत्वपूर्ण काम शुरू करें'
              : 'एका टॅपवर महत्त्वाचे काम सुरू करा'}
          </p>
        </div>
      </div>

      {/* 4 Big Tactile Action Cards (2x2 Grid on Mobile, 4 Cols on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {primaryActions.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              id={`quick-action-btn-${item.key}`}
              onClick={() => onSelectAction(item.key)}
              className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-sage)] text-left flex flex-col justify-between transition-all active:scale-[0.98] shadow-xs cursor-pointer min-h-[115px] group"
            >
              <div className="flex items-center justify-between mb-3 w-full">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105 ${item.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.badgeBg}`}>
                  {item.badge}
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--color-text-main)] leading-tight">
                  {item.title}
                </div>
                <div className="text-[11px] text-[var(--color-text-muted)] font-medium leading-tight mt-1 line-clamp-1">
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
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-forest)] text-xs font-semibold text-[var(--color-text-main)] whitespace-nowrap active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
          <span>
            {language === 'en'
              ? 'WhatsApp Daily Report'
              : language === 'hi'
              ? 'WhatsApp दैनिक रिपोर्ट'
              : 'WhatsApp दैनिक अहवाल'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAction('health')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-forest)] text-xs font-semibold text-[var(--color-text-main)] whitespace-nowrap active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <HeartPulse className="w-3.5 h-3.5 text-[var(--color-amber)]" />
          <span>
            {language === 'en'
              ? 'Vaccination Schedule'
              : language === 'hi'
              ? 'टीकाकरण समय सारणी'
              : 'लसीकरण वेळापत्रक'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAction('mortality')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-forest)] text-xs font-semibold text-[var(--color-text-main)] whitespace-nowrap active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <Skull className="w-3.5 h-3.5 text-[var(--color-error)]" />
          <span>
            {language === 'en'
              ? 'Mortality Log Details'
              : language === 'hi'
              ? 'मृत्यु विवरण'
              : 'मृत्यू नोंद तपशील'}
          </span>
        </button>
      </div>
    </div>
  );
}
export default QuickActionGrid;
