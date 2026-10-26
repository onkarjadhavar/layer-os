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
  TrendingUp,
  Scale,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react';

interface KPIGridProps {
  onDrillDown?: (kpiKey: string) => void;
}

export function KPIGrid({ onDrillDown }: KPIGridProps) {
  const { todayRecord, yesterdayRecord, flock, customers } = useLayerOS();
  const { language, t } = useI18n();
  const [showDetailedKPIs, setShowDetailedKPIs] = useState(false);

  if (!todayRecord) return null;

  // Determine if today's entry has not been logged yet
  const isEntryPending = todayRecord.totalEggsCollected === 0 && todayRecord.feedIssuedKg === 0;

  // Outstanding customer receivables
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

  // Standard benchmark figures based on flock capacity
  const birdCount = flock?.currentBirdCount || 10000;
  const standardTargetEggs = Math.round(birdCount * 0.915);
  const standardTargetFeedKg = Math.round(birdCount * 0.110);
  const standardFeedBags = Math.round(standardTargetFeedKg / 50);

  return (
    <div className="space-y-4">
      {/* 1. Daily Financial & Operational Pulse Banner */}
      {isEntryPending ? (
        // Operational Standby Banner: Today's log is pending
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-amber-soft)] text-[var(--color-walnut)] dark:bg-[#2A1E0D] dark:text-[var(--color-amber)] flex items-center justify-center flex-shrink-0 shadow-xs">
                <Clock className="w-5 h-5 text-[var(--color-amber)]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-[var(--color-amber-soft)] text-[var(--color-walnut)] dark:bg-[#2A1E0D] dark:text-[var(--color-amber)]">
                    {language === 'en'
                      ? "Today's Status: Entry Pending"
                      : language === 'hi'
                      ? "आज की स्थिति: प्रविष्टि लंबित"
                      : "आजचा ताळेबंद: नोंद प्रलंबित"}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)] hidden sm:inline">•</span>
                  <span className="text-xs text-[var(--color-text-muted)] font-medium hidden sm:inline">
                    {flock.batchCode} ({birdCount.toLocaleString('en-IN')} {t.birds})
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-main)] mt-1 tracking-tight">
                  {language === 'en'
                    ? "Today's production & feed entry is waiting to be logged"
                    : language === 'hi'
                    ? "आज का अंडा उत्पादन व दाना अभी दर्ज नहीं हुआ है"
                    : "आजचे अंडी उत्पादन व खुराक अद्याप नोंदवलेले नाही"}
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                  {language === 'en'
                    ? "Complete today's 30-second log to calculate real break-even rate, cash profit, and bird efficiency."
                    : language === 'hi'
                    ? "आज का सटीक ब्रेक-इवेन भाव और शुद्ध नफा देखने के लिए 30 सेकंड में दैनिक प्रविष्टि पूरी करें।"
                    : "आजचा अचूक ब्रेक-इव्हन भाव, थेट नफा आणि उत्पादन खर्च पाहण्यासाठी ३० सेकंदात आजची नोंद करा."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0 self-stretch md:self-auto justify-end">
              <div className="hidden lg:flex items-center gap-3 bg-[var(--color-surface-subtle)] px-3.5 py-2 rounded-xl border border-[var(--color-border)] text-left">
                <div>
                  <div className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase">
                    {language === 'en' ? "Target HD%" : language === 'hi' ? "मानक HD%" : "कळप उद्दिष्ट"}
                  </div>
                  <div className="text-sm font-black tabular-nums text-[var(--color-forest)] dark:text-[var(--color-sage)]">
                    91.5% HD
                  </div>
                </div>
                <div className="w-px h-6 bg-[var(--color-border)]" />
                <div>
                  <div className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase">
                    {language === 'en' ? "Target Eggs" : language === 'hi' ? "अपेक्षित अंडे" : "अपेक्षित अंडी"}
                  </div>
                  <div className="text-sm font-black tabular-nums text-[var(--color-text-main)]">
                    ~{standardTargetEggs.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="kpi-banner-btn-quick-log"
                onClick={() => onDrillDown && onDrillDown('quick-log')}
                className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-[var(--color-forest)] hover:bg-[#143F2F] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all touch-target cursor-pointer"
              >
                <span>
                  {language === 'en'
                    ? "Record Today's Log (30s)"
                    : language === 'hi'
                    ? "आज की नोंद करें (30s)"
                    : "आजची नोंद करा (३० सेकंद)"}
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--color-amber)]" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Active Financial Health Banner: Real profit or loss calculated
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-xs ${
            isProfitable
              ? 'bg-[var(--color-forest)] text-white border-[var(--color-forest-deep)]'
              : 'bg-[var(--color-walnut)] text-white border-[#422D1F]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center font-black text-xl flex-shrink-0">
                {isProfitable ? (
                  <TrendingUp className="w-6 h-6 text-[var(--color-amber)]" />
                ) : (
                  <Scale className="w-6 h-6 text-[var(--color-amber)]" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-sage-pale)]">
                  {t.financialDecisionTitle}
                </div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight mt-0.5">
                  {isProfitable ? t.safeProfitStatusMsg : t.tightMarginWarningMsg}
                </h2>
                <p className="text-xs text-[var(--color-sage-pale)]/90 mt-1 leading-relaxed">
                  {t.breakEvenRateLabel}: <span className="font-bold tabular-nums underline">₹{todayRecord.breakEvenEggPrice}</span> (₹{Math.round(todayRecord.breakEvenEggPrice * 100)}/१००) • {t.sellingRateLabel}: <span className="font-bold tabular-nums">₹{todayRecord.sellingPricePerEgg}</span> • {t.profitMarginLabel}: <span className="font-bold tabular-nums text-[var(--color-amber)]">₹{marginPerEgg >= 0 ? `+${marginPerEgg}` : marginPerEgg}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/25 px-4 py-2.5 rounded-xl border border-white/10 self-stretch sm:self-auto justify-between sm:justify-end flex-shrink-0">
              <div>
                <div className="text-[10px] text-white/80 font-bold uppercase">{t.dailyOperatingCashProfit}</div>
                <div className="text-lg sm:text-xl font-black tabular-nums text-[var(--color-sage-pale)]">
                  {formatIndianCurrency(todayRecord.simpleOperatingProfit)}
                </div>
              </div>
              <div className="w-px h-8 bg-white/20 mx-1" />
              <div>
                <div className="text-[10px] text-white/80 font-bold uppercase">{t.dailyTrueNetProfit}</div>
                <div className="text-lg sm:text-xl font-black tabular-nums text-[var(--color-amber)]">
                  {formatIndianCurrency(todayRecord.trueProfit)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Primary 4 Farming Metrics (2x2 Grid on Mobile, 4 Cols on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Eggs Collected Today */}
        <div
          onClick={() => onDrillDown && onDrillDown('eggs')}
          className="p-4 sm:p-5 cursor-pointer bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xs hover:border-[var(--color-sage)] transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold mb-1">
              <span className="truncate">{t.eggsToday}</span>
              <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-amber)] flex items-center justify-center flex-shrink-0">
                <Egg className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black tabular-nums text-[var(--color-text-main)] tracking-tight">
              {formatIndianNumber(todayRecord.totalEggsCollected)}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-[var(--color-border)] text-[11px] font-semibold truncate">
            {isEntryPending ? (
              <span className="text-[var(--color-amber)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-amber)]" />
                {language === 'en' ? "Log pending" : language === 'hi' ? "प्रविष्टि बाकी" : "सकाळचे संकलन बाकी"}
              </span>
            ) : (
              <div className="flex items-center gap-1.5 truncate">
                <span className={eggDelta >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}>
                  {eggDelta >= 0 ? `+${eggDelta}` : eggDelta} {t.vsYesterday}
                </span>
                <span className="text-[var(--color-text-muted)]">• {Math.floor(todayRecord.totalEggsCollected / 30)} {t.unitTray}</span>
              </div>
            )}
          </div>
        </div>

        {/* Metric 2: Hen-Day HD% */}
        <div
          onClick={() => onDrillDown && onDrillDown('production')}
          className="p-4 sm:p-5 cursor-pointer bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xs hover:border-[var(--color-sage)] transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold mb-1">
              <span className="truncate">{t.hdPercentage}</span>
              <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-forest)] dark:text-[var(--color-sage)] flex items-center justify-center flex-shrink-0">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black tabular-nums text-[var(--color-forest)] dark:text-[var(--color-sage)] tracking-tight">
              {todayRecord.hdPct.toFixed(1)}%
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text-muted)] truncate">
            {isEntryPending ? (
              <span>मानक: ९१.५% (BV300 लक्ष्य)</span>
            ) : (
              <div className="flex items-center gap-1 truncate">
                <span>{t.standardLabel}: 91.5%</span>
                <span className={hdDelta >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}>
                  ({hdDelta >= 0 ? `+${hdDelta}%` : `${hdDelta}%`})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Metric 3: Feed Used Today */}
        <div
          onClick={() => onDrillDown && onDrillDown('feed')}
          className="p-4 sm:p-5 cursor-pointer bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xs hover:border-[var(--color-sage)] transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold mb-1">
              <span className="truncate">{t.feedUsed}</span>
              <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-walnut)] dark:text-[var(--color-amber)] flex items-center justify-center flex-shrink-0">
                <Wheat className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black tabular-nums text-[var(--color-text-main)] tracking-tight">
              {formatIndianNumber(todayRecord.feedIssuedKg)}{' '}
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">kg</span>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text-muted)] truncate">
            {isEntryPending ? (
              <span>अपेक्षित: ~{standardTargetFeedKg.toLocaleString('en-IN')} kg ({standardFeedBags} पोती)</span>
            ) : (
              <span className="text-[var(--color-forest)] dark:text-[var(--color-sage)]">
                {todayRecord.feedPerBirdG} g / {t.birds} ({Math.round(todayRecord.feedIssuedKg / 50)} पोती)
              </span>
            )}
          </div>
        </div>

        {/* Metric 4: Active Live Birds */}
        <div
          onClick={() => onDrillDown && onDrillDown('birds')}
          className="p-4 sm:p-5 cursor-pointer bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xs hover:border-[var(--color-sage)] transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold mb-1">
              <span className="truncate">{t.activeBirds}</span>
              <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-forest)] dark:text-[var(--color-sage)] flex items-center justify-center flex-shrink-0">
                <Bird className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black tabular-nums text-[var(--color-text-main)] tracking-tight">
              {formatIndianNumber(todayRecord.closingBirds || birdCount)}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-[var(--color-border)] text-[11px] font-semibold truncate flex items-center gap-1.5">
            <span className={todayRecord.mortality > 0 ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'}>
              −{todayRecord.mortality} {t.birdsDeadToday}
            </span>
            <span className="text-[var(--color-text-muted)]">• {flock.ageWeeks} {t.ageWeeksLabel}</span>
          </div>
        </div>
      </div>

      {/* 3. Expandable Detailed Breakdown Toggle */}
      <button
        type="button"
        id="kpi-btn-toggle-detailed-breakdown"
        onClick={() => setShowDetailedKPIs(!showDetailedKPIs)}
        className="w-full py-2 px-4 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-subtle)] text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>
          {showDetailedKPIs
            ? (language === 'en' ? 'Hide Financial Details' : language === 'hi' ? 'वित्तीय विवरण छिपाएं' : 'तपशीलवार आकडेवारी लपवा')
            : (language === 'en' ? 'View Detailed Financials & Outstandings' : language === 'hi' ? 'सविस्तर हिसाब व उधारी देखें' : 'सविस्तर हिशोब व आकडेवारी पहा')}
        </span>
        {showDetailedKPIs ? (
          <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
        )}
      </button>

      {/* 4. Detailed Financial Breakdown Panel */}
      {showDetailedKPIs && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-150">
          <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
            <div className="text-[11px] text-[var(--color-text-muted)] font-medium">
              {language === 'en' ? 'Egg Sales' : language === 'hi' ? 'अंडा बिक्री' : 'अंडी विक्री (Sales)'}
            </div>
            <div className="text-base font-black tabular-nums text-[var(--color-text-main)] mt-0.5">
              {formatIndianCurrency(todayRecord.totalEggsCollected * todayRecord.sellingPricePerEgg)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
            <div className="text-[11px] text-[var(--color-text-muted)] font-medium">
              {language === 'en' ? 'Feed Cost' : language === 'hi' ? 'दाना खर्च' : 'खाद्य खर्च (Feed Cost)'}
            </div>
            <div className="text-base font-black tabular-nums text-[var(--color-text-main)] mt-0.5">
              {formatIndianCurrency(todayRecord.feedIssuedKg * todayRecord.feedPricePerKg)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
            <div className="text-[11px] text-[var(--color-text-muted)] font-medium">
              {language === 'en' ? 'Other Expenses' : language === 'hi' ? 'अन्य खर्च' : 'इतर खर्च (Expenses)'}
            </div>
            <div className="text-base font-black tabular-nums text-[var(--color-text-main)] mt-0.5">
              {formatIndianCurrency(todayRecord.otherCashExpenses)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
            <div className="text-[11px] text-[var(--color-text-muted)] font-medium">
              {language === 'en' ? 'Receivables' : language === 'hi' ? 'उधारी बाकी' : 'व्यापारी उधारी (Outstandings)'}
            </div>
            <div className="text-base font-black tabular-nums text-[var(--color-amber)] mt-0.5">
              {formatIndianCurrency(totalOutstanding)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default KPIGrid;
