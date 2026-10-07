'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import {
  Settings,
  Scale,
  Building,
  RotateCcw,
  Download,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export function SettingsModule() {
  const { farm, unitSettings, updateUnitSettings, resetDemoData, isDemoMode, dailyRecords, customers, sales } = useLayerOS();
  const { t, language, setLanguage } = useI18n();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Unit settings form state
  const [traySize, setTraySize] = useState(unitSettings.traySizeEggs);
  const [gattaSizeTrays, setGattaSizeTrays] = useState(unitSettings.gattaSizeTrays);
  const [cartonSizeTrays, setCartonSizeTrays] = useState(unitSettings.cartonSizeTrays);
  const [feedBagKg, setFeedBagKg] = useState(unitSettings.feedBagWeightKg);
  const [defaultUnit, setDefaultUnit] = useState(unitSettings.defaultRateUnit);

  const handleSaveUnits = (e: React.FormEvent) => {
    e.preventDefault();
    updateUnitSettings({
      traySizeEggs: Number(traySize),
      gattaSizeTrays: Number(gattaSizeTrays),
      cartonSizeTrays: Number(cartonSizeTrays),
      feedBagWeightKg: Number(feedBagKg),
      defaultRateUnit: defaultUnit as any,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportFullJSON = () => {
    const backup = {
      farm,
      unitSettings,
      dailyRecords,
      customers,
      sales,
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LayerOS_CompleteBackup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
        <div className="pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
          <h2 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#1F4D3A] dark:text-[#3BA378]" />
            <span>फार्म सेटिंग्ज व युनिट व्याख्या (Settings & Units)</span>
          </h2>
          <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-1">
            स्थानिक बाजारानुसार 'गट्टा/पेटी' ची व्याख्या, ट्रे आकार, भाषा आणि बॅकअप
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-300 flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>युनिट सेटिंग्ज यशस्वीपणे जतन झाल्या!</span>
        </div>
      )}

      {/* 1. Regional Unit Settings Form */}
      <form onSubmit={handleSaveUnits} className="card-layer p-5 md:p-6 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E7E2D6] dark:border-[#263B30]">
          <Scale className="w-5 h-5 text-[#D9A441]" />
          <div>
            <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
              स्थानिक अंडी व खुराक युनिट व्याख्या (Custom Regional Units)
            </h3>
            <p className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">
              महाराष्ट्रातील वेगवेगळ्या जिल्ह्यांत गट्ट्याची व्याख्या वेगळी असते. कधीही हार्डकोड केलेले नसते.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
              १ ट्रे = किती अंडी? (Tray Size)
            </label>
            <input
              type="number"
              value={traySize}
              onChange={e => setTraySize(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
            />
            <span className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">मानक: ३० अंडी</span>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
              १ गट्टा / पेटी = किती ट्रे? (Gatta Size)
            </label>
            <input
              type="number"
              value={gattaSizeTrays}
              onChange={e => setGattaSizeTrays(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#D9A441] text-sm font-black"
            />
            <span className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">
              पश्चिम महाराष्ट्र / पुणे: ७ ट्रे = {gattaSizeTrays * traySize} अंडी
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
              १ कार्टन / केस = किती ट्रे? (Carton Size)
            </label>
            <input
              type="number"
              value={cartonSizeTrays}
              onChange={e => setCartonSizeTrays(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
            />
            <span className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">
              मानक केस: १२ ट्रे = {cartonSizeTrays * traySize} अंडी
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
              १ खुराक पोत्याचे वजन (Feed Bag Kg)
            </label>
            <input
              type="number"
              value={feedBagKg}
              onChange={e => setFeedBagKg(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-sm font-bold"
            />
            <span className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">मानक: ५० किलो</span>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0B1E15] dark:text-white block mb-1">
              प्राधान्य दिलेला भाव प्रकार (Default Rate)
            </label>
            <select
              value={defaultUnit}
              onChange={e => setDefaultUnit(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
            >
              <option value="per_100">प्रति १०० अंडी (NECC)</option>
              <option value="per_egg">प्रति १ अंडे</option>
              <option value="tray">प्रति ट्रे (३०)</option>
              <option value="gatta">प्रति गट्टा / पेटी</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-[#1F4D3A] text-white text-xs font-bold shadow-md hover:bg-[#173A2C]"
          >
            युनिट बदल साठवा
          </button>
        </div>
      </form>

      {/* 2. Farm Profile */}
      <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E7E2D6] dark:border-[#263B30]">
          <Building className="w-5 h-5 text-[#1F4D3A] dark:text-[#3BA378]" />
          <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
            फार्म माहिती (Farm Profile)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold block">फार्म नाव:</span>
            <strong className="text-sm font-black text-[#0B1E15] dark:text-white">{farm.name}</strong>
          </div>
          <div>
            <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold block">चालक/मालक:</span>
            <strong className="text-sm font-black text-[#0B1E15] dark:text-white">{farm.ownerName}</strong>
          </div>
          <div>
            <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold block">जिल्हा:</span>
            <strong className="text-sm font-black text-[#0B1E15] dark:text-white">{farm.district}, महाराष्ट्र</strong>
          </div>
          <div>
            <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold block">एकूण क्षमता:</span>
            <strong className="text-sm font-black text-[#0B1E15] dark:text-white">{farm.totalCapacity.toLocaleString('en-IN')} पक्षी</strong>
          </div>
        </div>
      </div>

      {/* 3. Backup & Reset Demo */}
      <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4">
        <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
          डेटा बॅकअप व रीसेट (Data Management & Reset)
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportFullJSON}
            className="py-2.5 px-4 rounded-xl border border-[#E7E2D6] dark:border-[#263B30] text-xs font-bold text-[#0B1E15] dark:text-white flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-[#1F3027]"
          >
            <Download className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
            <span>संपूर्ण डेटा बॅकअप डाऊनलोड (JSON)</span>
          </button>

          {isDemoMode && (
            <button
              onClick={() => {
                if (confirm('तुम्हाला खरोखर सह्याद्री लेयर फार्मचा सर्व डेटा पूर्ववत (Reset) करायचा आहे का?')) {
                  resetDemoData();
                  alert('डेमो डेटा पूर्ववत रीसेट झाला!');
                }
              }}
              className="py-2.5 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 border border-amber-300 text-xs font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.resetDemoData}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
