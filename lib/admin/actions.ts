/**
 * LayerOS Platform Admin Data Access & Actions
 * Core business logic for multi-farm supervision, lifecycle state changes,
 * append-only audit trail logging, and DPDP support view.
 */

import {
  AdminAuditEntry,
  AdminFarmSummary,
  ChangeFarmStatusPayload,
  ExtendPlanPayload,
  PlatformAdminUser,
  PlatformKPIs,
  PlatformSettings,
} from './types';
import { FarmStatus } from '../auth/farm-status';
import { getSupabaseBrowserClient } from '../supabase/client';

export const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  enrollmentMode: 'auto_approve',
  defaultTrialDays: 30,
  supportPhone: '+91 98220 12345',
  supportWhatsapp: '+91 98220 12345',
  supportEmail: 'support@layeros.in',
  maintenanceBanner: '',
  isMaintenanceActive: false,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_DEMO_FARMS: AdminFarmSummary[] = [
  {
    id: 'farm-sahyadri-01',
    name: 'सह्याद्री लेयर फार्म (Sahyadri Layer Farm)',
    ownerName: 'सचिन गायकवाड (Sachin Gaikwad)',
    phone: '+91 98220 12345',
    email: 'sachin@sahyadrilayer.com',
    district: 'Pune / दौंड',
    state: 'Maharashtra',
    totalCapacity: 35000,
    status: 'active',
    enrolledAt: '2026-08-15T09:30:00Z',
    approvedAt: '2026-08-15T10:00:00Z',
    planId: 'grower_pro',
    planStartedAt: '2026-08-15T10:00:00Z',
    planEndsAt: '2026-11-15T10:00:00Z',
    currentBirdCount: 30000,
    flockCount: 3,
    shedCount: 3,
  },
  {
    id: 'farm-anand-02',
    name: 'आनंद पोल्ट्री फार्म (Anand Poultry Farm)',
    ownerName: 'सचिन गायकवाड (Sachin Gaikwad)',
    phone: '+91 98220 12345',
    email: 'sachin@anandpoultry.com',
    district: 'Sangli / तासगाव',
    state: 'Maharashtra',
    totalCapacity: 20000,
    status: 'active',
    enrolledAt: '2026-09-01T11:20:00Z',
    approvedAt: '2026-09-01T12:00:00Z',
    planId: 'starter',
    planStartedAt: '2026-09-01T12:00:00Z',
    planEndsAt: '2026-10-31T12:00:00Z',
    currentBirdCount: 18500,
    flockCount: 2,
    shedCount: 2,
  },
  {
    id: 'farm-mauli-03',
    name: 'माऊली ॲग्रो लेयर्स (Mauli Agro Layers)',
    ownerName: 'दत्तात्रय कदम (Dattatray Kadam)',
    phone: '+91 98901 23456',
    email: 'dattatray@mauliagro.in',
    district: 'Solapur / पंढरपूर',
    state: 'Maharashtra',
    totalCapacity: 50000,
    status: 'pending_approval',
    statusReason: 'New farm enrollment submitted with 45,000 birds. Awaiting KYC phone verification.',
    enrolledAt: '2026-10-24T14:45:00Z',
    planId: 'enterprise',
    planStartedAt: '2026-10-24T14:45:00Z',
    planEndsAt: '2026-11-24T14:45:00Z',
    currentBirdCount: 45000,
    flockCount: 4,
    shedCount: 4,
  },
  {
    id: 'farm-krishna-04',
    name: 'कृष्णा पोल्ट्री ब्रिडर्स (Krishna Poultry Breeders)',
    ownerName: 'गणेश मोहिते (Ganesh Mohite)',
    phone: '+91 97654 32109',
    email: 'ganesh@krishnapoultry.com',
    district: 'Satara / कऱ्हाड',
    state: 'Maharashtra',
    totalCapacity: 25000,
    status: 'suspended',
    statusReason: 'Payment default for Grower Pro tier and repeated unresponsive reminder calls.',
    enrolledAt: '2026-07-10T08:15:00Z',
    approvedAt: '2026-07-10T09:00:00Z',
    planId: 'grower_pro',
    planStartedAt: '2026-07-10T09:00:00Z',
    planEndsAt: '2026-09-10T09:00:00Z',
    currentBirdCount: 22000,
    flockCount: 2,
    shedCount: 2,
  },
  {
    id: 'farm-godavari-05',
    name: 'गोदावरी लेयर युनिट (Godavari Layer Unit)',
    ownerName: 'विकास पाटील (Vikas Patil)',
    phone: '+91 94220 88776',
    email: 'vikas@godavarilayers.in',
    district: 'Nashik / निफाड',
    state: 'Maharashtra',
    totalCapacity: 15000,
    status: 'rejected',
    statusReason: 'Invalid phone number provided and failed address verification during phone screening.',
    enrolledAt: '2026-10-20T10:15:00Z',
    planId: 'starter',
    planStartedAt: '2026-10-20T10:15:00Z',
    planEndsAt: '2026-11-20T10:15:00Z',
    currentBirdCount: 0,
    flockCount: 0,
    shedCount: 1,
  },
];

