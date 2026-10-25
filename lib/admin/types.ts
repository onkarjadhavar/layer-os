/**
 * LayerOS Platform Admin Type Definitions
 * Data contracts for Multi-Farm Supervision, Status Lifecycle & DPDP Audit Trails.
 */

import { FarmStatus } from '../auth/farm-status';

export type PlatformAdminRole = 'super_admin' | 'operator';

export interface PlatformAdminUser {
  id: string;
  email: string;
  role: PlatformAdminRole;
  isActive: boolean;
  totpEnabled?: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AdminFarmSummary {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  district: string;
  state: string;
  totalCapacity: number;
  status: FarmStatus;
  statusReason?: string;
  enrolledAt: string;
  approvedAt?: string;
  planId: string;
  planStartedAt: string;
  planEndsAt: string;
  lastActiveAt?: string;
  currentBirdCount?: number;
  flockCount?: number;
  shedCount?: number;
}

export interface AdminAuditEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  adminRole: PlatformAdminRole;
  action: string;
  farmId?: string;
  farmName?: string;
  previousStatus?: FarmStatus;
  newStatus?: FarmStatus;
  reason: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface PlatformSettings {
  id: string;
  enrollmentMode: 'auto_approve' | 'manual_approval';
  defaultTrialDays: number;
  supportPhone: string;
  supportWhatsapp: string;
  supportEmail: string;
  maintenanceBanner?: string;
  isMaintenanceActive: boolean;
  updatedAt: string;
}

export interface PlatformKPIs {
  totalFarms: number;
  activeFarms: number;
  pendingFarms: number;
  suspendedFarms: number;
  rejectedFarms: number;
  totalBirds: number;
  estimatedMRR: number;
  expiringIn7Days: number;
}

export interface ChangeFarmStatusPayload {
  farmId: string;
  newStatus: FarmStatus;
  reason: string;
}

export interface ExtendPlanPayload {
  farmId: string;
  daysToAdd: number;
  reason: string;
}
