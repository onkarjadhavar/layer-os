'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { Sparkles, Phone, Mail, Lock, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { signInWithEmail } from '@/lib/auth/actions';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOnboarding: () => void;
}

export function AuthModal({ isOpen, onClose, onOpenOnboarding }: AuthModalProps) {
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
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      setError('कृपया १० अंकी वैध मोबाईल नंबर टाका');
      return;
    }
    setError('');
    setPhoneStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('कृपया ६ अंकी ओटीपी टाका (डेमो: 123456)');
      return;
    }
    const success = loginWithPhone(phoneNumber, otp);
    if (success) {
      onClose();
    } else {
      setError('अवैध ओटीपी. कृपया 123456 टाका');
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
      onClose();
    } else {
      setError(res.error || 'लॉगिन अयशस्वी. कृपया तपशील तपासा.');
    }
  };

  const handleDemoLaunch = () => {
    loginAsDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#16241D] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E7E2D6] dark:border-[#263B30] relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1F4D3A] text-white flex items-center justify-center font-black text-2xl shadow-md mb-3 border-2 border-[#D9A441]">
            🥚
          </div>
          <h2 className="text-2xl font-black text-[#0B1E15] dark:text-white tracking-tight">
            Layer<span className="text-[#D9A441]">OS</span>
          </h2>
          <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] mt-1 font-semibold">
            {t.loginSubtitle}
          </p>
        </div>

        {/* Quick Demo Access Button */}
        <div className="mb-5 p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#D9A441]/40 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#D9A441] mb-1">
            <Sparkles className="w-4 h-4" />
            त्वरित अनुभव (Instant Access)
          </div>
          <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium mb-3">
            सह्याद्री लेयर फार्मचा ९० दिवसांचा प्रत्यक्ष डेटा आणि AI सल्लागार लगेच पहा.
          </p>
          <button
            onClick={handleDemoLaunch}
            className="w-full py-2.5 px-4 rounded-xl bg-[#D9A441] hover:bg-[#C69234] text-[#0B1E15] font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <span>{t.tryDemo}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-xl bg-[#F8F6F0] dark:bg-[#1B2D24] border border-[#DCD3C3] dark:border-[#263B30]">
          <button
            onClick={() => {
              setAuthMode('phone');
              setError('');
            }}
            className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'phone'
                ? 'bg-[#1F4D3A] text-white shadow-xs'
                : 'text-[#2D4538] dark:text-[#CBDCD4]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>मोबाईल ओटीपी</span>
          </button>
          <button
            onClick={() => {
              setAuthMode('email');
              setError('');
            }}
            className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'email'
                ? 'bg-[#1F4D3A] text-white shadow-xs'
                : 'text-[#2D4538] dark:text-[#CBDCD4]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>ईमेल / पासवर्ड</span>
          </button>
        </div>

        {/* Error notice */}
        {error && <p className="text-xs font-black text-red-500 mb-3 text-center">{error}</p>}

        {/* 1. Phone OTP Mode */}
        {authMode === 'phone' && (
          phoneStep === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1.5">
                  मोबाईल नंबर (Mobile Number)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#2D4538] dark:text-[#CBDCD4] font-bold text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98220 12345"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-base font-bold text-[#0B1E15] dark:text-white focus:outline-none focus:border-[#1F4D3A]"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>{t.sendOtp}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-[#0B1E15] dark:text-white">
                    ओटीपी प्रविष्ट करा (OTP)
                  </label>
                  <button
                    type="button"
                    onClick={() => setPhoneStep('phone')}
                    className="text-xs text-[#D9A441] font-bold hover:underline"
                  >
                    नंबर बदला
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-center text-xl tracking-widest font-black text-[#0B1E15] dark:text-white focus:outline-none focus:border-[#1F4D3A]"
                  autoFocus
                />
                <p className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] mt-1 text-center font-medium">
                  डेमो पडताळणीसाठी <span className="font-black text-[#1F4D3A] dark:text-[#3BA378]">123456</span> वापरा
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.verifyOtp}</span>
              </button>
            </form>
          )
        )}

        {/* 2. Email & Password Mode */}
        {authMode === 'email' && (
          <form onSubmit={handleEmailSignIn} className="space-y-3.5">
            <div>
              <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                ईमेल आयडी (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="farmer@sahyadrilayer.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-sm font-bold text-[#0B1E15] dark:text-white"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-sm font-bold text-[#0B1E15] dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              <span>{loading ? 'पडताळत आहे...' : 'साइन इन करा'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Onboarding trigger */}
        <div className="mt-5 text-center pt-3 border-t border-[#E7E2D6] dark:border-[#263B30]">
          <button
            onClick={() => {
              onClose();
              onOpenOnboarding();
            }}
            className="text-xs font-bold text-[#1F4D3A] dark:text-[#3BA378] hover:underline"
          >
            नवीन आहात? ४-स्टेप फार्म सेटअप सुरू करा →
          </button>
        </div>
      </div>
    </div>
  );
}
