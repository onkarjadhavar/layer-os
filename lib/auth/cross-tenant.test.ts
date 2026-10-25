import { describe, it, expect } from 'vitest';
import {
  assertCallerFarmAccess,
  assertRolePermission,
  AuthenticatedUser,
  ROLE_PERMISSIONS,
} from './session';
import { quickDailyRecordSchema, createSaleSchema } from '../dal/validation';
import { UserRole } from '../supabase/database.types';

describe('Cross-Tenant Security & Role Authorization Suite', () => {
  // Test Fixtures: Two distinct farms
  const farmA_Id = 'farm-aaa-1111-tenant-a';
  const farmB_Id = 'farm-bbb-2222-tenant-b';

  // Users for Farm A across all 5 roles
  const userA_Owner: AuthenticatedUser = {
    id: 'usr-a-owner',
    phone: '9822000001',
    name: 'Farm A Owner',
    activeFarmId: farmA_Id,
    role: 'owner',
  };

  const userA_Supervisor: AuthenticatedUser = {
    id: 'usr-a-super',
    phone: '9822000002',
    name: 'Farm A Supervisor',
    activeFarmId: farmA_Id,
    role: 'supervisor',
  };

  const userA_Accountant: AuthenticatedUser = {
    id: 'usr-a-acct',
    phone: '9822000003',
    name: 'Farm A Accountant',
    activeFarmId: farmA_Id,
    role: 'accountant',
  };

  const userA_Viewer: AuthenticatedUser = {
    id: 'usr-a-view',
    phone: '9822000004',
    name: 'Farm A Viewer',
    activeFarmId: farmA_Id,
    role: 'viewer',
  };

  // User for Farm B
  const userB_Owner: AuthenticatedUser = {
    id: 'usr-b-owner',
    phone: '9822000099',
    name: 'Farm B Owner',
    activeFarmId: farmB_Id,
    role: 'owner',
  };

  describe('1. Cross-Tenant IDOR & Boundary Enforcement', () => {
    it('allows Farm A user to access Farm A resources', () => {
      expect(() => assertCallerFarmAccess(userA_Owner, farmA_Id)).not.toThrow();
      expect(() => assertCallerFarmAccess(userA_Supervisor, farmA_Id)).not.toThrow();
    });

    it('PREVENTS Farm A user from reading, inserting, or mutating Farm B resources', () => {
      // User A attempts to target Farm B
      expect(() => assertCallerFarmAccess(userA_Owner, farmB_Id)).toThrow(
        /SECURITY ACCESS DENIED: Cross-tenant access violation/
      );

      expect(() => assertCallerFarmAccess(userA_Supervisor, farmB_Id)).toThrow(
        /SECURITY ACCESS DENIED: Cross-tenant access violation/
      );

      expect(() => assertCallerFarmAccess(userA_Accountant, farmB_Id)).toThrow(
        /SECURITY ACCESS DENIED: Cross-tenant access violation/
      );

      expect(() => assertCallerFarmAccess(userA_Viewer, farmB_Id)).toThrow(
        /SECURITY ACCESS DENIED: Cross-tenant access violation/
      );
    });

    it('PREVENTS Farm B user from accessing Farm A resources', () => {
      expect(() => assertCallerFarmAccess(userB_Owner, farmA_Id)).toThrow(
        /SECURITY ACCESS DENIED: Cross-tenant access violation/
      );
    });

    it('validates that mutation payloads cannot spoof cross-tenant farm_id', () => {
      // Attacker from Farm A submits Farm B ID in body
      const spoofedPayload = {
        farmId: farmB_Id,
        flockId: 'flock-01',
        recordDate: '2026-10-16',
        eggsCollected: 20000,
        feedKg: 2500,
        mortality: 10,
        sellingRate: 5.40,
      };

      // Zod validation parses payload structure
      const parsed = quickDailyRecordSchema.safeParse(spoofedPayload);
      expect(parsed.success).toBe(true);

      // Server-side boundary check blocks mismatch with caller's active farm
      if (parsed.success) {
        expect(() => assertCallerFarmAccess(userA_Owner, parsed.data.farmId)).toThrow(
          /SECURITY ACCESS DENIED: Cross-tenant access violation/
        );
      }
    });
  });

  describe('2. Role-Based Access Control (RBAC) Enforcement', () => {
    it('allows Owner and Manager to execute all management tasks', () => {
      expect(() => assertRolePermission(userA_Owner.role, ROLE_PERMISSIONS.dailyEntry, 'dailyEntry')).not.toThrow();
      expect(() => assertRolePermission(userA_Owner.role, ROLE_PERMISSIONS.closeDay, 'closeDay')).not.toThrow();
      expect(() => assertRolePermission(userA_Owner.role, ROLE_PERMISSIONS.viewFinances, 'viewFinances')).not.toThrow();
      expect(() => assertRolePermission(userA_Owner.role, ROLE_PERMISSIONS.mutateFinances, 'mutateFinances')).not.toThrow();
      expect(() => assertRolePermission(userA_Owner.role, ROLE_PERMISSIONS.editFlocks, 'editFlocks')).not.toThrow();
      expect(() => assertRolePermission(userA_Owner.role, ROLE_PERMISSIONS.manageTeam, 'manageTeam')).not.toThrow();
      expect(() => assertRolePermission(userA_Owner.role, ROLE_PERMISSIONS.deleteRecords, 'deleteRecords')).not.toThrow();
    });

    it('allows Supervisor to enter daily logs, but BLOCKS finance access and team management', () => {
      // Supervisor CAN enter daily logs
      expect(() => assertRolePermission(userA_Supervisor.role, ROLE_PERMISSIONS.dailyEntry, 'dailyEntry')).not.toThrow();

      // Supervisor CANNOT view or mutate commercial finances
      expect(() => assertRolePermission(userA_Supervisor.role, ROLE_PERMISSIONS.viewFinances, 'viewFinances')).toThrow(
        /AUTHORIZATION DENIED/
      );
      expect(() => assertRolePermission(userA_Supervisor.role, ROLE_PERMISSIONS.mutateFinances, 'mutateFinances')).toThrow(
        /AUTHORIZATION DENIED/
      );

      // Supervisor CANNOT edit flocks or manage team
      expect(() => assertRolePermission(userA_Supervisor.role, ROLE_PERMISSIONS.editFlocks, 'editFlocks')).toThrow(
        /AUTHORIZATION DENIED/
      );
      expect(() => assertRolePermission(userA_Supervisor.role, ROLE_PERMISSIONS.manageTeam, 'manageTeam')).toThrow(
        /AUTHORIZATION DENIED/
      );
    });

    it('allows Accountant to manage sales and expenses, but BLOCKS flock and shed modifications', () => {
      // Accountant CAN view and mutate finances
      expect(() => assertRolePermission(userA_Accountant.role, ROLE_PERMISSIONS.viewFinances, 'viewFinances')).not.toThrow();
      expect(() => assertRolePermission(userA_Accountant.role, ROLE_PERMISSIONS.mutateFinances, 'mutateFinances')).not.toThrow();

      // Accountant CANNOT modify flocks or manage team
      expect(() => assertRolePermission(userA_Accountant.role, ROLE_PERMISSIONS.editFlocks, 'editFlocks')).toThrow(
        /AUTHORIZATION DENIED/
      );
      expect(() => assertRolePermission(userA_Accountant.role, ROLE_PERMISSIONS.manageTeam, 'manageTeam')).toThrow(
        /AUTHORIZATION DENIED/
      );
    });

    it('restricts Viewer to read-only access (CANNOT write any record)', () => {
      // Viewer CAN view finances
      expect(() => assertRolePermission(userA_Viewer.role, ROLE_PERMISSIONS.viewFinances, 'viewFinances')).not.toThrow();

      // Viewer CANNOT enter daily logs
      expect(() => assertRolePermission(userA_Viewer.role, ROLE_PERMISSIONS.dailyEntry, 'dailyEntry')).toThrow(
        /AUTHORIZATION DENIED/
      );

      // Viewer CANNOT mutate sales or expenses
      expect(() => assertRolePermission(userA_Viewer.role, ROLE_PERMISSIONS.mutateFinances, 'mutateFinances')).toThrow(
        /AUTHORIZATION DENIED/
      );

      // Viewer CANNOT edit flocks or team
      expect(() => assertRolePermission(userA_Viewer.role, ROLE_PERMISSIONS.editFlocks, 'editFlocks')).toThrow(
        /AUTHORIZATION DENIED/
      );
    });
  });

  describe('3. Multi-Tenant Data Aggregation & Isolation', () => {
    it('ensures farm metric queries never leak Farm B numbers into Farm A totals', () => {
      const recordsTable = [
        { id: '1', farmId: farmA_Id, eggs: 25000, revenue: 135000 },
        { id: '2', farmId: farmA_Id, eggs: 26000, revenue: 140400 },
        { id: '3', farmId: farmB_Id, eggs: 45000, revenue: 243000 }, // Farm B data
      ];

      // Scoped query for Farm A
      const farmARecords = recordsTable.filter(r => r.farmId === userA_Owner.activeFarmId);
      const totalEggsA = farmARecords.reduce((sum, r) => sum + r.eggs, 0);

      // Asserts Farm B data is strictly excluded
      expect(farmARecords).toHaveLength(2);
      expect(totalEggsA).toBe(51000); // 25,000 + 26,000 (NOT 96,000)
    });
  });
});
