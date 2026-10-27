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
  const { loan, todayRecord, employees, isDemoMode, flock, farm } = useLayerOS();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'daily-expenses' | 'true-profit' | 'loan-schedule' | 'payroll'>('daily-expenses');

  // Daily cash expenses list: in non-demo mode, starts clean with today's feed issued or user expenses
  const [expenses, setExpenses] = useState(() => {
    if (isDemoMode) {
      return [
        { id: 'exp-01', date: '2026-10-07', category: 'खुराक खरेदी (Feed Purchase)', amount: 115500, mode: 'bank', vendor: 'गोदरेज ॲग्रोव्हेट' },
        { id: 'exp-02', date: '2026-10-07', category: 'कामगार मजुरी (Labour Wages)', amount: 3500, mode: 'cash', vendor: 'शेड कामगार' },
        { id: 'exp-03', date: '2026-10-07', category: 'औषध व लसी (Medicines)', amount: 1500, mode: 'upi', vendor: 'महाराष्ट्र व्हेटर्नरी' },
        { id: 'exp-04', date: '2026-10-07', category: 'वीज व जनरेटर डिझेल (Power)', amount: 1200, mode: 'upi', vendor: 'हिंदुस्थान पेट्रोलियम' },
        { id: 'exp-05', date: '2026-10-07', category: 'वाहतूक खर्च (Transport)', amount: 800, mode: 'cash', vendor: 'स्थानिक टेम्पो' },
        { id: 'exp-06', date: '2026-10-07', category: 'किरकोळ दुरुस्ती (Maintenance)', amount: 500, mode: 'cash', vendor: 'वेल्डिंग वर्कशॉप' },
      ];
    }
    if (todayRecord && todayRecord.feedIssuedKg > 0) {
      return [
        {
          id: 'exp-feed',
          date: todayRecord.recordDate,
          category: 'आजचा खुराक खर्च (Feed Issued Today)',
          amount: Math.round(todayRecord.feedIssuedKg * todayRecord.feedPricePerKg),
          mode: 'bank',
          vendor: 'फीड गोडावून / मिल'
        }
      ];
    }
    return [];
  });

  const [newExpCategory, setNewExpCategory] = useState('खुराक खरेदी (Feed Purchase)');
  const [newExpAmount, setNewExpAmount] = useState<string>('');
  const [newExpVendor, setNewExpVendor] = useState<string>('');
  const [showAddExp, setShowAddExp] = useState(false);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpAmount || Number(newExpAmount) <= 0) return;
    const newExp = {
      id: `exp-${Date.now()}`,
      date: todayRecord?.recordDate || new Date().toISOString().split('T')[0],
      category: newExpCategory,
      amount: Number(newExpAmount),
      mode: 'cash',
      vendor: newExpVendor.trim() || 'स्थानिक'
    };
    setExpenses([newExp, ...expenses]);
    setNewExpAmount('');
    setNewExpVendor('');
    setShowAddExp(false);
  };

  const currentBirds = todayRecord?.closingBirds || flock.currentBirdCount || 10000;
  const mortalityBirds = todayRecord?.mortality || 0;

  // True profit overheads breakdown derived dynamically
  const overheadItems = [
    {
      title: 'कामगार वेतन (Monthly Labour allocated daily)',
      amount: employees.length > 0 ? Math.round(employees.reduce((s, e) => s + e.monthlySalary, 0) / 30) : Math.round((currentBirds / 1000) * 115),
      formula: `${employees.length > 0 ? employees.length : Math.round(currentBirds / 3750)} कर्मचारी / ३० दिवस`
    },
    {
      title: 'पुलेट पक्षी खरेदी घसारा (Pullet Amortization)',
      amount: Math.round((currentBirds * 44) / (14 * 30)),
      formula: `₹${((currentBirds * 44)/100000).toFixed(1)}L खरेदी खर्च / १४ महिने`
    },
    {
      title: 'शेड व पिंजरे घसारा (Depreciation)',
      amount: Math.round((currentBirds * 15) / 365),
      formula: '१०% वार्षिक सरळ रेषा पद्धत'
    },
    {
      title: 'बँक कर्ज व्याज (Bank Loan Daily Interest)',
      amount: loan?.monthlyEmi ? Math.round((loan.outstandingPrincipal * 0.0925) / 365) : 0,
      formula: loan?.monthlyEmi ? `${loan.annualInterestRate}% व्याज दर / ३० दिवस` : 'कर्ज नोंदणी नाही'
    },
    {
      title: 'दैनिक वीज व पाणी (Power & Electricity)',
      amount: Math.round(currentBirds * 0.04),
      formula: 'दैनिक सरासरी वीज वापर'
    },
    {
      title: 'लस व औषधोपचार (Vaccines & Health)',
      amount: Math.round(currentBirds * 0.05),
      formula: 'दैनिक आरोग्य सरासरी'
    },
    {
      title: 'मृत्यू बुक व्हॅल्यू नुकसान (Mortality Loss)',
      amount: mortalityBirds * 40,
      formula: `${mortalityBirds} पक्षी × ₹४० बुक व्हॅल्यू`
    },
  ];

  const totalDailyOverheads = overheadItems.reduce((sum, item) => sum + item.amount, 0);
  const totalDirectExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30] gap-3">
            <div>
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                आजचे थेट खर्च (Today's Direct Expenses)
              </h3>
              <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
                एकूण थेट खर्च: <strong className="text-red-600 dark:text-red-400">{formatIndianCurrency(totalDirectExpenses)}</strong>
              </p>
            </div>
            <button
              onClick={() => setShowAddExp(!showAddExp)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1F4D3A] text-white text-xs font-black shadow-xs flex items-center gap-1 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddExp ? 'रद्द करा' : '+ खर्च जोडा'}</span>
            </button>
          </div>

          {showAddExp && (
            <form onSubmit={handleAddExpense} className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] space-y-3">
              <h4 className="text-xs font-bold text-[#0B1E15] dark:text-white">नवीन खर्च नोंदवा</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">खर्च प्रकार</label>
                  <select
                    value={newExpCategory}
                    onChange={e => setNewExpCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D]"
                  >
                    <option value="खुराक खरेदी (Feed Purchase)">खुराक खरेदी (Feed Purchase)</option>
                    <option value="कामगार मजुरी (Labour Wages)">कामगार मजुरी (Labour Wages)</option>
                    <option value="औषध व लसी (Medicines)">औषध व लसी (Medicines)</option>
                    <option value="वीज व डिझेल (Power & Fuel)">वीज व डिझेल (Power & Fuel)</option>
                    <option value="वाहतूक खर्च (Transport)">वाहतूक खर्च (Transport)</option>
                    <option value="दुरुस्ती व मेंटेनन्स (Maintenance)">दुरुस्ती व मेंटेनन्स (Maintenance)</option>
                    <option value="इतर खर्च (Miscellaneous)">इतर खर्च (Miscellaneous)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">रक्कम (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="उदा. १५००"
                    value={newExpAmount}
                    onChange={e => setNewExpAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4] block mb-1">दुकानदार / व्यक्ती नाव</label>
                  <input
                    type="text"
                    placeholder="उदा. स्थानिक विक्रेता"
                    value={newExpVendor}
                    onChange={e => setNewExpVendor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D]"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white text-xs font-black shadow-xs"
                >
                  खर्च जतन करा
                </button>
              </div>
            </form>
          )}

          {expenses.length === 0 ? (
            <div className="py-10 text-center space-y-2 bg-[#F8F6F0] dark:bg-[#1A2D23] rounded-2xl border border-dashed border-[#DCD3C3] dark:border-[#263B30]">
              <Receipt className="w-9 h-9 text-[#4D6558] dark:text-[#CBDCD4] mx-auto opacity-40" />
              <div className="text-sm font-bold text-[#0B1E15] dark:text-white">
                आजचा थेट रोख खर्च अद्याप नोंदवलेला नाही
              </div>
              <p className="text-xs text-[#4D6558] dark:text-[#CBDCD4]">
                दाणा खरेदी, कामगार मजुरी किंवा औषध खर्च नोंदवण्यासाठी वरील बटणावर क्लिक करा.
              </p>
            </div>
          ) : (
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
          )}
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
                थेट नफा ({todayRecord ? formatIndianCurrency(todayRecord.simpleOperatingProfit) : '₹०'}) − दैनिक अप्रत्यक्ष ओव्हरहेड्स ({formatIndianCurrency(totalDailyOverheads)}) = <span className="text-emerald-700 dark:text-emerald-400">खरा नफा {todayRecord ? formatIndianCurrency(todayRecord.simpleOperatingProfit - totalDailyOverheads) : '₹०'}</span>
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
                {loan?.bankName || 'बँक कर्ज खाते'}
              </p>
            </div>
            {loan?.principalAmount > 0 && (
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                नियमित चालू ✓
              </span>
            )}
          </div>

          {(!loan || loan.principalAmount <= 0) ? (
            <div className="py-10 text-center space-y-2 bg-[#F8F6F0] dark:bg-[#1A2D23] rounded-2xl border border-dashed border-[#DCD3C3] dark:border-[#263B30]">
              <Landmark className="w-9 h-9 text-[#4D6558] dark:text-[#CBDCD4] mx-auto opacity-40" />
              <div className="text-sm font-bold text-[#0B1E15] dark:text-white">
                या फार्मवर कोणतेही बँक कर्ज नोंदवलेले नाही
              </div>
              <p className="text-xs text-[#4D6558] dark:text-[#CBDCD4]">
                फार्म कर्जमुक्त आहे किंवा कर्जाची माहिती प्रविष्ट केलेली नाही.
              </p>
            </div>
          ) : (
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
          )}
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
                {employees.length > 0 ? `एकूण ${employees.length} कर्मचारी` : 'नोंदणीकृत कर्मचारी माहिती'}
              </p>
            </div>
          </div>

          {employees.length === 0 ? (
            <div className="py-10 text-center space-y-2 bg-[#F8F6F0] dark:bg-[#1A2D23] rounded-2xl border border-dashed border-[#DCD3C3] dark:border-[#263B30]">
              <Calendar className="w-9 h-9 text-[#4D6558] dark:text-[#CBDCD4] mx-auto opacity-40" />
              <div className="text-sm font-bold text-[#0B1E15] dark:text-white">
                कोणतेही कर्मचारी जोडलेले नाहीत
              </div>
              <p className="text-xs text-[#4D6558] dark:text-[#CBDCD4]">
                फार्मवरील कामगारांची माहिती व मासिक वेतन नोंदवण्यासाठी सेटिंग्ज किंवा ॲडमिन पॅनेल वापरा.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}
