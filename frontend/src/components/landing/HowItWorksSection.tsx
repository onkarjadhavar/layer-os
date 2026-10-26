'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { UserPlus, Settings, CheckSquare, LineChart, ArrowRight } from 'lucide-react';

export function HowItWorksSection() {
  const { t } = useI18n();

  const steps = [
    {
      title: t.step1Title,
      desc: t.step1Desc,
      icon: UserPlus,
      timing: '१ मिनिट',
    },
    {
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Settings,
      timing: '२ मिनिटे',
    },
    {
      title: t.step3Title,
      desc: t.step3Desc,
      icon: CheckSquare,
      timing: '३० सेकंद / दिवस',
    },
    {
      title: t.step4Title,
      desc: t.step4Desc,
      icon: LineChart,
      timing: 'तात्काळ (Instant)',
    },
  ];

  return (
    <section className="py-14 sm:py-20 px-4 bg-[var(--color-surface)] dark:bg-[#14221C] border-b border-[var(--color-border)] dark:border-[#23372E] transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-main)] dark:text-white mb-3 tracking-tight">
            सुरू करणे सोपे आणि जलद: ४ सोप्या पायऱ्या
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] dark:text-[#9BAEA4]">
            कोणतीही किचकट प्रक्रिया नाही. पहिल्याच दिवसापासून फार्मचा संपूर्ण हिशोब बोटांच्या टोकावर!
          </p>
        </div>

        {/* Connected Horizontal Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-[var(--color-background)] dark:bg-[#0E1713] p-6 rounded-2xl border border-[var(--color-border)] dark:border-[#23372E] relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[var(--color-forest)] text-white flex items-center justify-center font-bold shadow-xs">
                      <Icon className="w-5 h-5 text-[var(--color-sage-pale)]" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-surface)] dark:bg-[#14221C] text-[var(--color-amber)] border border-[var(--color-border)] dark:border-[#23372E]">
                      {st.timing}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--color-text-main)] dark:text-white mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
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
export default HowItWorksSection;
