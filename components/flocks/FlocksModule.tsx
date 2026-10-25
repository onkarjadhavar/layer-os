'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calc';
import { Flock, Shed } from '@/lib/store/seedData';
import {
  Layers,
  Calendar,
  Wheat,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Warehouse,
  ChevronRight,
  TrendingUp,
  Tag,
} from 'lucide-react';

const PHASE_LABELS: Record<Flock['currentPhase'], { mr: string; en: string; hi: string; color: string }> = {
  brooding: { mr: 'ब्रूडिंग (०-६ आठवडे)', en: 'Brooding (0-6 wks)', hi: 'ब्रूडिंग (0-6 सप्ताह)', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  growing: { mr: 'ग्रोवर (७-१७ आठवडे)', en: 'Growing (7-17 wks)', hi: 'ग्रोवर (7-17 सप्ताह)', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  pre_lay: { mr: 'प्री-ले (१८-२० आठवडे)', en: 'Pre-Lay (18-20 wks)', hi: 'प्री-ले (18-20 सप्ताह)', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  laying: { mr: 'अंडी उत्पादन (Laying)', en: 'Peak Laying (21-60 wks)', hi: 'अंडा उत्पादन (Laying)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  post_peak: { mr: 'पोस्ट-पीक (६१-७५ आठवडे)', en: 'Post-Peak (61-75 wks)', hi: 'पोस्ट-पीक (61-75 सप्ताह)', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  cull_ready: { mr: 'कलिंग तयार / समाप्त (Cull Ready)', en: 'Cull Ready / Closed', hi: 'कलिंग तैयार / बंद (Cull Ready)', color: 'bg-gray-100 text-gray-900 border-gray-300' },
};

export function FlocksModule() {
  const {
    flock,
    flocks,
    switchFlock,
    addFlock,
    updateFlockPhase,
    closeFlockBatch,
    sheds,
    addShed,
    farm,
    dailyRecords,
  } = useLayerOS();
  const { language, t } = useI18n();

  const [activeTab, setActiveTab] = useState<'overview' | 'breed-standard' | 'batch-pl'>('overview');

  // Modals state
  const [showNewFlockModal, setShowNewFlockModal] = useState(false);
  const [showNewShedModal, setShowNewShedModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Flock Form State
  const [batchCode, setBatchCode] = useState('');
  const [shedId, setShedId] = useState(sheds[0]?.id || '');
  const [breed, setBreed] = useState('BV300 Layer');
  const [hatchery, setHatchery] = useState("Venkateshwara Hatcheries (Venky's)");
  const [placementDate, setPlacementDate] = useState(new Date().toISOString().split('T')[0]);
  const [initialChicks, setInitialChicks] = useState<number>(10000);
  const [chickCost, setChickCost] = useState<number>(44.00);
  const [ageWeeks, setAgeWeeks] = useState<number>(1);
  const [initialPhase, setInitialPhase] = useState<Flock['currentPhase']>('brooding');

  // New Shed Form State
  const [shedNumber, setShedNumber] = useState(`S-${sheds.length + 1}`);
  const [shedName, setShedName] = useState(`शेड ${sheds.length + 1}`);
  const [shedCapacity, setShedCapacity] = useState<number>(10000);
  const [shedType, setShedType] = useState<Shed['shedType']>('elevated_cage');
  const [hasSensors, setHasSensors] = useState<boolean>(true);

  // Breed Standard Table (BV-300 Layer Management Guide approximate values)
  const breedStandards = [
    { week: 20, targetHd: 25.0, feedG: 85, eggWeightG: 48.0, livability: 99.2 },
    { week: 24, targetHd: 82.0, feedG: 104, eggWeightG: 53.5, livability: 98.8 },
    { week: 28, targetHd: 94.5, feedG: 110, eggWeightG: 56.5, livability: 98.2 },
    { week: 32, targetHd: 93.0, feedG: 111, eggWeightG: 58.0, livability: 97.6 },
    { week: 34, targetHd: 91.5, feedG: 110, eggWeightG: 58.5, livability: 97.2 },
    { week: 40, targetHd: 88.0, feedG: 112, eggWeightG: 60.0, livability: 96.0 },
    { week: 50, targetHd: 83.0, feedG: 113, eggWeightG: 61.5, livability: 94.0 },
    { week: 65, targetHd: 76.0, feedG: 114, eggWeightG: 62.5, livability: 90.5 },
    { week: 72, targetHd: 70.0, feedG: 115, eggWeightG: 63.0, livability: 88.0 },
  ];

  // Cumulative numbers for active flock
  const initialChicksCount = flock.initialChickCount;
  const currentBirds = flock.currentBirdCount;
  const cumulativeMortality = initialChicksCount - currentBirds;
  const cumulativeMortalityPct = ((cumulativeMortality / initialChicksCount) * 100).toFixed(2);

  // Cumulative egg production from 90 days
  const totalEggs90Days = dailyRecords.reduce((sum, r) => sum + r.totalEggsCollected, 0);
  const totalFeedKg90Days = dailyRecords.reduce((sum, r) => sum + r.feedIssuedKg, 0);

  const handleCreateFlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCode.trim()) return;
    setIsSubmitting(true);
    try {
      await addFlock({
        farmId: farm.id,
        shedId,
        batchCode: batchCode.trim(),
        breed,
        hatcherySource: hatchery,
        placementDate,
        initialChickCount: initialChicks,
        chickCostPerBird: chickCost,
        currentBirdCount: initialChicks,
        ageWeeks,
        currentPhase: initialPhase,
      });
      setShowNewFlockModal(false);
      setBatchCode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateShed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shedName.trim()) return;
    setIsSubmitting(true);
    try {
      await addShed({
        farmId: farm.id,
        shedNumber,
        name: shedName.trim(),
        capacity: shedCapacity,
        shedType,
        hasSensors,
      });
      setShowNewShedModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhaseChange = async (phase: Flock['currentPhase']) => {
    await updateFlockPhase(flock.id, phase);
  };

  const handleConfirmClose = async () => {
    setIsSubmitting(true);
    try {
      await closeFlockBatch(flock.id);
      setShowCloseModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Flock Switcher Strip */}
      <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E2D6] dark:border-[#263B30] gap-3">
          <div>
            <h2 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>{t.flocksAndBatches}</span>
            </h2>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-1">
              {t.activeBatch}: <strong className="text-[#0B1E15] dark:text-white font-black">{flock.batchCode}</strong> ({flock.breed}) • {flock.ageWeeks} {t.weeks}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowNewFlockModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F4D3A] hover:bg-[#16382A] text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.newBatch}</span>
            </button>
            <button
              onClick={() => setShowNewShedModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1F3027] hover:bg-[#F2ECE1] text-[#1F4D3A] dark:text-[#42BF87] border border-[#DCD3C3] dark:border-[#263B30] text-xs font-bold transition-colors"
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span>{t.newShed}</span>
            </button>
          </div>
        </div>

        {/* Flock Selector Pills if multiple flocks exist */}
        <div className="flex items-center gap-2 pt-3 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-[#55695F] dark:text-[#A1B3AA] whitespace-nowrap">{t.selectBatch}:</span>
          {flocks.map(f => {
            const isSelected = f.id === flock.id;
            return (
              <button
                key={f.id}
                onClick={() => switchFlock(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1F4D3A] text-white shadow-sm'
                    : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] border border-[#E7E2D6] dark:border-[#263B30]'
                }`}
              >
                <span>{f.batchCode}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  {f.ageWeeks}w
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 border-t border-[#E7E2D6] dark:border-[#263B30] pt-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            {t.batchOverview}
          </button>
          <button
            onClick={() => setActiveTab('breed-standard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'breed-standard'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            {t.breedStandardChart}
          </button>
          <button
            onClick={() => setActiveTab('batch-pl')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'batch-pl'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            {t.batchPLTab}
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Phase Progression Stepper */}
          <div className="card-layer p-4 bg-white dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E7E2D6] dark:border-[#263B30] gap-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#1F4D3A] dark:text-[#42BF87]" />
                <span className="text-xs font-black text-[#0B1E15] dark:text-white uppercase tracking-wider">
                  {t.phaseChange}: {PHASE_LABELS[flock.currentPhase][language] || PHASE_LABELS[flock.currentPhase].mr}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={flock.currentPhase}
                  onChange={e => handlePhaseChange(e.target.value as Flock['currentPhase'])}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-[#0B1E15] dark:text-white"
                >
                  <option value="brooding">{PHASE_LABELS.brooding[language] || PHASE_LABELS.brooding.mr}</option>
                  <option value="growing">{PHASE_LABELS.growing[language] || PHASE_LABELS.growing.mr}</option>
                  <option value="pre_lay">{PHASE_LABELS.pre_lay[language] || PHASE_LABELS.pre_lay.mr}</option>
                  <option value="laying">{PHASE_LABELS.laying[language] || PHASE_LABELS.laying.mr}</option>
                  <option value="post_peak">{PHASE_LABELS.post_peak[language] || PHASE_LABELS.post_peak.mr}</option>
                  <option value="cull_ready">{PHASE_LABELS.cull_ready[language] || PHASE_LABELS.cull_ready.mr}</option>
                </select>
                {flock.currentPhase !== 'cull_ready' && (
                  <button
                    onClick={() => setShowCloseModal(true)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-950 dark:text-red-300 transition-colors"
                  >
                    {t.cullBatch}
                  </button>
                )}
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-3 text-center">
              {(Object.keys(PHASE_LABELS) as Array<Flock['currentPhase']>).map(p => {
                const isCurrent = p === flock.currentPhase;
                const label = PHASE_LABELS[p][language] || PHASE_LABELS[p].mr;
                return (
                  <div
                    key={p}
                    className={`p-2 rounded-xl border text-[11px] font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#1F4D3A] text-white border-[#1F4D3A] shadow-sm'
                        : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#55695F] dark:text-[#A1B3AA] border-transparent'
                    }`}
                  >
                    <div>{p.toUpperCase()}</div>
                    <div className="text-[9px] font-normal truncate mt-0.5">{label.split(' ')[0]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card-layer p-4 bg-white dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">{t.initialChicks}</div>
              <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
                {formatIndianNumber(flock.initialChickCount)}
              </div>
              <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">₹{flock.chickCostPerBird} / {t.birds}</div>
            </div>

            <div className="card-layer p-4 bg-white dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">{t.activeBirds}</div>
              <div className="text-xl font-black text-[#1F4D3A] dark:text-[#3BA378] mt-1">
                {formatIndianNumber(flock.currentBirdCount)}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">
                {t.livability}: {(100 - Number(cumulativeMortalityPct)).toFixed(1)}%
              </div>
            </div>

            <div className="card-layer p-4 bg-white dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">{t.cumulativeMortality}</div>
              <div className="text-xl font-black text-red-600 mt-1">
                {formatIndianNumber(cumulativeMortality)}
              </div>
              <div className="text-[10px] text-red-600 font-bold">{cumulativeMortalityPct}% ({t.withinDailyLimit})</div>
            </div>

            <div className="card-layer p-4 bg-white dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">{t.hatcherySource}</div>
              <div className="text-xs font-black text-[#0B1E15] dark:text-white mt-1 truncate">
                {flock.hatcherySource}
              </div>
              <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">{t.placementDate}: {flock.placementDate}</div>
            </div>
          </div>

          {/* Shed Allocation */}
          <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                {t.shedDistribution}
              </h3>
              <span className="text-xs font-bold text-[#55695F] dark:text-[#A1B3AA]">
                {sheds.length} {t.newShed}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sheds.map(shed => (
                <div key={shed.id} className="p-3.5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B1E15] dark:text-white">
                    <span>{shed.name}</span>
                    {shed.hasSensors && <span className="text-[10px] text-emerald-600 font-bold">{t.sensorsActive}</span>}
                  </div>
                  <div className="text-lg font-black text-[#0B1E15] dark:text-white mt-1">
                    {formatIndianNumber(shed.capacity)} <span className="text-xs font-normal text-[#2D4538] dark:text-[#CBDCD4]">{t.birdCapacity}</span>
                  </div>
                  <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-0.5">
                    {t.cageMethod}
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

      {/* NEW FLOCK MODAL */}
      {showNewFlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#16241D] rounded-3xl shadow-2xl border border-[#E7E2D6] dark:border-[#263B30] p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
              <h3 className="text-base font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#1F4D3A] dark:text-[#42BF87]" />
                <span>नवीन बॅच नोंदणी (New Flock Batch)</span>
              </h3>
              <button onClick={() => setShowNewFlockModal(false)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1F3027]">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateFlock} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">बॅच कोड (Batch Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. BATCH-2026-B2"
                    value={batchCode}
                    onChange={e => setBatchCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">शेड निवडा (Shed) *</label>
                  <select
                    value={shedId}
                    onChange={e => setShedId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                  >
                    {sheds.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.capacity} क्षमता)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">ब्रीड (Breed) *</label>
                  <select
                    value={breed}
                    onChange={e => setBreed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                  >
                    <option value="BV-300 Layer">BV-300 Layer (Venky's)</option>
                    <option value="Hy-Line Brown">Hy-Line Brown</option>
                    <option value="Lohmann LSL White">Lohmann LSL White</option>
                    <option value="Bovans White">Bovans White</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">हॅचरी स्रोत (Hatchery) *</label>
                  <input
                    type="text"
                    required
                    value={hatchery}
                    onChange={e => setHatchery(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">पिल्लांची संख्या *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={initialChicks}
                    onChange={e => setInitialChicks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">दर (₹/पिल्लू) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={chickCost}
                    onChange={e => setChickCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">वय (आठवडे) *</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={ageWeeks}
                    onChange={e => setAgeWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">प्लेसमेंट दिनांक *</label>
                  <input
                    type="date"
                    required
                    value={placementDate}
                    onChange={e => setPlacementDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">अवस्था (Initial Phase) *</label>
                  <select
                    value={initialPhase}
                    onChange={e => setInitialPhase(e.target.value as Flock['currentPhase'])}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                  >
                    <option value="brooding">ब्रूडिंग (Brooding)</option>
                    <option value="growing">ग्रोवर (Growing)</option>
                    <option value="pre_lay">प्री-ले (Pre-Lay)</option>
                    <option value="laying">लेईंग (Laying)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E7E2D6] dark:border-[#263B30]">
                <button
                  type="button"
                  onClick={() => setShowNewFlockModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#55695F] hover:bg-gray-100 dark:hover:bg-[#1F3027]"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#1F4D3A] hover:bg-[#16382A] text-white shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'जतन करत आहे...' : 'बॅच जतन करा (Save Flock)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW SHED MODAL */}
      {showNewShedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-[#16241D] rounded-3xl shadow-2xl border border-[#E7E2D6] dark:border-[#263B30] p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
              <h3 className="text-base font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-[#1F4D3A] dark:text-[#42BF87]" />
                <span>नवीन शेड जोडा (Add New Shed)</span>
              </h3>
              <button onClick={() => setShowNewShedModal(false)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1F3027]">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateShed} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">शेड क्रमांक (e.g. S-4) *</label>
                <input
                  type="text"
                  required
                  value={shedNumber}
                  onChange={e => setShedNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">शेडचे नाव (Shed Name) *</label>
                <input
                  type="text"
                  required
                  value={shedName}
                  onChange={e => setShedName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">पक्षी क्षमता *</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={shedCapacity}
                    onChange={e => setShedCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">पद्धत (Type) *</label>
                  <select
                    value={shedType}
                    onChange={e => setShedType(e.target.value as Shed['shedType'])}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] text-xs font-bold text-[#0B1E15] dark:text-white"
                  >
                    <option value="elevated_cage">उंच पिंजरा (Cage)</option>
                    <option value="environment_controlled">EC शेड (Climate Control)</option>
                    <option value="deep_litter">डीप लिटर (Deep Litter)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="sensors"
                  checked={hasSensors}
                  onChange={e => setHasSensors(e.target.checked)}
                  className="rounded text-[#1F4D3A] focus:ring-[#1F4D3A]"
                />
                <label htmlFor="sensors" className="text-xs font-bold text-[#0B1E15] dark:text-white cursor-pointer">
                  IoT तापमान व आर्द्रता सेन्सर्स जोडलेले आहेत
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E7E2D6] dark:border-[#263B30]">
                <button
                  type="button"
                  onClick={() => setShowNewShedModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#55695F] hover:bg-gray-100 dark:hover:bg-[#1F3027]"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#1F4D3A] hover:bg-[#16382A] text-white shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'तयार करत आहे...' : 'शेड तयार करा (Save Shed)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CULL / CLOSE BATCH MODAL */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-[#16241D] rounded-3xl shadow-2xl border border-red-200 dark:border-red-900/50 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
                बॅच समाप्ती / कलिंग (Close Batch)
              </h3>
              <p className="text-xs text-[#55695F] dark:text-[#A1B3AA] mt-1">
                तुम्ही बॅच <strong className="text-red-700 dark:text-red-400">{flock.batchCode}</strong> समाप्त करू इच्छिता? यामुळे ही बॅच कलिंग (Cull Ready) म्हणून नोंदवली जाईल.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowCloseModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#55695F] border border-[#DCD3C3] dark:border-[#263B30] hover:bg-gray-100 dark:hover:bg-[#1F3027]"
              >
                रद्द करा
              </button>
              <button
                onClick={handleConfirmClose}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-md"
              >
                {isSubmitting ? 'नोंदवत आहे...' : 'होय, बॅच समाप्त करा'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
