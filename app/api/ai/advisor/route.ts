import { NextRequest, NextResponse } from 'next/server';
import { askLayerOsAI, buildSanitizedContext } from '@/lib/ai/gemini';
import { Farm, Flock, DailyRecord, MarketRate, Customer } from '@/lib/store/seedData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { farm, flock, todayRecord, marketRates, customers, query, language } = body as {
      farm: Farm;
      flock: Flock;
      todayRecord: DailyRecord;
      marketRates: MarketRate[];
      customers: Customer[];
      query: string;
      language?: 'mr' | 'en' | 'hi';
    };

    if (!farm || !flock || !todayRecord || !query) {
      return NextResponse.json(
        { error: 'Missing required parameters: farm, flock, todayRecord, and query are required' },
        { status: 400 }
      );
    }

    // Central farm status enforcement: blocked farms cannot access AI advisory
    if (farm.status && farm.status !== 'active') {
      return NextResponse.json(
        { error: `Farm access blocked: account status is '${farm.status}'. Contact administrator.` },
        { status: 403 }
      );
    }

    const sanitized = buildSanitizedContext(
      farm,
      flock,
      todayRecord,
      marketRates || [],
      customers || []
    );

    const result = await askLayerOsAI({
      query,
      language: language || 'mr',
      context: sanitized,
      rawToday: todayRecord,
      rawCustomers: customers || [],
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
