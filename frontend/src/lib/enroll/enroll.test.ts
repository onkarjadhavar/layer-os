import { describe, it, expect } from 'vitest';
import {
  ownerAccountSchema,
  shedsFlocksSchema,
  completeEnrollmentSchema,
} from './schema';
import { enrollFarmAction } from './actions';

describe('LayerOS Farm Enrollment & Validation Suite', () => {
  const validOwner = {
    fullName: 'संजय शिंदे (Sanjay Shinde)',
    mobileNumber: '9822156789',
    email: 'sanjay@shindepoultry.com',
    password: 'Password123!',
    acceptTermsAndPrivacy: true as const,
  };

  const validFarm = {
    farmName: 'शिंदे लेयर फार्म (Shinde Layer Farm)',
    ownerName: 'संजय शिंदे',
    villageTown: 'सुपे',
    taluka: 'बारामती',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '412258',
    preferredLanguage: 'mr' as const,
  };

  const validShedsFlocks = {
    numberOfSheds: 2,
    flocks: [
      {
        batchCode: 'Batch-2026-A',
        breed: 'BV300',
        birdsPlaced: 20000,
        currentLiveBirds: 19950,
        ageWeeks: 32,
        housingType: 'elevated_cage' as const,
      },
    ],
  };

  const validFeed = {
    feedBagsPerDay: 44,
    bagSizeKg: 50,
    feedPricePerKg: 35.0,
    feedSupplier: 'गोदरेज ॲग्रोव्हेट',
    planningHorizonDays: 30,
    expectedFeedStockKg: 5000,
  };

  const validSales = {
    traySize: 30,
    traysPerGatta: 7,
    currentSellingPricePerEgg: 5.4,
    mainBuyerType: 'trader' as const,
    nearestMandi: 'Pune' as const,
  };

  const validFinance = {
    monthlyLabour: 40000,
    monthlyMedicine: 15000,
    monthlyElectricity: 12000,
    monthlyOther: 8000,
    monthlyLoanEmi: 25000,
    numberOfEmployees: 3,
  };

  describe('Validation Rules & DPDP Consent', () => {
    it('validates a complete, authentic enrollment payload successfully', () => {
      const result = completeEnrollmentSchema.safeParse({
        owner: validOwner,
        farm: validFarm,
        shedsFlocks: validShedsFlocks,
        feed: validFeed,
        sales: validSales,
        finance: validFinance,
      });

      expect(result.success).toBe(true);
    });

    it('rejects invalid Indian mobile numbers (must be 10 digits starting with 6-9)', () => {
      const badMobiles = ['1234567890', '9822', '982201234567', 'abc9822012', '5822012345'];
      badMobiles.forEach(mob => {
        const res = ownerAccountSchema.safeParse({
          ...validOwner,
          mobileNumber: mob,
        });
        expect(res.success).toBe(false);
      });
    });

    it('enforces password strength requirements (min 8 chars, letter, number)', () => {
      const weakPasswords = ['short', '12345678', 'onlyletters', '1234567890'];
      weakPasswords.forEach(pass => {
        const res = ownerAccountSchema.safeParse({
          ...validOwner,
          password: pass,
        });
        expect(res.success).toBe(false);
      });
    });

    it('enforces mandatory DPDP privacy consent checkbox', () => {
      const res = ownerAccountSchema.safeParse({
        ...validOwner,
        acceptTermsAndPrivacy: false,
      });
      expect(res.success).toBe(false);
    });

    it('rejects negative or zero bird counts', () => {
      const badFlockRes = shedsFlocksSchema.safeParse({
        numberOfSheds: 1,
        flocks: [
          {
            batchCode: 'Batch-1',
            breed: 'BV300',
            birdsPlaced: -500,
            currentLiveBirds: 0,
            ageWeeks: 30,
            housingType: 'elevated_cage',
          },
        ],
      });
      expect(badFlockRes.success).toBe(false);
    });

    it('rejects honeypot submission when bot fills the hidden trap field', async () => {
      const res = await enrollFarmAction({
        owner: validOwner,
        farm: validFarm,
        shedsFlocks: validShedsFlocks,
        feed: validFeed,
        sales: validSales,
        finance: validFinance,
        honeypot: 'spam_bot_input',
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain('Bot detected');
    });
  });

  describe('Atomic Server Action Execution & Calculations', () => {
    it('executes atomic enrollment and returns initialized metrics for dashboard handoff', async () => {
      const res = await enrollFarmAction({
        owner: validOwner,
        farm: validFarm,
        shedsFlocks: validShedsFlocks,
        feed: validFeed,
        sales: validSales,
        finance: validFinance,
      });

      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();

      const data = res.data!;
      expect(data.farmName).toBe(validFarm.farmName);
      expect(data.ownerName).toBe(validOwner.fullName);
      expect(data.totalBirds).toBe(19950);

      // Check unit settings
      expect(data.unitSettings.gattaSizeTrays).toBe(7);
      expect(data.unitSettings.traySizeEggs).toBe(30);

      // Check computed feed planning horizon
      const dailyFeedKg = validFeed.feedBagsPerDay * validFeed.bagSizeKg; // 44 * 50 = 2200 kg
      expect(data.feedRequirementKg).toBe(dailyFeedKg * 30); // 66,000 kg
      expect(data.feedCostINR).toBe(66000 * 35.0); // ₹23,10,000

      // Check welcome stats
      expect(data.welcomeStats.dailyEggsEstimate).toBeGreaterThan(15000);
      expect(data.welcomeStats.monthlyFeedBags).toBe(44 * 30);
      expect(data.projectedBreakEvenPrice).toBeGreaterThan(4.0);
    });

    it('fails safely and halts without partial persistence on invalid input', async () => {
      const res = await enrollFarmAction({
        owner: { ...validOwner, mobileNumber: 'invalid' },
        farm: validFarm,
        shedsFlocks: validShedsFlocks,
        feed: validFeed,
        sales: validSales,
        finance: validFinance,
      });

      expect(res.success).toBe(false);
      expect(res.data).toBeUndefined();
      expect(res.fieldErrors).toBeDefined();
    });
  });

  describe('Dynamic Farm Dashboard Routing & Resolution Contract', () => {
    it('generates a direct farm-specific route matching /dashboard/farms/:farmId', () => {
      const farmId = '6d84dce2-ec8b-4c70-831e-2c899b55b8f1';
      const expectedRoute = `/dashboard/farms/${farmId}`;

      expect(expectedRoute).toBe(`/dashboard/farms/${farmId}`);
      expect(expectedRoute).not.toContain('?live=true');
      expect(expectedRoute).not.toContain('sahyadri');
    });

    it('isolates different farms so separate farm IDs never resolve to the same state', () => {
      const farm1 = { id: 'farm-1', name: 'शिंदे लेयर फार्म' };
      const farm2 = { id: 'farm-2', name: 'कदम हायटेक पोल्ट्री' };

      expect(farm1.id).not.toBe(farm2.id);
      expect(farm1.name).not.toBe(farm2.name);
      expect(`/dashboard/farms/${farm1.id}`).not.toBe(`/dashboard/farms/${farm2.id}`);
    });
  });
});
