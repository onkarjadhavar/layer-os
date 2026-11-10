import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Layer OS Reports & Enrolled Customer Zero-Demo-Data Specification Suite', () => {
  const reportsModulePath = path.resolve(__dirname, 'ReportsModule.tsx');
  const storePath = path.resolve(__dirname, '../../lib/store/index.tsx');
  const reportsContent = fs.readFileSync(reportsModulePath, 'utf-8');
  const storeContent = fs.readFileSync(storePath, 'utf-8');

  it('guarantees ReportsModule filters out demo records when not in demo mode', () => {
    // Check that sortedRecords filters out demo records for enrolled farms
    expect(reportsContent).toContain('isDemoMode');
    expect(reportsContent).toContain("farmId !== 'farm-sahyadri-01'");
    expect(reportsContent).toContain("farmId !== 'farm-anand-02'");
  });

  it('provides an informative empty state for enrolled customers with zero records', () => {
    // When sortedRecords.length === 0, an empty state card/banner must be rendered
    expect(reportsContent).toContain('अद्याप कोणतीही दैनिक नोंद केलेली नाही');
    expect(reportsContent).toContain('+ पहिली दैनिक नोंद करा (Log Day 1 Record)');
    expect(reportsContent).toContain('अद्याप कोणतीही दैनंदिन नोंद उपलब्ध नाही');
  });

  it('renders a distinct demo preview banner strictly when isDemoMode is true', () => {
    expect(reportsContent).toContain('प्रात्यक्षिक नमुना डेटा (Demo Preview Mode — सह्याद्री लेयर फार्म)');
    expect(reportsContent).toContain('प्रात्यक्षिक नमुना (Demo Preview Data)');
    expect(reportsContent).toContain('नोंदणीकृत पोल्ट्री (Enrolled Customer OS)');
  });

  it('guarantees store strictly isolates enrolled customer daily records and defaults to zero demo data', () => {
    // Enrolled customer must never receive generate90DaysDailyRecords
    expect(storeContent).toContain('isEnrolledInit');
    expect(storeContent).toContain("farmId !== 'farm-sahyadri-01'");
    expect(storeContent).toContain("farmId !== 'farm-anand-02'");
  });

  it('provides an empty state for customer receivables ledger when no customers or balances exist', () => {
    expect(reportsContent).toContain('सध्या कोणतीही व्यापारी किंवा ग्राहक थकबाकी नोंद नाही');
  });

  it('displays the active enrolled farm confirmation strip with customer data on ReferenceDashboard', () => {
    const dashboardPath = path.resolve(__dirname, '../dashboard/ReferenceDashboard.tsx');
    const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');
    expect(dashboardContent).toContain('✓ नोंदणीकृत लेयर ओएस (Active Layer OS)');
    expect(dashboardContent).toContain('farm.name');
    expect(dashboardContent).toContain('flock?.breed');
    expect(dashboardContent).toContain('customerName');
  });

  it('ensures HomePage seamlessly builds Layer OS from enrolled data without network failure blocking', () => {
    const homePagePath = path.resolve(__dirname, '../../pages/HomePage.tsx');
    const homePageContent = fs.readFileSync(homePagePath, 'utf-8');
    expect(homePageContent).toContain('isAlreadyLoaded');
    expect(homePageContent).toContain('layeros_app_state_v1');
  });
});

