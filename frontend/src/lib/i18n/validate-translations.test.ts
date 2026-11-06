import { describe, it, expect } from 'vitest';
import en from '@/messages/en.json';
import hi from '@/messages/hi.json';
import mr from '@/messages/mr.json';

describe('Multilingual Translation Consistency Audit', () => {
  const namespaces = Object.keys(en);

  it('should have identical namespaces across English, Hindi, and Marathi', () => {
    expect(Object.keys(hi).sort()).toEqual(namespaces.sort());
    expect(Object.keys(mr).sort()).toEqual(namespaces.sort());
  });

  it('should have matching keys in every namespace without missing or extra keys', () => {
    namespaces.forEach((ns) => {
      const enKeys = Object.keys((en as Record<string, Record<string, string>>)[ns] || {}).sort();
      const hiKeys = Object.keys((hi as Record<string, Record<string, string>>)[ns] || {}).sort();
      const mrKeys = Object.keys((mr as Record<string, Record<string, string>>)[ns] || {}).sort();

      expect(hiKeys, `Namespace ${ns} keys mismatch between EN and HI`).toEqual(enKeys);
      expect(mrKeys, `Namespace ${ns} keys mismatch between EN and MR`).toEqual(enKeys);
    });
  });

  it('should have non-empty string values for all keys across all 3 languages', () => {
    const checkEmpty = (obj: Record<string, any>, lang: string, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          checkEmpty(value, lang, fullPath);
        } else {
          expect(typeof value, `${lang}:${fullPath} should be string`).toBe('string');
          expect((value as string).trim().length, `${lang}:${fullPath} should not be empty`).toBeGreaterThan(0);
        }
      }
    };

    checkEmpty(en, 'en');
    checkEmpty(hi, 'hi');
    checkEmpty(mr, 'mr');
  });

  it('should verify total translation key count matches across all three files', () => {
    const countKeys = (dict: Record<string, Record<string, string>>) =>
      Object.values(dict).reduce((sum, ns) => sum + Object.keys(ns).length, 0);

    const enCount = countKeys(en as any);
    const hiCount = countKeys(hi as any);
    const mrCount = countKeys(mr as any);

    expect(enCount).toBeGreaterThanOrEqual(450);
    expect(hiCount).toBe(enCount);
    expect(mrCount).toBe(enCount);
  });
});

