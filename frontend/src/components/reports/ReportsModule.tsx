'use client';

import React, { useState, useMemo } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calc';
import {
  FileSpreadsheet,
  Share2,
  Download,
  Printer,
  Calendar,
  Sparkles,
  Egg,
  Wheat,
  CheckCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CircleDollarSign,
  X,
  ShieldCheck,
  Layers,
  Activity,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function ReportsModule() {
  const { farm, flock, dailyRecords, customers, isDemoMode, addQuickLog } = useLayerOS();
  const { t } = useI18n();

  // Tab: 'daily-card' | 'monthly-mis' | 'outstanding'
  const [reportType, setReportType] = useState<'daily-card' | 'monthly-mis' | 'outstanding'>('daily-card');

  // Sorted chronological records strictly isolated to enrolled farm when not in demo mode
  const sortedRecords = useMemo(() => {
    const list = isDemoMode
      ? dailyRecords
      : dailyRecords.filter(r => r.farmId === farm.id && r.farmId !== 'farm-sahyadri-01' && r.farmId !== 'farm-anand-02');
    return [...list].sort((a, b) => a.recordDate.localeCompare(b.recordDate));
  }, [dailyRecords, isDemoMode, farm.id]);

  // Selected date index (default to latest recorded day)
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(() => {
    return sortedRecords.length > 0 ? sortedRecords.length - 1 : 0;
  });

  // Keep selected index in bounds if records change
  const activeRecord = useMemo(() => {
    if (sortedRecords.length === 0) return null;
    const idx = Math.min(Math.max(0, selectedDayIdx), sortedRecords.length - 1);
    return sortedRecords[idx];
  }, [sortedRecords, selectedDayIdx]);

  // Next date calculation for adding new daily entry
  const nextSuggestedDate = useMemo(() => {
    if (sortedRecords.length === 0) {
      return new Date().toISOString().split('T')[0];
    }
    const lastDateStr = sortedRecords[sortedRecords.length - 1].recordDate;
    const d = new Date(lastDateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, [sortedRecords]);

  // Modal state for adding a new day entry right from reports
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [entryDate, setEntryDate] = useState(nextSuggestedDate);
  const [entryEggs, setEntryEggs] = useState(activeRecord ? String(activeRecord.totalEggsCollected) : '');
  const [entryFeedKg, setEntryFeedKg] = useState(activeRecord ? String(activeRecord.feedIssuedKg) : '');
  const [entryMortality, setEntryMortality] = useState(activeRecord ? String(activeRecord.mortality) : '0');
  const [entrySellingRate, setEntrySellingRate] = useState(activeRecord ? String(activeRecord.sellingPricePerEgg) : '5.40');
  const [isSavingEntry, setIsSavingEntry] = useState(false);

  // When opening add modal, refresh pre-fill values
  const handleOpenAddModal = () => {
    setEntryDate(nextSuggestedDate);
    if (activeRecord) {
      setEntryEggs(String(activeRecord.totalEggsCollected));
      setEntryFeedKg(String(activeRecord.feedIssuedKg));
      setEntrySellingRate(String(activeRecord.sellingPricePerEgg));
      setEntryMortality(String(activeRecord.mortality));
    } else {
      setEntryEggs('');
      setEntryFeedKg('');
      setEntryMortality('0');
      setEntrySellingRate('5.40');
    }
    setIsAddModalOpen(true);
  };

  // Quick live computation in Add Entry Modal
  const inputEggsNum = Number(entryEggs) || 0;
  const inputFeedNum = Number(entryFeedKg) || 0;
  const inputMortNum = Number(entryMortality) || 0;
  const inputRateNum = Number(entrySellingRate) || 5.40;
  const baseBirds = activeRecord ? activeRecord.closingBirds : (flock.currentBirdCount || farm.totalCapacity || 10000);
  const previewClosing = Math.max(0, baseBirds - inputMortNum);
  const previewHd = previewClosing > 0 ? Number(((inputEggsNum / previewClosing) * 100).toFixed(1)) : 0;
  const previewFeedG = previewClosing > 0 ? Math.round((inputFeedNum * 1000) / previewClosing) : 0;
  const previewRev = Math.round(inputEggsNum * inputRateNum);
  const previewCost = Math.round((inputFeedNum * 35.0) + 1600);
  const previewProfit = previewRev - previewCost;

  const handleSaveDailyEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEntry(true);
    try {
      await addQuickLog({
        recordDate: entryDate,
        eggsCollected: inputEggsNum,
        feedKg: inputFeedNum,
        mortality: inputMortNum,
        soldQtyEggs: inputEggsNum,
        sellingRate: inputRateNum,
      });

      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1F4D3A', '#D9A441', '#3BA378', '#FFFFFF'],
      });

      setIsAddModalOpen(false);
      // Select the newly added or updated day
      setTimeout(() => {
        const newLen = sortedRecords.length + 1;
        setSelectedDayIdx(newLen - 1);
      }, 100);
    } finally {
      setIsSavingEntry(false);
    }
  };

  // Monthly aggregated KPIs
  const monthlyStats = useMemo(() => {
    const count = sortedRecords.length;
    if (count === 0) {
      return { totalEggs: 0, totalFeedKg: 0, totalMortality: 0, avgHdPct: 0, totalRevenue: 0, totalProfit: 0 };
    }
    const totalEggs = sortedRecords.reduce((sum, r) => sum + r.totalEggsCollected, 0);
    const totalFeedKg = sortedRecords.reduce((sum, r) => sum + r.feedIssuedKg, 0);
    const totalMortality = sortedRecords.reduce((sum, r) => sum + r.mortality, 0);
    const avgHdPct = (sortedRecords.reduce((sum, r) => sum + r.hdPct, 0) / count).toFixed(1);
    const totalRevenue = sortedRecords.reduce((sum, r) => sum + Math.round(r.totalEggsCollected * r.sellingPricePerEgg), 0);
    const totalProfit = sortedRecords.reduce((sum, r) => sum + r.simpleOperatingProfit, 0);

    return { totalEggs, totalFeedKg, totalMortality, avgHdPct, totalRevenue, totalProfit };
  }, [sortedRecords]);

  const totalOutstanding = customers.reduce((sum, c) => sum + c.currentOutstanding, 0);

  // Current day index (1-based)
  const currentDayNumber = selectedDayIdx + 1;
  const totalDaysRecorded = sortedRecords.length;
  const progressPercent = Math.min(100, Math.round((totalDaysRecorded / 30) * 100));

  // WhatsApp Message for Selected Day
  const waReportMessage = useMemo(() => {
    if (!activeRecord) return '';
    return encodeURIComponent(
      `*📊 ${farm.name} - दैनिक पोल्ट्री अहवाल*
📅 दिनांक: ${activeRecord.recordDate} (दिवस ${currentDayNumber} / ३० - महिना १)
🐣 बॅच: ${flock.batchCode} (${flock.ageWeeks} आठवडे)

🐔 जिवंत पक्षी: ${formatIndianNumber(activeRecord.closingBirds)}
🥚 गोळा झालेली अंडी: ${formatIndianNumber(activeRecord.totalEggsCollected)}
📈 उत्पादन (HD%): ${activeRecord.hdPct}% (मानक: ९१.५%)
🌾 वापरलेला खुराक: ${formatIndianNumber(activeRecord.feedIssuedKg)} kg (${activeRecord.feedPerBirdG} g/पक्षी)
💀 मृत्यू: ${activeRecord.mortality} पक्षी

💰 *आर्थिक सारांश:*
• आजचा विक्री दर: ₹${activeRecord.sellingPricePerEgg}/अंडी (₹${Math.round(activeRecord.sellingPricePerEgg * 100)}/१००)
• ब्रेक-इव्हन दर: ₹${activeRecord.breakEvenEggPrice}/अंडी
• एकूण विक्री महसूल: ₹${formatIndianNumber(Math.round(activeRecord.totalEggsCollected * activeRecord.sellingPricePerEgg))}
• थेट नफा (Operating Profit): ₹${formatIndianNumber(activeRecord.simpleOperatingProfit)}
• खरा नफा (True Profit): ₹${formatIndianNumber(activeRecord.trueProfit)}

_LayerOS AI Poultry ERP द्वारे सुरक्षित संकलित_`
    );
  }, [activeRecord, currentDayNumber, farm.name, flock.batchCode, flock.ageWeeks]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = "DayNumber,Date,ClosingBirds,EggsCollected,HDPct,FeedKg,FeedPerBirdG,Mortality,SellingRate,OperatingProfit,TrueProfit\n";
    const rows = sortedRecords.map((r, i) =>
      `Day ${i + 1},${r.recordDate},${r.closingBirds},${r.totalEggsCollected},${r.hdPct},${r.feedIssuedKg},${r.feedPerBirdG},${r.mortality},${r.sellingPricePerEgg},${r.simpleOperatingProfit},${r.trueProfit}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${farm.name.replace(/\s+/g, '_')}_Monthly_Reports_${activeRecord?.recordDate || '2026'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* 0. DEMO NOTICE BANNER (Strictly shown in demo preview mode only) */}
      {isDemoMode && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚠️</span>
            <div>
              <strong className="text-amber-900 dark:text-amber-200 block font-bold">
                प्रात्यक्षिक नमुना डेटा (Demo Preview Mode — सह्याद्री लेयर फार्म)
              </strong>
              <p className="text-amber-800 dark:text-amber-300">
                हे नवीन ग्राहकांसाठी नमुना प्रात्यक्षिक आहे. आपल्या स्वतःच्या पोल्ट्री फार्मसाठी शून्य डेटासह नवीन लेयर ओएस सुरू करण्यासाठी येथे नोंदणी करा.
              </p>
            </div>
          </div>
          <a
            href="/enroll"
            className="shrink-0 px-4 py-2 rounded-xl bg-[#173F20] hover:bg-[#1e4e29] text-white font-bold text-xs shadow-sm transition-all text-center"
          >
            नवीन फार्म नोंदवा (Enroll Farm) →
          </a>
        </div>
      )}

      {/* 1. TOP HEADER & TENANT BRANDING */}
      <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] rounded-3xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#E7E2D6] dark:border-[#263B30] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {isDemoMode ? (
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 flex items-center gap-1 border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  प्रात्यक्षिक नमुना (Demo Preview Data)
                </span>
              ) : (
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#1F4D3A]/10 dark:bg-[#3BA378]/20 text-[#1F4D3A] dark:text-[#3BA378] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  नोंदणीकृत पोल्ट्री (Enrolled Customer OS)
                </span>
              )}
              <span className="text-xs font-bold text-[#6B7280] dark:text-gray-400">
                {isDemoMode ? '• नमुना डेटा (Sample Data)' : `• स्वतंत्र सुरक्षित ॲक्सेस (${farm.name})`}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>{farm.name} — अहवाल व प्रगती (Reports & MIS)</span>
            </h2>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-1">
              आरंभीच्या पहिल्या दिवसापासून दैनिक नोंदी, WhatsApp शेअरिंग, PDF प्रिंट आणि मासिक ३०-दिवसीय कामगिरी
            </p>
          </div>

          {/* Top Actions: Export CSV, Print, and Add Day */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleOpenAddModal}
              className="py-2.5 px-4 rounded-xl bg-[#D9A441] hover:bg-[#C29035] text-[#0B1E15] text-xs font-black flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन दिवसाची नोंद करा (+ Day {totalDaysRecorded + 1})</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="py-2.5 px-3 rounded-xl border border-[#E7E2D6] dark:border-[#263B30] text-xs font-bold text-[#0B1E15] dark:text-white flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-[#1F3027] transition-colors"
            >
              <Download className="w-4 h-4 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>Excel (CSV)</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>PDF प्रिंट करा</span>
            </button>
          </div>
        </div>

        {/* 30-Day Monthly Progress Tracker Bar */}
        <div className="mt-4 pt-1">
          <div className="flex items-center justify-between text-xs font-black mb-1.5">
            <span className="text-[#0B1E15] dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D9A441]" />
              <span>महिना १ प्रगती (Month 1 Timeline):</span>
              <span className="text-[#1F4D3A] dark:text-[#3BA378] font-black">
                {totalDaysRecorded} / ३० दिवस पूर्ण ({progressPercent}%)
              </span>
            </span>
            <span className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium hidden sm:inline">
              नोंदणी दिवस: {sortedRecords[0]?.recordDate || 'आज'} पासून अखंडित ट्रॅकिंग
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-[#E7E2D6] dark:border-[#263B30]">
            <div
              className="h-full bg-gradient-to-r from-[#1F4D3A] via-[#2E7D5B] to-[#D9A441] transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setReportType('daily-card')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${reportType === 'daily-card'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15]'
              }`}
          >
            <Egg className="w-4 h-4" />
            <span>दैनिक रिपोर्ट कार्ड (Day-by-Day Card)</span>
          </button>
          <button
            onClick={() => setReportType('monthly-mis')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${reportType === 'monthly-mis'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15]'
              }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>मासिक सारांश व ३० दिवस ट्रॅकर (Monthly MIS)</span>
          </button>
          <button
            onClick={() => setReportType('outstanding')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${reportType === 'outstanding'
                ? 'bg-[#1F4D3A] text-white shadow-sm'
                : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15]'
              }`}
          >
            <CircleDollarSign className="w-4 h-4" />
            <span>थकबाकी व लेजर (Receivables)</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: DAILY REPORT CARD */}
      {reportType === 'daily-card' && !activeRecord && (
        <div className="card-layer p-8 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] flex items-center justify-center text-[#1F4D3A] dark:text-[#3BA378] text-2xl font-black">
            📝
          </div>
          <h3 className="text-lg font-black text-[#0B1E15] dark:text-white">
            अद्याप कोणतीही दैनंदिन नोंद उपलब्ध नाही
          </h3>
          <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] leading-relaxed">
            आपला पोल्ट्री फार्म <strong>{farm.name}</strong> नोंदणीनुसार सज्ज आहे. दिवस १ चा अहवाल, अंडी उत्पादन (HD%), खुराक वापर व नफा-तोटा विश्लेषण पाहण्यासाठी कृपया पहिली दैनंदिन नोंद करा.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="py-3 px-6 rounded-2xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white font-black text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D9A441]" />
            <span>+ दिवस १ ची नोंद करा (Log Day 1 Entry)</span>
          </button>
        </div>
      )}

      {reportType === 'daily-card' && activeRecord && (
        <div className="space-y-4">
          {/* Day Navigation & Selector Bar */}
          <div className="card-layer p-4 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button
                disabled={selectedDayIdx <= 0}
                onClick={() => setSelectedDayIdx(prev => Math.max(0, prev - 1))}
                className="p-2 rounded-xl border border-[#E7E2D6] dark:border-[#263B30] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#1F3027] text-[#0B1E15] dark:text-white"
                title="मागील दिवस"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-center px-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#D9A441] block">
                  निवडलेला दिवस (Selected Day)
                </span>
                <span className="text-sm font-black text-[#0B1E15] dark:text-white">
                  दिवस {currentDayNumber} • {activeRecord.recordDate}
                </span>
              </div>

              <button
                disabled={selectedDayIdx >= sortedRecords.length - 1}
                onClick={() => setSelectedDayIdx(prev => Math.min(sortedRecords.length - 1, prev + 1))}
                className="p-2 rounded-xl border border-[#E7E2D6] dark:border-[#263B30] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#1F3027] text-[#0B1E15] dark:text-white"
                title="पुढील दिवस"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Day Dropdown / Pills */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-[#6B7280] dark:text-gray-400 whitespace-nowrap">
                जलद निवडा:
              </span>
              <div className="flex items-center gap-1.5 flex-nowrap">
                {sortedRecords.map((r, i) => (
                  <button
                    key={r.id || r.recordDate}
                    onClick={() => setSelectedDayIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all ${i === selectedDayIdx
                        ? 'bg-[#1F4D3A] text-white shadow-xs'
                        : 'bg-[#FAF8F3] dark:bg-[#1F3027] text-[#2D4538] dark:text-[#CBDCD4] hover:bg-emerald-50 dark:hover:bg-emerald-950'
                      }`}
                  >
                    दिवस {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actual Report Card for Selected Day */}
          <div className="card-layer p-6 md:p-8 border-2 border-[#1F4D3A]/20 bg-white dark:bg-[#16241D] max-w-3xl mx-auto rounded-3xl shadow-xl space-y-6">
            {/* Farm Branding Top */}
            <div className="text-center pb-5 border-b border-[#E7E2D6] dark:border-[#263B30]">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1F4D3A] text-white flex items-center justify-center font-black text-2xl mb-2 shadow-md border border-[#D9A441]">
                🥚
              </div>
              <h3 className="text-xl font-black text-[#0B1E15] dark:text-white">
                {farm.name}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-1 text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] flex-wrap">
                <span className="bg-[#FAF8F3] dark:bg-[#1F3027] px-2.5 py-0.5 rounded-md border border-[#E7E2D6] dark:border-[#263B30] text-[#1F4D3A] dark:text-[#3BA378] font-black">
                  दिवस {currentDayNumber} चा अधिकृत अहवाल
                </span>
                <span>•</span>
                <span>दिनांक: {activeRecord.recordDate}</span>
                <span>•</span>
                <span>बॅच: {flock.batchCode} ({flock.ageWeeks} आठवडे)</span>
              </div>
            </div>

            {/* 4 Core Production Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30]">
                <div className="text-[#6B7280] dark:text-[#CBDCD4] font-bold">जिवंत पक्षी (Closing)</div>
                <div className="text-base sm:text-lg font-black text-[#0B1E15] dark:text-white mt-0.5">
                  {formatIndianNumber(activeRecord.closingBirds)}
                </div>
                <div className="text-[10px] text-red-600 font-bold mt-1">
                  मृत्यू: {activeRecord.mortality} पक्षी
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30]">
                <div className="text-[#6B7280] dark:text-[#CBDCD4] font-bold">गोळा झालेली अंडी</div>
                <div className="text-base sm:text-lg font-black text-[#1F4D3A] dark:text-[#3BA378] mt-0.5">
                  {formatIndianNumber(activeRecord.totalEggsCollected)}
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                  चांगली: {formatIndianNumber(activeRecord.goodEggs || activeRecord.totalEggsCollected)}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30]">
                <div className="text-[#6B7280] dark:text-[#CBDCD4] font-bold">उत्पादन (HD%)</div>
                <div className="text-base sm:text-lg font-black text-[#1F4D3A] dark:text-[#3BA378] mt-0.5">
                  {activeRecord.hdPct}%
                </div>
                <div className="text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-1">
                  मानक लक्ष्य: ९१.५%
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30]">
                <div className="text-[#6B7280] dark:text-[#CBDCD4] font-bold">वापरलेला खुराक</div>
                <div className="text-base sm:text-lg font-black text-[#0B1E15] dark:text-white mt-0.5">
                  {formatIndianNumber(activeRecord.feedIssuedKg)} kg
                </div>
                <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-1">
                  {activeRecord.feedPerBirdG} g / पक्षी
                </div>
              </div>
            </div>

            {/* Financial Breakdown Card */}
            <div className="p-5 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/30 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-800">
                <span className="font-black text-[#0B1E15] dark:text-white uppercase tracking-wider text-[11px]">
                  आर्थिक नफा-तोटा विश्लेषण (Day {currentDayNumber} P&L)
                </span>
                <span className="text-[#D9A441] font-black">
                  दर: ₹{activeRecord.sellingPricePerEgg}/अंडी (₹{Math.round(activeRecord.sellingPricePerEgg * 100)}/१००)
                </span>
              </div>

              <div className="flex justify-between font-bold text-[#0B1E15] dark:text-white">
                <span>अंडी विक्री महसूल (Revenue):</span>
                <span className="font-black">
                  {formatIndianCurrency(Math.round(activeRecord.totalEggsCollected * activeRecord.sellingPricePerEgg))}
                </span>
              </div>

              <div className="flex justify-between font-semibold text-[#2D4538] dark:text-[#CBDCD4]">
                <span>खुराक खर्च (Feed Cost):</span>
                <span className="font-bold">
                  -{formatIndianCurrency(Math.round(activeRecord.feedIssuedKg * 35.0))}
                </span>
              </div>

              <div className="flex justify-between font-semibold text-[#2D4538] dark:text-[#CBDCD4]">
                <span>इतर दैनंदिन खर्च (Daily Overhead):</span>
                <span className="font-bold">-{formatIndianCurrency(1600)}</span>
              </div>

              <div className="flex justify-between font-semibold text-[#2D4538] dark:text-[#CBDCD4]">
                <span>ब्रेक-इव्हन दर (Cost per egg):</span>
                <span className="font-bold">₹{activeRecord.breakEvenEggPrice} / अंडी</span>
              </div>

              <div className="flex justify-between font-black text-sm pt-2.5 border-t border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300">
                <span>थेट रोख नफा (Operating Profit):</span>
                <span>{formatIndianCurrency(activeRecord.simpleOperatingProfit)}</span>
              </div>

              <div className="flex justify-between font-black text-sm text-[#D9A441]">
                <span>घसारा व व्याज कपातीनंतर खरा नफा (True Profit):</span>
                <span>{formatIndianCurrency(activeRecord.trueProfit)}</span>
              </div>
            </div>

            {/* WhatsApp Share Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/?text=${waReportMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span>WhatsApp वर दिवस {currentDayNumber} चा अहवाल पाठवा</span>
              </a>

              <button
                onClick={handleOpenAddModal}
                className="py-3.5 px-4 rounded-2xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-5 h-5 text-[#D9A441]" />
                <span>पुढील दिवस नोंदवा (+ Day {totalDaysRecorded + 1})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: MONTHLY MIS TABLE & 30-DAY PROGRESSION */}
      {reportType === 'monthly-mis' && (
        <div className="space-y-5">
          {/* Cumulative Monthly Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="card-layer p-4 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] rounded-2xl">
              <span className="text-[#6B7280] dark:text-[#CBDCD4] font-bold block">एकूण अंडी संकलन</span>
              <span className="text-base sm:text-lg font-black text-[#1F4D3A] dark:text-[#3BA378] mt-1 block">
                {formatIndianNumber(monthlyStats.totalEggs)}
              </span>
              <span className="text-[10px] text-[#6B7280] dark:text-gray-400">महिना १ एकूण</span>
            </div>

            <div className="card-layer p-4 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] rounded-2xl">
              <span className="text-[#6B7280] dark:text-[#CBDCD4] font-bold block">एकूण खुराक वापर</span>
              <span className="text-base sm:text-lg font-black text-[#0B1E15] dark:text-white mt-1 block">
                {formatIndianNumber(monthlyStats.totalFeedKg)} kg
              </span>
              <span className="text-[10px] text-amber-600 font-bold">
                ~{Math.round(monthlyStats.totalFeedKg / 50)} पोती
              </span>
            </div>

            <div className="card-layer p-4 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] rounded-2xl">
              <span className="text-[#6B7280] dark:text-[#CBDCD4] font-bold block">सरासरी उत्पादन</span>
              <span className="text-base sm:text-lg font-black text-[#1F4D3A] dark:text-[#3BA378] mt-1 block">
                {monthlyStats.avgHdPct}%
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">मानक: ९१.५%</span>
            </div>

            <div className="card-layer p-4 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] rounded-2xl">
              <span className="text-[#6B7280] dark:text-[#CBDCD4] font-bold block">एकूण मृत्यू</span>
              <span className="text-base sm:text-lg font-black text-red-600 mt-1 block">
                {monthlyStats.totalMortality}
              </span>
              <span className="text-[10px] text-gray-500">पक्ष्यांची हानी</span>
            </div>

            <div className="card-layer p-4 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] rounded-2xl">
              <span className="text-[#6B7280] dark:text-[#CBDCD4] font-bold block">एकूण विक्री महसूल</span>
              <span className="text-base sm:text-lg font-black text-[#D9A441] mt-1 block">
                {formatIndianCurrency(monthlyStats.totalRevenue)}
              </span>
              <span className="text-[10px] text-gray-500">अंडी विक्री</span>
            </div>

            <div className="card-layer p-4 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] rounded-2xl">
              <span className="text-[#6B7280] dark:text-[#CBDCD4] font-bold block">एकूण रोख नफा</span>
              <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 mt-1 block">
                {formatIndianCurrency(monthlyStats.totalProfit)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">थेट नफा</span>
            </div>
          </div>

          {/* Month 1 MIS Table */}
          <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E7E2D6] dark:border-[#263B30] gap-2">
              <div>
                <h3 className="text-sm font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
                  <span>मासिक एमआयएस अहवाल तक्ता (Monthly MIS Table — Month 1)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#1F4D3A] text-white">
                    {totalDaysRecorded} दिवस नोंदणीकृत
                  </span>
                </h3>
                <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-0.5">
                  आरंभीच्या पहिल्या दिवसापासून प्रत्येक दिवसाची तपशीलवार कामगिरी
                </p>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="py-2 px-3 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>पुढील दिवस नोंदवा (+ Day {totalDaysRecorded + 1})</span>
              </button>
            </div>

            {sortedRecords.length === 0 ? (
              <div className="p-8 sm:p-12 text-center bg-[#FAF8F3] dark:bg-[#121E18] rounded-2xl border border-dashed border-[#DCD3C3] dark:border-[#263B30] space-y-4 my-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8F1C9] dark:bg-[#1A3024] flex items-center justify-center text-[#173F20] dark:text-[#E8F1C9] text-2xl font-black">
                  📊
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="text-base font-black text-[#0B1E15] dark:text-white">
                    अद्याप कोणतीही दैनिक नोंद केलेली नाही (No Daily Records Yet)
                  </h4>
                  <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] leading-relaxed">
                    तुमचा पोल्ट्री फार्म <strong>{farm.name}</strong> नोंदणीनुसार सज्ज आहे. जसे तुम्ही दररोज अंडी संकलन, खुराक व मृत्यूची नोंद कराल, तसे येथे महिना १, दिवस १ पासूनचा संपूर्ण ३०-दिवसीय अहवाल आपोआप साठवला जाईल.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="py-3 px-6 rounded-2xl bg-[#173F20] hover:bg-[#123118] text-white font-black text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D9A441]" />
                  <span>+ पहिली दैनिक नोंद करा (Log Day 1 Record)</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F3] dark:bg-[#1F3027] text-[#0B1E15] dark:text-white font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">दिवस #</th>
                      <th className="p-3">दिनांक</th>
                      <th className="p-3">जिवंत पक्षी</th>
                      <th className="p-3">अंडी संकलन</th>
                      <th className="p-3">HD%</th>
                      <th className="p-3">खुराक (kg)</th>
                      <th className="p-3">मृत्यू</th>
                      <th className="p-3">विक्री दर</th>
                      <th className="p-3">थेट नफा</th>
                      <th className="p-3 text-right">कृती</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-[#0B1E15] dark:text-white">
                    {sortedRecords.map((r, idx) => (
                      <tr
                        key={r.id || r.recordDate}
                        onClick={() => {
                          setSelectedDayIdx(idx);
                          setReportType('daily-card');
                        }}
                        className="hover:bg-gray-50/80 dark:hover:bg-[#1F3027]/70 cursor-pointer transition-colors"
                      >
                        <td className="p-3 font-black text-[#1F4D3A] dark:text-[#3BA378]">
                          दिवस {idx + 1}
                        </td>
                        <td className="p-3 font-bold">{r.recordDate}</td>
                        <td className="p-3 font-semibold">{formatIndianNumber(r.closingBirds)}</td>
                        <td className="p-3 font-black text-[#1F4D3A] dark:text-[#3BA378]">
                          {formatIndianNumber(r.totalEggsCollected)}
                        </td>
                        <td className="p-3 font-bold">{r.hdPct}%</td>
                        <td className="p-3 font-medium">{formatIndianNumber(r.feedIssuedKg)}</td>
                        <td className="p-3 text-red-600 font-black">{r.mortality}</td>
                        <td className="p-3 font-bold text-[#D9A441]">₹{r.sellingPricePerEgg}</td>
                        <td className="p-3 font-black text-emerald-700 dark:text-emerald-400">
                          {formatIndianCurrency(r.simpleOperatingProfit)}
                        </td>
                        <td className="p-3 text-right">
                          <span className="text-[11px] font-black text-[#1F4D3A] dark:text-[#3BA378] hover:underline flex items-center justify-end gap-1">
                            <span>अहवाल पहा</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB 3: CUSTOMER RECEIVABLES LEDGER */}
      {reportType === 'outstanding' && (
        <div className="card-layer p-5 border border-[#E7E2D6] dark:border-[#263B30] bg-white dark:bg-[#16241D] rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
            <div>
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                व्यापारी व ग्राहक थकबाकी यादी (Receivables Ledger)
              </h3>
              <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-0.5">
                एकूण येणे बाकी: <strong className="text-red-600 font-black">{formatIndianCurrency(totalOutstanding)}</strong>
              </p>
            </div>
          </div>

          {customers.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF8F3] dark:bg-[#121E18] rounded-2xl border border-dashed border-[#DCD3C3] dark:border-[#263B30] space-y-2">
              <p className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4]">
                सध्या कोणतीही व्यापारी किंवा ग्राहक थकबाकी नोंद नाही (No Receivables Outstanding).
              </p>
              <p className="text-[11px] text-[#6B7280] dark:text-gray-400">
                नवीन अंडी विक्री आणि व्यापारी खात्यांच्या नोंदीनंतर येथे थेट लेजर दिसेल.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-[#FAF8F3] dark:bg-[#1F3027] text-[#0B1E15] dark:text-white font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">ग्राहक</th>
                    <th className="p-3">परिसर</th>
                    <th className="p-3">क्रेडिट मुदत</th>
                    <th className="p-3">सरासरी भरणा दिवस</th>
                    <th className="p-3 text-right">चालू बाकी</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-[#0B1E15] dark:text-white">
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td className="p-3 font-bold">{c.name}</td>
                      <td className="p-3 text-[#2D4538] dark:text-[#CBDCD4] font-medium">{c.area}</td>
                      <td className="p-3 font-medium">{c.creditDays} दिवस</td>
                      <td className="p-3 font-semibold text-emerald-600">{c.averageDaysToPay} दिवस</td>
                      <td className="p-3 font-black text-right text-amber-700 dark:text-amber-400">
                        {formatIndianCurrency(c.currentOutstanding)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5. MODAL: ADD DAILY ENTRY RIGHT FROM REPORTS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#16241D] rounded-3xl max-w-lg w-full p-6 border border-[#E7E2D6] dark:border-[#263B30] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D6] dark:border-[#263B30]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#1F4D3A] text-white flex items-center justify-center font-black">
                  <Plus className="w-5 h-5 text-[#D9A441]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
                    नवीन दिवसाची नोंद करा (Add Day {totalDaysRecorded + 1} Entry)
                  </h3>
                  <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4]">
                    {farm.name} • महिना १ दैनिक अहवालात जोडले जाईल
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDailyEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0B1E15] dark:text-white block mb-1">
                    दिनांक (Date)
                  </label>
                  <input
                    type="date"
                    required
                    value={entryDate}
                    onChange={e => setEntryDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0B1E15] dark:text-white block mb-1">
                    गोळा झालेली अंडी (Eggs)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={entryEggs}
                    onChange={e => setEntryEggs(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] font-black text-[#1F4D3A] dark:text-[#3BA378]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0B1E15] dark:text-white block mb-1">
                    वापरलेला खुराक kg (Feed)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min={0}
                    value={entryFeedKg}
                    onChange={e => setEntryFeedKg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0B1E15] dark:text-white block mb-1">
                    आजचे मृत्यू (Mortality)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={entryMortality}
                    onChange={e => setEntryMortality(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] font-bold text-red-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-bold text-[#0B1E15] dark:text-white block mb-1">
                    अंडी विक्री दर ₹ / नग (Selling Rate)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    min={0}
                    value={entrySellingRate}
                    onChange={e => setEntrySellingRate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1F3027] font-black text-[#D9A441]"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/30 space-y-1 text-[11px]">
                <div className="font-black text-[#0B1E15] dark:text-white mb-1">
                  थेट पूर्वपरीक्षण (Live Forecast):
                </div>
                <div className="flex justify-between">
                  <span>अंदाजे HD%: <strong>{previewHd}%</strong></span>
                  <span>प्रति पक्षी खुराक: <strong>{previewFeedG} g</strong></span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 dark:text-emerald-300 pt-1 border-t border-emerald-200 dark:border-emerald-800">
                  <span>अंदाजे थेट रोख नफा:</span>
                  <span>{formatIndianCurrency(previewProfit)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-[#E7E2D6] dark:border-[#263B30] text-xs font-bold text-[#0B1E15] dark:text-white hover:bg-gray-50 dark:hover:bg-[#1F3027]"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isSavingEntry}
                  className="py-2.5 px-5 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingEntry ? 'जतन करत आहे...' : 'नोंद सेव्ह करा आणि अहवाल पहा'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
