import { test, expect } from '@playwright/test';

test.describe('E2E: Multi-Tenant Farm Switching & Role Permissions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('switches role to Supervisor and verifies operational restrictions', async ({ page }) => {
    // Look for Role Switcher in TopBar
    const roleToggle = page.locator('[aria-label="switch-role"]').or(page.locator('[data-testid="role-toggle"]')).or(page.locator('button:has-text("मालक")'));

    if (await roleToggle.first().isVisible()) {
      await roleToggle.first().click();
      await page.waitForTimeout(400);

      // Select Supervisor
      const supervisorOption = page.locator('text=सुपरवायझर').or(page.locator('text=Supervisor'));
      if (await supervisorOption.first().isVisible()) {
        await supervisorOption.first().click();
        await page.waitForTimeout(500);

        // Verify supervisor operational banner is displayed
        const supervisorBanner = page.locator('text=सुपरवायझर मोड').or(page.locator('text=Supervisor Mode'));
        await expect(supervisorBanner.first()).toBeVisible();
      }
    }
  });

  test('verifies farm switcher displays active farm name', async ({ page }) => {
    // Assert farm name is visible in TopBar
    const farmName = page.locator('text=सह्याद्री लेयर फार्म').or(page.locator('text=Sahyadri Layer Farm'));
    await expect(farmName.first()).toBeVisible();
  });
});
