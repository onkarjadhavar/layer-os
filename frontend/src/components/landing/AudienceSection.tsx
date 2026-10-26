'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { UserCheck, Shield, FileSpreadsheet, Stethoscope, Lock } from 'lucide-react';

export function AudienceSection() {
  const { t } = useI18n();

  const audiences = [
    {
      title: t.whoOwner,
      desc: t.whoOwnerDesc,
      icon: UserCheck,
      badge: 'पूर्ण अधिकार (Full Access)',
      iconBg: 'bg-[var(--color-sage-pale)] text-[var(--color-forest)] dark:bg-[#1A2E24] dark:text-[var(--color-sage)]',
      borderTone: 'border-[var(--color-forest)]/30',
    },
    {
      title: t.whoSupervisor,
      desc: t.whoSupervisorDesc,
      icon: Shield,
      badge: 'दैनिक नोंदणी (Entry Only)',
      iconBg: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] dark:bg-[#192B23] dark:text-white',
      borderTone: 'border-[var(--color-border)]',
    },
    {
      title: t.whoAccountant,
      desc: t.whoAccountantDesc,
      icon: FileSpreadsheet,
      badge: 'बिलिंग व ताळेबंद (Billing & Ledger)',
      iconBg: 'bg-[var(--color-amber-soft)] text-[var(--color-walnut)] dark:bg-[#2B2113] dark:text-[var(--color-amber)]',
      borderTone: 'border-[var(--color-amber)]/30',
    },
    {
      title: t.whoVet,
      desc: t.whoVetDesc,
      icon: Stethoscope,
      badge: 'आरोग्य अहवाल (Read Only)',
      iconBg: 'bg-[var(--color-surface-subtle)] text-[var(--color-walnut)] dark:bg-[#192B23] dark:text-[var(--color-sage)]',
      borderTone: 'border-[var(--color-border)]',
    },
  ];

  return (
    <section className="py-14 sm:py-20 px-4 bg-[var(--color-background)] dark:bg-[#0E1713] transition-colors border-b border-[var(--color-border)] dark:border-[#23372E]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-main)] dark:text-white mb-3 tracking-tight">
            फार्म मालक, सुपरवायझर व डॉक्टरांसाठी स्वतंत्र भूमिका
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
            प्रत्येकासाठी आवश्यक तेवढाच सुरक्षित प्रवेश. मालकाचा निव्वळ नफा आणि बँक खात्याची गोपनीय माहिती कर्मचाऱ्यांना कधीही दिसत नाही.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div
                key={idx}
                className={`bg-[var(--color-surface)] dark:bg-[#14221C] p-5 sm:p-6 rounded-2xl border ${aud.borderTone} dark:border-[#23372E] shadow-sm flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${aud.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[var(--color-background)] dark:bg-[#0E1713] text-[var(--color-text-muted)] dark:text-[#9BAEA4] border border-[var(--color-border)] dark:border-[#23372E]">
                    {aud.badge}
                  </span>
                  <h3 className="text-base font-bold text-[var(--color-text-main)] dark:text-white mt-3 mb-2">
                    {aud.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] dark:text-[#9BAEA4] leading-relaxed">
                    {aud.desc}
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
export default AudienceSection;
