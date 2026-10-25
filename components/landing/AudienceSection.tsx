'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { UserCheck, Shield, FileSpreadsheet, Stethoscope } from 'lucide-react';

export function AudienceSection() {
  const { t } = useI18n();

  const audiences = [
    {
      title: t.whoOwner,
      desc: t.whoOwnerDesc,
      icon: UserCheck,
      badge: 'पूर्ण अधिकार (Full Access)',
      color: 'bg-emerald-500/10 text-[#1F4D3A] dark:text-[#64D8A1] border-emerald-500/30',
    },
    {
      title: t.whoSupervisor,
      desc: t.whoSupervisorDesc,
      icon: Shield,
      badge: 'दैनिक नोंदणी (Entry Only)',
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
    },
    {
      title: t.whoAccountant,
      desc: t.whoAccountantDesc,
      icon: FileSpreadsheet,
      badge: 'बिलिंग व ताळेबंद (Billing)',
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
    },
    {
      title: t.whoVet,
      desc: t.whoVetDesc,
      icon: Stethoscope,
      badge: 'आरोग्य अहवाल (Read Only)',
      color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
    },
  ];

  return (
    <section className="py-12 sm:py-20 px-4 bg-[#FAF8F3] dark:bg-[#0F1A15] transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#1F4D3A]/10 text-[#1F4D3A] dark:text-[#64D8A1]">
            {t.whoIsTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B1E15] dark:text-white mt-3 mb-4 tracking-tight">
            फार्म मालक, सुपरवायझर व डॉक्टरांसाठी स्वतंत्र भूमिका
          </h2>
          <p className="text-sm sm:text-base text-[#3D5248] dark:text-[#CBDCD4]">
            प्रत्येकासाठी आवश्यक तेवढाच सुरक्षित प्रवेश. मालकाचा नफा आणि गोपनीय आर्थिक आकडे इतरांना कधीही दिसत नाहीत.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#16241D] p-5 sm:p-6 rounded-3xl border border-[#E7E2D6] dark:border-[#263B30] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${aud.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[#5A6E64] dark:text-[#A3B899]">
                    {aud.badge}
                  </span>
                  <h3 className="text-base font-black text-[#0B1E15] dark:text-white mt-2 mb-2">
                    {aud.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A6E64] dark:text-[#9FB1A7] leading-relaxed">
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
