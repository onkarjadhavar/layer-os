'use client';

import React, { useState, useRef } from 'react';
import { Link } from '@/components/common/Link';
import { useI18n } from '@/lib/i18n/context';
import { SUBSCRIPTION_PLANS, PlanId } from '@/lib/billing/plans';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { TimelineContent } from '@/components/ui/timeline-animation';
import { VerticalCutReveal } from '@/components/ui/vertical-cut-reveal';
import { cn } from '@/lib/utils';
import NumberFlow from '@number-flow/react';
import { motion } from 'framer-motion';
import { CheckCheck, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export function PricingSection() {
  const { language, t } = useI18n();
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const planKeys: PlanId[] = ['starter', 'grower', 'enterprise'];

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
    hidden: {
      filter: 'blur(6px)',
      y: -15,
      opacity: 0,
    },
  };

  return (
    <section
      ref={pricingRef}
      className="py-16 sm:py-24 px-4 bg-[var(--color-surface)] dark:bg-[#14221C] border-b border-[var(--color-border)] dark:border-[#23372E] transition-colors relative"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <TimelineContent
            as="div"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] bg-[var(--color-sage-pale)] dark:bg-[#1A3024] border border-[var(--color-sage)]/40 mb-4"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.pricingBadge || '३० दिवस मोफत चाचणी • No Credit Card Required'}</span>
          </TimelineContent>

          <h2 className="text-3xl sm:text-5xl font-black text-[var(--color-text-main)] dark:text-white mb-4 tracking-tight leading-[120%]">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.1}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-center"
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 32,
                delay: 0,
              }}
            >
              {t.pricingTitle || 'Simple & Transparent Pricing'}
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-sm sm:text-base text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed max-w-2xl mx-auto"
          >
            {t.pricingSubtitle ||
              'Free trial available on all tiers. No credit card or hidden charges.'}
          </TimelineContent>

          {/* Monthly / Yearly Switcher */}
          <TimelineContent
            as="div"
            animationNum={2}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="mt-8 flex justify-center"
          >
            <div
              role="radiogroup"
              aria-label="Billing cycle"
              className="relative z-10 mx-auto flex w-fit rounded-full bg-[var(--color-surface-subtle)] dark:bg-[#0E1713] border border-[var(--color-border)] dark:border-[#23372E] p-1 shadow-xs"
            >
              <button
                type="button"
                role="radio"
                aria-checked={!isYearly}
                onClick={() => setIsYearly(false)}
                className={cn(
                  'relative z-10 w-fit sm:h-11 h-9 cursor-pointer rounded-full sm:px-6 px-4 py-1.5 text-xs sm:text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)]',
                  !isYearly
                    ? 'text-[var(--color-text-main)] dark:text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] dark:hover:text-white'
                )}
              >
                {!isYearly && (
                  <motion.span
                    layoutId="pricing-switch-pill"
                    className="absolute inset-0 rounded-full bg-[var(--color-surface)] dark:bg-[#1A2E24] shadow-xs border border-[var(--color-border)] dark:border-[#2C4A3A]"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{t.billingMonthly || 'Monthly'}</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={isYearly}
                onClick={() => setIsYearly(true)}
                className={cn(
                  'relative z-10 w-fit cursor-pointer sm:h-11 h-9 flex-shrink-0 rounded-full sm:px-6 px-4 py-1.5 text-xs sm:text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)]',
                  isYearly
                    ? 'text-[var(--color-text-main)] dark:text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] dark:hover:text-white'
                )}
              >
                {isYearly && (
                  <motion.span
                    layoutId="pricing-switch-pill"
                    className="absolute inset-0 rounded-full bg-[var(--color-surface)] dark:bg-[#1A2E24] shadow-xs border border-[var(--color-border)] dark:border-[#2C4A3A]"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span>{t.billingYearly || 'Yearly'}</span>
                  <span className="rounded-full bg-[var(--color-sage-pale)] dark:bg-[#143022] text-[var(--color-forest)] dark:text-[var(--color-sage)] px-2 py-0.5 text-[10px] sm:text-xs font-bold border border-[var(--color-sage)]/30">
                    {t.billingSaveYearly || 'Save ~17%'}
                  </span>
                </span>
              </button>
            </div>
          </TimelineContent>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {planKeys.map((key, index) => {
            const plan = SUBSCRIPTION_PLANS[key];
            const isPopular = Boolean(plan.popular);
            const price = isYearly ? plan.priceINR.yearly : plan.priceINR.monthly;
            const maxBirds = plan.limits?.maxBirds || 5000;

            const ctaLabel =
              price === 0
                ? t.startFreeTrial || 'Start Free 30-Day Trial'
                : t.selectPlan || 'Select This Plan';

            return (
              <TimelineContent
                key={key}
                as="div"
                animationNum={index + 3}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="flex"
              >
                <Card
                  className={cn(
                    'relative flex flex-col justify-between w-full p-6 sm:p-8 rounded-3xl transition-all duration-300',
                    isPopular
                      ? 'bg-[var(--color-surface)] dark:bg-[#172A21] border-2 border-[var(--color-forest)] dark:border-[var(--color-sage)] shadow-xl md:-translate-y-2'
                      : 'bg-[var(--color-surface-subtle)] dark:bg-[#0E1713] border border-[var(--color-border)] dark:border-[#23372E] shadow-sm hover:shadow-md'
                  )}
                >
                  {/* Top Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--color-forest)] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-[var(--color-sage)]">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--color-amber)]" />
                      <span>{t.mostPopular || 'Most Popular'}</span>
                    </div>
                  )}

                  <CardContent className="p-0 flex-1 flex flex-col">
                    {/* Header: Title & Tagline */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-black text-[var(--color-text-main)] dark:text-white">
                        {plan.name[language] || plan.name.mr}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] dark:text-[#9BAEA4] mt-1.5 min-h-[36px] line-clamp-2">
                        {plan.tagline[language] || plan.tagline.mr}
                      </p>
                    </div>

                    {/* Price Block with Smooth NumberFlow */}
                    <div className="py-4 border-y border-[var(--color-border)] dark:border-[#23372E] my-2">
                      <div className="flex items-baseline gap-1">
                        {price === 0 ? (
                          <span className="text-3xl sm:text-4xl font-black text-[var(--color-text-main)] dark:text-white">
                            {t.freePrice || 'मोफत'}
                          </span>
                        ) : (
                          <div className="flex items-baseline text-[var(--color-text-main)] dark:text-white">
                            <span className="text-3xl sm:text-4xl font-black">₹</span>
                            <NumberFlow
                              value={price}
                              format={{ maximumFractionDigits: 0 }}
                              className="text-3xl sm:text-4xl font-black tabular-nums"
                            />
                            <span className="text-xs sm:text-sm font-semibold text-[var(--color-text-muted)] dark:text-[#9BAEA4] ml-1.5">
                              {isYearly ? t.perYear || '/ year' : t.perMonth || '/ month'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Flock Capacity Metric */}
                      <div className="mt-2.5">
                        <span className="inline-flex items-center text-[11px] sm:text-xs font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] bg-[var(--color-sage-pale)] dark:bg-[#142B20] px-2.5 py-1 rounded-lg border border-[var(--color-sage)]/25">
                          {t.maxCapacity || 'कमाल क्षमता'}:{' '}
                          {maxBirds === Number.POSITIVE_INFINITY
                            ? t.unlimited || 'अमर्यादित'
                            : `${maxBirds.toLocaleString('en-IN')} ${t.birdsUnit || 'पक्षी'}`}
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="pt-4 flex-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[#88A395] mb-3">
                        {language === 'en'
                          ? 'Included Features'
                          : language === 'hi'
                          ? 'शामिल विशेषताएं'
                          : 'समाविष्ट वैशिष्ट्ये'}
                      </div>
                      <ul className="space-y-3 mb-6 text-xs sm:text-sm text-[var(--color-text-main)] dark:text-[#E0ECE6]">
                        {(plan.features[language] || plan.features.mr || []).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5">
                            <span
                              className={cn(
                                'h-5 w-5 rounded-full grid place-content-center shrink-0 mt-0.5',
                                isPopular
                                  ? 'bg-[var(--color-forest)] text-white dark:bg-[var(--color-sage)] dark:text-[#102B1D]'
                                  : 'bg-[var(--color-sage-pale)] text-[var(--color-forest)] dark:bg-[#142B20] dark:text-[var(--color-sage)]'
                              )}
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                            </span>
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  {/* Card CTA Footer */}
                  <CardFooter className="p-0 pt-4">
                    <Link
                      id={`landing-pricing-cta-${key}`}
                      href={`/enroll?plan=${key}&cycle=${isYearly ? 'yearly' : 'monthly'}`}
                      className={cn(
                        'w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[46px] group shadow-xs',
                        isPopular
                          ? 'bg-[var(--color-forest)] hover:bg-[#143F2F] text-white shadow-md hover:shadow-lg'
                          : 'bg-[var(--color-surface)] dark:bg-[#14221C] hover:bg-[var(--color-surface-subtle)] dark:hover:bg-[#1A2E24] text-[var(--color-text-main)] dark:text-white border border-[var(--color-border)] dark:border-[#23372E]'
                      )}
                    >
                      <span>{ctaLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardFooter>
                </Card>
              </TimelineContent>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
