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
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#122A23]/95 backdrop-blur-md border-b border-[#E8E4DA] dark:border-[#1E3F36] px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Farm & Flock Switcher */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#013E37] text-[#FFEFB3] flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            L
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold text-[#0C1F1A] dark:text-white truncate">
                {farm.name}
              </h1>
              {isDemoMode && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF8DC] dark:bg-[#3D3416] text-[#B88B1A] dark:text-[#E5B84A] border border-[#FFEFB3]/60">
                  <Sparkles className="w-3 h-3 mr-1" />
                  डेमो मोड
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
              <span className="flex items-center gap-1 font-semibold text-[#013E37] dark:text-[#3DAE7E]">
                <Layers className="w-3.5 h-3.5" />
                {flock.batchCode} ({flock.ageWeeks} आठवडे / {flock.currentBirdCount.toLocaleString('en-IN')} पक्षी)
              </span>
              <span className="hidden md:inline font-normal text-[#6B8A7F]">• ०७ ऑक्टोबर २०२६</span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Language, Role Switcher, Alerts */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Demo Reset Button */}
          {isDemoMode && (
            <button
              onClick={resetDemoData}
              title={t.resetDemoData}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-[#3D5C53] dark:text-[#9BB5AB] hover:text-[#0C1F1A] dark:hover:text-white hover:bg-[#F5F3EE] dark:hover:bg-[#183530] border border-[#E8E4DA] dark:border-[#1E3F36] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C9A23C]" />
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#F5F3EE] dark:bg-[#152E27] text-[#013E37] dark:text-[#3DAE7E] border border-[#E8E4DA] dark:border-[#1E3F36] hover:border-[#013E37] dark:hover:border-[#3DAE7E] transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline capitalize">{user?.role}</span>
              <ChevronDown className="w-3 h-3 text-[#6B8A7F]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#122A23] rounded-xl shadow-xl border border-[#E8E4DA] dark:border-[#1E3F36] py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-bold text-[#6B8A7F] dark:text-[#6E9487] uppercase tracking-wider">
                  भूमिका बदला (Switch Role)
                </div>
                {roles.map(r => (
                  <button
                    key={r.key}
                    onClick={() => {
                      switchRole(r.key);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F5F3EE] dark:hover:bg-[#183530] ${
                      user?.role === r.key
                        ? 'font-bold text-[#013E37] dark:text-[#3DAE7E] bg-[#E8F3F1] dark:bg-[#0C2B26]'
                        : 'text-[#0C1F1A] dark:text-white font-medium'
                    }`}
                  >
                    <span>{r.label}</span>
                    {user?.role === r.key && <span className="text-xs font-bold text-[#C9A23C]">✓</span>}
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
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-[#F5F3EE] dark:bg-[#152E27] text-[#0C1F1A] dark:text-white border border-[#E8E4DA] dark:border-[#1E3F36] hover:border-[#C9A23C] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#C9A23C]" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-[#6B8A7F]" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#122A23] rounded-xl shadow-xl border border-[#E8E4DA] dark:border-[#1E3F36] py-1.5 z-50">
                <button
                  onClick={() => {
                    setLanguage('mr');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F5F3EE] dark:hover:bg-[#183530] ${
                    language === 'mr' ? 'font-bold text-[#013E37] dark:text-[#3DAE7E]' : 'text-[#0C1F1A] dark:text-white'
                  }`}
                >
                  <span>मराठी (MR)</span>
                  {language === 'mr' && <span className="font-bold text-[#C9A23C]">✓</span>}
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F5F3EE] dark:hover:bg-[#183530] ${
                    language === 'en' ? 'font-bold text-[#013E37] dark:text-[#3DAE7E]' : 'text-[#0C1F1A] dark:text-white'
                  }`}
                >
                  <span>English (EN)</span>
                  {language === 'en' && <span className="font-bold text-[#C9A23C]">✓</span>}
                </button>
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F5F3EE] dark:hover:bg-[#183530] ${
                    language === 'hi' ? 'font-bold text-[#013E37] dark:text-[#3DAE7E]' : 'text-[#0C1F1A] dark:text-white'
                  }`}
                >
                  <span>हिंदी (HI)</span>
                  {language === 'hi' && <span className="font-bold text-[#C9A23C]">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button (Light/Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#0C1F1A] dark:text-white hover:bg-[#F5F3EE] dark:hover:bg-[#183530] border border-[#E8E4DA] dark:border-[#1E3F36] transition-colors"
            title={theme === 'dark' ? 'लाइट मोड चालू करा (Light Mode)' : 'डार्क मोड चालू करा (Dark Mode)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FFEFB3]" />
            ) : (
              <Moon className="w-4 h-4 text-[#013E37]" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-[#0C1F1A] dark:text-white hover:bg-[#F5F3EE] dark:hover:bg-[#183530] border border-[#E8E4DA] dark:border-[#1E3F36] transition-colors"
            title="सूचना (Alerts)"
          >
            <Bell className="w-4 h-4 text-[#013E37] dark:text-[#3DAE7E]" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A63229] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
