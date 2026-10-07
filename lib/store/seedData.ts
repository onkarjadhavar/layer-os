/**
 * LayerOS Seed Data Fixture
 * "Sahyadri Layer Farm, Maharashtra"
 * 30,000 birds, 3 sheds, ~34 weeks, 90 days historical records,
 * 15 customers, 4 suppliers, 8 employees, active loan, market rates.
 */

import { DailyCalculationInput, calculateDailyMetrics, DEFAULT_UNIT_SETTINGS } from '../calc';

export interface Farm {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  district: string;
  state: string;
  totalCapacity: number;
  gstin?: string;
}

export interface Shed {
  id: string;
  farmId: string;
  shedNumber: string;
  name: string;
  capacity: number;
  shedType: 'elevated_cage' | 'environment_controlled' | 'deep_litter';
  hasSensors: boolean;
}

export interface Flock {
  id: string;
  farmId: string;
  shedId: string;
  batchCode: string;
  breed: string;
  hatcherySource: string;
  placementDate: string;
  initialChickCount: number;
  chickCostPerBird: number;
  currentBirdCount: number;
  ageWeeks: number;
  currentPhase: 'brooding' | 'growing' | 'pre_lay' | 'laying' | 'post_peak' | 'cull_ready';
}

export interface DailyRecord {
  id: string;
  farmId: string;
  flockId: string;
  recordDate: string; // YYYY-MM-DD
  openingBirds: number;
  mortality: number;
  culls: number;
  closingBirds: number;
  totalEggsCollected: number;
  brokenCrackedEggs: number;
  softShellEggs: number;
  rejectEggs: number;
  goodEggs: number;
  morningCollection: number;
  eveningCollection: number;
  hdPct: number;
  productionPct: number;
  feedIssuedKg: number;
  feedPerBirdG: number;
  waterConsumptionLitres?: number;
  avgEggWeightG: number;
  sellingPricePerEgg: number;
  feedPricePerKg: number;
  otherCashExpenses: number;
  otherIncome: number;
  simpleOperatingProfit: number;
  trueProfit: number;
  costPerEgg: number;
  breakEvenEggPrice: number;
  isClosed: boolean;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  area: string;
  customerType: 'wholesaler' | 'trader' | 'retailer' | 'hotel_bakery' | 'agent';
  creditLimit: number;
  creditDays: number;
  currentOutstanding: number;
  days0to7: number;
  days8to15: number;
  days16to30: number;
  days30Plus: number;
  averageDaysToPay: number;
  onTimePaymentPct: number;
  defaultPriceUnit: 'per_egg' | 'per_100' | 'tray' | 'gatta';
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  saleDate: string;
  saleType: 'eggs' | 'empty_bags' | 'spent_birds' | 'manure' | 'other';
  quantityUnits: number;
  unitName: string;
  ratePerUnit: number;
  grossAmount: number;
  discount: number;
  netAmount: number;
  paidAmount: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  vehicleNumber?: string;
  deliveryPerson?: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: 'feed' | 'medicines' | 'chicks' | 'equipment' | 'packaging';
  phone: string;
  city: string;
  outstandingBalance: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  monthlySalary: number;
  phone: string;
  joiningDate: string;
  presentDaysThisMonth: number;
  advanceTaken: number;
}

export interface MarketRate {
  mandiName: string;
  rateDate: string;
  ratePer100: number;
  ratePerEgg: number;
  trend: 'up' | 'down' | 'steady';
}

export interface VaccinationTask {
  id: string;
  vaccineName: string;
  diseaseTargeted: string;
  dueAgeWeeks: number;
  dueDate: string;
  status: 'pending' | 'done' | 'skipped';
  isImportant: boolean;
}

export interface Loan {
  id: string;
  bankName: string;
  principalAmount: number;
  annualInterestRate: number;
  monthlyEmi: number;
  emiDueDay: number;
  tenureMonths: number;
  outstandingPrincipal: number;
}

