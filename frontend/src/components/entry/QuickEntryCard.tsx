'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Plus,
  Minus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickEntryCardProps {
  onSuccessCloseDay?: () => void;
  onSwitchToFullEntry?: () => void;
}

export function QuickEntryCard({ onSuccessCloseDay, onSwitchToFullEntry }: QuickEntryCardProps) {
  const { todayRecord, yesterdayRecord, addQuickLog, flock } = useLayerOS();
  const { t } = useI18n();

  const [date, setDate] = useState('2026-10-07');
  const [eggs, setEggs] = useState<string>(todayRecord ? String(todayRecord.totalEggsCollected) : '27300');
  const [feedKg, setFeedKg] = useState<string>(todayRecord ? String(todayRecord.feedIssuedKg) : '3300');
  const [mortality, setMortality] = useState<string>(todayRecord ? String(todayRecord.mortality) : '15');
  const [soldEggs, setSoldEggs] = useState<string>(todayRecord ? String(todayRecord.totalEggsCollected) : '27300');
  const [sellingRate, setSellingRate] = useState<string>(todayRecord ? String(todayRecord.sellingPricePerEgg) : '5.40');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Stepper helper
  const adjustValue = (
    current: string,
    delta: number,
    setter: React.Dispatch<React.SetStateAction<string>>,
    min = 0
  ) => {
    const val = Number(current) || 0;
    const nextVal = Math.max(min, val + delta);
    setter(String(nextVal));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addQuickLog({
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
        colors: ['#194B38', '#D5811F', '#87A96B', '#FFFFFF'],
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
    <div className="card-layer p-4 sm:p-6 w-full shadow-xs rounded-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[var(--color-border)] gap-2.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--color-amber-soft)] text-[var(--color-walnut)] dark:bg-[#2A1E0D] dark:text-[var(--color-amber)] flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
            <Zap className="w-6 h-6 fill-[var(--color-amber)] text-[var(--color-amber)]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
              <span>३०-सेकंद दैनिक नोंद (Quick Entry)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[var(--color-amber)] text-white">
                ३० सेकंद
              </span>
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">
              {t.quickLogSubtitle}
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[var(--color-surface-subtle)] px-3 py-1.5 rounded-xl border border-[var(--color-border)] self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-transparent text-xs font-bold text-[var(--color-text-main)] focus:outline-none"
          />
        </div>
      </div>

      {savedSuccess && (
        <div className="mt-3.5 p-3.5 rounded-2xl bg-[var(--color-success-bg)] border border-[var(--color-success)]/40 text-[var(--color-success)] flex items-center gap-3 animate-in zoom-in-95">
          <CheckCircle2 className="w-6 h-6 text-[var(--color-success)] flex-shrink-0" />
          <div className="text-xs font-bold">
            {t.dayClosedSuccess}
          </div>
        </div>
      )}

      {/* Warnings Banner if any */}
      {warnings.length > 0 && (
        <div className="mt-3.5 p-3.5 rounded-2xl bg-[var(--color-warning-bg)] border border-[var(--color-warning)]/40 text-[var(--color-warning)] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-warning)]">
            <AlertTriangle className="w-4 h-4" />
            <span>पडताळणी सूचना (Verification Notice):</span>
          </div>
          {warnings.map((w, idx) => (
            <div key={idx} className="text-xs pl-5 list-disc text-[var(--color-warning)] font-medium">
              • {w}
            </div>
          ))}
        </div>
      )}

      {/* 4 Required Inputs Form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* 1. Eggs Collected */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] hover:border-[var(--color-forest)] dark:hover:border-[var(--color-sage)] transition-colors shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[var(--color-text-main)]">
                {t.eggsCollectedLabel} *
              </label>
              <span className="text-[11px] font-medium text-[var(--color-text-muted)] tabular-nums">
                काल: {yesterdayRecord ? yesterdayRecord.totalEggsCollected.toLocaleString('en-IN') : '27,300'}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                required
                min={0}
                value={eggs}
                onChange={e => setEggs(e.target.value)}
                placeholder="27300"
                className="w-full text-2xl font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] bg-transparent border-b-2 border-[var(--color-forest)]/40 dark:border-[var(--color-sage)]/50 focus:border-[var(--color-forest)] py-1 focus:outline-none tabular-nums"
              />
              <span className="absolute right-0 bottom-2 text-xs font-medium text-[var(--color-text-muted)]">
                अंडी ({Math.floor(eggsNum / 30)} ट्रे)
              </span>
            </div>
            {/* Quick Stepper Chips for Mobile */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <button
                type="button"
                onClick={() => adjustValue(eggs, -100, setEggs)}
                className="px-2 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text-main)] hover:border-[var(--color-forest)] active:scale-95 cursor-pointer tabular-nums"
              >
                -100
              </button>
              <button
                type="button"
                onClick={() => adjustValue(eggs, 100, setEggs)}
                className="px-2 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text-main)] hover:border-[var(--color-forest)] active:scale-95 cursor-pointer tabular-nums"
              >
                +100
              </button>
              <button
                type="button"
                onClick={() => adjustValue(eggs, 500, setEggs)}
                className="px-2 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text-main)] hover:border-[var(--color-forest)] active:scale-95 cursor-pointer tabular-nums"
              >
                +500
              </button>
            </div>
          </div>

          {/* 2. Feed Used (Kg) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] hover:border-[var(--color-forest)] dark:hover:border-[var(--color-sage)] transition-colors shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[var(--color-text-main)]">
                {t.feedUsedLabel} *
              </label>
              <span className="text-[11px] font-medium text-[var(--color-text-muted)] tabular-nums">
                काल: {yesterdayRecord ? yesterdayRecord.feedIssuedKg.toLocaleString('en-IN') : '3,300'} kg
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                required
                min={0}
                value={feedKg}
                onChange={e => setFeedKg(e.target.value)}
                placeholder="3300"
                className="w-full text-2xl font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] bg-transparent border-b-2 border-[var(--color-forest)]/40 dark:border-[var(--color-sage)]/50 focus:border-[var(--color-forest)] py-1 focus:outline-none tabular-nums"
              />
              <span className="absolute right-0 bottom-2 text-xs font-medium text-[var(--color-text-muted)]">
                kg ({Math.round(feedNum / 50)} पोती)
              </span>
            </div>
            {/* Quick Stepper Chips */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <button
                type="button"
                onClick={() => adjustValue(feedKg, -50, setFeedKg)}
                className="px-2 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text-main)] hover:border-[var(--color-forest)] active:scale-95 cursor-pointer tabular-nums"
              >
                -50kg (1 पोते)
              </button>
              <button
                type="button"
                onClick={() => adjustValue(feedKg, 50, setFeedKg)}
                className="px-2 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text-main)] hover:border-[var(--color-forest)] active:scale-95 cursor-pointer tabular-nums"
              >
                +50kg (1 पोते)
              </button>
            </div>
          </div>

          {/* 3. Mortality */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] hover:border-[var(--color-error)] transition-colors shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[var(--color-text-main)]">
                {t.mortalityLabel} *
              </label>
              <span className="text-[11px] font-medium text-[var(--color-text-muted)] tabular-nums">
                काल: {yesterdayRecord ? yesterdayRecord.mortality : '15'} पक्षी
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                required
                min={0}
                value={mortality}
                onChange={e => setMortality(e.target.value)}
                placeholder="15"
                className="w-full text-2xl font-bold text-[var(--color-error)] bg-transparent border-b-2 border-[var(--color-error)]/40 focus:border-[var(--color-error)] py-1 focus:outline-none tabular-nums"
              />
              <span className="absolute right-0 bottom-2 text-xs font-bold text-[var(--color-error)]">
                मृत्यू संख्या
              </span>
            </div>
            {/* Quick Stepper Chips */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <button
                type="button"
                onClick={() => adjustValue(mortality, -1, setMortality)}
                className="px-2.5 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-error)] hover:border-[var(--color-error)] active:scale-95 cursor-pointer tabular-nums"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => adjustValue(mortality, 1, setMortality)}
                className="px-2.5 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-error)] hover:border-[var(--color-error)] active:scale-95 cursor-pointer tabular-nums"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => adjustValue(mortality, 5, setMortality)}
                className="px-2.5 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-error)] hover:border-[var(--color-error)] active:scale-95 cursor-pointer tabular-nums"
              >
                +5
              </button>
            </div>
          </div>

          {/* 4. Selling Rate */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] hover:border-[var(--color-amber)] transition-colors shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[var(--color-text-main)]">
                {t.saleRateLabel}
              </label>
              <span className="text-[11px] font-bold text-[var(--color-amber)] tabular-nums">
                बाजार दर: ₹५.४०
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                step="0.05"
                min={0}
                value={sellingRate}
                onChange={e => setSellingRate(e.target.value)}
                placeholder="5.40"
                className="w-full text-2xl font-bold text-[var(--color-amber)] bg-transparent border-b-2 border-[var(--color-amber)]/40 focus:border-[var(--color-amber)] py-1 focus:outline-none tabular-nums"
              />
              <span className="absolute right-0 bottom-2 text-xs font-medium text-[var(--color-text-muted)] tabular-nums">
                ₹ प्रति अंडे (= ₹{Math.round(rateNum * 100)}/१००)
              </span>
            </div>
            {/* Quick Rate Steppers */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <button
                type="button"
                onClick={() => {
                  const current = Number(sellingRate) || 5.40;
                  setSellingRate((current - 0.10).toFixed(2));
                }}
                className="px-2 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text-main)] hover:border-[var(--color-amber)] active:scale-95 cursor-pointer"
              >
                -१० पैसे
              </button>
              <button
                type="button"
                onClick={() => {
                  const current = Number(sellingRate) || 5.40;
                  setSellingRate((current + 0.10).toFixed(2));
                }}
                className="px-2 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text-main)] hover:border-[var(--color-amber)] active:scale-95 cursor-pointer"
              >
                +१० पैसे
              </button>
            </div>
          </div>
        </div>

        {/* Live Automatic KPI Preview Ribbon */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
          <div className="text-[11px] font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-amber)]" />
              आपोआप तयार होणारा हिशोब (Live Math Preview)
            </span>
            <span className="font-medium text-[var(--color-text-muted)]">मानकानुसार</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-[var(--color-surface)] p-2.5 rounded-xl border border-[var(--color-border)] shadow-xs">
              <div className="text-[11px] text-[var(--color-text-muted)] font-medium">हेन-डे (HD%)</div>
              <div className="text-base font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] mt-0.5 tabular-nums">{hdPct}%</div>
            </div>

            <div className="bg-[var(--color-surface)] p-2.5 rounded-xl border border-[var(--color-border)] shadow-xs">
              <div className="text-[11px] text-[var(--color-text-muted)] font-medium">प्रति पक्षी खुराक</div>
              <div className="text-base font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] mt-0.5 tabular-nums">{feedPerBirdG} g</div>
            </div>

            <div className="bg-[var(--color-surface)] p-2.5 rounded-xl border border-[var(--color-border)] shadow-xs">
              <div className="text-[11px] text-[var(--color-text-muted)] font-medium">प्रति अंडे खर्च</div>
              <div className="text-base font-bold text-[var(--color-text-main)] mt-0.5 tabular-nums">₹{operatingCostPerEgg}</div>
            </div>

            <div className="bg-[var(--color-surface)] p-2.5 rounded-xl border border-[var(--color-border)] shadow-xs">
              <div className="text-[11px] text-[var(--color-text-muted)] font-medium">अंदाजे नफा (Cash)</div>
              <div className="text-base font-bold text-[var(--color-success)] mt-0.5 tabular-nums">
                ₹{simpleOperatingProfit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          {onSwitchToFullEntry && (
            <button
              type="button"
              onClick={onSwitchToFullEntry}
              className="py-3 px-4 rounded-2xl border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)] transition-colors touch-target cursor-pointer"
            >
              तपशीलवार नोंद हवी आहे? (Full 2-Min Entry)
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 min-h-[52px] py-3.5 px-6 rounded-2xl bg-[var(--color-forest)] hover:bg-[#143F2F] text-white text-base font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] touch-target cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-[var(--color-amber)]" />
            <span>{isSubmitting ? t.saving : t.saveAndCloseDay}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
