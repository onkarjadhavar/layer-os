'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { ShieldCheck, Lock, AlertCircle, FileCheck, KeyRound } from 'lucide-react';

export function TrustSection() {
  const { t } = useI18n();

  return (
    <section className="py-14 sm:py-20 px-4 bg-[var(--color-surface)] dark:bg-[#14221C] border-b border-[var(--color-border)] dark:border-[#23372E] transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[var(--color-background)] dark:bg-[#0E1713] rounded-2xl p-6 sm:p-10 border border-[var(--color-border)] dark:border-[#23372E] shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-sage-pale)] text-[var(--color-forest)] dark:bg-[#1A2E24] dark:text-[var(--color-sage)] mx-auto flex items-center justify-center mb-3.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text-main)] dark:text-white tracking-tight mb-2">
              {t.trustTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
              {t.trustDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-[var(--color-surface)] dark:bg-[#14221C] border border-[var(--color-border)] dark:border-[#23372E]">
              <Lock className="w-5 h-5 text-[var(--color-forest)] dark:text-[var(--color-sage)] mb-2" />
              <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white mb-1">
                डेटाबेस स्तरावर सुरक्षा (RLS)
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
                प्रत्येक फार्मला स्वतंत्र डिजिटल कुंपण आहे. Farm A चा डेटा Farm B ला कोणत्याही परिस्थितीत दिसत नाही.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--color-surface)] dark:bg-[#14221C] border border-[var(--color-border)] dark:border-[#23372E]">
              <KeyRound className="w-5 h-5 text-[var(--color-forest)] dark:text-[var(--color-sage)] mb-2" />
              <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white mb-1">
                मालकाचे संपूर्ण नियंत्रण
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
                सुपरवायझर, अकाउंटंट किंवा डॉक्टर यांना किती माहिती दिसावी हे फक्त मालक ठरवतो.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--color-surface)] dark:bg-[#14221C] border border-[var(--color-border)] dark:border-[#23372E]">
              <FileCheck className="w-5 h-5 text-[var(--color-forest)] dark:text-[var(--color-sage)] mb-2" />
              <h3 className="text-sm font-bold text-[var(--color-text-main)] dark:text-white mb-1">
                DPDP कायदा सुसंगत
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
                भारतीय डिजिटल वैयक्तिक डेटा संरक्षण नियमांनुसार तुमचा फोन नंबर व फार्म तपशील सुरक्षित.
              </p>
            </div>
          </div>

          {/* AI Veterinary Disclaimer Alert */}
          <div className="p-4 rounded-xl bg-[var(--color-amber-soft)]/60 dark:bg-[#2B2113] border border-[var(--color-amber)]/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--color-amber)] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--color-walnut)] dark:text-[#E5B252] leading-relaxed font-medium">
              {t.trustAiDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default TrustSection;
