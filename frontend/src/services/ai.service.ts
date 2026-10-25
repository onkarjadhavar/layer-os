import { apiClient } from './api-client';

export interface AskQuestionPayload {
  question: string;
  context?: Record<string, any>;
  language?: string;
}

export const aiService = {
  async getDailyAdvisory(farmId: string) {
    return apiClient.post('/api/v1/ai/advisor', { farm_id: farmId });
  },

  async askQuestion(payload: AskQuestionPayload) {
    return apiClient.post('/api/v1/ai/ask', payload);
  },
};
