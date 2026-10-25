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
  SEED_FARMS,
  SEED_SHEDS,
  SEED_FLOCK,
  SEED_FLOCKS,
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
} from '../calc';
import {
  saveQuickDailyRecord,
  saveFullDailyRecord,
  saveSaleTransaction,
  saveFlock,
  updateFlockPhaseDAL,
  saveShed,
  saveMandiRate,
  isBackendConnected,
  loadFarmDailyRecords,
} from '../dal';

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
  isDatabaseConnected: boolean;
  loginAsDemo: () => void;
  loginWithPhone: (phone: string, otp: string) => boolean;
  logout: () => void;
  switchRole: (role: UserProfile['role']) => void;

  // Farm & Flocks
  farms: Farm[];
  farm: Farm;
  switchFarm: (farmId: string) => void;
  setActiveFarmData: (data: {
    farm: Farm;
    sheds?: Shed[];
    flocks?: Flock[];
    unitSettings?: UnitSettings;
    dailyRecords?: DailyRecord[];
    sales?: Sale[];
    user?: UserProfile;
  }) => void;
  sheds: Shed[];
  flocks: Flock[];
  flock: Flock;
  switchFlock: (flockId: string) => void;
  addFlock: (flockData: Omit<Flock, 'id'>) => Promise<void>;
  updateFlockPhase: (flockId: string, phase: Flock['currentPhase']) => Promise<void>;
  closeFlockBatch: (flockId: string) => Promise<void>;
  addShed: (shedData: Omit<Shed, 'id'>) => Promise<void>;
  unitSettings: UnitSettings;
  updateUnitSettings: (settings: Partial<UnitSettings>) => void;

  // Daily Ledger
  dailyRecords: DailyRecord[];
  todayRecord: DailyRecord;
  yesterdayRecord?: DailyRecord;
  addQuickLog: (entry: QuickEntryPayload) => Promise<void>;
  addFullDailyRecord: (entry: Partial<DailyRecord>) => Promise<void>;

  // Sales & Customers
  customers: Customer[];
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'invoiceNumber'>) => Promise<void>;
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
  const [user, setUser] = useState<UserProfile | null>(() => ({
    id: "usr-owner-01",
    name: "सचिन गायकवाड (मालक)",
    phone: "9822012345",
    role: "owner",
    farmId: "farm-sahyadri-01",
  }));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  const [farms, _setFarms] = useState<Farm[]>(() => SEED_FARMS);
  const [farm, setFarm] = useState<Farm>(() => SEED_FARM);
  const [sheds, setSheds] = useState<Shed[]>(() => SEED_SHEDS);
  const [flocks, setFlocks] = useState<Flock[]>(() => SEED_FLOCKS);
  const [flock, setFlock] = useState<Flock>(() => SEED_FLOCK);
  const [unitSettings, setUnitSettings] = useState<UnitSettings>(() => DEFAULT_UNIT_SETTINGS);
  
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>(() => generate90DaysDailyRecords());

  const [customers, setCustomers] = useState<Customer[]>(() => SEED_CUSTOMERS);

  const [sales, setSales] = useState<Sale[]>(() => [
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
      quantityUnits: 40,
      unitName: "gatta",
      ratePerUnit: 1134,
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
      quantityUnits: 130,
      unitName: "tray",
      ratePerUnit: 162,
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
  const [vaccinations, setVaccinations] = useState<VaccinationTask[]>(() => SEED_VACCINATIONS);
  const [alerts, setAlerts] = useState<AlertItem[]>(() => SEED_ALERTS);

  const [environment, setEnvironment] = useState({
    tempMin: 22.5,
    tempMax: 29.8,
    humidity: 62,
    ammoniaPpm: 12,
    fansOn: true,
    lightsOn: true,
  });

  // Client-only mount synchronization: load saved localStorage state without breaking SSR hydration
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.user) setUser(parsed.user);
          if (parsed.isDemoMode !== undefined) setIsDemoMode(parsed.isDemoMode);
          if (parsed.farm) setFarm(parsed.farm);
          if (parsed.flock) setFlock(parsed.flock);
          if (parsed.sheds) setSheds(parsed.sheds);
          if (parsed.dailyRecords && parsed.dailyRecords.length > 0) setDailyRecords(parsed.dailyRecords);
          if (parsed.customers && parsed.customers.length > 0) setCustomers(parsed.customers);
          if (parsed.sales && parsed.sales.length > 0) setSales(parsed.sales);
          if (parsed.marketRates && parsed.marketRates.length > 0) setMarketRates(parsed.marketRates);
          if (parsed.vaccinations && parsed.vaccinations.length > 0) setVaccinations(parsed.vaccinations);
          if (parsed.unitSettings) setUnitSettings(parsed.unitSettings);
          if (parsed.environment) setEnvironment(parsed.environment);
        }
      } catch {
        // ignore
      }
    });
  }, []);

  const isDatabaseConnected = isBackendConnected();

  // If connected to Supabase in non-demo mode, load live farm records on initial mount
  useEffect(() => {
    if (!isDemoMode && isDatabaseConnected && farm.id && flock.id) {
      loadFarmDailyRecords(farm.id, flock.id).then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setDailyRecords(res.data);
        }
      });
    }
  }, [isDemoMode, isDatabaseConnected, farm.id, flock.id]);

  // Save to LocalStorage for offline and sandbox persistence
  const saveStateToStorage = (updatedRecords?: DailyRecord[], updatedSales?: Sale[]) => {
    try {
      const stateToSave = {
        dailyRecords: updatedRecords || dailyRecords,
        unitSettings,
        user,
        customers,
        sales: updatedSales || sales,
        alerts,
        vaccinations,
        isDemoMode,
        farms,
        farm,
        sheds,
        flocks,
        flock,
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
      name: "सचिन गायकवाड (मालक - डेमो सँडबॉक्स)",
      phone: "9822012345",
      role: "owner",
      farmId: "farm-sahyadri-01",
    });
  };

  const loginWithPhone = (phone: string, otp: string): boolean => {
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
    try {
      localStorage.removeItem('layeros_token');
      localStorage.removeItem('layeros_live_active');
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      sessionStorage.removeItem('layeros_entered');
    } catch {
      // ignore
    }
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

  const switchFarm = (farmId: string) => {
    const target = farms.find(f => f.id === farmId);
    if (target) {
      setFarm(target);
      if (user) {
        const updatedUser = { ...user, farmId: target.id };
        setUser(updatedUser);
      }
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.farm = target;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    }
  };

  const switchFlock = (flockId: string) => {
    const target = flocks.find(f => f.id === flockId);
    if (target) {
      setFlock(target);
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.flock = target;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    }
  };

  const addFlock = async (flockData: Omit<Flock, 'id'>) => {
    const res = await saveFlock({
      farmId: flockData.farmId,
      shedId: flockData.shedId,
      batchCode: flockData.batchCode,
      breed: flockData.breed,
      hatcherySource: flockData.hatcherySource,
      placementDate: flockData.placementDate,
      initialChickCount: flockData.initialChickCount,
      chickCostPerBird: flockData.chickCostPerBird,
      currentBirdCount: flockData.currentBirdCount,
      ageWeeks: flockData.ageWeeks,
      currentPhase: flockData.currentPhase,
    });

    if (res.success && res.data) {
      const updated = [res.data, ...flocks];
      setFlocks(updated);
      setFlock(res.data);
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.flocks = updated;
          parsed.flock = res.data;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    }
  };

  const updateFlockPhase = async (flockId: string, phase: Flock['currentPhase']) => {
    const res = await updateFlockPhaseDAL({ flockId, currentPhase: phase });
    if (res.success) {
      const updated = flocks.map(f => (f.id === flockId ? { ...f, currentPhase: phase } : f));
      setFlocks(updated);
      if (flock.id === flockId) {
        setFlock(prev => ({ ...prev, currentPhase: phase }));
      }
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.flocks = updated;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    }
  };

  const closeFlockBatch = async (flockId: string) => {
    await updateFlockPhase(flockId, 'cull_ready');
  };

  const addShed = async (shedData: Omit<Shed, 'id'>) => {
    const res = await saveShed({
      farmId: shedData.farmId,
      shedNumber: shedData.shedNumber,
      name: shedData.name,
      capacity: shedData.capacity,
      shedType: shedData.shedType,
      hasSensors: shedData.hasSensors,
    });

    if (res.success && res.data) {
      const updated = [...sheds, res.data];
      setSheds(updated);
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.sheds = updated;
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

  const setActiveFarmData = (data: {
    farm: Farm;
    sheds?: Shed[];
    flocks?: Flock[];
    unitSettings?: UnitSettings;
    dailyRecords?: DailyRecord[];
    sales?: Sale[];
    user?: UserProfile;
  }) => {
    setIsDemoMode(false);
    setIsAuthenticated(true);
    setFarm(data.farm);
    _setFarms(prev => {
      const exists = prev.some(f => f.id === data.farm.id);
      return exists ? prev.map(f => (f.id === data.farm.id ? data.farm : f)) : [data.farm, ...prev];
    });
    if (data.sheds && data.sheds.length > 0) {
      setSheds(data.sheds);
    }
    if (data.flocks && data.flocks.length > 0) {
      setFlocks(data.flocks);
      setFlock(data.flocks[0]);
    }
    if (data.unitSettings) {
      setUnitSettings(data.unitSettings);
    }
    if (data.dailyRecords !== undefined) {
      setDailyRecords(data.dailyRecords);
    }
    if (data.sales !== undefined) {
      setSales(data.sales);
    }
    if (data.user) {
      setUser(data.user);
    }
    try {
      const stateToSave = {
        dailyRecords: data.dailyRecords !== undefined ? data.dailyRecords : dailyRecords,
        unitSettings: data.unitSettings || unitSettings,
        user: data.user || user,
        customers,
        sales: data.sales !== undefined ? data.sales : sales,
        alerts,
        vaccinations,
        isDemoMode: false,
        farms: [data.farm],
        farm: data.farm,
        sheds: data.sheds || sheds,
        flocks: data.flocks || flocks,
        flock: (data.flocks && data.flocks[0]) || flock,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  };

  const defaultTodayRecord: DailyRecord = {
    id: 'record-today',
    farmId: farm.id,
    flockId: flock.id,
    recordDate: new Date().toISOString().split('T')[0],
    openingBirds: flock.currentBirdCount || farm.totalCapacity || 0,
    mortality: 0,
    culls: 0,
    closingBirds: flock.currentBirdCount || farm.totalCapacity || 0,
    totalEggsCollected: 0,
    brokenCrackedEggs: 0,
    softShellEggs: 0,
    rejectEggs: 0,
    goodEggs: 0,
    morningCollection: 0,
    eveningCollection: 0,
    hdPct: 0,
    productionPct: 0,
    feedIssuedKg: 0,
    feedPerBirdG: 0,
    waterConsumptionLitres: 0,
    avgEggWeightG: 55,
    sellingPricePerEgg: 5.4,
    feedPricePerKg: 35.0,
    otherCashExpenses: 0,
    otherIncome: 0,
    simpleOperatingProfit: 0,
    trueProfit: 0,
    costPerEgg: 4.8,
    breakEvenEggPrice: 4.8,
    isClosed: false,
  };

  const todayRecord = dailyRecords.length > 0 ? dailyRecords[dailyRecords.length - 1] : defaultTodayRecord;
  const yesterdayRecord = dailyRecords.length > 1 ? dailyRecords[dailyRecords.length - 2] : undefined;

  const addQuickLog = async (entry: QuickEntryPayload) => {
    const openingBirds = todayRecord ? todayRecord.closingBirds : 30000;
    const feedPrice = todayRecord ? todayRecord.feedPricePerKg : 35.00;

    const res = await saveQuickDailyRecord({
      farmId: farm.id,
      flockId: flock.id,
      recordDate: entry.recordDate,
      eggsCollected: entry.eggsCollected,
      feedKg: entry.feedKg,
      mortality: entry.mortality,
      sellingRate: entry.sellingRate || 5.40,
      soldEggs: entry.soldQtyEggs,
    }, unitSettings, openingBirds, feedPrice);

    if (res.success && res.data) {
      const newRecord = res.data;
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
    }
  };

  const addFullDailyRecord = async (entry: Partial<DailyRecord>) => {
    if (!entry.recordDate) return;

    const res = await saveFullDailyRecord({
      farmId: farm.id,
      flockId: flock.id,
      recordDate: entry.recordDate,
      openingBirds: entry.openingBirds || 30000,
      mortality: entry.mortality || 0,
      culls: entry.culls || 0,
      closingBirds: entry.closingBirds || 29985,
      totalEggsCollected: entry.totalEggsCollected || 0,
      brokenCrackedEggs: entry.brokenCrackedEggs || 0,
      softShellEggs: entry.softShellEggs || 0,
      rejectEggs: entry.rejectEggs || 0,
      goodEggs: entry.goodEggs || 0,
      morningCollection: entry.morningCollection || 0,
      eveningCollection: entry.eveningCollection || 0,
      hdPct: entry.hdPct || 0,
      productionPct: entry.productionPct || 0,
      feedIssuedKg: entry.feedIssuedKg || 0,
      feedPerBirdG: entry.feedPerBirdG || 0,
      waterConsumptionLitres: entry.waterConsumptionLitres,
      avgEggWeightG: entry.avgEggWeightG,
      sellingPricePerEgg: entry.sellingPricePerEgg || 5.40,
      feedPricePerKg: entry.feedPricePerKg || 35.00,
      otherCashExpenses: entry.otherCashExpenses || 0,
      isClosed: entry.isClosed ?? true,
      notes: entry.notes,
    });

    if (res.success && res.data) {
      const existingIndex = dailyRecords.findIndex(r => r.recordDate === entry.recordDate);
      let updated: DailyRecord[];
      if (existingIndex >= 0) {
        updated = [...dailyRecords];
        updated[existingIndex] = res.data;
      } else {
        updated = [...dailyRecords, res.data];
      }
      setDailyRecords(updated);
      saveStateToStorage(updated);
    }
  };

  const addSale = async (saleData: Omit<Sale, 'id' | 'invoiceNumber'>) => {
    const newInvoice = `INV-2026-${sales.length + 101}`;

    const res = await saveSaleTransaction({
      farmId: farm.id,
      customerId: saleData.customerId,
      saleDate: saleData.saleDate,
      saleType: saleData.saleType,
      quantityUnits: saleData.quantityUnits,
      unitName: saleData.unitName,
      totalEggsEquivalent: saleData.totalEggsEquivalent || 0,
      ratePerUnit: saleData.ratePerUnit,
      grossAmount: saleData.grossAmount,
      discount: saleData.discount,
      netAmount: saleData.netAmount,
      paidAmount: saleData.paidAmount,
      vehicleNumber: saleData.vehicleNumber,
      deliveryPerson: saleData.deliveryPerson,
      notes: saleData.notes,
    }, newInvoice);

    if (res.success && res.data) {
      const newSale: Sale = {
        ...res.data,
        customerName: saleData.customerName,
      };
      const updatedSales = [newSale, ...sales];
      setSales(updatedSales);
      saveStateToStorage(undefined, updatedSales);

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

  const addMarketRate = async (rate: MarketRate) => {
    await saveMandiRate({
      mandiName: rate.mandiName,
      state: 'Maharashtra',
      rateDate: rate.rateDate,
      pricePer100: rate.ratePer100,
      pricePerPiece: rate.ratePerEgg,
      trend: rate.trend as any,
    });
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
        isDatabaseConnected,
        loginAsDemo,
        loginWithPhone,
        logout,
        switchRole,
        farms,
        farm,
        switchFarm,
        setActiveFarmData,
        sheds,
        addShed,
        flocks,
        flock,
        switchFlock,
        addFlock,
        updateFlockPhase,
        closeFlockBatch,
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
