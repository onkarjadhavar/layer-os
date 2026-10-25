'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from '@/components/common/Link';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { signInWithEmail } from '@/lib/auth/actions';
import { authService } from '@/services/auth.service';
import { Phone, Mail, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export function LoginPageComponent() {
  const navigate = useNavigate();
  const router = { push: (url: string) => navigate(url) };
  const { loginWithPhone, loginAsDemo } = useLayerOS();
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
    try {
      const res = await authService.login({
        phone: phoneNumber.replace(/\D/g, ''),
        otp,
      });
      setLoading(false);
      if (res.user?.farm_id) {
        router.push(`/dashboard/farms/${res.user.farm_id}`);
      } else {
        router.push('/?live=true');
      }
    } catch {
      setLoading(false);
      const success = loginWithPhone(phoneNumber, otp);
      if (success) {
        router.push('/?live=true');
      } else {
        setError('अवैध ओटीपी. कृपया 123456 टाका');
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

  const handleDemoLaunch = () => {
    loginAsDemo();
    router.push('/?demo=true');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#0F1A15] text-[#1B2A24] dark:text-white flex flex-col justify-between transition-colors">
      <header className="px-4 py-4 max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-[#1F4D3A] text-white flex items-center justify-center font-black text-xl border-2 border-[#D9A441]">
            🥚
          </div>
          <span className="text-2xl font-black tracking-tight">
            Layer<span className="text-[#D9A441]">OS</span>
          </span>
        </Link>

        <Link
          href="/enroll"
          className="text-xs sm:text-sm font-bold text-[#1F4D3A] dark:text-[#D9A441] hover:underline"
        >
          नवीन खाते? नोंदणी करा
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white dark:bg-[#16241D] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E7E2D6] dark:border-[#263B30]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-[#0B1E15] dark:text-white">
              {t.loginTitle}
            </h1>
            <p className="text-xs text-[#5A6E64] dark:text-[#A3B899] mt-1 font-semibold">
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
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF8F3] dark:bg-[#0F1A15] rounded-2xl mb-6 border border-[#E7E2D6] dark:border-[#263B30]">
            <button
              id="login-tab-phone"
              type="button"
              onClick={() => {
                setAuthMode('phone');
                setError('');
                setShowForgotPassword(false);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 min-h-[40px] ${
                authMode === 'phone'
                  ? 'bg-[#1F4D3A] text-white shadow-sm'
                  : 'text-[#5A6E64] dark:text-[#CBDCD4]'
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
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 min-h-[40px] ${
                authMode === 'email'
                  ? 'bg-[#1F4D3A] text-white shadow-sm'
                  : 'text-[#5A6E64] dark:text-[#CBDCD4]'
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
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                  नोंदणीकृत ईमेल पत्ता
                </label>
                <input
                  type="email"
                  placeholder="उदा. sachin@layerfarm.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#1F4D3A] text-white font-black text-sm shadow hover:bg-[#173A2C] transition-all min-h-[48px]"
              >
                पासवर्ड रीसेट लिंक पाठवा
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-xs font-bold text-[#5A6E64] hover:underline text-center block pt-2"
              >
                ← लॉगिनकडे परत जा
              </button>
            </form>
          ) : authMode === 'phone' ? (
            /* Phone OTP Form */
            <form onSubmit={phoneStep === 'phone' ? handleSendOtp : handleVerifyOtp} className="space-y-4">
              {phoneStep === 'phone' ? (
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                    {t.phonePlaceholder}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-sm font-bold text-[#5A6E64]">
                      +91
                    </span>
                    <input
                      id="login-phone-input"
                      type="tel"
                      inputMode="numeric"
                      placeholder="98220 12345"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                    />
                  </div>
                  <button
                    id="login-send-otp-btn"
                    type="submit"
                    className="w-full mt-4 py-3.5 rounded-xl bg-[#1F4D3A] text-white font-black text-sm shadow hover:bg-[#173A2C] transition-all min-h-[48px]"
                  >
                    {t.sendOtp}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4]">
                      {t.enterOtp}
                    </label>
                    <button
                      type="button"
                      onClick={() => setPhoneStep('phone')}
                      className="text-xs text-[#1F4D3A] dark:text-[#42BF87] underline"
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
                    className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-center text-lg tracking-widest focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                  />
                  <button
                    id="login-verify-otp-btn"
                    type="submit"
                    className="w-full mt-4 py-3.5 rounded-xl bg-[#1F4D3A] text-white font-black text-sm shadow hover:bg-[#173A2C] transition-all min-h-[48px]"
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
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1.5">
                  ईमेल पत्ता / Email
                </label>
                <input
                  id="login-email-input"
                  type="email"
                  placeholder="उदा. sachin@layerfarm.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4]">
                    पासवर्ड / Password
                  </label>
                  <button
                    id="login-forgot-password-link"
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setError('');
                    }}
                    className="text-xs text-[#1F4D3A] dark:text-[#42BF87] underline"
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
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white font-medium text-sm focus:ring-2 focus:ring-[#1F4D3A] outline-none min-h-[48px]"
                />
              </div>

              <button
                id="login-email-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#1F4D3A] text-white font-black text-sm shadow hover:bg-[#173A2C] transition-all min-h-[48px]"
              >
                {loading ? 'लॉगिन होत आहे...' : 'लॉगिन करा (Sign In)'}
              </button>
            </form>
          )}

          {/* Sandbox Demo Button */}
          <div className="mt-6 pt-6 border-t border-[#E7E2D6] dark:border-[#263B30] text-center">
            <button
              id="login-demo-btn"
              type="button"
              onClick={handleDemoLaunch}
              className="w-full py-3 rounded-xl bg-[#FCF6E9] dark:bg-[#2A2315] border border-[#D9A441]/40 text-[#B07B18] dark:text-[#E5B252] text-xs font-black flex items-center justify-center gap-1.5 hover:bg-[#F7EDD6] transition-colors min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-[#D9A441]" />
              <span>{t.heroTryDemo}</span>
            </button>
          </div>

          {/* Platform Admin Portal Link */}
          <div className="mt-4 pt-3 border-t border-[#F0EBE0] dark:border-[#1E3027] text-center">
            <Link
              href="/admin/login"
              id="login-admin-portal-link"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#52685D] dark:text-[#8AA89B] hover:text-[#1F4D3A] dark:hover:text-[#42BF87] transition-colors py-1.5 px-3 rounded-xl hover:bg-[#F8F6F0] dark:hover:bg-[#152B20] min-h-[36px]"
              title="Platform Admin Sign In"
            >
              <ShieldCheck className="w-4 h-4 text-[#1F4D3A] dark:text-[#42BF87]" />
              <span>Platform Admin Console</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
