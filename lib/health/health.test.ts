import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/health/route';

describe('LayerOS Health Check Route (/api/health) (Phase 8)', () => {
  it('returns HTTP 200 with ok status and poultry service metadata', async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.service).toContain('LayerOS');
    expect(data.version).toBe('1.0.0');
    expect(data.checks).toBeDefined();
    expect(data.checks.api).toBe('healthy');
    expect(data.checks.offlineQueue).toBe('active');
    expect(typeof data.uptimeSeconds).toBe('number');
    expect(typeof data.timestamp).toBe('string');
  });
});
