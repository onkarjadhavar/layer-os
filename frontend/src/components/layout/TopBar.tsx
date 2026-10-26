'use client';

import React, { useState } from 'react';
import { Link } from '@/components/common/Link';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { LayerOSLogo } from '@/components/common/LayerOSLogo';
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
    <header className="sticky top-0 z-30 bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] px-3 sm:px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Farm Avatar & Selector */}
        <div className="flex items-center gap-2.5 min-w-0">
          <LayerOSLogo size={36} />
          <div className="min-w-0 relative">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setShowFarmDropdown(!showFarmDropdown);
                  setShowRoleDropdown(false);
                  setShowLangDropdown(false);
                }}
                className="group flex items-center gap-1 text-left text-sm sm:text-base font-bold text-[var(--color-text-main)] hover:text-[var(--color-forest)] dark:hover:text-[var(--color-sage)] transition-colors truncate cursor-pointer"
                title={t.switchFarm}
              >
                <span className="truncate">{farm.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-forest)] flex-shrink-0 transition-transform" />
              </button>

              {isDemoMode ? (
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--color-amber-soft)] text-[var(--color-walnut)] dark:bg-[#2A1E0D] dark:text-[var(--color-amber)] border border-[var(--color-amber)]/40">
                  <Sparkles className="w-2.5 h-2.5 mr-1 text-[var(--color-amber)]" />
                  {t.demoBadge}
                </span>
              ) : isDatabaseConnected ? (
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--color-sage-pale)] text-[var(--color-forest)] dark:bg-[#1A3024] dark:text-[var(--color-sage)] border border-[var(--color-sage)]/40">
                  {t.postgresLive}
                </span>
              ) : null}
            </div>

            {/* Farm Switcher Dropdown */}
            {showFarmDropdown && (
              <div className="absolute left-0 mt-2 w-72 bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] py-2 z-50">
                <div className="px-3.5 py-1.5 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--color-border)]">
                  <Building2 className="w-3.5 h-3.5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
                  <span>{t.selectFarmTitle}</span>
                </div>
                <div className="divide-y divide-[var(--color-border)]/40 my-1 max-h-60 overflow-y-auto">
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
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between gap-2 hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-[var(--color-sage-pale)] text-[var(--color-forest)] dark:bg-[#1A3024] dark:text-[var(--color-sage)] font-bold'
                            : 'text-[var(--color-text-main)] font-medium'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold truncate">{f.name}</p>
                          <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                            {f.district} • {f.totalCapacity.toLocaleString('en-IN')} {t.birdCapacity}
                          </p>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-1.5 border-t border-[var(--color-border)] px-2 flex flex-col gap-1">
                  <Link
                    href="/enroll"
                    onClick={() => setShowFarmDropdown(false)}
                    className="w-full text-left px-2 py-1.5 text-xs font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] hover:bg-[var(--color-sage-pale)] dark:hover:bg-[#1A3024] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>+ {t.landingEnrollBtn}</span>
                  </Link>
                  <Link
                    href="/?landing=true"
                    onClick={() => setShowFarmDropdown(false)}
                    className="w-full text-left px-2 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>मुख्य माहिती पान (Landing Page)</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Flock Overview Subtitle */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[var(--color-text-muted)] font-medium truncate">
              <span className="flex items-center gap-1 font-semibold text-[var(--color-forest)] dark:text-[var(--color-sage)]">
                <Layers className="w-3 h-3 flex-shrink-0" />
                <span>{flock.batchCode}</span>
                <span className="text-[var(--color-text-muted)]">
                  ({flock.ageWeeks} {t.weeks} • {flock.currentBirdCount.toLocaleString('en-IN')} {t.birds})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Operational Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Demo Reset Button */}
          {isDemoMode && (
            <button
              type="button"
              onClick={resetDemoData}
              title={t.resetDemoData}
              className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)] border border-[var(--color-border)] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[var(--color-amber)]" />
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] border border-[var(--color-border)] hover:border-[var(--color-sage)] transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
              <span className="hidden sm:inline capitalize font-bold">{user?.role}</span>
              <ChevronDown className="w-3 h-3 text-[var(--color-text-muted)]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-border)]">
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
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer ${
                      user?.role === r.key
                        ? 'font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] bg-[var(--color-sage-pale)] dark:bg-[#1A3024]'
                        : 'text-[var(--color-text-main)] font-medium'
                    }`}
                  >
                    <span>{r.label}</span>
                    {user?.role === r.key && <span className="text-xs font-black">✓</span>}
                  </button>
                ))}
                <div className="pt-1 mt-1 border-t border-[var(--color-border)] px-1">
                  <button
                    type="button"
                    id="dropdown-btn-logout"
                    onClick={() => {
                      setShowRoleDropdown(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[var(--color-error)] hover:bg-[var(--color-error-bg)] flex items-center gap-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>लॉगआउट (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Return to Public Landing Link */}
          <Link
            href="/?landing=true"
            id="btn-back-to-home"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] border border-[var(--color-border)] hover:border-[var(--color-forest)] transition-all"
            title={t.backToHome}
          >
            <Home className="w-3.5 h-3.5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
            <span className="hidden sm:inline">{t.backToHome}</span>
          </Link>

          {/* Admin Portal Link */}
          <Link
            href="/admin/login"
            id="topbar-btn-admin-login"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] border border-[var(--color-border)] hover:border-[var(--color-forest)] transition-all"
            title="Platform Admin Login"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          {/* Trilingual Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowRoleDropdown(false);
                setShowFarmDropdown(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] border border-[var(--color-border)] hover:border-[var(--color-amber)] transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--color-amber)]" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-[var(--color-text-muted)]" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] py-1.5 z-50">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('mr');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer ${
                    language === 'mr'
                      ? 'font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] bg-[var(--color-sage-pale)] dark:bg-[#1A3024]'
                      : 'text-[var(--color-text-main)]'
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
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer ${
                    language === 'en'
                      ? 'font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] bg-[var(--color-sage-pale)] dark:bg-[#1A3024]'
                      : 'text-[var(--color-text-main)]'
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
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer ${
                    language === 'hi'
                      ? 'font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] bg-[var(--color-sage-pale)] dark:bg-[#1A3024]'
                      : 'text-[var(--color-text-main)]'
                  }`}
                >
                  <span>हिंदी (HI)</span>
                  {language === 'hi' && <span className="font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)] border border-[var(--color-border)] transition-colors flex items-center justify-center cursor-pointer"
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[var(--color-amber)]" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--color-forest)]" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)] border border-[var(--color-border)] transition-colors flex items-center justify-center cursor-pointer"
            title={t.alertsTitle}
          >
            <Bell className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-amber)] text-[var(--color-forest-deep)] text-[10px] font-black flex items-center justify-center shadow-xs">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Subtle Logout Action */}
          <button
            type="button"
            id="topbar-btn-logout"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-error)] border border-[var(--color-border)] hover:border-[var(--color-error)]/40 transition-all cursor-pointer"
            title="लॉगआउट (Logout)"
          >
            <LogOut className="w-3.5 h-3.5 text-[var(--color-error)]" />
            <span className="hidden md:inline">लॉगआउट</span>
          </button>
        </div>
      </div>
    </header>
  );
}
export default TopBar;
