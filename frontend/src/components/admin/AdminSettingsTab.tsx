'use client';

import React, { useState, useEffect } from 'react';
import { PlatformSettings, PlatformAdminUser } from '@/lib/admin/types';
import { updatePlatformSettings } from '@/lib/admin/actions';
import { useI18n } from '@/lib/i18n/context';
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  Mail,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface AdminSettingsTabProps {
  settings: PlatformSettings | null;
  currentAdmin: PlatformAdminUser;
  onRefresh: () => void;
}

export function AdminSettingsTab({
  settings,
  currentAdmin,
  onRefresh,
}: AdminSettingsTabProps) {
  const { t } = useI18n();
  const isSuperAdmin = currentAdmin.role === 'super_admin';

  const [formData, setFormData] = useState<PlatformSettings>({
    id: 'default',
    enrollmentMode: 'auto_approve',
    defaultTrialDays: 30,
    supportPhone: '+91 76660 40924',
    supportWhatsapp: '+91 76660 40924',
    supportEmail: 'support@layeros.in',
    maintenanceBanner: '',
    isMaintenanceActive: false,
    updatedAt: new Date().toISOString(),
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      setSaveError('केवळ सुपर ॲडमिन प्लॅटफॉर्म सेटिंग्स बदलू शकतात.');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const res = await updatePlatformSettings(formData, currentAdmin);
    setIsSaving(false);

    if (res.success && res.settings) {
      setFormData(res.settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      onRefresh();
    } else {
      setSaveError(res.error || 'Failed to update settings');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-2 border-b border-[var(--color-border)] dark:border-[#1A3024]">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white">
          Platform Configuration
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
          Global registration gates, trial defaults, and customer helpline routing.
        </p>
      </div>

      {!isSuperAdmin && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
          <Shield className="w-4 h-4 shrink-0 text-amber-600" />
          <span>केवळ सुपर ॲडमिन (Super Admin) या सेटिंग्समध्ये बदल करू शकतात. ऑपरेटर केवळ पाहू शकतात.</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>प्लॅटफॉर्म सेटिंग्स यशस्वीरित्या अपडेट करण्यात आल्या आहेत.</span>
        </div>
      )}

      {saveError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Enrollment Gate */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white">
            नोंदणी मंजुरी मोड (Enrollment Approval Mode)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                formData.enrollmentMode === 'auto_approve'
                  ? 'bg-[var(--color-forest)]/10 border-[var(--color-forest)] text-[var(--color-text-main)] dark:text-white'
                  : 'bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] border-[var(--color-border)] dark:border-[#1A3024]'
              }`}
            >
              <input
                type="radio"
                name="enrollmentMode"
                value="auto_approve"
                checked={formData.enrollmentMode === 'auto_approve'}
                disabled={!isSuperAdmin}
                onChange={() => setFormData({ ...formData, enrollmentMode: 'auto_approve' })}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-xs block">स्वयंचलित मंजुरी (Auto-Approve)</span>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  नवीन पोल्ट्री फार्म नोंदणी होताच थेट सक्रिय होईल.
                </span>
              </div>
            </label>

            <label
              className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                formData.enrollmentMode === 'manual_approval'
                  ? 'bg-amber-500/10 border-amber-500 text-[var(--color-text-main)] dark:text-white'
                  : 'bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] border-[var(--color-border)] dark:border-[#1A3024]'
              }`}
            >
              <input
                type="radio"
                name="enrollmentMode"
                value="manual_approval"
                checked={formData.enrollmentMode === 'manual_approval'}
                disabled={!isSuperAdmin}
                onChange={() => setFormData({ ...formData, enrollmentMode: 'manual_approval' })}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-xs block">मॅन्युअल पडताळणी (Manual Review)</span>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  सुपर ॲडमिनने मंजुरी देईपर्यंत फार्म प्रलंबित (Pending) राहील.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Trial Days & Contacts */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white">
            चाचणी कालावधी व ग्राहक संपर्क (Trial & Helpline)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold block mb-1 text-[var(--color-text-main)] dark:text-white">
                डिफॉल्ट मोफत चाचणी दिवस (Trial Days)
              </label>
              <input
                type="number"
                min={7}
                max={90}
                value={formData.defaultTrialDays}
                disabled={!isSuperAdmin}
                onChange={(e) => setFormData({ ...formData, defaultTrialDays: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-bold tabular-nums"
              />
            </div>

            <div>
              <label className="font-bold block mb-1 text-[var(--color-text-main)] dark:text-white">
                हेल्पलाइन फोन (Support Phone)
              </label>
              <input
                type="text"
                value={formData.supportPhone}
                disabled={!isSuperAdmin}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-bold block mb-1 text-[var(--color-text-main)] dark:text-white">
                व्हॉट्सॲप नंबर (WhatsApp Support)
              </label>
              <input
                type="text"
                value={formData.supportWhatsapp}
                disabled={!isSuperAdmin}
                onChange={(e) => setFormData({ ...formData, supportWhatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-bold block mb-1 text-[var(--color-text-main)] dark:text-white">
                सपोर्ट ईमेल (Support Email)
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                disabled={!isSuperAdmin}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        {isSuperAdmin && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[var(--color-forest)] hover:bg-[#143F2F] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[var(--color-amber)]" />
              <span>{isSaving ? 'जतन होत आहे...' : 'सुरू करा व सेव्ह करा (Save Configuration)'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
export default AdminSettingsTab;
