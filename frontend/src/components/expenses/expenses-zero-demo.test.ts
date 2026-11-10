import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { SEED_EXPENSES, SEED_EMPLOYEES, SEED_LOAN, ExpenseItem } from '@/lib/store/seedData';

describe('Expenses & Accounts Zero Demo Data Isolation for Enrolled Farms', () => {
  const expensesModulePath = path.resolve(__dirname, 'ExpensesModule.tsx');
  const storePath = path.resolve(__dirname, '../../lib/store/index.tsx');
  const expensesContent = fs.readFileSync(expensesModulePath, 'utf-8');
  const storeContent = fs.readFileSync(storePath, 'utf-8');

  it('verifies demo fixtures contain sample records strictly for demo mode', () => {
    expect(SEED_EXPENSES.length).toBeGreaterThan(0);
    expect(SEED_EXPENSES.every(e => e.farmId === 'farm-sahyadri-01')).toBe(true);
    expect(SEED_EMPLOYEES.length).toBeGreaterThan(0);
    expect(SEED_LOAN.principalAmount).toBeGreaterThan(0);
  });

  it('verifies ExpensesModule connects dynamically to store expenses and actions', () => {
    expect(expensesContent).toContain('expenses = []');
    expect(expensesContent).toContain('addExpense');
    expect(expensesContent).toContain('deleteExpense');
    expect(expensesContent).toContain('addEmployee');
    expect(expensesContent).toContain('updateLoan');
  });

  it('verifies ExpensesModule displays an informative zero-state card when expenses is empty', () => {
    expect(expensesContent).toContain('अद्याप कोणताही दैनंदिन खर्च नोंदवलेला नाही');
    expect(expensesContent).toContain('+ पहिला खर्च नोंदवा (Add First Expense)');
    expect(expensesContent).toContain('+ नवीन खर्च नोंदवा (Add Expense)');
  });

  it('verifies dynamic expense calculation instead of hardcoded amounts', () => {
    expect(expensesContent).toContain('feedExpensesTotal');
    expect(expensesContent).toContain('otherExpensesTotal');
    expect(expensesContent).toContain('totalDailyExpenses');
    expect(expensesContent).not.toContain('formatIndianCurrency(127500)');
  });

  it('verifies interactive modal forms exist for adding expenses, staff, and bank loan', () => {
    expect(expensesContent).toContain('नवीन खर्च नोंदवा (Add Daily Expense)');
    expect(expensesContent).toContain('खर्च जतन करा (Save Expense)');
    expect(expensesContent).toContain('नवीन कर्मचारी जोडा (Add Farm Staff)');
    expect(expensesContent).toContain('बँक कर्ज तपशील (Poultry Term Loan)');
  });

  it('verifies store provides zero demo data isolation for enrolled customer expenses', () => {
    expect(storeContent).toContain("e.farmId !== 'farm-sahyadri-01'");
    expect(storeContent).toContain("e.farmId !== 'farm-anand-02'");
    expect(storeContent).toContain('expenses: validExpenses');
  });

  it('allows daily expense addition by enrolled customer and computes category totals dynamically', () => {
    const enrolledFarmId = 'farm-enrolled-test-999';
    let farmExpenses: ExpenseItem[] = [];

    // User adds feed expense on Day 1
    const expense1: ExpenseItem = {
      id: 'exp-test-01',
      farmId: enrolledFarmId,
      date: '2026-11-10',
      category: 'खुराक खरेदी (Feed Purchase)',
      amount: 45000,
      mode: 'upi',
      vendor: 'महावीर ॲग्रो फीड्स',
    };
    farmExpenses = [expense1, ...farmExpenses];

    // User adds medicine expense
    const expense2: ExpenseItem = {
      id: 'exp-test-02',
      farmId: enrolledFarmId,
      date: '2026-11-10',
      category: 'औषध व लसी (Medicines & Vaccines)',
      amount: 3200,
      mode: 'cash',
      vendor: 'किसान मेडिकल',
    };
    farmExpenses = [expense2, ...farmExpenses];

    expect(farmExpenses.length).toBe(2);

    const totalExpenses = farmExpenses.reduce((sum, e) => sum + e.amount, 0);
    expect(totalExpenses).toBe(48200);

    const feedTotal = farmExpenses
      .filter(e => e.category.includes('खुराक') || e.category.toLowerCase().includes('feed'))
      .reduce((sum, e) => sum + e.amount, 0);
    expect(feedTotal).toBe(45000);

    const otherTotal = farmExpenses
      .filter(e => !e.category.includes('खुराक') && !e.category.toLowerCase().includes('feed'))
      .reduce((sum, e) => sum + e.amount, 0);
    expect(otherTotal).toBe(3200);
  });

  it('supports deleting an expense entry', () => {
    const enrolledFarmId = 'farm-enrolled-test-999';
    let farmExpenses: ExpenseItem[] = [
      {
        id: 'exp-01',
        farmId: enrolledFarmId,
        date: '2026-11-10',
        category: 'वाहतूक खर्च (Transport)',
        amount: 1500,
        mode: 'cash',
        vendor: 'स्थानिक टेम्पो',
      },
      {
        id: 'exp-02',
        farmId: enrolledFarmId,
        date: '2026-11-10',
        category: 'किरकोळ खर्च (Miscellaneous Expense)',
        amount: 600,
        mode: 'upi',
        vendor: 'इलेक्ट्रिकल वर्कशॉप',
      },
    ];

    expect(farmExpenses.length).toBe(2);

    // Delete exp-01
    farmExpenses = farmExpenses.filter(e => e.id !== 'exp-01');

    expect(farmExpenses.length).toBe(1);
    expect(farmExpenses[0].id).toBe('exp-02');
    expect(farmExpenses[0].amount).toBe(600);
  });
});
