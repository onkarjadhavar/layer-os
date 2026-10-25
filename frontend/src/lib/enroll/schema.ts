import { z } from 'zod';

export const MAHARASHTRA_DISTRICTS = [
  'Pune',
  'Nashik',
  'Sangli',
  'Satara',
  'Solapur',
  'Ahmednagar',
  'Kolhapur',
  'Nagpur',
  'Aurangabad (Chhatrapati Sambhajinagar)',
  'Amravati',
  'Beed',
  'Bhandara',
  'Buldhana',
  'Chandrapur',
  'Dhule',
  'Gadchiroli',
  'Gondia',
  'Hingoli',
  'Jalgaon',
  'Jalna',
  'Latur',
  'Mumbai City',
  'Mumbai Suburban',
  'Nanded',
  'Nandurbar',
  'Osmanabad (Dharashiv)',
  'Palghar',
  'Parbhani',
  'Raigad',
  'Ratnagiri',
  'Sindhudurg',
  'Thane',
  'Wardha',
  'Washim',
  'Yavatmal',
] as const;

export const INDIAN_STATES = [
  'Maharashtra',
  'Karnataka',
  'Gujarat',
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Other State',
] as const;

export const POULTRY_BREEDS = [
  'BV300',
  'Lohmann LSL',
  'Hy-Line Brown',
  'Bovans White',
  'ISA Brown',
  'Other',
] as const;

export const HOUSING_TYPES = [
  { value: 'elevated_cage', labelMr: 'उंच पिंजरा (Elevated Cage)', labelEn: 'Elevated Cage', labelHi: 'एलिवेटेड केज' },
  { value: 'cage', labelMr: 'पारंपारिक पिंजरा (Standard Cage)', labelEn: 'Standard Cage', labelHi: 'मानक केज' },
  { value: 'environment_controlled', labelMr: 'वातानुकूलित (EC Shed)', labelEn: 'EC Shed (Climate Controlled)', labelHi: 'वातानुकूलित शेड' },
  { value: 'deep_litter', labelMr: 'डीप लिटर (Deep Litter)', labelEn: 'Deep Litter', labelHi: 'डीप लिटर' },
] as const;

export const BUYER_TYPES = [
  { value: 'trader', labelMr: 'अंडी व्यापारी (Trader)', labelEn: 'Trader', labelHi: 'व्यापारी' },
  { value: 'wholesaler', labelMr: 'घाऊक विक्रेता (Wholesaler)', labelEn: 'Wholesaler', labelHi: 'थोक विक्रेता' },
  { value: 'retailer', labelMr: 'किरकोळ दुकानदार (Retailer)', labelEn: 'Retailer', labelHi: 'खुदरा विक्रेता' },
  { value: 'direct_consumer', labelMr: 'थेट ग्राहक (Direct Consumer)', labelEn: 'Direct Consumer', labelHi: 'प्रत्यक्ष उपभोक्ता' },
] as const;

export const MANDI_LIST = ['Pune', 'Mumbai', 'Nashik', 'Nagpur', 'Namakkal', 'Barwala'] as const;

// Step 1: Owner Account Schema
export const ownerAccountSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number (6-9 prefix)'),
  email: z.string().trim().email('Must be a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must include at least one letter')
    .regex(/[0-9]/, 'Password must include at least one digit'),
  acceptTermsAndPrivacy: z
    .boolean()
    .refine((val): val is true => val === true, {
      message: 'You must accept the DPDP privacy terms and conditions',
    }),
});

