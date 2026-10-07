'use client';

import React from 'react';
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
  AlertTriangle,
  Flame,
} from 'lucide-react';

interface KPIGridProps {
  onDrillDown?: (kpiKey: string) => void;
}

export function KPIGrid({ onDrillDown }: KPIGridProps) {
  const { todayRecord, yesterdayRecord, flock, customers } = useLayerOS();
  const { t } = useI18n();

  if (!todayRecord) return null;

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

  return (
    <div className="space-y-4">
      {/* 3-Second Owner Status Banner: Am I making or losing money today? */}
      <div className={`p-4 md:p-5 rounded-2xl border transition-all shadow-md ${
        todayRecord.breakEvenEggPrice <= todayRecord.sellingPricePerEgg
          ? 'bg-gradient-to-r from-emerald-900 to-[#1F4D3A] text-white border-emerald-600/40'
          : 'bg-gradient-to-r from-red-900 to-[#B3382C] text-white border-red-500'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-2xl">
              {todayRecord.breakEvenEggPrice <= todayRecord.sellingPricePerEgg ? '✓' : '!'}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-extrabold text-emerald-200">
                आजचा आर्थिक निर्णय (Daily Financial Status)
              </div>
              <h2 className="text-xl md:text-2xl font-black">
                {todayRecord.breakEvenEggPrice <= todayRecord.sellingPricePerEgg
                  ? 'तुम्ही आज सुरक्षित नफ्यात आहात!'
                  : 'लक्ष द्या: आज विक्री दरावर ताण आहे!'}
              </h2>
              <p className="text-xs text-white/90 mt-0.5">
                ब्रेक-इव्हन दर: <span className="font-bold underline">₹{todayRecord.breakEvenEggPrice}/अंडे</span> (₹{Math.round(todayRecord.breakEvenEggPrice * 100)}/१००) • विक्री दर: <span className="font-bold">₹{todayRecord.sellingPricePerEgg}</span> • मार्जिन: <span className="font-bold text-emerald-300">₹{marginPerEgg >= 0 ? `+${marginPerEgg}` : marginPerEgg}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
            <div className="text-right">
              <div className="text-[10px] text-white/70 font-semibold">आजचा थेट नफा (Cash)</div>
              <div className="text-lg font-black text-emerald-300">
                {formatIndianCurrency(todayRecord.simpleOperatingProfit)}
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 mx-2" />
            <div className="text-right">
              <div className="text-[10px] text-white/70 font-semibold">खरा नफा (True Profit)</div>
              <div className="text-lg font-black text-amber-300">
                {formatIndianCurrency(todayRecord.trueProfit)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (12 Strategic Metric Tiles) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Active Birds */}
        <div
          onClick={() => onDrillDown && onDrillDown('birds')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.activeBirds}</span>
            <Bird className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white mt-1.5 tracking-tight">
            {formatIndianNumber(todayRecord.closingBirds)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-red-400 mt-1">
            <span>−{todayRecord.mortality} आज मृत</span>
            <span className="text-[#4D6558] dark:text-[#CBDCD4] font-medium">• {flock.ageWeeks} आठवडे</span>
          </div>
        </div>

        {/* 2. Eggs Today */}
        <div
          onClick={() => onDrillDown && onDrillDown('eggs')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.eggsToday}</span>
            <Egg className="w-4 h-4 text-[#D9A441]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white mt-1.5 tracking-tight">
            {formatIndianNumber(todayRecord.totalEggsCollected)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold mt-1">
            <span className={eggDelta >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}>
              {eggDelta >= 0 ? `+${eggDelta}` : eggDelta} कालच्या तुलनेत
            </span>
            <span className="text-[#4D6558] dark:text-[#CBDCD4] font-medium">• {Math.floor(todayRecord.totalEggsCollected / 30)} ट्रे</span>
          </div>
        </div>

        {/* 3. HD% (Hen-Day) */}
        <div
          onClick={() => onDrillDown && onDrillDown('production')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.hdPercentage}</span>
            <Percent className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1F4D3A] dark:text-[#42BF87] mt-1.5 tracking-tight">
            {todayRecord.hdPct}%
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#4D6558] dark:text-[#CBDCD4] mt-1">
            <span>मानक: ९१.५%</span>
            <span className={hdDelta >= 0 ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-amber-700 dark:text-amber-400 font-bold'}>
              ({hdDelta >= 0 ? `+${hdDelta}%` : `${hdDelta}%`})
            </span>
          </div>
        </div>

        {/* 4. Feed Used & Per Bird */}
        <div
          onClick={() => onDrillDown && onDrillDown('feed')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.feedUsed}</span>
            <Wheat className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white mt-1.5 tracking-tight">
            {formatIndianNumber(todayRecord.feedIssuedKg)} <span className="text-xs font-bold text-[#4D6558] dark:text-[#CBDCD4]">kg</span>
          </div>
          <div className="text-[11px] font-bold text-[#1F4D3A] dark:text-[#42BF87] mt-1">
            {todayRecord.feedPerBirdG} g / पक्षी (टार्गेट: ११०g)
          </div>
        </div>

        {/* 5. Feed Recommendation Tomorrow */}
        <div
          onClick={() => onDrillDown && onDrillDown('feed')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-[#FCF6E9]/60 dark:bg-[#2E2413]/40 border-2 border-[#D9A441]/50 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#B07B18] dark:text-[#E5B252] font-black">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {t.feedRecommendedTomorrow}
            </span>
            <Wheat className="w-4 h-4 text-[#D9A441]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#B07B18] dark:text-[#E5B252] mt-1.5 tracking-tight">
            ३,३१० <span className="text-xs font-bold text-[#4D6558] dark:text-[#CBDCD4]">kg</span>
          </div>
          <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-semibold mt-1">
            ६६ पोती • हवामान व वजनानुसार
          </div>
        </div>

        {/* 6. Mortality Rate */}
        <div
          onClick={() => onDrillDown && onDrillDown('mortality')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.mortality}</span>
            <Skull className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-400 mt-1.5 tracking-tight">
            {todayRecord.mortality} <span className="text-xs font-bold text-[#4D6558] dark:text-[#CBDCD4]">पक्षी</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            ०.०५% (दैनिक मर्यादेत ✓)
          </div>
        </div>

        {/* 7. Total Daily Revenue */}
        <div
          onClick={() => onDrillDown && onDrillDown('sales')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.revenueToday}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1.5 tracking-tight">
            {formatIndianCurrency(Math.round(todayRecord.totalEggsCollected * todayRecord.sellingPricePerEgg + (todayRecord.otherIncome || 0)))}
          </div>
          <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-semibold mt-1">
            अंडी + रिकामी पोती + खत
          </div>
        </div>

        {/* 8. Daily Feed Cost */}
        <div
          onClick={() => onDrillDown && onDrillDown('expenses')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.feedCostToday}</span>
            <Receipt className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white mt-1.5 tracking-tight">
            {formatIndianCurrency(Math.round(todayRecord.feedIssuedKg * todayRecord.feedPricePerKg))}
          </div>
          <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-semibold mt-1">
            ₹३५.०० प्रति किलो दर
          </div>
        </div>

        {/* 9. Cost per Egg vs Selling Rate */}
        <div
          onClick={() => onDrillDown && onDrillDown('breakeven')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.costPerEgg}</span>
            <Scale className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white mt-1.5 tracking-tight">
            ₹{todayRecord.costPerEgg} <span className="text-xs font-medium text-[#4D6558] dark:text-[#CBDCD4]">/ अंडे</span>
          </div>
          <div className="text-[11px] text-[#1F4D3A] dark:text-[#42BF87] font-bold mt-1">
            विक्री: ₹{todayRecord.sellingPricePerEgg} • मार्जिन: ₹{(todayRecord.sellingPricePerEgg - todayRecord.costPerEgg).toFixed(2)}
          </div>
        </div>

        {/* 10. Break-Even Price */}
        <div
          onClick={() => onDrillDown && onDrillDown('breakeven')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#16241D] border-2 border-amber-300 dark:border-amber-700/60 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#B07B18] dark:text-[#E5B252] font-black">
            <span>{t.breakEvenPrice}</span>
            <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white mt-1.5 tracking-tight">
            ₹{todayRecord.breakEvenEggPrice} <span className="text-xs font-medium text-[#4D6558] dark:text-[#CBDCD4]">/ अंडे</span>
          </div>
          <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-semibold mt-1">
            ₹{Math.round(todayRecord.breakEvenEggPrice * 100)} / १०० अंडी
          </div>
        </div>

        {/* 11. Cash / Bank Balance */}
        <div
          onClick={() => onDrillDown && onDrillDown('accounts')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.cashBalance}</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1F4D3A] dark:text-[#42BF87] mt-1.5 tracking-tight">
            {formatIndianCurrency(428500)}
          </div>
          <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-semibold mt-1">
            बँक: ₹३.६L • कॅश: ₹६८,५००
          </div>
        </div>

        {/* 12. Receivables Outstanding */}
        <div
          onClick={() => onDrillDown && onDrillDown('receivables')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.outstandingReceivables}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-400 mt-1.5 tracking-tight">
            {formatIndianCurrency(totalOutstanding)}
          </div>
          <div className="text-[11px] font-bold text-red-600 dark:text-red-400 mt-1">
            १५ ग्राहक • ₹६०,००० थकीत (२१+ दिवस)
          </div>
        </div>
      </div>
    </div>
  );
}
