'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';
import { ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export function LandingFooter() {
  const { language, setLanguage, t } = useI18n();

  return (
    <footer className="bg-[#0B1E15] text-white pt-12 sm:pt-16 pb-12 px-4 transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Final Big CTA Block */}
        <div className="bg-gradient-to-r from-[#1F4D3A] to-[#163628] rounded-3xl p-8 sm:p-12 text-center mb-16 border border-[#2E6B52] shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-3xl mb-3 block">🥚</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              आजच आपल्या फार्मचा कारभार आधुनिक करा
            </h2>
            <p className="text-sm sm:text-base text-[#CBDCD4] mb-8 font-medium">
              नोंदणी पूर्ण करा आणि ३० दिवसांची मोफत चाचणी लगेच सुरू करा. कोणत्याही क्रेडिट कार्डची गरज नाही.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <Link
                href="/enroll"
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-2xl text-base font-black text-[#0B1E15] bg-[#D9A441] hover:bg-[#C69234] shadow-lg transition-all border-b-4 border-[#9E7321] min-h-[52px]"
              >
                <span>{t.heroEnrollCta}</span>
                <ArrowRight className="w-5 h-5 text-[#0B1E15]" />
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/20 min-h-[52px] flex items-center justify-center"
              >
                <span>{t.landingLoginBtn}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Navigation & Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#1F4D3A] text-white flex items-center justify-center font-black text-lg border border-[#D9A441]">
                🥚
              </div>
              <span className="text-2xl font-black tracking-tight">
                Layer<span className="text-[#D9A441]">OS</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A3B899] max-w-sm leading-relaxed mb-4">
              {t.tagline}. व्यावसायिक लेयर पोल्ट्री फार्म्ससाठी आधुनिक, मराठी-प्रथम डिजिटल ऑपरेटिंग प्रणाली.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#CBDCD4]">
              <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
              <span>डिजिटल वैयक्तिक डेटा संरक्षण (DPDP) सुसंगत</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#D9A441] mb-3">
              महत्त्वाचे दुवे
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#CBDCD4]">
              <li>
                <Link href="/enroll" className="hover:text-white transition-colors">
                  {t.landingEnrollBtn}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  {t.landingLoginBtn}
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1.5 text-[#D9A441]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>प्लॅटफॉर्म ॲडमिन (Platform Admin)</span>
                </Link>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  गोपनीयता धोरण (Privacy Policy)
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  अटी व शर्ती (Terms of Use)
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#D9A441] mb-3">
              भाषा निवडा (Language)
            </h4>
            <div className="flex flex-col gap-1.5">
              {(['mr', 'hi', 'en'] as Language[]).map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    language === lang
                      ? 'bg-white/20 text-[#D9A441]'
                      : 'text-[#A3B899] hover:text-white hover:bg-white/10'
                  }`}
                >
                  {lang === 'mr' ? 'मराठी (Marathi)' : lang === 'hi' ? 'हिंदी (Hindi)' : 'English'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Call, WhatsApp & Social Share Bar */}
        <div className="py-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <a
              href="tel:+919822012345"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#CBDCD4] hover:text-white transition-colors"
            >
              <span className="text-[#D9A441]">📞</span>
              <span>कॉल करा: +91 98220 12345</span>
            </a>

            <a
              href="https://wa.me/919822012345?text=Hello%20LayerOS%20Support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] transition-colors"
            >
              <span>💬</span>
              <span>व्हॉट्सॲप सपोर्ट</span>
            </a>
          </div>

          <a
            href="https://wa.me/?text=%E0%A4%B2%E0%A5%87%E0%A4%AF%E0%A4%B0%20%E0%A4%AA%E0%A5%8B%E0%A4%B2%E0%A5%8D%E0%A4%9F%E0%A5%8D%E0%A4%B0%E0%A5%80%20%E0%A4%B6%E0%A5%87%E0%A4%A4%E0%A4%95%E0%A4%B1%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%82%E0%A4%B8%E0%A4%BE%E0%A4%A0%E0%A5%80%20LayerOS%20%E0%A4%85%E0%A5%85%E0%A4%AA%20%E0%A4%AA%E0%A4%BE%E0%A4%B9%E0%A4%BE%3A%20https%3A%2F%2Flayeros.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D9A441]/20 hover:bg-[#D9A441]/30 text-[#D9A441] font-bold transition-colors"
          >
            <span>🔗</span>
            <span>मित्रांना व्हॉट्सॲपवर पाठवा (Share)</span>
          </a>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3B899]">
          <p>© 2026 LayerOS Inc. सर्व हक्क सुरक्षित (All rights reserved).</p>
          <p className="flex items-center gap-1.5">
            <span>महाराष्ट्रातील पोल्ट्री उत्पादकांसाठी खास निर्मित</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
