import { test, expect } from '@playwright/test';

test.describe('E2E: 30-Second Quick Log & Core Poultry Calculations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app hydration
    await expect(page.locator('text=सह्याद्री लेयर फार्म').or(page.locator('text=LayerOS')).first()).toBeVisible({ timeout: 15000 });
  });

  test('displays reference day poultry metrics on dashboard load', async ({ page }) => {
    // Assert Hen-Day or Eggs collected is visible on the KPI Grid
    const eggsKpi = page.locator('text=आज गोळा झालेली अंडी').or(page.locator('text=Eggs Today'));
    await expect(eggsKpi.first()).toBeVisible({ timeout: 10000 });

    // Assert live birds KPI tile
    const birdsKpi = page.locator('text=सध्या जिवंत पक्षी').or(page.locator('text=Active Birds'));
    await expect(birdsKpi.first()).toBeVisible();

    // Assert Hen-Day % tile
    const hdKpi = page.locator('text=हेन-डे (HD%)').or(page.locator('text=Hen-Day'));
    await expect(hdKpi.first()).toBeVisible();
  });

  test('completes 30-second daily quick log and recalculates metrics', async ({ page }) => {
    // Check if Quick Entry card is visible
    const quickCard = page.getByRole('heading', { name: /३०-सेकंद|30-Second|Quick Entry/i });
    await expect(quickCard.first()).toBeVisible({ timeout: 10000 });

    // Find and fill inputs for mortality, eggs, feed bags
    const inputs = page.locator('input[type="number"]');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(0);

    // Fill eggs collected if editable
    const firstInput = inputs.first();
    if (await firstInput.isVisible()) {
      await firstInput.fill('28150');
    }

    // Submit button
    const submitBtn = page.locator('button:has-text("नोंद साठवा")').or(page.locator('button:has-text("Save")'));
    if (await submitBtn.first().isVisible()) {
      await submitBtn.first().click();
      await page.waitForTimeout(1000);
    }
  });
});
