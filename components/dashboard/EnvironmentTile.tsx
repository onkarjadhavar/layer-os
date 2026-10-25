'use client';

import React from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { Thermometer, Droplets, Wind, Fan, Lightbulb, Activity } from 'lucide-react';

export function EnvironmentTile() {
  const { environment, toggleEnvironmentControl } = useLayerOS();
  const { t } = useI18n();

  return (
    <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-orange-600" />
          <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
            {t.climateAutomationTitle}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
          <span>{t.iotSensorsConnected}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {/* 1. Temperature */}
        <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.maxTempLabel}</span>
            <Thermometer className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
            {environment.tempMax}°C
          </div>
          <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-0.5">
            {t.minTempLabel}: {environment.tempMin}°C
          </div>
        </div>

        {/* 2. Humidity */}
        <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.humidityLabel}</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
            {environment.humidity}%
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
            {t.humidityNormal}
          </div>
        </div>

        {/* 3. Ammonia */}
        <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.ammoniaLabel}</span>
            <Wind className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
            {environment.ammoniaPpm} <span className="text-xs font-bold text-[#4D6558] dark:text-[#CBDCD4]">ppm</span>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
            {t.ammoniaSafe}
          </div>
        </div>

        {/* 4. Lighting */}
        <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">
            <span>{t.lightingScheduleLabel}</span>
            <Lightbulb className="w-4 h-4 text-[#D9A441]" />
          </div>
          <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1">
            {t.lightingHours}
          </div>
          <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-0.5">
            {t.lightingTimeRange}
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
              <div className="text-xs font-black text-[#0B1E15] dark:text-white">{t.exhaustFansLabel}</div>
              <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium">{t.status}: {environment.fansOn ? t.fansRunning : t.fansOff}</div>
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
            {environment.fansOn ? t.turnOff : t.turnOn}
          </button>
        </div>

        {/* Light Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${environment.lightsOn ? 'bg-amber-100 text-[#D9A441]' : 'bg-gray-200 text-gray-500'}`}>
              <Lightbulb className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-xs font-black text-[#0B1E15] dark:text-white">{t.lightingScheduleLabel}</div>
              <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium">{t.status}: {environment.lightsOn ? t.fansRunning : t.fansOff}</div>
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
            {environment.lightsOn ? t.turnOff : t.turnOn}
          </button>
        </div>
      </div>
    </div>
  );
}
