'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { UserPlus, Settings, CheckSquare, LineChart } from 'lucide-react';

export function HowItWorksSection() {
  const { t } = useI18n();

  const steps = [
    {
      num: '१',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: UserPlus,
    },
    {
      num: '२',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Settings,
    },
    {
      num: '३',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: CheckSquare,
    },
    {
      num: '४',
      title: t.step4Title,
      desc: t.step4Desc,
      icon: LineChart,
    },
  ];

  return (
    <section className="py-12 sm:py-20 px-4 bg-white dark:bg-[#121F18] border-b border-[#E7E2D6] dark:border-[#263B30] transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EAF3EF] dark:bg-[#1A2E24] text-[#1F4D3A] dark:text-[#42BF87]">
            {t.howItWorksTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B1E15] dark:text-white mt-3 mb-3 tracking-tight">
            सुरू करणे अतिशय सोपे आणि जलद
          </h2>
          <p className="text-sm sm:text-base text-[#3D5248] dark:text-[#CBDCD4]">
            कोणतीही किचकट प्रक्रिया नाही. पहिल्याच दिवसापासून फार्मचा संपूर्ण हिशोब बोटांच्या टोकावर!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F3] dark:bg-[#16241D] p-6 rounded-3xl border border-[#E7E2D6] dark:border-[#263B30] relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1F4D3A] text-white flex items-center justify-center font-black text-xl shadow">
                      <Icon className="w-6 h-6 text-[#D9A441]" />
                    </div>
                    <span className="text-2xl font-black text-[#D9A441] opacity-70">
                      {st.num}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#0B1E15] dark:text-white mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#9FB1A7] leading-relaxed">
                    {st.desc}
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