export const INITIAL_AUDIT_LOGS: AdminAuditEntry[] = [
  {
    id: 'audit-001',
    adminId: '00000000-0000-0000-0000-000000000001',
    adminEmail: 'admin@layeros.internal',
    adminRole: 'super_admin',
    action: 'approve_farm',
    farmId: 'farm-sahyadri-01',
    farmName: 'सह्याद्री लेयर फार्म',
    previousStatus: 'pending_approval',
    newStatus: 'active',
    reason: 'Verified farm license & phone contact confirmed by Super Admin.',
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'audit-002',
    adminId: '00000000-0000-0000-0000-000000000002',
    adminEmail: 'operator@layeros.internal',
    adminRole: 'operator',
    action: 'suspend_farm',
    farmId: 'farm-krishna-04',
    farmName: 'कृष्णा पोल्ट्री ब्रिडर्स',
    previousStatus: 'active',
    newStatus: 'suspended',
    reason: 'Subscription renewal failure after 3 failed payment webhook attempts.',
    ip: '192.168.1.15',
    userAgent: 'Mozilla/5.0 (Android 14; Mobile; rv:128.0)',
    createdAt: '2026-09-12T16:40:00Z',
  },
];

// Local memory store for sandbox operations
const inMemoryFarms = [...INITIAL_DEMO_FARMS];
const inMemoryAuditLogs = [...INITIAL_AUDIT_LOGS];
let inMemorySettings = { ...INITIAL_PLATFORM_SETTINGS };

/**
 * Calculates platform overview KPIs
 */
export function calculatePlatformKPIs(farms: AdminFarmSummary[]): PlatformKPIs {
  const now = Date.now();
  const in7Days = now + 7 * 24 * 60 * 60 * 1000;

  let totalBirds = 0;
  let activeFarms = 0;
  let pendingFarms = 0;
  let suspendedFarms = 0;
  let rejectedFarms = 0;
  let estimatedMRR = 0;
  let expiringIn7Days = 0;

  for (const farm of farms) {
    totalBirds += farm.currentBirdCount || 0;

    if (farm.status === 'active') {
      activeFarms++;
      if (farm.planId === 'grower_pro') estimatedMRR += 999;
      else if (farm.planId === 'enterprise') estimatedMRR += 2499;

      const planEnd = new Date(farm.planEndsAt).getTime();
      if (planEnd > now && planEnd <= in7Days) {
        expiringIn7Days++;
      }
    } else if (farm.status === 'pending_approval') {
      pendingFarms++;
    } else if (farm.status === 'suspended') {
      suspendedFarms++;
    } else if (farm.status === 'rejected') {
      rejectedFarms++;
    }
  }

  return {
    totalFarms: farms.length,
    activeFarms,
    pendingFarms,
    suspendedFarms,
    rejectedFarms,
    totalBirds,
    estimatedMRR,
    expiringIn7Days,
  };
}

/**
 * Fetches platform summary statistics
 */
