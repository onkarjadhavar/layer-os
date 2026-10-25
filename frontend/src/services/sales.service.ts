import { apiClient } from './api-client';

export interface CustomerPayload {
  farm_id: string;
  name: string;
  phone?: string;
  customer_type?: string;
  district?: string;
  taluka?: string;
  credit_limit?: number;
}

export interface SalePayload {
  farm_id: string;
  customer_id?: string;
  sale_date: string;
  product_type?: string;
  quantity: number;
  unit: string;
  rate_per_unit: number;
  total_amount?: number;
  amount_paid?: number;
  payment_mode?: string;
  payment_status?: string;
  notes?: string;
}

export interface PaymentPayload {
  farm_id: string;
  customer_id: string;
  sale_id?: string;
  amount: number;
  payment_date: string;
  payment_mode?: string;
  reference_no?: string;
  notes?: string;
}

export const salesService = {
  async getCustomers(farmId: string) {
    return apiClient.get(`/api/v1/sales/customers?farm_id=${farmId}`);
  },

  async createCustomer(payload: CustomerPayload) {
    return apiClient.post('/api/v1/sales/customers', payload);
  },

  async getSales(farmId: string) {
    return apiClient.get(`/api/v1/sales/?farm_id=${farmId}`);
  },

  async createSale(payload: SalePayload) {
    return apiClient.post('/api/v1/sales/', payload);
  },

  async recordPayment(payload: PaymentPayload) {
    return apiClient.post('/api/v1/sales/payments', payload);
  },
};
