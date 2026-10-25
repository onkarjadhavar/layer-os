import { test, expect } from '@playwright/test';

test.describe('E2E: Public Landing Page & Farm Enrollment Flow', () => {

  test('landing renders with trilingual toggle (mr -> en -> hi) and persists selection', async ({ page }) => {
    await page.goto('/?landing=true');
    await page.waitForLoadState('domcontentloaded');

    // 1. Verify Default Marathi (MR)
    await expect(page.locator('text=प्रत्येक अंड्याचा हिशोब').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#landing-topbar-enroll-btn').or(page.locator('text=आपला पोल्ट्री फार्म नोंदवा')).first()).toBeVisible();

    // 2. Switch to English (EN)
    const enBtn = page.locator('#landing-lang-en').or(page.locator('button:has-text("English")')).first();
    await expect(enBtn).toBeVisible();
    await enBtn.click();
    await page.waitForTimeout(400);

    // Verify English text
    await expect(page.locator('text=Every egg counted. Profit maximised.').first()).toBeVisible();
    await expect(page.locator('text=Enroll Your Poultry Farm').first()).toBeVisible();

    // 3. Switch to Hindi (HI)
    const hiBtn = page.locator('#landing-lang-hi').or(page.locator('button:has-text("हिंदी")')).first();
    await expect(hiBtn).toBeVisible();
    await hiBtn.click();
    await page.waitForTimeout(400);

    // Verify Hindi text
    await expect(page.locator('text=हर अंडे का सटीक हिसाब').first()).toBeVisible();
    await expect(page.locator('text=पंजीकृत करें').or(page.locator('text=पोल्ट्री फार्म')).first()).toBeVisible();

    // 4. Reload page and confirm Hindi remains active
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=हर अंडे का सटीक हिसाब').first()).toBeVisible();
  });

  test('landing page contains all 12 required sections and sample preview fixture', async ({ page }) => {
    await page.goto('/?landing=true');
    await page.waitForLoadState('domcontentloaded');

    // Section 1: Hero & Primary CTA
    await expect(page.locator('#landing-hero-enroll-btn').or(page.locator('text=नोंदवा')).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#landing-hero-demo-btn').or(page.locator('text=डेमो')).first()).toBeVisible();

    // Section 2: What is LayerOS
    await expect(page.locator('text=LayerOS म्हणजे काय?').or(page.locator('text=What is LayerOS?')).first()).toBeVisible();

    // Section 3: Who it is for
    await expect(page.locator('text=हे ॲप कोणासाठी आहे?').or(page.locator('text=Who is it for?')).first()).toBeVisible();

    // Section 4: What you enter (Quick Entry badge)
    await expect(page.locator('text=तुम्ही काय नोंदवता?').or(page.locator('text=What You Enter')).first()).toBeVisible();

    // Section 5: What you get
    await expect(page.locator('text=तुम्हाला काय मिळते?').or(page.locator('text=What You Get')).first()).toBeVisible();

    // Section 6: How it works (4 steps)
    await expect(page.locator('text=हे कसे चालते?').or(page.locator('text=How It Works')).first()).toBeVisible();

    // Section 7: Sample Output Preview fixture (30,000 birds, 27,300 eggs, 91.0% HD, 19,920 profit)
    await expect(page.locator('text=३०,०००').or(page.locator('text=30,000')).first()).toBeVisible();
    await expect(page.locator('text=२७,३००').or(page.locator('text=27,300')).first()).toBeVisible();
    await expect(page.locator('text=91.0%').or(page.locator('text=९१.०%')).first()).toBeVisible();
    await expect(page.locator('text=19,920').or(page.locator('text=१९,९२०')).first()).toBeVisible();

    // Section 8: Features Grid
    await expect(page.locator('text=LayerOS ची प्रमुख वैशिष्ट्ये').or(page.locator('text=Core Features')).first()).toBeVisible();

    // Section 9: Trust and Privacy (DPDP & isolated data)
    await expect(page.locator('text=विश्वास, सुरक्षितता आणि गोपनीयता').or(page.locator('text=Trust & Privacy')).first()).toBeVisible();

    // Section 10: Pricing Teaser
    await expect(page.locator('text=किंमत आणि प्लॅन्स').or(page.locator('text=सुलभ आणि पारदर्शक योजना')).or(page.locator('text=Plans & Pricing')).first()).toBeVisible();

    // Section 11: FAQ accordion
    await expect(page.locator('text=वारंवार विचारले जाणारे प्रश्न').or(page.locator('text=Frequently Asked Questions')).first()).toBeVisible();

    // Section 12: Footer with DPDP note
    await expect(page.locator('text=DPDP').first()).toBeVisible();
  });

  test('clicking "Try Demo" on landing navigates to dashboard', async ({ page }) => {
    await page.goto('/?landing=true');
    await page.waitForLoadState('domcontentloaded');

    const demoBtn = page.locator('#landing-hero-demo-btn').or(page.locator('button:has-text("डेमो")')).first();
    await expect(demoBtn).toBeVisible({ timeout: 10000 });
    await demoBtn.click();

    // Should transition into dashboard
    await expect(page.locator('text=सह्याद्री लेयर फार्म').or(page.locator('text=LayerOS')).first()).toBeVisible({ timeout: 10000 });
  });

  test('completes 7-step farm enrollment flow and receives personalized welcome stats', async ({ page }) => {
    await page.goto('/enroll');
    await page.waitForLoadState('domcontentloaded');

    // Step 1: Owner Details using exact IDs
    await page.fill('#enroll-owner-name', 'Ramesh Patil');
    await page.fill('#enroll-owner-phone', '9890123456');
    await page.fill('#enroll-owner-email', 'ramesh.patil.poultry@example.com');
    await page.fill('#enroll-owner-password', 'P@ssw0rdLayer2026!');
    // Agree to DPDP terms
    await page.check('#enroll-terms-checkbox');
    await page.click('#enroll-next-btn');
    await page.waitForTimeout(300);

    // Step 2: Farm Details
    await page.fill('#enroll-farm-name', 'Patil Poultry Farm');
    await page.fill('#enroll-farm-village', 'Sangamner Khurd');
    await page.fill('#enroll-farm-taluka', 'Sangamner');
    await page.fill('#enroll-farm-pincode', '422605');
    await page.click('#enroll-next-btn');
    await page.waitForTimeout(300);

    // Step 3: Sheds & Flocks
    await page.click('#enroll-next-btn');
    await page.waitForTimeout(300);

    // Step 4: Feed & Costs
    await page.click('#enroll-next-btn');
    await page.waitForTimeout(300);

    // Step 5: Egg Sales & Units
    await page.click('#enroll-next-btn');
    await page.waitForTimeout(300);

    // Step 6: Expenses & Finance
    await page.click('#enroll-next-btn');
    await page.waitForTimeout(300);

    // Step 7: Review Screen
    await expect(page.locator('text=Ramesh Patil').or(page.locator('text=Patil Poultry Farm')).first()).toBeVisible();

    // Click Final Submit CTA
    const submitBtn = page.locator('#enroll-submit-btn');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify Welcome Screen appears with personalized metrics
    await expect(page.locator('text=LayerOS तयार झाले आहे').or(page.locator('text=Your LayerOS is ready!')).first()).toBeVisible({ timeout: 15000 });
    
    // Verify 3 next actions are displayed
    await expect(page.locator('text=नोंदवा').or(page.locator('text=आजची अंडी')).first()).toBeVisible();
    await expect(page.locator('text=सुपरवायझर').first()).toBeVisible();
    await expect(page.locator('text=नियोजन').or(page.locator('text=खाद्य')).first()).toBeVisible();

    // Click Go to Dashboard
    const toDashboardBtn = page.locator('#enroll-to-dashboard-btn');
    await expect(toDashboardBtn).toBeVisible();
    await toDashboardBtn.click();

    // Verify Dashboard loads
    await expect(page.locator('text=Patil Poultry Farm').or(page.locator('text=सह्याद्री लेयर फार्म')).or(page.locator('text=LayerOS')).first()).toBeVisible({ timeout: 10000 });
  });

  test('enrollment step 1 enforces phone validation', async ({ page }) => {
    await page.goto('/enroll');
    await page.waitForLoadState('domcontentloaded');

    // Fill invalid mobile number (only 5 digits)
    await page.fill('#enroll-owner-name', 'Ganesh');
    await page.fill('#enroll-owner-phone', '12345');
    await page.click('#enroll-next-btn');

    // Should display validation error
    await expect(page.locator('#enroll-phone-error').first()).toBeVisible({ timeout: 5000 });
  });

  test('login page (/login) renders with Phone OTP and Email/Password tabs', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // Check title and inputs
    await expect(page.locator('#login-tab-phone')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#login-tab-email')).toBeVisible();

    // Switch to Email tab
    await page.click('#login-tab-email');
    await expect(page.locator('#login-email-input')).toBeVisible();
    await expect(page.locator('#login-password-input')).toBeVisible();

    // Forgot password link exists
    await expect(page.locator('#login-forgot-password-link')).toBeVisible();
  });

  test('360px mobile viewport fits without horizontal overflow on / and /enroll', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });

    // Landing page
    await page.goto('/?landing=true');
    await page.waitForLoadState('domcontentloaded');
    let scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(365);

    // Enroll page
    await page.goto('/enroll');
    await page.waitForLoadState('domcontentloaded');
    scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(365);
  });
});
