'use client';

import React from 'react';
import { useLayerOS } from '@/lib/store';
import { Thermometer, Droplets, Wind, Fan, Lightbulb, Activity, CheckCircle } from 'lucide-react';

export function EnvironmentTile() {
  const { environment, toggleEnvironmentControl } = useLayerOS();

  return (
    <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-orange-600" />
          <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
            शेडचे वातावरण व ऑटोमेशन (Climate & Sensors)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
          <span>IoT सेन्सर कनेक्टेड</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {/* 1. Temperature */}
        <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>कमाल तापमान</span>
            <Thermometer className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
            {environment.tempMax}°C
          </div>
          <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-0.5">
            किमान: {environment.tempMin}°C
          </div>
        </div>

        {/* 2. Humidity */}
        <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>आर्द्रता (RH)</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
            {environment.humidity}%
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
            योग्य पातळी (५५-६५%)
          </div>
        </div>

        {/* 3. Ammonia */}
        <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>अमोनिया (NH₃)</span>
            <Wind className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
            {environment.ammoniaPpm} <span className="text-xs font-bold text-[#4D6558] dark:text-[#CBDCD4]">ppm</span>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
            सुरक्षित (मर्यादा &lt; २५ ppm)
          </div>
        </div>

        {/* 4. Lighting */}
        <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>प्रकाश वेळापत्रक</span>
            <Lightbulb className="w-4 h-4 text-[#D9A441]" />
          </div>
          <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
            १६ तास
          </div>
          <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-0.5">
            सकाळी ५ ते रात्री ९
          </div>
        </div>
      </div>

      {/* Manual & Automation Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#DCD3C3] dark:border-[#263B30]">
        {/* Fan Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${environment.fansOn ? 'bg-emerald-100 text-emerald-700 animate-spin' : 'bg-gray-200 text-gray-500'}`}>
              <Fan className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-[#0B1E15] dark:text-white">एक्झॉस्ट फॅन (Exhaust Fans)</div>
              <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium">स्थिती: {environment.fansOn ? 'चालू (३ फॅन कार्यरत)' : 'बंद'}</div>
            </div>
          </div>
          <button
            onClick={() => toggleEnvironmentControl('fansOn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              environment.fansOn
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-gray-200 dark:bg-gray-800 text-[#0B1E15] dark:text-gray-300'
            }`}
          >
            {environment.fansOn ? 'बंद करा' : 'चालू करा'}
          </button>
        </div>

        {/* Light Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${environment.lightsOn ? 'bg-amber-100 text-[#D9A441]' : 'bg-gray-200 text-gray-500'}`}>
              <Lightbulb className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-xs font-black text-[#0B1E15] dark:text-white">शेडमधील दिवे (Shed Lighting)</div>
              <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium">स्थिती: {environment.lightsOn ? 'चालू (ऑटो टायमर)' : 'बंद'}</div>
            </div>
          </div>
          <button
            onClick={() => toggleEnvironmentControl('lightsOn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              environment.lightsOn
                ? 'bg-[#D9A441] text-[#0B1E15] shadow-sm'
                : 'bg-gray-200 dark:bg-gray-800 text-[#0B1E15] dark:text-gray-300'
            }`}
          >
            {environment.lightsOn ? 'बंद करा' : 'चालू करा'}
          </button>
        </div>
      </div>
    </div>
  );
}
