'use client';

import React from 'react';
import { Link } from '@/components/common/Link';
import { useI18n } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';
import { LayerOSLogo } from '@/components/common/LayerOSLogo';
import { ArrowRight, ShieldCheck, Heart, Phone, Mail, MapPin } from 'lucide-react';

export function LandingFooter() {
  const { language, setLanguage, t } = useI18n();

  return (
    <footer className="bg-[var(--color-forest-deep)] text-white pt-12 sm:pt-16 pb-12 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Final High-Impact CTA Block */}
        <div className="bg-[var(--color-forest)] rounded-2xl p-8 sm:p-12 text-center mb-14 border border-[var(--color-sage)]/30 shadow-md relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="flex justify-center mb-4">
              <LayerOSLogo size={44} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              आजच आपल्या फार्मचा कारभार आधुनिक करा
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-sage-pale)] mb-8 font-normal leading-relaxed">
              नोंदणी पूर्ण करा आणि ३० दिवसांची मोफत चाचणी लगेच सुरू करा. कोणत्याही क्रेडिट कार्डची गरज नाही.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              <Link
                id="landing-footer-enroll-btn"
                href="/enroll"
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm sm:text-base font-bold text-[var(--color-forest-deep)] bg-[var(--color-amber)] hover:bg-[#BF7218] shadow-sm transition-all min-h-[48px]"
              >
                <span>{t.heroEnrollCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                id="landing-footer-login-btn"
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/20 min-h-[48px] flex items-center justify-center"
              >
                <span>{t.landingLoginBtn}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Navigation & Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <LayerOSLogo size={36} showText />
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-sage-pale)]/80 max-w-sm leading-relaxed">
              {t.tagline}. व्यावसायिक लेयर पोल्ट्री फार्म्ससाठी आधुनिक, मराठी-प्रथम डिजिटल ऑपरेटिंग प्रणाली.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--color-sage)] pt-1">
              <ShieldCheck className="w-4 h-4 text-[var(--color-amber)]" />
              <span>DPDP 2023 भारतीय डेटा संरक्षण कायद्यानुसार सुरक्षित</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-sage)] mb-3">
              महत्त्वाच्या लिंक्स
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--color-sage-pale)]/80">
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
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Platform Admin
                </Link>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  {t.pricingTitle}
                </a>
              </li>
            </ul>
          </div>

          {/* Regional Support & Languages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-sage)] mb-3">
              भाषा व संपर्क
            </h4>
            <div className="flex items-center gap-1.5 mb-4">
              {(['mr', 'hi', 'en'] as Language[]).map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === lang
                      ? 'bg-[var(--color-amber)] text-[var(--color-forest-deep)]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'English'}
                </button>
              ))}
            </div>
            <div className="text-xs text-[var(--color-sage-pale)]/70 space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                <span>पुणे, सांगली, सातारा, सोलापूर, नाशिक</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-sage-pale)]/60">
          <div>
            © {new Date().getFullYear()} LayerOS Inc. सर्व हक्क राखीव.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors">गोपनीयता धोरण (Privacy Policy)</span>
            <span className="hover:text-white transition-colors">नियम व अटी (Terms of Service)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default LandingFooter;
