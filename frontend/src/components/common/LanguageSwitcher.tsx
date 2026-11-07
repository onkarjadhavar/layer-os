'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
];

export interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'segment';
  className?: string;
  buttonClassName?: string;
  showIcon?: boolean;
}

export function LanguageSwitcher({
  variant = 'dropdown',
  className = '',
  buttonClassName = '',
  showIcon = true,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Segmented control variant (e.g. for landing bar, auth headers, mobile drawer)
  if (variant === 'segment') {
    return (
      <div
        role="radiogroup"
        aria-label="Language selection"
        className={`flex items-center bg-[var(--color-surface-subtle)] p-1 rounded-xl border border-[var(--color-border)] ${className}`}
      >
        {LANGUAGES.map((opt) => {
          const isSelected = language === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              role="radio"
              aria-checked={isSelected}
              id={`lang-segment-${opt.code}`}
              onClick={() => setLanguage(opt.code)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all min-h-[32px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] ${
                isSelected
                  ? 'bg-[var(--color-forest)] text-white shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              {opt.nativeLabel}
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown variant (standard TopBar & App header)
  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        id="language-switcher-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={`Current language: ${currentOption.nativeLabel}. Click to switch language.`}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] ${buttonClassName}`}
      >
        {showIcon && <Globe className="w-3.5 h-3.5 text-[var(--color-amber)] shrink-0" />}
        <span className="font-bold hidden sm:inline">{currentOption.nativeLabel}</span>
        <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold sm:font-normal">
          <span className="sm:hidden">{currentOption.code}</span>
          <span className="hidden sm:inline">({currentOption.code})</span>
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[var(--color-text-muted)] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Available languages"
          tabIndex={-1}
          className="absolute right-0 mt-1.5 w-36 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {LANGUAGES.map((opt) => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                role="option"
                aria-selected={isSelected}
                id={`lang-option-${opt.code}`}
                type="button"
                onClick={() => handleSelectLanguage(opt.code)}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:bg-[var(--color-surface-subtle)] ${
                  isSelected
                    ? 'font-bold text-[var(--color-forest)] bg-[var(--color-sage-pale)]'
                    : 'text-[var(--color-text-main)]'
                }`}
              >
                <div className="flex flex-col">
                  <span>{opt.nativeLabel}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[var(--color-forest)] font-bold" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;

