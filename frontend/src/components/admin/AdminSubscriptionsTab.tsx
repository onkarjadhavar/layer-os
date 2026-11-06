'use client';

import React from 'react';
import { AdminFarmSummary } from '@/lib/admin/types';
import {
  CreditCard,
  Calendar,
  Check,
  ShieldCheck,
  Sparkles,
  Building2,
  AlertCircle,
  IndianRupee,
} from 'lucide-react';

interface AdminSubscriptionsTabProps {
  farms: AdminFarmSummary[];
  onOpenExtendModal: (farm: AdminFarmSummary) => void;
  onSelectFarm: (farm: AdminFarmSummary) => void;
}

export function AdminSubscriptionsTab({
  farms,
  onOpenExtendModal,
  onSelectFarm,
}: AdminSubscriptionsTabProps) {
  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      nameMr: 'स्टार्टर प्लॅन',
      price: '₹0',
      period: '/ महिना',
      badge: 'मोफत चाचणी (Trial)',
      birds: '५,००० पक्षी कमाल क्षमता',
      features: ['१ शेड व्यवस्थापन', '१ युझर ॲक्सेस', 'दैनंदिन अंडी व खुराक नोंद', 'बेसिक नफा-तोटा अहवाल'],
      farmsCount: farms.filter((f) => f.planId === 'starter').length,
    },
    {
      id: 'grower',
      name: 'Grower Pro',
      nameMr: 'ग्रोव्हर प्रो',
      price: '₹999',
      period: '/ महिना (किंवा ₹9,990/वर्ष)',
      badge: 'सर्वाधिक लोकप्रिय (Popular)',
      badgeColor: 'bg-[var(--color-amber)] text-[var(--color-forest-deep)] font-black',
      birds: '३५,००० पक्षी कमाल क्षमता',
      features: [
        '४ शेड्स व्यवस्थापन',
        '५ कर्मचारी (Supervisor/Accountant)',
        'Gemini AI दैनिक शेती सल्लागार',
        'WhatsApp इनव्हॉइस व रिपोर्ट्स',
        'अंडी बाजारभाव अंदाज व ॲनालिटिक्स',
      ],
      farmsCount: farms.filter((f) => f.planId === 'grower' || f.planId === 'grower_pro').length,
      featured: true,
    },
    {
      id: 'enterprise',
      name: 'Commercial Enterprise',
      nameMr: 'कमर्शियल एंटरप्राइज',
      price: '₹2,499',
      period: '/ महिना (किंवा ₹24,990/वर्ष)',
      badge: 'अमर्यादित (Unlimited)',
      birds: 'अमर्यादित पक्षी क्षमता (Unlimited)',
      features: [
        'अमर्यादित शेड्स व मल्टि-फार्म्स',
        'अमर्यादित युझर्स व रोल्स',
        'DPDP 2023 ऑडिट कम्प्लायन्स',
        '२४/७ समर्पित व्हॉट्सॲप सपोर्ट',
        'कस्टम डेटा एक्सपोर्ट व बॅकअप',
      ],
      farmsCount: farms.filter((f) => f.planId === 'enterprise').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[var(--color-border)] dark:border-[#1A3024]">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white">
          Subscription Management
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mt-0.5">
          Manage commercial license tiers, monitor validity dates, and issue operational extensions.
        </p>
      </div>

      {/* Plan Tier Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between shadow-xs ${
              p.featured
                ? 'bg-[var(--color-forest)] text-white border-[var(--color-sage)]/40'
                : 'bg-[var(--color-surface)] dark:bg-[#132219] border-[var(--color-border)] dark:border-[#1A3024] text-[var(--color-text-main)] dark:text-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    p.badgeColor || (p.featured ? 'bg-white/20 text-white' : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]')
                  }`}
                >
                  {p.badge}
                </span>
                <span
                  className={`text-xs font-bold tabular-nums ${
                    p.featured ? 'text-[var(--color-sage-pale)]' : 'text-[var(--color-forest)] dark:text-[var(--color-sage)]'
                  }`}
                >
                  {p.farmsCount} Active Farms
                </span>
              </div>

              <h3 className="text-base font-black tracking-tight">{p.name}</h3>
              <p className={`text-xs ${p.featured ? 'text-[var(--color-sage-pale)]/80' : 'text-[var(--color-text-muted)]'}`}>
                {p.nameMr}
              </p>

              <div className="mt-3 mb-4 flex items-baseline gap-1">
                <span className="text-2xl font-black tabular-nums">{p.price}</span>
                <span className={`text-xs ${p.featured ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>
                  {p.period}
                </span>
              </div>

              <div className={`p-2.5 rounded-xl mb-4 text-xs font-bold ${p.featured ? 'bg-black/20 text-[var(--color-amber)]' : 'bg-[var(--color-surface-subtle)] dark:bg-[#0E1A13] text-[var(--color-forest)] dark:text-[var(--color-sage)]'}`}>
                {p.birds}
              </div>

              <ul className="space-y-2 text-xs">
                {p.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className={`w-3.5 h-3.5 shrink-0 ${p.featured ? 'text-[var(--color-amber)]' : 'text-emerald-600'}`} />
                    <span className={p.featured ? 'text-white/90' : 'text-[var(--color-text-main)] dark:text-white/90'}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Farm Subscription Status Registry */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] dark:bg-[#132219] border border-[var(--color-border)] dark:border-[#1A3024] shadow-xs">
        <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-main)] dark:text-white mb-1">
          Active Tenant Subscription Ledger
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-sage)]/70 mb-4">
          Monitor farm license validity and grant extensions directly.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] dark:border-[#1A3024] text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">
                <th className="py-2.5 px-3">Farm Name</th>
                <th className="py-2.5 px-3">Plan Tier</th>
                <th className="py-2.5 px-3">Start Date</th>
                <th className="py-2.5 px-3">Expiry Date</th>
                <th className="py-2.5 px-3">Days Remaining</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50 dark:divide-[#1A3024]/50 font-medium">
              {farms.map((farm) => {
                const endsDate = new Date(farm.planEndsAt);
                const daysRemaining = Math.ceil((endsDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={farm.id} className="hover:bg-[var(--color-surface-subtle)] dark:hover:bg-[#0E1A13]">
                    <td className="py-3 px-3 font-bold text-[var(--color-text-main)] dark:text-white">
                      <button
                        type="button"
                        onClick={() => onSelectFarm(farm)}
                        className="hover:underline cursor-pointer text-left"
                      >
                        {farm.name}
                      </button>
                    </td>
                    <td className="py-3 px-3 uppercase font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)]">
                      {farm.planId}
                    </td>
                    <td className="py-3 px-3 tabular-nums text-[var(--color-text-muted)]">
                      {new Date(farm.planStartedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-3 tabular-nums text-[var(--color-text-main)] dark:text-white font-semibold">
                      {endsDate.toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-3 tabular-nums font-bold">
                      <span className={daysRemaining <= 7 ? 'text-rose-600' : 'text-emerald-600'}>
                        {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenExtendModal(farm)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-[var(--color-forest)] dark:text-[var(--color-sage)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] cursor-pointer"
                      >
                        मुदत वाढवा (Extend)
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default AdminSubscriptionsTab;