export interface AlertItem {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'safe';
  titleMr: string;
  titleEn: string;
  messageMr: string;
  messageEn: string;
  actionUrl?: string;
  date: string;
  isResolved: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: 'owner' | 'manager' | 'supervisor' | 'accountant' | 'viewer';
  farmId: string;
}

export const SEED_FARM: Farm = {
  id: "farm-sahyadri-01",
  name: "सह्याद्री लेयर फार्म (Sahyadri Layer Farm)",
  ownerName: "सचिन गायकवाड (Sachin Gaikwad)",
  phone: "+91 98220 12345",
  email: "sachin@sahyadrilayer.com",
  district: "Pune / दौंड",
  state: "Maharashtra",
  totalCapacity: 35000,
  gstin: "27AABCS1429B1Z8",
};

export const SEED_SHEDS: Shed[] = [
  { id: "shed-01", farmId: "farm-sahyadri-01", shedNumber: "S-1", name: "शेड १ (Phase-1 Cage)", capacity: 10000, shedType: "elevated_cage", hasSensors: true },
  { id: "shed-02", farmId: "farm-sahyadri-01", shedNumber: "S-2", name: "शेड २ (Phase-2 Cage)", capacity: 10000, shedType: "elevated_cage", hasSensors: true },
  { id: "shed-03", farmId: "farm-sahyadri-01", shedNumber: "S-3", name: "शेड ३ (Phase-3 Cage)", capacity: 10000, shedType: "elevated_cage", hasSensors: false },
];

export const SEED_FLOCK: Flock = {
  id: "flock-bv300-batch-24",
  farmId: "farm-sahyadri-01",
  shedId: "shed-01",
  batchCode: "FLOCK-2024-B34",
  breed: "BV-300 Layer",
  hatcherySource: "Venkateshwara Hatcheries (Venky's), Pune",
  placementDate: "2024-02-15",
  initialChickCount: 30450,
  chickCostPerBird: 44.00,
  currentBirdCount: 29985,
  ageWeeks: 34,
  currentPhase: "laying",
};

