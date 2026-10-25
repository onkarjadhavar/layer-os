'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { ShieldCheck, Lock, AlertCircle, FileCheck, KeyRound } from 'lucide-react';

export function TrustSection() {
  const { t } = useI18n();

  return (
    <section className="py-12 sm:py-20 px-4 bg-[#FAF8F3] dark:bg-[#0F1A15] transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#16241D] rounded-3xl p-6 sm:p-10 border border-[#E7E2D6] dark:border-[#263B30] shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B1E15] dark:text-white tracking-tight mb-2">
              {t.trustTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#CBDCD4] leading-relaxed">
              {t.trustDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#0F1A15] border border-[#E7E2D6] dark:border-[#263B30]">
              <Lock className="w-5 h-5 text-[#1F4D3A] dark:text-[#42BF87] mb-2" />
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white mb-1">
                डेटाबेस स्तरावर सुरक्षा (RLS)
              </h3>
              <p className="text-xs text-[#5A6E64] dark:text-[#9FB1A7]">
                प्रत्येक फार्मला डिजिटल कुंपण आहे. Farm A चा डेटा Farm B ला कोणत्याही परिस्थितीत दिसत नाही.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#0F1A15] border border-[#E7E2D6] dark:border-[#263B30]">
              <KeyRound className="w-5 h-5 text-[#1F4D3A] dark:text-[#42BF87] mb-2" />
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white mb-1">
                मालकाचे संपूर्ण नियंत्रण
              </h3>
              <p className="text-xs text-[#5A6E64] dark:text-[#9FB1A7]">
                सुपरवायझर, अकाउंटंट किंवा डॉक्टर यांना किती माहिती दिसावी हे फक्त मालक ठरवतो.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#0F1A15] border border-[#E7E2D6] dark:border-[#263B30]">
              <FileCheck className="w-5 h-5 text-[#1F4D3A] dark:text-[#42BF87] mb-2" />
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white mb-1">
                DPDP कायदा सुसंगत
              </h3>
              <p className="text-xs text-[#5A6E64] dark:text-[#9FB1A7]">
                भारतीय डिजिटल वैयक्तिक डेटा संरक्षण नियमांनुसार तुमचा फोन नंबर व फार्म तपशील सुरक्षित.
              </p>
            </div>
          </div>

          {/* AI Veterinary Disclaimer Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
              {t.trustAiDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
