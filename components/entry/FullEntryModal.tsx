'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import {
  X,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Bird,
  Egg,
  Wheat,
  HeartPulse,
  Thermometer,
  CircleDollarSign,
  Receipt,
  Plus,
  Trash2,
  Camera,
  Mic,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FullEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function FullEntryModal({ isOpen, onClose, onSuccess }: FullEntryModalProps) {
  const { farm, sheds, flock, todayRecord, addFullDailyRecord, customers, unitSettings } = useLayerOS();
  const { t } = useI18n();

  const [date, setDate] = useState('2026-10-07');
  const [selectedShed, setSelectedShed] = useState('shed-01');

  // Accordion open states
  const [openSections, setOpenSections] = useState({
    birds: true,
    eggs: true,
    feed: false,
    health: false,
    environment: false,
    sales: false,
    expenses: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Section 1: Birds
  const openingBirds = todayRecord?.closingBirds || 30000;
  const [mortality, setMortality] = useState(15);
  const [culls, setCulls] = useState(0);
  const [mortalityCause, setMortalityCause] = useState('heat');
  const [mortalityNotes, setMortalityNotes] = useState('नियमित तपासणी - किरकोळ अशक्तपणा.');

  const closingBirds = openingBirds - mortality - culls;

  // Section 2: Eggs & Collection
  const [totalEggs, setTotalEggs] = useState(27300);
  const [morningCollection, setMorningCollection] = useState(17200);
  const [eveningCollection, setEveningCollection] = useState(10100);
  const [brokenEggs, setBrokenEggs] = useState(120);
  const [softShellEggs, setSoftShellEggs] = useState(60);
  const [rejectEggs, setRejectEggs] = useState(40);
  const [avgEggWeight, setAvgEggWeight] = useState(58.5);

  // Section 3: Feed & Nutrition
  const [feedIssuedKg, setFeedIssuedKg] = useState(3300);
  const [feedType, setFeedType] = useState('Layer Phase 1 (18% Protein)');
  const [waterLitres, setWaterLitres] = useState(6600);
  const [suggestedFeedTomorrow, setSuggestedFeedTomorrow] = useState(3310);

  // Section 4: Health & Treatments
  const [vaccineGiven, setVaccineGiven] = useState('Ranikhet (ND LaSota Booster)');
  const [medicineAdministered, setMedicineAdministered] = useState('Vitamin AD3E + B-Complex (Water supplement)');
  const [vetVisited, setVetVisited] = useState(false);

  // Section 5: Environment
  const [tempMin, setTempMin] = useState(22.5);
  const [tempMax, setTempMax] = useState(29.8);
  const [humidity, setHumidity] = useState(62);
  const [ammonia, setAmmonia] = useState(12);
  const [lightHours, setLightHours] = useState(16);
  const [powerCutHours, setPowerCutHours] = useState(1.5);

  const [closeDayToggle, setCloseDayToggle] = useState(true);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const goodEggs = totalEggs - brokenEggs - softShellEggs - rejectEggs;
    const hdPct = closingBirds > 0 ? Number(((totalEggs / closingBirds) * 100).toFixed(2)) : 0;
    const feedPerBirdG = closingBirds > 0 ? Number(((feedIssuedKg * 1000) / closingBirds).toFixed(1)) : 0;

    addFullDailyRecord({
      recordDate: date,
      openingBirds,
      mortality,
      culls,
      closingBirds,
      totalEggsCollected: totalEggs,
      brokenCrackedEggs: brokenEggs,
      softShellEggs,
      rejectEggs,
      goodEggs,
      morningCollection,
      eveningCollection,
      hdPct,
      productionPct: hdPct,
      feedIssuedKg,
      feedPerBirdG,
      waterConsumptionLitres: waterLitres,
      avgEggWeightG: avgEggWeight,
      sellingPricePerEgg: 5.40,
      feedPricePerKg: 35.00,
      otherCashExpenses: 12000,
      isClosed: closeDayToggle,
      notes: `तपशीलवार नोंद: ${mortalityNotes}`,
    });

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#1F4D3A', '#D9A441', '#2E7D5B'],
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-[#16241D] rounded-3xl shadow-2xl border border-[#E7E2D6] dark:border-[#263B30] my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E7E2D6] dark:border-[#263B30] flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#16241D]/95 backdrop-blur-md z-10 rounded-t-3xl">
          <div>
            <h2 className="text-lg md:text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <span>{t.fullEntryTitle}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-black bg-[#1F4D3A] text-white">
                २ मिनिटे
              </span>
            </h2>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-0.5">
              {farm.name} • {flock.batchCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1F3027] text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 md:p-7 space-y-4">
          {/* Farm, Shed, Date Selector Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30]">
            <div>
              <label className="block text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">दिनांक *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">शेड निवडा *</label>
              <select
                value={selectedShed}
                onChange={e => setSelectedShed(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
              >
                {sheds.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.capacity.toLocaleString('en-IN')} पक्षी)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">फ्लॉक / बॅच</label>
              <div className="text-xs font-black text-[#1F4D3A] dark:text-[#3BA378] py-2">
                {flock.batchCode} ({flock.breed})
              </div>
            </div>
          </div>

          {/* Section 1: Birds */}
          <div className="rounded-2xl border border-[#E7E2D6] dark:border-[#263B30] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('birds')}
              className="w-full p-4 bg-[#FAF8F3] dark:bg-[#1F3027] flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[#0B1E15] dark:text-white"
            >
              <div className="flex items-center gap-2">
                <Bird className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
                <span className="font-black">{t.sectionBirds}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4]">
                  शिल्लक: {closingBirds.toLocaleString('en-IN')} पक्षी
                </span>
                {openSections.birds ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {openSections.birds && (
              <div className="p-4 space-y-3 bg-white dark:bg-[#16241D]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">सुरुवाती पक्षी</label>
                    <div className="font-black text-sm text-[#0B1E15] dark:text-white mt-1">{openingBirds.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-red-600">आज मृत्यू *</label>
                    <input
                      type="number"
                      value={mortality}
                      onChange={e => setMortality(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-800 text-sm font-black text-red-600 bg-red-50/70 dark:bg-red-950/30"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">कल्स / छाटणी</label>
                    <input
                      type="number"
                      value={culls}
                      onChange={e => setCulls(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">अखेर शिल्लक पक्षी</label>
                    <div className="font-black text-sm text-[#1F4D3A] dark:text-[#3BA378] mt-1">{closingBirds.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">मृत्यूचे मुख्य कारण (Cause)</label>
                    <select
                      value={mortalityCause}
                      onChange={e => setMortalityCause(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
                    >
                      <option value="heat">उष्माघात (Heat Stress)</option>
                      <option value="debility">किरकोळ अशक्तपणा (General Debility)</option>
                      <option value="respiratory">श्वसन विकार (Respiratory)</option>
                      <option value="cannibalism">कॅनिबालिझम (Pecking)</option>
                      <option value="other">इतर</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">निरीक्षण टीप</label>
                    <input
                      type="text"
                      value={mortalityNotes}
                      onChange={e => setMortalityNotes(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Eggs */}
          <div className="rounded-2xl border border-[#E7E2D6] dark:border-[#263B30] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('eggs')}
              className="w-full p-4 bg-[#FAF8F3] dark:bg-[#1F3027] flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[#0B1E15] dark:text-white"
            >
              <div className="flex items-center gap-2">
                <Egg className="w-4 h-4 text-[#D9A441]" />
                <span className="font-black">{t.sectionEggs}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4]">
                  एकूण: {totalEggs.toLocaleString('en-IN')} अंडी ({((totalEggs / closingBirds) * 100).toFixed(1)}%)
                </span>
                {openSections.eggs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {openSections.eggs && (
              <div className="p-4 space-y-3 bg-white dark:bg-[#16241D]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-black text-[#1F4D3A] dark:text-[#3BA378]">एकूण अंडी *</label>
                    <input
                      type="number"
                      value={totalEggs}
                      onChange={e => setTotalEggs(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#1F4D3A] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-black"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">सकाळचे संकलन</label>
                    <input
                      type="number"
                      value={morningCollection}
                      onChange={e => setMorningCollection(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">संध्याकाळचे संकलन</label>
                    <input
                      type="number"
                      value={eveningCollection}
                      onChange={e => setEveningCollection(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">सरासरी वजन (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={avgEggWeight}
                      onChange={e => setAvgEggWeight(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">फुटलेली / क्रॅक (Broken)</label>
                    <input
                      type="number"
                      value={brokenEggs}
                      onChange={e => setBrokenEggs(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">सॉफ्ट-शेल (Soft Shell)</label>
                    <input
                      type="number"
                      value={softShellEggs}
                      onChange={e => setSoftShellEggs(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">रिजेक्ट / घाण अंडी</label>
                    <input
                      type="number"
                      value={rejectEggs}
                      onChange={e => setRejectEggs(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Feed */}
          <div className="rounded-2xl border border-[#E7E2D6] dark:border-[#263B30] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('feed')}
              className="w-full p-4 bg-[#FAF8F3] dark:bg-[#1F3027] flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[#0B1E15] dark:text-white"
            >
              <div className="flex items-center gap-2">
                <Wheat className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
                <span className="font-black">{t.sectionFeed}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4]">
                  {feedIssuedKg} kg ({Math.round((feedIssuedKg * 1000) / closingBirds)} g/पक्षी)
                </span>
                {openSections.feed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {openSections.feed && (
              <div className="p-4 space-y-3 bg-white dark:bg-[#16241D]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-black text-[#1F4D3A] dark:text-[#3BA378]">खुराक वाटप (kg) *</label>
                    <input
                      type="number"
                      value={feedIssuedKg}
                      onChange={e => setFeedIssuedKg(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#1F4D3A] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-black"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">खुराकाचा प्रकार</label>
                    <input
                      type="text"
                      value={feedType}
                      onChange={e => setFeedType(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">पाण्याचा वापर (Litres)</label>
                    <input
                      type="number"
                      value={waterLitres}
                      onChange={e => setWaterLitres(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FCF6E9] dark:bg-[#2E2413] border border-[#D9A441]/40 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0B1E15] dark:text-white">
                    AI शिफारस उद्यासाठी: <span className="font-black text-[#D9A441]">{suggestedFeedTomorrow} kg</span> (११०.५ g/पक्षी)
                  </span>
                  <button
                    type="button"
                    onClick={() => setFeedIssuedKg(suggestedFeedTomorrow)}
                    className="text-[11px] font-black text-[#1F4D3A] dark:text-[#3BA378] underline"
                  >
                    ही मात्रा वापरा
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Environment */}
          <div className="rounded-2xl border border-[#E7E2D6] dark:border-[#263B30] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('environment')}
              className="w-full p-4 bg-[#FAF8F3] dark:bg-[#1F3027] flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[#0B1E15] dark:text-white"
            >
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className="font-black">{t.sectionEnvironment}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4]">
                  {tempMax}°C • {humidity}% RH • {ammonia} ppm
                </span>
                {openSections.environment ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {openSections.environment && (
              <div className="p-4 space-y-3 bg-white dark:bg-[#16241D]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">किमान तापमान (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempMin}
                      onChange={e => setTempMin(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-orange-600">कमाल तापमान (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempMax}
                      onChange={e => setTempMax(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-orange-300 dark:border-orange-800 bg-[#F8F6F0] dark:bg-[#1A2D23] text-orange-600 text-xs font-black"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">आर्द्रता (% Humidity)</label>
                    <input
                      type="number"
                      value={humidity}
                      onChange={e => setHumidity(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4]">अमोनिया वायू (ppm)</label>
                    <input
                      type="number"
                      value={ammonia}
                      onChange={e => setAmmonia(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Close Day Toggle and AI trigger */}
          <div className="p-4 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/30 flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-[#1F4D3A] dark:text-[#3BA378]">
                नोंद साठवून आजचा दिवस बंद करा (Close & Lock Day)
              </div>
              <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-0.5">
                दिवस बंद केल्यावर AI सल्लागार आणि ३०-दिवसीय अंदाज आपोआप तयार होईल.
              </div>
            </div>
            <input
              type="checkbox"
              checked={closeDayToggle}
              onChange={e => setCloseDayToggle(e.target.checked)}
              className="w-5 h-5 accent-[#1F4D3A]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E2D6] dark:border-[#263B30]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-[#E7E2D6] dark:border-[#263B30] text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4]"
            >
              रद्द करा
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white font-black text-sm flex items-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D9A441]" />
              <span>संपूर्ण दिवस नोंद साठवा</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
