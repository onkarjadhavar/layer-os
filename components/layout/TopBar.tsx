'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';
import { useTheme } from '@/lib/theme/context';
import {
  Bell,
  Globe,
  UserCheck,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';

interface TopBarProps {
  onOpenNotifications?: () => void;
}

export function TopBar({ onOpenNotifications }: TopBarProps) {
  const { farm, flock, user, switchRole, isDemoMode, resetDemoData, alerts } = useLayerOS();
  const { language, setLanguage, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.isResolved).length;

  const roles: Array<{ key: 'owner' | 'manager' | 'supervisor' | 'accountant' | 'viewer'; label: string }> = [
    { key: 'owner', label: t.roleOwner },
    { key: 'manager', label: t.roleManager },
    { key: 'supervisor', label: t.roleSupervisor },
    { key: 'accountant', label: t.roleAccountant },
    { key: 'viewer', label: t.roleViewer },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#16241D]/95 backdrop-blur-md border-b border-[#E7E2D6] dark:border-[#263B30] px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Farm & Flock Switcher */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#1F4D3A] text-white flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0">
            L
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-black text-[#0B1E15] dark:text-white truncate">
                {farm.name}
              </h1>
              {isDemoMode && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#FCF6E9] dark:bg-[#2E2413] text-[#B07B18] dark:text-[#E5B252] border border-[#D9A441]/40">
                  <Sparkles className="w-3 h-3 mr-1" />
                  डेमो मोड
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium">
              <span className="flex items-center gap-1 font-bold text-[#1F4D3A] dark:text-[#42BF87]">
                <Layers className="w-3.5 h-3.5" />
                {flock.batchCode} ({flock.ageWeeks} आठवडे / {flock.currentBirdCount.toLocaleString('en-IN')} पक्षी)
              </span>
              <span className="hidden md:inline font-normal">• ०७ ऑक्टोबर २०२६</span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Language, Role Switcher, Alerts */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Demo Reset Button */}
          {isDemoMode && (
            <button
              onClick={resetDemoData}
              title={t.resetDemoData}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] border border-[#DCD3C3] dark:border-[#263B30] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>{t.resetDemoData}</span>
            </button>
          )}

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowLangDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#1F4D3A] dark:text-[#42BF87] border border-[#DCD3C3] dark:border-[#263B30] hover:border-[#1F4D3A] transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline capitalize">{user?.role}</span>
              <ChevronDown className="w-3 h-3 text-[#2D4538] dark:text-[#CBDCD4]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#16241D] rounded-xl shadow-xl border border-[#DCD3C3] dark:border-[#263B30] py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-black text-[#2D4538] dark:text-[#CBDCD4] uppercase tracking-wider">
                  भूमिका बदला (Switch Role)
                </div>
                {roles.map(r => (
                  <button
                    key={r.key}
                    onClick={() => {
                      switchRole(r.key);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] ${
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

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowRoleDropdown(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-black rounded-lg bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white border border-[#DCD3C3] dark:border-[#263B30] hover:border-[#D9A441] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#D9A441]" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-[#2D4538] dark:text-[#CBDCD4]" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#16241D] rounded-xl shadow-xl border border-[#DCD3C3] dark:border-[#263B30] py-1.5 z-50">
                <button
                  onClick={() => {
                    setLanguage('mr');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] ${
                    language === 'mr' ? 'font-black text-[#1F4D3A] dark:text-[#42BF87]' : 'text-[#0B1E15] dark:text-white'
                  }`}
                >
                  <span>मराठी (MR)</span>
                  {language === 'mr' && <span className="font-bold">✓</span>}
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] ${
                    language === 'en' ? 'font-black text-[#1F4D3A] dark:text-[#42BF87]' : 'text-[#0B1E15] dark:text-white'
                  }`}
                >
                  <span>English (EN)</span>
                  {language === 'en' && <span className="font-bold">✓</span>}
                </button>
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] ${
                    language === 'hi' ? 'font-black text-[#1F4D3A] dark:text-[#42BF87]' : 'text-[#0B1E15] dark:text-white'
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
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#0B1E15] dark:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] border border-[#DCD3C3] dark:border-[#263B30] transition-colors"
            title={theme === 'dark' ? 'लाइट मोड चालू करा (Light Mode)' : 'डार्क मोड चालू करा (Dark Mode)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D9A441]" />
            ) : (
              <Moon className="w-4 h-4 text-[#1F4D3A]" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-[#0B1E15] dark:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1F3027] border border-[#DCD3C3] dark:border-[#263B30] transition-colors"
            title="सूचना (Alerts)"
          >
            <Bell className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B3382C] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
