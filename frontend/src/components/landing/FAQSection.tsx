'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQSection() {
  const { t } = useI18n();

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
    { q: t.faqQ6, a: t.faqA6 },
    { q: t.faqQ7, a: t.faqA7 },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-12 sm:py-20 px-4 bg-[#FAF8F3] dark:bg-[#0F1A15] transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#1F4D3A]/10 text-[#1F4D3A] dark:text-[#64D8A1]">
            {t.faqTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B1E15] dark:text-white mt-3 mb-3 tracking-tight">
            शेतकरी बंधूंचे नेहमी विचारले जाणारे प्रश्न
          </h2>
          <p className="text-sm sm:text-base text-[#3D5248] dark:text-[#CBDCD4]">
            LayerOS बद्दल मनात असलेल्या शंकांचे सोपे आणि स्पष्ट निरसन.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#16241D] rounded-2xl border border-[#E7E2D6] dark:border-[#263B30] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-black text-sm sm:text-base text-[#0B1E15] dark:text-white hover:text-[#1F4D3A] dark:hover:text-[#64D8A1] min-h-[52px]"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#D9A441] flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#5A6E64] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#1F4D3A] dark:text-[#64D8A1]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#3D5248] dark:text-[#CBDCD4] leading-relaxed border-t border-[#E7E2D6]/60 dark:border-[#263B30]/60 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