export const SEED_CUSTOMERS: Customer[] = [
  { id: "cust-01", name: "अमोल ट्रेडर्स (Amol Egg Traders)", phone: "9822199001", area: "गुलटेकडी मार्केटयार्ड, पुणे", customerType: "wholesaler", creditLimit: 300000, creditDays: 7, currentOutstanding: 148500, days0to7: 100000, days8to15: 48500, days16to30: 0, days30Plus: 0, averageDaysToPay: 6, onTimePaymentPct: 92, defaultPriceUnit: "per_100" },
  { id: "cust-02", name: "मयूर प्रोव्हिजन स्टोअर्स (Mayur Provisions)", phone: "9822199002", area: "हडपसर, पुणे", customerType: "retailer", creditLimit: 80000, creditDays: 10, currentOutstanding: 32400, days0to7: 15000, days8to15: 17400, days16to30: 0, days30Plus: 0, averageDaysToPay: 8, onTimePaymentPct: 85, defaultPriceUnit: "tray" },
  { id: "cust-03", name: "रॉयल बेकर्स अँड कन्फेक्शनरी (Royal Bakers)", phone: "9822199003", area: "पिंपरी चिंचवड", customerType: "hotel_bakery", creditLimit: 150000, creditDays: 14, currentOutstanding: 89400, days0to7: 41400, days8to15: 0, days16to30: 48000, days30Plus: 0, averageDaysToPay: 18, onTimePaymentPct: 70, defaultPriceUnit: "gatta" },
  { id: "cust-04", name: "कृष्णा होलसेल एग्स (Krishna Wholesale)", phone: "9822199004", area: "वाशी नवी मुंबई", customerType: "trader", creditLimit: 500000, creditDays: 7, currentOutstanding: 215000, days0to7: 125000, days8to15: 90000, days16to30: 0, days30Plus: 0, averageDaysToPay: 6, onTimePaymentPct: 95, defaultPriceUnit: "per_100" },
  { id: "cust-05", name: "गणेश किराणा मॉल (Ganesh Kirana)", phone: "9822199005", area: "दौंड", customerType: "retailer", creditLimit: 50000, creditDays: 15, currentOutstanding: 28000, days0to7: 0, days8to15: 0, days16to30: 16000, days30Plus: 12000, averageDaysToPay: 28, onTimePaymentPct: 45, defaultPriceUnit: "tray" },
  { id: "cust-06", name: "हॉटेल सूर्यकांत ग्रँड (Suryakant Grand)", phone: "9822199006", area: "शिवाजीनगर, पुणे", customerType: "hotel_bakery", creditLimit: 100000, creditDays: 15, currentOutstanding: 45000, days0to7: 45000, days8to15: 0, days16to30: 0, days30Plus: 0, averageDaysToPay: 12, onTimePaymentPct: 90, defaultPriceUnit: "gatta" },
  { id: "cust-07", name: "बाळासाहेब काळे एजन्सी (Kale Agencies)", phone: "9822199007", area: "बारामती", customerType: "trader", creditLimit: 250000, creditDays: 7, currentOutstanding: 95000, days0to7: 95000, days8to15: 0, days16to30: 0, days30Plus: 0, averageDaysToPay: 5, onTimePaymentPct: 98, defaultPriceUnit: "per_100" },
  { id: "cust-08", name: "न्यू इंडिया बेकरी (New India Bakery)", phone: "9822199008", area: "कॅम्प, पुणे", customerType: "hotel_bakery", creditLimit: 120000, creditDays: 14, currentOutstanding: 54000, days0to7: 24000, days8to15: 30000, days16to30: 0, days30Plus: 0, averageDaysToPay: 13, onTimePaymentPct: 88, defaultPriceUnit: "gatta" },
  { id: "cust-09", name: "शशिकांत अंडी विक्रेता (Shashikant Retail)", phone: "9822199009", area: "लोणी काळभोर", customerType: "retailer", creditLimit: 40000, creditDays: 7, currentOutstanding: 16200, days0to7: 16200, days8to15: 0, days16to30: 0, days30Plus: 0, averageDaysToPay: 7, onTimePaymentPct: 94, defaultPriceUnit: "tray" },
  { id: "cust-10", name: "साई सुपरमार्ट (Sai Supermart)", phone: "9822199010", area: "वाघोली, पुणे", customerType: "retailer", creditLimit: 60000, creditDays: 10, currentOutstanding: 22800, days0to7: 12800, days8to15: 10000, days16to30: 0, days30Plus: 0, averageDaysToPay: 9, onTimePaymentPct: 86, defaultPriceUnit: "tray" },
  { id: "cust-11", name: "ओमकार एग डिस्ट्रीब्युटर्स (Omkar Eggs)", phone: "9822199011", area: "नाशिक रोड", customerType: "trader", creditLimit: 350000, creditDays: 7, currentOutstanding: 180000, days0to7: 110000, days8to15: 70000, days16to30: 0, days30Plus: 0, averageDaysToPay: 6, onTimePaymentPct: 91, defaultPriceUnit: "per_100" },
  { id: "cust-12", name: "ताज रेस्टॉरंट अँड कॅफे (Taj Cafe)", phone: "9822199012", area: "कोरेगाव पार्क, पुणे", customerType: "hotel_bakery", creditLimit: 90000, creditDays: 15, currentOutstanding: 34500, days0to7: 34500, days8to15: 0, days16to30: 0, days30Plus: 0, averageDaysToPay: 11, onTimePaymentPct: 90, defaultPriceUnit: "gatta" },
  { id: "cust-13", name: "विशाल ट्रेडर्स (Vishal Traders)", phone: "9822199013", area: "सोलापूर", customerType: "wholesaler", creditLimit: 400000, creditDays: 7, currentOutstanding: 240000, days0to7: 160000, days8to15: 80000, days16to30: 0, days30Plus: 0, averageDaysToPay: 7, onTimePaymentPct: 89, defaultPriceUnit: "per_100" },
  { id: "cust-14", name: "अतुल किराणा (Atul Kirana)", phone: "9822199014", area: "उरुळी कांचन", customerType: "retailer", creditLimit: 35000, creditDays: 7, currentOutstanding: 14400, days0to7: 14400, days8to15: 0, days16to30: 0, days30Plus: 0, averageDaysToPay: 6, onTimePaymentPct: 96, defaultPriceUnit: "tray" },
  { id: "cust-15", name: "समर्थ डेली निड्स (Samarth Daily Needs)", phone: "9822199015", area: "शिक्रापूर", customerType: "retailer", creditLimit: 45000, creditDays: 10, currentOutstanding: 19500, days0to7: 9500, days8to15: 10000, days16to30: 0, days30Plus: 0, averageDaysToPay: 8, onTimePaymentPct: 87, defaultPriceUnit: "tray" }
];

