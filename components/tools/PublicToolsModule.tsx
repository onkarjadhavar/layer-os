'use client';

import React, { useState } from 'react';
import { formatIndianCurrency, formatIndianNumber, convertEggUnits, convertEggRate, DEFAULT_UNIT_SETTINGS } from '@/lib/calc';
import {
  HelpCircle,
  Calculator,
  Wheat,
  Building,
  ArrowRightLeft,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export function PublicToolsModule() {
  const [activeTool, setActiveTool] = useState<'profit' | 'feed' | 'construction' | 'converter'>('profit');

  // Tool 1: Layer Profit Calculator
  const [birds, setBirds] = useState(30000);
  const [prodPct, setProdPct] = useState(91);
  const [feedG, setFeedG] = useState(110);
  const [feedCostKg, setFeedCostKg] = useState(35);
  const [eggPrice, setEggPrice] = useState(5.40);
  const [otherDailyExpense, setOtherDailyExpense] = useState(12000);

  const eggsDaily = Math.round(birds * (prodPct / 100));
  const feedKgDaily = (birds * feedG) / 1000;
  const feedCostDaily = feedKgDaily * feedCostKg;
  const revenueDaily = eggsDaily * eggPrice;
  const simpleProfitDaily = revenueDaily - feedCostDaily - otherDailyExpense;
  const breakEvenDaily = eggsDaily > 0 ? (feedCostDaily + otherDailyExpense + 14600) / eggsDaily : 0;

  // Tool 2: Feed Formulation Cost
  const [maizePrice, setMaizePrice] = useState(24);
  const [soyaPrice, setSoyaPrice] = useState(48);
  const [dorbPrice, setDorbPrice] = useState(18);
  const [limestonePrice, setLimestonePrice] = useState(6);
  const [premixPrice, setPremixPrice] = useState(120);

  // Standard 1-ton layer feed recipe composition (kg)
  const maizeKg = 520;
  const soyaKg = 250;
  const dorbKg = 100;
  const limestoneKg = 90;
  const premixKg = 40;
  const totalCostPerTon = (maizeKg * maizePrice) + (soyaKg * soyaPrice) + (dorbKg * dorbPrice) + (limestoneKg * limestonePrice) + (premixKg * premixPrice);
  const costPerKgFormulation = (totalCostPerTon / 1000).toFixed(2);

  // Tool 3: Shed Construction Estimator
  const [shedBirds, setShedBirds] = useState(10000);
  const [shedType, setShedType] = useState<'cage' | 'ec'>('cage');
  const costPerBird = shedType === 'cage' ? 650 : 950;
  const totalShedCapex = shedBirds * costPerBird;

  // Tool 4: Egg Rate Converter
  const [convRate, setConvRate] = useState(5.40);
  const [fromUnit, setFromUnit] = useState<'per_egg' | 'per_100' | 'tray' | 'gatta'>('per_egg');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
        <div className="pb-4 border-b border-[#E7E2D6] dark:border-[#263B30]">
          <h2 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-[#1F4D3A] dark:text-[#3BA378]" />
            <span>पोल्ट्री मोफत कॅल्क्युलेटर (Free Layer Tools)</span>
          </h2>
          <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-1">
            नफा कॅल्क्युलेटर, खुराक बनवण्याचा खर्च, शेड बांधकाम अंदाज आणि अंडी भाव रूपांतरण
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTool('profit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTool === 'profit'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            १. लेयर नफा कॅल्क्युलेटर
          </button>
          <button
            onClick={() => setActiveTool('feed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTool === 'feed'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            २. खुराक फॉर्म्युलेशन खर्च
          </button>
          <button
            onClick={() => setActiveTool('construction')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTool === 'construction'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            ३. शेड बांधकाम अंदाज
          </button>
          <button
            onClick={() => setActiveTool('converter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTool === 'converter'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] font-bold'
            }`}
          >
            ४. अंडी भाव कन्व्हर्टर
          </button>
        </div>
      </div>

      {/* TOOL 1: PROFIT CALCULATOR */}
      {activeTool === 'profit' && (
        <div className="card-layer p-5 md:p-7 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] max-w-2xl mx-auto space-y-4">
          <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
            लेयर पोल्ट्री दैनिक व मासिक नफा कॅल्क्युलेटर
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">पक्षी संख्या</label>
              <input
                type="number"
                value={birds}
                onChange={e => setBirds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">उत्पादन % (HD%)</label>
              <input
                type="number"
                value={prodPct}
                onChange={e => setProdPct(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">अंडी दर (₹ प्रति अंडे)</label>
              <input
                type="number"
                step="0.05"
                value={eggPrice}
                onChange={e => setEggPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#D9A441] text-sm font-black"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">खुराक भाव (₹/किलो)</label>
              <input
                type="number"
                step="0.5"
                value={feedCostKg}
                onChange={e => setFeedCostKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#1F4D3A] dark:text-[#3BA378] text-sm font-black"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/30 space-y-2">
            <div className="flex justify-between text-xs text-[#0B1E15] dark:text-white">
              <span className="font-semibold text-[#2D4538] dark:text-[#CBDCD4]">दैनिक अंडी उत्पादन:</span>
              <span className="font-black">{formatIndianNumber(eggsDaily)} अंडी</span>
            </div>
            <div className="flex justify-between text-xs text-[#0B1E15] dark:text-white">
              <span className="font-semibold text-[#2D4538] dark:text-[#CBDCD4]">दैनिक खुराक वापर:</span>
              <span className="font-black">{formatIndianNumber(Math.round(feedKgDaily))} kg</span>
            </div>
            <div className="flex justify-between text-xs font-bold pt-2 border-t border-emerald-200 dark:border-emerald-800">
              <span className="text-[#2D4538] dark:text-[#CBDCD4]">दैनिक थेट नफा (Operating):</span>
              <span className="text-emerald-800 dark:text-emerald-300 font-black">{formatIndianCurrency(simpleProfitDaily)}</span>
            </div>
            <div className="flex justify-between text-sm font-black pt-1">
              <span>अपेक्षित मासिक नफा (३० दिवस):</span>
              <span className="text-emerald-800 dark:text-emerald-300">{formatIndianCurrency(simpleProfitDaily * 30)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold pt-1">
              <span>अंदाजित ब्रेक-इव्हन दर:</span>
              <span className="font-bold text-[#0B1E15] dark:text-white">₹{breakEvenDaily.toFixed(2)} / अंडे</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 text-xs font-bold text-center border border-amber-300">
            हे आकडे प्रत्यक्ष नोंदवण्यासाठी LayerOS वापरा →
          </div>
        </div>
      )}

      {/* TOOL 2: FEED FORMULATION HELPER */}
      {activeTool === 'feed' && (
        <div className="card-layer p-5 md:p-7 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] max-w-2xl mx-auto space-y-4">
          <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
            स्वतः खुराक तयार करण्याचा खर्च (Feed Cost per Ton)
          </h3>
          <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium">
            कच्च्या मालाचे भाव टाकून प्रति टन आणि प्रति किलो उत्पादन खर्च तपासा
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">मका (₹/kg)</label>
              <input
                type="number"
                value={maizePrice}
                onChange={e => setMaizePrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">सोया डीओसी (₹/kg)</label>
              <input
                type="number"
                value={soyaPrice}
                onChange={e => setSoyaPrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">DORB (₹/kg)</label>
              <input
                type="number"
                value={dorbPrice}
                onChange={e => setDorbPrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">लाईमस्टोन/LSP (₹/kg)</label>
              <input
                type="number"
                value={limestonePrice}
                onChange={e => setLimestonePrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">प्रीमिक्स व व्हिटॅमिन (₹/kg)</label>
              <input
                type="number"
                value={premixPrice}
                onChange={e => setPremixPrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCF6E9] dark:bg-[#2E2413] border border-[#D9A441]/40 space-y-1.5">
            <div className="flex justify-between text-xs text-[#0B1E15] dark:text-white">
              <span className="font-semibold text-[#2D4538] dark:text-[#CBDCD4]">प्रति टन एकूण खर्च (1,000 kg):</span>
              <span className="font-black">{formatIndianCurrency(totalCostPerTon)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-[#1F4D3A] dark:text-[#3BA378] pt-2 border-t border-[#D9A441]/20">
              <span>तयार खुराकाचा दर:</span>
              <span>₹{costPerKgFormulation} / किलो</span>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: SHED CONSTRUCTION ESTIMATOR */}
      {activeTool === 'construction' && (
        <div className="card-layer p-5 md:p-7 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] max-w-2xl mx-auto space-y-4">
          <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
            नवीन लेयर शेड उभारणी खर्च अंदाज (Construction Estimator)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">शेड क्षमता (पक्षी)</label>
              <input
                type="number"
                value={shedBirds}
                onChange={e => setShedBirds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">शेडचा प्रकार</label>
              <select
                value={shedType}
                onChange={e => setShedType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
              >
                <option value="cage">उंच पिंजरा पद्धत (Elevated Cage - ₹650/पक्षी)</option>
                <option value="ec">हवामान नियंत्रित (EC Closed Shed - ₹950/पक्षी)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/30 space-y-2">
            <div className="flex justify-between text-xs text-[#0B1E15] dark:text-white">
              <span className="font-semibold text-[#2D4538] dark:text-[#CBDCD4]">प्रति पक्षी सरासरी भांडवली खर्च:</span>
              <span className="font-black">₹{costPerBird}</span>
            </div>
            <div className="flex justify-between text-base font-black text-[#1F4D3A] dark:text-[#3BA378] pt-2 border-t border-emerald-200 dark:border-emerald-800">
              <span>एकूण अंदाजित भांडवल (Capex):</span>
              <span>{formatIndianCurrency(totalShedCapex)}</span>
            </div>
            <p className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-1">
              यामध्ये शेड स्ट्रक्चर, जीआय पिंजरे, पाणी निपल सिस्टीम आणि वीज फिटिंगचा समावेश आहे.
            </p>
          </div>
        </div>
      )}

      {/* TOOL 4: EGG RATE CONVERTER */}
      {activeTool === 'converter' && (
        <div className="card-layer p-5 md:p-7 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] max-w-2xl mx-auto space-y-4">
          <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
            अंडी भाव रूपांतरण (Egg Rate Converter)
          </h3>
          <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium">
            प्रति अंडे, प्रति १००, ट्रे आणि गट्टामधील दरांचे त्वरित रूपांतरण
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">भाव प्रविष्ट करा</label>
              <input
                type="number"
                step="0.05"
                value={convRate}
                onChange={e => setConvRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#D9A441] text-sm font-black"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">हा भाव कशाचा आहे?</label>
              <select
                value={fromUnit}
                onChange={e => setFromUnit(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
              >
                <option value="per_egg">प्रति १ अंडे</option>
                <option value="per_100">प्रति १०० अंडी (NECC)</option>
                <option value="tray">ट्रे (३० अंडी)</option>
                <option value="gatta">गट्टा / पेटी (२१० अंडी)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] text-center">
              <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">प्रति १ अंडे</div>
              <div className="text-base font-black text-[#0B1E15] dark:text-white mt-0.5">
                ₹{convertEggRate(convRate, fromUnit, 'per_egg')}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] text-center">
              <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">प्रति १०० अंडी</div>
              <div className="text-base font-black text-[#1F4D3A] dark:text-[#3BA378] mt-0.5">
                ₹{convertEggRate(convRate, fromUnit, 'per_100')}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] text-center">
              <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">ट्रे (३० अंडी)</div>
              <div className="text-base font-black text-[#D9A441] mt-0.5">
                ₹{convertEggRate(convRate, fromUnit, 'tray')}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] text-center">
              <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">गट्टा (२१० अंडी)</div>
              <div className="text-base font-black text-amber-700 dark:text-amber-400 mt-0.5">
                ₹{convertEggRate(convRate, fromUnit, 'gatta')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
