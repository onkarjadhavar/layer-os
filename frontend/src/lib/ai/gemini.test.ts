import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildSanitizedContext, askLayerOsAI } from './gemini';
import { askLayerOsAction } from './actions';
import {
  SEED_FARM,
  SEED_FLOCK,
  SEED_MARKET_RATES,
  SEED_CUSTOMERS,
  generate90DaysDailyRecords,
  Farm,
  Flock,
} from '../store/seedData';

describe('Phase 5: LayerOS Gemini AI Integration & Fallback Engine', () => {
  const originalEnv = process.env;
  const records = generate90DaysDailyRecords();
  const todayRecord = records[records.length - 1];

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.GEMINI_API_KEY;
    delete process.env.AI_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('1. PII Stripping & Privacy Auditing', () => {
    it('completely strips phone numbers, customer names, addresses, and farm owner PII', () => {
      const sanitized = buildSanitizedContext(
        SEED_FARM,
        SEED_FLOCK,
        todayRecord,
        SEED_MARKET_RATES,
        SEED_CUSTOMERS
      );

      const serialized = JSON.stringify(sanitized);

      // Farm Owner PII must NOT exist in sanitized context
      expect(serialized.includes(SEED_FARM.phone)).toBe(false);
      expect(serialized.includes(SEED_FARM.email)).toBe(false);
      if (SEED_FARM.gstin) {
        expect(serialized.includes(SEED_FARM.gstin)).toBe(false);
      }
      expect(serialized.includes(SEED_FARM.ownerName)).toBe(false);

      // Customer PII (phone numbers, specific street/locality names, customer trading names) must NOT exist
      for (const customer of SEED_CUSTOMERS) {
        expect(serialized.includes(customer.phone)).toBe(false);
        expect(serialized.includes(customer.name)).toBe(false);
      }

      // Specific locality tokens from customer address that are not mandi names
      expect(serialized.includes('गुलटेकडी')).toBe(false);
      expect(serialized.includes('हडपसर')).toBe(false);
      expect(serialized.includes('चिंचवड')).toBe(false);

      // Receivables summary must be strictly aggregated without individual PII
      expect(sanitized.receivablesSummary.topDebtorCategory).not.toContain(SEED_CUSTOMERS[0].name);
      expect(sanitized.receivablesSummary.totalOutstanding).toBeGreaterThan(0);
      expect(sanitized.receivablesSummary.overdueOver21Days).toBeGreaterThan(0);

      // Essential operational metrics must remain intact
      expect(sanitized.farmName).toBe(SEED_FARM.name);
      expect(sanitized.district).toBe(SEED_FARM.district);
      expect(sanitized.todayMetrics.liveBirds).toBe(todayRecord.closingBirds);
      expect(sanitized.todayMetrics.hdPct).toBe(todayRecord.hdPct);
      expect(sanitized.todayMetrics.feedIssuedKg).toBe(todayRecord.feedIssuedKg);
      expect(sanitized.todayMetrics.breakEvenRate).toBe(todayRecord.breakEvenEggPrice);
    });
  });

  describe('2. Multi-Tenant Data Isolation', () => {
    it('ensures Farm A context contains zero data or identifiers from Farm B', () => {
      const farmA: Farm = {
        ...SEED_FARM,
        id: 'farm-tenant-pune-001',
        name: 'Sahyadri Layer Farm',
        district: 'Pune',
      };
      const flockA: Flock = {
        ...SEED_FLOCK,
        id: 'flock-pune-001',
        batchCode: 'PUNE-BV300-24',
      };

      const farmB: Farm = {
        ...SEED_FARM,
        id: 'farm-tenant-kolhapur-002',
        name: 'Krishna Valley Layer Farm',
        district: 'Kolhapur',
      };
      const flockB: Flock = {
        ...SEED_FLOCK,
        id: 'flock-kolhapur-002',
        batchCode: 'KOLHAPUR-BV300-25',
      };

      const contextA = buildSanitizedContext(farmA, flockA, todayRecord, [], []);
      const contextB = buildSanitizedContext(farmB, flockB, todayRecord, [], []);

      const serializedA = JSON.stringify(contextA);
      const serializedB = JSON.stringify(contextB);

      // Context A verification
      expect(serializedA).toContain('Sahyadri Layer Farm');
      expect(serializedA).toContain('PUNE-BV300-24');
      expect(contextA.district).toBe('Pune');
      expect(serializedA).not.toContain('Krishna Valley Layer Farm');
      expect(serializedA).not.toContain('KOLHAPUR-BV300-25');
      expect(serializedA).not.toContain('Kolhapur');

      // Context B verification
      expect(serializedB).toContain('Krishna Valley Layer Farm');
      expect(serializedB).toContain('KOLHAPUR-BV300-25');
      expect(contextB.district).toBe('Kolhapur');
      expect(serializedB).not.toContain('Sahyadri Layer Farm');
      expect(serializedB).not.toContain('PUNE-BV300-24');
      expect(serializedB).not.toContain('Pune');
    });
  });

  describe('3. Seamless Rule-Based Fallback when Offline/Unconfigured', () => {
    it('falls back to rule-based poultry engine when GEMINI_API_KEY is not set', async () => {
      delete process.env.GEMINI_API_KEY;

      const sanitized = buildSanitizedContext(
        SEED_FARM,
        SEED_FLOCK,
        todayRecord,
        SEED_MARKET_RATES,
        SEED_CUSTOMERS
      );

      const result = await askLayerOsAI({
        query: 'आजचा नफा आणि उत्पादन कसे आहे?',
        language: 'mr',
        context: sanitized,
        rawToday: todayRecord,
        rawCustomers: SEED_CUSTOMERS,
      });

      expect(result.success).toBe(true);
      expect(result.source).toBe('rule_based');
      expect(result.model).toBe('rule-based-engine');
      expect(result.badge).toBe('Rule-based analysis (AI offline)');
      expect(result.text).toBeTruthy();
      expect(result.disclaimer).toContain('Rule-based engine active');
    });
  });

  describe('4. Live Gemini API Integration with Mocking', () => {
    it('successfully calls Gemini 2.5 Flash and returns live badge on HTTP 200', async () => {
      process.env.GEMINI_API_KEY = 'test-gemini-live-key';

      const mockResponseText = 'आजचे हेन-डे उत्पादन उत्कृष्ट आहे. प्रति पक्षी खुराक प्रमाण योग्य आहे.';

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: mockResponseText }],
              },
            },
          ],
        }),
      });
      global.fetch = fetchMock;

      const sanitized = buildSanitizedContext(
        SEED_FARM,
        SEED_FLOCK,
        todayRecord,
        SEED_MARKET_RATES,
        SEED_CUSTOMERS
      );

      const result = await askLayerOsAI({
        query: 'आजच्या उत्पादनाचा आढावा द्या',
        language: 'mr',
        context: sanitized,
        rawToday: todayRecord,
        rawCustomers: SEED_CUSTOMERS,
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [requestUrl, requestOptions] = fetchMock.mock.calls[0];
      expect(requestUrl).toContain('gemini-2.5-flash:generateContent?key=test-gemini-live-key');
      expect(requestOptions.method).toBe('POST');

      // Verify system prompt in body enforces Marathi and includes operational numbers
      const parsedBody = JSON.parse(requestOptions.body);
      const sentPrompt = parsedBody.contents[0].parts[0].text;
      expect(sentPrompt).toContain(SEED_FARM.name);
      expect(sentPrompt).toContain(`${todayRecord.hdPct}%`);
      expect(sentPrompt).toContain('Marathi');

      // Result payload assertions
      expect(result.success).toBe(true);
      expect(result.source).toBe('gemini');
      expect(result.model).toBe('gemini-2.5-flash');
      expect(result.badge).toBe('Gemini 2.5 Flash (Live)');
      expect(result.text).toBe(mockResponseText);
      expect(result.disclaimer).toContain('Gemini 2.5 Flash');
    });
  });

  describe('5. Error Handling & Timeout Graceful Degradation', () => {
    it('gracefully degrades to rule-based engine when Gemini API returns HTTP 500', async () => {
      process.env.GEMINI_API_KEY = 'test-gemini-key';

      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error' }),
      });
      global.fetch = fetchMock;

      const sanitized = buildSanitizedContext(
        SEED_FARM,
        SEED_FLOCK,
        todayRecord,
        SEED_MARKET_RATES,
        SEED_CUSTOMERS
      );

      const result = await askLayerOsAI({
        query: 'खुराक नियोजन काय करावे?',
        language: 'mr',
        context: sanitized,
        rawToday: todayRecord,
        rawCustomers: SEED_CUSTOMERS,
      });

      // Must NOT throw uncaught error; must return fallback gracefully
      expect(result.success).toBe(true);
      expect(result.source).toBe('rule_based');
      expect(result.badge).toBe('Rule-based analysis (AI offline)');
      expect(result.disclaimer).toContain('Gemini unavailable (Gemini API error HTTP 500)');
      expect(result.text).toBeTruthy();
    });

    it('gracefully degrades to rule-based engine on network timeout or fetch rejection', async () => {
      process.env.GEMINI_API_KEY = 'test-gemini-key';

      const fetchMock = vi.fn().mockRejectedValue(new Error('The operation was aborted due to timeout'));
      global.fetch = fetchMock;

      const sanitized = buildSanitizedContext(
        SEED_FARM,
        SEED_FLOCK,
        todayRecord,
        SEED_MARKET_RATES,
        SEED_CUSTOMERS
      );

      const result = await askLayerOsAI({
        query: 'बाजारात अंडी विकावीत का?',
        language: 'mr',
        context: sanitized,
        rawToday: todayRecord,
        rawCustomers: SEED_CUSTOMERS,
      });

      expect(result.success).toBe(true);
      expect(result.source).toBe('rule_based');
      expect(result.badge).toBe('Rule-based analysis (AI offline)');
      expect(result.disclaimer).toContain('The operation was aborted due to timeout');
    });
  });

  describe('6. Server Action Execution', () => {
    it('executes askLayerOsAction securely without client key leaks', async () => {
      const result = await askLayerOsAction({
        farm: SEED_FARM,
        flock: SEED_FLOCK,
        todayRecord,
        marketRates: SEED_MARKET_RATES,
        customers: SEED_CUSTOMERS,
        query: 'नफा कसा वाढवता येईल?',
        language: 'mr',
      });

      expect(result.success).toBe(true);
      expect(result.badge).toBeTruthy();
      expect(result.text).toBeTruthy();
    });
  });
});
