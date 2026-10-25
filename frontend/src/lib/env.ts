import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:5173'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function getEnvVal(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env && (process.env as any)[key]) {
    return (process.env as any)[key];
  }
  try {
    return (import.meta as any).env?.[key] || (import.meta as any).env?.[`VITE_${key}`];
  } catch {
    return undefined;
  }
}

function parseEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: getEnvVal('NEXT_PUBLIC_SUPABASE_URL') || getEnvVal('VITE_SUPABASE_URL'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVal('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnvVal('VITE_SUPABASE_ANON_KEY'),
    SUPABASE_SERVICE_ROLE_KEY: getEnvVal('SUPABASE_SERVICE_ROLE_KEY'),
    NEXT_PUBLIC_APP_URL: getEnvVal('NEXT_PUBLIC_APP_URL') || 'http://localhost:5173',
    NODE_ENV: getEnvVal('NODE_ENV') || 'development',
    RAZORPAY_KEY_ID: getEnvVal('RAZORPAY_KEY_ID'),
    RAZORPAY_KEY_SECRET: getEnvVal('RAZORPAY_KEY_SECRET'),
    RAZORPAY_WEBHOOK_SECRET: getEnvVal('RAZORPAY_WEBHOOK_SECRET'),
    NEXT_PUBLIC_RAZORPAY_KEY_ID: getEnvVal('NEXT_PUBLIC_RAZORPAY_KEY_ID'),
  });

  if (!parsed.success) {
    return {
      NEXT_PUBLIC_APP_URL: 'http://localhost:5173',
      NODE_ENV: 'development',
    };
  }

  return parsed.data;
}

export const env = parseEnv();

export function isSupabaseConfigured(): boolean {
  return false;
}

export function assertSupabaseConfigured(): void {
  // In the refactored architecture, PostgreSQL + FastAPI is the database provider
}
