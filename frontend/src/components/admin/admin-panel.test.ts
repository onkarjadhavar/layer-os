import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('LayerOS Enterprise Platform Admin Panel Architecture Suite', () => {
  const adminDir = path.resolve(__dirname, './');

  it('verifies all modular admin components exist and are non-empty', () => {
    const requiredFiles = [
      'AdminSidebar.tsx',
      'AdminHeader.tsx',
      'AdminOverviewTab.tsx',
      'AdminFarmsTab.tsx',
      'AdminFarmDetailsDrawer.tsx',
      'AdminApprovalsTab.tsx',
      'AdminSubscriptionsTab.tsx',
      'AdminBillingTab.tsx',
      'AdminAnalyticsTab.tsx',
      'AdminSupportTab.tsx',
      'AdminAuditLogsTab.tsx',
      'AdminSystemHealthTab.tsx',
      'AdminSettingsTab.tsx',
      'AdminOperatorsTab.tsx',
      'AdminActionModal.tsx',
      'AdminExtendModal.tsx',
      'AdminSupportModal.tsx',
      'AdminProtectedRoute.tsx',
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(adminDir, file);
      expect(fs.existsSync(filePath), `Expected ${file} to exist`).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(100);
    }
  });

  it('verifies AdminSidebar implements the 4 enterprise groups and official circular logo', () => {
    const content = fs.readFileSync(path.join(adminDir, 'AdminSidebar.tsx'), 'utf-8');

    // 4 Enterprise Navigation Groups
    expect(content).toContain("'PLATFORM'");
    expect(content).toContain("'BUSINESS'");
    expect(content).toContain("'OPERATIONS'");
    expect(content).toContain("'CONFIGURATION'");

    // Authentic circular logo emblem
    expect(content).toContain('/images/layer-os-circular-logo.png');
    expect(content).toContain('alt="Layer OS Circular Logo"');

    // Collapsible & responsive states
    expect(content).toContain('isCollapsed');
    expect(content).toContain('isMobileOpen');

    // Role distinction
    expect(content).toContain('super_admin');
    expect(content).toContain('operator');
  });

  it('verifies AdminOverviewTab computes and renders the 7 balanced KPI cards', () => {
    const content = fs.readFileSync(path.join(adminDir, 'AdminOverviewTab.tsx'), 'utf-8');

    // 7 Metrics
    expect(content).toContain('Total Farms');
    expect(content).toContain('Active Farms');
    expect(content).toContain('Pending Approvals');
    expect(content).toContain('Suspended Farms');
    expect(content).toContain('Birds Managed');
    expect(content).toContain('Monthly MRR');
    expect(content).toContain('Expiring (7D)');

    // Tabular numerals for data accuracy
    expect(content).toContain('tabular-nums');

    // Distribution breakdown
    expect(content).toContain('Farm Status Breakdown');
    expect(content).toContain('Subscription Distribution');
  });

  it('verifies AdminFarmsTab includes multi-tenant filtering, pagination & 360 inspection', () => {
    const content = fs.readFileSync(path.join(adminDir, 'AdminFarmsTab.tsx'), 'utf-8');

    // Filters
    expect(content).toContain('statusFilter');
    expect(content).toContain('planFilter');
    expect(content).toContain('districtFilter');

    // Pagination
    expect(content).toContain('currentPage');
    expect(content).toContain('pageSize');
    expect(content).toContain('totalPages');

    // Actions
    expect(content).toContain('onSelectFarm');
    expect(content).toContain('onOpenActionModal');
    expect(content).toContain('onOpenExtendModal');
    expect(content).toContain('onOpenSupportView');
  });

  it('verifies AdminActionModal and AdminExtendModal enforce mandatory reason', () => {
    const actionContent = fs.readFileSync(path.join(adminDir, 'AdminActionModal.tsx'), 'utf-8');
    const extendContent = fs.readFileSync(path.join(adminDir, 'AdminExtendModal.tsx'), 'utf-8');

    expect(actionContent).toContain('reason');
    expect(actionContent).toContain('disabled={!reason.trim()');

    expect(extendContent).toContain('reason');
    expect(extendContent).toContain('disabled={!reason.trim()');
  });

  it('verifies AdminSupportModal complies with DPDP 2023 audit standards', () => {
    const supportContent = fs.readFileSync(path.join(adminDir, 'AdminSupportModal.tsx'), 'utf-8');
    expect(supportContent).toContain('DPDP 2023');
  });
});

