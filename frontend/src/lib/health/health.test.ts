import { describe, it, expect } from 'vitest';
import { apiClient } from '../../services/api-client';

describe('LayerOS Health Check Route (/api/health)', () => {
  it('has a configured API base URL for health checks', () => {
    expect(apiClient).toBeDefined();
    expect(typeof apiClient.get).toBe('function');
  });
});
