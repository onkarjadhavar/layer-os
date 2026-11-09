import { describe, it, expect } from 'vitest';
import {
  calculatePlatformKPIs,
  changeFarmStatus,
  extendFarmPlan,
  updatePlatformSettings,
  exportFarmsToCsv,
  INITIAL_DEMO_FARMS,
} from './actions';
import { PlatformAdminUser } from './types';
import {
  authenticateAdminCredentials,
  parseAdminSessionCookie,
  createAdminSessionPayload,
  getAdminSession,
  clearAdminSession,
  ADMIN_COOKIE_NAME,
} from './auth';

// Node test environment mock for document and localStorage
if (typeof (globalThis as any).document === 'undefined') {
  (globalThis as any).document = { cookie: '' };
}
if (typeof (globalThis as any).localStorage === 'undefined') {
  class MockLocalStorage {
    private store: Record<string, string> = {};
    getItem(key: string) { return this.store[key] || null; }
    setItem(key: string, value: string) { this.store[key] = value; }
    removeItem(key: string) { delete this.store[key]; }
    clear() { this.store = {}; }
  }
  (globalThis as any).localStorage = new MockLocalStorage();
}

describe('LayerOS Platform Admin Engine (Stage 5)', () => {
  const superAdmin: PlatformAdminUser = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@layeros.internal',
    role: 'super_admin',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  };

  const operatorAdmin: PlatformAdminUser = {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'operator@layeros.internal',
    role: 'operator',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  };

  it('authenticates demo super admin and operator credentials correctly', () => {
    const admin = authenticateAdminCredentials('admin@layeros.internal', 'SuperAdmin@2026');
    expect(admin).not.toBeNull();
    expect(admin?.role).toBe('super_admin');

    const operator = authenticateAdminCredentials('operator@layeros.internal', 'Operator@2026');
    expect(operator).not.toBeNull();
    expect(operator?.role).toBe('operator');

    const invalid = authenticateAdminCredentials('wrong@layeros.internal', 'badpassword');
    expect(invalid).toBeNull();
  });

  it('creates and parses admin session cookie safely', () => {
    const payload = createAdminSessionPayload(superAdmin);
    expect(payload).toBeDefined();

    const parsed = parseAdminSessionCookie(payload);
    expect(parsed?.admin.email).toBe('admin@layeros.internal');
    expect(parsed?.admin.role).toBe('super_admin');
  });

  it('accurately computes platform overview KPIs', () => {
    const kpis = calculatePlatformKPIs(INITIAL_DEMO_FARMS);
    expect(kpis.totalFarms).toBe(INITIAL_DEMO_FARMS.length);
    expect(kpis.activeFarms).toBeGreaterThanOrEqual(1);
    expect(kpis.pendingFarms).toBeGreaterThanOrEqual(1);
    expect(kpis.suspendedFarms).toBeGreaterThanOrEqual(1);
    expect(kpis.totalBirds).toBeGreaterThan(0);
  });

  it('rejects status changes without mandatory minimum 5-character reason (DPDP audit rule)', async () => {
    const result = await changeFarmStatus(
      {
        farmId: 'farm-sahyadri-01',
        newStatus: 'suspended',
        reason: 'bad', // Too short
      },
      superAdmin
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('Reason is strictly required');
  });

  it('restricts operators from approving or rejecting farms (Super Admin only)', async () => {
    const result = await changeFarmStatus(
      {
        farmId: 'farm-mauli-03',
        newStatus: 'rejected',
        reason: 'Operator attempting to reject farm enrollment.',
      },
      operatorAdmin
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('Super Admin');
  });

  it('allows super admin to approve a pending farm with audit log entry', async () => {
    const result = await changeFarmStatus(
      {
        farmId: 'farm-mauli-03',
        newStatus: 'active',
        reason: 'Verified farm documents and telephone screening successfully.',
      },
      superAdmin
    );
    expect(result.success).toBe(true);
    expect(result.updatedFarm?.status).toBe('active');
  });

  it('extends farm plan duration and records extension', async () => {
    const result = await extendFarmPlan(
      {
        farmId: 'farm-anand-02',
        daysToAdd: 30,
        reason: 'Promotional pilot extension for Diwali festival.',
      },
      superAdmin
    );
    expect(result.success).toBe(true);
    expect(result.updatedFarm).toBeDefined();
  });

  it('prevents operators from updating platform-wide settings', async () => {
    const result = await updatePlatformSettings(
      { enrollmentMode: 'manual_approval' },
      operatorAdmin
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('Super Admins');
  });

  it('exports farms into valid CSV format', () => {
    const csv = exportFarmsToCsv(INITIAL_DEMO_FARMS);
    expect(csv).toContain('Farm ID,Farm Name');
    expect(csv).toContain('farm-sahyadri-01');
  });

  it('correctly handles getAdminSession and clearAdminSession lifecycle', () => {
    // 1. Without cookie, returns null
    document.cookie = `${ADMIN_COOKIE_NAME}=; max-age=0; path=/`;
    expect(getAdminSession()).toBeNull();

    // 2. With valid session cookie, returns parsed admin
    const payload = createAdminSessionPayload(superAdmin);
    document.cookie = `${ADMIN_COOKIE_NAME}=${payload}; path=/`;
    const session = getAdminSession();
    expect(session).not.toBeNull();
    expect(session?.admin.email).toBe('admin@layeros.internal');
    expect(session?.admin.role).toBe('super_admin');

    // 3. Clear session removes the cookie and storage
    localStorage.setItem('layeros_admin_token', 'token_123');
    clearAdminSession();
    expect(getAdminSession()).toBeNull();
    expect(localStorage.getItem('layeros_admin_token')).toBeNull();
  });

  it('rejects expired session cookies in getAdminSession', () => {
    const expiredPayload = encodeURIComponent(
      JSON.stringify({
        admin: superAdmin,
        token: 'layeros_adm_expired',
        expiresAt: new Date(Date.now() - 10000).toISOString(),
      })
    );
    document.cookie = `${ADMIN_COOKIE_NAME}=${expiredPayload}; path=/`;
    expect(getAdminSession()).toBeNull();
  });
});
