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
    <section className="py-14 sm:py-20 px-4 bg-[var(--color-background)] dark:bg-[#0E1713] transition-colors border-b border-[var(--color-border)] dark:border-[#23372E]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-main)] dark:text-white mb-3 tracking-tight">
            शेतकरी बंधूंचे नेहमी विचारले जाणारे प्रश्न
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] dark:text-[#9BAEA4]">
            LayerOS बद्दल मनात असलेल्या शंकांचे सोपे आणि स्पष्ट निरसन.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[var(--color-surface)] dark:bg-[#14221C] rounded-xl border border-[var(--color-border)] dark:border-[#23372E] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[var(--color-text-main)] dark:text-white hover:text-[var(--color-forest)] dark:hover:text-[var(--color-sage)] min-h-[48px]"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[var(--color-amber)] flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[var(--color-forest)] dark:text-[var(--color-sage)]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--color-text-muted)] dark:text-[#CBDCD4] leading-relaxed border-t border-[var(--color-border)]/60 dark:border-[#23372E]/60 animate-in fade-in duration-150">
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
export default FAQSection;
