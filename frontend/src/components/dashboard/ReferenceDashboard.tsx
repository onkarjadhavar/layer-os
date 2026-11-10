'use client';

import React, { useState } from 'react';
import { NavTab } from '@/components/layout/Sidebar';
import { Link } from '@/components/common/Link';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  Building2,
  Check,
  LogOut,
  Globe,
  Sparkles,
  ClipboardCheck,
  ShoppingCart,
  TrendingUp,
  Wallet,
  HeartPulse,
  Brain,
  Layers,
  Calculator,
  Settings,
} from 'lucide-react';

interface ReferenceDashboardProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenNotifications?: () => void;
  onOpenHelp?: () => void;
  onOpenAbout?: () => void;
}

interface ModuleCardConfig {
  id: NavTab;
  title: string;
  subtitle: string;
  bgColor: string;
  iconSrc: string;
  iconFallback: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export function ReferenceDashboard({
  onSelectTab,
  onOpenNotifications,
  onOpenHelp,
  onOpenAbout,
}: ReferenceDashboardProps) {
  const { farm, farms, switchFarm, user, logout, alerts, isDatabaseConnected, isDemoMode } = useLayerOS();
  const { language, setLanguage, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFarmDropdown, setShowFarmDropdown] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.isResolved).length;

  // Resolve enrolled customer name entered during enrollment (or user profile)
  const customerName = React.useMemo(() => {
    const raw = user?.name || farm?.ownerName || '';
    if (!raw) return isDemoMode ? 'Onkar Jadhavar' : 'Farm Owner';
    // Remove any trailing role annotations like "(मालक)" or "(मालक - सह्याद्री डेमो)"
    const cleaned = raw.replace(/\s*\(.*?\)\s*/g, '').trim();
    return cleaned || raw;
  }, [user?.name, farm?.ownerName, isDemoMode]);

  // Derive dynamic initials for customer avatar circle (replaces static "OJ")
  const customerInitials = React.useMemo(() => {
    if (!customerName || customerName === 'Farm Owner') return 'FO';
    const parts = customerName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return customerName.substring(0, 2).toUpperCase();
  }, [customerName]);

