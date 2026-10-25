'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { formatIndianCurrency } from '@/lib/calc';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Plus,
  Scale,
  Calendar,
  AlertCircle,
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
} from 'recharts';

export function MarketRatesModule() {
  const { marketRates, addMarketRate, todayRecord } = useLayerOS();
  const { t } = useI18n();

  const [unitView, setUnitView] = useState<'per_100' | 'per_egg'>('per_100');
  const [selectedMandi, setSelectedMandi] = useState('पुणे (Pune)');

  // New Rate Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [mandiInput, setMandiInput] = useState('पुणे (Pune)');
  const [rate100Input, setRate100Input] = useState(540);
  const [trendInput, setTrendInput] = useState<'up' | 'down' | 'steady'>('up');

  const todayPuneRate = marketRates.find(m => m.mandiName.includes('Pune'))?.ratePerEgg || 5.40;
  const breakEven = todayRecord?.breakEvenEggPrice || 5.21;

  // Hold vs Sell logic
  const diffFromBreakEven = Number((todayPuneRate - breakEven).toFixed(2));
  let holdVsSellAdvice = {
    decision: 'विक्री करा (Strong Sell)',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    reason: `आजचा पुणे बाजार भाव (₹${todayPuneRate}/अंडे) हा आपल्या ब्रेक-इव्हन दरापेक्षा (₹${breakEven}) जास्त आहे आणि मागील १४ दिवसांच्या सरासरीपेक्षा चांगला आहे. माल साठवून न ठेवता दररोजचा साठा तत्काळ विक्री करा.`,
  };

  if (diffFromBreakEven < 0) {
    holdVsSellAdvice = {
      decision: 'साठा राखा किंवा करार करा (Hold / Contract)',
      badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
      reason: `बाजार भाव सध्या ब्रेक-इव्हनपेक्षा कमी आहे. शक्य असल्यास थेट ग्राहकांना किंवा हॉटेल/बेकऱ्यांना प्रीमियम दराने विक्री करावी.`,
    };
  } else if (diffFromBreakEven < 0.20) {
    holdVsSellAdvice = {
      decision: 'संतुलित विक्री (Normal Sell)',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      reason: `भाव ब्रेक-इव्हनच्या जवळ आहेत. जोखीम न घेता नियमित कोटा पूर्ण करा.`,
    };
  }

  // 14-day mock historical rates for chart
  const historicalMandiTrends = [
    { day: '२४ सप्टें', Pune: 510, Mumbai: 525, Namakkal: 490, breakEven: 521 },
    { day: '२६ सप्टें', Pune: 515, Mumbai: 530, Namakkal: 495, breakEven: 521 },
    { day: '२८ सप्टें', Pune: 520, Mumbai: 535, Namakkal: 500, breakEven: 521 },
    { day: '३० सप्टें', Pune: 525, Mumbai: 540, Namakkal: 505, breakEven: 521 },
    { day: '०२ ऑक्टो', Pune: 530, Mumbai: 545, Namakkal: 510, breakEven: 521 },
    { day: '०४ ऑक्टो', Pune: 535, Mumbai: 550, Namakkal: 512, breakEven: 521 },
    { day: '०६ ऑक्टो', Pune: 538, Mumbai: 552, Namakkal: 515, breakEven: 521 },
    { day: '०७ ऑक्टो (आज)', Pune: 540, Mumbai: 555, Namakkal: 515, breakEven: 521 },
  ];

  const handleAddRate = (e: React.FormEvent) => {
    e.preventDefault();
    addMarketRate({
      mandiName: mandiInput,
      rateDate: new Date().toISOString().split('T')[0],
      ratePer100: Number(rate100Input),
      ratePerEgg: Number((rate100Input / 100).toFixed(2)),
      trend: trendInput,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Header */}
      <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DCD3C3] dark:border-[#263B30] gap-3">
          <div>
            <h2 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>दैनिक बाजार भाव (Live Mandi Egg Rates)</span>
            </h2>
            <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
              पुणे, मुंबई, नाशिक, नागपूर व नमक्कल बाजार भाव व माल राखावा की विकावा (Hold vs Sell) सल्ला
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Unit Switcher */}
            <div className="flex items-center bg-[#F8F6F0] dark:bg-[#1A2D23] p-1 rounded-xl border border-[#DCD3C3] dark:border-[#263B30]">
              <button
                onClick={() => setUnitView('per_100')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  unitView === 'per_100' ? 'bg-[#1F4D3A] text-white shadow-sm' : 'text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15]'
                }`}
              >
                प्रति १०० अंडी
              </button>
              <button
                onClick={() => setUnitView('per_egg')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  unitView === 'per_egg' ? 'bg-[#1F4D3A] text-white shadow-sm' : 'text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15]'
                }`}
              >
                प्रति अंडे
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="py-2.5 px-3.5 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#D9A441]" />
              <span className="hidden sm:inline">भाव नोंदवा</span>
            </button>
          </div>
        </div>

        {/* Hold vs Sell Strategic Decision Card */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#FAF8F3] to-[#EAF3EF] dark:from-[#1F3027] dark:to-[#182B22] border-2 border-[#2D6B52]/40 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D9A441]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1F4D3A] dark:text-[#3BA378]">
                होल्ड vs सेल इंडिकेटर (Hold vs Sell Indicator)
              </h3>
            </div>
            <span className={`text-xs font-black px-3 py-1 rounded-full uppercase ${holdVsSellAdvice.badgeColor}`}>
              {holdVsSellAdvice.decision}
            </span>
          </div>

          <p className="text-xs text-[#0B1E15] dark:text-white font-bold leading-relaxed">
            {holdVsSellAdvice.reason}
          </p>
          <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-1.5">
            * ही केवळ माहितीपर शिफारस आहे. स्थानिक बाजारपेठेच्या परिस्थितीनुसार अंतिम निर्णय घ्यावा.
          </div>
        </div>

        {/* Mandi Rates Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
          {marketRates.map(m => {
            const displayRate = unitView === 'per_100' ? `₹${m.ratePer100}` : `₹${m.ratePerEgg.toFixed(2)}`;
            const subtext = unitView === 'per_100' ? `(₹${m.ratePerEgg.toFixed(2)}/अंडे)` : `(₹${m.ratePer100}/१००)`;

            return (
              <div
                key={m.mandiName}
                className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] hover:border-[#1F4D3A] transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between text-xs font-black text-[#2D4538] dark:text-[#CBDCD4]">
                  <span className="truncate">{m.mandiName}</span>
                  {m.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-emerald-600" />}
                  {m.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-600" />}
                  {m.trend === 'steady' && <Minus className="w-4 h-4 text-gray-500" />}
                </div>

                <div className="text-xl font-black text-[#0B1E15] dark:text-white mt-1.5">
                  {displayRate}
                </div>

                <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-semibold mt-0.5">
                  {subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 14-Day Trend Comparison vs Farm Break-Even Line */}
      <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] shadow-xs">
        <div className="pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
          <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
            बाजार भाव तुलना व ब्रेक-इव्हन रेषा (Mandi Rate Trend vs Break-Even)
          </h3>
          <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
            पुणे, मुंबई आणि फार्म ब्रेक-इव्हन (₹५२१/१०० अंडी) चा ऐतिहासिक कल
          </p>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalMandiTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCD3C3" opacity={0.6} />
              <XAxis dataKey="day" stroke="#2D4538" fontSize={11} tick={{ fill: '#2D4538', fontWeight: 600 }} />
              <YAxis domain={[480, 570]} stroke="#2D4538" fontSize={11} tick={{ fill: '#2D4538', fontWeight: 600 }} unit=" ₹" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1E15',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #2D6B52',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                formatter={(val: any) => [`₹${val}/100`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="Pune"
                name="पुणे (Pune)"
                stroke="#1F4D3A"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Mumbai"
                name="मुंबई (Mumbai)"
                stroke="#2E7D5B"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="breakEven"
                name="आपला ब्रेक-इव्हन (₹५२१)"
                stroke="#B3382C"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add New Rate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddRate} className="w-full max-w-sm bg-white dark:bg-[#16241D] rounded-2xl p-6 border shadow-xl space-y-4">
            <h4 className="text-sm font-bold">बाजार भाव प्रविष्ट करा</h4>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">मार्केट / मंडी निवडा</label>
              <select
                value={mandiInput}
                onChange={e => setMandiInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
              >
                <option value="पुणे (Pune)">पुणे (Pune)</option>
                <option value="मुंबई (Mumbai)">मुंबई (Mumbai)</option>
                <option value="नाशिक (Nashik)">नाशिक (Nashik)</option>
                <option value="नागपूर (Nagpur)">नागपूर (Nagpur)</option>
                <option value="नमक्कल (Namakkal)">नमक्कल (Namakkal)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">दर प्रति १०० अंडी (₹)</label>
              <input
                type="number"
                required
                value={rate100Input}
                onChange={e => setRate100Input(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-base font-black text-[#D9A441]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">बाजाराचा कल (Trend)</label>
              <select
                value={trendInput}
                onChange={e => setTrendInput(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#0B1E15] dark:text-white text-xs font-bold"
              >
                <option value="up">वाढता (Up ↑)</option>
                <option value="steady">स्थिर (Steady →)</option>
                <option value="down">घसरता (Down ↓)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg border text-xs font-bold"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#1F4D3A] text-white text-xs font-bold"
              >
                साठवा
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
