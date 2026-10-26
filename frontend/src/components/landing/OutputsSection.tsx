'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Percent,
  Scale,
  Sparkles,
  TrendingUp,
  CalendarCheck,
  BadgeAlert,
} from 'lucide-react';

export function OutputsSection() {
  const { t } = useI18n();

  const outputs = [
    {
      title: t.getHd,
      desc: 'दररोज पक्षांच्या वयोमानानुसार व क्षमतेनुसार अंड्यांची अचूक उत्पादकता टक्केवारी.',
      metric: '९१.०२%',
      sublabel: 'मानक: ९१.५%',
      icon: Percent,
      highlight: 'border-[var(--color-sage)]/50',
    },
    {
      title: t.getFeedPerBird,
      desc: 'प्रत्येक पक्षी किती ग्रॅम खाद्य खातो; प्रमाणापेक्षा जास्त खाल्ल्यास त्वरित इशारा.',
      metric: '११० ग्रॅम',
      sublabel: 'प्रति पक्षी / दिवस',
      icon: Scale,
      highlight: 'border-[var(--color-border)]',
    },
    {
      title: t.getBreakEven,
      desc: t.getBreakEvenDesc,
      metric: '₹५.२१',
      sublabel: 'प्रति अंडे (Break-Even)',
      icon: BadgeAlert,
      highlight: 'border-[var(--color-amber)]/40',
    },
    {
      title: t.getTrueProfit,
      desc: t.getTrueProfitDesc,
      metric: '₹१९,९२०',
      sublabel: 'दैनिक खरा निव्वळ नफा',
      icon: TrendingUp,
      highlight: 'border-[var(--color-forest)]/40',
    },
    {
      title: t.getFeedForecast,
      desc: 'पुढील ३० दिवसांत किती खाद्य गोण्या लागतील आणि त्यासाठी किती रोख रक्कम लागेल.',
      metric: '९९,००० कि.ग्रा.',
      sublabel: '१,९८० पोती खुराक',
      icon: CalendarCheck,
      highlight: 'border-[var(--color-border)]',
    },
    {
      title: t.getAiAdvice,
      desc: t.getAiAdviceDesc,
      metric: '३ तत्काळ कृती',
      sublabel: 'वैज्ञानिक शेड मार्गदर्शन',
      icon: Sparkles,
      highlight: 'border-[var(--color-amber)]/40',
    },
  ];

  return (
    <section className="py-14 sm:py-20 px-4 bg-[var(--color-background)] dark:bg-[#0E1713] transition-colors border-b border-[var(--color-border)] dark:border-[#23372E]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-main)] dark:text-white mb-3 tracking-tight">
            उत्पादन, नफा आणि भविष्यातील खर्चाचे संपूर्ण गणित
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
            फक्त डेटा नोंदवून थांबू नका — अचूक विश्लेषण, वैज्ञानिक आकडेवारी आणि निर्णयक्षम सूचना थेट मिळवा.
          </p>
        </div>

        {/* 6 Automated Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {outputs.map((out, idx) => {
            const Icon = out.icon;
            return (
              <div
                key={idx}
                className={`bg-[var(--color-surface)] dark:bg-[#14221C] p-5 sm:p-6 rounded-2xl border ${out.highlight} dark:border-[#23372E] shadow-sm flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-subtle)] dark:bg-[#192B23] text-[var(--color-forest)] dark:text-[var(--color-sage)] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black tabular-nums text-[var(--color-text-main)] dark:text-white">
                        {out.metric}
                      </div>
                      <div className="text-[10px] text-[var(--color-text-muted)] font-medium">
                        {out.sublabel}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-text-main)] dark:text-white mb-2">
                    {out.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
                    {out.desc}
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
export default OutputsSection;
