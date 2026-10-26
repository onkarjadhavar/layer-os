'use client';

import React from 'react';
import { Link } from '@/components/common/Link';
import { useI18n } from '@/lib/i18n/context';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Zap, PlayCircle } from 'lucide-react';

interface HeroSectionProps {
  onTryDemo: () => void;
}

export function HeroSection({ onTryDemo }: HeroSectionProps) {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-14 sm:pb-20 px-3.5 sm:px-4 bg-gradient-to-b from-[#FAF8F3] via-white to-[#FAF8F3] dark:from-[#0F1A15] dark:via-[#16241D] dark:to-[#0F1A15]">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[220px] sm:h-[300px] bg-[#D9A441]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#1F4D3A]/10 dark:bg-[#3BA378]/20 border border-[#1F4D3A]/20 dark:border-[#3BA378]/30 mb-4 sm:mb-6 max-w-full">
          <span className="text-sm sm:text-base flex-shrink-0">🥚</span>
          <span className="text-[11px] sm:text-xs md:text-sm font-black text-[#1F4D3A] dark:text-[#64D8A1] tracking-wide text-center">
            {t.appName} — {t.tagline}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0B1E15] dark:text-white tracking-tight leading-[1.2] mb-3 sm:mb-5 max-w-3xl mx-auto">
          {t.heroHeadline}
        </h1>

        {/* One-line Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-[#3D5248] dark:text-[#CBDCD4] max-w-2xl mx-auto font-medium leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
          {t.heroSubtitle}
        </p>

        {/* Primary CTA Block / Card */}
        <div className="bg-white dark:bg-[#1A2D24] p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-[#E7E2D6] dark:border-[#263B30] max-w-lg mx-auto">
          {/* Main Enroll Button */}
          <Link
            id="landing-hero-enroll-btn"
            href="/enroll"
            className="w-full flex items-center justify-center gap-2.5 sm:gap-3 py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg font-black text-white bg-[#1F4D3A] hover:bg-[#173A2C] shadow-md hover:shadow-xl transition-all duration-200 border-b-4 border-[#122A20] group min-h-[50px] sm:min-h-[54px]"
          >
            <span>{t.heroEnrollCta}</span>
            <ArrowRight className="w-5 h-5 text-[#D9A441] group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Sub Actions: Login & Try Demo */}
          <div className="mt-3.5 pt-3.5 sm:mt-4 sm:pt-4 border-t border-[#E7E2D6]/70 dark:border-[#263B30] flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs sm:text-sm">
            <Link
              id="landing-hero-login-link"
              href="/login"
              className="font-bold text-[#1F4D3A] dark:text-[#64D8A1] hover:underline flex items-center justify-center gap-1.5 py-1 min-h-[38px] text-center"
            >
              <span>{t.heroAlreadyRegistered}</span>
            </Link>

            <button
              id="landing-hero-demo-btn"
              type="button"
              onClick={onTryDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-[#B07B18] dark:text-[#E5B252] bg-[#FCF6E9] dark:bg-[#2A2315] border border-[#D9A441]/40 hover:bg-[#F7EDD6] transition-colors min-h-[38px]"
            >
              <PlayCircle className="w-4 h-4 text-[#D9A441]" />
              <span>{t.heroTryDemo}</span>
            </button>
          </div>
        </div>

        {/* Trust Badges below CTA: Neat rounded badges */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-[#5A6E64] dark:text-[#9FB1A7]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-[#16241D]/70 border border-[#E7E2D6] dark:border-[#263B30] shadow-xs">
            <Zap className="w-4 h-4 text-[#D9A441] flex-shrink-0" />
            <span>३० सेकंदात दैनिक नोंद (30-Sec Log)</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-[#16241D]/70 border border-[#E7E2D6] dark:border-[#263B30] shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D5B] flex-shrink-0" />
            <span>ऑफलाइन PWA (Works Without Net)</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-[#16241D]/70 border border-[#E7E2D6] dark:border-[#263B30] shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#1F4D3A] dark:text-[#42BF87] flex-shrink-0" />
            <span>DPDP सुरक्षित व स्वतंत्र डेटा</span>
          </div>
        </div>
      </div>
    </section>
  );
}
