/**
 * LayerOS Farm Status Management & Access Control
 * Central authority on farm lifecycle status:
 * 'pending_approval' | 'active' | 'suspended' | 'rejected' | 'cancelled'
 */

export type FarmStatus =
  | 'pending_approval'
  | 'active'
  | 'suspended'
  | 'rejected'
  | 'cancelled';

/**
 * Returns true if farm is active and allowed full application access.
 */
export function isFarmActive(status?: string | null): boolean {
  if (!status) return true; // Default legacy / fallback to active
  return status === 'active';
}

/**
 * Returns true if farm can perform data mutations (logs, sales, expenses).
 * Non-active farms (pending, suspended, rejected, cancelled) are strictly blocked.
 */
export function canFarmWrite(status?: string | null): boolean {
  return isFarmActive(status);
}

export interface FarmStatusConfig {
  status: FarmStatus;
  isAccessible: boolean;
  canWrite: boolean;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  titleKey:
    | 'statusPendingApprovalTitle'
    | 'statusSuspendedTitle'
    | 'statusRejectedTitle'
    | 'statusCancelledTitle'
    | 'planActiveStatus';
  descKey:
    | 'statusPendingApprovalDesc'
    | 'statusSuspendedDesc'
    | 'statusRejectedDesc'
    | 'statusCancelledDesc';
}

export const FARM_STATUS_CONFIGS: Record<FarmStatus, FarmStatusConfig> = {
  active: {
    status: 'active',
    isAccessible: true,
    canWrite: true,
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    titleKey: 'planActiveStatus',
    descKey: 'statusPendingApprovalDesc',
  },
  pending_approval: {
    status: 'pending_approval',
    isAccessible: false,
    canWrite: false,
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    titleKey: 'statusPendingApprovalTitle',
    descKey: 'statusPendingApprovalDesc',
  },
  suspended: {
    status: 'suspended',
    isAccessible: false,
    canWrite: false,
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    titleKey: 'statusSuspendedTitle',
    descKey: 'statusSuspendedDesc',
  },
  rejected: {
    status: 'rejected',
    isAccessible: false,
    canWrite: false,
    badgeBg: 'bg-gray-100 dark:bg-gray-800',
    badgeText: 'text-gray-700 dark:text-gray-300',
    badgeBorder: 'border-gray-300 dark:border-gray-700',
    titleKey: 'statusRejectedTitle',
    descKey: 'statusRejectedDesc',
  },
  cancelled: {
    status: 'cancelled',
    isAccessible: false,
    canWrite: false,
    badgeBg: 'bg-gray-100 dark:bg-gray-800',
    badgeText: 'text-gray-700 dark:text-gray-300',
    badgeBorder: 'border-gray-300 dark:border-gray-700',
    titleKey: 'statusCancelledTitle',
    descKey: 'statusCancelledDesc',
  },
};
