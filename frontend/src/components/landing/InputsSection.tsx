'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Egg, Skull, Wheat, IndianRupee, Receipt, Clock, Sparkles } from 'lucide-react';

export function InputsSection() {
  const { t } = useI18n();

  const inputs = [
    {
      title: t.enterEggs,
      desc: t.enterEggsDesc,
      icon: Egg,
      tag: 'सकाळ / संध्याकाळ',
    },
    {
      title: t.enterMortality,
      desc: t.enterMortalityDesc,
      icon: Skull,
      tag: 'दैनिक पक्षी मृत्यू',
    },
    {
      title: t.enterFeed,
      desc: t.enterFeedDesc,
      icon: Wheat,
      tag: 'गोण्या (५० किलो) / किलो',
    },
    {
      title: t.enterSales,
      desc: t.enterSalesDesc,
      icon: IndianRupee,
      tag: 'ट्रे, गट्टा, उधारी',
    },
    {
      title: t.enterExpenses,
      desc: t.enterExpensesDesc,
      icon: Receipt,
      tag: 'मजुरी, औषध, वीज, EMI',
    },
  ];

  return (
    <section className="py-12 sm:py-20 px-4 bg-white dark:bg-[#121F18] border-b border-[#E7E2D6] dark:border-[#263B30] transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EAF3EF] dark:bg-[#1A2E24] text-[#1F4D3A] dark:text-[#42BF87]">
            {t.whatYouEnterTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B1E15] dark:text-white mt-3 mb-3 tracking-tight">
            शेतकऱ्याला त्रास नाही: अवघे ४ आकडे आणि ३० सेकंद!
          </h2>
          <p className="text-sm sm:text-base text-[#3D5248] dark:text-[#CBDCD4]">
            {t.whatYouEnterSubtitle}
          </p>
        </div>

        {/* Speed Banner Callout */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#1F4D3A] to-[#122A20] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[#D9A441]" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-black">
                दोन सोपे पर्याय: जलद (Quick Mode) किंवा सविस्तर (Full Mode)
              </span>
              <p className="text-xs text-[#CBDCD4]">
                सुपरवायझरसाठी ३० सेकंदात ४ आकडे, तर मालकासाठी २ मिनिटांत संपूर्ण ताळेबंद!
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#D9A441] text-[#122A20] flex-shrink-0">
            मोबाईल कीपॅड रेडी
          </span>
        </div>

        {/* 5 Input Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {inputs.map((inp, idx) => {
            const Icon = inp.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F3] dark:bg-[#16241D] p-5 rounded-2xl border border-[#E7E2D6] dark:border-[#263B30] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1F4D3A] text-white flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#D9A441]" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#1F2E26] text-[#5A6E64] dark:text-[#A3B899] border border-[#E7E2D6] dark:border-[#263B30]">
                      {inp.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#0B1E15] dark:text-white mb-1.5">
                    {inp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#9FB1A7] leading-relaxed">
                    {inp.desc}
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
