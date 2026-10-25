import { test, expect } from '@playwright/test';

test.describe('E2E: Platform Admin Console & Farm Lifecycle Supervision (Stage 5)', () => {
  test('redirects unauthenticated user from /admin to /admin/login', async ({ page }) => {
    // Clear cookies first
    await page.context().clearCookies();
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    // Should redirect to login
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator('text=Platform Admin').or(page.locator('text=प्लॅटफॉर्म ॲडमिन')).first()).toBeVisible({ timeout: 10000 });
  });

  test('logs in via sandbox quick-login and views platform KPIs', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('domcontentloaded');

    // Click quick-fill for Super Admin
    const superAdminBtn = page.locator('button:has-text("Super Admin")').first();
    await expect(superAdminBtn).toBeVisible();
    await superAdminBtn.click();

    // Verify inputs populated
    await expect(page.locator('#admin-email')).toHaveValue('admin@layeros.internal');
    await expect(page.locator('#admin-password')).toHaveValue('SuperAdmin@2026');

    // Click submit
    await page.locator('#btn-admin-login').click();

    // Should navigate to /admin
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
    await expect(page.locator('text=LayerOS').first()).toBeVisible();

    // Verify KPI cards
    await expect(page.locator('text=Multi-shed active layer operations').or(page.locator('text=Total active laying birds')).first()).toBeVisible();
  });

  test('switches tabs, filters farms, and verifies audit trail logging', async ({ page }) => {
    // Set admin cookie directly
    await page.context().addCookies([
      {
        name: 'layeros_admin_session',
        value: encodeURIComponent(
          JSON.stringify({
            admin: {
              id: '00000000-0000-0000-0000-000000000001',
              email: 'admin@layeros.internal',
              role: 'super_admin',
              isActive: true,
            },
            token: 'test_token',
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
          })
        ),
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    // 1. Navigate to All Farms tab
    const farmsTab = page.locator('button:has-text("Farms")').or(page.locator('button:has-text("सर्व फार्म्स")')).first();
    await farmsTab.click();
    await page.waitForTimeout(300);

    // Verify farms list rendered
    await expect(page.locator('text=सह्याद्री लेयर फार्म').or(page.locator('text=Sahyadri Layer Farm')).first()).toBeVisible();

    // 2. Navigate to Pending Approvals tab
    const approvalsTab = page.locator('button:has-text("Approvals")').or(page.locator('button:has-text("प्रलंबित मंजुऱ्या")')).first();
    await approvalsTab.click();
    await page.waitForTimeout(300);

    // Verify pending approvals queue is visible
    await expect(page.locator('text=AWAITING VERIFICATION').or(page.locator('text=All caught up')).first()).toBeVisible();

    // 3. Navigate to Audit Log tab
    const auditTab = page.locator('button:has-text("Audit Log")').or(page.locator('button:has-text("ऑडिट लॉग")')).first();
    await auditTab.click();
    await page.waitForTimeout(300);

    // Verify audit records exist
    await expect(page.locator('text=DPDP').first()).toBeVisible();

    // 4. Test Sign Out
    const logoutBtn = page.locator('#btn-admin-logout').first();
    await logoutBtn.click();
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
  });
});
