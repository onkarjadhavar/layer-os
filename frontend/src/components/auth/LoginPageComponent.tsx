'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from '@/components/common/Link';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { signInWithEmail } from '@/lib/auth/actions';
import { authService } from '@/services/auth.service';
import { Phone, Mail, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LayerOSLogo } from '@/components/common/LayerOSLogo';

export function LoginPageComponent() {
  const navigate = useNavigate();
  const router = { push: (url: string) => navigate(url) };
  const { loginWithPhone, loginAsDemo, setActiveFarmData } = useLayerOS();
  const { t } = useI18n();

  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone');

  // Email form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      setError('कृपया १० अंकी वैध मोबाईल नंबर टाका');
      return;
    }
    setError('');
    setPhoneStep('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('कृपया ६ अंकी ओटीपी टाका (डेमो: 123456)');
      return;
    }
    setLoading(true);
    setError('');
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    try {
      const res = await authService.login({
        phone: cleanPhone,
        otp,
      });
      setLoading(false);
      if (res.user) {
        setActiveFarmData({
          farm: {
            id: res.user.farm_id || `farm-${res.user.id}`,
            name: res.user.full_name ? `${res.user.full_name} फार्म` : 'माझा पोल्ट्री फार्म',
            ownerName: res.user.full_name || 'मालक',
            phone: res.user.phone || cleanPhone,
            email: res.user.email || '',
            district: 'Maharashtra',
            state: 'Maharashtra',
            totalCapacity: 10000,
            status: 'active',
          },
          user: {
            id: res.user.id,
            name: `${res.user.full_name || 'मालक'} (मालक)`,
            phone: res.user.phone || cleanPhone,
            role: (res.user.role as any) || 'owner',
            farmId: res.user.farm_id || '',
          },
        });
      }
      if (res.user?.farm_id) {
        router.push(`/dashboard/farms/${res.user.farm_id}`);
      } else {
        router.push('/?live=true');
      }
    } catch {
      setLoading(false);
      const success = loginWithPhone(cleanPhone, otp);
      if (success) {
        router.push('/?live=true');
      } else {
        setError('या मोबाईल नंबरवर नोंदणीकृत पोल्ट्री फार्म सापडला नाही. कृपया आधी नोंदणी (Enroll) करा किंवा योग्य तपशील तपासा.');
      }
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('कृपया ईमेल व पासवर्ड दोन्ही प्रविष्ट करा');
      return;
    }

    setLoading(true);
    setError('');
    const res = await signInWithEmail(email, password);
    setLoading(false);

    if (res.success) {
      if (res.data?.user) {
        setActiveFarmData({
          farm: {
            id: res.data.farmId || `farm-${res.data.user.id}`,
            name: res.data.user.full_name ? `${res.data.user.full_name} फार्म` : 'माझा पोल्ट्री फार्म',
            ownerName: res.data.user.full_name || 'मालक',
            phone: res.data.user.phone || '',
            email: res.data.user.email || '',
            district: 'Maharashtra',
            state: 'Maharashtra',
            totalCapacity: 10000,
            status: 'active',
          },
          user: {
            id: res.data.user.id,
            name: `${res.data.user.full_name || 'मालक'} (मालक)`,
            phone: res.data.user.phone || '',
            role: (res.data.user.role as any) || 'owner',
            farmId: res.data.farmId || '',
          },
        });
      }
      if (res.data?.farmId) {
        router.push(`/dashboard/farms/${res.data.farmId}`);
      } else {
        router.push('/?live=true');
      }
    } else {
      setError(res.error || 'लॉगिन अयशस्वी. कृपया तपशील तपासा.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('कृपया आपला नोंदणीकृत ईमेल पत्ता टाका.');
      return;
    }
    setError('');
    setSuccessMsg('पासवर्ड रीसेट लिंक आपल्या ईमेलवर पाठवण्यात आली आहे. (Password reset email sent.)');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-[#103528]/30 text-[var(--color-text)] dark:text-[#E8EFE2] flex flex-col justify-between transition-colors">
      <header className="px-4 py-4 max-w-5xl mx-auto w-full flex items-center justify-between border-b border-[var(--color-border)] dark:border-[#263B30]/60">
        <Link href="/" className="flex items-center group">
          <LayerOSLogo size="md" showText />
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher variant="segment" />
          <Link
            href="/enroll"
            className="text-xs sm:text-sm font-bold text-[#194B38] dark:text-[#87A96B] hover:text-[#103528] dark:hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            {t.register || 'नवीन नोंदणी (Enroll)'}
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white dark:bg-[#103528]/50 rounded-3xl p-6 sm:p-8 shadow-xl border border-[var(--color-border)] dark:border-[#263B30]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#17251D] dark:text-white">
              {t.loginTitle}
            </h1>
            <p className="text-xs text-[var(--color-text-muted)] dark:text-[#E8EFE2]/75 mt-1 font-medium">
              {t.loginSubtitle}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Mode Switcher: Phone vs Email */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[var(--color-background)] dark:bg-[#103528]/40 rounded-2xl mb-6 border border-[var(--color-border)] dark:border-[#263B30]">
            <button
              id="login-tab-phone"
              type="button"
              onClick={() => {
                setAuthMode('phone');
                setError('');
                setShowForgotPassword(false);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 min-h-[40px] cursor-pointer ${
                authMode === 'phone'
                  ? 'bg-[#194B38] text-white shadow-sm'
                  : 'text-[var(--color-text-muted)] dark:text-[#E8EFE2]/70 hover:text-[#17251D] dark:hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>मोबाईल ओटीपी / Phone OTP</span>
            </button>
            <button
              id="login-tab-email"
              type="button"
              onClick={() => {
                setAuthMode('email');
                setError('');
                setShowForgotPassword(false);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 min-h-[40px] cursor-pointer ${
                authMode === 'email'
                  ? 'bg-[#194B38] text-white shadow-sm'
                  : 'text-[var(--color-text-muted)] dark:text-[#E8EFE2]/70 hover:text-[#17251D] dark:hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>ईमेल पासवर्ड / Email</span>
            </button>
          </div>

          {/* Forgot Password View */}
          {showForgotPassword ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17251D] dark:text-[#E8EFE2] mb-1.5">
                  नोंदणीकृत ईमेल पत्ता
                </label>
                <input
                  type="email"
                  placeholder="उदा. sachin@layerfarm.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] dark:border-[#263B30] bg-white dark:bg-[#103528]/40 text-[#17251D] dark:text-white font-medium text-sm focus:border-[#194B38] focus:ring-2 focus:ring-[#87A96B]/30 outline-none min-h-[48px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#194B38] text-white font-bold text-sm shadow hover:bg-[#103528] transition-all min-h-[48px] cursor-pointer"
              >
                पासवर्ड रीसेट लिंक पाठवा
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-xs font-bold text-[var(--color-text-muted)] hover:underline text-center block pt-2 cursor-pointer"
              >
                ← लॉगिनकडे परत जा
              </button>
            </form>
          ) : authMode === 'phone' ? (
            /* Phone OTP Form */
            <form onSubmit={phoneStep === 'phone' ? handleSendOtp : handleVerifyOtp} className="space-y-4">
              {phoneStep === 'phone' ? (
                <div>
                  <label className="block text-xs font-bold text-[#17251D] dark:text-[#E8EFE2] mb-1.5">
                    {t.phonePlaceholder}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-sm font-bold text-[var(--color-text-muted)]">
                      +91
                    </span>
                    <input
                      id="login-phone-input"
                      type="tel"
                      inputMode="numeric"
                      placeholder="98220 12345"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-border)] dark:border-[#263B30] bg-white dark:bg-[#103528]/40 text-[#17251D] dark:text-white font-medium text-sm focus:border-[#194B38] focus:ring-2 focus:ring-[#87A96B]/30 outline-none min-h-[48px] tabular-nums"
                    />
                  </div>
                  <button
                    id="login-send-otp-btn"
                    type="submit"
                    className="w-full mt-4 py-3.5 rounded-xl bg-[#194B38] text-white font-bold text-sm shadow hover:bg-[#103528] transition-all min-h-[48px] cursor-pointer"
                  >
                    {t.sendOtp}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#17251D] dark:text-[#E8EFE2]">
                      {t.enterOtp}
                    </label>
                    <button
                      type="button"
                      onClick={() => setPhoneStep('phone')}
                      className="text-xs text-[#194B38] dark:text-[#87A96B] font-bold underline cursor-pointer"
                    >
                      नंबर बदला
                    </button>
                  </div>
                  <input
                    id="login-otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] dark:border-[#263B30] bg-white dark:bg-[#103528]/40 text-[#17251D] dark:text-white font-bold text-center text-lg tracking-widest focus:border-[#194B38] focus:ring-2 focus:ring-[#87A96B]/30 outline-none min-h-[48px] tabular-nums"
                  />
                  <button
                    id="login-verify-otp-btn"
                    type="submit"
                    className="w-full mt-4 py-3.5 rounded-xl bg-[#194B38] text-white font-bold text-sm shadow hover:bg-[#103528] transition-all min-h-[48px] cursor-pointer"
                  >
                    {t.verifyOtp}
                  </button>
                </div>
              )}
            </form>
          ) : (
            /* Email & Password Form */
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17251D] dark:text-[#E8EFE2] mb-1.5">
                  ईमेल पत्ता / Email
                </label>
                <input
                  id="login-email-input"
                  type="email"
                  placeholder="उदा. sachin@layerfarm.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] dark:border-[#263B30] bg-white dark:bg-[#103528]/40 text-[#17251D] dark:text-white font-medium text-sm focus:border-[#194B38] focus:ring-2 focus:ring-[#87A96B]/30 outline-none min-h-[48px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#17251D] dark:text-[#E8EFE2]">
                    पासवर्ड / Password
                  </label>
                  <button
                    id="login-forgot-password-link"
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setError('');
                    }}
                    className="text-xs text-[#194B38] dark:text-[#87A96B] font-bold underline cursor-pointer"
                  >
                    पासवर्ड विसरलात?
                  </button>
                </div>
                <input
                  id="login-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] dark:border-[#263B30] bg-white dark:bg-[#103528]/40 text-[#17251D] dark:text-white font-medium text-sm focus:border-[#194B38] focus:ring-2 focus:ring-[#87A96B]/30 outline-none min-h-[48px]"
                />
              </div>

              <button
                id="login-email-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#194B38] text-white font-bold text-sm shadow hover:bg-[#103528] transition-all min-h-[48px] cursor-pointer"
              >
                {loading ? 'लॉगिन होत आहे...' : 'लॉगिन करा (Sign In)'}
              </button>
            </form>
          )}

          {/* Platform Admin Portal Link */}
          <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 dark:border-[#1E3027] text-center">
            <Link
              href="/admin/login"
              id="login-admin-portal-link"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[#194B38] dark:hover:text-[#87A96B] transition-colors py-1.5 px-3 rounded-xl hover:bg-[var(--color-background)] dark:hover:bg-[#103528]/40 min-h-[36px]"
              title="Platform Admin Sign In"
            >
              <ShieldCheck className="w-4 h-4 text-[#194B38] dark:text-[#87A96B]" />
              <span>Platform Admin Console</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
