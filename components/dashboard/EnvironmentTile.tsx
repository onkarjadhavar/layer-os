'use client';

import React from 'react';
import { useLayerOS } from '@/lib/store';
import { Thermometer, Droplets, Wind, Fan, Lightbulb, Activity, CheckCircle } from 'lucide-react';

export function EnvironmentTile() {
  const { environment, toggleEnvironmentControl } = useLayerOS();

  return (
    <div className="card-layer p-5 border border-[#E8E4DA] dark:border-[#1E3F36] bg-white dark:bg-[#122A23]">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E4DA] dark:border-[#1E3F36]">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-[#C9A23C]" />
          <h3 className="text-sm font-bold text-[#0C1F1A] dark:text-white">
            शेडचे वातावरण व ऑटोमेशन (Climate & Sensors)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#1A6B4A] bg-[#E8F5EE] dark:bg-[#0F2E21] px-2.5 py-1 rounded-full border border-[#1A6B4A]/10">
          <Activity className="w-3 h-3 animate-pulse text-[#1A6B4A]" />
          <span>IoT सेन्सर कनेक्टेड</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {/* 1. Temperature */}
        <div className="p-3.5 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36]">
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>कमाल तापमान</span>
            <Thermometer className="w-3.5 h-3.5 text-[#C9A23C]" />
          </div>
          <div className="text-xl font-bold text-[#0C1F1A] dark:text-white mt-1.5">
            {environment.tempMax}°C
          </div>
          <div className="text-[11px] text-[#6B8A7F] dark:text-[#6E9487] font-normal mt-0.5">
            किमान: {environment.tempMin}°C
          </div>
        </div>

        {/* 2. Humidity */}
        <div className="p-3.5 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36]">
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>आर्द्रता (RH)</span>
            <Droplets className="w-3.5 h-3.5 text-[#2A6490]" />
          </div>
          <div className="text-xl font-bold text-[#0C1F1A] dark:text-white mt-1.5">
            {environment.humidity}%
          </div>
          <div className="text-[11px] text-[#1A6B4A] dark:text-[#3DAE7E] font-medium mt-0.5">
            योग्य पातळी (५५-६५%)
          </div>
        </div>

        {/* 3. Ammonia */}
        <div className="p-3.5 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36]">
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>अमोनिया (NH₃)</span>
            <Wind className="w-3.5 h-3.5 text-[#6B8A7F]" />
          </div>
          <div className="text-xl font-bold text-[#0C1F1A] dark:text-white mt-1.5">
            {environment.ammoniaPpm} <span className="text-xs font-medium text-[#6B8A7F]">ppm</span>
          </div>
          <div className="text-[11px] text-[#1A6B4A] dark:text-[#3DAE7E] font-medium mt-0.5">
            सुरक्षित (मर्यादा &lt; २५ ppm)
          </div>
        </div>

        {/* 4. Lighting */}
        <div className="p-3.5 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36]">
          <div className="flex items-center justify-between text-xs text-[#3D5C53] dark:text-[#9BB5AB] font-medium">
            <span>प्रकाश वेळापत्रक</span>
            <Lightbulb className="w-3.5 h-3.5 text-[#C9A23C]" />
          </div>
          <div className="text-xl font-bold text-[#0C1F1A] dark:text-white mt-1.5">
            १६ तास
          </div>
          <div className="text-[11px] text-[#6B8A7F] dark:text-[#6E9487] font-normal mt-0.5">
            सकाळी ५ ते रात्री ९
          </div>
        </div>
      </div>

      {/* Manual & Automation Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E8E4DA] dark:border-[#1E3F36]">
        {/* Fan Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${environment.fansOn ? 'bg-[#E8F3F1] text-[#013E37] dark:bg-[#0C2B26] dark:text-[#3DAE7E]' : 'bg-[#F5F3EE] text-[#6B8A7F] dark:bg-[#183530] dark:text-[#6E9487]'}`}>
              <Fan className={`w-4 h-4 ${environment.fansOn ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0C1F1A] dark:text-white">एक्झॉस्ट फॅन (Exhaust Fans)</div>
              <div className="text-[11px] text-[#6B8A7F] dark:text-[#6E9487] font-normal">स्थिती: {environment.fansOn ? 'चालू (३ फॅन कार्यरत)' : 'बंद'}</div>
            </div>
          </div>
          <button
            onClick={() => toggleEnvironmentControl('fansOn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              environment.fansOn
                ? 'bg-[#013E37] text-white shadow-sm'
                : 'bg-[#F5F3EE] dark:bg-[#183530] text-[#3D5C53] dark:text-[#9BB5AB] border border-[#E8E4DA] dark:border-[#1E3F36]'
            }`}
          >
            {environment.fansOn ? 'बंद करा' : 'चालू करा'}
          </button>
        </div>

        {/* Light Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${environment.lightsOn ? 'bg-[#FFF8DC] text-[#C9A23C] dark:bg-[#3D3416] dark:text-[#E5B84A]' : 'bg-[#F5F3EE] text-[#6B8A7F] dark:bg-[#183530] dark:text-[#6E9487]'}`}>
              <Lightbulb className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0C1F1A] dark:text-white">शेडमधील दिवे (Shed Lighting)</div>
              <div className="text-[11px] text-[#6B8A7F] dark:text-[#6E9487] font-normal">स्थिती: {environment.lightsOn ? 'चालू (ऑटो टायमर)' : 'बंद'}</div>
            </div>
          </div>
          <button
            onClick={() => toggleEnvironmentControl('lightsOn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              environment.lightsOn
                ? 'bg-[#C9A23C] text-[#0C1F1A] shadow-sm'
                : 'bg-[#F5F3EE] dark:bg-[#183530] text-[#3D5C53] dark:text-[#9BB5AB] border border-[#E8E4DA] dark:border-[#1E3F36]'
            }`}
          >
            {environment.lightsOn ? 'बंद करा' : 'चालू करा'}
          </button>
        </div>
      </div>
    </div>
  );
}
