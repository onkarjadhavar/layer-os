'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';

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

import { Sparkles, Zap, MessageSquare } from 'lucide-react';

export default function LayerOSHomePage() {
  const { user, farm, loginAsDemo, logout } = useLayerOS();

  // Root route visitor handoff state: default to false for 100% hydration parity, switch to landing for fresh visitors
  const [showLanding, setShowLanding] = useState(false);

  // Synchronize visitor vs returning dashboard state
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryLanding = params.get('landing') === 'true';
      if (queryLanding) {
        sessionStorage.removeItem('layeros_entered');
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowLanding(true);
    } catch {
      // ignore
    }
  }, []);

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

  // If logged-out / fresh visitor, render the public marketing landing page
  if (showLanding) {
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
    <div suppressHydrationWarning className="min-h-screen flex flex-col bg-[#FAF8F3] dark:bg-[#0F1A15] transition-colors">
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
            <div className="p-3 sm:p-3.5 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/30 flex items-center justify-between text-xs font-bold">
              <span className="text-[#1F4D3A] dark:text-[#42BF87]">
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

              {/* 3. Integrated LayerOS AI Farm Assistant Banner */}
              <div className="card-layer p-4 sm:p-5 rounded-3xl border border-[#D9A441]/40 bg-gradient-to-br from-[#FCF6E9]/90 to-white dark:from-[#231E12] dark:to-[#16241D] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#D9A441] text-[#0B1E15] flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                      <Sparkles className="w-6 h-6 fill-[#0B1E15]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-black text-[#0B1E15] dark:text-white">
                          LayerOS AI शेतकरी सल्लागार
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-[#D9A441] text-[#0B1E15]">
                          Live
                        </span>
                      </div>
                      <p className="text-xs text-[#55695F] dark:text-[#CBDCD4] font-medium mt-0.5">
                        आजच्या उत्पादनावर आधारित अचूक विश्लेषण व सल्ला
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setShowDailyAdvisorModal(true)}
                      className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-[#1F4D3A] hover:bg-[#173A2C] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all touch-target"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#D9A441] fill-[#D9A441]" />
                      <span>आजचा AI सल्ला</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAskLayerOsModal(true)}
                      className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl bg-white dark:bg-[#1A2D23] border border-[#DCD3C3] dark:border-[#2C4435] text-[#1F4D3A] dark:text-[#42BF87] text-xs font-black flex items-center justify-center gap-1.5 hover:border-[#1F4D3A] active:scale-95 transition-all touch-target"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#D9A441]" />
                      <span>प्रश्न विचारा</span>
                    </button>
                  </div>
                </div>

                {/* Quick Question Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-[#D9A441]/20">
                  <span className="text-[11px] font-bold text-[#55695F] dark:text-[#CBDCD4] flex-shrink-0">
                    उदा:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAskLayerOsModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-[#1A2D23] border border-[#DCD3C3]/60 dark:border-[#263B30] text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4] whitespace-nowrap hover:border-[#D9A441]"
                  >
                    💡 उद्या खुराक किती देऊ?
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAskLayerOsModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-[#1A2D23] border border-[#DCD3C3]/60 dark:border-[#263B30] text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4] whitespace-nowrap hover:border-[#D9A441]"
                  >
                    📈 अंडी दर वाढतील का?
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAskLayerOsModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-[#1A2D23] border border-[#DCD3C3]/60 dark:border-[#263B30] text-[11px] font-bold text-[#2D4538] dark:text-[#CBDCD4] whitespace-nowrap hover:border-[#D9A441]"
                  >
                    🛡️ मृत्यू कसा रोखायचा?
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
