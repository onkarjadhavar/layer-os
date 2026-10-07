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
        colors: ['#1F4D3A', '#D9A441', '#2E7D5B', '#FFFFFF'],
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
    <div className="card-layer p-5 md:p-7 max-w-3xl mx-auto border-2 border-[#1F4D3A]/20 shadow-xl bg-white dark:bg-[#16241D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E2D6] dark:border-[#263B30] gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] text-[#1F4D3A] dark:text-[#3BA378] flex items-center justify-center font-bold text-xl flex-shrink-0">
            <Zap className="w-6 h-6 fill-[#D9A441] text-[#D9A441]" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <span>{t.quickLogTitle}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-black bg-[#D9A441] text-[#0B1E15]">
                ३० सेकंद
              </span>
            </h2>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-0.5">
              {t.quickLogSubtitle}
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[#F8F6F0] dark:bg-[#1A2D23] px-3.5 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#2C4435]">
          <Calendar className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#0B1E15] dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {savedSuccess && (
        <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 animate-in zoom-in-95">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div className="text-xs font-bold">
            {t.dayClosedSuccess}
          </div>
        </div>
      )}

      {/* Warnings Banner if any */}
      {warnings.length > 0 && (
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>पडताळणी सूचना (Verification Notice):</span>
          </div>
          {warnings.map((w, idx) => (
            <div key={idx} className="text-xs pl-5 list-disc text-amber-900 dark:text-amber-200 font-medium">
              • {w}
            </div>
          ))}
        </div>
      )}

      {/* 4 Required Inputs Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Eggs Collected */}
          <div className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] hover:border-[#1F4D3A] dark:hover:border-[#3BA378] transition-colors shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-[#0B1E15] dark:text-white">
                {t.eggsCollectedLabel} *
              </label>
              <span className="text-[11px] font-bold text-[#4D6558] dark:text-[#CBDCD4]">
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
                className="w-full text-2xl font-black text-[#1F4D3A] dark:text-[#42BF87] bg-transparent border-b-2 border-[#1F4D3A]/40 dark:border-[#3BA378]/50 focus:border-[#1F4D3A] py-1 focus:outline-none"
              />
              <span className="absolute right-0 bottom-2 text-xs font-bold text-[#3D5246] dark:text-[#CBDCD4]">
                अंडी ({Math.floor(eggsNum / 30)} ट्रे)
              </span>
            </div>
          </div>

          {/* 2. Feed Used (Kg) */}
          <div className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] hover:border-[#1F4D3A] dark:hover:border-[#3BA378] transition-colors shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-[#0B1E15] dark:text-white">
                {t.feedUsedLabel} *
              </label>
              <span className="text-[11px] font-bold text-[#4D6558] dark:text-[#CBDCD4]">
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
                className="w-full text-2xl font-black text-[#1F4D3A] dark:text-[#42BF87] bg-transparent border-b-2 border-[#1F4D3A]/40 dark:border-[#3BA378]/50 focus:border-[#1F4D3A] py-1 focus:outline-none"
              />
              <span className="absolute right-0 bottom-2 text-xs font-bold text-[#3D5246] dark:text-[#CBDCD4]">
                kg ({Math.round(feedNum / 50)} पोती)
              </span>
            </div>
          </div>

          {/* 3. Mortality */}
          <div className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] hover:border-red-500 transition-colors shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-[#0B1E15] dark:text-white">
                {t.mortalityLabel} *
              </label>
              <span className="text-[11px] font-bold text-[#4D6558] dark:text-[#CBDCD4]">
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
                className="w-full text-2xl font-black text-red-600 dark:text-red-400 bg-transparent border-b-2 border-red-300 dark:border-red-500/50 focus:border-red-500 py-1 focus:outline-none"
              />
              <span className="absolute right-0 bottom-2 text-xs font-bold text-red-600 dark:text-red-400">
                पक्षी मृत
              </span>
            </div>
          </div>

          {/* 4. Selling Rate (Optional / Pre-filled) */}
          <div className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] hover:border-[#D9A441] transition-colors shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-[#0B1E15] dark:text-white">
                {t.saleRateLabel}
              </label>
              <span className="text-[11px] font-bold text-[#B07B18] dark:text-[#E5B252]">
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
                className="w-full text-2xl font-black text-[#B07B18] dark:text-[#E5B252] bg-transparent border-b-2 border-[#D9A441]/40 focus:border-[#D9A441] py-1 focus:outline-none"
              />
              <span className="absolute right-0 bottom-2 text-xs font-bold text-[#3D5246] dark:text-[#CBDCD4]">
                ₹ प्रति अंडे (= ₹{Math.round(rateNum * 100)} / १००)
              </span>
            </div>
          </div>
        </div>

        {/* Live Automatic KPI Preview Ribbon */}
        <div className="p-4 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/20">
          <div className="text-[11px] font-bold text-[#1F4D3A] dark:text-[#3BA378] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1 font-black">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
              आपोआप तयार होणारा अंदाज (Live Math Preview)
            </span>
            <span className="font-semibold text-[#2D4538] dark:text-[#CBDCD4]">रेफरन्स मानकानुसार</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white dark:bg-[#16241D] p-2.5 rounded-xl border border-[#DCD3C3]/60 dark:border-[#263B30] shadow-xs">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">हेन-डे (HD%)</div>
              <div className="text-base font-black text-[#1F4D3A] dark:text-[#3BA378] mt-0.5">{hdPct}%</div>
            </div>

            <div className="bg-white dark:bg-[#16241D] p-2.5 rounded-xl border border-[#DCD3C3]/60 dark:border-[#263B30] shadow-xs">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">प्रति पक्षी खुराक</div>
              <div className="text-base font-black text-[#1F4D3A] dark:text-[#3BA378] mt-0.5">{feedPerBirdG} g</div>
            </div>

            <div className="bg-white dark:bg-[#16241D] p-2.5 rounded-xl border border-[#DCD3C3]/60 dark:border-[#263B30] shadow-xs">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">प्रति अंडे खर्च</div>
              <div className="text-base font-black text-[#0B1E15] dark:text-white mt-0.5">₹{operatingCostPerEgg}</div>
            </div>

            <div className="bg-white dark:bg-[#16241D] p-2.5 rounded-xl border border-[#DCD3C3]/60 dark:border-[#263B30] shadow-xs">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">साधा नफा (Cash)</div>
              <div className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
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
              className="py-3.5 px-4 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] text-xs font-bold text-[#0B1E15] dark:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] transition-colors"
            >
              तपशीलवार नोंद हवी आहे? (Full 2-Min Entry)
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 px-6 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-base font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] touch-target"
          >
            <CheckCircle2 className="w-5 h-5 text-[#D9A441]" />
            <span>{isSubmitting ? t.saving : t.saveAndCloseDay}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
