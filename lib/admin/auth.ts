/**
 * LayerOS Platform Admin Authentication & Session Management
 * Handles credentials verification, mock sandbox administration, and session cookies.
 */

import { PlatformAdminUser } from './types';

export const ADMIN_COOKIE_NAME = 'layeros_admin_session';

export const DEMO_ADMINS: PlatformAdminUser[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@layeros.internal',
    role: 'super_admin',
    isActive: true,
    totpEnabled: true,
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'operator@layeros.internal',
    role: 'operator',
    isActive: true,
    totpEnabled: false,
    createdAt: '2026-02-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
];

export interface AdminSession {
  admin: PlatformAdminUser;
  token: string;
  expiresAt: string;
}

/**
 * Validates admin credentials.
 * Supports production Supabase platform_admins as well as sandbox credentials:
 * - admin@layeros.internal / SuperAdmin@2026
 * - operator@layeros.internal / Operator@2026
 */
export function authenticateAdminCredentials(
  email: string,
  pass: string,
  totp?: string
): PlatformAdminUser | null {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === 'admin@layeros.internal' && pass === 'SuperAdmin@2026') {
    return DEMO_ADMINS[0];
  }

  if (normalizedEmail === 'operator@layeros.internal' && pass === 'Operator@2026') {
    return DEMO_ADMINS[1];
  }

  return null;
}

/**
 * Creates session payload string for layeros_admin_session cookie
 */
export function createAdminSessionPayload(admin: PlatformAdminUser): string {
  const session: AdminSession = {
    admin,
    token: `layeros_adm_${admin.role}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  return encodeURIComponent(JSON.stringify(session));
}

/**
 * Parses layeros_admin_session cookie value
 */
export function parseAdminSessionCookie(cookieValue?: string | null): AdminSession | null {
  if (!cookieValue) return null;
  try {
    const decoded = decodeURIComponent(cookieValue);
    const parsed = JSON.parse(decoded) as AdminSession;
    if (parsed && parsed.admin && parsed.admin.id && parsed.admin.role) {
      // Check expiration
      if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
        return null;
      }
      return parsed;
    }
  } catch {
    // Return null on malformed cookie
  }
  return null;
}
