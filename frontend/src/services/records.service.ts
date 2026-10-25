import { apiClient } from './api-client';

export interface QuickRecordPayload {
  farm_id: string;
  shed_id: string;
  flock_id: string;
  record_date: string;
  mortality_count: number;
  eggs_intact: number;
  eggs_damaged?: number;
  feed_consumed_kg: number;
  operator_notes?: string;
}

export interface DailyRecordPayload {
  farm_id: string;
  shed_id: string;
  flock_id: string;
  record_date: string;
  opening_birds?: number;
  mortality_count?: number;
  culls_count?: number;
  eggs_intact?: number;
  eggs_damaged?: number;
  egg_weight_g?: number;
  feed_consumed_kg?: number;
  water_intake_liters?: number;
  temp_celsius?: number;
  humidity_percent?: number;
  operator_notes?: string;
}

export const recordsService = {
  async getDailyRecords(farmId: string, shedId?: string, flockId?: string, limit: number = 30) {
    const params = new URLSearchParams({ farm_id: farmId, limit: String(limit) });
    if (shedId) params.append('shed_id', shedId);
    if (flockId) params.append('flock_id', flockId);
    return apiClient.get(`/api/v1/records/daily?${params.toString()}`);
  },

  async saveQuickRecord(payload: QuickRecordPayload) {
    return apiClient.post('/api/v1/records/daily/quick', payload);
  },

  async saveFullRecord(payload: DailyRecordPayload) {
    return apiClient.post('/api/v1/records/daily', payload);
  },
};