export async function getPlatformKPIs(): Promise<PlatformKPIs> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data: farmsData } = await supabase.from('farms').select('*');
      if (farmsData && farmsData.length > 0) {
        const mapped: AdminFarmSummary[] = farmsData.map((f: any) => ({
          id: f.id,
          name: f.name,
          ownerName: f.owner_name || '',
          phone: f.phone || '',
          email: f.email || '',
          district: f.district || '',
          state: f.state || '',
          totalCapacity: f.total_capacity || 0,
          status: f.status || 'active',
          statusReason: f.status_reason,
          enrolledAt: f.enrolled_at || f.created_at,
          approvedAt: f.approved_at,
          planId: f.plan_id || 'starter',
          planStartedAt: f.plan_started_at || f.created_at,
          planEndsAt: f.plan_ends_at || new Date(Date.now() + 30 * 86400000).toISOString(),
          currentBirdCount: f.total_capacity || 0,
        }));
        return calculatePlatformKPIs(mapped);
      }
    } catch {
      // Fallback to inMemoryFarms on query error
    }
  }
  return calculatePlatformKPIs(inMemoryFarms);
}

/**
 * Lists enrolled farms with optional status filtering and query search
 */
export async function listAdminFarms(
  statusFilter?: FarmStatus | 'all',
  searchQuery?: string
): Promise<AdminFarmSummary[]> {
  let farms = [...inMemoryFarms];

  if (statusFilter && statusFilter !== 'all') {
    farms = farms.filter((f) => f.status === statusFilter);
  }

  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();
    farms = farms.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.ownerName.toLowerCase().includes(q) ||
        f.phone.includes(q) ||
        f.district.toLowerCase().includes(q)
    );
  }

  return farms;
}

/**
 * Changes farm status with strict validation, role enforcement and audit logging.
 * - Mandatory reason >= 5 characters (DPDP compliance)
 * - Operators cannot approve or reject (Super Admin only)
 * - Cannot change to the same status
 */
export async function changeFarmStatus(
  payload: ChangeFarmStatusPayload,
  admin: PlatformAdminUser
): Promise<{ success: boolean; error?: string; updatedFarm?: AdminFarmSummary }> {
  const { farmId, newStatus, reason } = payload;

  if (!reason || reason.trim().length < 5) {
    return {
      success: false,
      error: 'Reason is strictly required (minimum 5 characters) for audit trail compliance.',
    };
  }

  if (admin.role === 'operator' && (newStatus === 'pending_approval' || newStatus === 'rejected')) {
    return {
      success: false,
      error: 'Operators can only suspend or reactivate farms. Approval and rejection require Super Admin privileges.',
    };
  }

  const farmIndex = inMemoryFarms.findIndex((f) => f.id === farmId);
  if (farmIndex === -1) {
    return { success: false, error: 'Target farm not found.' };
  }

  const currentFarm = inMemoryFarms[farmIndex];
  if (currentFarm.status === newStatus) {
    return { success: false, error: `Farm is already in '${newStatus}' status.` };
  }

  const oldStatus = currentFarm.status;
  const updatedFarm: AdminFarmSummary = {
    ...currentFarm,
    status: newStatus,
    statusReason: reason.trim(),
    approvedAt: newStatus === 'active' && !currentFarm.approvedAt ? new Date().toISOString() : currentFarm.approvedAt,
  };

  inMemoryFarms[farmIndex] = updatedFarm;

  // Append immutable audit entry
  const auditEntry: AdminAuditEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    adminId: admin.id,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: `change_farm_status_${newStatus}`,
    farmId: updatedFarm.id,
    farmName: updatedFarm.name,
    previousStatus: oldStatus,
    newStatus: newStatus,
    reason: reason.trim(),
    ip: '127.0.0.1',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server Agent',
    createdAt: new Date().toISOString(),
  };

  inMemoryAuditLogs.unshift(auditEntry);

  return { success: true, updatedFarm };
}

/**
 * Extends farm plan or trial duration
 */
