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

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#16241D]/95 backdrop-blur-md border-b border-[#E7E2D6] dark:border-[#263B30] px-4 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#1F4D3A] text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-[#D9A441] group-hover:scale-105 transition-transform">
            🥚
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#0B1E15] dark:text-white tracking-tight leading-none">
              Layer<span className="text-[#D9A441]">OS</span>
            </span>
            <span className="text-[10px] font-bold text-[#6B7A72] dark:text-[#A3B899] tracking-wider uppercase">
              Poultry ERP
            </span>
          </div>
        </Link>

        {/* Right Navigation & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Trilingual Switcher */}
          <div className="flex items-center bg-[#FAF8F3] dark:bg-[#0F1A15] p-1 rounded-xl border border-[#E7E2D6] dark:border-[#263B30]">
            {(['mr', 'hi', 'en'] as Language[]).map(lang => (
              <button
                key={lang}
                id={`landing-lang-${lang}`}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all min-h-[32px] ${
                  language === lang
                    ? 'bg-[#1F4D3A] text-white shadow-sm'
                    : 'text-[#6B7A72] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white'
                }`}
              >
                {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>

          {/* Small Admin Login Icon Button */}
          <Link
            id="landing-topbar-admin-btn"
            href="/admin/login"
            title="Platform Admin Login"
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] hover:bg-[#FAF8F3] dark:hover:bg-[#1F2E26] border border-[#E7E2D6] dark:border-[#263B30] hover:border-[#1F4D3A] dark:hover:border-[#42BF87] transition-all flex items-center gap-1.5 min-h-[38px] group"
          >
            <ShieldCheck className="w-4 h-4 text-[#1F4D3A] dark:text-[#42BF87] group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Admin</span>
          </Link>

          {/* Login Button */}
          <Link
            id="landing-topbar-login-btn"
            href="/login"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold text-[#1F4D3A] dark:text-[#D9A441] hover:bg-[#FAF8F3] dark:hover:bg-[#1F2E26] transition-colors min-h-[44px]"
          >
            {t.landingLoginBtn}
          </Link>

          {/* Enroll CTA Button */}
          <Link
            id="landing-topbar-enroll-btn"
            href="/enroll"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-black text-white bg-[#1F4D3A] hover:bg-[#173A2C] shadow-md hover:shadow-lg transition-all min-h-[44px] border-b-2 border-[#122A20]"
          >
            <span>{t.landingEnrollBtn}</span>
            <ArrowRight className="w-4 h-4 text-[#D9A441]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
