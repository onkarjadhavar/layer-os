'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { SUBSCRIPTION_PLANS, PlanId } from '@/lib/billing/plans';
import { formatIndianCurrency } from '@/lib/calc';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export function PricingSection() {
  const { language, t } = useI18n();

  const planKeys: PlanId[] = ['starter', 'grower', 'enterprise'];

  return (
    <section className="py-12 sm:py-20 px-4 bg-white dark:bg-[#121F18] border-b border-[#E7E2D6] dark:border-[#263B30] transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EAF3EF] dark:bg-[#1A2E24] text-[#1F4D3A] dark:text-[#42BF87]">
            {t.pricingTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B1E15] dark:text-white mt-3 mb-3 tracking-tight">
            लहान फार्मपासून मोठ्या समूहापर्यंत सर्वांसाठी
          </h2>
          <p className="text-sm sm:text-base text-[#3D5248] dark:text-[#CBDCD4]">
            {t.pricingSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planKeys.map(key => {
            const plan = SUBSCRIPTION_PLANS[key];
            const isPopular = plan.popular;
            const price = plan.priceINR.monthly;

            return (
              <div
                key={key}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#FAF8F3] to-white dark:from-[#1A2E24] dark:to-[#16241D] border-2 border-[#1F4D3A] dark:border-[#3BA378] shadow-xl'
                    : 'bg-[#FAF8F3] dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30]'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1F4D3A] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow flex items-center gap-1 border border-[#D9A441]">
                    <Sparkles className="w-3 h-3 text-[#D9A441]" />
                    <span>सर्वात लोकप्रिय (Most Popular)</span>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-[#0B1E15] dark:text-white">
                      {plan.name[language] || plan.name.mr}
                    </h3>
                    <p className="text-xs text-[#5A6E64] dark:text-[#9FB1A7] mt-1 font-medium">
                      {plan.tagline[language] || plan.tagline.mr}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-[#E7E2D6] dark:border-[#263B30]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-[#0B1E15] dark:text-white">
                        {price === 0 ? '₹०' : formatIndianCurrency(price)}
                      </span>
                      <span className="text-xs text-[#5A6E64] dark:text-[#9FB1A7] font-semibold">
                        {price === 0 ? '/ कायम मोफत' : '/ महिना'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#2E7D5B] dark:text-[#64D8A1] font-bold block mt-1">
                      {price === 0 ? '५,००० पक्षांपर्यंत मोफत' : '३० दिवसांची मोफत चाचणी समाविष्ट'}
                    </span>
                  </div>

                  {/* Limits & Features list */}
                  <ul className="space-y-3 mb-8 text-xs sm:text-sm text-[#1B2A24] dark:text-[#E0ECE6]">
                    {(plan.features[language] || plan.features.mr).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#2E7D5B] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  href="/enroll"
                  className={`w-full py-3.5 px-4 rounded-2xl text-center text-sm font-black transition-all flex items-center justify-center gap-2 min-h-[48px] ${
                    isPopular
                      ? 'bg-[#1F4D3A] text-white hover:bg-[#173A2C] shadow-md border-b-2 border-[#122A20]'
                      : 'bg-white dark:bg-[#1F2E26] text-[#1F4D3A] dark:text-white border border-[#E7E2D6] dark:border-[#263B30] hover:bg-gray-50 dark:hover:bg-[#263B30]'
                  }`}
                >
                  <span>{price === 0 ? 'मोफत सुरू करा (Start Free)' : t.startFreeTrial}</span>
                  <ArrowRight className="w-4 h-4 text-[#D9A441]" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
