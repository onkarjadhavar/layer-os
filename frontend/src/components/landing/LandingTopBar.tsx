'use client';

import React from 'react';
import { Link } from '@/components/common/Link';
import { useI18n } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';
import { Globe, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

interface LandingTopBarProps {
  onTryDemo?: () => void;
}

export function LandingTopBar({ onTryDemo }: LandingTopBarProps) {
  const { language, setLanguage, t } = useI18n();

  const shortEnrollLabel =
    language === 'mr' ? 'नोंदणी' : language === 'hi' ? 'पंजीकरण' : 'Enroll';

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#16241D]/95 backdrop-blur-md border-b border-[#E7E2D6] dark:border-[#263B30] px-3 sm:px-6 py-2.5 sm:py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo - Never wraps */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0 select-none">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#1F4D3A] text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-sm border-2 border-[#D9A441] group-hover:scale-105 transition-transform flex-shrink-0">
            🥚
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-lg sm:text-xl font-black text-[#0B1E15] dark:text-white tracking-tight leading-none whitespace-nowrap">
              Layer<span className="text-[#D9A441]">OS</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-[#6B7A72] dark:text-[#A3B899] tracking-wider uppercase mt-0.5 whitespace-nowrap">
              Poultry ERP
            </span>
          </div>
        </Link>

        {/* Right Navigation & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Trilingual Switcher: Neat pill with whitespace-nowrap */}
          <div className="flex items-center bg-[#FAF8F3] dark:bg-[#0F1A15] p-0.5 sm:p-1 rounded-xl border border-[#E7E2D6] dark:border-[#263B30] flex-shrink-0 shadow-xs">
            {(['mr', 'hi', 'en'] as Language[]).map(lang => (
              <button
                key={lang}
                id={`landing-lang-${lang}`}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all whitespace-nowrap min-h-[30px] sm:min-h-[32px] flex items-center justify-center ${
                  language === lang
                    ? 'bg-[#1F4D3A] text-white shadow-xs font-black'
                    : 'text-[#6B7A72] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white'
                }`}
              >
                {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'EN'}
              </button>
            ))}
          </div>

          {/* Superadmin Login Icon Button */}
          <Link
            id="landing-topbar-admin-btn"
            href="/admin/login"
            title="Platform Superadmin Login"
            className="p-1.5 sm:px-2.5 sm:py-2 rounded-xl text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] hover:bg-[#FAF8F3] dark:hover:bg-[#1F2E26] border border-[#E7E2D6] dark:border-[#263B30] hover:border-[#1F4D3A] dark:hover:border-[#42BF87] transition-all flex items-center gap-1 min-h-[30px] sm:min-h-[38px] flex-shrink-0 group"
          >
            <ShieldCheck className="w-4 h-4 text-[#1F4D3A] dark:text-[#42BF87] group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Admin</span>
          </Link>

          {/* Farmer Login Button (Desktop / Tablet) */}
          <Link
            id="landing-topbar-login-btn"
            href="/login"
            className="hidden md:inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-bold text-[#1F4D3A] dark:text-[#D9A441] hover:bg-[#FAF8F3] dark:hover:bg-[#1F2E26] transition-colors whitespace-nowrap min-h-[38px]"
          >
            {t.landingLoginBtn}
          </Link>

          {/* Enroll CTA Button: Compact on mobile, full text on tablet/desktop */}
          <Link
            id="landing-topbar-enroll-btn"
            href="/enroll"
            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-[#1F4D3A] hover:bg-[#173A2C] shadow-sm hover:shadow-lg transition-all min-h-[32px] sm:min-h-[42px] border-b-2 border-[#122A20] flex-shrink-0 whitespace-nowrap"
          >
            <span className="sm:hidden">{shortEnrollLabel}</span>
            <span className="hidden sm:inline">{t.landingEnrollBtn}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D9A441]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
