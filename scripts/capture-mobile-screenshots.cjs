/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('../node_modules/@playwright/test');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 360, height: 740 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  console.log('Capturing Landing Page screenshots in MR, HI, EN...');
  // 1. Landing in Marathi
  await page.goto('http://localhost:3000/?landing=true');
  await page.waitForTimeout(600);
  await page.locator('#landing-lang-mr').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'landing-mr-360px.png'), fullPage: false });

  // 2. Landing in Hindi
  await page.locator('#landing-lang-hi').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'landing-hi-360px.png'), fullPage: false });

  // 3. Landing in English
  await page.locator('#landing-lang-en').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'landing-en-360px.png'), fullPage: false });

  // Reset to Marathi
  await page.locator('#landing-lang-mr').click();
  await page.waitForTimeout(300);

  // 4. Login Page
  console.log('Capturing Login Page screenshot...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'login-mr-360px.png'), fullPage: false });

  // 5. Enrollment Flow steps 1 to 8 in Marathi
  console.log('Capturing Enrollment Steps 1 to 8...');
  await page.goto('http://localhost:3000/enroll');
  await page.waitForTimeout(600);

  // Step 1: Owner
  await page.fill('#enroll-owner-name', 'संजय शिंदे (Sanjay Shinde)');
  await page.fill('#enroll-owner-phone', '9822156789');
  await page.fill('#enroll-owner-email', 'sanjay.shinde.poultry@example.com');
  await page.fill('#enroll-owner-password', 'ShindePass123!');
  await page.check('#enroll-terms-checkbox');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'enroll-step1-owner-360px.png'), fullPage: false });
  await page.click('#enroll-next-btn');
  await page.waitForTimeout(400);

  // Step 2: Farm Details
  await page.fill('#enroll-farm-name', 'शिंदे लेयर फार्म (Shinde Farm)');
  await page.fill('#enroll-farm-village', 'दौंड');
  await page.fill('#enroll-farm-taluka', 'दौंड');
  await page.fill('#enroll-farm-pincode', '412219');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'enroll-step2-farm-360px.png'), fullPage: false });
  await page.click('#enroll-next-btn');
  await page.waitForTimeout(400);

  // Step 3: Sheds & Flocks
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'enroll-step3-flocks-360px.png'), fullPage: false });
  await page.click('#enroll-next-btn');
  await page.waitForTimeout(400);

  // Step 4: Feed & Costs
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'enroll-step4-feed-360px.png'), fullPage: false });
  await page.click('#enroll-next-btn');
  await page.waitForTimeout(400);

  // Step 5: Egg Sales & Units
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'enroll-step5-sales-360px.png'), fullPage: false });
  await page.click('#enroll-next-btn');
  await page.waitForTimeout(400);

  // Step 6: Finance & Expenses
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'enroll-step6-finance-360px.png'), fullPage: false });
  await page.click('#enroll-next-btn');
  await page.waitForTimeout(400);

  // Step 7: Review & Confirm
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'enroll-step7-review-360px.png'), fullPage: false });

  // Submit to reach Welcome Screen (Step 8)
  await page.click('#enroll-submit-btn');
  await page.waitForSelector('#enroll-to-dashboard-btn', { timeout: 15000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'enroll-step8-welcome-360px.png'), fullPage: false });

  // Capture Hindi and English versions of Step 1 and Review
  console.log('Capturing Hindi & English enroll steps...');
  await page.goto('http://localhost:3000/enroll');
  await page.waitForTimeout(500);
  // Switch to Hindi
  await page.locator('#enroll-lang-hi').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'enroll-step1-hi-360px.png'), fullPage: false });

  // Switch to English
  await page.locator('#enroll-lang-en').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'enroll-step1-en-360px.png'), fullPage: false });

  console.log('All screenshots successfully saved to docs/screenshots!');
  await browser.close();
})();