export const SEED_SUPPLIERS: Supplier[] = [
  { id: "sup-01", name: "गोदरेज ॲग्रोव्हेट (Godrej Agrovet Ltd)", category: "feed", phone: "020-27120000", city: "पुणे", outstandingBalance: 340000 },
  { id: "sup-02", name: "वेंकीज इंडिया (Venkateshwara Hatcheries)", category: "chicks", phone: "020-24251111", city: "पुणे", outstandingBalance: 0 },
  { id: "sup-03", name: "सुगुणा पोल्ट्री फीड्स (Suguna Feeds)", category: "feed", phone: "0214-223400", city: "बारामती", outstandingBalance: 125000 },
  { id: "sup-04", name: "महाराष्ट्र व्हेटर्नरी मेडिकल स्टोअर्स", category: "medicines", phone: "9822450000", city: "दौंड", outstandingBalance: 18500 }
];

export const SEED_EMPLOYEES: Employee[] = [
  { id: "emp-01", name: "दत्तात्रय शिंदे (Dattatraya Shinde)", role: "फार्म मॅनेजर (Manager)", monthlySalary: 28000, phone: "9822900001", joiningDate: "2022-01-10", presentDaysThisMonth: 28, advanceTaken: 2000 },
  { id: "emp-02", name: "विष्णू पवार (Vishnu Pawar)", role: "शेड १ सुपरवायझर", monthlySalary: 18000, phone: "9822900002", joiningDate: "2022-06-01", presentDaysThisMonth: 27, advanceTaken: 0 },
  { id: "emp-03", name: "संतोष कांबळे (Santosh Kamble)", role: "शेड २ अटेंडंट", monthlySalary: 16000, phone: "9822900003", joiningDate: "2023-03-15", presentDaysThisMonth: 29, advanceTaken: 1000 },
  { id: "emp-04", name: "राहुल माने (Rahul Mane)", role: "शेड ३ अटेंडंट", monthlySalary: 16000, phone: "9822900004", joiningDate: "2023-04-10", presentDaysThisMonth: 28, advanceTaken: 0 },
  { id: "emp-05", name: "बाबूराव जाधव (Baburao Jadhav)", role: "खुराक व फिडिंग ऑपरेटर", monthlySalary: 17000, phone: "9822900005", joiningDate: "2022-08-20", presentDaysThisMonth: 30, advanceTaken: 3000 },
  { id: "emp-06", name: "सुनीता कांबळे (Sunita Kamble)", role: "अंडी संकलन व प्रतवारी", monthlySalary: 15000, phone: "9822900006", joiningDate: "2023-01-05", presentDaysThisMonth: 29, advanceTaken: 0 },
  { id: "emp-07", name: "गोविंद राठोड (Govind Rathod)", role: "डिलिव्हरी चालक (Driver)", monthlySalary: 19000, phone: "9822900007", joiningDate: "2023-05-12", presentDaysThisMonth: 27, advanceTaken: 1500 },
  { id: "emp-08", name: "मारुती शिंदे (Maruti Shinde)", role: "रात्र सुरक्षा रक्षक (Watchman)", monthlySalary: 14000, phone: "9822900008", joiningDate: "2022-11-01", presentDaysThisMonth: 30, advanceTaken: 0 }
];

