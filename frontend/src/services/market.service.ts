import { apiClient } from './api-client';

export interface MarketRatePayload {
  zone: string;
  rate_date: string;
  egg_rate_per_piece: number;
  feed_rate_per_kg?: number;
  cull_bird_rate_per_kg?: number;
  source?: string;
}

export const marketService = {
  async getLatestRates() {
    return apiClient.get('/api/v1/market-rates/latest');
  },

  async getRateHistory(zone: string = 'Pune', days: number = 30) {
    return apiClient.get(`/api/v1/market-rates/history?zone=${encodeURIComponent(zone)}&days=${days}`);
  },

  async submitRate(payload: MarketRatePayload) {
    return apiClient.post('/api/v1/market-rates/', payload);
  },
};