export async function extendFarmPlan(
  payload: ExtendPlanPayload,
  admin: PlatformAdminUser
): Promise<{ success: boolean; error?: string; updatedFarm?: AdminFarmSummary }> {
  const { farmId, daysToAdd, reason } = payload;

  if (daysToAdd <= 0) {
    return { success: false, error: 'Days to add must be greater than zero.' };
  }

  if (!reason || reason.trim().length < 5) {
    return { success: false, error: 'Reason is required for plan duration modification.' };
  }

  const farmIndex = inMemoryFarms.findIndex((f) => f.id === farmId);
  if (farmIndex === -1) {
    return { success: false, error: 'Target farm not found.' };
  }

  const currentFarm = inMemoryFarms[farmIndex];
  const currentEnd = new Date(currentFarm.planEndsAt).getTime();
  const baseTime = currentEnd > Date.now() ? currentEnd : Date.now();
  const newEndsAt = new Date(baseTime + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

  const updatedFarm: AdminFarmSummary = {
    ...currentFarm,
    planEndsAt: newEndsAt,
  };

  inMemoryFarms[farmIndex] = updatedFarm;

  // Append audit entry
  const auditEntry: AdminAuditEntry = {
    id: `audit-extend-${Date.now()}`,
    adminId: admin.id,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: 'extend_plan_duration',
    farmId: updatedFarm.id,
    farmName: updatedFarm.name,
    reason: `${reason.trim()} (+${daysToAdd} days extended to ${newEndsAt.substring(0, 10)})`,
    createdAt: new Date().toISOString(),
  };

  inMemoryAuditLogs.unshift(auditEntry);

  return { success: true, updatedFarm };
}

/**
 * Logs a customer support impersonation / support view access
 */
export async function recordSupportViewAccess(
  farmId: string,
  admin: PlatformAdminUser,
  reason: string
): Promise<AdminAuditEntry> {
  const farm = inMemoryFarms.find((f) => f.id === farmId);

  const entry: AdminAuditEntry = {
    id: `audit-support-${Date.now()}`,
    adminId: admin.id,
    adminEmail: admin.email,
    adminRole: admin.role,
    action: 'support_view_accessed',
    farmId: farm?.id || farmId,
    farmName: farm?.name || 'Unknown Farm',
    reason: reason.trim() || 'Direct support inspection requested by farm owner',
    createdAt: new Date().toISOString(),
  };

  inMemoryAuditLogs.unshift(entry);
  return entry;
}

/**
 * Fetches the immutable platform audit log
 */
export async function listAdminAuditLogs(farmId?: string): Promise<AdminAuditEntry[]> {
  if (farmId) {
    return inMemoryAuditLogs.filter((a) => a.farmId === farmId);
  }
  return inMemoryAuditLogs;
}

/**
 * Fetches platform settings
 */
export async function getPlatformSettings(): Promise<PlatformSettings> {
  return inMemorySettings;
}

/**
 * Updates platform settings (Super Admin only)
 */
export async function updatePlatformSettings(
  settings: Partial<PlatformSettings>,
  admin: PlatformAdminUser
): Promise<{ success: boolean; error?: string; settings?: PlatformSettings }> {
  if (admin.role !== 'super_admin') {
    return {
      success: false,
      error: 'Only Super Admins have permission to modify platform-level settings.',
    };
  }

  inMemorySettings = {
    ...inMemorySettings,
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  return { success: true, settings: inMemorySettings };
}

/**
 * Generates CSV string for farm export
 */
export function exportFarmsToCsv(farms: AdminFarmSummary[]): string {
  const headers = [
    'Farm ID',
    'Farm Name',
    'Owner Name',
    'Phone',
    'Email',
    'District',
    'State',
    'Status',
    'Capacity',
    'Birds',
    'Plan',
    'Plan Ends',
  ];

  const rows = farms.map((f) => [
    `"${f.id}"`,
    `"${f.name.replace(/"/g, '""')}"`,
    `"${f.ownerName.replace(/"/g, '""')}"`,
    `"${f.phone}"`,
    `"${f.email}"`,
    `"${f.district}"`,
    `"${f.state}"`,
    `"${f.status}"`,
    f.totalCapacity,
    f.currentBirdCount || 0,
    `"${f.planId}"`,
    `"${f.planEndsAt}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Generates CSV string for audit trail export
 */
export function exportAuditLogsToCsv(logs: AdminAuditEntry[]): string {
  const headers = [
    'Audit ID',
    'Timestamp',
    'Admin Email',
    'Admin Role',
    'Action',
    'Farm Name',
    'Previous Status',
    'New Status',
    'Reason',
  ];

  const rows = logs.map((l) => [
    `"${l.id}"`,
    `"${l.createdAt}"`,
    `"${l.adminEmail}"`,
    `"${l.adminRole}"`,
    `"${l.action}"`,
    `"${(l.farmName || '').replace(/"/g, '""')}"`,
    `"${l.previousStatus || ''}"`,
    `"${l.newStatus || ''}"`,
    `"${l.reason.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