// Step 2: Farm Details Schema
export const farmDetailsSchema = z.object({
  farmName: z.string().trim().min(2, 'Farm name must be at least 2 characters'),
  ownerName: z.string().trim().min(2, 'Owner name must be at least 2 characters'),
  villageTown: z.string().trim().min(2, 'Village or town is required'),
  taluka: z.string().trim().min(2, 'Taluka is required'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().default('Maharashtra'),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Must be a valid 6-digit Indian PIN code'),
  preferredLanguage: z.enum(['mr', 'hi', 'en']).default('mr'),
});

// Flock Item Schema
export const flockItemSchema = z.object({
  batchCode: z.string().trim().min(2, 'Batch code is required (e.g. Batch-1)'),
  breed: z.string().trim().min(2, 'Breed is required'),
  birdsPlaced: z.coerce.number().int().positive('Birds placed must be positive'),
  currentLiveBirds: z.coerce.number().int().positive('Current live birds must be positive'),
  ageWeeks: z.coerce.number().int().min(1).max(120, 'Age in weeks must be between 1 and 120'),
  housingType: z.enum(['elevated_cage', 'cage', 'environment_controlled', 'deep_litter']).default('elevated_cage'),
});

// Step 3: Sheds & Flocks Schema
export const shedsFlocksSchema = z.object({
  numberOfSheds: z.coerce.number().int().min(1, 'Must have at least 1 shed').max(50),
  flocks: z.array(flockItemSchema).min(1, 'At least one flock must be registered'),
});

// Step 4: Feed & Costs Schema
export const feedCostsSchema = z.object({
  feedBagsPerDay: z.coerce.number().positive('Daily feed bags must be positive'),
  bagSizeKg: z.coerce.number().positive('Bag weight must be positive').default(50),
  feedPricePerKg: z.coerce.number().positive('Feed price per kg must be positive'),
  feedSupplier: z.string().trim().optional(),
  planningHorizonDays: z.coerce.number().int().refine(val => [30, 60, 90].includes(val), {
    message: 'Planning horizon must be 30, 60, or 90 days',
  }).default(30),
  expectedFeedStockKg: z.coerce.number().nonnegative().default(5000),
});

// Step 5: Egg Sales & Units Schema
export const eggSalesUnitsSchema = z.object({
  traySize: z.coerce.number().int().positive().default(30),
  traysPerGatta: z.coerce.number().int().positive().default(7),
  currentSellingPricePerEgg: z.coerce.number().positive('Selling price per egg must be positive'),
  mainBuyerType: z.enum(['trader', 'wholesaler', 'retailer', 'direct_consumer']).default('trader'),
  nearestMandi: z.enum(MANDI_LIST).default('Pune'),
});

// Step 6: Expenses & Finance Schema (Optional fields with defaults)
export const expensesFinanceSchema = z.object({
  monthlyLabour: z.coerce.number().nonnegative().default(0),
  monthlyMedicine: z.coerce.number().nonnegative().default(0),
  monthlyElectricity: z.coerce.number().nonnegative().default(0),
  monthlyOther: z.coerce.number().nonnegative().default(0),
  monthlyLoanEmi: z.coerce.number().nonnegative().default(0),
  numberOfEmployees: z.coerce.number().int().nonnegative().default(0),
});

// Complete Enrollment Master Schema
export const completeEnrollmentSchema = z.object({
  owner: ownerAccountSchema,
  farm: farmDetailsSchema,
  shedsFlocks: shedsFlocksSchema,
  feed: feedCostsSchema,
  sales: eggSalesUnitsSchema,
  finance: expensesFinanceSchema,
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

export type OwnerAccountInput = z.infer<typeof ownerAccountSchema>;
export type FarmDetailsInput = z.infer<typeof farmDetailsSchema>;
export type FlockItemInput = z.infer<typeof flockItemSchema>;
export type ShedsFlocksInput = z.infer<typeof shedsFlocksSchema>;
export type FeedCostsInput = z.infer<typeof feedCostsSchema>;
export type EggSalesUnitsInput = z.infer<typeof eggSalesUnitsSchema>;
export type ExpensesFinanceInput = z.infer<typeof expensesFinanceSchema>;
export type CompleteEnrollmentInput = z.infer<typeof completeEnrollmentSchema>;
