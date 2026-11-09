'use client';

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore, useMemo } from 'react';
import {
  Language,
  translations,
  rawMessages,
  TranslationDictionary,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from './translations';

export interface FormatterHelpers {
  formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatPercent: (value: number, options?: Intl.NumberFormatOptions) => string;
}

export type TFunction = TranslationDictionary &
  ((key: string, namespaceOrParams?: string | Record<string, any>, params?: Record<string, any>) => string) & {
    [namespace: string]: any;
  };

export interface I18nContextType extends FormatterHelpers {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TFunction;
  localeCode: string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'layeros_lang';
const COOKIE_NAME = 'NEXT_LOCALE';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('layeros_language_change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('layeros_language_change', callback);
  };
}

function getClientSnapshot(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    // 1. Check URL query param (?lang=en|hi|mr)
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang') as Language;
    if (urlLang && (SUPPORTED_LANGUAGES as readonly string[]).includes(urlLang)) {
      return urlLang;
    }

    // 2. Check Cookie (NEXT_LOCALE)
    const cookieLang = getCookie(COOKIE_NAME) as Language;
    if (cookieLang && (SUPPORTED_LANGUAGES as readonly string[]).includes(cookieLang)) {
      return cookieLang;
    }

    // 3. Check LocalStorage (layeros_lang)
    const saved = localStorage.getItem(STORAGE_KEY) as Language;
    if (saved && (SUPPORTED_LANGUAGES as readonly string[]).includes(saved)) {
      return saved;
    }
  } catch {
    // Ignore storage read errors
  }
  return DEFAULT_LANGUAGE;
}

function getServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

export function createTFunction(lang: Language, dictionary: TranslationDictionary): TFunction {
  const raw = rawMessages[lang] || rawMessages.en;
  const rawFallback = rawMessages.en;

  const fn = function (
    key: string,
    namespaceOrParams?: string | Record<string, any>,
    maybeParams?: Record<string, any>
  ): string {
    let namespace: string | undefined;
    let params: Record<string, any> | undefined;

    if (typeof namespaceOrParams === 'string') {
      namespace = namespaceOrParams;
      params = maybeParams;
    } else if (typeof namespaceOrParams === 'object' && namespaceOrParams !== null) {
      params = namespaceOrParams;
    } else if (maybeParams) {
      params = maybeParams;
    }

    let text: string | undefined;

    // 1. Dotted namespace lookup, e.g. "Common.save"
    if (key.includes('.')) {
      const parts = key.split('.');
      const ns = parts[0];
      const k = parts.slice(1).join('.');
      text = (raw as any)?.[ns]?.[k] ?? (rawFallback as any)?.[ns]?.[k];
    }

    // 2. Explicit namespace parameter, e.g. t('save', 'Common')
    if (!text && namespace) {
      text = (raw as any)?.[namespace]?.[key] ?? (rawFallback as any)?.[namespace]?.[key];
    }

    // 3. Flat key lookup
    if (!text) {
      text = dictionary[key] ?? (translations.en as any)[key] ?? key;
    }

    // 4. Interpolate variables e.g. { name: "Rohan" } -> {name}
    if (params && typeof text === 'string') {
      for (const [pKey, pVal] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      }
    }

    return text ?? key;
  };

  // Attach flat properties directly on fn
  Object.assign(fn, dictionary);

  // Attach namespace objects for nested access e.g. t.Common.save
  for (const [ns, keys] of Object.entries(raw)) {
    (fn as any)[ns] = keys;
  }

  return fn as TFunction;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const storeLanguage = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [localLanguage, setLocalLanguage] = useState<Language | null>(null);

  const language = localLanguage ?? storeLanguage;

  const setLanguage = (lang: Language) => {
    if (!(SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) return;
    setLocalLanguage(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      setCookie(COOKIE_NAME, lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
      // Update URL param without refreshing
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (url.searchParams.get('lang')) {
          url.searchParams.set('lang', lang);
          window.history.replaceState({}, '', url.toString());
        }
        window.dispatchEvent(new Event('layeros_language_change'));
      }
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const dict = translations[language] || translations.en;
  const t = useMemo(() => createTFunction(language, dict), [language, dict]);

  const localeCode = useMemo(() => {
    switch (language) {
      case 'hi':
        return 'hi-IN';
      case 'mr':
        return 'mr-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  }, [language]);

  const formatters = useMemo<FormatterHelpers>(() => {
    return {
      formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => {
        try {
          return new Intl.NumberFormat(localeCode, {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
            ...options,
          }).format(amount);
        } catch {
          return `₹${amount.toLocaleString()}`;
        }
      },
      formatNumber: (value: number, options?: Intl.NumberFormatOptions) => {
        try {
          return new Intl.NumberFormat(localeCode, options).format(value);
        } catch {
          return value.toLocaleString();
        }
      },
      formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
        try {
          const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
          return new Intl.DateTimeFormat(localeCode, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            ...options,
          }).format(d);
        } catch {
          return String(date);
        }
      },
      formatPercent: (value: number, options?: Intl.NumberFormatOptions) => {
        try {
          return new Intl.NumberFormat(localeCode, {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
            ...options,
          }).format(value / 100);
        } catch {
          return `${value}%`;
        }
      },
    };
  }, [localeCode]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, localeCode, ...formatters }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

/**
 * Hook compatible with Next-intl pattern:
 * const t = useTranslations('Common');
 * <h1>{t('save')}</h1>
 */
export function useTranslations(namespace?: string) {
  const { t } = useI18n();
  return useMemo(() => {
    return (key: string, params?: Record<string, any>) => {
      return t(key, namespace, params);
    };
  }, [t, namespace]);
}
