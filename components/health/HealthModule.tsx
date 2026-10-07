'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import {
  HeartPulse,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Stethoscope,
  Pill,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export function HealthModule() {
  const { vaccinations, toggleVaccinationStatus, flock } = useLayerOS();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'vaccines' | 'medicines' | 'mortality-analysis'>('vaccines');

  const medicineStock = [
    { name: 'Vimeral (Vitamin A, D3, E, B12)', batch: 'VIM-902', expiry: '2027-04', stock: '५ बाटल्या', withdrawalDays: 0 },
    { name: 'Electral / ORS Powder (Heat Stress)', batch: 'ORS-441', expiry: '2026-12', stock: '१५ किलो', withdrawalDays: 0 },
    { name: 'ImmupPlus Herbal Supplement', batch: 'IMM-120', expiry: '2027-01', stock: '८ लिटर', withdrawalDays: 0 },
    { name: 'Enrofloxacin 10% (Respiratory care)', batch: 'ENR-771', expiry: '2026-11', stock: '२ बाटल्या', withdrawalDays: 7 },
  ];

  const mortalityCauses = [
    { cause: 'उष्माघात व हवामान (Heat Stress)', count: 45, pct: '48%' },
    { cause: 'किरकोळ अशक्तपणा व वय (General Debility)', count: 30, pct: '32%' },
    { cause: 'श्वसन विकार (Respiratory/Dust)', count: 12, pct: '13%' },
    { cause: 'इतर / नैसर्गिक (Accidental/Other)', count: 7, pct: '7%' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E2D6] dark:border-[#263B30] gap-3">
          <div>
            <h2 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-rose-600" />
              <span>लसीकरण व आरोग्य व्यवस्थापन (Vaccination & Health)</span>
            </h2>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-1">
              बॅच {flock.batchCode} ({flock.ageWeeks} आठवडे) • लसीकरण वेळापत्रक, औषध साठा व मृत्यू कारण विश्लेषण
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 border border-amber-300 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>कोणतेही औषध देण्यापूर्वी पशुवैद्यकीय डॉक्टरांचा (Vet) सल्ला घ्यावा.</span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('vaccines')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'vaccines'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            लसीकरण वेळापत्रक (Vaccine Calendar)
          </button>
          <button
            onClick={() => setActiveTab('medicines')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'medicines'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            औषध साठा व एक्स्पायरी (Medicine Stock)
          </button>
          <button
            onClick={() => setActiveTab('mortality-analysis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'mortality-analysis'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            मृत्यू कारण विश्लेषण (Mortality Causes)
          </button>
        </div>
      </div>

      {/* 1. VACCINE CALENDAR TAB */}
      {activeTab === 'vaccines' && (
        <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4">
          <div className="pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
            <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
              बीव्ही-३०० लेयर लस वेळापत्रक (BV300 Vaccine Programme)
            </h3>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-0.5">
              वय आठवड्यानुसार लस पूर्ण झाली असल्यास टिक करा
            </p>
          </div>

          <div className="space-y-3">
            {vaccinations.map(v => (
              <div
                key={v.id}
                className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] flex items-center justify-between gap-3 hover:border-[#1F4D3A] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleVaccinationStatus(v.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      v.status === 'done'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-gray-400 hover:border-[#1F4D3A]'
                    }`}
                  >
                    {v.status === 'done' && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-bold ${v.status === 'done' ? 'line-through text-gray-500' : 'text-[#0B1E15] dark:text-white'}`}>
                        {v.vaccineName}
                      </h4>
                      {v.isImportant && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          अति महत्त्वाचे
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-0.5">
                      आजार: {v.diseaseTargeted} • वयाचे आठवडे: {v.dueAgeWeeks} • नियोजित दिनांक: {v.dueDate}
                    </div>
                  </div>
                </div>

                <div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    v.status === 'done'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {v.status === 'done' ? 'पूर्ण झाले ✓' : 'प्रलंबित'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MEDICINES TAB */}
      {activeTab === 'medicines' && (
        <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4">
          <div className="pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
            <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
              फार्मवरील औषध साठा व मुदत संपण्याची तारीख (Stock & Expiry Tracking)
            </h3>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-0.5">
              अंड्यांमध्ये औषधांचे अवशेष (Withdrawal period) टाळण्यासाठी खबरदारी घ्या
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {medicineStock.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">बॅच: {m.batch}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                      एक्स्पायरी: {m.expiry}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-[#0B1E15] dark:text-white mt-1.5">
                    {m.name}
                  </h4>
                  <div className="text-xs text-[#2D4538] dark:text-[#CBDCD4] mt-1 font-medium">
                    शिल्लक साठा: <strong className="text-[#0B1E15] dark:text-white font-black">{m.stock}</strong>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-[11px]">
                  <span className="text-[#2D4538] dark:text-[#CBDCD4] font-medium">विथड्रॉल कालावधी:</span>
                  <span className={m.withdrawalDays > 0 ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                    {m.withdrawalDays > 0 ? `${m.withdrawalDays} दिवस (अंडी खाऊ नयेत)` : '० दिवस (सुरक्षित)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MORTALITY ANALYSIS TAB */}
      {activeTab === 'mortality-analysis' && (
        <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4">
          <div className="pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
            <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
              मागील ३० दिवसांचे मृत्यू कारण विश्लेषण (Mortality Root Causes)
            </h3>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-0.5">
              कोणत्या घटकामुळे सर्वाधिक नुकसान झाले याचा शोध
            </p>
          </div>

          <div className="space-y-3">
            {mortalityCauses.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30]">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#0B1E15] dark:text-white font-bold">{item.cause}</span>
                  <span className="text-red-600 font-black">{item.count} पक्षी ({item.pct})</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: item.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
