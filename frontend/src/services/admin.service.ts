import { apiClient } from './api-client';

export interface AdminLoginPayload {
  email: string;
  password: string;
  totp?: string;
}

export const adminService = {
  async login(payload: AdminLoginPayload) {
    const res = await apiClient.post<any>('/api/v1/admin/auth', payload);
    if (res.token) {
      localStorage.setItem('layeros_admin_token', res.token);
    }
    return res;
  },

  async getKPIs() {
    return apiClient.get('/api/v1/admin/kpis');
  },

  async getFarms(status?: string, search?: string) {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`/api/v1/admin/farms${query}`);
  },

  async changeFarmStatus(farmId: string, status: string, reason?: string) {
    return apiClient.post(`/api/v1/admin/farms/${farmId}/status`, { status, reason });
  },

  async extendPlan(farmId: string, days: number, reason?: string) {
    return apiClient.post(`/api/v1/admin/farms/${farmId}/extend-plan`, { days, reason });
  },

  async getAuditLogs(farmId?: string, limit: number = 50) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (farmId) params.append('farm_id', farmId);
    return apiClient.get(`/api/v1/admin/audit-logs?${params.toString()}`);
  },

  async getSettings() {
    return apiClient.get('/api/v1/admin/settings');
  },

  async updateSettings(settings: Record<string, any>) {
    return apiClient.put('/api/v1/admin/settings', settings);
  },

  async recordSupportView(farmId: string, reason?: string) {
    return apiClient.post('/api/v1/admin/support-view', { farm_id: farmId, reason });
  },
};
