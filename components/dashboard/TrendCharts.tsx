'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart3, LineChart as LineIcon } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/calc';

export function TrendCharts() {
  const { dailyRecords } = useLayerOS();
  const [activeChart, setActiveChart] = useState<'hd' | 'feed' | 'mortality' | 'financial'>('hd');

  // Take the last 30 records for high-resolution trend
  const last30 = dailyRecords.slice(-30).map(r => ({
    date: r.recordDate.substring(5), // MM-DD
    fullDate: r.recordDate,
    hdPct: r.hdPct,
    breedTargetHd: 91.5,
    feedPerBird: r.feedPerBirdG,
    feedTarget: 110.0,
    mortality: r.mortality,
    revenue: Math.round(r.totalEggsCollected * r.sellingPricePerEgg + (r.otherIncome || 0)),
    cashExpense: Math.round(r.feedIssuedKg * r.feedPricePerKg + r.otherCashExpenses),
    profit: r.simpleOperatingProfit,
    trueProfit: r.trueProfit,
    breakEven: r.breakEvenEggPrice,
    sellingRate: r.sellingPricePerEgg,
  }));

  return (
    <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] shadow-xs">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DCD3C3] dark:border-[#263B30] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EAF3EF] dark:bg-[#182B22] flex items-center justify-center text-[#1F4D3A] dark:text-[#3BA378]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
              ३०-दिवसीय कल व विश्लेषण (30-Day Trends)
            </h3>
            <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
              उत्पादन, खुराक, मृत्यू आणि नफा/तोटा आलेखाद्वारे
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-[#F8F6F0] dark:bg-[#1A2D23] p-1 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] overflow-x-auto">
          <button
            onClick={() => setActiveChart('hd')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
              activeChart === 'hd'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold'
            }`}
          >
            HD% उत्पादन
          </button>
          <button
            onClick={() => setActiveChart('feed')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
              activeChart === 'feed'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold'
            }`}
          >
            खुराक (g/पक्षी)
          </button>
          <button
            onClick={() => setActiveChart('mortality')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
              activeChart === 'mortality'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold'
            }`}
          >
            मृत्यू दर
          </button>
          <button
            onClick={() => setActiveChart('financial')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
              activeChart === 'financial'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold'
            }`}
          >
            महसूल व नफा
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full mt-4">
        {activeChart === 'hd' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCD3C3" opacity={0.6} />
              <XAxis dataKey="date" stroke="#2D4538" fontSize={11} tick={{ fill: '#2D4538', fontWeight: 600 }} tickMargin={5} />
              <YAxis domain={[85, 96]} stroke="#2D4538" fontSize={11} tick={{ fill: '#2D4538', fontWeight: 600 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1E15',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #2D6B52',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                formatter={(value: any) => [`${value}%`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="hdPct"
                name="प्रत्यक्ष HD% उत्पादन"
                stroke="#1F4D3A"
                strokeWidth={3}
                dot={{ r: 3, fill: '#1F4D3A' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="breedTargetHd"
                name="ब्रीड टार्गेट (९१.५%)"
                stroke="#D9A441"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'feed' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCD3C3" opacity={0.6} />
              <XAxis dataKey="date" stroke="#2D4538" fontSize={11} tick={{ fill: '#2D4538', fontWeight: 600 }} tickMargin={5} />
              <YAxis domain={[100, 120]} stroke="#2D4538" fontSize={11} tick={{ fill: '#2D4538', fontWeight: 600 }} unit="g" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1E15',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #2D6B52',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                formatter={(value: any) => [`${value} g/पक्षी`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="feedPerBird"
                name="खुराक वापर (g/पक्षी)"
                stroke="#2E7D5B"
                strokeWidth={3}
                dot={{ r: 3, fill: '#2E7D5B' }}
              />
              <Line
                type="monotone"
                dataKey="feedTarget"
                name="मानक टार्गेट (११०g)"
                stroke="#D98E04"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'mortality' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCD3C3" opacity={0.6} />
              <XAxis dataKey="date" stroke="#2D4538" fontSize={11} tick={{ fill: '#2D4538', fontWeight: 600 }} tickMargin={5} />
              <YAxis stroke="#2D4538" fontSize={11} tick={{ fill: '#2D4538', fontWeight: 600 }} unit=" पक्षी" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#B3382C',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                formatter={(value: any) => [`${value} पक्षी`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }} />
              <Bar
                dataKey="mortality"
                name="दैनिक मृत्यू (संख्या)"
                fill="#B3382C"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'financial' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCD3C3" opacity={0.6} />
              <XAxis dataKey="date" stroke="#2D4538" fontSize={11} tick={{ fill: '#2D4538', fontWeight: 600 }} tickMargin={5} />
              <YAxis
                stroke="#2D4538"
                fontSize={11}
                tick={{ fill: '#2D4538', fontWeight: 600 }}
                tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1E15',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #2D6B52',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                formatter={(value: any) => [formatIndianCurrency(value)]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="एकूण महसूल"
                stroke="#2E7D5B"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="cashExpense"
                name="थेट रोख खर्च"
                stroke="#D98E04"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="थेट नफा (Cash)"
                stroke="#1F4D3A"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="trueProfit"
                name="खरा नफा (True Profit)"
                stroke="#D9A441"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
