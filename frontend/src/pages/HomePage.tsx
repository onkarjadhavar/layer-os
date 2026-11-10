import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { farmsService } from '@/services/farms.service';
import { Farm, Shed, Flock, DailyRecord, Sale, UserProfile } from '@/lib/store/seedData';
import { UnitSettings } from '@/lib/calc';

// Layout Components
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar, NavTab } from '@/components/layout/Sidebar';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { MobileMoreDrawer } from '@/components/layout/MobileMoreDrawer';
import { NotificationsDrawer } from '@/components/layout/NotificationsDrawer';

// Entry Components
import { QuickEntryCard } from '@/components/entry/QuickEntryCard';
import { FullEntryModal } from '@/components/entry/FullEntryModal';

// Dashboard Components
import { ReferenceDashboard } from '@/components/dashboard/ReferenceDashboard';
import { KPIGrid } from '@/components/dashboard/KPIGrid';
import { ActionCard } from '@/components/dashboard/ActionCard';
import { QuickActionGrid } from '@/components/dashboard/QuickActionGrid';

// Commercial & Deep Modules
import { SalesModule } from '@/components/sales/SalesModule';
import { MarketRatesModule } from '@/components/market/MarketRatesModule';
import { ExpensesModule } from '@/components/expenses/ExpensesModule';
import { HealthModule } from '@/components/health/HealthModule';
import { FlocksModule } from '@/components/flocks/FlocksModule';
import { ReportsModule } from '@/components/reports/ReportsModule';
import { PublicToolsModule } from '@/components/tools/PublicToolsModule';
import { SettingsModule } from '@/components/settings/SettingsModule';

// AI Modals
import { DailyAdvisorModal } from '@/components/ai/DailyAdvisorModal';
import { AskLayerOSModal } from '@/components/ai/AskLayerOSModal';
import { ForecastModule } from '@/components/ai/ForecastModule';

// Auth Modals
import { AuthModal } from '@/components/auth/AuthModal';
import { OnboardingModal } from '@/components/auth/OnboardingModal';
import { LandingPage } from '@/components/landing/LandingPage';
import { FarmStatusBlockedModal } from '@/components/auth/FarmStatusBlockedModal';
import { isFarmActive } from '@/lib/auth/farm-status';

import { Sparkles, Zap, MessageSquare, AlertCircle, Lightbulb, TrendingUp, Shield } from 'lucide-react';

