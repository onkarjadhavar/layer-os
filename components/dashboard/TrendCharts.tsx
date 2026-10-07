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

  const chartTabs = [
    { key: 'hd' as const, label: 'HD% उत्पादन' },
    { key: 'feed' as const, label: 'खुराक (g/पक्षी)' },
    { key: 'mortality' as const, label: 'मृत्यू दर' },
    { key: 'financial' as const, label: 'महसूल व नफा' },
  ];

  const tooltipStyle = {
    backgroundColor: '#013E37',
    color: '#FFFFFF',
    borderRadius: '10px',
    border: '1px solid rgba(255, 239, 179, 0.2)',
    fontSize: '12px',
    fontWeight: '600' as const,
    padding: '8px 12px',
  };

  return (
    <div className="card-layer p-5 border border-[#E8E4DA] dark:border-[#1E3F36] bg-white dark:bg-[#122A23]">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E4DA] dark:border-[#1E3F36] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#E8F3F1] dark:bg-[#0C2B26] flex items-center justify-center text-[#013E37] dark:text-[#3DAE7E]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0C1F1A] dark:text-white">
              ३०-दिवसीय कल व विश्लेषण (30-Day Trends)
            </h3>
            <p className="text-xs font-normal text-[#6B8A7F] dark:text-[#6E9487] mt-0.5">
              उत्पादन, खुराक, मृत्यू आणि नफा/तोटा आलेखाद्वारे
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-0.5 bg-[#F5F3EE] dark:bg-[#152E27] p-1 rounded-lg border border-[#E8E4DA] dark:border-[#1E3F36] overflow-x-auto">
          {chartTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveChart(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs transition-all whitespace-nowrap ${
                activeChart === tab.key
                  ? 'bg-[#013E37] text-white shadow-sm font-semibold'
                  : 'text-[#3D5C53] dark:text-[#9BB5AB] hover:text-[#0C1F1A] dark:hover:text-white font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full mt-4">
        {activeChart === 'hd' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" opacity={0.5} />
              <XAxis dataKey="date" stroke="#6B8A7F" fontSize={11} tick={{ fill: '#6B8A7F', fontWeight: 500 }} tickMargin={5} />
              <YAxis domain={[85, 96]} stroke="#6B8A7F" fontSize={11} tick={{ fill: '#6B8A7F', fontWeight: 500 }} unit="%" />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value}%`]} />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="hdPct"
                name="प्रत्यक्ष HD% उत्पादन"
                stroke="#013E37"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#013E37', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#013E37', stroke: '#FFEFB3', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="breedTargetHd"
                name="ब्रीड टार्गेट (९१.५%)"
                stroke="#C9A23C"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'feed' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" opacity={0.5} />
              <XAxis dataKey="date" stroke="#6B8A7F" fontSize={11} tick={{ fill: '#6B8A7F', fontWeight: 500 }} tickMargin={5} />
              <YAxis domain={[100, 120]} stroke="#6B8A7F" fontSize={11} tick={{ fill: '#6B8A7F', fontWeight: 500 }} unit="g" />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value} g/पक्षी`]} />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="feedPerBird"
                name="खुराक वापर (g/पक्षी)"
                stroke="#1A6B4A"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#1A6B4A', strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="feedTarget"
                name="मानक टार्गेट (११०g)"
                stroke="#C9A23C"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'mortality' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" opacity={0.5} />
              <XAxis dataKey="date" stroke="#6B8A7F" fontSize={11} tick={{ fill: '#6B8A7F', fontWeight: 500 }} tickMargin={5} />
              <YAxis stroke="#6B8A7F" fontSize={11} tick={{ fill: '#6B8A7F', fontWeight: 500 }} unit=" पक्षी" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#A63229',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
                formatter={(value: any) => [`${value} पक्षी`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
              <Bar
                dataKey="mortality"
                name="दैनिक मृत्यू (संख्या)"
                fill="#A63229"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'financial' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" opacity={0.5} />
              <XAxis dataKey="date" stroke="#6B8A7F" fontSize={11} tick={{ fill: '#6B8A7F', fontWeight: 500 }} tickMargin={5} />
              <YAxis
                stroke="#6B8A7F"
                fontSize={11}
                tick={{ fill: '#6B8A7F', fontWeight: 500 }}
                tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [formatIndianCurrency(value)]} />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="एकूण महसूल"
                stroke="#1A6B4A"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="cashExpense"
                name="थेट रोख खर्च"
                stroke="#B88B1A"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="थेट नफा (Cash)"
                stroke="#013E37"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="trueProfit"
                name="खरा नफा (True Profit)"
                stroke="#C9A23C"
                strokeWidth={1.5}
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
