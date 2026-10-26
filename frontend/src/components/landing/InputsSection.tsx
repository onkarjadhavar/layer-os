'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Egg, Skull, Wheat, IndianRupee, Receipt, Clock, CheckCircle2 } from 'lucide-react';

export function InputsSection() {
  const { t } = useI18n();

  const inputs = [
    {
      title: t.enterEggs,
      desc: t.enterEggsDesc,
      icon: Egg,
      tag: 'सकाळ / संध्याकाळ अंडी',
      example: 'उदा. २७,३०० अंडी (९१% HD)',
    },
    {
      title: t.enterMortality,
      desc: t.enterMortalityDesc,
      icon: Skull,
      tag: 'दैनिक पक्षी मृत्यू',
      example: 'उदा. १२ पक्षी (०.०४%)',
    },
    {
      title: t.enterFeed,
      desc: t.enterFeedDesc,
      icon: Wheat,
      tag: 'पोती (५० कि.ग्रा.) / कि.ग्रा.',
      example: 'उदा. ६६ पोती (३,३०० कि.ग्रा.)',
    },
    {
      title: t.enterSales,
      desc: t.enterSalesDesc,
      icon: IndianRupee,
      tag: 'ट्रे, गट्टा, उधारी चलन',
      example: 'उदा. ₹५.४० दर, ९१० ट्रे विक्री',
    },
    {
      title: t.enterExpenses,
      desc: t.enterExpensesDesc,
      icon: Receipt,
      tag: 'मजुरी, औषध, वीज, व्याज',
      example: 'उदा. दैनंदिन रोख खर्च',
    },
  ];

  return (
    <section className="py-14 sm:py-20 px-4 bg-[var(--color-surface)] dark:bg-[#14221C] border-b border-[var(--color-border)] dark:border-[#23372E] transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-main)] dark:text-white mb-3 tracking-tight">
            शेतकऱ्याला त्रास नाही: अवघे ४ आकडे आणि ३० सेकंद!
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
            {t.whatYouEnterSubtitle}
          </p>
        </div>

        {/* Speed Callout Ribbon */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[var(--color-forest)] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-[var(--color-forest-deep)]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[var(--color-amber)]" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold">
                दोन सोपे पर्याय: जलद (Quick Mode ३० सेकंद) किंवा सविस्तर (Full Mode)
              </div>
              <p className="text-xs text-[var(--color-sage-pale)] mt-0.5">
                सुपरवायझरसाठी ३० सेकंदात केवळ ४ आकडे, तर मालकासाठी २ मिनिटांत संपूर्ण ताळेबंद!
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[var(--color-amber)] text-[var(--color-forest-deep)] flex-shrink-0">
            मोबाईल कीपॅड रेडी
          </span>
        </div>

        {/* 5 Input Parameter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {inputs.map((inp, idx) => {
            const Icon = inp.icon;
            return (
              <div
                key={idx}
                className="bg-[var(--color-background)] dark:bg-[#0E1713] p-5 rounded-2xl border border-[var(--color-border)] dark:border-[#23372E] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] dark:bg-[#14221C] text-[var(--color-forest)] dark:text-[var(--color-sage)] border border-[var(--color-border)] dark:border-[#23372E] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-surface)] dark:bg-[#14221C] text-[var(--color-text-muted)] dark:text-[#9BAEA4] border border-[var(--color-border)] dark:border-[#23372E]">
                      {inp.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-text-main)] dark:text-white mb-1.5">
                    {inp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed mb-3">
                    {inp.desc}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-[var(--color-border)]/60 dark:border-[#23372E] text-[11px] font-semibold text-[var(--color-forest)] dark:text-[var(--color-sage)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)] flex-shrink-0" />
                  <span>{inp.example}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default InputsSection;
