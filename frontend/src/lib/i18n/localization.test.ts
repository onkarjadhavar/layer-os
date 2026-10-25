import { describe, it, expect } from 'vitest';
import { translations, Language } from './translations';

describe('LayerOS Localization & Trilingual Parity (Phase 4)', () => {
  const supportedLanguages: Language[] = ['mr', 'en', 'hi'];

  it('provides all 3 supported languages', () => {
    supportedLanguages.forEach(lang => {
      expect(translations[lang]).toBeDefined();
    });
  });

  it('guarantees 100% key parity across Marathi, English, and Hindi dictionaries', () => {
    const mrKeys = Object.keys(translations.mr).sort();
    const enKeys = Object.keys(translations.en).sort();
    const hiKeys = Object.keys(translations.hi).sort();

    // Check count match
    expect(enKeys.length).toBe(mrKeys.length);
    expect(hiKeys.length).toBe(mrKeys.length);

    // Check exact key match
    expect(enKeys).toEqual(mrKeys);
    expect(hiKeys).toEqual(mrKeys);

    // Check no empty strings or undefined in any language
    supportedLanguages.forEach(lang => {
      const dict = translations[lang] as unknown as Record<string, string>;
      mrKeys.forEach(key => {
        expect(dict[key], `Language '${lang}' missing or empty key '${key}'`).toBeDefined();
        expect(typeof dict[key]).toBe('string');
        expect(dict[key].trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('ensures authentic Marathi poultry farming terminology is default', () => {
    const mr = translations.mr;
    expect(mr.appName).toBe('LayerOS');
    expect(mr.tagline).toContain('लेयर पोल्ट्री');
    expect(mr.roleOwner).toContain('मालक');
    expect(mr.activeBirds).toContain('पक्षी');
    expect(mr.eggsToday).toContain('अंडी');
    expect(mr.feedUsed).toContain('खुराक');
    expect(mr.mortality).toContain('मृत्यू');
    expect(mr.breakEvenPrice).toContain('ब्रेक-इव्हन');
    expect(mr.unitTray).toContain('ट्रे');
    expect(mr.unitGatta).toContain('गट्टा');
  });

  it('ensures accurate Hindi terminology parity', () => {
    const hi = translations.hi;
    expect(hi.appName).toBe('LayerOS');
    expect(hi.tagline).toContain('लेयर पोल्ट्री');
    expect(hi.roleOwner).toContain('मालिक');
    expect(hi.activeBirds).toContain('मुर्गियां');
    expect(hi.eggsToday).toContain('अंडे');
    expect(hi.feedUsed).toContain('दाना');
    expect(hi.breakEvenPrice).toContain('ब्रेक-इवन');
    expect(hi.unitTray).toContain('ट्रे');
  });

  it('ensures accurate English terminology parity', () => {
    const en = translations.en;
    expect(en.appName).toBe('LayerOS');
    expect(en.roleOwner).toBe('Owner');
    expect(en.activeBirds).toBe('Active Live Birds');
    expect(en.feedUsed).toBe('Feed Used Today');
    expect(en.breakEvenPrice).toBe('Break-Even Egg Price');
  });

  it('verifies unit conversions labels across all three languages', () => {
    supportedLanguages.forEach(lang => {
      const dict = translations[lang];
      expect(dict.unitEgg).toBeDefined();
      expect(dict.unitPer100).toBeDefined();
      expect(dict.unitTray).toBeDefined();
      expect(dict.unitGatta).toBeDefined();
      expect(dict.unitCarton).toBeDefined();
    });
  });
});
