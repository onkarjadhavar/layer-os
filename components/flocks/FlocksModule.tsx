'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calc';
import {
  Layers,
  Calendar,
  Egg,
  Wheat,
  Scale,
  ShieldCheck,
  TrendingUp,
  FileText,
  AlertCircle,
} from 'lucide-react';

export function FlocksModule() {
  const { flock, sheds, todayRecord, dailyRecords } = useLayerOS();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'overview' | 'breed-standard' | 'batch-pl'>('overview');

  // Breed Standard Table (BV-300 Layer Management Guide approximate values)
  const breedStandards = [
    { week: 20, targetHd: 25.0, feedG: 85, eggWeightG: 48.0, livability: 99.2 },
    { week: 24, targetHd: 82.0, feedG: 104, eggWeightG: 53.5, livability: 98.8 },
    { week: 28, targetHd: 94.5, feedG: 110, eggWeightG: 56.5, livability: 98.2 },
    { week: 32, targetHd: 93.0, feedG: 111, eggWeightG: 58.0, livability: 97.6 },
    { week: 34, targetHd: 91.5, feedG: 110, eggWeightG: 58.5, livability: 97.2 }, // Current week
    { week: 40, targetHd: 88.0, feedG: 112, eggWeightG: 60.0, livability: 96.0 },
    { week: 50, targetHd: 83.0, feedG: 113, eggWeightG: 61.5, livability: 94.0 },
    { week: 65, targetHd: 76.0, feedG: 114, eggWeightG: 62.5, livability: 90.5 },
    { week: 72, targetHd: 70.0, feedG: 115, eggWeightG: 63.0, livability: 88.0 },
  ];

  // Cumulative numbers for the flock
  const initialChicks = flock.initialChickCount;
  const currentBirds = flock.currentBirdCount;
  const cumulativeMortality = initialChicks - currentBirds;
  const cumulativeMortalityPct = ((cumulativeMortality / initialChicks) * 100).toFixed(2);

  // Cumulative egg production from 90 days
  const totalEggs90Days = dailyRecords.reduce((sum, r) => sum + r.totalEggsCollected, 0);
  const totalFeedKg90Days = dailyRecords.reduce((sum, r) => sum + r.feedIssuedKg, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E2D6] dark:border-[#263B30] gap-3">
          <div>
            <h2 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>फ्लॉक्स व बॅच व्यवस्थापन (Flocks & Batches)</span>
            </h2>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-1">
              बॅच कोड: <strong className="text-[#0B1E15] dark:text-white font-black">{flock.batchCode}</strong> ({flock.breed}) • वय: {flock.ageWeeks} आठवडे
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
            सध्याची अवस्था: अंडी घालणे (Laying Phase)
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            बॅच तपशील (Flock Overview)
          </button>
          <button
            onClick={() => setActiveTab('breed-standard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'breed-standard'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            ब्रीड स्टँडर्ड चार्ट (BV300 Standards)
          </button>
          <button
            onClick={() => setActiveTab('batch-pl')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'batch-pl'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            बॅच नफा/तोटा (Batch P&L)
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card-layer p-4 bg-white dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">सुरुवाती पिल्ले</div>
              <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
                {formatIndianNumber(flock.initialChickCount)}
              </div>
              <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">₹{flock.chickCostPerBird} प्रति पिल्लू दर</div>
            </div>

            <div className="card-layer p-4 bg-white dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">सध्या जिवंत पक्षी</div>
              <div className="text-xl font-black text-[#1F4D3A] dark:text-[#3BA378] mt-1">
                {formatIndianNumber(flock.currentBirdCount)}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">
                जिवंत प्रमाण: {(100 - Number(cumulativeMortalityPct)).toFixed(1)}%
              </div>
            </div>

            <div className="card-layer p-4 bg-white dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">एकूण मृत्यू (Cumulative)</div>
              <div className="text-xl font-black text-red-600 mt-1">
                {formatIndianNumber(cumulativeMortality)}
              </div>
              <div className="text-[10px] text-red-600 font-bold">{cumulativeMortalityPct}% (मर्यादित ✓)</div>
            </div>

            <div className="card-layer p-4 bg-white dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">हॅचरी स्रोत (Source)</div>
              <div className="text-xs font-black text-[#0B1E15] dark:text-white mt-1 truncate">
                {flock.hatcherySource}
              </div>
              <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">प्लेसमेंट: {flock.placementDate}</div>
            </div>
          </div>

          {/* Shed Allocation */}
          <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
            <h3 className="text-sm font-black text-[#0B1E15] dark:text-white mb-3">
              शेडनिहाय पक्षी विभागणी (Shed Distribution)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sheds.map(shed => (
                <div key={shed.id} className="p-3.5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B1E15] dark:text-white">
                    <span>{shed.name}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">IoT सेन्सर्स ✓</span>
                  </div>
                  <div className="text-lg font-black text-[#0B1E15] dark:text-white mt-1">
                    {formatIndianNumber(shed.capacity)} <span className="text-xs font-normal text-[#2D4538] dark:text-[#CBDCD4]">पक्षी</span>
                  </div>
                  <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-0.5">
                    प्रकार: {shed.shedType === 'elevated_cage' ? 'उंच पिंजरा पद्धत' : shed.shedType}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. BREED STANDARDS TAB */}
      {activeTab === 'breed-standard' && (
        <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
            <div>
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                बीव्ही-३०० ब्रीड मानके (BV-300 Breeder Target Benchmarks)
              </h3>
              <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-0.5">
                वयाच्या आठवड्यानुसार उत्पादन, खुराक व अंड्याचे वजन
              </p>
            </div>
            <span className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-semibold">
              * आपल्या ब्रीडर मॅन्युअलनुसार पडताळणी करावी
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F3] dark:bg-[#1F3027] text-[#0B1E15] dark:text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">वय (आठवडे)</th>
                  <th className="p-3">टार्गेट HD% उत्पादन</th>
                  <th className="p-3">टार्गेट खुराक (g/पक्षी)</th>
                  <th className="p-3">अंड्याचे वजन (g)</th>
                  <th className="p-3">अपेक्षित जिवंत प्रमाण</th>
                  <th className="p-3">सध्याची स्थिती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-[#0B1E15] dark:text-white">
                {breedStandards.map(b => {
                  const isCurrent = b.week === flock.ageWeeks;
                  return (
                    <tr
                      key={b.week}
                      className={isCurrent ? 'bg-[#EAF3EF] dark:bg-[#182B22] font-black' : ''}
                    >
                      <td className="p-3 font-semibold">{b.week} आठवडे</td>
                      <td className="p-3 text-[#1F4D3A] dark:text-[#3BA378] font-black">{b.targetHd}%</td>
                      <td className="p-3 font-medium">{b.feedG} ग्रॅम</td>
                      <td className="p-3 font-medium">{b.eggWeightG} g</td>
                      <td className="p-3 text-emerald-600 font-bold">{b.livability}%</td>
                      <td className="p-3">
                        {isCurrent ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-[#1F4D3A] text-white">
                            चालू आठवडा (Current)
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. BATCH P&L TAB */}
      {activeTab === 'batch-pl' && (
        <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4">
          <div className="pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
            <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
              बॅच {flock.batchCode} संपूर्ण नफा/तोटा (Batch Cumulative P&L)
            </h3>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-0.5">
              मागील ९० दिवसांचा प्रत्यक्ष महसूल आणि ओव्हरहेड्स वाटप
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/30">
              <div className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">९० दिवसांचे एकूण अंडी उत्पादन</div>
              <div className="text-xl font-black text-[#1F4D3A] dark:text-[#3BA378] mt-1">
                {formatIndianNumber(totalEggs90Days)} अंडी
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCF6E9] dark:bg-[#2E2413] border border-[#D9A441]/40">
              <div className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">वापरलेला एकूण खुराक</div>
              <div className="text-xl font-black text-[#D9A441] mt-1">
                {formatIndianNumber(Math.round(totalFeedKg90Days))} kg
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300">
              <div className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">संचित नफा (Cumulative Profit)</div>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                {formatIndianCurrency(1792800)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
