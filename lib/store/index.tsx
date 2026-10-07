'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Farm,
  Shed,
  Flock,
  DailyRecord,
  Customer,
  Sale,
  Supplier,
  Employee,
  Loan,
  MarketRate,
  VaccinationTask,
  AlertItem,
  UserProfile,
  SEED_FARM,
  SEED_SHEDS,
  SEED_FLOCK,
  SEED_CUSTOMERS,
  SEED_SUPPLIERS,
  SEED_EMPLOYEES,
  SEED_LOAN,
  SEED_MARKET_RATES,
  SEED_VACCINATIONS,
  SEED_ALERTS,
  generate90DaysDailyRecords,
} from './seedData';
import {
  UnitSettings,
  DEFAULT_UNIT_SETTINGS,
  calculateDailyMetrics,
  convertEggUnits,
  convertEggRate,
} from '../calc';

interface QuickEntryPayload {
  recordDate: string;
  eggsCollected: number;
  feedKg: number;
  mortality: number;
  soldQtyEggs?: number;
  sellingRate?: number;
}

interface LayerOSStoreContextType {
  // Auth & Roles
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  loginAsDemo: () => void;
  loginWithPhone: (phone: string, otp: string) => boolean;
  logout: () => void;
  switchRole: (role: UserProfile['role']) => void;

  // Farm & Flocks
  farm: Farm;
  sheds: Shed[];
  flock: Flock;
  unitSettings: UnitSettings;
  updateUnitSettings: (settings: Partial<UnitSettings>) => void;

  // Daily Ledger
  dailyRecords: DailyRecord[];
  todayRecord: DailyRecord;
  yesterdayRecord?: DailyRecord;
  addQuickLog: (entry: QuickEntryPayload) => void;
  addFullDailyRecord: (entry: Partial<DailyRecord>) => void;

  // Sales & Customers
  customers: Customer[];
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'invoiceNumber'>) => void;
  recordPayment: (customerId: string, amount: number) => void;

  // Market & Commercial
  marketRates: MarketRate[];
  addMarketRate: (rate: MarketRate) => void;

  // Health & Reminders
  vaccinations: VaccinationTask[];
  toggleVaccinationStatus: (id: string) => void;

  // People & Finance
  suppliers: Supplier[];
  employees: Employee[];
  loan: Loan;
  alerts: AlertItem[];
  dismissAlert: (id: string) => void;

  // Environment
  environment: {
    tempMin: number;
    tempMax: number;
    humidity: number;
    ammoniaPpm: number;
    fansOn: boolean;
    lightsOn: boolean;
  };
  toggleEnvironmentControl: (control: 'fansOn' | 'lightsOn') => void;

  // Reset
  resetDemoData: () => void;
}

const LayerOSContext = createContext<LayerOSStoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'layeros_app_state_v1';

