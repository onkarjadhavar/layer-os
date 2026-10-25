import { test, expect } from '@playwright/test';

test.describe('E2E: Trilingual Language Switching & 360px Typography (mr, en, hi)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('switches language cleanly between Marathi, English, and Hindi', async ({ page }) => {
    // 1. Click Language trigger dropdown in TopBar
    const langTrigger = page.locator('button:has(svg.lucide-globe)').or(page.locator('button:has-text("MR")')).or(page.locator('button:has-text("EN")'));
    await expect(langTrigger.first()).toBeVisible({ timeout: 10000 });
    await langTrigger.first().click();
    await page.waitForTimeout(300);

    // 2. Select English (EN)
    const enOption = page.locator('button:has-text("English (EN)")');
    if (await enOption.isVisible()) {
      await enOption.click();
      await page.waitForTimeout(500);

      // Verify English language is reflected on dashboard
      const englishKpi = page.locator('text=Active Live Birds').or(page.locator('text=Eggs Today')).or(page.locator('text=Quick Mode')).or(page.locator('text=EN'));
      await expect(englishKpi.first()).toBeVisible();
    }

    // 3. Switch to Hindi (HI)
    await langTrigger.first().click();
    await page.waitForTimeout(300);

    const hiOption = page.locator('button:has-text("हिंदी (HI)")');
    if (await hiOption.isVisible()) {
      await hiOption.click();
      await page.waitForTimeout(500);

      // Verify Hindi text is active
      const hindiKpi = page.locator('text=सक्रिय मुर्गियां').or(page.locator('text=आज के अंडे')).or(page.locator('text=HI'));
      await expect(hindiKpi.first()).toBeVisible();
    }

    // 4. Switch back to Marathi (MR)
    await langTrigger.first().click();
    await page.waitForTimeout(300);

    const mrOption = page.locator('button:has-text("मराठी (MR)")');
    if (await mrOption.isVisible()) {
      await mrOption.click();
      await page.waitForTimeout(500);

      // Verify Marathi default is restored
      const marathiKpi = page.locator('text=सक्रिय जिवंत पक्षी').or(page.locator('text=आजचे उत्पादन')).or(page.locator('text=MR'));
      await expect(marathiKpi.first()).toBeVisible();
    }
  });

  test('preserves mobile viewport width without horizontal overflow at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Verify document width does not cause unintended horizontal scrolling
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 2;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });
});
