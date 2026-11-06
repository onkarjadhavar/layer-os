import { apiClient } from './api-client';

export interface ExpenseCategory {
  id: string;
  farm_id: string;
  code: string;
  name_mr: string;
  name_en: string;
  is_cash_expense: boolean;
  created_at?: string;
}

export interface ExpensePayload {
  farm_id: string;
  flock_id?: string | null;
  category_id?: string | null;
  expense_date: string;
  amount: number;
  payment_mode?: string;
  vendor_name?: string | null;
  description?: string | null;
}

export interface ExpenseRecord extends ExpensePayload {
  id: string;
  created_at: string;
}

export interface LoanPayload {
  farm_id: string;
  bank_name: string;
  principal_amount: number;
  annual_interest_rate: number;
  monthly_emi: number;
  emi_due_day?: number;
  tenure_months: number;
  start_date: string;
  outstanding_principal: number;
}

export interface LoanRecord extends LoanPayload {
  id: string;
  created_at: string;
}

export interface EmployeePayload {
  farm_id: string;
  name: string;
  role?: string;
  monthly_salary: number;
  phone?: string | null;
  joining_date: string;
  is_active?: boolean;
}

export interface EmployeeRecord extends EmployeePayload {
  id: string;
  created_at: string;
}

export const financeService = {
  async getCategories(farmId: string): Promise<ExpenseCategory[]> {
    return apiClient.get(`/api/v1/finance/categories?farm_id=${farmId}`);
  },

  async createCategory(payload: { farm_id: string; code: string; name_mr: string; name_en: string; is_cash_expense?: boolean }): Promise<ExpenseCategory> {
    return apiClient.post('/api/v1/finance/categories', payload);
  },

  async getExpenses(farmId: string, startDate?: string, endDate?: string): Promise<ExpenseRecord[]> {
    let url = `/api/v1/finance/expenses?farm_id=${farmId}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    return apiClient.get(url);
  },

  async createExpense(payload: ExpensePayload): Promise<ExpenseRecord> {
    return apiClient.post('/api/v1/finance/expenses', payload);
  },

  async deleteExpense(expenseId: string): Promise<{ status: string; id: string }> {
    return apiClient.delete(`/api/v1/finance/expenses/${expenseId}`);
  },

  async getLoan(farmId: string): Promise<LoanRecord | null> {
    return apiClient.get(`/api/v1/finance/loan?farm_id=${farmId}`);
  },

  async saveLoan(payload: LoanPayload): Promise<LoanRecord> {
    return apiClient.post('/api/v1/finance/loan', payload);
  },

  async getEmployees(farmId: string): Promise<EmployeeRecord[]> {
    return apiClient.get(`/api/v1/finance/employees?farm_id=${farmId}`);
  },

  async createEmployee(payload: EmployeePayload): Promise<EmployeeRecord> {
    return apiClient.post('/api/v1/finance/employees', payload);
  },
};