export const SEED_LOAN: Loan = {
  id: "loan-bom-01",
  bankName: "बँक ऑफ महाराष्ट्र (Bank of Maharashtra)",
  principalAmount: 2500000,
  annualInterestRate: 9.25,
  monthlyEmi: 38400,
  emiDueDay: 5,
  tenureMonths: 84,
  outstandingPrincipal: 1985000
};

export const SEED_MARKET_RATES: MarketRate[] = [
  { mandiName: "पुणे (Pune)", rateDate: "2026-10-07", ratePer100: 540, ratePerEgg: 5.40, trend: "up" },
  { mandiName: "मुंबई (Mumbai)", rateDate: "2026-10-07", ratePer100: 555, ratePerEgg: 5.55, trend: "up" },
  { mandiName: "नाशिक (Nashik)", rateDate: "2026-10-07", ratePer100: 535, ratePerEgg: 5.35, trend: "steady" },
  { mandiName: "नागपूर (Nagpur)", rateDate: "2026-10-07", ratePer100: 548, ratePerEgg: 5.48, trend: "up" },
  { mandiName: "नमक्कल (Namakkal)", rateDate: "2026-10-07", ratePer100: 515, ratePerEgg: 5.15, trend: "steady" }
];

export const SEED_VACCINATIONS: VaccinationTask[] = [
  { id: "vax-01", vaccineName: "Ranikhet (ND LaSota Booster)", diseaseTargeted: "Newcastle Disease", dueAgeWeeks: 35, dueDate: "2026-10-14", status: "pending", isImportant: true },
  { id: "vax-02", vaccineName: "Infectious Coryza Inactivated", diseaseTargeted: "Coryza", dueAgeWeeks: 38, dueDate: "2026-11-04", status: "pending", isImportant: false },
  { id: "vax-03", vaccineName: "Egg Drop Syndrome (EDS 76)", diseaseTargeted: "EDS", dueAgeWeeks: 42, dueDate: "2026-12-02", status: "pending", isImportant: true },
  { id: "vax-04", vaccineName: "IBD Booster (Gumboro)", diseaseTargeted: "IBD", dueAgeWeeks: 28, dueDate: "2026-08-25", status: "done", isImportant: true },
];

export const SEED_ALERTS: AlertItem[] = [
  {
    id: "alert-01",
    severity: "warning",
    titleMr: "ब्रेक-इव्हन तुलना: सुरक्षित मार्जिन",
    titleEn: "Break-even vs Selling Rate: Safe Margin",
    messageMr: "आजचा ब्रेक-इव्हन दर ₹५.२१/अंडे असून विक्री दर ₹५.४०/अंडे आहे. मार्जिन ₹०.१९/अंडे आहे. उत्पादन खर्चावर लक्ष ठेवा.",
    messageEn: "Break-even is ₹5.21/egg · Selling ₹5.40/egg · Margin ₹0.19. Keep a watch on feed prices.",
    actionUrl: "/sales",
    date: "2026-10-07",
    isResolved: false
  },
  {
    id: "alert-02",
    severity: "info",
    titleMr: "लसीकरण स्मरणपत्र (Vaccine Due)",
    titleEn: "Vaccine Due in 7 Days",
    messageMr: "राणीखेत (ND LaSota Booster) लस पुढील ७ दिवसांत (१४ ऑक्टोबर) नियोजित आहे.",
    messageEn: "Ranikhet (ND LaSota Booster) is scheduled in 7 days (14 Oct).",
    actionUrl: "/health",
    date: "2026-10-07",
    isResolved: false
  },
  {
    id: "alert-03",
    severity: "warning",
    titleMr: "ग्राहकांची थकबाकी (Overdue Alert)",
    titleEn: "Overdue Customer Collection",
    messageMr: "रॉयल बेकर्स कडून ₹४८,००० ची उदारी २१ दिवसांपेक्षा जास्त थकीत आहे. वसुलीसाठी त्वरित संपर्क करा.",
    messageEn: "Royal Bakers has ₹48,000 overdue past 21 days. Contact immediately for collection.",
    actionUrl: "/sales",
    date: "2026-10-07",
    isResolved: false
  },
  {
    id: "alert-04",
    severity: "info",
    titleMr: "पुणे बाजार भाव वाढले (+₹१५/१०० अंडी)",
    titleEn: "Pune Mandi Rate Increased (+₹15/100)",
    messageMr: "पुणे मार्केट यार्डात आज भाव ₹५४० वर पोहोचला आहे. माल राखून न ठेवता चांगल्या दरात पुरवठा करावा.",
    messageEn: "Pune Mandi rate surged to ₹540/100 eggs. Favorable rate to clear daily stocks.",
    actionUrl: "/market-rates",
    date: "2026-10-07",
    isResolved: false
  }
];

