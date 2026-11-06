'use client';

import React, { useState, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from '@/components/common/Link';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { Language, translations } from '@/lib/i18n/translations';
import { useI18n } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import {
  authenticateAdminCredentials,
  ADMIN_COOKIE_NAME,
  createAdminSessionPayload,
  getAdminSession,
} from '@/lib/admin/auth';

function AdminLoginContent() {
  const navigate = useNavigate();
  const router = { push: (url: string) => navigate(url) };
  const [searchParams] = useSearchParams();
  const urlError = searchParams.get('error');

  const { language: lang, setLanguage: setLang, t } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    urlError === 'access_denied'
      ? 'Access denied. You must be an active platform administrator.'
      : ''
  );

  React.useEffect(() => {
    const session = getAdminSession();
    if (session && session.admin) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, totp }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.detail || data.error || 'Invalid credentials');
      }

      if (data.admin) {
        const sessionPayload = encodeURIComponent(
          JSON.stringify({
            admin: {
              id: data.admin.id,
              email: data.admin.email,
              role: data.admin.role,
              isActive: data.admin.is_active ?? true,
              totpEnabled: false,
            },
            token: data.token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          })
        );
        document.cookie = `${ADMIN_COOKIE_NAME}=${sessionPayload}; path=/; max-age=86400; SameSite=Lax`;
        if (typeof localStorage !== 'undefined' && data.token) {
          localStorage.setItem('layeros_admin_token', data.token);
        }
      }

      router.push('/admin');
    } catch (err: any) {
      // Offline / client fallback
      const localAdmin = authenticateAdminCredentials(email, password, totp);
      if (localAdmin) {
        const payload = createAdminSessionPayload(localAdmin);
        document.cookie = `${ADMIN_COOKIE_NAME}=${payload}; path=/; max-age=86400; SameSite=Lax`;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('layeros_admin_token', `layeros_adm_${localAdmin.role}_${Date.now()}`);
        }
        router.push('/admin');
        return;
      }
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#07130E] text-[#0B1E15] dark:text-[#E8F5EE] flex flex-col justify-between p-4 sm:p-6 transition-colors font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full pt-2">
        <Link
          href="/?landing=true"
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-white/70 dark:bg-[#0F241A]/70 border border-[#DCD3C3] dark:border-[#1F3D2F] hover:border-[#1F4D3A] transition-all min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-[#1F4D3A] dark:text-[#42BF87]" />
          <span>{t.backToHome}</span>
        </Link>

        {/* Trilingual Language Selector */}
        <LanguageSwitcher variant="segment" />
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md bg-white dark:bg-[#0E2018] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#DCD3C3] dark:border-[#1F3D2F] space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1F4D3A]/10 dark:bg-[#42BF87]/15 flex items-center justify-center text-[#1F4D3A] dark:text-[#42BF87]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{t.adminLoginTitle}</h1>
            <p className="text-xs text-[#52685D] dark:text-[#8AA89B]">{t.adminLoginSubtitle}</p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#35483F] dark:text-[#A1C1B1] mb-1.5">
                {t.adminEmailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7A9386] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="admin-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@layeros.internal"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] border border-[#DCD3C3] dark:border-[#223E30] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3A] dark:focus:ring-[#42BF87] min-h-[48px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#35483F] dark:text-[#A1C1B1] mb-1.5">
                {t.adminPasswordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A9386] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="admin-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] border border-[#DCD3C3] dark:border-[#223E30] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3A] dark:focus:ring-[#42BF87] min-h-[48px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#35483F] dark:text-[#A1C1B1] mb-1.5 flex items-center justify-between">
                <span>{t.adminTotpLabel}</span>
                <span className="text-[10px] text-[#7A9386] font-normal">Optional</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#7A9386] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  value={totp}
                  onChange={(e) => setTotp(e.target.value)}
                  placeholder="6-digit TOTP code"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] border border-[#DCD3C3] dark:border-[#223E30] text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-[#1F4D3A] dark:focus:ring-[#42BF87] min-h-[48px]"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-admin-login"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#1F4D3A] dark:bg-[#42BF87] hover:bg-[#16382A] dark:hover:bg-[#349B6C] text-white dark:text-[#0B1E15] font-black text-sm tracking-wide shadow-lg shadow-[#1F4D3A]/20 transition-all flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-50"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.adminLoginBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer info */}
      <footer className="text-center text-[11px] text-[#7A9386] pb-2">
        LayerOS Multi-Farm Central Supervision • DPDP Act Compliant Audit Logging
      </footer>
    </div>
  );
}

export function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#07130E] flex items-center justify-center">
          <div className="text-xs font-bold text-[#7A9386]">Loading Admin Console...</div>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}

