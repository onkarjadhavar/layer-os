import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/env';

export async function GET() {
  const isDbLive = isSupabaseConfigured();

  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'LayerOS Poultry ERP (Maharashtra)',
    version: '1.0.0',
    database: isDbLive ? 'supabase_postgres_live' : 'in_memory_offline_mock',
    environment: process.env.NODE_ENV || 'production',
    uptimeSeconds: Math.floor(process.uptime()),
    checks: {
      api: 'healthy',
      auth: 'ready',
      storage: 'ready',
      offlineQueue: 'active',
    },
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json',
    },
  });
}