/**
 * Generates 90 days of realistic historical daily records for "Sahyadri Layer Farm"
 * Ending on the exact Reference Day (Today: 2026-10-07)
 */
export function generate90DaysDailyRecords(): DailyRecord[] {
  const records: DailyRecord[] = [];
  const totalDays = 90;
  
  // End date is 2026-10-07
  const baseDate = new Date(2026, 9, 7); // month is 0-indexed: 9 = October

  let currentLiveBirds = 30450;

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const isToday = i === 0;

    // Reference Day (Today) exact numbers
    if (isToday) {
      const openingBirds = 30000;
      const mortality = 15;
      const culls = 0;
      const eggsCollected = 27300;
      const feedKg = 3300;
      const feedPrice = 35.00;
      const eggSellingPrice = 5.40;
      const otherExpenses = 12000;
      const otherIncome = 1800; // e.g., empty feed bags sold

      const calc = calculateDailyMetrics({
        openingBirds,
        mortality,
        culls,
        eggsCollected,
        feedKg,
        feedPricePerKg: feedPrice,
        sellingPricePerEgg: eggSellingPrice,
        otherCashExpenses: otherExpenses,
        otherIncome,
        allocatedOverheads: {
          labourDaily: 3500,
          electricityDaily: 1200,
          medicineDaily: 1500,
          pulletAmortizationDaily: 4500,
          shedDepreciationDaily: 1500,
          loanInterestDaily: 1800,
          mortalityLossDaily: 600,
        }
      });

      records.push({
        id: `rec-day-${dateStr}`,
        farmId: "farm-sahyadri-01",
        flockId: "flock-bv300-batch-24",
        recordDate: dateStr,
        openingBirds,
        mortality,
        culls,
        closingBirds: calc.closingBirds,
        totalEggsCollected: eggsCollected,
        brokenCrackedEggs: 120,
        softShellEggs: 60,
        rejectEggs: 40,
        goodEggs: eggsCollected - 220,
        morningCollection: 17200,
        eveningCollection: 10100,
        hdPct: calc.hdPct,
        productionPct: calc.productionPct,
        feedIssuedKg: feedKg,
        feedPerBirdG: calc.feedPerBirdG,
        waterConsumptionLitres: 6600,
        avgEggWeightG: 58.5,
        sellingPricePerEgg: eggSellingPrice,
        feedPricePerKg: feedPrice,
        otherCashExpenses: otherExpenses,
        otherIncome,
        simpleOperatingProfit: calc.simpleOperatingProfit,
        trueProfit: calc.trueProfit,
        costPerEgg: calc.operatingCostPerEgg,
        breakEvenEggPrice: calc.breakEvenEggPrice,
        isClosed: true,
        notes: "रेफरन्स दिवस: ९१% उत्पादन, ११० ग्रॅम खुराक, ₹५.४० विक्री दर. नियमित कामकाज सुरळीत."
      });
      continue;
    }

    // Historical 89 days:
    // Controlled variance: HD% between 90% and 94%
    // Anomaly Day 38 (heatwave): mortality = 45, HD = 87.5%
    // Anomaly Day 71 (power outage): mortality = 38, HD = 88.0%
    let dailyMortality = Math.floor(10 + Math.sin(i * 0.4) * 5); // 8-16
    let productionFactor = 0.91 + Math.sin(i * 0.15) * 0.02; // 0.89 to 0.93

    if (i === 38) {
      dailyMortality = 45; // heatwave spike
      productionFactor = 0.875;
    } else if (i === 71) {
      dailyMortality = 38; // ventilation failure during power outage
      productionFactor = 0.88;
    }

    const openingBirds = currentLiveBirds;
    currentLiveBirds -= dailyMortality;
    const closingBirds = currentLiveBirds;

    const totalEggs = Math.round(closingBirds * productionFactor);
    const feedPerBird = 110 + Math.sin(i * 0.3) * 3; // 107 - 113g
    const feedKg = Number(((closingBirds * feedPerBird) / 1000).toFixed(1));
    const eggRate = Number((5.10 + Math.sin(i * 0.2) * 0.45).toFixed(2)); // ₹4.65 - ₹5.55
    const feedPrice = Number((34.5 + Math.cos(i * 0.1) * 1.2).toFixed(2));
    const otherCash = 8000 + (i % 7 === 0 ? 5000 : 1000);

    const calc = calculateDailyMetrics({
      openingBirds,
      mortality: dailyMortality,
      eggsCollected: totalEggs,
      feedKg,
      feedPricePerKg: feedPrice,
      sellingPricePerEgg: eggRate,
      otherCashExpenses: otherCash,
      otherIncome: (i % 5 === 0 ? 2500 : 0),
      allocatedOverheads: {
        labourDaily: 3500,
        electricityDaily: 1100,
        medicineDaily: 1200,
        pulletAmortizationDaily: 4500,
        shedDepreciationDaily: 1500,
        loanInterestDaily: 1800,
        mortalityLossDaily: dailyMortality * 40,
      }
    });

    records.push({
      id: `rec-day-${dateStr}`,
      farmId: "farm-sahyadri-01",
      flockId: "flock-bv300-batch-24",
      recordDate: dateStr,
      openingBirds,
      mortality: dailyMortality,
      culls: 0,
      closingBirds,
      totalEggsCollected: totalEggs,
      brokenCrackedEggs: Math.round(totalEggs * 0.005),
      softShellEggs: Math.round(totalEggs * 0.002),
      rejectEggs: Math.round(totalEggs * 0.001),
      goodEggs: Math.round(totalEggs * 0.992),
      morningCollection: Math.round(totalEggs * 0.63),
      eveningCollection: Math.round(totalEggs * 0.37),
      hdPct: calc.hdPct,
      productionPct: calc.productionPct,
      feedIssuedKg: feedKg,
      feedPerBirdG: calc.feedPerBirdG,
      waterConsumptionLitres: Math.round(feedKg * 2.0),
      avgEggWeightG: Number((57.5 + (90 - i) * 0.02).toFixed(1)),
      sellingPricePerEgg: eggRate,
      feedPricePerKg: feedPrice,
      otherCashExpenses: otherCash,
      otherIncome: (i % 5 === 0 ? 2500 : 0),
      simpleOperatingProfit: calc.simpleOperatingProfit,
      trueProfit: calc.trueProfit,
      costPerEgg: calc.operatingCostPerEgg,
      breakEvenEggPrice: calc.breakEvenEggPrice,
      isClosed: true,
    });
  }

  // Ensure chronologically sorted: older to newest (today at index 89)
  return records.reverse();
}
