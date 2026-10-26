'use client';

import React from 'react';
import { Link } from '@/components/common/Link';
import { useI18n } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';
import { LayerOSLogo } from '@/components/common/LayerOSLogo';
import { ArrowRight, ShieldCheck, User } from 'lucide-react';

interface LandingTopBarProps {
  onTryDemo?: () => void;
}

export function LandingTopBar({ onTryDemo }: LandingTopBarProps) {
  const { language, setLanguage, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)]/95 dark:bg-[#14221C]/95 backdrop-blur-md border-b border-[var(--color-border)] dark:border-[#23372E] px-4 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <LayerOSLogo size={38} showText />
        </Link>

        {/* Right Navigation & Trilingual Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Trilingual Segment Control */}
          <div className="flex items-center bg-[var(--color-background)] dark:bg-[#0E1713] p-1 rounded-xl border border-[var(--color-border)] dark:border-[#23372E]">
            {(['mr', 'hi', 'en'] as Language[]).map(lang => (
              <button
                key={lang}
                id={`landing-lang-${lang}`}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all min-h-[32px] ${
                  language === lang
                    ? 'bg-[var(--color-forest)] text-white shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] dark:hover:text-white'
                }`}
              >
                {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>

          {/* Admin Portal Entry */}
          <Link
            id="landing-topbar-admin-btn"
            href="/admin/login"
            title="Platform Admin Login"
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-bold text-[var(--color-text-main)] dark:text-white hover:bg-[var(--color-surface-subtle)] dark:hover:bg-[#1A2D23] border border-[var(--color-border)] dark:border-[#23372E] transition-all flex items-center gap-1.5 min-h-[38px] group"
          >
            <ShieldCheck className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)] group-hover:scale-105 transition-transform" />
            <span className="hidden md:inline">Admin</span>
          </Link>

          {/* Existing User Login Button */}
          <Link
            id="landing-topbar-login-btn"
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[var(--color-forest)] dark:text-[var(--color-amber)] hover:bg-[var(--color-sage-pale)]/50 dark:hover:bg-[#1A2D23] transition-colors min-h-[40px]"
          >
            <User className="w-4 h-4" />
            <span>{t.landingLoginBtn}</span>
          </Link>

          {/* Primary Farm Enrollment CTA */}
          <Link
            id="landing-topbar-enroll-btn"
            href="/enroll"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[var(--color-forest)] hover:bg-[#143F2F] shadow-sm hover:shadow transition-all min-h-[40px] border border-[var(--color-forest-deep)]"
          >
            <span>{t.landingEnrollBtn}</span>
            <ArrowRight className="w-4 h-4 text-[var(--color-amber)]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
export default LandingTopBar;
