'use client';

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';
import { Language, translations, TranslationDictionary } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'layeros_lang';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getClientSnapshot(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language;
    if (saved === 'mr' || saved === 'en' || saved === 'hi') {
      return saved;
    }
  } catch {
    // Ignore storage read errors
  }
  return 'mr';
}

function getServerSnapshot(): Language {
  return 'mr';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const storeLanguage = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [localLanguage, setLocalLanguage] = useState<Language | null>(null);

  const language = localLanguage ?? storeLanguage;

  const setLanguage = (lang: Language) => {
    setLocalLanguage(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  };

  const t = translations[language] || translations.mr;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
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
