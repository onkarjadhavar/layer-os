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
  const isProfitable = todayRecord.breakEvenEggPrice <= todayRecord.sellingPricePerEgg;

  return (
    <div className="space-y-5">
      {/* 3-Second Owner Status Banner */}
      <div className={`p-4 md:p-5 rounded-2xl border transition-all ${
        isProfitable
          ? 'bg-[#013E37] text-white border-[#025E52]'
          : 'bg-[#A63229] text-white border-[#C44A40]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xl ${
              isProfitable ? 'bg-[#FFEFB3]/15 text-[#FFEFB3]' : 'bg-white/10 text-white'
            }`}>
              {isProfitable ? '✓' : '!'}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-semibold text-white/60 mb-0.5">
                आजचा आर्थिक निर्णय (Daily Financial Status)
              </div>
              <h2 className="text-lg md:text-xl font-bold leading-tight">
                {isProfitable
                  ? 'तुम्ही आज सुरक्षित नफ्यात आहात!'
                  : 'लक्ष द्या: आज विक्री दरावर ताण आहे!'}
              </h2>
              <p className="text-[11px] text-white/70 mt-1 font-medium">
                ब्रेक-इव्हन दर: <span className="font-semibold text-white/90">₹{todayRecord.breakEvenEggPrice}/अंडे</span> (₹{Math.round(todayRecord.breakEvenEggPrice * 100)}/१००) • विक्री दर: <span className="font-semibold text-white/90">₹{todayRecord.sellingPricePerEgg}</span> • मार्जिन: <span className={`font-bold ${isProfitable ? 'text-[#FFEFB3]' : 'text-white'}`}>₹{marginPerEgg >= 0 ? `+${marginPerEgg}` : marginPerEgg}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-white/[0.08] px-4 py-2.5 rounded-xl border border-white/[0.08]">
            <div className="text-right">
              <div className="text-[10px] text-white/50 font-medium">आजचा थेट नफा (Cash)</div>
              <div className={`text-lg font-bold ${isProfitable ? 'text-[#FFEFB3]' : 'text-white'}`}>
                {formatIndianCurrency(todayRecord.simpleOperatingProfit)}
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-right">
              <div className="text-[10px] text-white/50 font-medium">खरा नफा (True Profit)</div>
              <div className="text-lg font-bold text-white/90">
                {formatIndianCurrency(todayRecord.trueProfit)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (12 Strategic Metric Tiles) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* 1. Active Birds */}
        <div
          onClick={() => onDrillDown && onDrillDown('birds')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#122A23] border border-[#E8E4DA] dark:border-[#1E3F36]"
        >
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>{t.activeBirds}</span>
            <Bird className="w-4 h-4 text-[#013E37] dark:text-[#3DAE7E]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#0C1F1A] dark:text-white mt-2 tracking-tight">
            {formatIndianNumber(todayRecord.closingBirds)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#A63229] dark:text-[#E05A50] mt-1.5">
            <span>−{todayRecord.mortality} आज मृत</span>
            <span className="text-[#6B8A7F] dark:text-[#9BB5AB]">• {flock.ageWeeks} आठवडे</span>
          </div>
        </div>

        {/* 2. Eggs Today */}
        <div
          onClick={() => onDrillDown && onDrillDown('eggs')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#122A23] border border-[#E8E4DA] dark:border-[#1E3F36]"
        >
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>{t.eggsToday}</span>
            <Egg className="w-4 h-4 text-[#C9A23C]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#0C1F1A] dark:text-white mt-2 tracking-tight">
            {formatIndianNumber(todayRecord.totalEggsCollected)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium mt-1.5">
            <span className={eggDelta >= 0 ? 'text-[#1A6B4A] dark:text-[#3DAE7E]' : 'text-[#B88B1A] dark:text-[#E5B84A]'}>
              {eggDelta >= 0 ? `+${eggDelta}` : eggDelta} कालच्या तुलनेत
            </span>
            <span className="text-[#6B8A7F] dark:text-[#9BB5AB]">• {Math.floor(todayRecord.totalEggsCollected / 30)} ट्रे</span>
          </div>
        </div>

        {/* 3. HD% (Hen-Day) */}
        <div
          onClick={() => onDrillDown && onDrillDown('production')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#122A23] border border-[#E8E4DA] dark:border-[#1E3F36]"
        >
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>{t.hdPercentage}</span>
            <Percent className="w-4 h-4 text-[#013E37] dark:text-[#3DAE7E]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#013E37] dark:text-[#3DAE7E] mt-2 tracking-tight">
            {todayRecord.hdPct}%
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#6B8A7F] dark:text-[#9BB5AB] mt-1.5">
            <span>मानक: ९१.५%</span>
            <span className={hdDelta >= 0 ? 'text-[#1A6B4A] dark:text-[#3DAE7E] font-semibold' : 'text-[#B88B1A] dark:text-[#E5B84A] font-semibold'}>
              ({hdDelta >= 0 ? `+${hdDelta}%` : `${hdDelta}%`})
            </span>
          </div>
        </div>

        {/* 4. Feed Used & Per Bird */}
        <div
          onClick={() => onDrillDown && onDrillDown('feed')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#122A23] border border-[#E8E4DA] dark:border-[#1E3F36]"
        >
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>{t.feedUsed}</span>
            <Wheat className="w-4 h-4 text-[#013E37] dark:text-[#3DAE7E]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#0C1F1A] dark:text-white mt-2 tracking-tight">
            {formatIndianNumber(todayRecord.feedIssuedKg)} <span className="text-xs font-medium text-[#6B8A7F]">kg</span>
          </div>
          <div className="text-[11px] font-medium text-[#013E37] dark:text-[#3DAE7E] mt-1.5">
            {todayRecord.feedPerBirdG} g / पक्षी (टार्गेट: ११०g)
          </div>
        </div>

        {/* 5. Feed Recommendation Tomorrow */}
        <div
          onClick={() => onDrillDown && onDrillDown('feed')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-[#FFF8DC]/50 dark:bg-[#3D3416]/30 border border-[#FFEFB3] dark:border-[#C9A23C]/30"
        >
          <div className="flex items-center justify-between text-xs text-[#B88B1A] dark:text-[#E5B84A] font-semibold">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {t.feedRecommendedTomorrow}
            </span>
            <Wheat className="w-4 h-4 text-[#C9A23C]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#7A5C0F] dark:text-[#E5B84A] mt-2 tracking-tight">
            ३,३१० <span className="text-xs font-medium text-[#6B8A7F]">kg</span>
          </div>
          <div className="text-[11px] text-[#6B8A7F] dark:text-[#9BB5AB] font-medium mt-1.5">
            ६६ पोती • हवामान व वजनानुसार
          </div>
        </div>

        {/* 6. Mortality Rate */}
        <div
          onClick={() => onDrillDown && onDrillDown('mortality')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#122A23] border border-[#E8E4DA] dark:border-[#1E3F36]"
        >
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>{t.mortality}</span>
            <Skull className="w-4 h-4 text-[#A63229]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#A63229] dark:text-[#E05A50] mt-2 tracking-tight">
            {todayRecord.mortality} <span className="text-xs font-medium text-[#6B8A7F]">पक्षी</span>
          </div>
          <div className="text-[11px] font-medium text-[#1A6B4A] dark:text-[#3DAE7E] mt-1.5">
            ०.०५% (दैनिक मर्यादेत ✓)
          </div>
        </div>

        {/* 7. Total Daily Revenue */}
        <div
          onClick={() => onDrillDown && onDrillDown('sales')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#122A23] border border-[#E8E4DA] dark:border-[#1E3F36]"
        >
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>{t.revenueToday}</span>
            <TrendingUp className="w-4 h-4 text-[#1A6B4A]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#1A6B4A] dark:text-[#3DAE7E] mt-2 tracking-tight">
            {formatIndianCurrency(Math.round(todayRecord.totalEggsCollected * todayRecord.sellingPricePerEgg + (todayRecord.otherIncome || 0)))}
          </div>
          <div className="text-[11px] text-[#6B8A7F] dark:text-[#9BB5AB] font-medium mt-1.5">
            अंडी + रिकामी पोती + खत
          </div>
        </div>

        {/* 8. Daily Feed Cost */}
        <div
          onClick={() => onDrillDown && onDrillDown('expenses')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#122A23] border border-[#E8E4DA] dark:border-[#1E3F36]"
        >
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>{t.feedCostToday}</span>
            <Receipt className="w-4 h-4 text-[#013E37] dark:text-[#3DAE7E]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#0C1F1A] dark:text-white mt-2 tracking-tight">
            {formatIndianCurrency(Math.round(todayRecord.feedIssuedKg * todayRecord.feedPricePerKg))}
          </div>
          <div className="text-[11px] text-[#6B8A7F] dark:text-[#9BB5AB] font-medium mt-1.5">
            ₹३५.०० प्रति किलो दर
          </div>
        </div>

        {/* 9. Cost per Egg vs Selling Rate */}
        <div
          onClick={() => onDrillDown && onDrillDown('breakeven')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#122A23] border border-[#E8E4DA] dark:border-[#1E3F36]"
        >
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>{t.costPerEgg}</span>
            <Scale className="w-4 h-4 text-[#013E37] dark:text-[#3DAE7E]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#0C1F1A] dark:text-white mt-2 tracking-tight">
            ₹{todayRecord.costPerEgg} <span className="text-xs font-medium text-[#6B8A7F]">/ अंडे</span>
          </div>
          <div className="text-[11px] text-[#013E37] dark:text-[#3DAE7E] font-medium mt-1.5">
            विक्री: ₹{todayRecord.sellingPricePerEgg} • मार्जिन: ₹{(todayRecord.sellingPricePerEgg - todayRecord.costPerEgg).toFixed(2)}
          </div>
        </div>

        {/* 10. Break-Even Price */}
        <div
          onClick={() => onDrillDown && onDrillDown('breakeven')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#122A23] border border-[#FFEFB3] dark:border-[#C9A23C]/30"
        >
          <div className="flex items-center justify-between text-xs text-[#B88B1A] dark:text-[#E5B84A] font-semibold">
            <span>{t.breakEvenPrice}</span>
            <ShieldCheck className="w-4 h-4 text-[#C9A23C]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#0C1F1A] dark:text-white mt-2 tracking-tight">
            ₹{todayRecord.breakEvenEggPrice} <span className="text-xs font-medium text-[#6B8A7F]">/ अंडे</span>
          </div>
          <div className="text-[11px] text-[#6B8A7F] dark:text-[#9BB5AB] font-medium mt-1.5">
            ₹{Math.round(todayRecord.breakEvenEggPrice * 100)} / १०० अंडी
          </div>
        </div>

        {/* 11. Cash / Bank Balance */}
        <div
          onClick={() => onDrillDown && onDrillDown('accounts')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#122A23] border border-[#E8E4DA] dark:border-[#1E3F36]"
        >
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>{t.cashBalance}</span>
            <Wallet className="w-4 h-4 text-[#1A6B4A]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#013E37] dark:text-[#3DAE7E] mt-2 tracking-tight">
            {formatIndianCurrency(428500)}
          </div>
          <div className="text-[11px] text-[#6B8A7F] dark:text-[#9BB5AB] font-medium mt-1.5">
            बँक: ₹३.६L • कॅश: ₹६८,५००
          </div>
        </div>

        {/* 12. Receivables Outstanding */}
        <div
          onClick={() => onDrillDown && onDrillDown('receivables')}
          className="card-layer card-layer-interactive p-4 cursor-pointer bg-white dark:bg-[#122A23] border border-[#E8E4DA] dark:border-[#1E3F36]"
        >
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>{t.outstandingReceivables}</span>
            <Clock className="w-4 h-4 text-[#B88B1A]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#B88B1A] dark:text-[#E5B84A] mt-2 tracking-tight">
            {formatIndianCurrency(totalOutstanding)}
          </div>
          <div className="text-[11px] font-medium text-[#A63229] dark:text-[#E05A50] mt-1.5">
            १५ ग्राहक • ₹६०,००० थकीत (२१+ दिवस)
          </div>
        </div>
      </div>
    </div>
  );
}
