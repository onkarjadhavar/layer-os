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
  ROHAN_FARM_ID,
  SEED_FARM,
  SEED_FARMS,
  SEED_SHEDS,
  SEED_FLOCK,
  SEED_FLOCKS,
  SEED_CUSTOMERS,
  SEED_SUPPLIERS,
  SEED_EMPLOYEES,
  SEED_LOAN,
  SEED_EXPENSES,
  ExpenseItem,
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
import { farmsService } from '../../services/farms.service';
import { salesService } from '../../services/sales.service';
import { marketService } from '../../services/market.service';

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
    farms?: Farm[];
    sheds?: Shed[];
    flocks?: Flock[];
    flock?: Flock;
    unitSettings?: UnitSettings;
    dailyRecords?: DailyRecord[];
    customers?: Customer[];
    sales?: Sale[];
    expenses?: ExpenseItem[];
    employees?: Employee[];
    loan?: Loan;
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
  todayRecord: DailyRecord | null;
  yesterdayRecord?: DailyRecord;
  addQuickLog: (entry: QuickEntryPayload) => Promise<void>;
  addFullDailyRecord: (entry: Partial<DailyRecord>) => Promise<void>;

  // Sales & Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
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

  // Expenses & Accounts
  expenses: ExpenseItem[];
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  updateLoan: (loanData: Partial<Loan>) => void;

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

