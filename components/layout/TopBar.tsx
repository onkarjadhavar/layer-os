'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import {
  Bell,
  Globe,
  UserCheck,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
  Building2,
  Check,
  Sun,
  Moon,
  Home,
  ShieldCheck,
} from 'lucide-react';

interface TopBarProps {
  onOpenNotifications?: () => void;
}

export function TopBar({ onOpenNotifications }: TopBarProps) {
  const {
    farm,
    farms,
    switchFarm,
    flock,
    user,
    switchRole,
    isDemoMode,
    isDatabaseConnected,
    resetDemoData,
    alerts,
  } = useLayerOS();
  const { language, setLanguage, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const [showFarmDropdown, setShowFarmDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.isResolved).length;

  const roles: Array<{
    key: 'owner' | 'manager' | 'supervisor' | 'accountant' | 'viewer';
    label: string;
  }> = [
    { key: 'owner', label: t.roleOwner },
    { key: 'manager', label: t.roleManager },
    { key: 'supervisor', label: t.roleSupervisor },
    { key: 'accountant', label: t.roleAccountant },
    { key: 'viewer', label: t.roleViewer },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#16241D]/95 backdrop-blur-md border-b border-[#E7E2D6] dark:border-[#263B30] px-3 sm:px-4 py-2 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Farm Avatar & Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1F4D3A] text-white flex items-center justify-center font-black text-base sm:text-lg shadow-sm flex-shrink-0">
            🐔
          </div>
          <div className="min-w-0 relative">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setShowFarmDropdown(!showFarmDropdown);
                  setShowRoleDropdown(false);
                  setShowLangDropdown(false);
                }}
                className="group flex items-center gap-1 text-left text-sm sm:text-base font-black text-[#0B1E15] dark:text-white hover:text-[#1F4D3A] dark:hover:text-[#42BF87] transition-colors truncate"
                title={t.switchFarm}
              >
                <span className="truncate">{farm.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#2D4538] dark:text-[#CBDCD4] group-hover:text-[#1F4D3A] flex-shrink-0 transition-transform" />
              </button>

              {isDemoMode ? (
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCF6E9] dark:bg-[#2E2413] text-[#B07B18] dark:text-[#E5B252] border border-[#D9A441]/40">
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  {t.demoBadge}
                </span>
              ) : isDatabaseConnected ? (
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40">
                  {t.postgresLive}
                </span>
              ) : null}
            </div>

            {/* Farm Switcher Dropdown */}
            {showFarmDropdown && (
              <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#16241D] rounded-2xl shadow-2xl border border-[#DCD3C3] dark:border-[#263B30] py-2 z-50">
                <div className="px-3.5 py-1.5 text-[11px] font-black text-[#2D4538] dark:text-[#CBDCD4] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E7E2D6]/60 dark:border-[#263B30]">
                  <Building2 className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#42BF87]" />
                  <span>{t.selectFarmTitle}</span>
                </div>
                <div className="divide-y divide-[#E7E2D6]/40 dark:divide-[#263B30]/40 my-1 max-h-60 overflow-y-auto">
                  {farms.map(f => {
                    const isCurrent = f.id === farm.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          switchFarm(f.id);
                          setShowFarmDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between gap-2 hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] transition-colors ${
                          isCurrent
                            ? 'bg-[#EAF3EF] dark:bg-[#182B22] text-[#1F4D3A] dark:text-[#42BF87] font-black'
                            : 'text-[#0B1E15] dark:text-white font-medium'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold truncate">{f.name}</p>
                          <p className="text-[11px] text-[#55695F] dark:text-[#A1B3AA] truncate">
                            {f.district} • {f.totalCapacity.toLocaleString('en-IN')} {t.birdCapacity}
                          </p>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 text-[#1F4D3A] dark:text-[#42BF87] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-1.5 border-t border-[#E7E2D6]/60 dark:border-[#263B30] px-2 flex flex-col gap-1">
                  <Link
                    href="/enroll"
                    onClick={() => setShowFarmDropdown(false)}
                    className="w-full text-left px-2 py-1.5 text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] hover:bg-[#EAF3EF] dark:hover:bg-[#182B22] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>+ {t.landingEnrollBtn}</span>
                  </Link>
                  <Link
                    href="/?landing=true"
                    onClick={() => setShowFarmDropdown(false)}
                    className="w-full text-left px-2 py-1.5 text-xs font-bold text-[#55695F] dark:text-[#A1B3AA] hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>🏠 {t.appName} {t.samplePreviewTitle.split(' ')[0]}</span>
                  </Link>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium truncate">
              <span className="flex items-center gap-1 font-bold text-[#1F4D3A] dark:text-[#42BF87]">
                <Layers className="w-3 h-3 flex-shrink-0" />
                <span>{flock.batchCode}</span>
                <span className="text-[#55695F] dark:text-[#A1B3AA]">
                  ({flock.ageWeeks} {t.weeks} • {flock.currentBirdCount.toLocaleString('en-IN')} {t.birds})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Controls (Role, Language, Theme, Alerts) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Demo Reset Button (Desktop Only) */}
          {isDemoMode && (
            <button
              type="button"
              onClick={resetDemoData}
              title={t.resetDemoData}
              className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] border border-[#DCD3C3] dark:border-[#263B30] transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-[#D9A441]" />
              <span>{t.resetDemoData}</span>
            </button>
          )}

          {/* Role Switcher */}
          <div className="relative">
            <button
              type="button"
              aria-label="switch-role"
              data-testid="role-toggle"
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowLangDropdown(false);
                setShowFarmDropdown(false);
              }}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#1F4D3A] dark:text-[#42BF87] border border-[#DCD3C3] dark:border-[#263B30] hover:border-[#1F4D3A] transition-colors touch-target"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline capitalize font-black">{user?.role}</span>
              <ChevronDown className="w-3 h-3 text-[#2D4538] dark:text-[#CBDCD4]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#16241D] rounded-2xl shadow-xl border border-[#DCD3C3] dark:border-[#263B30] py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-black text-[#2D4538] dark:text-[#CBDCD4] uppercase tracking-wider border-b border-[#E7E2D6]/60 dark:border-[#263B30]">
                  {t.switchRoleTitle}
                </div>
                {roles.map(r => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      switchRole(r.key);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] transition-colors ${
                      user?.role === r.key
                        ? 'font-black text-[#1F4D3A] dark:text-[#42BF87] bg-[#EAF3EF] dark:bg-[#182B22]'
                        : 'text-[#0B1E15] dark:text-white font-medium'
                    }`}
                  >
                    <span>{r.label}</span>
                    {user?.role === r.key && <span className="text-xs font-black">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Return to Public Homepage Button */}
          <Link
            href="/?landing=true"
            id="btn-back-to-home"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white border border-[#DCD3C3] dark:border-[#263B30] hover:border-[#1F4D3A] dark:hover:border-[#42BF87] hover:text-[#1F4D3A] dark:hover:text-[#42BF87] transition-all touch-target"
            title={t.backToHome}
          >
            <Home className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#42BF87]" />
            <span className="hidden sm:inline">{t.backToHome}</span>
          </Link>

          {/* Platform Admin Console Button */}
          <Link
            href="/admin/login"
            id="topbar-btn-admin-login"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white border border-[#DCD3C3] dark:border-[#263B30] hover:border-[#1F4D3A] dark:hover:border-[#42BF87] hover:text-[#1F4D3A] dark:hover:text-[#42BF87] transition-all touch-target"
            title="Platform Admin Login"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#42BF87]" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          {/* Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowRoleDropdown(false);
                setShowFarmDropdown(false);
              }}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-black rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white border border-[#DCD3C3] dark:border-[#263B30] hover:border-[#D9A441] transition-colors touch-target"
            >
              <Globe className="w-3.5 h-3.5 text-[#D9A441]" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-[#2D4538] dark:text-[#CBDCD4]" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#16241D] rounded-2xl shadow-xl border border-[#DCD3C3] dark:border-[#263B30] py-1.5 z-50">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('mr');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] transition-colors ${
                    language === 'mr'
                      ? 'font-black text-[#1F4D3A] dark:text-[#42BF87] bg-[#EAF3EF] dark:bg-[#182B22]'
                      : 'text-[#0B1E15] dark:text-white'
                  }`}
                >
                  <span>मराठी (MR)</span>
                  {language === 'mr' && <span className="font-bold">✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('en');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] transition-colors ${
                    language === 'en'
                      ? 'font-black text-[#1F4D3A] dark:text-[#42BF87] bg-[#EAF3EF] dark:bg-[#182B22]'
                      : 'text-[#0B1E15] dark:text-white'
                  }`}
                >
                  <span>English (EN)</span>
                  {language === 'en' && <span className="font-bold">✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('hi');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] transition-colors ${
                    language === 'hi'
                      ? 'font-black text-[#1F4D3A] dark:text-[#42BF87] bg-[#EAF3EF] dark:bg-[#182B22]'
                      : 'text-[#0B1E15] dark:text-white'
                  }`}
                >
                  <span>हिंदी (HI)</span>
                  {language === 'hi' && <span className="font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button (Light/Dark) */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#0B1E15] dark:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] border border-[#DCD3C3] dark:border-[#263B30] transition-colors touch-target flex items-center justify-center cursor-pointer"
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D9A441]" />
            ) : (
              <Moon className="w-4 h-4 text-[#1F4D3A]" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-[#0B1E15] dark:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] border border-[#DCD3C3] dark:border-[#263B30] transition-colors touch-target flex items-center justify-center"
            title={t.alertsTitle}
          >
            <Bell className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B3382C] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                {unreadAlerts}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
