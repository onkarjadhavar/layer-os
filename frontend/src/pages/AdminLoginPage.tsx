'use client';

import React, { useState, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from '@/components/common/Link';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { Language, translations } from '@/lib/i18n/translations';

function AdminLoginContent() {
  const navigate = useNavigate();
  const router = { push: (url: string) => navigate(url) };
  const [searchParams] = useSearchParams();
  const urlError = searchParams.get('error');

  const [lang, setLang] = useState<Language>('mr');
  const t = translations[lang];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    urlError === 'access_denied'
      ? 'Access denied. You must be an active platform administrator.'
      : ''
  );

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
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role: 'super_admin' | 'operator') => {
    if (role === 'super_admin') {
      setEmail('admin@layeros.internal');
      setPassword('SuperAdmin@2026');
    } else {
      setEmail('operator@layeros.internal');
      setPassword('Operator@2026');
    }
    setErrorMsg('');
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
        <div className="inline-flex rounded-xl p-1 bg-white/80 dark:bg-[#0F241A] border border-[#DCD3C3] dark:border-[#1F3D2F]">
          {(['mr', 'hi', 'en'] as Language[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all min-h-[36px] ${
                lang === l
                  ? 'bg-[#1F4D3A] text-white shadow-sm'
                  : 'text-[#4A5D53] dark:text-[#8AA89B] hover:text-[#0B1E15] dark:hover:text-white'
              }`}
            >
              {l === 'mr' ? 'मराठी' : l === 'hi' ? 'हिंदी' : 'EN'}
            </button>
          ))}
        </div>
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
                <span className="text-[10px] text-[#7A9386] font-normal">Optional in demo</span>
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

          {/* Quick-fill helper for Sandbox Evaluation */}
          <div className="pt-4 border-t border-[#EAE3D5] dark:border-[#1A3326] space-y-2">
            <p className="text-[11px] font-semibold text-[#52685D] dark:text-[#8AA89B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E0A838]" />
              <span>Instant Sandbox Demo Access:</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('super_admin')}
                className="py-2.5 px-3 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] hover:bg-[#EDE8DC] dark:hover:bg-[#1C3A2B] border border-[#DCD3C3] dark:border-[#223E30] text-[11px] font-bold text-left transition-all min-h-[44px]"
              >
                <div className="text-[#1F4D3A] dark:text-[#42BF87]">Super Admin</div>
                <div className="text-[10px] text-[#7A9386]">Full Privileges</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('operator')}
                className="py-2.5 px-3 rounded-xl bg-[#F8F6F0] dark:bg-[#152B20] hover:bg-[#EDE8DC] dark:hover:bg-[#1C3A2B] border border-[#DCD3C3] dark:border-[#223E30] text-[11px] font-bold text-left transition-all min-h-[44px]"
              >
                <div className="text-[#0B1E15] dark:text-[#E8F5EE]">Operator</div>
                <div className="text-[10px] text-[#7A9386]">Support Only</div>
              </button>
            </div>
          </div>
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

