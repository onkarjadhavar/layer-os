'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';

// Layout Components
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar, NavTab } from '@/components/layout/Sidebar';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { QuickLogFAB } from '@/components/layout/QuickLogFAB';
import { MobileMoreDrawer } from '@/components/layout/MobileMoreDrawer';
import { NotificationsDrawer } from '@/components/layout/NotificationsDrawer';

// Entry Components
import { QuickEntryCard } from '@/components/entry/QuickEntryCard';
import { FullEntryModal } from '@/components/entry/FullEntryModal';

// Dashboard Components
import { KPIGrid } from '@/components/dashboard/KPIGrid';
import { ActionCard } from '@/components/dashboard/ActionCard';
import { EnvironmentTile } from '@/components/dashboard/EnvironmentTile';
import { TrendCharts } from '@/components/dashboard/TrendCharts';
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

import { Sparkles, MessageSquare, Zap } from 'lucide-react';

export default function LayerOSHomePage() {
  const { isAuthenticated, user } = useLayerOS();
  const { t } = useI18n();

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
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] dark:bg-[#0F1A15] transition-colors">
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
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-28 lg:pb-12 space-y-6">
          {/* Supervisor / Role Context Ribbon */}
          {user?.role === 'supervisor' && (
            <div className="p-3.5 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] border border-[#2D6B52]/30 flex items-center justify-between text-xs font-bold">
              <span className="text-[#1F4D3A] dark:text-[#3BA378]">
                👷 सुपरवायझर मोड: केवळ दैनंदिन नोंदी व कामकाजाचा ॲक्सेस उपलब्ध आहे.
              </span>
              <button
                onClick={() => setCurrentTab('quick-log')}
                className="underline hover:opacity-80"
              >
                नोंद सुरू करा →
              </button>
            </div>
          )}

          {/* TAB 1: HOME DASHBOARD */}
          {currentTab === 'home' && (
            <div className="space-y-6">
              {/* Today's Action Card */}
              <ActionCard
                onNavigateTab={tab => {
                  if (tab === 'full-entry') setShowFullEntryModal(true);
                  else setCurrentTab(tab as any);
                }}
              />

              {/* 30-Second Quick Entry Card (Placed Prominently) */}
              <QuickEntryCard
                onSuccessCloseDay={() => setShowDailyAdvisorModal(true)}
                onSwitchToFullEntry={() => setShowFullEntryModal(true)}
              />

              {/* High-Impact 12-Card KPI Grid with 3-Second Profit Banner */}
              <KPIGrid onDrillDown={handleKPISelect} />

              {/* Quick Actions Shortcuts */}
              <QuickActionGrid onSelectAction={handleQuickAction} />

              {/* Trends & Recharts Graphs */}
              <TrendCharts />

              {/* Shed Environment Tile */}
              <EnvironmentTile />
            </div>
          )}

          {/* TAB 2: QUICK LOG FOCUSED VIEW */}
          {currentTab === 'quick-log' && (
            <div className="space-y-6">
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

      {/* Floating Bottom AI Assistant Buttons */}
      <div className="fixed bottom-20 left-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setShowAskLayerOsModal(true)}
          className="bg-white dark:bg-[#16241D] text-[#1F4D3A] dark:text-[#3BA378] px-3.5 py-2.5 rounded-full shadow-xl border border-[#E7E2D6] dark:border-[#263B30] flex items-center gap-2 text-xs font-bold hover:scale-105 transition-transform"
        >
          <Sparkles className="w-4 h-4 text-[#D9A441]" />
          <span className="hidden sm:inline">LayerOS ला विचारा</span>
        </button>

        <button
          onClick={() => setShowDailyAdvisorModal(true)}
          className="bg-[#1F4D3A] text-white px-3.5 py-2.5 rounded-full shadow-xl border border-[#D9A441] flex items-center gap-1.5 text-xs font-bold hover:scale-105 transition-transform"
        >
          <Zap className="w-3.5 h-3.5 text-[#D9A441] fill-[#D9A441]" />
          <span>AI सल्लागार</span>
        </button>
      </div>

      {/* Floating "+ Quick Log" FAB for Mobile */}
      <QuickLogFAB
        onOpenQuickLog={() => {
          setCurrentTab('quick-log');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile Bottom Tab Bar */}
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
