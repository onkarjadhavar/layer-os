/**
 * LayerOS Translations
 * Marathi-first, English, Hindi dictionaries with authentic commercial poultry farming terminology.
 */

export type Language = 'mr' | 'en' | 'hi';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  tryDemo: string;
  loginTitle: string;
  loginSubtitle: string;
  phonePlaceholder: string;
  sendOtp: string;
  enterOtp: string;
  verifyOtp: string;
  resendOtp: string;
  orContinueWith: string;
  demoModeNotice: string;
  resetDemoData: string;

  // TopBar & Header
  switchFarm: string;
  selectFarmTitle: string;
  addNewFarm: string;
  switchRole: string;
  switchRoleTitle: string;
  lightMode: string;
  darkMode: string;
  themeLight: string;
  themeDark: string;
  notifications: string;
  alertsTitle: string;
  demoBadge: string;
  postgresLive: string;
  localMode: string;
  birds: string;
  weeks: string;

  // Navigation
  navHome: string;
  navQuickLog: string;
  navFlocks: string;
  navSales: string;
  navExpenses: string;
  navHealth: string;
  navMarketRates: string;
  navForecast: string;
  navReports: string;
  navPublicTools: string;
  navSettings: string;
  navMore: string;

  // Roles
  roleOwner: string;
  roleManager: string;
  roleSupervisor: string;
  roleAccountant: string;
  roleViewer: string;

  // Dashboard Financial Banner & KPIs
  financialDecisionTitle: string;
  safeProfitStatusMsg: string;
  tightMarginWarningMsg: string;
  breakEvenRateLabel: string;
  sellingRateLabel: string;
  profitMarginLabel: string;
  dailyOperatingCashProfit: string;
  dailyTrueNetProfit: string;
  activeBirds: string;
  birdsLostToday: string;
  eggsToday: string;
  hdPercentage: string;
  productionPercentage: string;
  feedUsed: string;
  feedPerBird: string;
  feedRecommendedTomorrow: string;
  mortality: string;
  mortalityRate: string;
  eggStock: string;
  breakEvenPrice: string;
  costPerEgg: string;
  sellingRate: string;
  todayMarketRate: string;
  fcrDozenLabel: string;
  targetHdLabel: string;
  birdsDeadToday: string;
  ageWeeksLabel: string;
  vsYesterday: string;
  standardLabel: string;
  targetFeedGrams: string;
  withinDailyLimit: string;
  revenueBreakdownHint: string;
  feedRatePerKgHint: string;
  bankAndCashSplit: string;
  overdueDaysHint: string;

  // Environment & Climate Automation
  climateAutomationTitle: string;
  iotSensorsConnected: string;
  maxTempLabel: string;
  minTempLabel: string;
  humidityLabel: string;
  humidityNormal: string;
  ammoniaLabel: string;
  ammoniaSafe: string;
  lightingScheduleLabel: string;
  lightingHours: string;
  lightingTimeRange: string;
  exhaustFansLabel: string;
  fansRunning: string;
  fansOff: string;
  turnOn: string;
  turnOff: string;
  heaterLabel: string;
  heaterActive: string;

  // Breed Standard & Tabs
  breedStandardChart: string;
  batchPLTab: string;

  // Financial
  revenueToday: string;
  feedCostToday: string;
  operatingProfit: string;
  trueProfit: string;
  simpleProfit: string;
  cashBalance: string;
  outstandingReceivables: string;
  profitStatusSafe: string;
  profitStatusWarning: string;
  profitStatusLoss: string;

  // Quick Log
  quickLogTitle: string;
  quickLogSubtitle: string;
  eggsCollectedLabel: string;
  feedUsedLabel: string;
  mortalityLabel: string;
  saleQtyLabel: string;
  saleRateLabel: string;
  saveAndCloseDay: string;
  saving: string;
  dayClosedSuccess: string;
  yesterdayHint: string;

  // Full Entry
  fullEntryTitle: string;
  sectionBirds: string;
  sectionEggs: string;
  sectionFeed: string;
  sectionHealth: string;
  sectionEnvironment: string;
  sectionSales: string;
  sectionExpenses: string;

  // Flocks & Batches
  flocksAndBatches: string;
  activeBatch: string;
  newBatch: string;
  newShed: string;
  selectBatch: string;
  batchOverview: string;
  breedStandards: string;
  batchPL: string;
  initialChicks: string;
  chickCost: string;
  cumulativeMortality: string;
  livability: string;
  hatcherySource: string;
  placementDate: string;
  shedDistribution: string;
  birdCapacity: string;
  cageMethod: string;
  sensorsActive: string;
  phaseChange: string;
  cullBatch: string;
  closeBatchConfirm: string;

  // Sales & Customers
  salesList: string;
  newSale: string;
  customerLedger: string;
  agingReport: string;
  invoiceNumber: string;
  vehicleNumber: string;
  driverName: string;
  grossAmount: string;
  discount: string;
  netAmount: string;
  paidAmount: string;
  paymentStatus: string;
  paidStatusPaid: string;
  paidStatusPartial: string;
  paidStatusPending: string;
  recordPayment: string;

  // Expenses & Feed Inventory
  feedStock: string;
  feedTypes: string;
  reorderAlert: string;
  dailyExpenseEntry: string;
  labourCost: string;
  electricityCost: string;
  medicineCost: string;

  // Public Tools / Calculators
  toolsTitle: string;
  unitConverter: string;
  breakEvenCalc: string;
  fcrCalc: string;

  // Settings & Team
  teamMembers: string;
  inviteStaff: string;
  deactivateMember: string;

  // SaaS Billing & Subscriptions (Phase 6)
  billingAndPlans: string;
  currentPlan: string;
  upgradePlan: string;
  planActiveStatus: string;
  planTrialStatus: string;
  birdCapacityUsage: string;
  shedCapacityUsage: string;
  staffCapacityUsage: string;
  invoicesAndReceipts: string;
  monthlyBilling: string;
  yearlyBilling: string;
  saveAnnualDiscount: string;
  paymentSuccess: string;
  upgradeNow: string;
  manageSubscription: string;
  planLimitsHeader: string;

  // Egg Units
  unitEgg: string;
  unitPer100: string;
  unitTray: string;
  unitGatta: string;
  unitCarton: string;

  // AI & Advice
  aiAdvisorTitle: string;
  todaysActionTitle: string;
  aiActionPrioritySubtitle: string;
  aiPriorityBadge: string;
  smartAlertsTitle: string;
  askLayerOs: string;
  askPlaceholder: string;
  forecast30Days: string;
  whatIfSimulator: string;

  // Common
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  search: string;
  filter: string;
  exportPdf: string;
  exportExcel: string;
  shareWhatsApp: string;
  date: string;
  customer: string;
  amount: string;
  status: string;

  // Landing Page & Enrollment Additions
  landingEnrollBtn: string;
  landingLoginBtn: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroEnrollCta: string;
  heroAlreadyRegistered: string;
  heroTryDemo: string;
  whatIsTitle: string;
  whatIsDesc: string;
  whoIsTitle: string;
  whoOwner: string;
  whoOwnerDesc: string;
  whoSupervisor: string;
  whoSupervisorDesc: string;
  whoAccountant: string;
  whoAccountantDesc: string;
  whoVet: string;
  whoVetDesc: string;
  whatYouEnterTitle: string;
  whatYouEnterSubtitle: string;
  enterEggs: string;
  enterEggsDesc: string;
  enterMortality: string;
  enterMortalityDesc: string;
  enterFeed: string;
  enterFeedDesc: string;
  enterSales: string;
  enterSalesDesc: string;
  enterExpenses: string;
  enterExpensesDesc: string;
  whatYouGetTitle: string;
  getHd: string;
  getFeedPerBird: string;
  getBreakEven: string;
  getBreakEvenDesc: string;
  getTrueProfit: string;
  getTrueProfitDesc: string;
  getFeedForecast: string;
  getAiAdvice: string;
  getAiAdviceDesc: string;
  getMandiTrends: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  samplePreviewTitle: string;
  samplePreviewBadge: string;
  sampleNote: string;
  featuresGridTitle: string;
  featMarathiFirst: string;
  featMarathiFirstDesc: string;
  featOffline: string;
  featOfflineDesc: string;
  featMultiRole: string;
  featMultiRoleDesc: string;
  featDataPrivate: string;
  featDataPrivateDesc: string;
  featAiAdvisor: string;
  featAiAdvisorDesc: string;
  featPdfReports: string;
  featPdfReportsDesc: string;
  trustTitle: string;
  trustDesc: string;
  trustAiDisclaimer: string;
  pricingTitle: string;
  pricingSubtitle: string;
  startFreeTrial: string;
  enrollNow: string;
  faqTitle: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
  faqQ3: string;
  faqA3: string;
  faqQ4: string;
  faqA4: string;
  faqQ5: string;
  faqA5: string;
  faqQ6: string;
  faqA6: string;
  faqQ7: string;
  faqA7: string;
  enrollTitle: string;
  enrollStep1: string;
  enrollStep2: string;
  enrollStep3: string;
  enrollStep4: string;
  enrollStep5: string;
  enrollStep6: string;
  enrollStep7: string;
  fullNameLabel: string;
  mobileLabel: string;
  emailLabel: string;
  passwordLabel: string;
  acceptTermsLabel: string;
  farmNameLabel: string;
  villageLabel: string;
  talukaLabel: string;
  districtLabel: string;
  stateLabel: string;
  pincodeLabel: string;
  preferredLangLabel: string;
  numberOfShedsLabel: string;
  batchCodeLabel: string;
  breedLabel: string;
  birdsPlacedLabel: string;
  currentBirdsLabel: string;
  enrollAgeWeeksLabel: string;
  housingTypeLabel: string;
  addFlockBtn: string;
  removeFlockBtn: string;
  feedBagsPerDayLabel: string;
  feedPricePerKgLabel: string;
  bagSizeKgLabel: string;
  feedSupplierLabel: string;
  planningHorizonLabel: string;
  expectedFeedStockLabel: string;
  traySizeLabel: string;
  traysPerGattaLabel: string;
  sellingPricePerEggLabel: string;
  mainBuyerTypeLabel: string;
  nearestMandiLabel: string;
  monthlyLabourLabel: string;
  monthlyMedicineLabel: string;
  monthlyElectricityLabel: string;
  monthlyOtherLabel: string;
  monthlyLoanEmiLabel: string;
  numberOfEmployeesLabel: string;
  createMyLayerOSBtn: string;
  savingEnrollment: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  nextAction1: string;
  nextAction2: string;
  nextAction3: string;
  goToDashboardBtn: string;

  // Homepage Return Button
  backToHome: string;

  // Farm Status Enforcement
  statusPendingApprovalTitle: string;
  statusPendingApprovalDesc: string;
  statusSuspendedTitle: string;
  statusSuspendedDesc: string;
  statusRejectedTitle: string;
  statusRejectedDesc: string;
  statusCancelledTitle: string;
  statusCancelledDesc: string;
  statusReasonLabel: string;
  callSupportBtn: string;
  whatsappSupportBtn: string;
  switchFarmOrLogoutBtn: string;

  // Platform Admin Console
  adminTitle: string;
  adminSubtitle: string;
  adminNavDashboard: string;
  adminNavFarms: string;
  adminNavApprovals: string;
  adminNavOperators: string;
  adminNavAuditLog: string;
  adminNavSettings: string;
  adminLogoutBtn: string;
  adminApproveAction: string;
  adminRejectAction: string;
  adminSuspendAction: string;
  adminReactivateAction: string;
  adminExtendPlanAction: string;
  adminSupportViewAction: string;
  adminReasonPrompt: string;
  adminReasonPlaceholder: string;
  adminTotalFarms: string;
  adminActiveFarms: string;
  adminPendingFarms: string;
  adminSuspendedFarms: string;
  adminTotalBirds: string;
  adminEstimatedMRR: string;
  adminExpiringIn7Days: string;
  adminConfirmAction: string;
  adminCancelAction: string;
  adminSearchPlaceholder: string;
  adminExportCsv: string;
  adminLoginTitle: string;
  adminLoginSubtitle: string;
  adminEmailLabel: string;
  adminPasswordLabel: string;
  adminTotpLabel: string;
  adminLoginBtn: string;
  adminDemoLoginNotice: string;
  adminFilterAll: string;
  adminRoleSuperAdmin: string;
  adminRoleOperator: string;
  adminSettingsEnrollmentMode: string;
  adminSettingsAutoApprove: string;
  adminSettingsManualApproval: string;
  adminSettingsTrialDays: string;
  adminSettingsSupportPhone: string;
  adminSettingsSaveBtn: string;
  [key: string]: any;
}

import enMessages from '@/messages/en.json';
import hiMessages from '@/messages/hi.json';
import mrMessages from '@/messages/mr.json';

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr'] as const;
export const DEFAULT_LANGUAGE: Language = 'en';

export const rawMessages = {
  en: enMessages,
  hi: hiMessages,
  mr: mrMessages,
};

function flattenNamespaceDictionary(jsonObj: Record<string, any>): TranslationDictionary {
  const result: Record<string, any> = {};
  for (const [namespaceKey, value] of Object.entries(jsonObj)) {
    if (typeof value === 'object' && value !== null) {
      for (const [k, v] of Object.entries(value)) {
        result[k] = v;
      }
    }
  }
  return result as TranslationDictionary;
}

export const translations: Record<Language, TranslationDictionary> = {
  mr: flattenNamespaceDictionary(mrMessages),
  en: flattenNamespaceDictionary(enMessages),
  hi: flattenNamespaceDictionary(hiMessages),
};
