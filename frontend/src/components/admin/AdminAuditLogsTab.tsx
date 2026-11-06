'use client';

import React, { useState, useMemo } from 'react';
import { AdminAuditEntry } from '@/lib/admin/types';
import { useI18n } from '@/lib/i18n/context';
import {
  ShieldCheck,
  Search,
  Download,
  Calendar,
  User,
  Building2,
  Clock,
  Filter,
} from 'lucide-react';

interface AdminAuditLogsTabProps {
  auditLogs: AdminAuditEntry[];
  onExportCsv: () => void;
}

export function AdminAuditLogsTab({ auditLogs, onExportCsv }: AdminAuditLogsTabProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        log.adminEmail.toLowerCase().includes(q) ||
        (log.farmName && log.farmName.toLowerCase().includes(q)) ||
        log.action.toLowerCase().includes(q) ||
        log.reason.toLowerCase().includes(q);

      const matchAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter);
      return matchSearch && matchAction;
    });
  }, [auditLogs, searchQuery, actionFilter]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--color-border)] dark:border-[#1A3024]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white">
              Platform Audit Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--color-forest)]/10 text-[var(--color-forest)] dark:text-[var(--color-sage)] tabular-nums">
              {filteredLogs.length} Records
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
            Immutable DPDP 2023 compliant audit trail capturing all administrative mutations and session events.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--color-text-main)] dark:text-white bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] hover:bg-[var(--color-surface-subtle)] transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[var(--color-amber)]" />
          <span>Export Logs (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search action, admin email, farm name, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-[var(--color-border)] dark:border-[#1A3024] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-medium text-[var(--color-text-main)] dark:text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-forest)]"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[var(--color-border)] dark:border-[#1A3024] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-semibold text-[var(--color-text-main)] dark:text-white focus:outline-none cursor-pointer w-full sm:w-auto"
        >
          <option value="all">सर्व कृती (All Actions)</option>
          <option value="status">Status Changes</option>
          <option value="plan">Plan Extensions</option>
          <option value="support">Support Views</option>
          <option value="settings">Settings Updates</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-[var(--color-text-muted)]">
            <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-30 text-[var(--color-forest)]" />
            <p className="text-sm font-bold text-[var(--color-text-main)] dark:text-white">
              कोणताही ऑडिट लॉग सापडला नाही (No audit entries found)
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-subtle)]/70 dark:bg-[#0E1A13]/70 border-b border-[var(--color-border)] dark:border-[#1A3024] text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">
                  <th className="py-3 px-4">Timestamp / वेळ</th>
                  <th className="py-3 px-3">Actor / ॲडमिन</th>
                  <th className="py-3 px-3">Action / कृती</th>
                  <th className="py-3 px-3">Target Farm</th>
                  <th className="py-3 px-4">Reason / कारण</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/50 dark:divide-[#1A3024]/50 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--color-surface-subtle)] dark:hover:bg-[#0E1A13] transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[var(--color-text-muted)] whitespace-nowrap tabular-nums">
                      {new Date(log.createdAt).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-[var(--color-text-main)] dark:text-white">{log.adminEmail}</p>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-[var(--color-surface-subtle)] dark:bg-[#1A3024] text-[var(--color-forest)] dark:text-[var(--color-sage)]">
                        {log.adminRole}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)]">
                        {log.action}
                      </span>
                      {log.previousStatus && log.newStatus && (
                        <span className="block text-[10px] text-[var(--color-text-muted)]">
                          {log.previousStatus} → {log.newStatus}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[var(--color-text-main)] dark:text-white">
                      {log.farmName || 'Platform'}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-muted)]">
                      {log.reason || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminAuditLogsTab;

