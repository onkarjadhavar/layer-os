'use client';

import React from 'react';
import { Link } from '@/components/common/Link';
import { useI18n } from '@/lib/i18n/context';
import { SUBSCRIPTION_PLANS, PlanId } from '@/lib/billing/plans';
import { formatIndianCurrency } from '@/lib/calc';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export function PricingSection() {
  const { language, t } = useI18n();

  const planKeys: PlanId[] = ['starter', 'grower', 'enterprise'];

  return (
    <section className="py-14 sm:py-20 px-4 bg-[var(--color-surface)] dark:bg-[#14221C] border-b border-[var(--color-border)] dark:border-[#23372E] transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-main)] dark:text-white mb-3 tracking-tight">
            लहान फार्मपासून मोठ्या समूहापर्यंत सर्वांसाठी
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
            {t.pricingSubtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {planKeys.map(key => {
            const plan = SUBSCRIPTION_PLANS[key];
            const isPopular = plan.popular;
            const price = plan.priceINR.monthly;
            const maxBirds = plan.limits?.maxBirds || 5000;

            const ctaLabel =
              price === 0
                ? language === 'en'
                  ? 'Start Free 30-Day Trial'
                  : language === 'hi'
                  ? 'निःशुल्क ३०-दिन ट्रायल शुरू करें'
                  : 'मोफत ३० दिवस चाचणी सुरू करा'
                : language === 'en'
                ? 'Select This Plan'
                : language === 'hi'
                ? 'यह प्लान चुनें'
                : 'हा प्लॅन निवडा';

            return (
              <div
                key={key}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'bg-[var(--color-surface)] dark:bg-[#192B23] border-2 border-[var(--color-forest)] dark:border-[var(--color-sage)] shadow-md'
                    : 'bg-[var(--color-background)] dark:bg-[#0E1713] border border-[var(--color-border)] dark:border-[#23372E]'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-forest)] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-[var(--color-sage)]">
                    <Sparkles className="w-3 h-3 text-[var(--color-amber)]" />
                    <span>सर्वात लोकप्रिय (Most Popular)</span>
                  </div>
                )}

                <div>
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] dark:text-white">
                      {plan.name[language] || plan.name.mr}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] dark:text-[#9BAEA4] mt-1 font-medium">
                      {plan.tagline[language] || plan.tagline.mr}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6 pb-6 border-b border-[var(--color-border)] dark:border-[#23372E]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black tabular-nums text-[var(--color-text-main)] dark:text-white">
                        {price === 0 ? 'मोफत' : formatIndianCurrency(price)}
                      </span>
                      {price > 0 && (
                        <span className="text-xs text-[var(--color-text-muted)]">
                          / महिना
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--color-forest)] dark:text-[var(--color-sage)] font-semibold mt-1">
                      कमाल क्षमता: {maxBirds.toLocaleString('en-IN')} पक्षी
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8 text-xs sm:text-sm text-[var(--color-text-main)] dark:text-[#E0ECE6]">
                    {(plan.features[language] || plan.features.mr || []).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA */}
                <Link
                  id={`landing-pricing-cta-${key}`}
                  href={`/enroll?plan=${key}`}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                    isPopular
                      ? 'bg-[var(--color-forest)] hover:bg-[#143F2F] text-white shadow-xs'
                      : 'bg-[var(--color-surface-subtle)] dark:bg-[#14221C] hover:bg-[var(--color-border)] text-[var(--color-text-main)] dark:text-white border border-[var(--color-border)] dark:border-[#23372E]'
                  }`}
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default PricingSection;
