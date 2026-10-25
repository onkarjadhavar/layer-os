'use client';

import React, { useState, useMemo } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { generate30DaysForecast } from '@/lib/ai';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calc';
import {
  LineChart as LineIcon,
  Sliders,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Wallet,
  ShieldCheck,
  Scale,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

export function ForecastModule() {
  const { todayRecord } = useLayerOS();
  const { t } = useI18n();

  // What-If Sliders State
  const [eggRateDelta, setEggRateDelta] = useState<number>(0); // e.g. -0.50 to +0.50
  const [feedPriceDelta, setFeedPriceDelta] = useState<number>(0); // e.g. -3 to +3
  const [prodDelta, setProdDelta] = useState<number>(0); // e.g. -3 to +3%
  const [mortDelta, setMortDelta] = useState<number>(0); // e.g. -5 to +15

  // Generate 30-day forecast memoized on slider adjustments
  const forecast = useMemo(() => {
    return generate30DaysForecast(todayRecord, {
      eggRateDelta,
      feedPriceDelta,
      productionPctDelta: prodDelta,
      mortalityDailyDelta: mortDelta,
    });
  }, [todayRecord, eggRateDelta, feedPriceDelta, prodDelta, mortDelta]);

  const resetSliders = () => {
    setEggRateDelta(0);
    setFeedPriceDelta(0);
    setProdDelta(0);
    setMortDelta(0);
  };

  const currentEggRate = (todayRecord.sellingPricePerEgg + eggRateDelta).toFixed(2);
  const currentFeedPrice = (todayRecord.feedPricePerKg + feedPriceDelta).toFixed(2);
  const currentProd = (todayRecord.hdPct + prodDelta).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E2D6] dark:border-[#263B30] gap-3">
          <div>
            <h2 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <LineIcon className="w-6 h-6 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>AI ३०-दिवसीय नफा/तोटा अंदाज व सिम्युलेटर (Forecast)</span>
            </h2>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-1">
              पुढील ३० दिवसांचा महसूल, खर्च, रोख प्रवाह (Cash Flow) आणि परिस्थितीनुसार अंदाज
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-[#EAF3EF] text-[#1F4D3A] dark:bg-[#182B22] dark:text-[#3BA378]">
              हॉल्ट-विंटर्स अल्गोरिदम
            </span>
          </div>
        </div>

        {/* What-If Interactive Sliders Card */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#FAF8F3] to-[#FCF6E9] dark:from-[#1F3027] dark:to-[#243329] border border-[#D9A441]/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#D9A441]" />
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                काय घडेल जर? (What-If Interactive Scenario Sliders)
              </h3>
            </div>
            <button
              onClick={resetSliders}
              className="flex items-center gap-1 text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>रीसेट करा</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Egg Rate Slider */}
            <div className="p-3 bg-white/95 dark:bg-[#16241D]/95 rounded-xl border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-[#2D4538] dark:text-[#CBDCD4]">अंडी विक्री दर:</span>
                <span className="text-[#D9A441] font-black text-sm">₹{currentEggRate}</span>
              </div>
              <input
                type="range"
                min="-0.80"
                max="0.80"
                step="0.05"
                value={eggRateDelta}
                onChange={e => setEggRateDelta(parseFloat(e.target.value))}
                className="w-full accent-[#D9A441] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-0.5">
                <span>-₹०.८०</span>
                <span>{eggRateDelta >= 0 ? `+₹${eggRateDelta.toFixed(2)}` : `-₹${Math.abs(eggRateDelta).toFixed(2)}`}</span>
                <span>+₹०.८०</span>
              </div>
            </div>

            {/* 2. Feed Price Slider */}
            <div className="p-3 bg-white/95 dark:bg-[#16241D]/95 rounded-xl border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-[#2D4538] dark:text-[#CBDCD4]">खुराक दर प्रति किलो:</span>
                <span className="text-[#1F4D3A] dark:text-[#3BA378] font-black text-sm">₹{currentFeedPrice}</span>
              </div>
              <input
                type="range"
                min="-4"
                max="5"
                step="0.5"
                value={feedPriceDelta}
                onChange={e => setFeedPriceDelta(parseFloat(e.target.value))}
                className="w-full accent-[#1F4D3A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-0.5">
                <span>-₹४</span>
                <span>{feedPriceDelta >= 0 ? `+₹${feedPriceDelta.toFixed(1)}` : `-₹${Math.abs(feedPriceDelta).toFixed(1)}`}</span>
                <span>+₹५</span>
              </div>
            </div>

            {/* 3. Production % Slider */}
            <div className="p-3 bg-white/95 dark:bg-[#16241D]/95 rounded-xl border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-[#2D4538] dark:text-[#CBDCD4]">उत्पादन (HD%):</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-black text-sm">{currentProd}%</span>
              </div>
              <input
                type="range"
                min="-5"
                max="3"
                step="0.5"
                value={prodDelta}
                onChange={e => setProdDelta(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-0.5">
                <span>-५%</span>
                <span>{prodDelta >= 0 ? `+${prodDelta}%` : `${prodDelta}%`}</span>
                <span>+३%</span>
              </div>
            </div>

            {/* 4. Mortality Slider */}
            <div className="p-3 bg-white/95 dark:bg-[#16241D]/95 rounded-xl border border-[#E7E2D6] dark:border-[#263B30]">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-[#2D4538] dark:text-[#CBDCD4]">दैनिक मृत्यू:</span>
                <span className="text-red-600 font-black text-sm">{todayRecord.mortality + mortDelta} पक्षी</span>
              </div>
              <input
                type="range"
                min="-10"
                max="25"
                step="1"
                value={mortDelta}
                onChange={e => setMortDelta(parseInt(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-0.5">
                <span>-१०</span>
                <span>{mortDelta >= 0 ? `+${mortDelta}` : `${mortDelta}`}</span>
                <span>+२५</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Scenarios Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Pessimistic */}
        <div className="card-layer p-5 border-2 border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10">
          <div className="flex items-center justify-between pb-2 border-b border-red-200 dark:border-red-900/40">
            <h4 className="text-xs font-black uppercase text-red-800 dark:text-red-300">
              कमी दर / मंदी (Pessimistic)
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-200 text-red-900">
              संभाव्यता: २०%
            </span>
          </div>
          <div className="space-y-2 mt-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold">प्रकल्पित महसूल:</span>
              <span className="font-black text-[#0B1E15] dark:text-white">{formatIndianCurrency(forecast.pessimistic.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold">प्रकल्पित खर्च:</span>
              <span className="font-black text-[#0B1E15] dark:text-white">{formatIndianCurrency(forecast.pessimistic.totalExpenditure)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-black">
              <span className="text-[#0B1E15] dark:text-white">खरा नफा (True Profit):</span>
              <span className="text-amber-700 font-bold">{formatIndianCurrency(forecast.pessimistic.trueProfit)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#2D4538] dark:text-[#CBDCD4]">
              <span>ब्रेक-इव्हन दर:</span>
              <span className="font-bold text-[#0B1E15] dark:text-white">₹{forecast.pessimistic.breakEvenEggPrice}/अंडे</span>
            </div>
          </div>
        </div>

        {/* 2. Base Scenario (Most Likely) */}
        <div className="card-layer p-5 border-2 border-[#1F4D3A] bg-white dark:bg-[#16241D] shadow-md relative">
          <div className="absolute -top-3 right-4 bg-[#1F4D3A] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full">
            सर्वाधिक संभाव्य (Base)
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#E7E2D6] dark:border-[#263B30]">
            <h4 className="text-xs font-black uppercase text-[#1F4D3A] dark:text-[#3BA378]">
              सध्याची परिस्थिती (Base Case)
            </h4>
          </div>
          <div className="space-y-2 mt-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold">प्रकल्पित महसूल:</span>
              <span className="font-black text-[#0B1E15] dark:text-white">{formatIndianCurrency(forecast.monthSummary.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold">प्रकल्पित एकूण खर्च:</span>
              <span className="font-black text-[#0B1E15] dark:text-white">{formatIndianCurrency(forecast.monthSummary.totalExpenditure)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-black">
              <span className="text-[#0B1E15] dark:text-white">खरा नफा (True Profit):</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black text-sm">
                {formatIndianCurrency(forecast.monthSummary.trueProfit)}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-[#2D4538] dark:text-[#CBDCD4]">
              <span>ब्रेक-इव्हन दर:</span>
              <span className="font-black text-[#0B1E15] dark:text-white">
                ₹{forecast.monthSummary.breakEvenEggPrice}/अंडे (₹{Math.round(forecast.monthSummary.breakEvenEggPrice * 100)}/१००)
              </span>
            </div>
          </div>
        </div>

        {/* 3. Optimistic */}
        <div className="card-layer p-5 border-2 border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-900/40">
            <h4 className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300">
              तेजीचा काळ (Optimistic)
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
              संभाव्यता: २५%
            </span>
          </div>
          <div className="space-y-2 mt-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold">प्रकल्पित महसूल:</span>
              <span className="font-black text-[#0B1E15] dark:text-white">{formatIndianCurrency(forecast.optimistic.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#2D4538] dark:text-[#CBDCD4] font-bold">प्रकल्पित खर्च:</span>
              <span className="font-black text-[#0B1E15] dark:text-white">{formatIndianCurrency(forecast.optimistic.totalExpenditure)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-black">
              <span className="text-[#0B1E15] dark:text-white">खरा नफा (True Profit):</span>
              <span className="text-emerald-600 font-bold">{formatIndianCurrency(forecast.optimistic.trueProfit)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#2D4538] dark:text-[#CBDCD4]">
              <span>ब्रेक-इव्हन दर:</span>
              <span className="font-bold text-[#0B1E15] dark:text-white">₹{forecast.optimistic.breakEvenEggPrice}/अंडे</span>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Day-by-Day Cash Flow Forecast Curve */}
      <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E7E2D6] dark:border-[#263B30] gap-2">
          <div>
            <h3 className="text-sm font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>३०-दिवसीय रोख प्रवाह व बँक शिल्लक (Cumulative Cash Flow Projection)</span>
            </h3>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-0.5">
              सुरुवाती शिल्लक ₹४,२८,५०० • ५ तारखेला ईएमआय ₹३८,४०० वजावट समाविष्ट
            </p>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">अपेक्षित महिनाअखेर शिल्लक</div>
            <div className="text-base font-black text-emerald-700 dark:text-emerald-400">
              {formatIndianCurrency(forecast.monthSummary.closingCash)}
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast.days}>
              <defs>
                <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1F4D3A" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1F4D3A" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCD3C3" opacity={0.6} />
              <XAxis
                dataKey="date"
                stroke="#2D4538"
                fontSize={11}
                tick={{ fill: '#2D4538', fontWeight: 600 }}
              />
              <YAxis
                stroke="#2D4538"
                fontSize={11}
                tick={{ fill: '#2D4538', fontWeight: 600 }}
                tickFormatter={(val) => `₹${Math.round(val / 100000)}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1E15',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                formatter={(val: any) => [formatIndianCurrency(val), 'संचित रोख शिल्लक']}
              />
              <Area
                type="monotone"
                dataKey="cumulativeCash"
                name="एकूण शिल्लक (₹)"
                stroke="#1F4D3A"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#cashGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
