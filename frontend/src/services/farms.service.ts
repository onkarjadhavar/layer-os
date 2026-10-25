import { apiClient } from './api-client';

export interface ShedPayload {
  name: string;
  capacity: number;
  length_ft?: number;
  width_ft?: number;
  equipment_type?: string;
}

export interface FlockPayload {
  name: string;
  shed_id: string;
  breed?: string;
  initial_birds: number;
  current_birds: number;
  hatch_date?: string;
  placement_date: string;
  age_weeks: number;
  is_active?: boolean;
}

export interface FarmEnrollmentResponse {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  district: string;
  total_capacity: number;
  status: string;
  user_id: string;
  access_token: string;
  token_type: string;
  sheds_count: number;
  flocks_count: number;
  redirect_url: string;
}

export interface FarmDashboardResponse {
  farm: {
    id: string;
    name: string;
    owner_name: string;
    phone: string;
    email?: string;
    address?: string;
    district: string;
    state: string;
    pincode?: string;
    total_capacity: number;
    status: string;
    created_at?: string;
    unit_settings?: any;
  };
  sheds: any[];
  flocks: any[];
  unit_settings?: any;
  daily_records: any[];
  sales: any[];
  summary: {
    total_birds: number;
    eggs_collected_today: number;
    feed_used_today_kg: number;
    mortality_today: number;
    hd_pct: number;
    feed_per_bird_g: number;
    today_revenue: number;
    today_cost: number;
    today_operating_profit: number;
    break_even_price: number;
    selling_price_per_egg: number;
  };
}

export const farmsService = {
  async enrollFarm(payload: any): Promise<FarmEnrollmentResponse> {
    const res = await apiClient.post<FarmEnrollmentResponse>('/api/v1/farms/enroll', payload);
    if (res.access_token) {
      localStorage.setItem('layeros_token', res.access_token);
      localStorage.setItem('layeros_live_active', 'true');
    }
    return res;
  },

  async getFarm(farmId: string) {
    return apiClient.get(`/api/v1/farms/${farmId}`);
  },

  async getFarmDashboard(farmId: string): Promise<FarmDashboardResponse> {
    return apiClient.get<FarmDashboardResponse>(`/api/v1/farms/${farmId}/dashboard`);
  },

  async getSheds(farmId: string) {
    return apiClient.get(`/api/v1/farms/${farmId}/sheds`);
  },

  async createShed(farmId: string, payload: ShedPayload) {
    return apiClient.post(`/api/v1/farms/${farmId}/sheds`, payload);
  },

  async getFlocks(farmId: string) {
    return apiClient.get(`/api/v1/farms/${farmId}/flocks`);
  },

  async createFlock(farmId: string, payload: FlockPayload) {
    return apiClient.post(`/api/v1/farms/${farmId}/flocks`, payload);
  },
};
