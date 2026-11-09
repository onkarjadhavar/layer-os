'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Globe2,
  WifiOff,
  Users,
  ShieldCheck,
  Sparkles,
  FileText,
} from 'lucide-react';

export function FeaturesGrid() {
  const { t } = useI18n();

  const features = [
    {
      title: t.featMarathiFirst,
      desc: t.featMarathiFirstDesc,
      icon: Globe2,
      accent: 'border-[var(--color-forest)]/30',
      badge: 'मराठी / हिंदी / English',
    },
    {
      title: t.featOffline,
      desc: t.featOfflineDesc,
      icon: WifiOff,
      accent: 'border-[var(--color-sage)]/40',
      badge: '100% Offline PWA',
    },
    {
      title: t.featMultiRole,
      desc: t.featMultiRoleDesc,
      icon: Users,
      accent: 'border-[var(--color-border)]',
      badge: 'मालक • व्यवस्थापक • डॉक्टर',
    },
    {
      title: t.featDataPrivate,
      desc: t.featDataPrivateDesc,
      icon: ShieldCheck,
      accent: 'border-[var(--color-border)]',
      badge: 'DPDP कायदा सुसंगत',
    },
    {
      title: t.featAiAdvisor,
      desc: t.featAiAdvisorDesc,
      icon: Sparkles,
      accent: 'border-[var(--color-amber)]/40',
      badge: 'वैज्ञानिक विश्लेषण',
    },
    {
      title: t.featPdfReports,
      desc: t.featPdfReportsDesc,
      icon: FileText,
      accent: 'border-[var(--color-border)]',
      badge: 'व्हॉट्सॲप व PDF बिलिंग',
    },
  ];

  return (
    <section className="py-14 sm:py-20 px-4 bg-[var(--color-surface)] dark:bg-[#14221C] border-b border-[var(--color-border)] dark:border-[#23372E] transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-main)] dark:text-white mb-3 tracking-tight">
            शेतकऱ्यांच्या प्रत्यक्ष गरजांचा अभ्यास करून विकसित
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
            प्रत्येक बटण, गणना आणि अहवाल व्यावसायिक लेयर फार्मच्या दैनंदिन कामासाठी खास डिझाइन केलेले आहे.
          </p>
        </div>

        {/* 6 Feature Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`bg-[var(--color-background)] dark:bg-[#0E1713] p-6 rounded-2xl border ${feat.accent} dark:border-[#23372E] shadow-xs hover:border-[var(--color-sage)] transition-colors flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] dark:bg-[#14221C] text-[var(--color-forest)] dark:text-[var(--color-sage)] border border-[var(--color-border)] dark:border-[#23372E] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-surface)] dark:bg-[#14221C] text-[var(--color-text-muted)] dark:text-[#9BAEA4] border border-[var(--color-border)] dark:border-[#23372E]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--color-text-main)] dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default FeaturesGrid;
