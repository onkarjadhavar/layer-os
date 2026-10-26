'use client';

import React, { useState } from 'react';
import { Link } from '@/components/common/Link';
import { useI18n } from '@/lib/i18n/context';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  PlayCircle,
  TrendingUp,
  Bird,
  Egg,
  Wheat,
  Scale,
} from 'lucide-react';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calc';

interface HeroSectionProps {
  onTryDemo: () => void;
}

export function HeroSection({ onTryDemo }: HeroSectionProps) {
  const { t } = useI18n();

  // Interactive Live Farm Simulation (The Taste-Skill "One Live Thing")
  const [flockScale, setFlockScale] = useState<number>(30000);
  const [sellingRate, setSellingRate] = useState<number>(5.40);

  // Dynamic calculations based on industry standard layer standards (BV300, 34 weeks)
  const layingPct = 0.91; // 91% Laying HD
  const eggsCollected = Math.round(flockScale * layingPct);
  const feedPerBirdG = 110;
  const feedKg = Math.round((flockScale * feedPerBirdG) / 1000);
  const feedCostPerKg = 35.0;
  const totalFeedCost = feedKg * feedCostPerKg;
  const otherOverheadsDaily = flockScale * 0.45; // Labour, medicine, electricity, amortisation
  const totalCostDaily = totalFeedCost + otherOverheadsDaily;
  const breakEvenRate = Number((totalCostDaily / eggsCollected).toFixed(2));
  const dailyRevenue = eggsCollected * sellingRate;
  const dailyOperatingProfit = Math.round(dailyRevenue - totalCostDaily);

  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20 px-4 bg-[var(--color-background)] dark:bg-[#0E1713] transition-colors border-b border-[var(--color-border)] dark:border-[#23372E]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Outcome-Focused Narrative & Direct CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Definition Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-sage-pale)] dark:bg-[#1A2E24] border border-[var(--color-sage)]/30 text-[var(--color-forest)] dark:text-[var(--color-sage)] text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[var(--color-forest)] dark:bg-[var(--color-sage)]" />
              <span>महाराष्ट्र व भारतातील व्यावसायिक लेअर पोल्ट्री फार्म्ससाठी</span>
            </div>

            {/* Main Headline - Outcome Driven */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black text-[var(--color-text-main)] dark:text-white tracking-tight leading-[1.18]">
              {t.heroHeadline}
            </h1>

            {/* Concrete Substance Description */}
            <p className="text-base sm:text-lg text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed max-w-2xl font-normal">
              {t.heroSubtitle} पारंपारिक वही-डायरी बंद करा. अवघ्या ३० सेकंदात दैनिक अंडी उत्पादन, खाद्याचा प्रति-पक्षी हिशोब, अचूक ब्रेक-इव्हन भाव (Break-Even) आणि व्हॉट्सॲप बिलिंग ताळेबंद त्वरित तयार.
            </p>

            {/* Primary Action Button Cluster */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                id="landing-hero-enroll-btn"
                href="/enroll"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-[var(--color-forest)] hover:bg-[#143F2F] shadow-sm hover:shadow transition-all min-h-[48px] border border-[var(--color-forest-deep)]"
              >
                <span>{t.heroEnrollCta}</span>
                <ArrowRight className="w-4 h-4 text-[var(--color-amber)]" />
              </Link>

              <button
                id="landing-hero-demo-btn"
                type="button"
                onClick={onTryDemo}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-base font-bold text-[var(--color-walnut)] dark:text-[var(--color-amber)] bg-[var(--color-amber-soft)]/60 dark:bg-[#2B2113] border border-[var(--color-amber)]/40 hover:bg-[var(--color-amber-soft)] transition-colors min-h-[48px]"
              >
                <PlayCircle className="w-5 h-5 text-[var(--color-amber)]" />
                <span>{t.heroTryDemo}</span>
              </button>

              <Link
                id="landing-hero-login-link"
                href="/login"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-[var(--color-forest)] dark:text-[var(--color-sage)] hover:underline min-h-[44px]"
              >
                <span>{t.heroAlreadyRegistered}</span>
              </Link>
            </div>

            {/* Verified Operational Proofs */}
            <div className="pt-4 border-t border-[var(--color-border)] dark:border-[#23372E] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-[var(--color-text-muted)] dark:text-[#9BAEA4]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--color-amber)] flex-shrink-0" />
                <span>३० सेकंदात शेड नोंदणी</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] flex-shrink-0" />
                <span>शेडमध्ये विना-इंटरनेट (Offline)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)] flex-shrink-0" />
                <span>DPDP कायदा सुसंगत डेटा</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Farm Command Preview (Real Simulation) */}
          <div className="lg:col-span-5">
            <div className="bg-[var(--color-surface)] dark:bg-[#14221C] rounded-2xl border border-[var(--color-border)] dark:border-[#23372E] shadow-md p-5 sm:p-6 space-y-4">
              {/* Simulation Header with Flock Selector */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] dark:border-[#23372E]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-forest)] text-white flex items-center justify-center font-bold">
                    <Bird className="w-5 h-5 text-[var(--color-sage-pale)]" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-[var(--color-text-main)] dark:text-white">
                      सह्याद्री लेयर फार्म (थेट पूर्वावलोकन)
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)]">
                      BV300 लेयर • वय: ३४ आठवडे
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-[var(--color-background)] dark:bg-[#0E1713] p-0.5 rounded-lg border border-[var(--color-border)] dark:border-[#23372E] text-[11px] font-bold">
                  {[10000, 30000, 50000].map(birds => (
                    <button
                      key={birds}
                      type="button"
                      onClick={() => setFlockScale(birds)}
                      className={`px-2 py-0.5 rounded transition-all ${
                        flockScale === birds
                          ? 'bg-[var(--color-forest)] text-white shadow-xs'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                      }`}
                    >
                      {birds === 10000 ? '१०K' : birds === 30000 ? '३०K' : '५०K'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3-Second Break-even Status Banner */}
              <div className="p-3.5 rounded-xl bg-[var(--color-sage-pale)] dark:bg-[#1A2E24] border border-[var(--color-sage)]/40 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-forest)] dark:text-[var(--color-sage)]">
                    आजचा ब्रेक-इव्हन भाव (Break-Even)
                  </div>
                  <div className="text-xl font-black tabular-nums text-[var(--color-text-main)] dark:text-white mt-0.5">
                    ₹{breakEvenRate.toFixed(2)}{' '}
                    <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                      (₹{Math.round(breakEvenRate * 100)}/१०० अंडी)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-forest)] dark:text-[var(--color-sage)]">
                    आजचा निव्वळ नफा
                  </div>
                  <div className="text-xl font-black tabular-nums text-[var(--color-success)] dark:text-[#42BF87] mt-0.5">
                    {formatIndianCurrency(dailyOperatingProfit)}
                  </div>
                </div>
              </div>

              {/* Core Real Performance Metrics (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-2.5 text-left">
                <div className="p-3 rounded-xl bg-[var(--color-background)] dark:bg-[#192B23] border border-[var(--color-border)] dark:border-[#23372E]">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium">
                    <Egg className="w-3.5 h-3.5 text-[var(--color-amber)]" />
                    <span>अंडी संकलन</span>
                  </div>
                  <div className="text-lg font-black tabular-nums text-[var(--color-text-main)] dark:text-white mt-1">
                    {formatIndianNumber(eggsCollected)}
                  </div>
                  <div className="text-[10px] text-[var(--color-success)] font-semibold mt-0.5">
                    {(layingPct * 100).toFixed(1)}% HD उत्पादन
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--color-background)] dark:bg-[#192B23] border border-[var(--color-border)] dark:border-[#23372E]">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium">
                    <Wheat className="w-3.5 h-3.5 text-[var(--color-walnut)] dark:text-[var(--color-amber)]" />
                    <span>दैनिक खुराक</span>
                  </div>
                  <div className="text-lg font-black tabular-nums text-[var(--color-text-main)] dark:text-white mt-1">
                    {formatIndianNumber(feedKg)} <span className="text-xs font-normal">कि.ग्रा.</span>
                  </div>
                  <div className="text-[10px] text-[var(--color-text-muted)] font-medium mt-0.5">
                    {feedPerBirdG} ग्रॅम / पक्षी (६६ पोती)
                  </div>
                </div>
              </div>

              {/* Interactive Selling Rate Slider */}
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--color-text-main)] dark:text-white flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-[var(--color-amber)]" />
                    अंडी विक्री दर (बाजार भाव):
                  </span>
                  <span className="font-black tabular-nums text-[var(--color-forest)] dark:text-[var(--color-sage)]">
                    ₹{sellingRate.toFixed(2)} / अंडे
                  </span>
                </div>
                <input
                  type="range"
                  min="4.50"
                  max="6.50"
                  step="0.05"
                  value={sellingRate}
                  onChange={e => setSellingRate(parseFloat(e.target.value))}
                  className="w-full accent-[var(--color-forest)] cursor-pointer"
                  aria-label="Egg Selling Rate Slider"
                />
                <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-medium">
                  <span>₹४.५० (मंदी)</span>
                  <span>₹५.४० (सरासरी)</span>
                  <span>₹६.५० (तेजी)</span>
                </div>
              </div>

              {/* Mini CTA inside Preview */}
              <button
                type="button"
                onClick={onTryDemo}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#192B23] hover:bg-[var(--color-sage-pale)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-main)] dark:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>पूर्ण फार्म डॅशबोर्ड तपासा →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
