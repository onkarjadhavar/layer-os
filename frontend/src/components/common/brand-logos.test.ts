import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Layer OS Official Brand Logo Integration Suite', () => {
  const publicImagesDir = path.resolve(__dirname, '../../../public/images');
  const circularPath = path.join(publicImagesDir, 'layer-os-circular-logo.png');
  const horizontalPath = path.join(publicImagesDir, 'layer-os-horizontal-logo.png');

  it('verifies official logo asset files exist in public/images/ with non-zero size', () => {
    expect(fs.existsSync(circularPath)).toBe(true);
    expect(fs.existsSync(horizontalPath)).toBe(true);

    const circularStat = fs.statSync(circularPath);
    const horizontalStat = fs.statSync(horizontalPath);

    expect(circularStat.size).toBeGreaterThan(100000); // authentic high-res PNG
    expect(horizontalStat.size).toBeGreaterThan(50000); // authentic high-res PNG
  });

  it('validates circular logo in LandingTopBar component code', () => {
    const topBarFile = path.resolve(__dirname, '../landing/LandingTopBar.tsx');
    const content = fs.readFileSync(topBarFile, 'utf-8');

    // Circular logo asset referenced
    expect(content).toContain('/images/layer-os-circular-logo.png');
    // Correct exact alt attribute
    expect(content).toContain('alt="Layer OS Circular Logo"');
    // Display sizing: 40px desktop, 34px mobile
    expect(content).toContain('w-[34px] h-[34px]');
    expect(content).toContain('sm:w-[40px] sm:h-[40px]');
    // Object fit contain
    expect(content).toContain('object-contain');
  });

  it('validates circular logo in dashboard TopBar component code', () => {
    const topBarFile = path.resolve(__dirname, '../layout/TopBar.tsx');
    const content = fs.readFileSync(topBarFile, 'utf-8');

    // Circular logo asset referenced
    expect(content).toContain('/images/layer-os-circular-logo.png');
    // Correct exact alt attribute
    expect(content).toContain('alt="Layer OS Circular Logo"');
    // Display sizing: 40px desktop, 34px mobile
    expect(content).toContain('w-[34px] h-[34px]');
    expect(content).toContain('sm:w-[40px] sm:h-[40px]');
    // Object fit contain
    expect(content).toContain('object-contain');
  });

  it('validates horizontal logo in LandingFooter component code', () => {
    const footerFile = path.resolve(__dirname, '../landing/LandingFooter.tsx');
    const content = fs.readFileSync(footerFile, 'utf-8');

    // Horizontal logo asset referenced
    expect(content).toContain('/images/layer-os-horizontal-logo.png');
    // Correct exact alt attribute
    expect(content).toContain('alt="Layer OS Brand Logo"');
    // Display sizing: max-width 190px, desktop height 48px, mobile width 160px
    expect(content).toContain('md:w-[190px]');
    expect(content).toContain('sm:max-h-[48px]');
    expect(content).toContain('sm:w-[160px]');
    // Object fit contain
    expect(content).toContain('object-contain');
    // Contrast handling with brand Warm Ivory #F5F3EC
    expect(content).toContain('bg-[#F5F3EC]');
    // No duplicate brand text adjacent to horizontal logo
    expect(content).not.toContain('<LayerOSLogo size={36} showText />');
  });
});

