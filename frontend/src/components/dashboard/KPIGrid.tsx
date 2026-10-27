'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calc';
import {
  Bird,
  Egg,
  Percent,
  Wheat,
  Skull,
  TrendingUp,
  Receipt,
  Scale,
  Wallet,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface KPIGridProps {
  onDrillDown?: (kpiKey: string) => void;
}

export function KPIGrid({ onDrillDown }: KPIGridProps) {
  const { todayRecord, yesterdayRecord, flock, customers } = useLayerOS();
  const { t } = useI18n();
  const [showDetailedKPIs, setShowDetailedKPIs] = useState(false);

  if (!todayRecord) {
    return (
      <div className="space-y-3.5">
        <div className="p-5 rounded-3xl border border-[#1F4D3A]/30 bg-gradient-to-br from-[#123826] to-[#1F4D3A] text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center font-black text-2xl flex-shrink-0">
                🐣
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-200">
                  पोल्ट्री ऑपरेटिंग सिस्टीम सज्ज आहे
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  आजची पहिली नोंद प्रलंबित आहे (Entry Pending)
                </h2>
                <p className="text-xs text-white/90 mt-1">
                  नोंदणीकृत जिवंत पक्षी: <span className="font-bold underline">{formatIndianNumber(flock.currentBirdCount || 0)}</span> • दैनंदिन आलेख आणि अहवाल पाहण्यासाठी आजचे अंडी, खुराक व मृत्यू नोंदवा.
                </p>
              </div>
            </div>

            <button
              onClick={() => onDrillDown?.('entry')}
              className="py-3 px-5 rounded-2xl bg-[#D9A441] hover:bg-[#C29035] text-[#0B1E15] font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 self-stretch sm:self-auto"
            >
              <span>+ आजची पहिली नोंद करा</span>
            </button>
          </div>
        </div>

        {/* Clean Initial Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
            <span className="text-xs font-bold text-[#6B7280] dark:text-gray-400">जिवंत पक्षी (Live Birds)</span>
            <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
              {formatIndianNumber(flock.currentBirdCount || 0)}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">नोंदणीनुसार सज्ज</span>
          </div>

          <div className="p-4 rounded-2xl border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
            <span className="text-xs font-bold text-[#6B7280] dark:text-gray-400">आजची अंडी (Today Eggs)</span>
            <div className="text-base sm:text-lg font-black text-amber-600 mt-1">
              नोंद प्रलंबित
            </div>
            <span className="text-[10px] text-gray-400">नोंद केल्यानंतर दिसेल</span>
          </div>

          <div className="p-4 rounded-2xl border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
            <span className="text-xs font-bold text-[#6B7280] dark:text-gray-400">वापरलेला खुराक (Feed)</span>
            <div className="text-base sm:text-lg font-black text-amber-600 mt-1">
              नोंद प्रलंबित
            </div>
            <span className="text-[10px] text-gray-400">नोंद केल्यानंतर दिसेल</span>
          </div>

          <div className="p-4 rounded-2xl border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
            <span className="text-xs font-bold text-[#6B7280] dark:text-gray-400">दैनिक नफा (Operating Profit)</span>
            <div className="text-base sm:text-lg font-black text-gray-400 mt-1">
              ₹०.००
            </div>
            <span className="text-[10px] text-gray-400">नोंद केल्यानंतर दिसेल</span>
          </div>
        </div>
      </div>
    );
  }

  // Outstanding sum
  const totalOutstanding = customers.reduce((sum, c) => sum + c.currentOutstanding, 0);

  // Deltas vs yesterday
  const eggDelta = yesterdayRecord
    ? todayRecord.totalEggsCollected - yesterdayRecord.totalEggsCollected
    : 0;
  const hdDelta = yesterdayRecord
    ? Number((todayRecord.hdPct - yesterdayRecord.hdPct).toFixed(2))
    : 0;

  // Margin calculation
  const marginPerEgg = Number((todayRecord.sellingPricePerEgg - todayRecord.breakEvenEggPrice).toFixed(2));
  const isProfitable = todayRecord.breakEvenEggPrice <= todayRecord.sellingPricePerEgg;

  return (
    <div className="space-y-3.5">
      {/* 1. 3-Second Farmer Pulse Banner: Am I in Profit or Loss Today? */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all shadow-md ${
          isProfitable
            ? 'bg-gradient-to-br from-[#123826] via-[#1F4D3A] to-[#173D2C] text-white border-emerald-500/40'
            : 'bg-gradient-to-br from-[#741F17] via-[#942C22] to-[#B3382C] text-white border-red-400'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-inner">
              {isProfitable ? '✓' : '!'}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-200">
                {t.financialDecisionTitle}
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                {isProfitable ? t.safeProfitStatusMsg : t.tightMarginWarningMsg}
              </h2>
              <p className="text-xs text-white/90 mt-1 leading-relaxed">
                {t.breakEvenRateLabel}: <span className="font-bold underline">₹{todayRecord.breakEvenEggPrice}</span> (₹{Math.round(todayRecord.breakEvenEggPrice * 100)}/१००) • {t.sellingRateLabel}: <span className="font-bold">₹{todayRecord.sellingPricePerEgg}</span> • {t.profitMarginLabel}: <span className="font-bold text-emerald-200">₹{marginPerEgg >= 0 ? `+${marginPerEgg}` : marginPerEgg}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/25 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-white/10 self-stretch sm:self-auto justify-between sm:justify-end">
            <div>
              <div className="text-[10px] text-white/80 font-bold uppercase">{t.dailyOperatingCashProfit}</div>
              <div className="text-xl font-black text-emerald-300">
                {formatIndianCurrency(todayRecord.simpleOperatingProfit)}
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 mx-1" />
            <div>
              <div className="text-[10px] text-white/80 font-bold uppercase">{t.dailyTrueNetProfit}</div>
              <div className="text-xl font-black text-amber-300">
                {formatIndianCurrency(todayRecord.trueProfit)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary 4 Farming Metrics (2x2 Grid - Mobile First) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
        {/* Metric 1: Eggs Today */}
        <div
          onClick={() => onDrillDown && onDrillDown('eggs')}
          className="card-layer card-layer-interactive p-3.5 sm:p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] rounded-2xl shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span className="truncate">{t.eggsToday}</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#D9A441] flex items-center justify-center flex-shrink-0">
              <Egg className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B1E15] dark:text-white mt-1 tracking-tight">
            {formatIndianNumber(todayRecord.totalEggsCollected)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold mt-1 truncate">
            <span className={eggDelta >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}>
              {eggDelta >= 0 ? `+${eggDelta}` : eggDelta} {t.vsYesterday}
            </span>
            <span className="text-[#55695F] dark:text-[#CBDCD4] font-medium">• {Math.floor(todayRecord.totalEggsCollected / 30)} {t.unitTray}</span>
          </div>
        </div>

        {/* Metric 2: Hen-Day HD% */}
        <div
          onClick={() => onDrillDown && onDrillDown('production')}
          className="card-layer card-layer-interactive p-3.5 sm:p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] rounded-2xl shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span className="truncate">{t.hdPercentage}</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#1F4D3A] dark:text-[#42BF87] flex items-center justify-center flex-shrink-0">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1F4D3A] dark:text-[#42BF87] mt-1 tracking-tight">
            {todayRecord.hdPct}%
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#55695F] dark:text-[#CBDCD4] mt-1 truncate">
            <span>{t.standardLabel}: 91.5%</span>
            <span className={hdDelta >= 0 ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-amber-700 dark:text-amber-400 font-bold'}>
              ({hdDelta >= 0 ? `+${hdDelta}%` : `${hdDelta}%`})
            </span>
          </div>
        </div>

        {/* Metric 3: Feed Used */}
        <div
          onClick={() => onDrillDown && onDrillDown('feed')}
          className="card-layer card-layer-interactive p-3.5 sm:p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] rounded-2xl shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span className="truncate">{t.feedUsed}</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B1E15] dark:text-white mt-1 tracking-tight">
            {formatIndianNumber(todayRecord.feedIssuedKg)} <span className="text-xs font-bold text-[#55695F] dark:text-[#CBDCD4]">kg</span>
          </div>
          <div className="text-[11px] font-bold text-[#1F4D3A] dark:text-[#42BF87] mt-1 truncate">
            {todayRecord.feedPerBirdG} g / {t.birds} ({Math.round(todayRecord.feedIssuedKg / 50)} पोती)
          </div>
        </div>

        {/* Metric 4: Active Birds */}
        <div
          onClick={() => onDrillDown && onDrillDown('birds')}
          className="card-layer card-layer-interactive p-3.5 sm:p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] rounded-2xl shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span className="truncate">{t.activeBirds}</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#1F4D3A] dark:text-[#42BF87] flex items-center justify-center flex-shrink-0">
              <Bird className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B1E15] dark:text-white mt-1 tracking-tight">
            {formatIndianNumber(todayRecord.closingBirds)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 mt-1 truncate">
            <span>−{todayRecord.mortality} {t.birdsDeadToday}</span>
            <span className="text-[#55695F] dark:text-[#CBDCD4] font-medium">• {flock.ageWeeks} {t.ageWeeksLabel}</span>
          </div>
        </div>
      </div>

      {/* 3. Expandable Detailed Metrics Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDetailedKPIs(!showDetailedKPIs)}
          className="w-full py-2.5 px-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] text-xs font-black text-[#1F4D3A] dark:text-[#42BF87] hover:bg-[#EAF3EF] dark:hover:bg-[#182B22] flex items-center justify-center gap-2 transition-colors touch-target"
        >
          <span>{showDetailedKPIs ? 'कमी तपशील दाखवा' : '📊 अधिक हिशोब व आकडेवारी पहा (८ अतिरिक्त बाबी)'}</span>
          {showDetailedKPIs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetailedKPIs && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mt-3 animate-in fade-in duration-200">
            {/* 5. Feed Recommended Tomorrow */}
            <div
              onClick={() => onDrillDown && onDrillDown('feed')}
              className="card-layer p-3.5 cursor-pointer bg-[#FCF6E9]/70 dark:bg-[#2E2413]/40 border border-[#D9A441]/50 rounded-2xl shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-[#B07B18] dark:text-[#E5B252] font-black">
                <span className="truncate flex items-center gap-1">
                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                  {t.feedRecommendedTomorrow}
                </span>
                <Wheat className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-[#B07B18] dark:text-[#E5B252] mt-1">
                3,310 <span className="text-xs font-bold text-[#55695F]">kg</span>
              </div>
              <div className="text-[11px] text-[#55695F] dark:text-[#CBDCD4] font-semibold mt-0.5">
                66 {t.unitGatta} (पोती)
              </div>
            </div>

            {/* 6. Mortality Rate */}
            <div
              onClick={() => onDrillDown && onDrillDown('mortality')}
              className="card-layer p-3.5 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] rounded-2xl shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
                <span className="truncate">{t.mortality}</span>
                <Skull className="w-3.5 h-3.5 text-red-500" />
              </div>
              <div className="text-xl font-black text-red-600 dark:text-red-400 mt-1">
                {todayRecord.mortality} <span className="text-xs font-bold text-[#55695F]">{t.birds}</span>
              </div>
              <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                0.05% ({t.withinDailyLimit})
              </div>
            </div>

            {/* 7. Total Daily Revenue */}
            <div
              onClick={() => onDrillDown && onDrillDown('sales')}
              className="card-layer p-3.5 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] rounded-2xl shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
                <span className="truncate">{t.revenueToday}</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                {formatIndianCurrency(Math.round(todayRecord.totalEggsCollected * todayRecord.sellingPricePerEgg + (todayRecord.otherIncome || 0)))}
              </div>
              <div className="text-[11px] text-[#55695F] dark:text-[#CBDCD4] font-semibold mt-0.5">
                {t.revenueBreakdownHint}
              </div>
            </div>

            {/* 8. Daily Feed Cost */}
            <div
              onClick={() => onDrillDown && onDrillDown('expenses')}
              className="card-layer p-3.5 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] rounded-2xl shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
                <span className="truncate">{t.feedCostToday}</span>
                <Receipt className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#3BA378]" />
              </div>
              <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
                {formatIndianCurrency(Math.round(todayRecord.feedIssuedKg * todayRecord.feedPricePerKg))}
              </div>
              <div className="text-[11px] text-[#55695F] dark:text-[#CBDCD4] font-semibold mt-0.5">
                {t.feedRatePerKgHint}
              </div>
            </div>

            {/* 9. Cost per Egg */}
            <div
              onClick={() => onDrillDown && onDrillDown('breakeven')}
              className="card-layer p-3.5 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] rounded-2xl shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
                <span className="truncate">{t.costPerEgg}</span>
                <Scale className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#3BA378]" />
              </div>
              <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
                ₹{todayRecord.costPerEgg} <span className="text-xs font-medium text-[#55695F]">/{t.unitEgg}</span>
              </div>
              <div className="text-[11px] text-[#1F4D3A] dark:text-[#42BF87] font-bold mt-0.5">
                {t.sellingRateLabel}: ₹{todayRecord.sellingPricePerEgg}
              </div>
            </div>

            {/* 10. Break-Even Price */}
            <div
              onClick={() => onDrillDown && onDrillDown('breakeven')}
              className="card-layer p-3.5 cursor-pointer bg-white dark:bg-[#16241D] border border-amber-300 dark:border-amber-700/60 rounded-2xl shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-[#B07B18] dark:text-[#E5B252] font-black">
                <span className="truncate">{t.breakEvenPrice}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#D9A441]" />
              </div>
              <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
                ₹{todayRecord.breakEvenEggPrice} <span className="text-xs font-medium text-[#55695F]">/{t.unitEgg}</span>
              </div>
              <div className="text-[11px] text-[#55695F] dark:text-[#CBDCD4] font-semibold mt-0.5">
                ₹{Math.round(todayRecord.breakEvenEggPrice * 100)} / 100
              </div>
            </div>

            {/* 11. Cash Balance */}
            <div
              onClick={() => onDrillDown && onDrillDown('accounts')}
              className="card-layer p-3.5 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] rounded-2xl shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
                <span className="truncate">{t.cashBalance}</span>
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-[#1F4D3A] dark:text-[#42BF87] mt-1">
                {formatIndianCurrency(428500)}
              </div>
              <div className="text-[11px] text-[#55695F] dark:text-[#CBDCD4] font-semibold mt-0.5">
                {t.bankAndCashSplit}
              </div>
            </div>

            {/* 12. Receivables */}
            <div
              onClick={() => onDrillDown && onDrillDown('receivables')}
              className="card-layer p-3.5 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] rounded-2xl shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
                <span className="truncate">{t.outstandingReceivables}</span>
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-xl font-black text-amber-800 dark:text-amber-400 mt-1">
                {formatIndianCurrency(totalOutstanding)}
              </div>
              <div className="text-[11px] font-bold text-red-600 dark:text-red-400 mt-0.5">
                {t.overdueDaysHint}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
