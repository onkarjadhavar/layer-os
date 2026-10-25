'use client';

import React from 'react';
import Head from 'next/head';
import { useI18n } from '@/lib/i18n/context';
import { LandingTopBar } from './LandingTopBar';
import { HeroSection } from './HeroSection';
import { WhatIsSection } from './WhatIsSection';
import { AudienceSection } from './AudienceSection';
import { InputsSection } from './InputsSection';
import { OutputsSection } from './OutputsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { SamplePreviewSection } from './SamplePreviewSection';
import { FeaturesGrid } from './FeaturesGrid';
import { TrustSection } from './TrustSection';
import { PricingSection } from './PricingSection';
import { FAQSection } from './FAQSection';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onTryDemo: () => void;
}

export function LandingPage({ onTryDemo }: LandingPageProps) {
  const { language, t } = useI18n();

  // JSON-LD Structured Data for Search Engines & DPDP / SaaS compliance
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LayerOS',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All (Progressive Web Application)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'AI-Powered Layer Poultry & Egg Business Management Web App for commercial layer farms in Maharashtra, India.',
    inLanguage: language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] dark:bg-[#0F1A15] text-[#1B2A24] dark:text-white transition-colors">
      <div className="hidden" aria-hidden="true">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </div>

      {/* 1. Header / TopBar */}
      <LandingTopBar onTryDemo={onTryDemo} />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection onTryDemo={onTryDemo} />

        {/* 3. What is LayerOS */}
        <WhatIsSection />

        {/* 4. Who It Is For */}
        <AudienceSection />

        {/* 5. What You Enter */}
        <InputsSection />

        {/* 6. What You Get */}
        <OutputsSection />

        {/* 7. How It Works (4 Steps) */}
        <HowItWorksSection />

        {/* 8. Sample Output Preview (Verified 30,000 birds Reference Day) */}
        <SamplePreviewSection />

        {/* 9. Core Features Grid */}
        <FeaturesGrid />

        {/* 10. Trust & Privacy */}
        <TrustSection />

        {/* 11. Pricing Teaser */}
        <PricingSection />

        {/* 12. Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* 13. Final CTA & Footer */}
      <LandingFooter />
    </div>
  );
}