  // Format today's date to match reference: "Mon, 10 Nov 2025"
  const formattedDate = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date());
    } catch {
      return 'Mon, 10 Nov 2025';
    }
  }, []);

  // EXACT 9 MODULES IN EXACT ORDER
  const moduleCards: ModuleCardConfig[] = [
    {
      id: 'quick-log',
      title: 'Farm Entry',
      subtitle: 'Add daily farm data',
      bgColor: '#E8F1C9', // Pale sage
      iconSrc: '/images/icons/icon-farm-entry.png',
      iconFallback: ClipboardCheck,
      accentColor: '#173F20',
    },
    {
      id: 'sales',
      title: 'Sales Management',
      subtitle: 'Eggs, Manure & Sales',
      bgColor: '#FBE5C2', // Warm peach
      iconSrc: '/images/icons/icon-sales.png',
      iconFallback: ShoppingCart,
      accentColor: '#9A5B1D',
    },
    {
      id: 'reports',
      title: 'Reports',
      subtitle: 'View Farm Reports',
      bgColor: '#E8F1C9', // Pale sage
      iconSrc: '/images/icons/icon-reports.png',
      iconFallback: TrendingUp,
      accentColor: '#173F20',
    },
    {
      id: 'expenses',
      title: 'Expense & Accounts',
      subtitle: 'Track Expenses',
      bgColor: '#FBE5C2', // Warm peach
      iconSrc: '/images/icons/icon-expenses.png',
      iconFallback: Wallet,
      accentColor: '#9A5B1D',
    },
    {
      id: 'health',
      title: 'Vaccine & Health',
      subtitle: 'Keep Flock Healthy',
      bgColor: '#E8F1C9', // Pale sage
      iconSrc: '/images/icons/icon-health.png',
      iconFallback: HeartPulse,
      accentColor: '#173F20',
    },
    {
      id: 'forecast',
      title: 'AI 30-Day Forecast',
      subtitle: 'Predict & Plan',
      bgColor: '#EADCF5', // Soft lavender
      iconSrc: '/images/icons/icon-forecast.png',
      iconFallback: Brain,
      accentColor: '#6B46C1',
    },
    {
      id: 'flocks',
      title: 'Feed Management',
      subtitle: 'Feed Records',
      bgColor: '#DCEBF2', // Pale blue
      iconSrc: '/images/icons/icon-feed.png',
      iconFallback: Layers,
      accentColor: '#2B6CB0',
    },
    {
      id: 'public-tools',
      title: 'Calculator & Tools',
      subtitle: 'Useful Tools',
      bgColor: '#FBE5C2', // Warm peach
      iconSrc: '/images/icons/icon-tools.png',
      iconFallback: Calculator,
      accentColor: '#9A5B1D',
    },
    {
      id: 'settings',
      title: 'Settings & Team',
      subtitle: 'Manage Farm',
      bgColor: '#E8F1C9', // Pale sage
      iconSrc: '/images/icons/icon-settings.png',
      iconFallback: Settings,
      accentColor: '#173F20',
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-4 sm:space-y-6">
      {/* Demo Mode Prospect Banner */}
      {isDemoMode && (
        <div className="w-full px-4 py-2.5 rounded-2xl bg-[#FBE5C2] border border-[#D5811F]/30 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-semibold text-[#625D50] shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#D5811F] text-white font-black text-[10px] uppercase tracking-wider">
              Live Demo
            </span>
            <span className="text-[#211F18] font-bold">
              तुम्ही सह्याद्री पोल्ट्री फार्मचा थेट डेमो पाहत आहात (Viewing Demo Farm)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/enroll"
              className="px-3.5 py-1.5 rounded-xl bg-[#173F20] hover:bg-[#12351B] text-white font-bold text-xs transition-colors shadow-2xs"
            >
              तुमच्या शेतीसाठी मोफत नोंदणी करा (Enroll Farm) →
            </Link>
            <Link
              href="/?landing=true"
              className="px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white text-[#211F18] font-semibold text-xs transition-colors"
            >
              मुख्य पान (Landing Page)
            </Link>
          </div>
        </div>
      )}
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP WORKSPACE HEADER (Hidden on mobile)
          "Hello, [Customer Name]!" | "Let's manage your poultry farm efficiently."
          [Date Pill] [Customer Avatar & Name with Dropdown]
      ────────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl xl:text-3xl font-extrabold text-[#211F18] dark:text-[#F8F6F0] tracking-tight">
            Hello, {customerName}!
          </h1>
          <p className="text-sm text-[#625D50] dark:text-[#A6B29C] font-medium mt-0.5">
            Let's manage your poultry farm efficiently.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Calendar Date Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#E8F1C9]/80 dark:bg-[#1A3024] border border-[#718B35]/20 text-xs font-semibold text-[#211F18] dark:text-[#E8F1C9] shadow-xs">
            <Calendar className="w-4 h-4 text-[#718B35]" />
            <span>{formattedDate}</span>
          </div>

          {/* User Profile Avatar with Customer Name & Dropdown */}
          <div className="relative">
            <button
              type="button"
              id="desktop-profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white/70 hover:bg-white dark:bg-[#1A3024] dark:hover:bg-[#234232] border border-[#718B35]/25 hover:border-[#718B35]/40 shadow-xs transition-all cursor-pointer group"
              title={customerName}
            >
              <div className="w-9 h-9 rounded-full bg-[#173F20] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white/80 shrink-0 group-hover:scale-105 transition-transform">
                {customerInitials}
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#211F18] dark:text-white max-w-[130px] xl:max-w-[170px] truncate text-left leading-tight">
                {customerName}
              </span>
              <ChevronDown className="w-4 h-4 text-[#625D50] dark:text-[#A6B29C] shrink-0 group-hover:text-[#211F18] transition-colors" />
            </button>

            {/* Profile & Farm Settings Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#103528] rounded-2xl shadow-2xl border border-[var(--layer-border)] dark:border-white/10 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="pb-3 border-b border-black/5 dark:border-white/10">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-9 h-9 rounded-full bg-[#173F20] text-white flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-white/80">
                      {customerInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#211F18] dark:text-white truncate">
                        {customerName}
                      </p>
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#E8F1C9] text-[#173F20] dark:bg-[#1A3024] dark:text-[#E8F1C9]">
                        {user?.role === 'owner' ? 'Farm Owner (नोंदणीकृत मालक)' : user?.role || 'Farm Owner'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#625D50] dark:text-white/70 font-medium truncate">
                    {farm.name} • {farm.district}
                  </p>
                </div>

                {/* Farm Switcher Quick Select */}
                <div className="py-2 border-b border-black/5 dark:border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold text-[#625D50] dark:text-white/70 mb-1.5 px-1">
                    <span>{t.switchFarm || 'Switch Farm'}</span>
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {farms.map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          switchFarm(f.id);
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          f.id === farm.id
                            ? 'bg-[#E8F1C9] text-[#173F20] font-bold'
                            : 'text-[#211F18] dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate">{f.name}</span>
                        {f.id === farm.id && <Check className="w-3.5 h-3.5 text-[#173F20] shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Preferences: Language & Theme */}
                <div className="py-2.5 border-b border-black/5 dark:border-white/10 flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#211F18] dark:text-white">
                    <Globe className="w-3.5 h-3.5 text-[#718B35]" />
                    <span className="font-semibold">Language</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {(['en', 'mr', 'hi'] as const).map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          language === lang
                            ? 'bg-[#173F20] text-white'
                            : 'text-[#625D50] dark:text-white/70 hover:bg-black/5'
                        }`}
                      >
                        {lang === 'en' ? 'EN' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="py-2 border-b border-black/5 dark:border-white/10 flex items-center justify-between px-1">
                  <span className="text-xs font-semibold text-[#211F18] dark:text-white">Theme</span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-[#211F18] dark:text-white hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                  </button>
                </div>

                {/* Logout Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      window.location.href = '/?landing=true';
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.logout || 'Log Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE COMPACT HEADER & GREETING (Shown on mobile only)
          [Emblem Layer OS] ... [Bell] [OJ Avatar]
          "Hello, Farm Owner!"
          "Let's manage your poultry farm efficiently."
      ────────────────────────────────────────────────────────────── */}
      <div className="lg:hidden flex flex-col space-y-3">
        {/* Compact Mobile Top Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-[#47532B]/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#173F20] p-1 flex items-center justify-center shrink-0">
              <img
                src="/images/layer-os-circular-logo.png"
                alt="Layer OS"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#173F20] dark:text-white leading-none">
              Layer OS
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="p-2 rounded-full text-[#211F18] dark:text-white hover:bg-black/5 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Mobile Profile Avatar & Customer Name */}
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 p-0.5 pr-2 rounded-full bg-white/80 dark:bg-[#1A3024] border border-[#718B35]/25 shadow-2xs cursor-pointer"
              title={customerName}
            >
              <div className="w-8 h-8 rounded-full bg-[#173F20] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-black/10 shrink-0">
                {customerInitials}
              </div>
              <span className="text-[11px] font-bold text-[#211F18] dark:text-white max-w-[80px] sm:max-w-[110px] truncate">
                {customerName}
              </span>
              <ChevronDown className="w-3 h-3 text-[#625D50] dark:text-[#A6B29C] shrink-0" />
            </button>
          </div>
        </div>

        {/* Mobile Greeting */}
        <div className="pt-1">
          <h1 className="text-xl font-extrabold text-[#211F18] dark:text-white tracking-tight">
            Hello, {customerName}!
          </h1>
          <p className="text-xs text-[#625D50] dark:text-[#A6B29C] font-medium mt-0.5">
            Let's manage your poultry farm efficiently.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. HERO BANNER: "Healthy Flock. Higher Profit."
          Desktop: Wide hero banner with poultry shed, hen & eggs
          Mobile: Art-directed cropped mobile banner
      ────────────────────────────────────────────────────────────── */}
      <div className="w-full">
        {/* Desktop Wide Banner */}
        <div className="hidden lg:block w-full rounded-[24px] overflow-hidden shadow-[0_4px_16px_rgba(54,55,31,0.08)] border border-[#47532B]/15 bg-[#FFF8EA]">
          <img
            src="/images/hero-banner-full.png"
            alt="Healthy Flock. Higher Profit. - Layer OS Poultry Farm Management"
            className="w-full h-auto object-cover select-none pointer-events-none"
          />
        </div>

        {/* Mobile Cropped Banner */}
        <div className="lg:hidden w-full rounded-2xl overflow-hidden shadow-sm border border-[#47532B]/15 bg-[#FFF8EA]">
          <img
            src="/images/hero-mobile-banner.png"
            alt="Healthy Flock. Higher Profit."
            className="w-full h-auto object-cover select-none pointer-events-none"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE DATE ROW (Shown on mobile below hero)
      ────────────────────────────────────────────────────────────── */}
      <div className="lg:hidden flex justify-center py-0.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F1C9]/80 dark:bg-[#1A3024] border border-[#718B35]/20 text-xs font-semibold text-[#211F18] dark:text-[#E8F1C9] shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#718B35]" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. THE EXACT NINE FUNCTIONAL MODULE CARDS
          Desktop: 3-column × 3-row grid with horizontal layout
          Mobile: 2-column grid for cards 1-8, with Settings & Team
                  spanning both columns at the bottom (col-span-2)
      ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        {moduleCards.map((card, idx) => {
          const FallbackIcon = card.iconFallback;
          const isCardNine = idx === 8; // Settings & Team

          return (
            <button
              key={card.id}
              type="button"
              id={`dashboard-card-${card.id}`}
              onClick={() => onSelectTab(card.id)}
              style={{ backgroundColor: card.bgColor }}
              className={`group relative text-left rounded-[20px] border border-[var(--layer-border)] shadow-[var(--layer-shadow)] hover:shadow-[0_8px_24px_rgba(54,55,31,0.14)] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer overflow-hidden ${
                isCardNine
                  ? 'col-span-2 lg:col-span-1 p-3.5 sm:p-5 flex items-center justify-between'
                  : 'p-3.5 sm:p-5 flex flex-col items-center justify-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left'
              }`}
            >
              {/* Content Container */}
              <div
                className={`flex items-center gap-3 sm:gap-4 min-w-0 ${
                  isCardNine
                    ? 'flex-row'
                    : 'flex-col lg:flex-row items-center lg:items-center'
                }`}
              >
                {/* Icon Container with Crop and SVG Fallback */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden">
                  <img
                    src={card.iconSrc}
                    alt={card.title}
                    onError={e => {
                      // If cropped png is missing, fallback to hidden
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-contain pointer-events-none transition-transform group-hover:scale-105"
                  />
                  {/* Vector fallback if image fails */}
                  <FallbackIcon className="w-7 h-7 text-[#173F20] absolute opacity-0 group-only:opacity-100" />
                </div>

                {/* Title & Subtitle */}
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-[#211F18] tracking-tight leading-snug truncate">
                    {card.title}
                  </h3>
                  <p className="hidden lg:block text-xs text-[#625D50] font-medium leading-relaxed truncate mt-0.5">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              {/* Right Arrow / Chevron Affordance (Always on desktop; on mobile for Card 9) */}
              <div
                className={`items-center justify-center shrink-0 ${
                  isCardNine ? 'flex' : 'hidden lg:flex'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-white/40 flex items-center justify-center text-[#211F18]/60 group-hover:text-[#211F18] group-hover:bg-white/70 group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. SLIM AGRICULTURAL LANDSCAPE ILLUSTRATION STRIP
          Runs along the bottom of the main workspace canvas
      ────────────────────────────────────────────────────────────── */}
      <div className="w-full pt-2 sm:pt-4">
        <div className="w-full rounded-2xl overflow-hidden opacity-95">
          <img
            src="/images/bottom-landscape-strip.png"
            alt="Layer OS Agricultural Landscape"
            className="w-full h-auto object-cover select-none pointer-events-none rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}

export default ReferenceDashboard;

