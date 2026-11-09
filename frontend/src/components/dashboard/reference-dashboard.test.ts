import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Layer OS Reference-Match Dashboard & Shell Specification Suite', () => {
  const publicImagesDir = path.resolve(__dirname, '../../../public/images');
  const iconsDir = path.join(publicImagesDir, 'icons');

  it('verifies all reference assets exist with valid non-zero content', () => {
    const requiredAssets = [
      'hero-banner-full.png',
      'hero-mobile-banner.png',
      'bottom-landscape-strip.png',
      'sidebar-farm-illustration.png',
      'layer-os-circular-logo.png',
    ];

    for (const asset of requiredAssets) {
      const p = path.join(publicImagesDir, asset);
      expect(fs.existsSync(p), `Missing asset: ${asset}`).toBe(true);
      expect(fs.statSync(p).size).toBeGreaterThan(1000);
    }

    const requiredIcons = [
      'icon-farm-entry.png',
      'icon-sales.png',
      'icon-reports.png',
      'icon-expenses.png',
      'icon-health.png',
      'icon-forecast.png',
      'icon-feed.png',
      'icon-tools.png',
      'icon-settings.png',
    ];

    for (const icon of requiredIcons) {
      const p = path.join(iconsDir, icon);
      expect(fs.existsSync(p), `Missing module icon: ${icon}`).toBe(true);
      expect(fs.statSync(p).size).toBeGreaterThan(1000);
    }
  });

  it('validates exact 9 modules in exact order and colors in ReferenceDashboard.tsx', () => {
    const filePath = path.resolve(__dirname, 'ReferenceDashboard.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    // 1. Exact 9 module titles in order
    const expectedModulesInOrder = [
      'Farm Entry',
      'Sales Management',
      'Reports',
      'Expense & Accounts',
      'Vaccine & Health',
      'AI 30-Day Forecast',
      'Feed Management',
      'Calculator & Tools',
      'Settings & Team',
    ];

    let lastIndex = -1;
    for (const mod of expectedModulesInOrder) {
      const index = content.indexOf(`title: '${mod}'`);
      expect(index, `Module ${mod} not found in ReferenceDashboard`).toBeGreaterThan(-1);
      expect(index, `Module ${mod} is out of specified order`).toBeGreaterThan(lastIndex);
      lastIndex = index;
    }

    // 2. Mandi Rates must not appear as a dashboard card
    expect(content).not.toContain("title: 'Mandi Rates'");
    expect(content).not.toContain("title: 'Market Rates'");

    // 3. Only ONE Farm Entry card exists
    const farmEntryMatches = content.match(/title:\s*'Farm Entry'/g);
    expect(farmEntryMatches?.length).toBe(1);

    // 4. Color token mapping integrity
    expect(content).toContain("#E8F1C9"); // Pale sage
    expect(content).toContain("#FBE5C2"); // Warm peach
    expect(content).toContain("#EADCF5"); // Soft lavender
    expect(content).toContain("#DCEBF2"); // Pale blue

    // 5. Hero banners and landscape strip referenced
    expect(content).toContain('/images/hero-banner-full.png');
    expect(content).toContain('/images/hero-mobile-banner.png');
    expect(content).toContain('/images/bottom-landscape-strip.png');
  });

  it('validates Sidebar.tsx adheres to forest green shell, 4 links, and bottom illustration', () => {
    const filePath = path.resolve(__dirname, '../layout/Sidebar.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Forest green theme
    expect(content).toContain('#173F20');

    // 4 exact links
    expect(content).toContain('sidebar-nav-dashboard');
    expect(content).toContain('sidebar-nav-farm-info');
    expect(content).toContain('sidebar-nav-help');
    expect(content).toContain('sidebar-nav-about');

    // Bottom farm illustration and tagline
    expect(content).toContain('/images/sidebar-farm-illustration.png');
    expect(content).toContain('Smart Poultry Better Tomorrow');
  });

  it('validates HomePage.tsx integrates Sidebar, ReferenceDashboard, and internal module navigation', () => {
    const filePath = path.resolve(__dirname, '../../pages/HomePage.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    expect(content).toContain('<ReferenceDashboard');
    expect(content).toContain('<Sidebar');
    expect(content).toContain("currentTab === 'home'");
    // Navigation back to dashboard from modules
    expect(content).toContain('handleSelectTab');
  });
});
