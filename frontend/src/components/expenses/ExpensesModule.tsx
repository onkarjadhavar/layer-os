'use client';

import React, { useState, useEffect } from 'react';
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
  Trash2,
  Users,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  financeService,
  ExpenseRecord,
  ExpenseCategory,
  LoanRecord,
  EmployeeRecord,
} from '@/services/finance.service';

export function ExpensesModule() {
  const { farm, loan: storeLoan, todayRecord, employees: storeEmployees, isDemoMode } = useLayerOS();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'daily-expenses' | 'true-profit' | 'loan-schedule' | 'payroll'>('daily-expenses');

  // Backend DB-driven state
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [dbLoan, setDbLoan] = useState<LoanRecord | null>(null);
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Add Expense Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMode, setPaymentMode] = useState('upi');
  const [vendorName, setVendorName] = useState('');
  const [description, setDescription] = useState('');
  const [submittingExpense, setSubmittingExpense] = useState(false);

  // Add Employee Modal
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('Shed Attendant');
  const [empSalary, setEmpSalary] = useState<number | ''>(12000);
  const [empPhone, setEmpPhone] = useState('');
  const [empJoiningDate, setEmpJoiningDate] = useState(new Date().toISOString().split('T')[0]);

  // Load finance records from backend
  useEffect(() => {
    if (!farm?.id) return;
    setLoading(true);

    Promise.allSettled([
      financeService.getCategories(farm.id),
      financeService.getExpenses(farm.id),
      financeService.getLoan(farm.id),
      financeService.getEmployees(farm.id),
    ]).then(([catsRes, expRes, loanRes, empRes]) => {
      if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value)) {
        setCategories(catsRes.value);
        if (catsRes.value.length > 0 && !categoryId) {
          setCategoryId(catsRes.value[0].id);
        }
      }
      if (expRes.status === 'fulfilled' && Array.isArray(expRes.value)) {
        setExpenses(expRes.value);
      }
      if (loanRes.status === 'fulfilled' && loanRes.value) {
        setDbLoan(loanRes.value);
      }
      if (empRes.status === 'fulfilled' && Array.isArray(empRes.value)) {
        setEmployees(empRes.value);
      }
      setLoading(false);
    });
  }, [farm?.id]);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farm?.id || !amount || Number(amount) <= 0) return;

    setSubmittingExpense(true);
    try {
      const created = await financeService.createExpense({
        farm_id: farm.id,
        category_id: categoryId || undefined,
        expense_date: expenseDate,
        amount: Number(amount),
        payment_mode: paymentMode,
        vendor_name: vendorName || undefined,
        description: description || undefined,
      });

      setExpenses(prev => [created, ...prev]);
      setShowAddModal(false);
      setAmount('');
      setVendorName('');
      setDescription('');
    } catch (err: any) {
      alert(err.message || 'खर्च नोंदवताना त्रुटी आली');
    } finally {
      setSubmittingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('तुम्हाला हा खर्च नक्की हटवायचा आहे का?')) return;
    try {
      await financeService.deleteExpense(expenseId);
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
    } catch (err: any) {
      alert(err.message || 'खर्च हटवताना त्रुटी आली');
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farm?.id || !empName || !empSalary || Number(empSalary) <= 0) return;

    try {
      const created = await financeService.createEmployee({
        farm_id: farm.id,
        name: empName,
        role: empRole,
        monthly_salary: Number(empSalary),
        phone: empPhone || undefined,
        joining_date: empJoiningDate,
      });

      setEmployees(prev => [...prev, created]);
      setShowAddEmpModal(false);
      setEmpName('');
      setEmpPhone('');
    } catch (err: any) {
      alert(err.message || 'कर्मचारी जोडताना त्रुटी आली');
    }
  };

  // Active Loan to display
  const activeLoan = {
    bankName: dbLoan ? dbLoan.bank_name : storeLoan.bankName,
    principalAmount: dbLoan ? Number(dbLoan.principal_amount) : storeLoan.principalAmount,
    monthlyEmi: dbLoan ? Number(dbLoan.monthly_emi) : storeLoan.monthlyEmi,
    annualInterestRate: dbLoan ? Number(dbLoan.annual_interest_rate) : storeLoan.annualInterestRate,
    outstandingPrincipal: dbLoan ? Number(dbLoan.outstanding_principal) : storeLoan.outstandingPrincipal,
  };

  // Display employees
  const displayEmployees = employees.length > 0
    ? employees.map(e => ({
        id: e.id,
        name: e.name,
        role: e.role || 'Shed Attendant',
        monthlySalary: Number(e.monthly_salary),
        phone: e.phone || '',
      }))
    : (isDemoMode
        ? storeEmployees.map(e => ({
            id: e.id,
            name: e.name,
            role: e.role,
            monthlySalary: e.monthlySalary,
            phone: e.phone,
          }))
        : []);

  // Today's expenses sum
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses.filter(e => e.expense_date === todayDateStr);
  const totalTodayDirectExpense = todayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalAllExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // True profit overheads breakdown
  const overheadItems = [
    { title: 'कामगार वेतन (Monthly Labour allocated daily)', amount: 3500, formula: 'कर्मचारी वेतन / ३० दिवस' },
    { title: 'पुलेट पक्षी खरेदी घसारा (Pullet Amortization)', amount: 4500, formula: 'खरेदी खर्च / १४ महिने' },
    { title: 'शेड व पिंजरे घसारा (Depreciation)', amount: 1500, formula: '१०% वार्षिक सरळ रेषा पद्धत' },
    { title: 'बँक कर्ज व्याज (Bank Loan Daily Interest)', amount: 1800, formula: 'व्याज दर / ३० दिवस' },
    { title: 'दैनिक वीज व पाणी (Power & Electricity)', amount: 1200, formula: 'दैनिक सरासरी' },
    { title: 'लस व औषधोपचार (Vaccines & Health)', amount: 1500, formula: 'दैनिक सरासरी' },
    { title: 'मृत्यू बुक व्हॅल्यू नुकसान (Mortality Loss)', amount: 600, formula: 'दैनिक मृत्यू × बुक व्हॅल्यू' },
  ];

  const totalDailyOverheads = overheadItems.reduce((sum, item) => sum + item.amount, 0);

  const getCategoryName = (catId?: string | null) => {
    if (!catId) return 'इतर खर्च (Miscellaneous)';
    const found = categories.find(c => c.id === catId);
    return found ? found.name_mr : 'खर्च';
  };

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
              {farm.name} • थेट रोख खर्च, बँक कर्ज ईएमआय आणि सर्व खर्चांनंतरचा खरा नफा (True Profit)
            </p>
          </div>

          {activeTab === 'daily-expenses' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="py-2.5 px-4 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black flex items-center gap-2 shadow-sm self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D9A441]" />
              <span>+ नवीन खर्च नोंदवा (Add Expense)</span>
            </button>
          )}

          {activeTab === 'payroll' && (
            <button
              onClick={() => setShowAddEmpModal(true)}
              className="py-2.5 px-4 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black flex items-center gap-2 shadow-sm self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D9A441]" />
              <span>+ कर्मचारी जोडा (Add Employee)</span>
            </button>
          )}
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
          <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
            <div>
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                खर्च नोंदी (Direct Cash Expenses)
              </h3>
              <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
                नोंदवलेला एकूण खर्च: <strong className="text-red-600 dark:text-red-400">{formatIndianCurrency(totalAllExpenses)}</strong>
                {totalTodayDirectExpense > 0 && ` • आजचा खर्च: ${formatIndianCurrency(totalTodayDirectExpense)}`}
              </p>
            </div>
          </div>

          {expenses.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-dashed border-[#DCD3C3] dark:border-[#263B30]">
              <Receipt className="w-10 h-10 mx-auto text-[#4D6558] dark:text-[#CBDCD4] mb-2 opacity-50" />
              <h4 className="text-sm font-bold text-[#0B1E15] dark:text-white">
                कोणताही खर्च नोंदवलेला नाही
              </h4>
              <p className="text-xs text-[#4D6558] dark:text-[#CBDCD4] mt-1">
                खुराक खरेदी, मजुरी किंवा इतर खर्चाची नोंद करण्यासाठी वर 'नवीन खर्च नोंदवा' वर क्लिक करा.
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#0B1E15] dark:text-white">
                        {getCategoryName(e.category_id)}
                      </span>
                      <span className="text-[10px] text-[#4D6558] dark:text-[#CBDCD4] font-medium">
                        • {e.expense_date}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-0.5">
                      {e.vendor_name || 'स्थानिक विक्रेता'} • {e.payment_mode ? e.payment_mode.toUpperCase() : 'UPI'}
                      {e.description && ` • ${e.description}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-black text-red-600 dark:text-red-400">
                      {formatIndianCurrency(Number(e.amount))}
                    </div>
                    <button
                      onClick={() => handleDeleteExpense(e.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                      title="हटवा"
                    >
                      <Trash2 className="w-4 h-4" />
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
                थेट नफा ({formatIndianCurrency(todayRecord?.simpleOperatingProfit || 19920)}) − दैनिक अप्रत्यक्ष ओव्हरहेड्स ({formatIndianCurrency(totalDailyOverheads)}) = <span className="text-emerald-700 dark:text-emerald-400">खरा नफा {formatIndianCurrency(todayRecord?.trueProfit || 5320)}</span>
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
                {activeLoan.bankName} • मुदत कर्ज
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
                {formatIndianCurrency(Number(activeLoan.principalAmount))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs">
              <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-bold">मासिक हप्ता (EMI)</div>
              <div className="text-base font-black text-[#B07B18] dark:text-[#E5B252] mt-1">
                {formatIndianCurrency(Number(activeLoan.monthlyEmi))}
              </div>
              <div className="text-[10px] text-[#4D6558] dark:text-[#CBDCD4] mt-0.5">दर महिन्याला ५ तारीख</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs">
              <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-bold">व्याज दर</div>
              <div className="text-base font-black text-[#0B1E15] dark:text-white mt-1">
                {activeLoan.annualInterestRate}%
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] shadow-xs">
              <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-bold">उर्वरित मुद्दल बाकी</div>
              <div className="text-base font-black text-amber-700 dark:text-amber-400 mt-1">
                {formatIndianCurrency(Number(activeLoan.outstandingPrincipal))}
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
                एकूण {displayEmployees.length} कर्मचारी • मासिक वेतन खर्च: {formatIndianCurrency(displayEmployees.reduce((sum, e) => sum + e.monthlySalary, 0))}
              </p>
            </div>
          </div>

          {displayEmployees.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-dashed border-[#DCD3C3] dark:border-[#263B30]">
              <Users className="w-10 h-10 mx-auto text-[#4D6558] dark:text-[#CBDCD4] mb-2 opacity-50" />
              <h4 className="text-sm font-bold text-[#0B1E15] dark:text-white">
                कोणताही कर्मचारी जोडलेला नाही
              </h4>
              <p className="text-xs text-[#4D6558] dark:text-[#CBDCD4] mt-1">
                शेड सुपरवायझर, मदतनीस किंवा चालकाची नोंद करण्यासाठी वर '+ कर्मचारी जोडा' बटणावर क्लिक करा.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayEmployees.map(emp => {
                const salary = emp.monthlySalary;
                const role = emp.role;
                return (
                  <div
                    key={emp.id}
                    className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#263B30] flex items-center justify-between hover:border-[#1F4D3A] transition-colors shadow-xs"
                  >
                    <div>
                      <h4 className="text-xs font-black text-[#0B1E15] dark:text-white">
                        {emp.name}
                      </h4>
                      <div className="text-[11px] text-[#4D6558] dark:text-[#CBDCD4] font-medium mt-0.5">
                        {role} {emp.phone ? `• ${emp.phone}` : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-[#1F4D3A] dark:text-[#42BF87]">
                        {formatIndianCurrency(salary)}
                      </div>
                      <div className="text-[10px] text-[#4D6558] dark:text-[#CBDCD4]">मासिक मानधन</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16241D] rounded-3xl p-6 max-w-md w-full border border-[#DCD3C3] dark:border-[#263B30] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
              <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
                नवीन खर्च नोंदवा (Add Expense)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  तारीख (Date) *
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={e => setExpenseDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  खर्च प्रवर्ग (Category) *
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_mr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  रक्कम (Amount ₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="उदा. 5000"
                  value={amount}
                  onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                    पेमेंट मोड
                  </label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                  >
                    <option value="upi">UPI / GPay</option>
                    <option value="cash">रोख (Cash)</option>
                    <option value="bank">बँक RTGS/NEFT</option>
                    <option value="cheque">धनादेश (Cheque)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                    विक्रेता / कामगार नाव
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. स्थानिक सप्लायर"
                    value={vendorName}
                    onChange={e => setVendorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  तपशील / शेरा (Notes)
                </label>
                <input
                  type="text"
                  placeholder="खर्चाचा संक्षिप्त तपशील"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#DCD3C3] text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={submittingExpense}
                  className="flex-1 py-2.5 rounded-xl bg-[#1F4D3A] text-white text-xs font-black hover:bg-[#173A2C] transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingExpense ? 'जतन करत आहे...' : 'जतन करा (Save)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16241D] rounded-3xl p-6 max-w-md w-full border border-[#DCD3C3] dark:border-[#263B30] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
              <h3 className="text-base font-black text-[#0B1E15] dark:text-white">
                नवीन कर्मचारी जोडा (Add Employee)
              </h3>
              <button
                onClick={() => setShowAddEmpModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  कर्मचाऱ्याचे नाव *
                </label>
                <input
                  type="text"
                  placeholder="उदा. रमेश पाटील"
                  value={empName}
                  onChange={e => setEmpName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  हुद्दा (Role)
                </label>
                <input
                  type="text"
                  placeholder="उदा. शेड सुपरवायझर / मदतनीस"
                  value={empRole}
                  onChange={e => setEmpRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  मासिक वेतन (Monthly Salary ₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={empSalary}
                  onChange={e => setEmpSalary(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0B1E15] dark:text-white mb-1">
                  मोबाईल नंबर (Phone)
                </label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={empPhone}
                  onChange={e => setEmpPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-bold text-[#0B1E15] dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#DCD3C3] text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1F4D3A] text-white text-xs font-black hover:bg-[#173A2C] transition-all cursor-pointer"
                >
                  कर्मचारी जोडा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
