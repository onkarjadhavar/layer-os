'use client';

import React, { useState } from 'react';
import { Link } from '@/components/common/Link';
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
  LogOut,
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
    logout,
  } = useLayerOS();
  const { language, setLanguage, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

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
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#16241D]/95 backdrop-blur-md border-b border-[#E7E2D6] dark:border-[#263B30] px-3 sm:px-5 py-2 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Farm Avatar, Name & Flock info */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 sm:flex-initial">
          <Link
            href="/"
            title="मुख्य पानावर जा (Go to Home Landing Page)"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1F4D3A] text-white flex items-center justify-center font-black text-base sm:text-lg shadow-sm flex-shrink-0 hover:scale-105 transition-transform"
          >
            🐔
          </Link>
          <div className="min-w-0 relative">
            <div className="flex items-center gap-1.5 min-w-0">
              {isDemoMode ? (
                <>
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
                    <span className="truncate max-w-[130px] sm:max-w-xs">{farm.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#2D4538] dark:text-[#CBDCD4] group-hover:text-[#1F4D3A] flex-shrink-0 transition-transform" />
                  </button>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCF6E9] dark:bg-[#2E2413] text-[#B07B18] dark:text-[#E5B252] border border-[#D9A441]/40 flex-shrink-0">
                    <Sparkles className="w-2.5 h-2.5 mr-1" />
                    {t.demoBadge}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm sm:text-base font-black text-[#0B1E15] dark:text-white truncate max-w-[130px] sm:max-w-xs">
                    {farm.name}
                  </span>
                  {/* Compact Live Dot on Mobile, Full Pill on Tablet/Desktop */}
                  <span className="sm:hidden inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 flex-shrink-0">
                    {t.postgresLive || "माझा फार्म (Live)"}
                  </span>
                </div>
              )}
            </div>

            {/* Farm Switcher Dropdown - Demo Mode Only */}
            {isDemoMode && showFarmDropdown && (
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

            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#55695F] dark:text-[#CBDCD4] font-medium truncate mt-0.5">
              <span className="font-bold text-[#1F4D3A] dark:text-[#42BF87] truncate">
                {flock.batchCode}
              </span>
              <span>•</span>
              <span className="truncate">
                {flock.currentBirdCount.toLocaleString('en-IN')} {t.birds}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Controls - Cleanly partitioned for Mobile & Desktop */}
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

          {/* Return to Public Homepage Button (Desktop only) */}
          <Link
            href="/?landing=true"
            id="btn-back-to-home"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white border border-[#DCD3C3] dark:border-[#263B30] hover:border-[#1F4D3A] dark:hover:border-[#42BF87] hover:text-[#1F4D3A] dark:hover:text-[#42BF87] transition-all touch-target"
            title={t.backToHome}
          >
            <Home className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#42BF87]" />
            <span>{t.backToHome}</span>
          </Link>

          {/* Platform Admin Console Button (Desktop only) */}
          <Link
            href="/admin/login"
            id="topbar-btn-admin-login"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white border border-[#DCD3C3] dark:border-[#263B30] hover:border-[#1F4D3A] dark:hover:border-[#42BF87] hover:text-[#1F4D3A] dark:hover:text-[#42BF87] transition-all touch-target"
            title="Platform Admin Login"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#42BF87]" />
            <span>Admin</span>
          </Link>

          {/* Theme Toggle Button (Desktop only) */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={toggleTheme}
            className="hidden sm:flex p-2 rounded-xl text-[#0B1E15] dark:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] border border-[#DCD3C3] dark:border-[#263B30] transition-colors touch-target items-center justify-center cursor-pointer min-h-[36px] min-w-[36px]"
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D9A441]" />
            ) : (
              <Moon className="w-4 h-4 text-[#1F4D3A]" />
            )}
          </button>

          {/* Logout Button (Desktop only) */}
          <button
            type="button"
            id="topbar-btn-logout"
            onClick={handleLogout}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-800 transition-all touch-target cursor-pointer min-h-[36px]"
            title="लॉगआउट (Logout)"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>लॉगआउट</span>
          </button>

          {/* 1. Language Switcher (Visible on Mobile & Desktop) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowRoleDropdown(false);
                setShowFarmDropdown(false);
              }}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-black rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white border border-[#DCD3C3] dark:border-[#263B30] hover:border-[#D9A441] transition-colors touch-target whitespace-nowrap min-h-[36px]"
            >
              <Globe className="w-3.5 h-3.5 text-[#D9A441] flex-shrink-0" />
              <span className="uppercase text-[11px] sm:text-xs font-black">{language}</span>
              <ChevronDown className="w-3 h-3 text-[#2D4538] dark:text-[#CBDCD4] flex-shrink-0" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#16241D] rounded-2xl shadow-xl border border-[#DCD3C3] dark:border-[#263B30] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
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

          {/* 2. Notifications Bell (Visible on Mobile & Desktop) */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-[#0B1E15] dark:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] border border-[#DCD3C3] dark:border-[#263B30] transition-colors touch-target flex items-center justify-center min-h-[36px] min-w-[36px]"
            title={t.alertsTitle}
          >
            <Bell className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B3382C] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* 3. Farmer Profile & Action Menu (Mobile & Desktop) */}
          <div className="relative">
            <button
              type="button"
              aria-label="farmer-profile-menu"
              data-testid="role-toggle"
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowLangDropdown(false);
                setShowFarmDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#1F4D3A] dark:text-[#42BF87] border border-[#DCD3C3] dark:border-[#263B30] hover:border-[#1F4D3A] transition-colors touch-target min-h-[36px]"
            >
              <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline capitalize font-black text-xs">{user?.role}</span>
              <ChevronDown className="w-3 h-3 text-[#2D4538] dark:text-[#CBDCD4] flex-shrink-0" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#16241D] rounded-2xl shadow-2xl border border-[#DCD3C3] dark:border-[#263B30] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Farmer Info Header */}
                <div className="px-3.5 py-2 border-b border-[#E7E2D6]/70 dark:border-[#263B30]">
                  <p className="text-xs font-black text-[#0B1E15] dark:text-white truncate">
                    {user?.name || farm.ownerName || 'शेतकरी मालक'}
                  </p>
                  <p className="text-[11px] text-[#55695F] dark:text-[#CBDCD4] mt-0.5">
                    {user?.phone ? `📱 ${user.phone}` : farm.phone} • <span className="capitalize font-bold text-[#1F4D3A] dark:text-[#42BF87]">{user?.role}</span>
                  </p>
                </div>

                {/* Role Switcher */}
                <div className="px-3.5 py-1.5 text-[10px] font-black text-[#55695F] dark:text-[#CBDCD4] uppercase tracking-wider">
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
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] transition-colors ${
                      user?.role === r.key
                        ? 'font-black text-[#1F4D3A] dark:text-[#42BF87] bg-[#EAF3EF] dark:bg-[#182B22]'
                        : 'text-[#0B1E15] dark:text-white font-medium'
                    }`}
                  >
                    <span>{r.label}</span>
                    {user?.role === r.key && <span className="text-xs font-black text-[#1F4D3A] dark:text-[#42BF87]">✓</span>}
                  </button>
                ))}

                {/* Mobile Quick Links: Theme, Home, Admin, Logout */}
                <div className="pt-2 mt-1 border-t border-[#E7E2D6]/70 dark:border-[#263B30] px-2 flex flex-col gap-1">
                  {/* Theme Toggle (Mobile in dropdown) */}
                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme();
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-bold text-[#0B1E15] dark:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] rounded-xl flex items-center justify-between transition-colors sm:hidden"
                  >
                    <span className="flex items-center gap-2">
                      {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#D9A441]" /> : <Moon className="w-3.5 h-3.5 text-[#1F4D3A]" />}
                      <span>{theme === 'dark' ? 'लाइट मोड (Light Theme)' : 'डार्क मोड (Dark Theme)'}</span>
                    </span>
                  </button>

                  {/* Return to Homepage */}
                  <Link
                    href="/?landing=true"
                    onClick={() => setShowRoleDropdown(false)}
                    className="w-full text-left px-2.5 py-2 text-xs font-bold text-[#0B1E15] dark:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Home className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#42BF87]" />
                    <span>{t.backToHome}</span>
                  </Link>

                  {/* Admin Console */}
                  <Link
                    href="/admin/login"
                    onClick={() => setShowRoleDropdown(false)}
                    className="w-full text-left px-2.5 py-2 text-xs font-bold text-[#1F4D3A] dark:text-[#42BF87] hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1F4D3A] dark:text-[#42BF87]" />
                    <span>सुपरॲडमिन लॉगिन (Superadmin)</span>
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    id="dropdown-btn-logout"
                    onClick={() => {
                      setShowRoleDropdown(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2 transition-colors cursor-pointer mt-0.5"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>लॉगआउट करा (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
