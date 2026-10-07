'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickEntryCardProps {
  onSuccessCloseDay?: () => void;
  onSwitchToFullEntry?: () => void;
}

export function QuickEntryCard({ onSuccessCloseDay, onSwitchToFullEntry }: QuickEntryCardProps) {
  const { todayRecord, yesterdayRecord, addQuickLog, unitSettings, flock } = useLayerOS();
  const { t } = useI18n();

  const [date, setDate] = useState('2026-10-07');
  const [eggs, setEggs] = useState<string>(todayRecord ? String(todayRecord.totalEggsCollected) : '27300');
  const [feedKg, setFeedKg] = useState<string>(todayRecord ? String(todayRecord.feedIssuedKg) : '3300');
  const [mortality, setMortality] = useState<string>(todayRecord ? String(todayRecord.mortality) : '15');
  const [soldEggs, setSoldEggs] = useState<string>(todayRecord ? String(todayRecord.totalEggsCollected) : '27300');
  const [sellingRate, setSellingRate] = useState<string>(todayRecord ? String(todayRecord.sellingPricePerEgg) : '5.40');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live calculation previews
  const eggsNum = Number(eggs) || 0;
  const feedNum = Number(feedKg) || 0;
  const mortNum = Number(mortality) || 0;
  const rateNum = Number(sellingRate) || 5.40;

  const closingBirds = (flock.currentBirdCount || 30000) - mortNum;
  const hdPct = closingBirds > 0 ? ((eggsNum / closingBirds) * 100).toFixed(1) : '0';
  const feedPerBirdG = closingBirds > 0 ? Math.round((feedNum * 1000) / closingBirds) : 0;
  const revenue = Math.round(eggsNum * rateNum);
  const feedCost = Math.round(feedNum * 35.0);
  const otherExpenses = 12000;
  const simpleOperatingProfit = revenue - (feedCost + otherExpenses);
  const operatingCostPerEgg = eggsNum > 0 ? ((feedCost + otherExpenses) / eggsNum).toFixed(2) : '0.00';

  // Warnings (Validation without blocking)
  const warnings: string[] = [];
  if (yesterdayRecord) {
    const diffHd = Math.abs(Number(hdPct) - yesterdayRecord.hdPct);
    if (diffHd > 5) {
      warnings.push(`उत्पादनात कालच्या तुलनेत ${diffHd.toFixed(1)}% चा मोठा फरक आहे.`);
    }
  }
  if (mortNum > 35) {
    warnings.push(`आज मृत्यू (${mortNum}) सरासरीपेक्षा जास्त नोंदवला गेला आहे.`);
  }
  if (feedPerBirdG > 0 && (feedPerBirdG < 95 || feedPerBirdG > 125)) {
    warnings.push(`प्रति पक्षी खुराक (${feedPerBirdG}g) सामान्य पातळीपेक्षा (१०५-११५g) वेगळा आहे.`);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      addQuickLog({
        recordDate: date,
        eggsCollected: eggsNum,
        feedKg: feedNum,
        mortality: mortNum,
        soldQtyEggs: Number(soldEggs) || eggsNum,
        sellingRate: rateNum,
      });

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#013E37', '#FFEFB3', '#1A6B4A', '#FFFFFF'],
      });

      setSavedSuccess(true);
      if (onSuccessCloseDay) {
        setTimeout(() => {
          onSuccessCloseDay();
        }, 1200);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-layer p-5 md:p-7 max-w-3xl mx-auto border border-[#E8E4DA] dark:border-[#1E3F36] shadow-lg bg-white dark:bg-[#122A23]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E4DA] dark:border-[#1E3F36] gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#E8F3F1] dark:bg-[#0C2B26] text-[#013E37] dark:text-[#3DAE7E] flex items-center justify-center font-bold text-xl flex-shrink-0">
            <Zap className="w-5 h-5 fill-[#C9A23C] text-[#C9A23C]" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#0C1F1A] dark:text-white flex items-center gap-2">
              <span>{t.quickLogTitle}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#FFEFB3] text-[#7A5C0F]">
                ३० सेकंद
              </span>
            </h2>
            <p className="text-xs text-[#6B8A7F] dark:text-[#6E9487] font-normal mt-0.5">
              {t.quickLogSubtitle}
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[#F5F3EE] dark:bg-[#152E27] px-3.5 py-2 rounded-lg border border-[#E8E4DA] dark:border-[#1E3F36]">
          <Calendar className="w-4 h-4 text-[#013E37] dark:text-[#3DAE7E]" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-transparent text-xs font-medium text-[#0C1F1A] dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {savedSuccess && (
        <div className="mt-4 p-4 rounded-xl bg-[#E8F5EE] dark:bg-[#0F2E21] border border-[#1A6B4A]/20 text-[#145A3D] dark:text-[#5AC897] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div className="text-xs font-semibold">
            {t.dayClosedSuccess}
          </div>
        </div>
      )}

      {/* Warnings Banner if any */}
      {warnings.length > 0 && (
        <div className="mt-4 p-3.5 rounded-xl bg-[#FDF8EA] dark:bg-[#2A2210] border border-[#B88B1A]/20 text-[#7A5C0F] dark:text-[#F0CC66] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>पडताळणी सूचना (Verification Notice):</span>
          </div>
          {warnings.map((w, idx) => (
            <div key={idx} className="text-xs pl-5 font-normal">
              • {w}
            </div>
          ))}
        </div>
      )}

      {/* 4 Required Inputs Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Eggs Collected */}
          <div className="p-4 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36] hover:border-[#013E37] dark:hover:border-[#3DAE7E] transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0C1F1A] dark:text-white">
                {t.eggsCollectedLabel} *
              </label>
              <span className="text-[11px] font-medium text-[#6B8A7F] dark:text-[#6E9487]">
                {t.yesterdayHint} {yesterdayRecord ? yesterdayRecord.totalEggsCollected.toLocaleString('en-IN') : '27,300'}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                required
                min={0}
                value={eggs}
                onChange={e => setEggs(e.target.value)}
                placeholder="27300"
                className="w-full text-2xl font-bold text-[#013E37] dark:text-[#3DAE7E] bg-transparent border-b-2 border-[#013E37]/20 dark:border-[#3DAE7E]/30 focus:border-[#013E37] dark:focus:border-[#3DAE7E] py-1 focus:outline-none"
              />
              <span className="absolute right-0 bottom-2 text-xs font-medium text-[#6B8A7F]">
                अंडी ({Math.floor(eggsNum / 30)} ट्रे)
              </span>
            </div>
          </div>

          {/* 2. Feed Used (Kg) */}
          <div className="p-4 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36] hover:border-[#013E37] dark:hover:border-[#3DAE7E] transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0C1F1A] dark:text-white">
                {t.feedUsedLabel} *
              </label>
              <span className="text-[11px] font-medium text-[#6B8A7F] dark:text-[#6E9487]">
                {t.yesterdayHint} {yesterdayRecord ? yesterdayRecord.feedIssuedKg.toLocaleString('en-IN') : '3,300'} kg
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                required
                min={0}
                value={feedKg}
                onChange={e => setFeedKg(e.target.value)}
                placeholder="3300"
                className="w-full text-2xl font-bold text-[#013E37] dark:text-[#3DAE7E] bg-transparent border-b-2 border-[#013E37]/20 dark:border-[#3DAE7E]/30 focus:border-[#013E37] dark:focus:border-[#3DAE7E] py-1 focus:outline-none"
              />
              <span className="absolute right-0 bottom-2 text-xs font-medium text-[#6B8A7F]">
                kg ({Math.round(feedNum / 50)} पोती)
              </span>
            </div>
          </div>

          {/* 3. Mortality */}
          <div className="p-4 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36] hover:border-[#A63229] transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0C1F1A] dark:text-white">
                {t.mortalityLabel} *
              </label>
              <span className="text-[11px] font-medium text-[#6B8A7F] dark:text-[#6E9487]">
                {t.yesterdayHint} {yesterdayRecord ? yesterdayRecord.mortality : '15'} पक्षी
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                required
                min={0}
                value={mortality}
                onChange={e => setMortality(e.target.value)}
                placeholder="15"
                className="w-full text-2xl font-bold text-[#A63229] dark:text-[#E05A50] bg-transparent border-b-2 border-[#A63229]/20 dark:border-[#E05A50]/30 focus:border-[#A63229] py-1 focus:outline-none"
              />
              <span className="absolute right-0 bottom-2 text-xs font-medium text-[#A63229] dark:text-[#E05A50]">
                पक्षी मृत
              </span>
            </div>
          </div>

          {/* 4. Selling Rate (Optional / Pre-filled) */}
          <div className="p-4 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36] hover:border-[#C9A23C] transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0C1F1A] dark:text-white">
                {t.saleRateLabel}
              </label>
              <span className="text-[11px] font-medium text-[#B88B1A] dark:text-[#E5B84A]">
                आजचा बाजार दर: ₹५.४०
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min={0}
                value={sellingRate}
                onChange={e => setSellingRate(e.target.value)}
                placeholder="5.40"
                className="w-full text-2xl font-bold text-[#B88B1A] dark:text-[#E5B84A] bg-transparent border-b-2 border-[#C9A23C]/30 focus:border-[#C9A23C] py-1 focus:outline-none"
              />
              <span className="absolute right-0 bottom-2 text-xs font-medium text-[#6B8A7F]">
                ₹ प्रति अंडे (= ₹{Math.round(rateNum * 100)} / १००)
              </span>
            </div>
          </div>
        </div>

        {/* Live Automatic KPI Preview Ribbon */}
        <div className="p-4 rounded-xl bg-[#E8F3F1] dark:bg-[#0C2B26] border border-[#013E37]/10 dark:border-[#3DAE7E]/10">
          <div className="text-[11px] font-semibold text-[#013E37] dark:text-[#3DAE7E] uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A23C]" />
              आपोआप तयार होणारा अंदाज (Live Math Preview)
            </span>
            <span className="font-normal text-[#6B8A7F] dark:text-[#6E9487] normal-case">रेफरन्स मानकानुसार</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white dark:bg-[#122A23] p-2.5 rounded-lg border border-[#E8E4DA]/60 dark:border-[#1E3F36]">
              <div className="text-[11px] text-[#6B8A7F] dark:text-[#6E9487] font-medium">हेन-डे (HD%)</div>
              <div className="text-base font-bold text-[#013E37] dark:text-[#3DAE7E] mt-0.5">{hdPct}%</div>
            </div>

            <div className="bg-white dark:bg-[#122A23] p-2.5 rounded-lg border border-[#E8E4DA]/60 dark:border-[#1E3F36]">
              <div className="text-[11px] text-[#6B8A7F] dark:text-[#6E9487] font-medium">प्रति पक्षी खुराक</div>
              <div className="text-base font-bold text-[#013E37] dark:text-[#3DAE7E] mt-0.5">{feedPerBirdG} g</div>
            </div>

            <div className="bg-white dark:bg-[#122A23] p-2.5 rounded-lg border border-[#E8E4DA]/60 dark:border-[#1E3F36]">
              <div className="text-[11px] text-[#6B8A7F] dark:text-[#6E9487] font-medium">प्रति अंडे खर्च</div>
              <div className="text-base font-bold text-[#0C1F1A] dark:text-white mt-0.5">₹{operatingCostPerEgg}</div>
            </div>

            <div className="bg-white dark:bg-[#122A23] p-2.5 rounded-lg border border-[#E8E4DA]/60 dark:border-[#1E3F36]">
              <div className="text-[11px] text-[#6B8A7F] dark:text-[#6E9487] font-medium">साधा नफा (Cash)</div>
              <div className="text-base font-bold text-[#1A6B4A] dark:text-[#3DAE7E] mt-0.5">
                ₹{simpleOperatingProfit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {onSwitchToFullEntry && (
            <button
              type="button"
              onClick={onSwitchToFullEntry}
              className="py-3 px-4 rounded-xl border border-[#E8E4DA] dark:border-[#1E3F36] text-xs font-semibold text-[#3D5C53] dark:text-[#9BB5AB] hover:bg-[#F5F3EE] dark:hover:bg-[#183530] transition-colors"
            >
              तपशीलवार नोंद हवी आहे? (Full 2-Min Entry)
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3.5 px-6 rounded-xl bg-[#013E37] hover:bg-[#012E29] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] touch-target"
          >
            <CheckCircle2 className="w-5 h-5 text-[#FFEFB3]" />
            <span>{isSubmitting ? t.saving : t.saveAndCloseDay}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
