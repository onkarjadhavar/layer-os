import { z } from 'zod';

export const quickDailyRecordSchema = z.object({
  farmId: z.string().min(1, 'farmId is required'),
  flockId: z.string().min(1, 'flockId is required'),
  recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid YYYY-MM-DD date required'),
  eggsCollected: z.number().int().nonnegative('Eggs collected must be non-negative'),
  feedKg: z.number().nonnegative('Feed used must be non-negative'),
  mortality: z.number().int().nonnegative('Mortality count must be non-negative'),
  sellingRate: z.number().positive('Selling rate must be greater than 0'),
  soldEggs: z.number().int().nonnegative().optional(),
});

export type QuickDailyRecordInput = z.infer<typeof quickDailyRecordSchema>;

export const fullDailyRecordSchema = z.object({
  farmId: z.string().min(1),
  flockId: z.string().min(1),
  recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  openingBirds: z.number().int().positive(),
  mortality: z.number().int().nonnegative(),
  culls: z.number().int().nonnegative().default(0),
  closingBirds: z.number().int().nonnegative(),
  totalEggsCollected: z.number().int().nonnegative(),
  brokenCrackedEggs: z.number().int().nonnegative().default(0),
  softShellEggs: z.number().int().nonnegative().default(0),
  rejectEggs: z.number().int().nonnegative().default(0),
  goodEggs: z.number().int().nonnegative(),
  morningCollection: z.number().int().nonnegative().default(0),
  eveningCollection: z.number().int().nonnegative().default(0),
  hdPct: z.number().nonnegative().max(150),
  productionPct: z.number().nonnegative().max(150),
  feedIssuedKg: z.number().nonnegative(),
  feedPerBirdG: z.number().nonnegative(),
  waterConsumptionLitres: z.number().nonnegative().optional(),
  avgEggWeightG: z.number().nonnegative().optional(),
  sellingPricePerEgg: z.number().positive(),
  feedPricePerKg: z.number().positive(),
  otherCashExpenses: z.number().nonnegative().default(0),
  isClosed: z.boolean().default(true),
  notes: z.string().optional(),
});

export type FullDailyRecordInput = z.infer<typeof fullDailyRecordSchema>;

export const createSaleSchema = z.object({
  farmId: z.string().min(1),
  customerId: z.string().min(1),
  saleDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  saleType: z.enum(['eggs', 'empty_bags', 'spent_birds', 'manure', 'other']).default('eggs'),
  quantityUnits: z.number().positive('Quantity must be greater than 0'),
  unitName: z.string().min(1),
  totalEggsEquivalent: z.number().int().nonnegative().optional().default(0),
  ratePerUnit: z.number().positive('Rate must be greater than 0'),
  grossAmount: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  netAmount: z.number().nonnegative(),
  paidAmount: z.number().nonnegative().default(0),
  vehicleNumber: z.string().optional(),
  deliveryPerson: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;

export const recordPaymentSchema = z.object({
  farmId: z.string().min(1),
  customerId: z.string().min(1),
  saleId: z.string().optional(),
  amount: z.number().positive('Payment amount must be greater than 0'),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  paymentMode: z.string().min(1),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

export const createFarmSchema = z.object({
  farmName: z.string().min(2, 'Farm name must be at least 2 characters'),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian phone number'),
  district: z.string().default('Pune'),
  capacity: z.number().int().positive().default(30000),
  breed: z.string().default('BV300'),
  initialBirds: z.number().int().positive().default(30000),
  ageWeeks: z.number().int().min(1).max(120).default(34),
});

export type CreateFarmInput = z.infer<typeof createFarmSchema>;

export const unitSettingsSchema = z.object({
  farmId: z.string().min(1),
  traySizeEggs: z.number().int().positive().default(30),
  gattaSizeTrays: z.number().int().positive().default(7),
  cartonSizeTrays: z.number().int().positive().default(12),
  feedBagWeightKg: z.number().positive().default(50),
  defaultRateUnit: z.enum(['per_egg', 'per_100', 'tray', 'gatta']).default('per_100'),
});

export type UnitSettingsInput = z.infer<typeof unitSettingsSchema>;

export const createFlockSchema = z.object({
  farmId: z.string().min(1, 'farmId is required'),
  shedId: z.string().min(1, 'shedId is required'),
  batchCode: z.string().min(2, 'Batch code must be at least 2 characters'),
  breed: z.string().min(2, 'Breed must be specified'),
  hatcherySource: z.string().min(2, 'Hatchery source is required'),
  placementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid YYYY-MM-DD date required'),
  initialChickCount: z.number().int().positive('Initial chick count must be positive'),
  chickCostPerBird: z.number().positive('Chick cost per bird must be positive'),
  currentBirdCount: z.number().int().positive('Current bird count must be positive'),
  ageWeeks: z.number().int().min(1).max(120, 'Age weeks must be between 1 and 120'),
  currentPhase: z.enum(['brooding', 'growing', 'pre_lay', 'laying', 'post_peak', 'cull_ready']).default('brooding'),
});

export type CreateFlockInput = z.infer<typeof createFlockSchema>;

export const updateFlockPhaseSchema = z.object({
  flockId: z.string().min(1),
  currentPhase: z.enum(['brooding', 'growing', 'pre_lay', 'laying', 'post_peak', 'cull_ready']),
  isClosed: z.boolean().optional(),
});

export type UpdateFlockPhaseInput = z.infer<typeof updateFlockPhaseSchema>;

export const createShedSchema = z.object({
  farmId: z.string().min(1, 'farmId is required'),
  shedNumber: z.string().min(1, 'Shed number is required'),
  name: z.string().min(2, 'Shed name must be at least 2 characters'),
  capacity: z.number().int().positive('Capacity must be positive'),
  shedType: z.enum(['elevated_cage', 'environment_controlled', 'deep_litter']).default('elevated_cage'),
  hasSensors: z.boolean().default(false),
});

export type CreateShedInput = z.infer<typeof createShedSchema>;

export const mandiRateSchema = z.object({
  mandiName: z.string().min(2, 'Mandi name is required'),
  state: z.string().default('Maharashtra'),
  rateDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid YYYY-MM-DD date required'),
  pricePer100: z.number().positive('Price per 100 must be positive'),
  pricePerPiece: z.number().positive('Price per piece must be positive'),
  trend: z.enum(['up', 'down', 'steady']).default('steady'),
});

export type MandiRateInput = z.infer<typeof mandiRateSchema>;
