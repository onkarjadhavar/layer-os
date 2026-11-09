'use client';

import React from 'react';
import { PlatformAdminUser } from '@/lib/admin/types';
import { PLATFORM_ADMINS } from '@/lib/admin/auth';
import {
  Users,
  Shield,
  ShieldCheck,
  Check,
  X,
  Lock,
} from 'lucide-react';

interface AdminOperatorsTabProps {
  currentAdmin: PlatformAdminUser;
}

export function AdminOperatorsTab({ currentAdmin }: AdminOperatorsTabProps) {
  const isSuperAdmin = currentAdmin.role === 'super_admin';

  const permissions = [
    { capability: 'View Farms & Dashboard KPIs', superAdmin: true, operator: true },
    { capability: 'Inspect 360° Farm Profile', superAdmin: true, operator: true },
    { capability: 'Suspend & Reactivate Farms', superAdmin: true, operator: true },
    { capability: 'Launch Read-only Support View', superAdmin: true, operator: true },
    { capability: 'View DPDP Audit Logs & Export CSV', superAdmin: true, operator: true },
    { capability: 'Approve Pending Farm Enrollments', superAdmin: true, operator: false },
    { capability: 'Reject Farm Enrollments', superAdmin: true, operator: false },
    { capability: 'Grant Subscription Extensions', superAdmin: true, operator: false },
    { capability: 'Modify Platform Settings', superAdmin: true, operator: false },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[var(--color-border)] dark:border-[#1A3024]">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white">
          Users, Operators & Role Permissions
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
          Role-Based Access Control (RBAC) governing LayerOS administrative authority.
        </p>
      </div>

      {/* Operators Directory Table */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
        <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
          <span>Registered Platform Operators</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] dark:border-[#1A3024] text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">
                <th className="py-2.5 px-3">Administrator</th>
                <th className="py-2.5 px-3">Role / हुद्दा</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">2FA Security</th>
                <th className="py-2.5 px-3">Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50 dark:divide-[#1A3024]/50 font-medium">
              {PLATFORM_ADMINS.map((admin) => {
                const isCurrent = admin.email === currentAdmin.email;
                return (
                  <tr key={admin.id} className="hover:bg-[var(--color-surface-subtle)] dark:hover:bg-[#0E1A13]">
                    <td className="py-3 px-3 font-bold text-[var(--color-text-main)] dark:text-white">
                      <span>{admin.email}</span>
                      {isCurrent && (
                        <span className="ml-2 px-1.5 py-0.2 rounded font-bold text-[10px] bg-[var(--color-forest)]/10 text-[var(--color-forest)] dark:text-[var(--color-sage)]">
                          चालू सत्र (You)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          admin.role === 'super_admin'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        <span>{admin.role.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--color-text-muted)]">
                      {admin.totpEnabled ? 'TOTP Enabled' : 'Password Only'}
                    </td>
                    <td className="py-3 px-3 text-[var(--color-text-muted)] text-[11px] tabular-nums">
                      {new Date().toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Matrix */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
        <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white mb-1 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
          <span>Role Capability Matrix (RBAC)</span>
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-3">
          Separation of duties between Super Administrator and Operations Staff.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] dark:border-[#1A3024] text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">
                <th className="py-2.5 px-3">Operational Capability</th>
                <th className="py-2.5 px-3 text-center">Super Admin</th>
                <th className="py-2.5 px-3 text-center">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50 dark:divide-[#1A3024]/50">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-[var(--color-surface-subtle)] dark:hover:bg-[#0E1A13]">
                  <td className="py-2.5 px-3 font-medium text-[var(--color-text-main)] dark:text-white">
                    {p.capability}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {p.operator ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-rose-500 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default AdminOperatorsTab;

