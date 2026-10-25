'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { BookOpen, Smartphone, Check, X, TrendingUp, AlertCircle } from 'lucide-react';

export function WhatIsSection() {
  const { t } = useI18n();

  return (
    <section className="py-12 sm:py-20 px-4 bg-white dark:bg-[#121F18] border-y border-[#E7E2D6] dark:border-[#263B30] transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EAF3EF] dark:bg-[#1A2E24] text-[#1F4D3A] dark:text-[#42BF87]">
            {t.whatIsTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B1E15] dark:text-white mt-3 mb-4 tracking-tight">
            वही-डायरी बंद. प्रत्येक पैशाचा आणि अंड्याचा हिशोब फोनमध्ये!
          </h2>
          <p className="text-sm sm:text-base text-[#3D5248] dark:text-[#CBDCD4] leading-relaxed">
            {t.whatIsDesc}
          </p>
        </div>

        {/* Comparison Grid: Paper Register vs LayerOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Old Method: Paper Notebook */}
          <div className="bg-[#FAF8F3] dark:bg-[#16241D] p-6 rounded-3xl border border-[#E7E2D6] dark:border-[#263B30] relative opacity-85">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B1E15] dark:text-white">
                  पारंपारिक वही / डायरी (Paper Notebook)
                </h3>
                <span className="text-xs text-red-600 font-semibold">वेळखाऊ आणि चुका होण्याची शक्यता</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[#5A6E64] dark:text-[#9FB1A7]">
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>आज नफा झाला की तोटा हे महिन्याच्या शेवटीच समजते</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>अंडी तुटफूट व खाद्याचा प्रति-पक्षी हिशोब (g/bird) काढायला कॅल्क्युलेटर लागतो</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>व्यापाऱ्यांची उधारी (थकबाकी) आणि जुनी पाने गहाळ होण्याची भीती</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>घसारा (Pullet Amortisation) आणि शेड भांडवली खर्च हिशोबात सुटून जातो</span>
              </li>
            </ul>
          </div>

          {/* New Method: LayerOS */}
          <div className="bg-gradient-to-br from-[#EAF3EF] to-white dark:from-[#1A2E24] dark:to-[#16241D] p-6 rounded-3xl border-2 border-[#1F4D3A] dark:border-[#3BA378] shadow-md relative">
            <div className="absolute -top-3 right-6 bg-[#D9A441] text-[#122A20] text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
              स्मार्ट डिजिटल उपाय
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1F4D3A] text-white flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5 text-[#D9A441]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
                  LayerOS डिजिटल ऑपरेटिंग सिस्टीम
                </h3>
                <span className="text-xs text-[#2E7D5B] dark:text-[#42BF87] font-bold">झटपट ३० सेकंदांचा अचूक ताळेबंद</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[#1B2A24] dark:text-[#E0ECE6] font-medium">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#2E7D5B] mt-0.5 flex-shrink-0" />
                <span>अवघ्या ३ सेकंदात ब्रेक-इव्हन भाव (₹५.२१) आणि आजचा नफा-तोटा स्पष्ट</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#2E7D5B] mt-0.5 flex-shrink-0" />
                <span>HD% (९१%), ११० ग्रॅम खुराक आणि ३० दिवसांचे खाद्य नियोजन आपोआप तयार</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#2E7D5B] mt-0.5 flex-shrink-0" />
                <span>व्यापारी खातेवही, बिलिंग आणि व्हॉट्सॲपवर एक-क्लिक पावती</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#2E7D5B] mt-0.5 flex-shrink-0" />
                <span>AI सल्लागार: उत्पादन घसरल्यास किंवा खाद्य वाढल्यास लगेच वैज्ञानिक मार्गदर्शन</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
