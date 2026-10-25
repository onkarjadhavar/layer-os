import { apiClient } from './api-client';

export interface LoginPayload {
  email?: string;
  password?: string;
  phone?: string;
  otp?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    farm_id?: string;
    phone?: string;
  };
}

export interface EnrollmentPayload {
  farm_name: string;
  owner_name: string;
  phone: string;
  email: string;
  district: string;
  taluka?: string;
  total_capacity: number;
  number_of_sheds: number;
  preferred_language?: string;
  shed_details?: Array<{
    name: string;
    capacity: number;
    flock_name?: string;
    bird_count?: number;
    breed?: string;
    age_weeks?: number;
  }>;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', payload);
    if (response.access_token) {
      localStorage.setItem('layeros_token', response.access_token);
      localStorage.setItem('layeros_live_active', 'true');
    }
    return response;
  },

  async getCurrentUser() {
    return apiClient.get('/api/v1/auth/me');
  },

  async register(payload: EnrollmentPayload) {
    return apiClient.post('/api/v1/auth/register', payload);
  },

  logout() {
    localStorage.removeItem('layeros_token');
    localStorage.removeItem('layeros_live_active');
    sessionStorage.removeItem('layeros_entered');
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem('layeros_token'));
  },
};
