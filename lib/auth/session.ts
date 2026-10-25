import { UserRole } from '../supabase/database.types';

export interface AuthenticatedUser {
  id: string;
  phone: string;
  name: string;
  activeFarmId: string;
  role: UserRole;
  isSuperAdmin?: boolean;
}

/**
 * Validates that an authenticated caller has permission to access the target farm.
 * Throws a SecurityError if the caller attempts to access another tenant's resources (IDOR protection).
 */
export function assertCallerFarmAccess(caller: AuthenticatedUser, targetFarmId: string): void {
  if (caller.isSuperAdmin) {
    return;
  }

  if (!caller.activeFarmId || caller.activeFarmId !== targetFarmId) {
    throw new Error(
      `SECURITY ACCESS DENIED: Cross-tenant access violation. User from farm [${caller.activeFarmId}] cannot access or mutate farm [${targetFarmId}].`
    );
  }
}

/**
 * Validates that the caller possesses one of the authorized roles for a specific operation.
 */
export function assertRolePermission(
  callerRole: UserRole,
  allowedRoles: UserRole[],
  operationName: string
): void {
  if (!allowedRoles.includes(callerRole)) {
    throw new Error(
      `AUTHORIZATION DENIED: Role [${callerRole}] is not authorized to execute [${operationName}]. Required roles: [${allowedRoles.join(', ')}].`
    );
  }
}

/**
 * Role permissions matrix matching README and commercial specs
 */
export const ROLE_PERMISSIONS = {
  dailyEntry: ['owner', 'manager', 'supervisor'] as UserRole[],
  closeDay: ['owner', 'manager'] as UserRole[],
  viewFinances: ['owner', 'manager', 'accountant', 'viewer'] as UserRole[],
  mutateFinances: ['owner', 'manager', 'accountant'] as UserRole[],
  editFlocks: ['owner', 'manager'] as UserRole[],
  manageTeam: ['owner', 'manager'] as UserRole[],
  deleteRecords: ['owner'] as UserRole[],
};
