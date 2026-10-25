import { test, expect } from '@playwright/test';

test.describe('E2E: Phase 6 SaaS Billing, Plan Tiers & Subscriptions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('navigates to Billing & Plans tab and inspects capacity meters', async ({ page }) => {
    // Navigate to Settings (handle mobile drawer vs desktop sidebar)
    const settingsBtn = page.locator('button:has-text("सेटिंग्ज")').or(page.locator('button:has-text("Settings")'));
    if (!await settingsBtn.first().isVisible()) {
      const moreBtn = page.locator('button:has-text("इतर पर्याय")').or(page.locator('button:has-text("More")')).or(page.locator('nav button').last());
      await moreBtn.first().click();
      await page.waitForTimeout(400);
    }
    await settingsBtn.locator('visible=true').first().click();
    await page.waitForTimeout(600);

    // Click Billing & Plans tab
    const billingTab = page.locator('button:has-text("सदस्यता व योजना")').or(page.locator('button:has-text("Billing & Plans")'));
    await expect(billingTab.first()).toBeVisible({ timeout: 10000 });
    await billingTab.first().click();
    await page.waitForTimeout(400);

    // Verify active plan is displayed
    const planBanner = page.locator('text=ग्रोवर व्यावसायिक').or(page.locator('text=Grower Pro')).or(page.locator('text=आरंभ')).or(page.locator('text=Starter'));
    await expect(planBanner.first()).toBeVisible();

    // Verify capacity meters are visible
    const birdCapacity = page.locator('text=पक्षी क्षमता वापर').or(page.locator('text=Bird Capacity Usage'));
    await expect(birdCapacity.first()).toBeVisible();

    // Verify shed & staff capacity meters
    const shedCapacity = page.locator('text=शेड क्षमता').or(page.locator('text=Shed Capacity'));
    await expect(shedCapacity.first()).toBeVisible();
  });

  test('toggles between monthly and yearly billing and views tiers', async ({ page }) => {
    // Navigate to Settings (handle mobile drawer vs desktop sidebar)
    const settingsBtn = page.locator('button:has-text("सेटिंग्ज")').or(page.locator('button:has-text("Settings")'));
    if (!await settingsBtn.first().isVisible()) {
      const moreBtn = page.locator('button:has-text("इतर पर्याय")').or(page.locator('button:has-text("More")')).or(page.locator('nav button').last());
      await moreBtn.first().click();
      await page.waitForTimeout(400);
    }
    await settingsBtn.locator('visible=true').first().click();
    await page.waitForTimeout(400);

    const billingTab = page.locator('button:has-text("सदस्यता व योजना")').or(page.locator('button:has-text("Billing & Plans")'));
    await billingTab.first().click();
    await page.waitForTimeout(400);

    // Verify monthly / yearly buttons exist
    const yearlyBtn = page.locator('button:has-text("वार्षिक बिलिंग")').or(page.locator('button:has-text("Yearly Billing")'));
    await expect(yearlyBtn.first()).toBeVisible();

    await yearlyBtn.first().click();
    await page.waitForTimeout(300);

    // Check discount banner
    const discountText = page.locator('text=१७% बचत').or(page.locator('text=Save 17%')).or(page.locator('text=२ महिने मोफत'));
    await expect(discountText.first()).toBeVisible();

    // Verify Enterprise plan card
    const enterpriseCard = page.locator('text=कमर्शियल (Enterprise)').or(page.locator('text=Commercial Enterprise'));
    await expect(enterpriseCard.first()).toBeVisible();
  });
});
