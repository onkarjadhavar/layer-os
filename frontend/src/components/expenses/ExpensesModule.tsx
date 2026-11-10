'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { formatIndianCurrency } from '@/lib/calc';
import {
  Receipt,
  Plus,
  Landmark,
  Trash2,
  Users,
  CheckCircle2,
  X,
  CreditCard,
  Building,
  TrendingUp,
  Percent,
  Calendar,
} from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'खुराक खरेदी (Feed Purchase)',
  'कामगार मजुरी (Labour Wages)',
  'औषध व लसी (Medicines & Vaccines)',
  'वीज व जनरेटर डिझेल (Power & Diesel)',
  'वाहतूक खर्च (Transport)',
  'शेड व साहित्य दुरुस्ती (Maintenance & Equipment)',
  'लिटर / भुसा खरेदी (Litter / Husk)',
  'किरकोळ खर्च (Miscellaneous Expense)',
];

export function ExpensesModule() {
  const {
    farm,
    loan,
    todayRecord,
    employees,
    isDemoMode,
    expenses = [],
    addExpense,
    deleteExpense,
    addEmployee,
    deleteEmployee,
    updateLoan,
  } = useLayerOS();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'daily-expenses' | 'true-profit' | 'loan-schedule' | 'payroll'>('daily-expenses');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showAddLoanModal, setShowAddLoanModal] = useState(false);

  // New Expense form state
  const [expCategory, setExpCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [expAmount, setExpAmount] = useState('');
  const [expMode, setExpMode] = useState<'upi' | 'cash' | 'bank' | 'cheque'>('upi');
  const [expVendor, setExpVendor] = useState('');
  const [expDate, setExpDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expDesc, setExpDesc] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // New Employee form state
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('शेड कामगार (Shed Attendant)');
  const [empSalary, setEmpSalary] = useState('');
  const [empPhone, setEmpPhone] = useState('');

  // Loan form state
  const [loanBankName, setLoanBankName] = useState(loan?.bankName && loan.principalAmount > 0 ? loan.bankName : 'बँक ऑफ महाराष्ट्र');
  const [loanPrincipal, setLoanPrincipal] = useState(loan?.principalAmount > 0 ? String(loan.principalAmount) : '2000000');
  const [loanRate, setLoanRate] = useState(loan?.annualInterestRate > 0 ? String(loan.annualInterestRate) : '9.25');
  const [loanEmi, setLoanEmi] = useState(loan?.monthlyEmi > 0 ? String(loan.monthlyEmi) : '32000');
  const [loanTenure, setLoanTenure] = useState(loan?.tenureMonths > 0 ? String(loan.tenureMonths) : '84');

  const displayEmployees = employees || [];

  // Dynamic calculations for expenses
  const feedExpensesTotal = expenses
    .filter(e => e.category.includes('खुराक') || e.category.toLowerCase().includes('feed'))
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const otherExpensesTotal = expenses
    .filter(e => !e.category.includes('खुराक') && !e.category.toLowerCase().includes('feed'))
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalDailyExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  // Dynamic calculations for overheads
  const birdCount = farm.totalCapacity || 10000;
  const pulletAmortDaily = Math.round((birdCount * 40) / (14 * 30));
  const shedDeprecDaily = Math.round(birdCount * 0.05);
  const labourDaily = displayEmployees.length > 0
    ? Math.round(displayEmployees.reduce((sum, e) => sum + e.monthlySalary, 0) / 30)
    : Math.round(birdCount * 0.11);
  const loanDailyInterest = loan && loan.principalAmount > 0
    ? Math.round((loan.monthlyEmi * 0.3) / 30)
    : 0;
  const electricityDaily = Math.round(birdCount * 0.04);
  const medicineDaily = Math.round(birdCount * 0.05);
  const mortalityLossDaily = todayRecord ? Math.round(todayRecord.mortality * 40) : 0;

  const overheadItems = [
    { title: 'कामगार दैनिक वेतन (Monthly Labour allocated daily)', amount: labourDaily, formula: `${displayEmployees.length || 'अंदाजे'} कर्मचारी / ३० दिवस` },
    { title: 'पुलेट पक्षी खरेदी घसारा (Pullet Amortization)', amount: pulletAmortDaily, formula: `₹४० खरेदी दर / १४ महिने` },
    { title: 'शेड व पिंजरे घसारा (Depreciation)', amount: shedDeprecDaily, formula: `१०% वार्षिक सरळ रेषा पद्धत` },
    { title: 'बँक कर्ज व्याज (Bank Loan Daily Interest)', amount: loanDailyInterest, formula: loan && loan.principalAmount > 0 ? `${loan.annualInterestRate}% व्याज दर` : 'कर्ज नोंद नाही (₹०)' },
    { title: 'दैनिक वीज व पाणी (Power & Electricity)', amount: electricityDaily, formula: `दैनिक सरासरी वीज बिल` },
    { title: 'लस व औषधोपचार (Vaccines & Health)', amount: medicineDaily, formula: `दैनिक सरासरी` },
    { title: 'मृत्यू बुक व्हॅल्यू नुकसान (Mortality Loss)', amount: mortalityLossDaily, formula: `${todayRecord?.mortality || 0} पक्षी × ₹४० बुक व्हॅल्यू` },
  ];

  const totalDailyOverheads = overheadItems.reduce((sum, item) => sum + item.amount, 0);

  // Submit expense handler
  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(expAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setFormError('कृपया वैध रक्कम टाका (Amount must be greater than 0)');
      return;
    }

    await addExpense({
      date: expDate,
      category: expCategory,
      amount: amountNum,
      mode: expMode,
      vendor: expVendor.trim() || 'स्थानिक पुरवठादार',
      description: expDesc.trim() || undefined,
      farmId: farm.id,
    });

    // Reset and close
    setExpAmount('');
    setExpVendor('');
    setExpDesc('');
    setFormError(null);
    setShowAddModal(false);
  };

  // Submit employee handler
  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim()) return;
    const salaryNum = parseFloat(empSalary) || 15000;

    await addEmployee({
      name: empName.trim(),
      role: empRole.trim(),
      monthlySalary: salaryNum,
      phone: empPhone.trim() || '9822000000',
      joiningDate: new Date().toISOString().split('T')[0],
      presentDaysThisMonth: 30,
      advanceTaken: 0,
    });

    setEmpName('');
    setEmpSalary('');
    setEmpPhone('');
    setShowAddEmpModal(false);
  };

  // Submit loan handler
  const handleSaveLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const principal = parseFloat(loanPrincipal) || 0;
    const rate = parseFloat(loanRate) || 0;
    const emi = parseFloat(loanEmi) || 0;
    const tenure = parseInt(loanTenure, 10) || 60;

    updateLoan({
      id: loan?.id || `loan-${farm.id}`,
      bankName: loanBankName.trim() || 'बँक ऑफ महाराष्ट्र',
      principalAmount: principal,
      annualInterestRate: rate,
      monthlyEmi: emi,
      emiDueDay: 5,
      tenureMonths: tenure,
      outstandingPrincipal: principal,
    });

    setShowAddLoanModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DCD3C3] dark:border-[#263B30] gap-3">
          <div>
            <h2 className="text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
              <Receipt className="w-6 h-6 text-[#1F4D3A] dark:text-[#3BA378]" />
              <span>खर्च, कर्ज व खाती (Expenses & Accounts)</span>
            </h2>
            <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
              {farm.name} • दैनंदिन रोख खर्च, बँक कर्ज ईएमआय आणि सर्व खर्चांनंतरचा खरा नफा (True Profit)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'daily-expenses' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="py-2.5 px-4 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4 text-[#D9A441]" />
                <span>+ नवीन खर्च नोंदवा (Add Expense)</span>
              </button>
            )}

            {activeTab === 'payroll' && (
              <button
                onClick={() => setShowAddEmpModal(true)}
                className="py-2.5 px-4 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4 text-[#D9A441]" />
                <span>+ कर्मचारी जोडा (Add Employee)</span>
              </button>
            )}

            {activeTab === 'loan-schedule' && (
              <button
                onClick={() => setShowAddLoanModal(true)}
                className="py-2.5 px-4 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4 text-[#D9A441]" />
                <span>{loan?.principalAmount > 0 ? 'कर्ज तपशील अपडेट करा' : '+ बँक कर्ज नोंदवा (Add Loan)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('daily-expenses')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'daily-expenses'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            दैनंदिन रोख खर्च ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('true-profit')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'true-profit'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            खरा नफा विभागणी (True Profit Overheads)
          </button>
          <button
            onClick={() => setActiveTab('loan-schedule')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'loan-schedule'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            बँक कर्ज व ईएमआय (Bank Loan)
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'payroll'
                ? 'bg-[#1F4D3A] text-white shadow-sm font-black'
                : 'bg-[#F8F6F0] dark:bg-[#1A2D23] text-[#2D4538] dark:text-[#CBDCD4] hover:text-[#0B1E15] dark:hover:text-white font-bold border border-[#DCD3C3]/50'
            }`}
          >
            कामगार व पगारपट ({displayEmployees.length})
          </button>
        </div>
      </div>

      {/* 1. DAILY EXPENSES TAB */}
      {activeTab === 'daily-expenses' && (
        <div className="card-layer p-5 border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#16241D] space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30] gap-3">
            <div>
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                नोंदवलेले दैनिक खर्च (Daily Cash & Feed Expenses)
              </h3>
              <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
                एकूण खर्च: <strong className="text-red-600 dark:text-red-400">{formatIndianCurrency(totalDailyExpenses)}</strong>
                {totalDailyExpenses > 0 ? (
                  <span> (खुराक {formatIndianCurrency(feedExpensesTotal)} + इतर {formatIndianCurrency(otherExpensesTotal)})</span>
                ) : (
                  <span> (अद्याप कोणताही खर्च नोंदवलेला नाही)</span>
                )}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1F4D3A] text-white text-xs font-black shadow-xs flex items-center gap-1.5 self-start sm:self-auto hover:bg-[#173A2C] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>+ खर्च जोडा</span>
            </button>
          </div>

          {/* Zero state when no expenses exist */}
          {expenses.length === 0 ? (
            <div className="py-12 px-6 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-dashed border-[#DCD3C3] dark:border-[#263B30] text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#1F4D3A]/10 dark:bg-[#3BA378]/20 flex items-center justify-center text-[#1F4D3A] dark:text-[#3BA378]">
                <Receipt className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#0B1E15] dark:text-white">
                  अद्याप कोणताही दैनंदिन खर्च नोंदवलेला नाही (No Daily Expenses Logged Yet)
                </h4>
                <p className="text-xs font-medium text-[#4D6558] dark:text-[#CBDCD4] max-w-md mx-auto mt-1 leading-relaxed">
                  तुमच्या पोल्ट्री फार्मचा दैनंदिन खुराक (दाणा), मजुरी, औषधे, वीज किंवा इतर खर्च येथे नोंदवा. दररोजच्या नोंदीनुसार खाती आणि खरा नफा (True Profit) आपोआप मोजला जाईल.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D9A441]" />
                <span>+ पहिला खर्च नोंदवा (Add First Expense)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {expenses.map(e => (
                <div
                  key={e.id}
                  className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] flex items-center justify-between hover:border-[#1F4D3A] transition-colors shadow-xs"
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#0B1E15] dark:text-white">
                        {e.category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1F4D3A]/10 dark:bg-[#3BA378]/20 text-[#1F4D3A] dark:text-[#3BA378] font-bold uppercase">
                        {e.mode}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-0.5">
                      {e.vendor} • {e.date}
                      {e.description && <span> • {e.description}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-black text-red-600 dark:text-red-400">
                      {formatIndianCurrency(e.amount)}
                    </div>
                    <button
                      onClick={() => deleteExpense(e.id)}
                      className="p-1.5 rounded-lg text-[#889B90] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="खर्च हटवा (Delete Expense)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
                थेट नफा − दैनिक अप्रत्यक्ष ओव्हरहेड्स ({formatIndianCurrency(totalDailyOverheads)}) ={' '}
                <span className="text-emerald-700 dark:text-emerald-400">
                  खरा नफा (True Net Profit)
                </span>
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
                {loan?.principalAmount > 0 ? `${loan.bankName} • मुदत कर्ज (${loan.tenureMonths || 60} महिने)` : 'सध्या कोणतेही बँक कर्ज नोंदवलेले नाही'}
              </p>
            </div>
            {loan?.principalAmount > 0 ? (
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                नियमित चालू ✓
              </span>
            ) : (
              <button
                onClick={() => setShowAddLoanModal(true)}
                className="px-3 py-1 rounded-xl bg-[#1F4D3A] text-white text-xs font-black shadow-xs flex items-center gap-1 hover:bg-[#173A2C] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>+ बँक कर्ज नोंदवा</span>
              </button>
            )}
          </div>

          {loan && loan.principalAmount > 0 ? (
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
          ) : (
            <div className="py-10 px-6 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-dashed border-[#DCD3C3] dark:border-[#263B30] text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#1F4D3A]/10 dark:bg-[#3BA378]/20 flex items-center justify-center text-[#1F4D3A] dark:text-[#3BA378]">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#0B1E15] dark:text-white">
                  कोणतेही बँक कर्ज नोंदवलेले नाही (No Active Poultry Loan)
                </h4>
                <p className="text-xs font-medium text-[#4D6558] dark:text-[#CBDCD4] max-w-md mx-auto mt-1">
                  जर तुमच्या पोल्ट्री फार्मवर बँक ऑफ महाराष्ट्र, एसबीआय किंवा इतर बँकेचे मुदत कर्ज (Term Loan / KCC) असेल, तर येथे नोंद करून दैनंदिन व्याज आणि ईएमआयचा हिशोब अचूक ठेवा.
                </p>
              </div>
              <button
                onClick={() => setShowAddLoanModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D9A441]" />
                <span>+ बँक कर्ज नोंदवा (Register Loan)</span>
              </button>
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
                एकूण {displayEmployees.length} कर्मचारी • मासिक वेतन खर्च: {formatIndianCurrency(displayEmployees.reduce((s, e) => s + e.monthlySalary, 0))}
              </p>
            </div>
            <button
              onClick={() => setShowAddEmpModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1F4D3A] text-white text-xs font-black shadow-xs flex items-center gap-1.5 hover:bg-[#173A2C] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>+ कर्मचारी जोडा</span>
            </button>
          </div>

          {displayEmployees.length === 0 ? (
            <div className="py-10 px-6 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-dashed border-[#DCD3C3] dark:border-[#263B30] text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#1F4D3A]/10 dark:bg-[#3BA378]/20 flex items-center justify-center text-[#1F4D3A] dark:text-[#3BA378]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#0B1E15] dark:text-white">
                  कोणताही कर्मचारी नोंदवलेला नाही (No Farm Staff Registered)
                </h4>
                <p className="text-xs font-medium text-[#4D6558] dark:text-[#CBDCD4] max-w-md mx-auto mt-1">
                  तुमच्या शेडवरील कामगार, सुपरवायझर व इतर कर्मचाऱ्यांची नोंद करा. त्यांचा मासिक पगार, कामाचे दिवस आणि ऍडव्हान्स रक्कम येथे सहज ट्रॅक करा.
                </p>
              </div>
              <button
                onClick={() => setShowAddEmpModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D9A441]" />
                <span>+ कर्मचारी जोडा (Add Staff)</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayEmployees.map(emp => (
                <div
                  key={emp.id}
                  className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] flex items-center justify-between hover:border-[#1F4D3A] transition-colors shadow-xs"
                >
                  <div>
                    <h4 className="text-xs font-black text-[#0B1E15] dark:text-white">
                      {emp.name}
                    </h4>
                    <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-0.5">
                      {emp.role} • उपस्थिती: {emp.presentDaysThisMonth || 30} दिवस
                    </div>
                    {emp.advanceTaken > 0 && (
                      <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-0.5">
                        ऍडव्हान्स घेतलेला: ₹{emp.advanceTaken.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-black text-[#1F4D3A] dark:text-[#42BF87]">
                        {formatIndianCurrency(emp.monthlySalary)}
                      </div>
                      <div className="text-[10px] text-[#4D6558] dark:text-[#CBDCD4]">मासिक मानधन</div>
                    </div>
                    <button
                      onClick={() => deleteEmployee(emp.id)}
                      className="p-1.5 rounded-lg text-[#889B90] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="कर्मचारी हटवा"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD DAILY EXPENSE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#16241D] rounded-2xl border border-[#DCD3C3] dark:border-[#263B30] shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#1F4D3A] dark:text-[#3BA378]" />
                <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
                  नवीन खर्च नोंदवा (Add Daily Expense)
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-[#4D6558] hover:text-[#0B1E15] dark:hover:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1A2D23] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3.5">
              {formError && (
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                  दिनांक (Date)
                </label>
                <input
                  type="date"
                  value={expDate}
                  onChange={e => setExpDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                  खर्चाचा प्रकार (Category)
                </label>
                <select
                  value={expCategory}
                  onChange={e => setExpCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                >
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                  रक्कम (Amount in ₹) *
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="उदा. 4500"
                  value={expAmount}
                  onChange={e => setExpAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-sm font-black outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                    देयक पद्धत (Mode)
                  </label>
                  <select
                    value={expMode}
                    onChange={e => setExpMode(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                  >
                    <option value="upi">UPI / PhonePe</option>
                    <option value="cash">रोख (Cash)</option>
                    <option value="bank">बँक (NEFT/RTGS)</option>
                    <option value="cheque">चेक (Cheque)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                    दुकानदार / व्यक्ती नाव
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. गोदरेज ॲग्रो"
                    value={expVendor}
                    onChange={e => setExpVendor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                  तपशील / शेरा (Optional Notes)
                </label>
                <input
                  type="text"
                  placeholder="उदा. २५ गोणी खुराक किंवा जनरेटर डिझेल"
                  value={expDesc}
                  onChange={e => setExpDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCD3C3] dark:border-[#263B30]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] text-[#2D4538] dark:text-[#CBDCD4] text-xs font-bold hover:bg-[#F8F6F0] dark:hover:bg-[#1A2D23] cursor-pointer"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D9A441]" />
                  <span>खर्च जतन करा (Save Expense)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EMPLOYEE */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#16241D] rounded-2xl border border-[#DCD3C3] dark:border-[#263B30] shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1F4D3A] dark:text-[#3BA378]" />
                <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
                  नवीन कर्मचारी जोडा (Add Farm Staff)
                </h3>
              </div>
              <button
                onClick={() => setShowAddEmpModal(false)}
                className="p-1.5 rounded-lg text-[#4D6558] hover:text-[#0B1E15] dark:hover:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1A2D23] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                  कर्मचाऱ्याचे पूर्ण नाव (Full Name) *
                </label>
                <input
                  type="text"
                  placeholder="उदा. संतोष कांबळे"
                  value={empName}
                  onChange={e => setEmpName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                  पद / जबाबदारी (Role)
                </label>
                <select
                  value={empRole}
                  onChange={e => setEmpRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                >
                  <option value="शेड कामगार (Shed Attendant)">शेड कामगार (Shed Attendant)</option>
                  <option value="फार्म सुपरवायझर (Farm Supervisor)">फार्म सुपरवायझर (Farm Supervisor)</option>
                  <option value="खुराक ऑपरेटर (Feeding Operator)">खुराक ऑपरेटर (Feeding Operator)</option>
                  <option value="अंडी संकलन कर्मचारी (Egg Collector)">अंडी संकलन कर्मचारी (Egg Collector)</option>
                  <option value="डिलिव्हरी चालक (Driver)">डिलिव्हरी चालक (Driver)</option>
                  <option value="सुरक्षा रक्षक (Watchman)">सुरक्षा रक्षक (Watchman)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                    मासिक पगार (Monthly ₹)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="उदा. 16000"
                    value={empSalary}
                    onChange={e => setEmpSalary(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                    मोबाईल नंबर (Phone)
                  </label>
                  <input
                    type="tel"
                    placeholder="उदा. 9822XXXXXX"
                    value={empPhone}
                    onChange={e => setEmpPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCD3C3] dark:border-[#263B30]">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] text-[#2D4538] dark:text-[#CBDCD4] text-xs font-bold hover:bg-[#F8F6F0] dark:hover:bg-[#1A2D23] cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D9A441]" />
                  <span>कर्मचारी जतन करा</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER / UPDATE LOAN */}
      {showAddLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#16241D] rounded-2xl border border-[#DCD3C3] dark:border-[#263B30] shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#1F4D3A] dark:text-[#3BA378]" />
                <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
                  बँक कर्ज तपशील (Poultry Term Loan)
                </h3>
              </div>
              <button
                onClick={() => setShowAddLoanModal(false)}
                className="p-1.5 rounded-lg text-[#4D6558] hover:text-[#0B1E15] dark:hover:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#1A2D23] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLoan} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                  बँकेचे नाव (Bank Name) *
                </label>
                <input
                  type="text"
                  placeholder="उदा. बँक ऑफ महाराष्ट्र / SBI"
                  value={loanBankName}
                  onChange={e => setLoanBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                    मंजूर मुद्दल रक्कम (Principal ₹)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="उदा. 2000000"
                    value={loanPrincipal}
                    onChange={e => setLoanPrincipal(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                    वार्षिक व्याज दर (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="उदा. 9.25"
                    value={loanRate}
                    onChange={e => setLoanRate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                    मासिक हप्ता (EMI ₹)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="उदा. 32000"
                    value={loanEmi}
                    onChange={e => setLoanEmi(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] mb-1">
                    कालावधी (महिन्यांमध्ये)
                  </label>
                  <input
                    type="number"
                    placeholder="उदा. 84"
                    value={loanTenure}
                    onChange={e => setLoanTenure(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-white dark:bg-[#0F1A15] text-[#0B1E15] dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1F4D3A]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCD3C3] dark:border-[#263B30]">
                <button
                  type="button"
                  onClick={() => setShowAddLoanModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] text-[#2D4538] dark:text-[#CBDCD4] text-xs font-bold hover:bg-[#F8F6F0] dark:hover:bg-[#1A2D23] cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D9A441]" />
                  <span>कर्ज जतन करा</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
