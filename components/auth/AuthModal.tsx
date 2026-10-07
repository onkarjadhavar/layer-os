'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { Sparkles, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOnboarding: () => void;
}

export function AuthModal({ isOpen, onClose, onOpenOnboarding }: AuthModalProps) {
  const { loginWithPhone, loginAsDemo } = useLayerOS();
  const { t } = useI18n();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      setError('कृपया १० अंकी वैध मोबाईल नंबर टाका');
      return;
    }
    setError('');
    setStep('otp');
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

  const handleDemoLaunch = () => {
    loginAsDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#16241D] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E7E2D6] dark:border-[#263B30] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9A441]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1F4D3A]/10 rounded-full blur-2xl pointer-events-none" />

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

        {/* Quick Demo Access Button (High Priority) */}
        <div className="mb-6 p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#D9A441]/40 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#D9A441] mb-1">
            <Sparkles className="w-4 h-4" />
            त्वरित अनुभव (Instant Access)
          </div>
          <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium mb-3">
            सह्याद्री लेयर फार्मचा ९० दिवसांचा प्रत्यक्ष डेटा आणि AI सल्लागार लगेच पहा.
          </p>
          <button
            onClick={handleDemoLaunch}
            className="w-full py-3 px-4 rounded-xl bg-[#D9A441] hover:bg-[#C69234] text-[#0B1E15] font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>{t.tryDemo}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#E7E2D6] dark:border-[#263B30]" />
          <span className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4]">{t.orContinueWith}</span>
          <div className="flex-1 h-px bg-[#E7E2D6] dark:border-[#263B30]" />
        </div>

        {/* Phone OTP Form */}
        {step === 'phone' ? (
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

            {error && <p className="text-xs font-black text-red-500">{error}</p>}

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
                  onClick={() => setStep('phone')}
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

            {error && <p className="text-xs font-black text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.verifyOtp}</span>
            </button>
          </form>
        )}

        {/* Onboarding trigger */}
        <div className="mt-5 text-center">
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
