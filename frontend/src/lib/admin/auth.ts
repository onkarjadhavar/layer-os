/**
 * LayerOS Platform Admin Authentication & Session Management
 * Handles platform credentials verification and session cookies.
 */

import { PlatformAdminUser } from './types';

export const ADMIN_COOKIE_NAME = 'layeros_admin_session';

export const PLATFORM_ADMINS: PlatformAdminUser[] = [
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
 */
export function authenticateAdminCredentials(
  email: string,
  pass: string,
  totp?: string
): PlatformAdminUser | null {
  const normalizedEmail = email.trim().toLowerCase();

  const isSuperAdminEmail =
    normalizedEmail === 'admin@layeros.internal' || normalizedEmail === 'admin@layeros.in';
  const isSuperAdminPass =
    pass === 'SuperAdmin@2026' || pass === 'SuperAdmin@LayerOS2026!';

  if (isSuperAdminEmail && isSuperAdminPass) {
    return PLATFORM_ADMINS[0];
  }

  const isOperatorEmail =
    normalizedEmail === 'operator@layeros.internal' || normalizedEmail === 'operator@layeros.in';
  const isOperatorPass =
    pass === 'Operator@2026' || pass === 'Operator@LayerOS2026!';

  if (isOperatorEmail && isOperatorPass) {
    return PLATFORM_ADMINS[1];
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

/**
 * Retrieves the currently active admin session from cookies synchronously.
 * Returns null if the cookie is missing, invalid, or expired.
 */
export function getAdminSession(): AdminSession | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)layeros_admin_session=([^;]+)/);
  if (!match || !match[1]) return null;
  return parseAdminSessionCookie(match[1]);
}

/**
 * Completely purges admin session cookies and local storage tokens.
 */
export function clearAdminSession(): void {
  if (typeof document !== 'undefined') {
    // Multiple path/domain permutations to guarantee deletion
    document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
    document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
    document.cookie = `${ADMIN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('layeros_admin_token');
  }
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('layeros_admin_token');
  }
}
