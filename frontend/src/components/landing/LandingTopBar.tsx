'use client';

import React from 'react';
import { Link } from '@/components/common/Link';
import { useI18n } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ArrowRight, User, Sparkles } from 'lucide-react';

interface LandingTopBarProps {
  onLogin?: () => void;
}

export function LandingTopBar({ onLogin }: LandingTopBarProps = {}) {
  const { language, setLanguage, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)]/95 dark:bg-[#14221C]/95 backdrop-blur-md border-b border-[var(--color-border)] dark:border-[#23372E] px-4 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Layer OS Home">
          <img
            src="/images/layer-os-circular-logo.png"
            alt="Layer OS Circular Logo"
            width={40}
            height={40}
            className="w-[34px] h-[34px] sm:w-[40px] sm:h-[40px] object-contain shrink-0 transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col leading-none select-none">
            <div className="text-lg sm:text-xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white flex items-center">
              Layer<span className="text-[var(--color-amber)] ml-0.5">OS</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--color-text-muted)] dark:text-[var(--color-sage)] uppercase tracking-wider mt-0.5">
              Poultry ERP
            </span>
          </div>
        </Link>

        {/* Right Navigation & Trilingual Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Trilingual Segment Control */}
          <LanguageSwitcher variant="segment" />

          {/* Prospective Customer Live Demo Link */}
          <Link
            id="landing-topbar-demo-btn"
            href="/?demo=true"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-[var(--color-forest)] dark:text-[#A6C48A] hover:bg-[var(--color-sage-pale)] dark:hover:bg-[#1A2D23] transition-colors min-h-[40px] border border-[var(--color-forest)]/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-amber)]" />
            <span>{language === 'mr' ? 'डेमो पहा' : language === 'hi' ? 'डेमो देखें' : 'View Demo'}</span>
          </Link>

          {/* Existing User Login Button */}
          <Link
            id="landing-topbar-login-btn"
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[var(--color-forest)] dark:text-[var(--color-amber)] hover:bg-[var(--color-sage-pale)]/50 dark:hover:bg-[#1A2D23] transition-colors min-h-[40px]"
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
