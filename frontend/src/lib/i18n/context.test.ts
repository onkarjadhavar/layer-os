import { describe, it, expect } from 'vitest';
import { createTFunction } from './context';
import { translations, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './translations';

describe('I18n Context & Engine Unit Tests', () => {
  it('defines valid supported languages and English as default', () => {
    expect(SUPPORTED_LANGUAGES).toEqual(['en', 'hi', 'mr']);
    expect(DEFAULT_LANGUAGE).toBe('en');
  });

  it('provides functional translation with fallback hierarchy', () => {
    const t = createTFunction('mr', translations.mr);

    // Existing Marathi key
    expect(t('Common.appName')).toBe('LayerOS');
    expect(t('Common.save')).toBe('जतन करा');

    // Dot notation vs flat property
    expect(t('navHome')).toBe('मुख्य डॅशबोर्ड');
    expect(t.navHome).toBe('मुख्य डॅशबोर्ड');

    // Unknown key returns the key itself
    expect(t('NonExistent.Key')).toBe('NonExistent.Key');
  });

  it('interpolates variable tokens correctly', () => {
    const t = createTFunction('en', translations.en);
    const result = t('Hello {name}, you have {count} birds', undefined, {
      name: 'Rohan',
      count: 9985,
    });
    expect(result).toBe('Hello Rohan, you have 9985 birds');
  });

  it('correctly localizes currency, numbers, and percentages using Indian formats', () => {
    const locales = [
      { lang: 'en', code: 'en-IN' },
      { lang: 'hi', code: 'hi-IN' },
      { lang: 'mr', code: 'mr-IN' },
    ];

    locales.forEach(({ code }) => {
      const currency = new Intl.NumberFormat(code, {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(154200);

      // Verify Indian Rupee formatting (handles both Latin and Devanagari numerals)
      expect(currency).toMatch(/(1,54,200|१५४,२००|१,५४,२००)/);

      const percent = new Intl.NumberFormat(code, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(94.5 / 100);

      expect(percent).toMatch(/(94\.5|९४\.५)/);
    });
  });
});
