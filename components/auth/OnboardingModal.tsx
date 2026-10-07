'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { Check, ArrowRight, ArrowLeft, Sparkles, Building2, Layers, Zap } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: () => void;
}

export function OnboardingModal({ isOpen, onClose, onCompleted }: OnboardingModalProps) {
  const { farm, flock, addQuickLog } = useLayerOS();
  const { t } = useI18n();

  const [step, setStep] = useState<number>(1);
  const [farmName, setFarmName] = useState(farm.name);
  const [district, setDistrict] = useState(farm.district);
  const [capacity, setCapacity] = useState(30000);

  const [flockCode, setFlockCode] = useState(flock.batchCode);
  const [breed, setBreed] = useState("BV-300 Layer");
  const [birdCount, setBirdCount] = useState(30000);
  const [ageWeeks, setAgeWeeks] = useState(34);

  // Quick log initial numbers
  const [eggs, setEggs] = useState(27300);
  const [feedKg, setFeedKg] = useState(3300);
  const [mortality, setMortality] = useState(15);
  const [eggRate, setEggRate] = useState(5.40);

  if (!isOpen) return null;

  const handleFinish = () => {
    // Save first quick log entry
    addQuickLog({
      recordDate: new Date().toISOString().split('T')[0],
      eggsCollected: Number(eggs),
      feedKg: Number(feedKg),
      mortality: Number(mortality),
      sellingRate: Number(eggRate),
    });
    onCompleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-[#16241D] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E7E2D6] dark:border-[#263B30] relative">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-black text-[#0B1E15] dark:text-white mb-2">
            <span>स्टेप {step} / ४</span>
            <span>
              {step === 1 && "१. नोंदणी व खाते"}
              {step === 2 && "२. पोल्ट्री फार्म माहिती"}
              {step === 3 && "३. पहिली बॅच (Flock)"}
              {step === 4 && "४. पहिली दैनिक नोंद"}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s <= step ? 'bg-[#1F4D3A] dark:bg-[#3BA378]' : 'bg-gray-200 dark:bg-gray-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Sign up verification */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] text-[#1F4D3A] dark:text-[#3BA378] mx-auto flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-[#D9A441]" />
              </div>
              <h3 className="text-lg font-black text-[#0B1E15] dark:text-white">
                LayerOS मध्ये आपले स्वागत आहे!
              </h3>
              <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] mt-1 font-semibold">
                महाराष्ट्रातील लेयर फार्म चालकांसाठी खास तयार केलेली सुलभ प्रणाली
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1E15] dark:text-white">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>फोन नंबर पडताळणी पूर्ण झाली</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1E15] dark:text-white">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>मराठी भाषा प्रथम प्राधान्य</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1E15] dark:text-white">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>ऑफलाईन वापरण्याची सोय</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <span>पुढे चला: फार्म तयार करा</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Farm Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-[#0B1E15] dark:text-white">
              <Building2 className="w-5 h-5 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>पोल्ट्री फार्मची माहिती (Farm Setup)</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  फार्मचे नाव (Farm Name)
                </label>
                <input
                  type="text"
                  value={farmName}
                  onChange={e => setFarmName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-sm font-bold text-[#0B1E15] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                    जिल्हा / तालुका (District)
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-sm font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                    एकूण क्षमता (Birds Capacity)
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-sm font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl border border-[#E7E2D6] dark:border-[#263B30] font-bold text-xs text-[#0B1E15] dark:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white font-black text-sm flex items-center justify-center gap-2"
              >
                <span>पुढे चला: बॅच जोडा</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Flock Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-[#0B1E15] dark:text-white">
              <Layers className="w-5 h-5 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>पहिली बॅच तयार करा (Flock Batch)</span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                    बॅच कोड (Batch Code)
                  </label>
                  <input
                    type="text"
                    value={flockCode}
                    onChange={e => setFlockCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-sm font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                    जात (Breed)
                  </label>
                  <select
                    value={breed}
                    onChange={e => setBreed(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-sm font-bold text-[#0B1E15] dark:text-white"
                  >
                    <option value="BV-300 Layer">BV-300 Layer</option>
                    <option value="Hy-Line Brown">Hy-Line Brown</option>
                    <option value="Lohmann LSL">Lohmann LSL</option>
                    <option value="Bovans White">Bovans White</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                    सध्या पक्षी संख्या (Birds)
                  </label>
                  <input
                    type="number"
                    value={birdCount}
                    onChange={e => setBirdCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-sm font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                    वय आठवडे (Age Weeks)
                  </label>
                  <input
                    type="number"
                    value={ageWeeks}
                    onChange={e => setAgeWeeks(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-sm font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-xl border border-[#E7E2D6] dark:border-[#263B30] font-bold text-xs text-[#0B1E15] dark:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white font-black text-sm flex items-center justify-center gap-2"
              >
                <span>पुढे चला: पहिली नोंद</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: First Quick Entry */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-[#0B1E15] dark:text-white">
              <Zap className="w-5 h-5 text-[#D9A441]" />
              <span>पहिली ३०-सेकंद नोंद (First Quick Log)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  गोळा झालेली अंडी *
                </label>
                <input
                  type="number"
                  value={eggs}
                  onChange={e => setEggs(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-base font-black text-[#1F4D3A] dark:text-[#3BA378]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  खुराक वापरला (किलो) *
                </label>
                <input
                  type="number"
                  value={feedKg}
                  onChange={e => setFeedKg(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-base font-black text-[#1F4D3A] dark:text-[#3BA378]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  मृत्यू (पक्ष्यांची संख्या) *
                </label>
                <input
                  type="number"
                  value={mortality}
                  onChange={e => setMortality(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-red-300 dark:border-red-800 bg-red-50/70 dark:bg-red-950/30 text-base font-black text-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  अंडी विक्री दर (₹)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={eggRate}
                  onChange={e => setEggRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1B2D24] text-base font-black text-[#D9A441]"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 text-xs font-bold border border-emerald-300">
              ✓ अपेक्षित उत्पादन: ९१% • ११० ग्रॅम खुराक • साधा नफा: ~₹१९,९२०
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(3)}
                className="py-3 px-4 rounded-xl border border-[#E7E2D6] dark:border-[#263B30] font-bold text-xs text-[#0B1E15] dark:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3.5 rounded-xl bg-[#1F4D3A] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#173A2C]"
              >
                <span>सेटअप पूर्ण करा व डॅशबोर्ड उघडा</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
