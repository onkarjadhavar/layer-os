'use client';

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'layeros_theme_mode';

function subscribeTheme(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getClientThemeSnapshot(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // Ignore
  }
  return 'light';
}

function getServerThemeSnapshot(): Theme {
  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const storeTheme = useSyncExternalStore(subscribeTheme, getClientThemeSnapshot, getServerThemeSnapshot);
  const [localTheme, setLocalTheme] = useState<Theme | null>(null);

  const theme = localTheme ?? storeTheme;

  useEffect(() => {
    // Synchronize DOM with the current theme state
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setLocalTheme(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
