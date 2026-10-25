'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  calculateDailyMetrics,
  calculateClosingBirds,
  formatIndianCurrency,
  formatIndianNumber,
  DEFAULT_UNIT_SETTINGS,
} from '@/lib/calc';
import { CheckCircle2, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';

export function SamplePreviewSection() {
  const { t } = useI18n();

  // Pull numbers deterministically using the verified reference fixture from lib/calc
  const openingBirds = 30000;
  const mortality = 15;
  const eggsCollected = 27300;
  const feedKg = 3300;
  const feedPricePerKg = 35.0;
  const sellingPricePerEgg = 5.40;
  const otherCashExpenses = 12000;

  const closingBirds = calculateClosingBirds(openingBirds, mortality);

  const metrics = calculateDailyMetrics({
    openingBirds,
    mortality,
    eggsCollected,
    feedKg,
    feedPricePerKg,
    sellingPricePerEgg,
    otherCashExpenses,
    allocatedOverheads: {
      labourDaily: 3500,
      electricityDaily: 1200,
      medicineDaily: 1500,
      pulletAmortizationDaily: 4500,
      shedDepreciationDaily: 1500,
      loanInterestDaily: 1800,
      mortalityLossDaily: 600,
    },
  }, DEFAULT_UNIT_SETTINGS);

  return (
    <section className="py-12 sm:py-20 px-4 bg-[#FAF8F3] dark:bg-[#0F1A15] transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#1F4D3A]/10 text-[#1F4D3A] dark:text-[#64D8A1]">
            {t.samplePreviewTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B1E15] dark:text-white mt-3 mb-2 tracking-tight">
            प्रत्यक्ष फार्मचे अचूक गणित: ३ सेकंदांत ताळेबंद
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A72] dark:text-[#A3B899] font-medium">
            {t.sampleNote}
          </p>
        </div>

        {/* The Benchmark Preview Card */}
        <div className="bg-white dark:bg-[#16241D] rounded-3xl p-6 sm:p-8 border-2 border-[#1F4D3A]/30 dark:border-[#3BA378]/30 shadow-xl max-w-4xl mx-auto">
          {/* Card Header with Verified Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#E7E2D6] dark:border-[#263B30]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-[#0B1E15] dark:text-white">
                  सह्याद्री लेयर फार्म (Sahyadri Layer Farm)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  {t.samplePreviewBadge}
                </span>
              </div>
              <span className="text-xs text-[#5A6E64] dark:text-[#A3B899]">
                {formatIndianNumber(openingBirds)} पक्षी | वय: ३४ आठवडे | जात: BV300
              </span>
            </div>

            {/* Break-Even Traffic Light Signal */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-right">
                <span className="block text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">
                  नफ्यात आहे (Safe Margin)
                </span>
                <span className="text-xs font-black text-[#1B2A24] dark:text-white">
                  विक्री भाव: {formatIndianCurrency(sellingPricePerEgg, true)} &gt; ब्रेक-इव्हन: {formatIndianCurrency(metrics.breakEvenEggPrice, true)}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
            <div className="bg-[#FAF8F3] dark:bg-[#0F1A15] p-4 rounded-2xl border border-[#E7E2D6] dark:border-[#263B30]">
              <span className="text-xs font-bold text-[#6B7A72] dark:text-[#CBDCD4] block mb-1">
                अंडी उत्पादन (Eggs)
              </span>
              <span className="text-lg sm:text-2xl font-black text-[#0B1E15] dark:text-white block">
                {formatIndianNumber(eggsCollected)}
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                HD: {Number(metrics.hdPct).toFixed(1)}%
              </span>
            </div>

            <div className="bg-[#FAF8F3] dark:bg-[#0F1A15] p-4 rounded-2xl border border-[#E7E2D6] dark:border-[#263B30]">
              <span className="text-xs font-bold text-[#6B7A72] dark:text-[#CBDCD4] block mb-1">
                खुराक वापर (Feed)
              </span>
              <span className="text-lg sm:text-2xl font-black text-[#0B1E15] dark:text-white block">
                {formatIndianNumber(feedKg)} कि.ग्रा.
              </span>
              <span className="text-[11px] font-bold text-blue-600">
                {metrics.feedPerBirdG} g / पक्षी
              </span>
            </div>

            <div className="bg-[#FAF8F3] dark:bg-[#0F1A15] p-4 rounded-2xl border border-[#E7E2D6] dark:border-[#263B30]">
              <span className="text-xs font-bold text-[#6B7A72] dark:text-[#CBDCD4] block mb-1">
                मृत्यू (Mortality)
              </span>
              <span className="text-lg sm:text-2xl font-black text-[#0B1E15] dark:text-white block">
                {mortality} पक्षी
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                {metrics.mortalityPct}% (सुरक्षित)
              </span>
            </div>

            <div className="bg-[#FAF8F3] dark:bg-[#0F1A15] p-4 rounded-2xl border border-[#E7E2D6] dark:border-[#263B30]">
              <span className="text-xs font-bold text-[#6B7A72] dark:text-[#CBDCD4] block mb-1">
                रोख नफा (Operating Profit)
              </span>
              <span className="text-lg sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                {formatIndianCurrency(metrics.simpleOperatingProfit)}
              </span>
              <span className="text-[11px] font-bold text-[#5A6E64] dark:text-[#CBDCD4]">
                खरा नफा: {formatIndianCurrency(metrics.trueProfit)}
              </span>
            </div>
          </div>

          {/* Breakdown Summary footer */}
          <div className="pt-4 border-t border-[#E7E2D6] dark:border-[#263B30] flex flex-wrap items-center justify-between gap-3 text-xs text-[#5A6E64] dark:text-[#CBDCD4]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>अंडी विक्री महसूल: {formatIndianCurrency(metrics.eggSalesRevenue)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>खुराक खर्च: {formatIndianCurrency(metrics.feedCost)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>इतर खर्च: {formatIndianCurrency(otherCashExpenses)}</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[#1F4D3A] dark:text-[#D9A441]">
              <span>प्रति अंडे उत्पादन खर्च: {formatIndianCurrency(metrics.operatingCostPerEgg, true)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