export function LayerOSProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with seed data
  const [user, setUser] = useState<UserProfile | null>({
    id: "usr-owner-01",
    name: "सचिन गायकवाड (मालक)",
    phone: "9822012345",
    role: "owner",
    farmId: "farm-sahyadri-01",
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  const [farm, setFarm] = useState<Farm>(SEED_FARM);
  const [sheds, setSheds] = useState<Shed[]>(SEED_SHEDS);
  const [flock, setFlock] = useState<Flock>(SEED_FLOCK);
  const [unitSettings, setUnitSettings] = useState<UnitSettings>(DEFAULT_UNIT_SETTINGS);
  
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>(() => generate90DaysDailyRecords());
  const [customers, setCustomers] = useState<Customer[]>(SEED_CUSTOMERS);
  const [sales, setSales] = useState<Sale[]>([
    {
      id: "sale-inv-101",
      invoiceNumber: "INV-2026-101",
      customerId: "cust-01",
      customerName: "अमोल ट्रेडर्स (Amol Egg Traders)",
      saleDate: "2026-10-07",
      saleType: "eggs",
      quantityUnits: 15000,
      unitName: "eggs",
      ratePerUnit: 5.40,
      grossAmount: 81000,
      discount: 0,
      netAmount: 81000,
      paidAmount: 50000,
      paymentStatus: "partial",
      vehicleNumber: "MH 12 QW 4421",
      deliveryPerson: "गोविंद राठोड"
    },
    {
      id: "sale-inv-102",
      invoiceNumber: "INV-2026-102",
      customerId: "cust-03",
      customerName: "रॉयल बेकर्स (Royal Bakers)",
      saleDate: "2026-10-07",
      saleType: "eggs",
      quantityUnits: 40, // 40 gatta * 210 eggs = 8,400 eggs
      unitName: "gatta",
      ratePerUnit: 1134, // ₹5.40 * 210
      grossAmount: 45360,
      discount: 0,
      netAmount: 45360,
      paidAmount: 45360,
      paymentStatus: "paid",
      vehicleNumber: "MH 12 QW 4421",
      deliveryPerson: "गोविंद राठोड"
    },
    {
      id: "sale-inv-103",
      invoiceNumber: "INV-2026-103",
      customerId: "cust-02",
      customerName: "मयूर प्रोव्हिजन स्टोअर्स",
      saleDate: "2026-10-07",
      saleType: "eggs",
      quantityUnits: 130, // 130 trays * 30 eggs = 3,900 eggs
      unitName: "tray",
      ratePerUnit: 162, // ₹5.40 * 30
      grossAmount: 21060,
      discount: 0,
      netAmount: 21060,
      paidAmount: 21060,
      paymentStatus: "paid",
      vehicleNumber: "MH 12 QW 4421",
      deliveryPerson: "गोविंद राठोड"
    }
  ]);
  const [suppliers] = useState<Supplier[]>(SEED_SUPPLIERS);
  const [employees] = useState<Employee[]>(SEED_EMPLOYEES);
  const [loan] = useState<Loan>(SEED_LOAN);
  const [marketRates, setMarketRates] = useState<MarketRate[]>(SEED_MARKET_RATES);
  const [vaccinations, setVaccinations] = useState<VaccinationTask[]>(SEED_VACCINATIONS);
  const [alerts, setAlerts] = useState<AlertItem[]>(SEED_ALERTS);

  const [environment, setEnvironment] = useState({
    tempMin: 22.5,
    tempMax: 29.8,
    humidity: 62,
    ammoniaPpm: 12,
    fansOn: true,
    lightsOn: true,
  });

  // Load from LocalStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dailyRecords && parsed.dailyRecords.length > 0) {
          setDailyRecords(parsed.dailyRecords);
        }
        if (parsed.unitSettings) setUnitSettings(parsed.unitSettings);
        if (parsed.user) setUser(parsed.user);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.sales) setSales(parsed.sales);
        if (parsed.alerts) setAlerts(parsed.alerts);
        if (parsed.vaccinations) setVaccinations(parsed.vaccinations);
      }
    } catch {
      // LocalStorage error or fresh browser
    }
  }, []);

  // Save to LocalStorage on changes
  const saveStateToStorage = (updatedRecords?: DailyRecord[]) => {
    try {
      const stateToSave = {
        dailyRecords: updatedRecords || dailyRecords,
        unitSettings,
        user,
        customers,
        sales,
        alerts,
        vaccinations,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  };

  const loginAsDemo = () => {
    setIsDemoMode(true);
    setIsAuthenticated(true);
    setUser({
      id: "usr-owner-01",
      name: "सचिन गायकवाड (मालक)",
      phone: "9822012345",
      role: "owner",
      farmId: "farm-sahyadri-01",
    });
  };

  const loginWithPhone = (phone: string, otp: string): boolean => {
    // Allows demo OTP 123456 or any 6-digit OTP for seamless testing
    if (otp.length === 6) {
      setIsDemoMode(false);
      setIsAuthenticated(true);
      setUser({
        id: "usr-live-01",
        name: "पोल्ट्री चालक (Farm Incharge)",
        phone,
        role: "owner",
        farmId: "farm-sahyadri-01",
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const switchRole = (role: UserProfile['role']) => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.user = updated;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    }
  };

  const updateUnitSettings = (newSettings: Partial<UnitSettings>) => {
    setUnitSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.unitSettings = updated;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // The latest record is "today"
  const todayRecord = dailyRecords[dailyRecords.length - 1];
  const yesterdayRecord = dailyRecords.length > 1 ? dailyRecords[dailyRecords.length - 2] : undefined;

  const addQuickLog = (entry: QuickEntryPayload) => {
    const openingBirds = todayRecord ? todayRecord.closingBirds : 30000;
    const feedPrice = todayRecord ? todayRecord.feedPricePerKg : 35.00;
    const eggSellingPrice = entry.sellingRate || (todayRecord ? todayRecord.sellingPricePerEgg : 5.40);
    const otherCash = 12000;

    const metrics = calculateDailyMetrics({
      openingBirds,
      mortality: entry.mortality,
      eggsCollected: entry.eggsCollected,
      feedKg: entry.feedKg,
      feedPricePerKg: feedPrice,
      sellingPricePerEgg: eggSellingPrice,
      otherCashExpenses: otherCash,
      allocatedOverheads: {
        labourDaily: 3500,
        electricityDaily: 1200,
        medicineDaily: 1500,
        pulletAmortizationDaily: 4500,
        shedDepreciationDaily: 1500,
        loanInterestDaily: 1800,
        mortalityLossDaily: entry.mortality * 40,
      }
    }, unitSettings);

    const newRecord: DailyRecord = {
      id: `rec-day-${entry.recordDate}`,
      farmId: farm.id,
      flockId: flock.id,
      recordDate: entry.recordDate,
      openingBirds,
      mortality: entry.mortality,
      culls: 0,
      closingBirds: metrics.closingBirds,
      totalEggsCollected: entry.eggsCollected,
      brokenCrackedEggs: Math.round(entry.eggsCollected * 0.005),
      softShellEggs: Math.round(entry.eggsCollected * 0.002),
      rejectEggs: Math.round(entry.eggsCollected * 0.001),
      goodEggs: entry.eggsCollected - Math.round(entry.eggsCollected * 0.008),
      morningCollection: Math.round(entry.eggsCollected * 0.65),
      eveningCollection: Math.round(entry.eggsCollected * 0.35),
      hdPct: metrics.hdPct,
      productionPct: metrics.productionPct,
      feedIssuedKg: entry.feedKg,
      feedPerBirdG: metrics.feedPerBirdG,
      waterConsumptionLitres: Math.round(entry.feedKg * 2.0),
      avgEggWeightG: 58.5,
      sellingPricePerEgg: eggSellingPrice,
      feedPricePerKg: feedPrice,
      otherCashExpenses: otherCash,
      otherIncome: 0,
      simpleOperatingProfit: metrics.simpleOperatingProfit,
      trueProfit: metrics.trueProfit,
      costPerEgg: metrics.operatingCostPerEgg,
      breakEvenEggPrice: metrics.breakEvenEggPrice,
      isClosed: true,
      notes: "Quick Log द्वारे नोंदवलेला दिवस."
    };

    // If a record with this date already exists, update it, else append
    const existingIndex = dailyRecords.findIndex(r => r.recordDate === entry.recordDate);
    let updated: DailyRecord[];
    if (existingIndex >= 0) {
      updated = [...dailyRecords];
      updated[existingIndex] = newRecord;
    } else {
      updated = [...dailyRecords, newRecord];
    }
    setDailyRecords(updated);
    saveStateToStorage(updated);
  };

  const addFullDailyRecord = (entry: Partial<DailyRecord>) => {
    if (!entry.recordDate) return;
    const existingIndex = dailyRecords.findIndex(r => r.recordDate === entry.recordDate);
    let updated: DailyRecord[];
    if (existingIndex >= 0) {
      updated = [...dailyRecords];
      updated[existingIndex] = { ...updated[existingIndex], ...entry } as DailyRecord;
    } else {
      updated = [...dailyRecords, entry as DailyRecord];
    }
    setDailyRecords(updated);
    saveStateToStorage(updated);
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'invoiceNumber'>) => {
    const newInvoice = `INV-2026-${sales.length + 101}`;
    const newSale: Sale = {
      ...saleData,
      id: `sale-${Date.now()}`,
      invoiceNumber: newInvoice,
    };
    const updatedSales = [newSale, ...sales];
    setSales(updatedSales);

    // Update customer outstanding balance if partial or pending
    if (saleData.customerId && saleData.netAmount > saleData.paidAmount) {
      const unpaid = saleData.netAmount - saleData.paidAmount;
      setCustomers(prev =>
        prev.map(c =>
          c.id === saleData.customerId
            ? { ...c, currentOutstanding: c.currentOutstanding + unpaid, days0to7: c.days0to7 + unpaid }
            : c
        )
      );
    }
  };

  const recordPayment = (customerId: string, amount: number) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          const newOutstanding = Math.max(0, c.currentOutstanding - amount);
          return { ...c, currentOutstanding: newOutstanding };
        }
        return c;
      })
    );
  };

  const addMarketRate = (rate: MarketRate) => {
    setMarketRates(prev => {
      const filtered = prev.filter(m => m.mandiName !== rate.mandiName || m.rateDate !== rate.rateDate);
      return [rate, ...filtered];
    });
  };

  const toggleVaccinationStatus = (id: string) => {
    setVaccinations(prev =>
      prev.map(v => (v.id === id ? { ...v, status: v.status === 'done' ? 'pending' : 'done' } : v))
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const toggleEnvironmentControl = (control: 'fansOn' | 'lightsOn') => {
    setEnvironment(prev => ({ ...prev, [control]: !prev[control] }));
  };

  const resetDemoData = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
    setDailyRecords(generate90DaysDailyRecords());
    setCustomers(SEED_CUSTOMERS);
    setUnitSettings(DEFAULT_UNIT_SETTINGS);
    setVaccinations(SEED_VACCINATIONS);
    setAlerts(SEED_ALERTS);
    setIsDemoMode(true);
  };

  return (
    <LayerOSContext.Provider
      value={{
        user,
        isAuthenticated,
        isDemoMode,
        loginAsDemo,
        loginWithPhone,
        logout,
        switchRole,
        farm,
        sheds,
        flock,
        unitSettings,
        updateUnitSettings,
        dailyRecords,
        todayRecord,
        yesterdayRecord,
        addQuickLog,
        addFullDailyRecord,
        customers,
        sales,
        addSale,
        recordPayment,
        marketRates,
        addMarketRate,
        vaccinations,
        toggleVaccinationStatus,
        suppliers,
        employees,
        loan,
        alerts,
        dismissAlert,
        environment,
        toggleEnvironmentControl,
        resetDemoData,
      }}
    >
      {children}
    </LayerOSContext.Provider>
  );
}

export function useLayerOS() {
  const context = useContext(LayerOSContext);
  if (!context) {
    throw new Error('useLayerOS must be used within a LayerOSProvider');
  }
  return context;
}