export function HomePage() {
  const { farmId } = useParams<{ farmId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, farm, isDemoMode, setActiveFarmData, loginAsDemo, switchFarm, logout } = useLayerOS();
  const { t } = useI18n();

  // Root route visitor handoff state:
  // Root URL "/" opens the enrolled customer's dashboard if they have already enrolled,
  // or the public Landing Page if they are a fresh visitor or requested ?landing=true.
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const path = window.location.pathname;
    if (path.startsWith('/dashboard/')) return false;

    const params = new URLSearchParams(window.location.search);
    if (params.get('landing') === 'true') return true;
    if (params.get('demo') === 'true' || params.get('live') === 'true') return false;

    // Check if user is an enrolled customer with their own active farm:
    try {
      const saved = localStorage.getItem('layeros_app_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.isDemoMode && parsed.farm && parsed.farm.id !== 'farm-sahyadri-01' && parsed.farm.id !== 'farm-anand-02') {
          return false; // Open their personal enrolled Layer OS dashboard!
        }
      }
    } catch {}

    // Default to Landing Page on root "/" for fresh visitors
    return true;
  });

  const [isLoadingFarm, setIsLoadingFarm] = useState<boolean>(() => {
    if (!farmId) return false;
    if (farm && (farm.id === farmId || user?.farmId === farmId) && !isDemoMode) return false;
    try {
      const saved = localStorage.getItem('layeros_app_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.farm && (parsed.farm.id === farmId || parsed.user?.farmId === farmId)) return false;
      }
    } catch {}
    return false;
  });
  const [farmLoadError, setFarmLoadError] = useState<string | null>(null);

  // Synchronize visitor vs returning dashboard state
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const isDemoParam = params.get('demo') === 'true';
      const isLiveParam = params.get('live') === 'true';
      const isLandingParam = params.get('landing') === 'true';

      if (farmId) {
        if (farmId === 'farm-sahyadri-01' || farmId === 'farm-anand-02') {
          loginAsDemo();
          if (farmId === 'farm-anand-02') {
            switchFarm('farm-anand-02');
          }
        }
        setShowLanding(false);
        setFarmLoadError(null);
        setIsLoadingFarm(false);
        return;
      }

      if (isLandingParam) {
        setShowLanding(true);
        return;
      }

      // Explicit demo request: opens demo dashboard
      if (isDemoParam) {
        loginAsDemo();
        setShowLanding(false);
        setFarmLoadError(null);
        setIsLoadingFarm(false);
        return;
      }

      // Explicit live request: opens dashboard
      if (isLiveParam) {
        setShowLanding(false);
        setFarmLoadError(null);
        return;
      }

      // If user is an enrolled customer, keep their dashboard open:
      try {
        const saved = localStorage.getItem('layeros_app_state_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!parsed.isDemoMode && parsed.farm && parsed.farm.id !== 'farm-sahyadri-01' && parsed.farm.id !== 'farm-anand-02') {
            setShowLanding(false);
            return;
          }
        }
      } catch {}

      // Fresh visitors on root "/" see the Home Landing Page
      setShowLanding(true);
    } catch {
      setShowLanding(true);
    }
  }, [farmId, location.search]);

  const activeFarmId = farmId || (!showLanding ? (user?.farmId || farm.id) : null);

  // When a farm is specified or active, fetch live farm data from FastAPI
  useEffect(() => {
    if (!activeFarmId) return;

    // In demo mode, Sahyadri/Anand operate completely offline-first with pre-seeded fixtures:
    // Never make a FastAPI backend request or report network error for demo farms!
    if (isDemoMode || activeFarmId === 'farm-sahyadri-01' || activeFarmId === 'farm-anand-02') {
      setIsLoadingFarm(false);
      setFarmLoadError(null);
      return;
    }

    // Multi-tenant security check: Enrolled user can only access their own enrolled farm!
    if (user && !isDemoMode && user.farmId && farmId && user.farmId !== farmId) {
      setFarmLoadError('forbidden');
      setIsLoadingFarm(false);
      setShowLanding(false);
      return;
    }

    // Check if farm data is already active in local state or localStorage
    let isAlreadyLoaded = false;
    if (farm && (farm.id === activeFarmId || farm.id === farmId) && !isDemoMode) {
      isAlreadyLoaded = true;
    } else {
      try {
        const saved = localStorage.getItem('layeros_app_state_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.farm && (parsed.farm.id === activeFarmId || parsed.farm.id === farmId)) {
            setActiveFarmData({
              farm: parsed.farm,
              farms: parsed.farms || [parsed.farm],
              sheds: parsed.sheds || [],
              flocks: parsed.flocks || (parsed.flock ? [parsed.flock] : []),
              flock: parsed.flock || parsed.flocks?.[0],
              unitSettings: parsed.unitSettings,
              dailyRecords: parsed.dailyRecords || [],
              customers: parsed.customers || [],
              sales: parsed.sales || [],
              user: parsed.user,
            });
            isAlreadyLoaded = true;
          }
        }
      } catch {}
    }

    if (isAlreadyLoaded) {
      setIsLoadingFarm(false);
      setFarmLoadError(null);
      if (farmId) setShowLanding(false);
    }

    let isMounted = true;
    if (farmId) {
      setShowLanding(false);
    }

    farmsService
      .getFarmDashboard(activeFarmId)
      .then(data => {
        if (!isMounted) return;

        // Map backend response into Store models
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
          ageWeeks: f.age_weeks || 34,
          currentPhase: (f.current_phase as any) || 'laying',
        }));

        const unitSettingsModel: UnitSettings = data.unit_settings || data.farm.unit_settings || {
          traySizeEggs: 30,
          gattaSizeTrays: 7,
          cartonSizeTrays: 12,
          feedBagWeightKg: 50,
          defaultRateUnit: 'per_100',
        };

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
          otherCashExpenses: Number(r.other_cash_expenses ?? r.otherCashExpenses ?? 1600),
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

        const userModel: UserProfile = {
          id: `usr-${data.farm.id}`,
          name: `${data.farm.owner_name} (मालक)`,
          phone: data.farm.phone,
          role: 'owner',
          farmId: data.farm.id,
        };

        setActiveFarmData({
          farm: farmModel,
          sheds: shedsModel,
          flocks: flocksModel,
          unitSettings: unitSettingsModel,
          dailyRecords: dailyRecordsModel,
          sales: salesModel,
          user: userModel,
        });

        setIsLoadingFarm(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        const status = err?.response?.status || err?.status;
        if (status === 403) {
          setFarmLoadError('forbidden');
        } else if (status === 404 && !isAlreadyLoaded) {
          setFarmLoadError('not_found');
        } else {
          // If already loaded in local state (offline dev environment), gracefully keep running!
          if (isAlreadyLoaded || (farm && (farm.id === activeFarmId || farm.id === farmId))) {
            setIsLoadingFarm(false);
            setFarmLoadError(null);
            return;
          }
          setFarmLoadError(err?.message || 'फार्म माहिती आणण्यात त्रुटी आली.');
        }
        setIsLoadingFarm(false);
      });

    return () => {
      isMounted = false;
    };
  }, [farmId]);

  const handleLogin = () => {
    navigate('/login');
  };

  // Navigation State: synchronized synchronously with URL search params & sessionStorage so refresh never flashes 'home'
  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab') as NavTab;
      if (urlTab) return urlTab;
      const savedTab = sessionStorage.getItem('layeros_active_tab') as NavTab;
      if (savedTab) return savedTab;
    }
    return 'home';
  });

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('layeros_active_tab', tab);
      const url = new URL(window.location.href);
      if (tab === 'home') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Modals Open State
  const [showFullEntryModal, setShowFullEntryModal] = useState(false);
  const [showDailyAdvisorModal, setShowDailyAdvisorModal] = useState(false);
  const [showAskLayerOsModal, setShowAskLayerOsModal] = useState(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [showMobileMoreDrawer, setShowMobileMoreDrawer] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // If a specific farm was requested and is currently loading from PostgreSQL
  if (farmId && isLoadingFarm) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#0F1A15] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1F4D3A] text-white flex items-center justify-center text-3xl shadow-lg animate-bounce mb-4">
          🐔
        </div>
        <h2 className="text-xl font-black text-[#1B2A24] dark:text-white">
          फार्म डॅशबोर्ड लोड होत आहे...
        </h2>
        <p className="text-sm text-[#55695F] dark:text-[#CBDCD4] mt-1 max-w-sm">
          नोंदणीकृत पोल्ट्री फार्मचा खरा डेटा PostgreSQL मधून आणला जात आहे.
        </p>
      </div>
    );
  }

  // If farm was not found (404)
  if (farmId && farmLoadError === 'not_found') {
    return (
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#0F1A15] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center text-3xl shadow-sm mb-4 border border-amber-300 dark:border-amber-700">
          🔍
        </div>
        <h2 className="text-2xl font-black text-[#1B2A24] dark:text-white">
          फार्म सापडला नाही (Farm Not Found)
        </h2>
        <p className="text-sm text-[#55695F] dark:text-[#CBDCD4] mt-2 max-w-md">
          आयडी <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono text-xs">{farmId}</code> असणारा पोल्ट्री फार्म सिस्टीममध्ये उपलब्ध नाही किंवा काढला गेला आहे.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <Link
            to="/enroll"
            className="px-5 py-3 rounded-xl bg-[#1F4D3A] text-white text-sm font-bold shadow hover:bg-[#173A2C] transition-all"
          >
            नवीन फार्म नोंदणी करा →
          </Link>
          <Link
            to="/"
            className="px-5 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] text-sm font-bold text-[#1B2A24] dark:text-white hover:bg-gray-50 dark:hover:bg-[#1F2E26] transition-all"
          >
            {t.backToHome || 'Back to Home'}
          </Link>
        </div>
      </div>
    );
  }

  // If farm access is forbidden (403 - Multi-tenant security violation)
  if (farmId && farmLoadError === 'forbidden') {
    return (
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#0F1A15] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 flex items-center justify-center text-3xl shadow-sm mb-4 border border-red-300">
          🛡️
        </div>
        <h2 className="text-2xl font-black text-[#1B2A24] dark:text-white">
          सुरक्षा इशारा: प्रवेश नाकारला (Access Denied)
        </h2>
        <p className="text-sm text-[#55695F] dark:text-[#CBDCD4] mt-2 max-w-md">
          आपण केवळ आपल्या स्वतःच्या नोंदणीकृत पोल्ट्री फार्मचा डेटा पाहू शकता. सुरक्षिततेसाठी इतर कोणाच्याही फार्मच्या डेटामध्ये प्रवेश प्रतिबंधित आहे.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {user?.farmId && (
            <Link
              to={`/dashboard/farms/${user.farmId}`}
              className="px-5 py-3 rounded-xl bg-[#1F4D3A] text-white text-sm font-bold shadow hover:bg-[#173A2C] transition-all"
            >
              माझ्या फार्मवर जा →
            </Link>
          )}
          <button
            onClick={() => logout()}
            className="px-5 py-3 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] text-sm font-bold text-[#1B2A24] dark:text-white hover:bg-gray-50 dark:hover:bg-[#1F2E26] transition-all"
          >
            लॉगआउट करा
          </button>
        </div>
      </div>
    );
  }

  // If general loading error
  if (farmId && farmLoadError) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#0F1A15] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 flex items-center justify-center text-3xl shadow-sm mb-4 border border-red-300">
          ⚠️
        </div>
        <h2 className="text-2xl font-black text-[#1B2A24] dark:text-white">
          {t.error || 'Failed to load farm data'}
        </h2>
        <p className="text-sm text-[#55695F] dark:text-[#CBDCD4] mt-2 max-w-md">
          {farmLoadError}
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-3 rounded-xl bg-[#1F4D3A] text-white text-sm font-bold shadow hover:bg-[#173A2C] transition-all cursor-pointer"
          >
            {t.refresh || 'Retry'}
          </button>
          <Link
            to="/"
            className="px-5 py-3 rounded-xl border border-[#DCD3C3] text-sm font-bold text-[#1B2A24] dark:text-white hover:bg-gray-50 transition-all"
          >
            {t.navHome || 'Home'}
          </Link>
        </div>
      </div>
    );
  }

  // If logged-out / fresh visitor on root without a farmId, render public landing page
  if (showLanding && !farmId) {
    return <LandingPage onLogin={handleLogin} />;
  }

  // Central Farm Status Enforcement:
  // If the farm account is pending approval, suspended, rejected or cancelled,
  // block app navigation and render the friendly localized status modal
  if (farm?.status && !isFarmActive(farm.status)) {
    return (
      <FarmStatusBlockedModal
        farmName={farm.name}
        status={farm.status}
        reason={farm.statusReason}
        onLogout={() => {
          logout();
          setShowLanding(true);
        }}
      />
    );
  }

  // Quick Action Navigator
  const handleQuickAction = (key: string) => {
    if (key === 'quick-log') {
      handleSelectTab('quick-log');
    } else if (key === 'sales') {
      handleSelectTab('sales');
    } else if (key === 'expenses') {
      handleSelectTab('expenses');
    } else if (key === 'health') {
      handleSelectTab('health');
    } else if (key === 'market-rates') {
      handleSelectTab('market-rates');
    } else if (key === 'mortality') {
      setShowFullEntryModal(true);
    } else if (key === 'feed') {
      setShowFullEntryModal(true);
    } else if (key === 'reports') {
      handleSelectTab('reports');
    }
  };

  const handleKPISelect = (kpiKey: string) => {
    if (kpiKey === 'birds' || kpiKey === 'production') handleSelectTab('flocks');
    else if (kpiKey === 'sales' || kpiKey === 'receivables') handleSelectTab('sales');
    else if (kpiKey === 'expenses' || kpiKey === 'accounts') handleSelectTab('expenses');
    else if (kpiKey === 'breakeven') handleSelectTab('forecast');
    else if (kpiKey === 'mortality') handleSelectTab('health');
    else if (kpiKey === 'feed') setShowFullEntryModal(true);
    else handleSelectTab('quick-log');
  };

  return (
    <div className="min-h-screen flex bg-[#FFF9ED] dark:bg-[#0B130E] text-[#211F18] transition-colors overflow-x-hidden">
      {/* Desktop Full-Height Forest-Green Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab === 'full-entry') {
            setShowFullEntryModal(true);
          } else {
            handleSelectTab(tab);
          }
        }}
        onOpenHelp={() => setShowAskLayerOsModal(true)}
        onOpenAbout={() => setShowDailyAdvisorModal(true)}
      />

      {/* Main Workspace Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FFF9ED] dark:bg-[#0B130E] min-h-screen">
        {/* Render TopBar when inside an internal module for easy navigation */}
        {currentTab !== 'home' && (
          <TopBar
            onOpenNotifications={() => setShowNotificationsDrawer(true)}
            currentTab={currentTab}
            onSelectTab={tab => handleSelectTab(tab)}
          />
        )}

        {/* Main Workspace Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-7 xl:p-8 max-w-6xl mx-auto w-full pb-20 lg:pb-12 space-y-4 sm:space-y-6">
          {/* Supervisor / Role Context Ribbon */}
          {user?.role === 'supervisor' && (
            <div className="p-3 sm:p-3.5 rounded-2xl bg-[#E8F1C9] text-[#173F20] dark:bg-[#1A3024] dark:text-[#E8F1C9] border border-[#173F20]/20 flex items-center justify-between text-xs font-bold">
              <span>
                👷 सुपरवायझर मोड: केवळ दैनंदिन नोंदी व कामकाजाचा ॲक्सेस उपलब्ध आहे.
              </span>
              <button
                type="button"
                onClick={() => handleSelectTab('quick-log')}
                className="underline hover:opacity-80 touch-target flex items-center cursor-pointer"
              >
                नोंद सुरू करा →
              </button>
            </div>
          )}

          {/* TAB 1: EXACT REFERENCE-MATCH DASHBOARD */}
          {currentTab === 'home' && (
            <ReferenceDashboard
              onSelectTab={tab => {
                if (tab === 'full-entry') setShowFullEntryModal(true);
                else handleSelectTab(tab);
              }}
              onOpenNotifications={() => setShowNotificationsDrawer(true)}
              onOpenHelp={() => setShowAskLayerOsModal(true)}
              onOpenAbout={() => setShowDailyAdvisorModal(true)}
            />
          )}

          {/* TAB 2: FARM ENTRY (Quick Log + Full Entry Modal option) */}
          {currentTab === 'quick-log' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#47532B]/15">
                <button
                  type="button"
                  onClick={() => handleSelectTab('home')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F1C9] text-[#173F20] text-xs font-bold hover:bg-[#d8e4b1] transition-colors cursor-pointer"
                >
                  ← {t.navHome || 'Dashboard'}
                </button>
                <h2 className="text-base font-bold text-[#211F18] dark:text-white">
                  {t.navQuickLog || 'Farm Entry'}
                </h2>
              </div>
              <QuickEntryCard
                onSuccessCloseDay={() => setShowDailyAdvisorModal(true)}
                onSwitchToFullEntry={() => setShowFullEntryModal(true)}
              />
            </div>
          )}

          {/* TAB 3: FLOCKS & BATCHES (Feed Management & Farm Info) */}
          {currentTab === 'flocks' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSelectTab('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F1C9] text-[#173F20] text-xs font-bold hover:bg-[#d8e4b1] transition-colors cursor-pointer"
              >
                ← {t.navHome || 'Dashboard'}
              </button>
              <FlocksModule />
            </div>
          )}

          {/* TAB 4: SALES & RECEIVABLES */}
          {currentTab === 'sales' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSelectTab('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F1C9] text-[#173F20] text-xs font-bold hover:bg-[#d8e4b1] transition-colors cursor-pointer"
              >
                ← {t.navHome || 'Dashboard'}
              </button>
              <SalesModule />
            </div>
          )}

          {/* TAB 5: EXPENSES & OVERHEADS */}
          {currentTab === 'expenses' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSelectTab('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F1C9] text-[#173F20] text-xs font-bold hover:bg-[#d8e4b1] transition-colors cursor-pointer"
              >
                ← {t.navHome || 'Dashboard'}
              </button>
              <ExpensesModule />
            </div>
          )}

          {/* TAB 6: VACCINES & HEALTH */}
          {currentTab === 'health' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSelectTab('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F1C9] text-[#173F20] text-xs font-bold hover:bg-[#d8e4b1] transition-colors cursor-pointer"
              >
                ← {t.navHome || 'Dashboard'}
              </button>
              <HealthModule />
            </div>
          )}

          {/* TAB 7: MANDI MARKET RATES (Internal route preserved, not on dashboard) */}
          {currentTab === 'market-rates' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSelectTab('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F1C9] text-[#173F20] text-xs font-bold hover:bg-[#d8e4b1] transition-colors cursor-pointer"
              >
                ← {t.navHome || 'Dashboard'}
              </button>
              <MarketRatesModule />
            </div>
          )}

          {/* TAB 8: AI 30-DAY FORECAST & SCENARIOS */}
          {currentTab === 'forecast' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSelectTab('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F1C9] text-[#173F20] text-xs font-bold hover:bg-[#d8e4b1] transition-colors cursor-pointer"
              >
                ← {t.navHome || 'Dashboard'}
              </button>
              <ForecastModule />
            </div>
          )}

          {/* TAB 9: REPORTS & EXPORTS */}
          {currentTab === 'reports' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSelectTab('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F1C9] text-[#173F20] text-xs font-bold hover:bg-[#d8e4b1] transition-colors cursor-pointer"
              >
                ← {t.navHome || 'Dashboard'}
              </button>
              <ReportsModule />
            </div>
          )}

          {/* TAB 10: FREE PUBLIC CALCULATORS */}
          {currentTab === 'public-tools' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSelectTab('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F1C9] text-[#173F20] text-xs font-bold hover:bg-[#d8e4b1] transition-colors cursor-pointer"
              >
                ← {t.navHome || 'Dashboard'}
              </button>
              <PublicToolsModule />
            </div>
          )}

          {/* TAB 11: SETTINGS & UNITS */}
          {currentTab === 'settings' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSelectTab('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F1C9] text-[#173F20] text-xs font-bold hover:bg-[#d8e4b1] transition-colors cursor-pointer"
              >
                ← {t.navHome || 'Dashboard'}
              </button>
              <SettingsModule />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar (shown when inside an internal module for fast thumb switching) */}
      {currentTab !== 'home' && (
        <MobileTabBar
          currentTab={currentTab}
          onSelectTab={tab => {
            if (tab === 'full-entry') {
              setShowFullEntryModal(true);
            } else {
              handleSelectTab(tab);
            }
          }}
          onOpenMoreMenu={() => setShowMobileMoreDrawer(true)}
        />
      )}

      {/* MODALS & DRAWERS */}
      <FullEntryModal
        isOpen={showFullEntryModal}
        onClose={() => setShowFullEntryModal(false)}
        onSuccess={() => setShowDailyAdvisorModal(true)}
      />

      <DailyAdvisorModal
        isOpen={showDailyAdvisorModal}
        onClose={() => setShowDailyAdvisorModal(false)}
      />

      <AskLayerOSModal
        isOpen={showAskLayerOsModal}
        onClose={() => setShowAskLayerOsModal(false)}
      />

      <NotificationsDrawer
        isOpen={showNotificationsDrawer}
        onClose={() => setShowNotificationsDrawer(false)}
        onNavigateToTab={tab => handleSelectTab(tab)}
      />

      <MobileMoreDrawer
        isOpen={showMobileMoreDrawer}
        onClose={() => setShowMobileMoreDrawer(false)}
        onSelectTab={tab => {
          if (tab === 'full-entry') {
            setShowFullEntryModal(true);
          } else {
            handleSelectTab(tab);
          }
        }}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
      />

      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onCompleted={() => handleSelectTab('home')}
      />
    </div>
  );
}
export default HomePage;
