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
  Lock,
} from 'lucide-react';

export function FeaturesGrid() {
  const { t } = useI18n();

  const features = [
    {
      title: t.featMarathiFirst,
      desc: t.featMarathiFirstDesc,
      icon: Globe2,
    },
    {
      title: t.featOffline,
      desc: t.featOfflineDesc,
      icon: WifiOff,
    },
    {
      title: t.featMultiRole,
      desc: t.featMultiRoleDesc,
      icon: Users,
    },
    {
      title: t.featDataPrivate,
      desc: t.featDataPrivateDesc,
      icon: ShieldCheck,
    },
    {
      title: t.featAiAdvisor,
      desc: t.featAiAdvisorDesc,
      icon: Sparkles,
    },
    {
      title: t.featPdfReports,
      desc: t.featPdfReportsDesc,
      icon: FileText,
    },
  ];

  return (
    <section className="py-12 sm:py-20 px-4 bg-white dark:bg-[#121F18] border-b border-[#E7E2D6] dark:border-[#263B30] transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EAF3EF] dark:bg-[#1A2E24] text-[#1F4D3A] dark:text-[#42BF87]">
            {t.featuresGridTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B1E15] dark:text-white mt-3 mb-3 tracking-tight">
            शेतकऱ्यांच्या प्रत्यक्ष गरजांचा अभ्यास करून विकसित
          </h2>
          <p className="text-sm sm:text-base text-[#3D5248] dark:text-[#CBDCD4]">
            शेडमधील धूळ, इंटरनेटची अडचण आणि स्थानिक भाषेची गरज लक्षात घेऊन बनवलेले तंत्रज्ञान.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F3] dark:bg-[#16241D] p-6 rounded-3xl border border-[#E7E2D6] dark:border-[#263B30] hover:border-[#1F4D3A]/40 dark:hover:border-[#3BA378]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1F4D3A] text-white flex items-center justify-center mb-4 shadow">
                    <Icon className="w-6 h-6 text-[#D9A441]" />
                  </div>
                  <h3 className="text-base font-black text-[#0B1E15] dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#9FB1A7] leading-relaxed">
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
