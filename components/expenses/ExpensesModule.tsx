'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calc';
import {
  Receipt,
  Plus,
  Landmark,
  Scale,
  Calendar,
  AlertCircle,
  FileText,
  PieChart,
  ArrowRight,
} from 'lucide-react';

export function ExpensesModule() {
  const { loan, todayRecord, employees } = useLayerOS();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'daily-expenses' | 'true-profit' | 'loan-schedule' | 'payroll'>('daily-expenses');

  // Daily cash expenses list
  const [expenses, setExpenses] = useState([
    { id: 'exp-01', date: '2026-10-07', category: 'खुराक खरेदी (Feed Purchase)', amount: 115500, mode: 'bank', vendor: 'गोदरेज ॲग्रोव्हेट' },
    { id: 'exp-02', date: '2026-10-07', category: 'कामगार मजुरी (Labour Wages)', amount: 3500, mode: 'cash', vendor: 'शेड कामगार' },
    { id: 'exp-03', date: '2026-10-07', category: 'औषध व लसी (Medicines)', amount: 1500, mode: 'upi', vendor: 'महाराष्ट्र व्हेटर्नरी' },
    { id: 'exp-04', date: '2026-10-07', category: 'वीज व जनरेटर डिझेल (Power)', amount: 1200, mode: 'upi', vendor: 'हिंदुस्थान पेट्रोलियम' },
    { id: 'exp-05', date: '2026-10-07', category: 'वाहतूक खर्च (Transport)', amount: 800, mode: 'cash', vendor: 'स्थानिक टेम्पो' },
    { id: 'exp-06', date: '2026-10-07', category: 'किरकोळ दुरुस्ती (Maintenance)', amount: 500, mode: 'cash', vendor: 'वेल्डिंग वर्कशॉप' },
  ]);

  // True profit overheads breakdown
  const overheadItems = [
    { title: 'कामगार वेतन (Monthly Labour allocated daily)', amount: 3500, formula: '८ कर्मचारी / ३० दिवस' },
    { title: 'पुलेट पक्षी खरेदी घसारा (Pullet Amortization)', amount: 4500, formula: '₹१३.२L खरेदी खर्च / १४ महिने' },
    { title: 'शेड व पिंजरे घसारा (Depreciation)', amount: 1500, formula: '१०% वार्षिक सरळ रेषा पद्धत' },
    { title: 'बँक कर्ज व्याज (Bank Loan Daily Interest)', amount: 1800, formula: '९.२५% व्याज दर / ३० दिवस' },
    { title: 'दैनिक वीज व पाणी (Power & Electricity)', amount: 1200, formula: 'MSEDCL सरासरी बिल' },
    { title: 'लस व औषधोपचार (Vaccines & Health)', amount: 1500, formula: 'दैनिक सरासरी' },
    { title: 'मृत्यू बुक व्हॅल्यू नुकसान (Mortality Loss)', amount: 600, formula: '१५ पक्षी × ₹४० बुक व्हॅल्यू' },
  ];

  const totalDailyOverheads = overheadItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DCD3C3] dark:border-[#263B30] gap-3">
          <div>
            <h2 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <Receipt className="w-6 h-6 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>खर्च, कर्ज व खरा नफा (Expenses & Overheads)</span>
            </h2>
            <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
              थेट रोख खर्च, बँक कर्ज ईएमआय आणि सर्व खर्चांनंतरचा खरा नफा (True Profit)
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('daily-expenses')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeTab === 'daily-expenses'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            दैनंदिन रोख खर्च (Cash Expenses)
          </button>
          <button
            onClick={() => setActiveTab('true-profit')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeTab === 'true-profit'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            खरा नफा विभागणी (True Profit Overheads)
          </button>
          <button
            onClick={() => setActiveTab('loan-schedule')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeTab === 'loan-schedule'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            बँक कर्ज व ईएमआय (Bank Loan)
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeTab === 'payroll'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            कामगार व पगारपट (Employees)
          </button>
        </div>
      </div>

      {/* 1. DAILY EXPENSES TAB */}
      {activeTab === 'daily-expenses' && (
        <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
            <div>
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                आजचे खर्च (Today's Direct Expenses)
              </h3>
              <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
                एकूण खर्च: <strong className="text-red-600 dark:text-red-400">{formatIndianCurrency(127500)}</strong> (खुराक ₹१,१५,५०० + इतर ₹१२,०००)
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {expenses.map(e => (
              <div
                key={e.id}
                className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] flex items-center justify-between hover:border-[#1F4D3A] transition-colors shadow-xs"
              >
                <div>
                  <div className="text-xs font-black text-[#0B1E15] dark:text-white">
                    {e.category}
                  </div>
                  <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-0.5">
                    {e.vendor} • {e.mode.toUpperCase()}
                  </div>
                </div>
                <div className="text-sm font-black text-red-600 dark:text-red-400">
                  {formatIndianCurrency(e.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TRUE PROFIT OVERHEADS TAB */}
      {activeTab === 'true-profit' && (
        <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4 shadow-xs">
          <div className="p-4 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-[#1F4D3A] dark:text-[#3BA378] uppercase">
                खरा नफा संकल्पना (True Profit Formula)
              </div>
              <div className="text-sm font-black text-[#0B1E15] dark:text-white mt-0.5">
                थेट नफा (₹१९,९२०) − दैनिक अप्रत्यक्ष ओव्हरहेड्स (₹१४,६००) = <span className="text-emerald-700 dark:text-emerald-400">खरा नफा ₹५,३२०</span>
              </div>
              <p className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-medium mt-1">
                केवळ दाणा आणि अंडी विक्री वजा करून नफा मोजणे फसवे ठरू शकते. मशिनरी, शेड, कामगार, कर्जाचे व्याज व कोंबडीची घसारा किंमत विचारात घेतली पाहिजे.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-bold">दैनिक ओव्हरहेड्स</div>
              <div className="text-xl font-black text-[#B07B18] dark:text-[#E5B252] mt-0.5">
                {formatIndianCurrency(totalDailyOverheads)}
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {overheadItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="text-xs font-black text-[#0B1E15] dark:text-white">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-0.5">
                    सूत्र / पद्धत: {item.formula}
                  </div>
                </div>
                <div className="text-sm font-black text-[#0B1E15] dark:text-white">
                  {formatIndianCurrency(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. LOAN SCHEDULE TAB */}
      {activeTab === 'loan-schedule' && (
        <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
            <div>
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                बँक कर्ज व परतफेड तपशील (Active Poultry Term Loan)
              </h3>
              <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
                {loan.bankName} • मुदत कर्ज (८४ महिने)
              </p>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              नियमित चालू ✓
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs">
              <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-bold">मंजूर मुद्दल</div>
              <div className="text-base font-black text-[#0B1E15] dark:text-white mt-1">
                {formatIndianCurrency(loan.principalAmount)}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs">
              <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-bold">मासिक हप्ता (EMI)</div>
              <div className="text-base font-black text-[#B07B18] dark:text-[#E5B252] mt-1">
                {formatIndianCurrency(loan.monthlyEmi)}
              </div>
              <div className="text-[10px] text-[#4D6558] dark:text-[#CBDCD4] mt-0.5">दर महिन्याला ५ तारीख</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs">
              <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-bold">व्याज दर</div>
              <div className="text-base font-black text-[#0B1E15] dark:text-white mt-1">
                {loan.annualInterestRate}%
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs">
              <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-bold">उर्वरित मुद्दल बाकी</div>
              <div className="text-base font-black text-amber-700 dark:text-amber-400 mt-1">
                {formatIndianCurrency(loan.outstandingPrincipal)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PAYROLL TAB */}
      {activeTab === 'payroll' && (
        <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
            <div>
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                फार्म कर्मचारी व मासिक पगार (Employees & Payroll)
              </h3>
              <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
                एकूण ८ कर्मचारी • मासिक वेतन खर्च: ₹१,०५,००० (प्रति १००० पक्षी ₹३,५००)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {employees.map(emp => (
              <div
                key={emp.id}
                className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] flex items-center justify-between hover:border-[#1F4D3A] transition-colors shadow-xs"
              >
                <div>
                  <h4 className="text-xs font-black text-[#0B1E15] dark:text-white">
                    {emp.name}
                  </h4>
                  <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-0.5">
                    {emp.role} • उपस्थिती: {emp.presentDaysThisMonth} दिवस
                  </div>
                  {emp.advanceTaken > 0 && (
                    <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-0.5">
                      ऍडव्हान्स घेतलेला: ₹{emp.advanceTaken.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-[#1F4D3A] dark:text-[#42BF87]">
                    {formatIndianCurrency(emp.monthlySalary)}
                  </div>
                  <div className="text-[10px] text-[#4D6558] dark:text-[#CBDCD4]">मासिक मानधन</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