function getInitialSavedState(): any {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function LayerOSProvider({ children }: { children: React.ReactNode }) {
  const _savedInit = getInitialSavedState();
  const isDemoRequested = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('demo') === 'true' ||
    window.location.pathname.includes('/farms/farm-sahyadri-01') ||
    window.location.pathname.includes('/farms/farm-anand-02')
  );
  const isEnrolledInit = Boolean(
    !isDemoRequested &&
    _savedInit &&
    !_savedInit.isDemoMode &&
    _savedInit.farm &&
    _savedInit.farm.id !== 'farm-sahyadri-01' &&
    _savedInit.farm.id !== 'farm-anand-02'
  );

  const [user, setUser] = useState<UserProfile | null>(() => {
    if (isEnrolledInit) return _savedInit.user || null;
    return {
      id: "usr-owner-01",
      name: "सचिन गायकवाड (मालक)",
      phone: "9822012345",
      role: "owner",
      farmId: "farm-sahyadri-01",
    };
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => (isEnrolledInit ? false : true));

  const [farms, _setFarms] = useState<Farm[]>(() => (isEnrolledInit ? [_savedInit.farm] : SEED_FARMS));
  const [farm, setFarm] = useState<Farm>(() => (isEnrolledInit ? _savedInit.farm : SEED_FARM));
  const [sheds, setSheds] = useState<Shed[]>(() => (isEnrolledInit ? (_savedInit.sheds || []) : SEED_SHEDS));
  const [flocks, setFlocks] = useState<Flock[]>(() => (isEnrolledInit ? (_savedInit.flocks || [_savedInit.flock]) : SEED_FLOCKS));
  const [flock, setFlock] = useState<Flock>(() => (isEnrolledInit ? (_savedInit.flock || _savedInit.flocks?.[0] || SEED_FLOCK) : SEED_FLOCK));
  const [unitSettings, setUnitSettings] = useState<UnitSettings>(() => (isEnrolledInit ? (_savedInit.unitSettings || DEFAULT_UNIT_SETTINGS) : DEFAULT_UNIT_SETTINGS));

  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>(() => {
    if (isEnrolledInit) {
      const records = (_savedInit.dailyRecords || []).filter(
        (r: DailyRecord) => r.farmId === _savedInit.farm.id && r.farmId !== 'farm-sahyadri-01' && r.farmId !== 'farm-anand-02'
      );
      records.sort((a: any, b: any) => a.recordDate.localeCompare(b.recordDate));
      return records;
    }
    return generate90DaysDailyRecords();
  });

  const [customers, setCustomers] = useState<Customer[]>(() => (isEnrolledInit ? (_savedInit.customers || []) : SEED_CUSTOMERS));

  const [sales, setSales] = useState<Sale[]>(() => {
    if (isEnrolledInit) return _savedInit.sales || [];
    return [
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
    ];
  });

  const [suppliers] = useState<Supplier[]>(() => (isEnrolledInit ? [] : SEED_SUPPLIERS));
  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (isEnrolledInit) return _savedInit?.employees || [];
    return SEED_EMPLOYEES;
  });
  const [loan, setLoan] = useState<Loan>(() => {
    if (isEnrolledInit) {
      return _savedInit?.loan || {
        id: '',
        bankName: 'बँक कर्ज नोंद नाही',
        principalAmount: 0,
        annualInterestRate: 0,
        monthlyEmi: 0,
        emiDueDay: 5,
        tenureMonths: 0,
        outstandingPrincipal: 0,
      };
    }
    return SEED_LOAN;
  });
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    if (isEnrolledInit) {
      return (_savedInit?.expenses || []).filter(
        (e: ExpenseItem) => e.farmId === _savedInit.farm?.id && e.farmId !== 'farm-sahyadri-01' && e.farmId !== 'farm-anand-02'
      );
    }
    return SEED_EXPENSES;
  });
  const [marketRates, setMarketRates] = useState<MarketRate[]>(() => _savedInit?.marketRates || []);
  const [vaccinations, setVaccinations] = useState<VaccinationTask[]>(() => _savedInit?.vaccinations || [
    { id: 'v-1', vaccineName: 'Marek’s Disease (HVT)', diseaseTargeted: 'Marek’s', dueAgeWeeks: 1, dueDate: 'Day 1 (Hatchery)', status: 'done', isImportant: true },
    { id: 'v-2', vaccineName: 'Newcastle Disease (ND Lasota)', diseaseTargeted: 'Ranikhet / ND', dueAgeWeeks: 1, dueDate: 'Day 7 (Eye drop)', status: 'done', isImportant: true },
    { id: 'v-3', vaccineName: 'Infectious Bursal Disease (IBD)', diseaseTargeted: 'Gumboro', dueAgeWeeks: 2, dueDate: 'Day 14 (Drinking water)', status: 'done', isImportant: true },
    { id: 'v-4', vaccineName: 'Fowl Pox Vaccine', diseaseTargeted: 'Fowl Pox', dueAgeWeeks: 6, dueDate: 'Week 6 (Wing web)', status: 'done', isImportant: false },
    { id: 'v-5', vaccineName: 'ND + IB Killed Vaccine', diseaseTargeted: 'ND + Infectious Bronchitis', dueAgeWeeks: 16, dueDate: 'Week 16 (Subcutaneous injection)', status: 'done', isImportant: true },
    { id: 'v-6', vaccineName: 'Egg Drop Syndrome (EDS-76)', diseaseTargeted: 'Egg Drop Syndrome', dueAgeWeeks: 18, dueDate: 'Week 18 (Pre-lay injection)', status: 'done', isImportant: true },
    { id: 'v-7', vaccineName: 'ND Lasota Booster', diseaseTargeted: 'Ranikhet Booster', dueAgeWeeks: 28, dueDate: 'Week 28 (Drinking water)', status: 'pending', isImportant: true },
    { id: 'v-8', vaccineName: 'ND Lasota Regular Booster', diseaseTargeted: 'Ranikhet Booster', dueAgeWeeks: 36, dueDate: 'Week 36 (Drinking water)', status: 'pending', isImportant: true },
  ]);
  const [alerts, setAlerts] = useState<AlertItem[]>(() => _savedInit?.alerts || []);

  const [environment, setEnvironment] = useState(() => _savedInit?.environment || {
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
        const isDemoRequested = typeof window !== 'undefined' && (
          new URLSearchParams(window.location.search).get('demo') === 'true' ||
          window.location.pathname.includes('/farms/farm-sahyadri-01') ||
          window.location.pathname.includes('/farms/farm-anand-02')
        );
        if (isDemoRequested) {
          setIsDemoMode(true);
          setIsAuthenticated(true);
          setFarm(SEED_FARM);
          _setFarms(SEED_FARMS);
          setFlock(SEED_FLOCK);
          setFlocks(SEED_FLOCKS);
          setSheds(SEED_SHEDS);
          setDailyRecords(generate90DaysDailyRecords());
          setCustomers(SEED_CUSTOMERS);
          setExpenses(SEED_EXPENSES);
          setEmployees(SEED_EMPLOYEES);
          setLoan(SEED_LOAN);
          setUser({
            id: "usr-demo-sahyadri",
            name: "सचिन गायकवाड (मालक - सह्याद्री डेमो)",
            phone: "9822012345",
            role: "owner",
            farmId: "farm-sahyadri-01",
          });
          return;
        }

        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.user && parsed.user.farmId !== 'farm-sahyadri-01' && parsed.user.farmId !== 'farm-anand-02') {
            setUser(parsed.user);
          }
          if (parsed.isDemoMode !== undefined) setIsDemoMode(parsed.isDemoMode);
          if (parsed.isDemoMode) {
            // Demo mode strictly isolated to Sahyadri & Anand
            setFarm(SEED_FARM);
            _setFarms(SEED_FARMS);
            setFlock(SEED_FLOCK);
            setFlocks(SEED_FLOCKS);
            setSheds(SEED_SHEDS);
            setDailyRecords(generate90DaysDailyRecords());
            setCustomers(SEED_CUSTOMERS);
            setExpenses(SEED_EXPENSES);
            setEmployees(SEED_EMPLOYEES);
            setLoan(SEED_LOAN);
          } else if (parsed.farm && parsed.farm.id !== 'farm-sahyadri-01' && parsed.farm.id !== 'farm-anand-02') {
            // Enrolled user strictly isolated to their own enrolled farm: zero demo data
            setIsDemoMode(false);
            setFarm(parsed.farm);
            _setFarms([parsed.farm]);
            if (parsed.flock) setFlock(parsed.flock);
            if (parsed.flocks && parsed.flocks.length > 0) setFlocks(parsed.flocks);
            if (parsed.sheds && parsed.sheds.length > 0) setSheds(parsed.sheds);
            const records = (parsed.dailyRecords || []).filter(
              (r: any) => r.farmId === parsed.farm.id && r.farmId !== 'farm-sahyadri-01' && r.farmId !== 'farm-anand-02'
            );
            records.sort((a: any, b: any) => a.recordDate.localeCompare(b.recordDate));
            setDailyRecords(records);
            setCustomers(parsed.customers || []);
            setSales(parsed.sales || []);
            const validExpenses = (parsed.expenses || []).filter(
              (e: any) => e.farmId === parsed.farm.id && e.farmId !== 'farm-sahyadri-01' && e.farmId !== 'farm-anand-02'
            );
            setExpenses(validExpenses);
            setEmployees(parsed.employees || []);
            if (parsed.loan) setLoan(parsed.loan);
            setAlerts(parsed.alerts || []);
            if (parsed.user) setUser(parsed.user);
          }
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

  // Fetch authorized farms from backend
  useEffect(() => {
    if (!isDemoMode) {
      farmsService.listFarms().then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mappedFarms: Farm[] = data.map((f: any) => ({
            id: f.id,
            name: f.name,
            ownerName: f.owner_name,
            phone: f.phone,
            email: f.email || '',
            district: f.district,
            state: f.state,
            totalCapacity: f.total_capacity,
            status: (f.status as any) || 'active',
          }));
          _setFarms(mappedFarms);
        }
      }).catch(() => {});
    }
  }, [isDemoMode]);

  const isDatabaseConnected = isBackendConnected();

  // Load live farm daily records and customers on initial mount or farm change
  useEffect(() => {
    if (!isDemoMode && farm.id && farm.id !== 'farm-sahyadri-01' && farm.id !== 'farm-anand-02') {
      if (flock.id) {
        loadFarmDailyRecords(farm.id, flock.id).then(res => {
          if (res.success && Array.isArray(res.data)) {
            const clean = res.data.filter(
              r => r.farmId === farm.id && r.farmId !== 'farm-sahyadri-01' && r.farmId !== 'farm-anand-02'
            );
            clean.sort((a, b) => a.recordDate.localeCompare(b.recordDate));
            setDailyRecords(clean);
          }
        }).catch(() => {});
      }
      salesService.getCustomers(farm.id).then((custs: any) => {
        if (Array.isArray(custs) && custs.length > 0) {
          const mapped: Customer[] = custs.map((c: any) => ({
            id: c.id,
            name: c.name,
            phone: c.phone || '',
            area: c.area || '',
            customerType: (c.customer_type as any) || 'wholesaler',
            creditLimit: Number(c.credit_limit || 200000),
            creditDays: Number(c.credit_days || 7),
            currentOutstanding: Number(c.current_outstanding || 0),
            days0to7: Number(c.current_outstanding || 0),
            days8to15: 0,
            days16to30: 0,
            days30Plus: 0,
            averageDaysToPay: Number(c.credit_days || 7),
            onTimePaymentPct: 92,
            defaultPriceUnit: (c.default_price_unit as any) || 'per_100',
          }));
          setCustomers(mapped);
        }
      }).catch(() => {});
    }
  }, [isDemoMode, farm.id, flock.id]);

  // Load latest mandi market rates from PostgreSQL
  useEffect(() => {
    if (!isDemoMode) {
      marketService.getLatestRates().then((rates: any) => {
        if (Array.isArray(rates) && rates.length > 0) {
          const mapped: MarketRate[] = rates.map((r: any) => ({
            mandiName: r.mandi_name || r.zone || 'Pune',
            rateDate: r.rate_date || new Date().toISOString().split('T')[0],
            ratePer100: Number(r.rate_per_100 || (r.egg_rate_per_piece ? r.egg_rate_per_piece * 100 : 540)),
            ratePerEgg: Number(r.rate_per_egg || r.egg_rate_per_piece || 5.40),
            trend: (r.trend as any) || 'steady',
          }));
          setMarketRates(mapped);
        }
      }).catch(() => {});
    }
  }, [isDemoMode]);

  // Save to LocalStorage for offline and sandbox persistence
  const saveStateToStorage = (updatedRecords?: DailyRecord[], updatedSales?: Sale[], updatedCustomers?: Customer[]) => {
    try {
      const stateToSave = {
        dailyRecords: updatedRecords || dailyRecords,
        unitSettings,
        user,
        customers: updatedCustomers || customers,
        sales: updatedSales || sales,
        expenses,
        employees,
        loan,
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
    setFarm(SEED_FARM);
    _setFarms(SEED_FARMS);
    setFlock(SEED_FLOCK);
    setFlocks(SEED_FLOCKS);
    setSheds(SEED_SHEDS);
    setDailyRecords(generate90DaysDailyRecords());
    setCustomers(SEED_CUSTOMERS);
    setExpenses(SEED_EXPENSES);
    setEmployees(SEED_EMPLOYEES);
    setLoan(SEED_LOAN);
    setUnitSettings(DEFAULT_UNIT_SETTINGS);
    setUser({
      id: "usr-demo-sahyadri",
      name: "सचिन गायकवाड (मालक - सह्याद्री डेमो)",
      phone: "9822012345",
      role: "owner",
      farmId: "farm-sahyadri-01",
    });
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.isDemoMode = true;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  };

  const loginWithPhone = (phone: string, otp: string): boolean => {
    if (otp.length === 6) {
      // 1. Check if this phone number matches the enrolled farm in storage
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.user && parsed.user.phone === phone && parsed.farm) {
            setIsDemoMode(false);
            setIsAuthenticated(true);
            setUser(parsed.user);
            setFarm(parsed.farm);
            _setFarms([parsed.farm]);
            return true;
          }
        }
      } catch {
        // ignore
      }

      // 2. Demo credentials check
      if (phone === '9822012345') {
        loginAsDemo();
        return true;
      }

      setIsDemoMode(false);
      setIsAuthenticated(true);
      setUser({
        id: "usr-live-01",
        name: "पोल्ट्री चालक (Farm Incharge)",
        phone,
        role: "owner",
        farmId: farm.id || ROHAN_FARM_ID,
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
    // If user is in non-demo mode (enrolled customer), cross-tenant switching is strictly forbidden
    if (!isDemoMode && farm.id !== farmId) {
      console.warn('Cross-tenant isolation: cannot switch to another farm outside enrolled account.');
      return;
    }
    const target = farms.find(f => f.id === farmId);
    if (target) {
      setFarm(target);
      const updatedUser = user ? { ...user, farmId: target.id } : null;
      if (updatedUser) {
        setUser(updatedUser);
      }
      if (!isDemoMode) {
        farmsService.getFarmDashboard(farmId).then(data => {
          if (data && data.farm) {
            const farmModel: Farm = {
              id: data.farm.id,
              name: data.farm.name,
              ownerName: data.farm.owner_name,
              phone: data.farm.phone,
              email: data.farm.email || '',
              district: data.farm.district,
              state: data.farm.state,
              totalCapacity: data.farm.total_capacity,
              status: (data.farm.status as any) || 'active',
            };
            const shedsModel: Shed[] = (data.sheds || []).map((s: any, idx: number) => ({
              id: s.id || `shed-${idx + 1}`,
              farmId: s.farm_id || data.farm.id,
              shedNumber: s.shed_number || s.name || `Shed-0${idx + 1}`,
              name: s.name || `शेड ${idx + 1}`,
              capacity: s.capacity || Math.round(data.farm.total_capacity / Math.max(1, data.sheds?.length || 1)),
              shedType: (s.shed_type || s.equipment_type as any) || 'elevated_cage',
              hasSensors: Boolean(s.has_climate_sensors),
            }));
            const flocksModel: Flock[] = (data.flocks || []).map((f: any, idx: number) => ({
              id: f.id || `flock-${idx + 1}`,
              farmId: f.farm_id || data.farm.id,
              shedId: f.shed_id || (shedsModel[0]?.id || 'shed-1'),
              batchCode: f.batch_code || f.name || `Batch-${idx + 1}`,
              breed: f.breed || 'BV300',
              hatcherySource: f.hatchery_source || 'Direct Placement',
              placementDate: f.placement_date || new Date().toISOString().split('T')[0],
              initialChickCount: f.initial_chick_count || f.initial_birds || data.summary?.total_birds || data.farm.total_capacity,
              chickCostPerBird: Number(f.chick_cost_per_bird || 42.0),
              currentBirdCount: f.current_bird_count ?? f.current_birds ?? (data.summary?.total_birds || data.farm.total_capacity),
              ageWeeks: f.age_weeks || 24,
              currentPhase: (f.current_phase as any) || 'laying',
            }));
            const unitSettingsModel: UnitSettings = data.unit_settings || data.farm.unit_settings || DEFAULT_UNIT_SETTINGS;
            const dailyRecordsModel: DailyRecord[] = (data.daily_records || []).map((r: any) => ({
              id: r.id,
              farmId: r.farm_id || r.farmId || data.farm.id,
              flockId: r.flock_id || r.flockId || (flocksModel[0]?.id || ''),
              recordDate: r.record_date || r.recordDate,
              openingBirds: r.opening_birds ?? r.openingBirds ?? 0,
              mortality: r.mortality ?? 0,
              culls: r.culls ?? 0,
              closingBirds: r.closing_birds ?? r.closingBirds ?? 0,
              totalEggsCollected: r.total_eggs_collected ?? r.totalEggsCollected ?? r.eggs_collected ?? 0,
              brokenCrackedEggs: r.broken_cracked_eggs ?? r.brokenCrackedEggs ?? r.damaged_eggs ?? 0,
              softShellEggs: r.soft_shell_eggs ?? r.softShellEggs ?? 0,
              rejectEggs: r.reject_eggs ?? r.rejectEggs ?? 0,
              goodEggs: r.good_eggs ?? r.goodEggs ?? ((r.total_eggs_collected ?? r.eggs_collected ?? 0) - (r.broken_cracked_eggs ?? 0)),
              morningCollection: r.morning_collection ?? r.morningCollection ?? 0,
              eveningCollection: r.evening_collection ?? r.eveningCollection ?? 0,
              hdPct: Number(r.hd_pct ?? r.hdPct ?? 0),
              productionPct: Number(r.production_pct ?? r.productionPct ?? r.hd_pct ?? 0),
              feedIssuedKg: Number(r.feed_issued_kg ?? r.feedIssuedKg ?? r.feed_used_kg ?? 0),
              feedPerBirdG: Number(r.feed_per_bird_g ?? r.feedPerBirdG ?? 0),
              waterConsumptionLitres: r.water_consumption_litres ?? r.waterConsumptionLitres ?? 0,
              avgEggWeightG: Number(r.avg_egg_weight_g ?? r.avgEggWeightG ?? 58.5),
              sellingPricePerEgg: Number(r.selling_price_per_egg ?? r.sellingPricePerEgg ?? 5.4),
              feedPricePerKg: Number(r.feed_price_per_kg ?? r.feedPricePerKg ?? 35.0),
              otherCashExpenses: Number(r.other_cash_expenses ?? r.otherCashExpenses ?? 0),
              otherIncome: 0,
              simpleOperatingProfit: Number(r.simple_operating_profit ?? r.simpleOperatingProfit ?? 0),
              trueProfit: Number(r.true_profit ?? r.trueProfit ?? 0),
              costPerEgg: Number(r.cost_per_egg ?? r.costPerEgg ?? 4.8),
              breakEvenEggPrice: Number(r.break_even_egg_price ?? r.breakEvenEggPrice ?? 4.8),
              isClosed: r.is_closed ?? true,
              notes: r.notes || undefined,
            }));
            dailyRecordsModel.sort((a, b) => a.recordDate.localeCompare(b.recordDate));
            const salesModel: Sale[] = (data.sales || []).map((s: any) => ({
              id: s.id,
              invoiceNumber: s.invoice_number || s.invoiceNumber || `INV-${s.id}`,
              customerId: s.customer_id || s.customerId || '',
              customerName: s.customer_name || s.customerName || 'ग्राहक',
              saleDate: s.sale_date || s.saleDate,
              saleType: s.sale_type || s.saleType || 'eggs',
              quantityUnits: Number(s.quantity_units || s.quantityUnits || 0),
              unitName: s.unit_name || s.unitName || 'eggs',
              ratePerUnit: Number(s.rate_per_unit || s.ratePerUnit || 0),
              grossAmount: Number(s.gross_amount || s.grossAmount || 0),
              discount: Number(s.discount || 0),
              netAmount: Number(s.net_amount || s.netAmount || 0),
              paidAmount: Number(s.paid_amount || s.paidAmount || 0),
              paymentStatus: (s.payment_status || s.paymentStatus || 'pending') as any,
              vehicleNumber: s.vehicle_number || s.vehicleNumber || undefined,
              deliveryPerson: s.delivery_person || s.deliveryPerson || undefined,
              notes: s.notes || undefined,
            }));

            setFarm(farmModel);
            setSheds(shedsModel);
            setFlocks(flocksModel);
            if (flocksModel.length > 0) setFlock(flocksModel[0]);
            setUnitSettings(unitSettingsModel);
            setDailyRecords(dailyRecordsModel);
            setSales(salesModel);

            try {
              const stateToSave = {
                farm: farmModel,
                sheds: shedsModel,
                flocks: flocksModel,
                flock: flocksModel.length > 0 ? flocksModel[0] : flock,
                unitSettings: unitSettingsModel,
                dailyRecords: dailyRecordsModel,
                sales: salesModel,
                user: updatedUser,
              };
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
            } catch {
              // ignore
            }
          }
        }).catch(() => {});

        salesService.getCustomers(farmId).then((custs: any) => {
          if (Array.isArray(custs) && custs.length > 0) {
            const mapped: Customer[] = custs.map((c: any) => ({
              id: c.id,
              name: c.name,
              phone: c.phone || '',
              area: c.area || '',
              customerType: (c.customer_type as any) || 'wholesaler',
              creditLimit: Number(c.credit_limit || 200000),
              creditDays: Number(c.credit_days || 7),
              currentOutstanding: Number(c.current_outstanding || 0),
              days0to7: Number(c.current_outstanding || 0),
              days8to15: 0,
              days16to30: 0,
              days30Plus: 0,
              averageDaysToPay: Number(c.credit_days || 7),
              onTimePaymentPct: 92,
              defaultPriceUnit: (c.default_price_unit as any) || 'per_100',
            }));
            setCustomers(mapped);
          } else {
            setCustomers([]);
          }
        }).catch(() => {});
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
    farms?: Farm[];
    sheds?: Shed[];
    flocks?: Flock[];
    flock?: Flock;
    unitSettings?: UnitSettings;
    dailyRecords?: DailyRecord[];
    customers?: Customer[];
    sales?: Sale[];
    expenses?: ExpenseItem[];
    employees?: Employee[];
    loan?: Loan;
    user?: UserProfile;
  }) => {
    setIsDemoMode(false);
    setIsAuthenticated(true);
    setFarm(data.farm);
    const updatedFarmsList: Farm[] = data.farms && data.farms.length > 0 ? data.farms : [data.farm];
    _setFarms(updatedFarmsList);

    setSheds(data.sheds || []);

    if (data.flocks && data.flocks.length > 0) {
      setFlocks(data.flocks);
      setFlock(data.flock || data.flocks[0]);
    } else if (data.flock) {
      setFlocks([data.flock]);
      setFlock(data.flock);
    }

    if (data.unitSettings) {
      setUnitSettings(data.unitSettings);
    }

    // For enrolled customer: strictly isolate daily records (empty array if newly enrolled, NEVER demo data)
    const validRecords = (data.dailyRecords || []).filter(
      r => r.farmId === data.farm.id && r.farmId !== 'farm-sahyadri-01' && r.farmId !== 'farm-anand-02'
    );
    validRecords.sort((a, b) => a.recordDate.localeCompare(b.recordDate));
    setDailyRecords(validRecords);

    const validCustomers = data.customers || [];
    setCustomers(validCustomers);

    const validSales = data.sales || [];
    setSales(validSales);

    const validExpenses = (data.expenses || []).filter(
      e => e.farmId === data.farm.id && e.farmId !== 'farm-sahyadri-01' && e.farmId !== 'farm-anand-02'
    );
    setExpenses(validExpenses);

    const validEmployees = data.employees || [];
    setEmployees(validEmployees);

    const defaultEmptyLoan: Loan = {
      id: '',
      bankName: 'बँक कर्ज नोंद नाही',
      principalAmount: 0,
      annualInterestRate: 0,
      monthlyEmi: 0,
      emiDueDay: 5,
      tenureMonths: 0,
      outstandingPrincipal: 0,
    };
    const activeLoan = data.loan || defaultEmptyLoan;
    setLoan(activeLoan);

    if (data.user) {
      setUser(data.user);
    }

    try {
      const stateToSave = {
        dailyRecords: validRecords,
        unitSettings: data.unitSettings || unitSettings,
        user: data.user || user,
        customers: validCustomers,
        sales: validSales,
        expenses: validExpenses,
        employees: validEmployees,
        loan: activeLoan,
        alerts: [],
        vaccinations: [],
        isDemoMode: false,
        farms: updatedFarmsList,
        farm: data.farm,
        sheds: data.sheds || [],
        flocks: data.flocks || (data.flock ? [data.flock] : []),
        flock: data.flock || (data.flocks && data.flocks[0]) || flock,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  };

  const defaultBirds = flock.currentBirdCount || farm.totalCapacity || 10000;
  const isLaying = flock.currentPhase === 'laying';
  const defaultEggs = isLaying ? Math.round(defaultBirds * 0.90) : 0;
  const defaultFeedKg = Math.round(defaultBirds * 0.11);
  const defaultMortality = Math.max(1, Math.round(defaultBirds * 0.0005));
  const defaultRev = Math.round(defaultEggs * 5.40);
  const defaultCost = Math.round(defaultFeedKg * 35.0 + 1600);
  const defaultProfit = defaultRev - defaultCost;
  const defaultBreakEven = defaultEggs > 0 ? Number((defaultCost / defaultEggs).toFixed(2)) : 4.80;

  const defaultTodayRecord: DailyRecord = {
    id: 'record-today',
    farmId: farm.id,
    flockId: flock.id,
    recordDate: new Date().toISOString().split('T')[0],
    openingBirds: defaultBirds,
    mortality: defaultMortality,
    culls: 0,
    closingBirds: defaultBirds - defaultMortality,
    totalEggsCollected: defaultEggs,
    brokenCrackedEggs: isLaying ? Math.round(defaultEggs * 0.006) : 0,
    softShellEggs: 0,
    rejectEggs: 0,
    goodEggs: isLaying ? defaultEggs - Math.round(defaultEggs * 0.006) : 0,
    morningCollection: Math.round(defaultEggs * 0.65),
    eveningCollection: defaultEggs - Math.round(defaultEggs * 0.65),
    hdPct: isLaying ? 90.0 : 0,
    productionPct: isLaying ? 90.0 : 0,
    feedIssuedKg: defaultFeedKg,
    feedPerBirdG: defaultBirds > 0 ? Number(((defaultFeedKg * 1000) / defaultBirds).toFixed(1)) : 110.0,
    waterConsumptionLitres: Math.round(defaultBirds * 0.22),
    avgEggWeightG: 55,
    sellingPricePerEgg: 5.4,
    feedPricePerKg: 35.0,
    otherCashExpenses: 1600,
    otherIncome: 0,
    simpleOperatingProfit: defaultProfit,
    trueProfit: defaultProfit,
    costPerEgg: defaultBreakEven,
    breakEvenEggPrice: defaultBreakEven,
    isClosed: false,
  };

  const todayRecord: DailyRecord | null = dailyRecords.length > 0 
    ? dailyRecords[dailyRecords.length - 1] 
    : (isDemoMode ? defaultTodayRecord : null);
  const yesterdayRecord = dailyRecords.length > 1 ? dailyRecords[dailyRecords.length - 2] : undefined;

  const addQuickLog = async (entry: QuickEntryPayload) => {
    const openingBirds = (todayRecord ? todayRecord.closingBirds : null) || flock.currentBirdCount || farm.totalCapacity || 10000;
    const feedPrice = (todayRecord ? todayRecord.feedPricePerKg : null) || 35.00;

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
      updated.sort((a, b) => a.recordDate.localeCompare(b.recordDate));
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
      updated.sort((a, b) => a.recordDate.localeCompare(b.recordDate));
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

  const addCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
    };
    setCustomers(prev => {
      const updated = [...prev, newCust];
      saveStateToStorage(undefined, undefined, updated);
      return updated;
    });
  };

  const recordPayment = async (customerId: string, amount: number) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          const newOutstanding = Math.max(0, c.currentOutstanding - amount);
          return { ...c, currentOutstanding: newOutstanding };
        }
        return c;
      })
    );

    try {
      await salesService.recordPayment({
        farm_id: farm.id,
        customer_id: customerId,
        amount,
        payment_date: new Date().toISOString().split('T')[0],
        payment_mode: 'upi',
      });
    } catch {
      // offline/test environment graceful handling
    }
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

  const addExpense = async (expData: Omit<ExpenseItem, 'id'>) => {
    const newExpense: ExpenseItem = {
      ...expData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      farmId: expData.farmId || farm.id,
    };
    setExpenses(prev => {
      const updated = [newExpense, ...prev];
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.expenses = updated;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const deleteExpense = async (id: string) => {
    setExpenses(prev => {
      const updated = prev.filter(e => e.id !== id);
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.expenses = updated;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const addEmployee = async (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setEmployees(prev => {
      const updated = [...prev, newEmp];
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.employees = updated;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const deleteEmployee = async (id: string) => {
    setEmployees(prev => {
      const updated = prev.filter(e => e.id !== id);
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.employees = updated;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const updateLoan = (loanData: Partial<Loan>) => {
    setLoan(prev => {
      const updated = { ...prev, ...loanData };
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.loan = updated;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetDemoData = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
    setFarm(SEED_FARM);
    _setFarms(SEED_FARMS);
    setFlock(SEED_FLOCK);
    setFlocks(SEED_FLOCKS);
    setSheds(SEED_SHEDS);
    setUser({
      id: "usr-demo-sahyadri",
      name: "सचिन गायकवाड (मालक - सह्याद्री डेमो)",
      phone: "9822012345",
      role: "owner",
      farmId: "farm-sahyadri-01",
    });
    setDailyRecords(generate90DaysDailyRecords());
    setCustomers(SEED_CUSTOMERS);
    setExpenses(SEED_EXPENSES);
    setEmployees(SEED_EMPLOYEES);
    setLoan(SEED_LOAN);
    setUnitSettings(DEFAULT_UNIT_SETTINGS);
    setAlerts([]);
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
        addCustomer,
        sales,
        addSale,
        recordPayment,
        marketRates,
        addMarketRate,
        vaccinations,
        toggleVaccinationStatus,
        suppliers,
        employees,
        addEmployee,
        deleteEmployee,
        loan,
        updateLoan,
        expenses,
        addExpense,
        deleteExpense,
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
