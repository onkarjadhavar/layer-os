'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { BookOpen, Smartphone, Check, X, ShieldAlert, Zap } from 'lucide-react';

export function WhatIsSection() {
  const { t } = useI18n();

  return (
    <section className="py-14 sm:py-20 px-4 bg-[var(--color-surface)] dark:bg-[#14221C] border-b border-[var(--color-border)] dark:border-[#23372E] transition-colors scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-main)] dark:text-white mb-3 tracking-tight">
            वही-डायरी बंद. प्रत्येक पैशाचा आणि अंड्याचा हिशोब फोनमध्ये!
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
            {t.whatIsDesc}
          </p>
        </div>

        {/* Comparison Architecture: Paper Register vs LayerOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Traditional Method: Paper Notebook */}
          <div className="bg-[var(--color-background)] dark:bg-[#0E1713] p-6 sm:p-7 rounded-2xl border border-[var(--color-border)] dark:border-[#23372E] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-error-bg)] dark:bg-[#2C1210] text-[var(--color-error)] flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-text-main)] dark:text-white">
                    पारंपारिक वही / डायरी (Paper Register)
                  </h3>
                  <span className="text-xs text-[var(--color-error)] font-semibold">
                    वेळखाऊ आणि चुका होण्याची शक्यता
                  </span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-[var(--color-text-muted)] dark:text-[#9BAEA4]">
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-[var(--color-error)] mt-0.5 flex-shrink-0" />
                  <span>आज नफा झाला की तोटा हे महिन्याच्या शेवटी किंवा वर्षाअखेरच समजते.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-[var(--color-error)] mt-0.5 flex-shrink-0" />
                  <span>अंडी तुटफूट व खाद्याचा प्रति-पक्षी हिशोब (g/bird) काढायला कॅल्क्युलेटरवर वेळ वाया जातो.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-[var(--color-error)] mt-0.5 flex-shrink-0" />
                  <span>व्यापाऱ्यांची उधारी (थकबाकी) आणि जुनी पाने गहाळ होण्याची सतत भीती राहते.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-[var(--color-error)] mt-0.5 flex-shrink-0" />
                  <span>पिल्लांचा घसारा (Pullet Amortisation) आणि भांडवली खर्च हिशोबात सुटून खरा नफा समजत नाही.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--color-border)] dark:border-[#23372E] flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <ShieldAlert className="w-4 h-4 text-[var(--color-error)] flex-shrink-0" />
              <span>दरमहा सरासरी ₹१५,००० ते ₹४०,००० चे अंडी व खाद्य नुकसान अज्ञात राहते.</span>
            </div>
          </div>

          {/* New Method: LayerOS Digital System */}
          <div className="bg-[var(--color-surface)] dark:bg-[#14221C] p-6 sm:p-7 rounded-2xl border-2 border-[var(--color-forest)] dark:border-[var(--color-sage)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-forest)] text-white flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5 text-[var(--color-amber)]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--color-text-main)] dark:text-white">
                      LayerOS डिजिटल ऑपरेटिंग प्रणाली
                    </h3>
                    <span className="text-xs text-[var(--color-forest)] dark:text-[var(--color-sage)] font-bold">
                      झटपट ३० सेकंदांचा अचूक ताळेबंद
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-sage-pale)] text-[var(--color-forest)] border border-[var(--color-sage)]/40">
                  डिजिटल उपाय
                </span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-[var(--color-text-main)] dark:text-white font-medium">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                  <span>अवघ्या ३ सेकंदात ब्रेक-इव्हन भाव (₹५.२१) आणि आजचा नफा-तोटा स्क्रीनवर स्पष्ट.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                  <span>HD% (९१%), ११० ग्रॅम खुराक आणि ३० दिवसांचे खाद्य नियोजन आपोआप तयार.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                  <span>व्यापारी खातेवही, ट्रे-गट्टा बिलिंग आणि व्हॉट्सॲपवर एका क्लिकमध्ये पावती रवाना.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                  <span>AI सल्लागार: उत्पादन घसरल्यास किंवा खाद्य वाढल्यास लगेच वैज्ञानिक मार्गदर्शन.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--color-border)] dark:border-[#23372E] flex items-center gap-2 text-xs font-semibold text-[var(--color-forest)] dark:text-[var(--color-sage)]">
              <Zap className="w-4 h-4 text-[var(--color-amber)] flex-shrink-0" />
              <span>दररोज फार्म व्यवस्थापकाचे ४५ मिनिटे आणि हिशोबाच्या चुका वाचतात.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default WhatIsSection;
