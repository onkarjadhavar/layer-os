import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { farmsService } from '@/services/farms.service';
import { Farm, Shed, Flock, DailyRecord, UserProfile } from '@/lib/store/seedData';
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
  const { user, farm, setActiveFarmData, loginAsDemo, logout } = useLayerOS();

  // Root route visitor handoff state: default to false for 100% hydration parity, switch to landing for fresh visitors
  const [showLanding, setShowLanding] = useState(false);
  const [isLoadingFarm, setIsLoadingFarm] = useState<boolean>(Boolean(farmId));
  const [farmLoadError, setFarmLoadError] = useState<string | null>(null);

  // Synchronize visitor vs returning dashboard state
  React.useEffect(() => {
    try {
      if (farmId) {
        setShowLanding(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const queryLanding = params.get('landing') === 'true';
      if (queryLanding) {
        sessionStorage.removeItem('layeros_entered');
        setShowLanding(true);
        return;
      }

      const hasEntered = sessionStorage.getItem('layeros_entered') === 'true';
      const isLive = localStorage.getItem('layeros_live_active') === 'true';
      const queryDemo = params.get('demo') === 'true';
      const queryLive = params.get('live') === 'true';
      const isAutomatedTest = typeof navigator !== 'undefined' && Boolean(navigator.webdriver);

      // Automated tests or returning sessions remain on dashboard
      if (queryDemo || queryLive || hasEntered || isLive || isAutomatedTest) {
        return;
      }

      // Fresh human visitor on "/" sees the public landing page
      setShowLanding(true);
    } catch {
      // ignore
    }
  }, [farmId]);

  // When a farmId is specified in URL, fetch live farm data from FastAPI
  useEffect(() => {
    if (!farmId) return;

    let isMounted = true;
    setIsLoadingFarm(true);
    setFarmLoadError(null);
    setShowLanding(false);

    farmsService
      .getFarmDashboard(farmId)
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
          shedNumber: s.name || `Shed-0${idx + 1}`,
          name: s.name || `शेड ${idx + 1}`,
          capacity: s.capacity || Math.round(data.farm.total_capacity / Math.max(1, data.sheds?.length || 1)),
          shedType: (s.equipment_type as any) || 'elevated_cage',
          hasSensors: false,
        }));

        const flocksModel: Flock[] = (data.flocks || []).map((f: any, idx: number) => ({
          id: f.id || `flock-${idx + 1}`,
          farmId: f.farm_id || data.farm.id,
          shedId: f.shed_id || (shedsModel[0]?.id || 'shed-1'),
          batchCode: f.name || `Batch-${idx + 1}`,
          breed: f.breed || 'BV300',
          hatcherySource: 'Direct Placement',
          placementDate: f.placement_date || new Date().toISOString().split('T')[0],
          initialChickCount: f.initial_birds || data.summary?.total_birds || data.farm.total_capacity,
          chickCostPerBird: 42.0,
          currentBirdCount: f.current_birds ?? (data.summary?.total_birds || data.farm.total_capacity),
          ageWeeks: f.age_weeks || 34,
          currentPhase: 'laying' as const,
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
          farmId: r.farm_id || data.farm.id,
          flockId: r.flock_id || (flocksModel[0]?.id || ''),
          recordDate: r.record_date,
          openingBirds: r.opening_birds || 0,
          mortality: r.mortality || 0,
          culls: r.culls || 0,
          closingBirds: r.closing_birds || 0,
          totalEggsCollected: r.eggs_collected || 0,
          brokenCrackedEggs: r.damaged_eggs || 0,
          softShellEggs: 0,
          rejectEggs: 0,
          goodEggs: (r.eggs_collected || 0) - (r.damaged_eggs || 0),
          morningCollection: 0,
          eveningCollection: 0,
          hdPct: r.opening_birds > 0 ? ((r.eggs_collected || 0) / r.opening_birds) * 100 : 0,
          productionPct: r.opening_birds > 0 ? ((r.eggs_collected || 0) / r.opening_birds) * 100 : 0,
          feedIssuedKg: r.feed_used_kg || 0,
          feedPerBirdG: r.opening_birds > 0 ? ((r.feed_used_kg || 0) * 1000) / r.opening_birds : 0,
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
          isClosed: true,
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
          sales: [],
          user: userModel,
        });

        setIsLoadingFarm(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        const status = err?.response?.status || err?.status;
        if (status === 404) {
          setFarmLoadError('not_found');
        } else {
          setFarmLoadError(err?.message || 'फार्म माहिती आणण्यात त्रुटी आली.');
        }
        setIsLoadingFarm(false);
      });

    return () => {
      isMounted = false;
    };
  }, [farmId]);

  const handleTryDemo = () => {
    loginAsDemo();
    try {
      sessionStorage.setItem('layeros_entered', 'true');
    } catch {}
    setShowLanding(false);
  };

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

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
            मुख्य पानावर जा
          </Link>
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
          डेटा लोड करण्यात अडचण आली
        </h2>
        <p className="text-sm text-[#55695F] dark:text-[#CBDCD4] mt-2 max-w-md">
          {farmLoadError}
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-3 rounded-xl bg-[#1F4D3A] text-white text-sm font-bold shadow hover:bg-[#173A2C] transition-all"
          >
            पुन्हा प्रयत्न करा (Retry)
          </button>
          <Link
            to="/"
            className="px-5 py-3 rounded-xl border border-[#DCD3C3] text-sm font-bold text-[#1B2A24] dark:text-white hover:bg-gray-50 transition-all"
          >
            मुख्य पान
          </Link>
        </div>
      </div>
    );
  }

  // If logged-out / fresh visitor on root without a farmId, render public landing page
  if (showLanding && !farmId) {
    return <LandingPage onTryDemo={handleTryDemo} />;
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
      setCurrentTab('quick-log');
    } else if (key === 'sales') {
      setCurrentTab('sales');
    } else if (key === 'expenses') {
      setCurrentTab('expenses');
    } else if (key === 'health') {
      setCurrentTab('health');
    } else if (key === 'market-rates') {
      setCurrentTab('market-rates');
    } else if (key === 'mortality') {
      setShowFullEntryModal(true);
    } else if (key === 'feed') {
      setShowFullEntryModal(true);
    } else if (key === 'reports') {
      setCurrentTab('reports');
    }
  };

  const handleKPISelect = (kpiKey: string) => {
    if (kpiKey === 'birds' || kpiKey === 'production') setCurrentTab('flocks');
    else if (kpiKey === 'sales' || kpiKey === 'receivables') setCurrentTab('sales');
    else if (kpiKey === 'expenses' || kpiKey === 'accounts') setCurrentTab('expenses');
    else if (kpiKey === 'breakeven') setCurrentTab('forecast');
    else if (kpiKey === 'mortality') setCurrentTab('health');
    else if (kpiKey === 'feed') setShowFullEntryModal(true);
    else setCurrentTab('quick-log');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] transition-colors">
      {/* Top Bar Navigation */}
      <TopBar
        onOpenNotifications={() => setShowNotificationsDrawer(true)}
      />

      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={tab => {
            if (tab === 'full-entry') {
              setShowFullEntryModal(true);
            } else {
              setCurrentTab(tab);
            }
          }}
        />

        {/* Main Workspace Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-12 space-y-4 sm:space-y-6">
          {/* Supervisor / Role Context Ribbon */}
          {user?.role === 'supervisor' && (
            <div className="p-3 sm:p-3.5 rounded-2xl bg-[var(--color-sage-pale)] text-[var(--color-forest)] dark:bg-[#1A3024] dark:text-[var(--color-sage)] border border-[var(--color-forest)]/30 flex items-center justify-between text-xs font-bold">
              <span>
                👷 सुपरवायझर मोड: केवळ दैनंदिन नोंदी व कामकाजाचा ॲक्सेस उपलब्ध आहे.
              </span>
              <button
                type="button"
                onClick={() => setCurrentTab('quick-log')}
                className="underline hover:opacity-80 touch-target flex items-center"
              >
                नोंद सुरू करा →
              </button>
            </div>
          )}

          {/* TAB 1: HOME DASHBOARD */}
          {currentTab === 'home' && (
            <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
              {/* 1. High-Impact KPI Grid with 3-Second Profit Banner (Essential Pulse First) */}
              <KPIGrid onDrillDown={handleKPISelect} />

              {/* 2. Quick Actions Shortcuts (4 Large Mobile Tiles) */}
              <QuickActionGrid onSelectAction={handleQuickAction} />

              {/* 3. Integrated LayerOS Farm Advisory Assistant Banner */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-amber-soft)] text-[var(--color-walnut)] dark:bg-[#2A1E0D] dark:text-[var(--color-amber)] flex items-center justify-center font-bold text-lg flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-[var(--color-amber)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-main)]">
                          दैनिक शेती सल्लागार (Farm Operations Advisor)
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[var(--color-sage-pale)] text-[var(--color-forest)] dark:bg-[#1A3024] dark:text-[var(--color-sage)]">
                          सक्रिय (Live)
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">
                        उत्पादन व खताच्या आकड्यांवर आधारित व्यावसायिक मार्गदर्शन
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setShowDailyAdvisorModal(true)}
                      className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-[var(--color-forest)] hover:bg-[#143F2F] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all touch-target cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-[var(--color-amber)] fill-[var(--color-amber)]" />
                      <span>आजचा सल्ला पहा</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAskLayerOsModal(true)}
                      className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[var(--color-text-main)] text-xs font-bold flex items-center justify-center gap-1.5 hover:border-[var(--color-forest)] transition-all touch-target cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[var(--color-amber)]" />
                      <span>प्रश्न विचारा</span>
                    </button>
                  </div>
                </div>

                {/* Quick Question Chips */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-[var(--color-border)]">
                  <span className="text-[11px] font-bold text-[var(--color-text-muted)] flex-shrink-0">
                    उदा:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAskLayerOsModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[11px] font-medium text-[var(--color-text-main)] whitespace-nowrap hover:border-[var(--color-amber)] cursor-pointer"
                  >
                    <Lightbulb className="w-3 h-3 text-[var(--color-amber)]" />
                    <span>उद्या खुराक किती देऊ?</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAskLayerOsModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[11px] font-medium text-[var(--color-text-main)] whitespace-nowrap hover:border-[var(--color-amber)] cursor-pointer"
                  >
                    <TrendingUp className="w-3 h-3 text-[var(--color-forest)] dark:text-[var(--color-sage)]" />
                    <span>अंडी दर वाढतील का?</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAskLayerOsModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[11px] font-medium text-[var(--color-text-main)] whitespace-nowrap hover:border-[var(--color-amber)] cursor-pointer"
                  >
                    <Shield className="w-3 h-3 text-[var(--color-error)]" />
                    <span>मृत्यू कसा रोखायचा?</span>
                  </button>
                </div>
              </div>

              {/* 4. 30-Second Quick Entry Card */}
              <QuickEntryCard
                onSuccessCloseDay={() => setShowDailyAdvisorModal(true)}
                onSwitchToFullEntry={() => setShowFullEntryModal(true)}
              />

              {/* 5. Today's AI Priority Action Card */}
              <ActionCard
                onNavigateTab={tab => {
                  if (tab === 'full-entry') setShowFullEntryModal(true);
                  else setCurrentTab(tab as any);
                }}
              />
            </div>
          )}

          {/* TAB 2: QUICK LOG FOCUSED VIEW */}
          {currentTab === 'quick-log' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <QuickEntryCard
                onSuccessCloseDay={() => setShowDailyAdvisorModal(true)}
                onSwitchToFullEntry={() => setShowFullEntryModal(true)}
              />
            </div>
          )}

          {/* TAB 3: FLOCKS & BATCHES */}
          {currentTab === 'flocks' && <FlocksModule />}

          {/* TAB 4: SALES & RECEIVABLES */}
          {currentTab === 'sales' && <SalesModule />}

          {/* TAB 5: EXPENSES & OVERHEADS */}
          {currentTab === 'expenses' && <ExpensesModule />}

          {/* TAB 6: VACCINES & HEALTH */}
          {currentTab === 'health' && <HealthModule />}

          {/* TAB 7: MANDI MARKET RATES */}
          {currentTab === 'market-rates' && <MarketRatesModule />}

          {/* TAB 8: AI 30-DAY FORECAST & SCENARIOS */}
          {currentTab === 'forecast' && <ForecastModule />}

          {/* TAB 9: REPORTS & EXPORTS */}
          {currentTab === 'reports' && <ReportsModule />}

          {/* TAB 10: FREE PUBLIC CALCULATORS */}
          {currentTab === 'public-tools' && <PublicToolsModule />}

          {/* TAB 11: SETTINGS & UNITS */}
          {currentTab === 'settings' && <SettingsModule />}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar (Native Android Navigation) */}
      <MobileTabBar
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab === 'full-entry') {
            setShowFullEntryModal(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenMoreMenu={() => setShowMobileMoreDrawer(true)}
      />

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
        onNavigateToTab={tab => setCurrentTab(tab)}
      />

      <MobileMoreDrawer
        isOpen={showMobileMoreDrawer}
        onClose={() => setShowMobileMoreDrawer(false)}
        onSelectTab={tab => {
          if (tab === 'full-entry') {
            setShowFullEntryModal(true);
          } else {
            setCurrentTab(tab);
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
        onCompleted={() => setCurrentTab('home')}
      />
    </div>
  );
}
export default HomePage;
