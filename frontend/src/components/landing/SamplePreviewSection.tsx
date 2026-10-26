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
import { CheckCircle2, TrendingUp, Sparkles, Scale, Bird, Egg, Wheat } from 'lucide-react';

export function SamplePreviewSection() {
  const { t } = useI18n();

  // Deterministic 30,000 birds reference day benchmark fixture
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
    <section className="py-14 sm:py-20 px-4 bg-[var(--color-background)] dark:bg-[#0E1713] transition-colors border-b border-[var(--color-border)] dark:border-[#23372E]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-main)] dark:text-white mb-2 tracking-tight">
            प्रत्यक्ष फार्मचे अचूक गणित: ३ सेकंदांत ताळेबंद
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] dark:text-[#9BAEA4] font-medium">
            {t.sampleNote}
          </p>
        </div>

        {/* The Benchmark Preview Card */}
        <div className="bg-[var(--color-surface)] dark:bg-[#14221C] rounded-2xl p-6 sm:p-8 border border-[var(--color-border)] dark:border-[#23372E] shadow-sm max-w-4xl mx-auto space-y-6">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[var(--color-border)] dark:border-[#23372E]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-lg font-black text-[var(--color-text-main)] dark:text-white">
                  सह्याद्री लेयर फार्म (Sahyadri Layer Farm)
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[var(--color-sage-pale)] text-[var(--color-forest)] dark:bg-[#1A2E24] dark:text-[var(--color-sage)] border border-[var(--color-sage)]/30">
                  {t.samplePreviewBadge}
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-muted)] dark:text-[#9BAEA4] mt-0.5 block">
                {formatIndianNumber(openingBirds)} पक्षी | वय: ३४ आठवडे | जात: BV300 | शेड: Elevated Cage
              </span>
            </div>

            {/* Break-Even Signal */}
            <div className="flex items-center gap-2 bg-[var(--color-background)] dark:bg-[#0E1713] px-3.5 py-2 rounded-xl border border-[var(--color-border)] dark:border-[#23372E]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] animate-pulse" />
              <div className="text-xs">
                <span className="text-[var(--color-text-muted)]">ब्रेक-इव्हन भाव: </span>
                <span className="font-black tabular-nums text-[var(--color-text-main)] dark:text-white">
                  ₹{metrics.breakEvenEggPrice}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Primary Operational Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 rounded-xl bg-[var(--color-background)] dark:bg-[#192B23] border border-[var(--color-border)] dark:border-[#23372E]">
              <div className="text-xs text-[var(--color-text-muted)] font-medium flex items-center gap-1.5">
                <Egg className="w-3.5 h-3.5 text-[var(--color-amber)]" />
                <span>एकूण अंडी</span>
              </div>
              <div className="text-xl font-black tabular-nums text-[var(--color-text-main)] dark:text-white mt-1">
                {formatIndianNumber(eggsCollected)}
              </div>
              <div className="text-[11px] text-[var(--color-success)] font-semibold mt-0.5">
                {metrics.hdPct}% Laying HD
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--color-background)] dark:bg-[#192B23] border border-[var(--color-border)] dark:border-[#23372E]">
              <div className="text-xs text-[var(--color-text-muted)] font-medium flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5 text-[var(--color-walnut)] dark:text-[var(--color-amber)]" />
                <span>खाद्य वापर</span>
              </div>
              <div className="text-xl font-black tabular-nums text-[var(--color-text-main)] dark:text-white mt-1">
                {formatIndianNumber(feedKg)}{' '}
                <span className="text-xs font-normal">कि.ग्रा.</span>
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)] font-medium mt-0.5">
                {metrics.feedPerBirdG} ग्रॅम / पक्षी (६६ पोती)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--color-background)] dark:bg-[#192B23] border border-[var(--color-border)] dark:border-[#23372E]">
              <div className="text-xs text-[var(--color-text-muted)] font-medium flex items-center gap-1.5">
                <Bird className="w-3.5 h-3.5 text-[var(--color-error)]" />
                <span>मृत्यू (Mortality)</span>
              </div>
              <div className="text-xl font-black tabular-nums text-[var(--color-text-main)] dark:text-white mt-1">
                {mortality} <span className="text-xs font-normal">पक्षी</span>
              </div>
              <div className="text-[11px] text-[var(--color-success)] font-semibold mt-0.5">
                ०.०५% (नियंत्रणात)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--color-background)] dark:bg-[#192B23] border border-[var(--color-border)] dark:border-[#23372E]">
              <div className="text-xs text-[var(--color-text-muted)] font-medium flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
                <span>बाजार विक्री भाव</span>
              </div>
              <div className="text-xl font-black tabular-nums text-[var(--color-text-main)] dark:text-white mt-1">
                ₹{sellingPricePerEgg.toFixed(2)}
              </div>
              <div className="text-[11px] text-[var(--color-success)] font-semibold mt-0.5">
                +₹{(sellingPricePerEgg - metrics.breakEvenEggPrice).toFixed(2)} मार्जिन
              </div>
            </div>
          </div>

          {/* Financial Breakdown: Operating Cash vs True Net Profit */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#192B23] border border-[var(--color-border)] dark:border-[#23372E] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wide">
                दैनिक रोख नफा (Operating Cash Flow)
              </div>
              <div className="text-2xl font-black tabular-nums text-[var(--color-forest)] dark:text-[var(--color-sage)] mt-1">
                {formatIndianCurrency(metrics.simpleOperatingProfit)}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                अंडी विक्री (₹१,४७,४२०) वजा खाद्य (₹१,१५,५००) आणि इतर रोख खर्च (₹१२,०००).
              </p>
            </div>

            <div className="sm:border-l sm:border-[var(--color-border)] sm:pl-4">
              <div className="text-xs font-bold text-[var(--color-walnut)] dark:text-[var(--color-amber)] uppercase tracking-wide">
                खरा निव्वळ नफा (True Net Profit - घसार्‍यासह)
              </div>
              <div className="text-2xl font-black tabular-nums text-[var(--color-walnut)] dark:text-[var(--color-amber)] mt-1">
                {formatIndianCurrency(metrics.trueProfit)}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                पिल्ले घसारा (₹४,५००), शेड भांडवल (₹१,५००), वीज, मजुरी व बँक व्याज हिशोबात धरून.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default SamplePreviewSection;
