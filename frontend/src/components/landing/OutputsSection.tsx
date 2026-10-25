'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Percent,
  Scale,
  Sparkles,
  TrendingUp,
  CalendarCheck,
  ShieldAlert,
  BarChart3,
  BadgeAlert,
} from 'lucide-react';

export function OutputsSection() {
  const { t } = useI18n();

  const outputs = [
    {
      title: t.getHd,
      desc: 'दररोज पक्षांच्या क्षमतेनुसार अंड्यांची अचूक उत्पादकता टक्केवारी.',
      metric: '९१.०२%',
      icon: Percent,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      title: t.getFeedPerBird,
      desc: 'प्रत्येक पक्षी किती ग्रॅम खाद्य खातो; प्रमाणापेक्षा जास्त खाल्ल्यास त्वरित इशारा.',
      metric: '११० ग्रॅम',
      icon: Scale,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: t.getBreakEven,
      desc: t.getBreakEvenDesc,
      metric: '₹५.२१ / नग',
      icon: BadgeAlert,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
    },
    {
      title: t.getTrueProfit,
      desc: t.getTrueProfitDesc,
      metric: '₹१९,९२० / दिवस',
      icon: TrendingUp,
      color: 'text-emerald-700 bg-emerald-100/50 dark:bg-emerald-950/40',
    },
    {
      title: t.getFeedForecast,
      desc: 'पुढील ३० दिवसांत किती खाद्य गोण्या लागतील आणि त्यासाठी किती रोकड लागेल.',
      metric: '९९,००० कि.ग्रा.',
      icon: CalendarCheck,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30',
    },
    {
      title: t.getAiAdvice,
      desc: t.getAiAdviceDesc,
      metric: '३ तत्काळ कृती',
      icon: Sparkles,
      color: 'text-[#D9A441] bg-[#FCF6E9] dark:bg-[#2A2315]',
    },
  ];

  return (
    <section className="py-12 sm:py-20 px-4 bg-[#FAF8F3] dark:bg-[#0F1A15] transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#1F4D3A]/10 text-[#1F4D3A] dark:text-[#64D8A1]">
            {t.whatYouGetTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B1E15] dark:text-white mt-3 mb-3 tracking-tight">
            उत्पादन, नफा आणि भविष्यातील खर्चाचे संपूर्ण गणित
          </h2>
          <p className="text-sm sm:text-base text-[#3D5248] dark:text-[#CBDCD4]">
            फक्त डेटा नोंदवून थांबू नका — अचूक विश्लेषण, वैज्ञानिक आकडेवारी आणि निर्णयक्षम सूचना थेट मिळवा.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {outputs.map((out, idx) => {
            const Icon = out.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#16241D] p-5 sm:p-6 rounded-3xl border border-[#E7E2D6] dark:border-[#263B30] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${out.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm sm:text-base font-black text-[#1F4D3A] dark:text-[#D9A441] bg-[#FAF8F3] dark:bg-[#0F1A15] px-2.5 py-1 rounded-xl border border-[#E7E2D6] dark:border-[#263B30]">
                      {out.metric}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#0B1E15] dark:text-white mb-2">
                    {out.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#9FB1A7] leading-relaxed">
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
