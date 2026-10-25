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
}

export const translations: Record<Language, TranslationDictionary> = {
  mr: {
    appName: "LayerOS",
    tagline: "महाराष्ट्रातील लेयर पोल्ट्री व अंडी व्यवसाय व्यवस्थापन",
    tryDemo: "साइन-अप न करता डेमो पहा",
    loginTitle: "आपल्या फार्ममध्ये प्रवेश करा",
    loginSubtitle: "आपला मोबाईल क्रमांक टाका आणि ३० सेकंदात लॉग इन करा",
    phonePlaceholder: "१० अंकी मोबाईल नंबर",
    sendOtp: "ओटीपी (OTP) पाठवा",
    enterOtp: "ओटीपी टाका (डेमो: 123456)",
    verifyOtp: "सत्यापित करा आणि सुरू करा",
    resendOtp: "ओटीपी पुन्हा पाठवा",
    orContinueWith: "किंवा डेमो मोड वापरा",
    demoModeNotice: "तुम्ही सध्या 'सह्याद्री लेयर फार्म' (३०,००० पक्षी) च्या सँडबॉक्स डेमो मोडमध्ये आहात.",
    resetDemoData: "डेमो डेटा रीसेट करा",

    switchFarm: "फार्म बदला",
    selectFarmTitle: "फार्म निवडा (Select Farm)",
    addNewFarm: "नवीन फार्म तयार करा",
    switchRole: "भूमिका बदला",
    switchRoleTitle: "भूमिका बदला (Switch Role)",
    lightMode: "लाइट मोड चालू करा",
    darkMode: "डार्क मोड चालू करा",
    themeLight: "लाइट मोड चालू करा (Light Mode)",
    themeDark: "डार्क मोड चालू करा (Dark Mode)",
    notifications: "सूचना",
    alertsTitle: "सूचना (Alerts)",
    demoBadge: "डेमो मोड (सँडबॉक्स)",
    postgresLive: "✓ पोस्टग्रेस लाइव्ह",
    localMode: "लोकल ऑफलाइन मोड",
    birds: "पक्षी",
    weeks: "आठवडे",

    navHome: "मुख्य डॅशबोर्ड",
    navQuickLog: "झटपट नोंदणी (Quick Log)",
    navFlocks: "फ्लॉक्स / बॅच",
    navSales: "अंडी विक्री",
    navExpenses: "खर्च व खाती",
    navHealth: "लसीकरण व आरोग्य",
    navMarketRates: "बाजार भाव (Mandi)",
    navForecast: "३०-दिवसीय अंदाज (AI)",
    navReports: "अहवाल (Reports)",
    navPublicTools: "मोफत कॅल्क्युलेटर (Tools)",
    navSettings: "सेटिंग्ज व कर्मचारी",
    navMore: "इतर पर्याय",

    roleOwner: "मालक (Owner)",
    roleManager: "व्यवस्थापक (Manager)",
    roleSupervisor: "सुपरवायझर (Supervisor)",
    roleAccountant: "हिशोबनीस (Accountant)",
    roleViewer: "तपासनीस (Viewer)",

    financialDecisionTitle: "आजचा आर्थिक निर्णय",
    safeProfitStatusMsg: "तुम्ही आज सुरक्षित नफ्यात आहात!",
    tightMarginWarningMsg: "लक्ष द्या: आज विक्री दरावर ताण आहे!",
    breakEvenRateLabel: "ब्रेक-इव्हन दर",
    sellingRateLabel: "विक्री दर",
    profitMarginLabel: "मार्जिन",
    dailyOperatingCashProfit: "आजचा थेट नफा (Cash)",
    dailyTrueNetProfit: "खरा नफा (True Profit)",
    activeBirds: "सध्या जिवंत पक्षी",
    birdsLostToday: "आज मृत्यू",
    eggsToday: "आज गोळा झालेली अंडी",
    hdPercentage: "हेन-डे (HD%) उत्पादन",
    productionPercentage: "उत्पादन टक्केवारी",
    feedUsed: "आज वापरलेला खुराक",
    feedPerBird: "प्रति पक्षी खुराक",
    feedRecommendedTomorrow: "उद्याचा शिफारशीत खुराक",
    mortality: "मृत्यू (संख्या)",
    mortalityRate: "मृत्यू दर %",
    eggStock: "शिल्लक अंडी साठा",
    breakEvenPrice: "ब्रेक-इव्हन अंडी दर",
    costPerEgg: "प्रति अंडे खर्च",
    sellingRate: "आजचा विक्री दर",
    todayMarketRate: "आजचा बाजार भाव",
    fcrDozenLabel: "FCR (डझन)",
    targetHdLabel: "टार्गेट HD%",
    birdsDeadToday: "आज मृत",
    ageWeeksLabel: "आठवडे",
    vsYesterday: "कालच्या तुलनेत",
    standardLabel: "मानक",
    targetFeedGrams: "टार्गेट",
    withinDailyLimit: "दैनिक मर्यादेत ✓",
    revenueBreakdownHint: "अंडी + रिकामी पोती + खत",
    feedRatePerKgHint: "₹३५.०० प्रति किलो दर",
    bankAndCashSplit: "बँक: ₹३.६L • कॅश: ₹६८,५००",
    overdueDaysHint: "१५ ग्राहक • ₹६०,००० थकीत (२१+ दिवस)",

    // Environment & Climate Automation
    climateAutomationTitle: "शेडचे वातावरण व ऑटोमेशन (Climate & Sensors)",
    iotSensorsConnected: "IoT सेन्सर कनेक्टेड",
    maxTempLabel: "कमाल तापमान",
    minTempLabel: "किमान",
    humidityLabel: "आर्द्रता (RH)",
    humidityNormal: "योग्य पातळी (५५-६५%)",
    ammoniaLabel: "अमोनिया (NH₃)",
    ammoniaSafe: "सुरक्षित (मर्यादा < २५ ppm)",
    lightingScheduleLabel: "प्रकाश वेळापत्रक",
    lightingHours: "१६ तास",
    lightingTimeRange: "सकाळी ५ ते रात्री ९",
    exhaustFansLabel: "एक्झॉस्ट फॅन (Exhaust Fans)",
    fansRunning: "चालू (कार्यरत)",
    fansOff: "बंद",
    turnOn: "चालू करा",
    turnOff: "बंद करा",
    heaterLabel: "ब्रूडर हीटर (Brooder Heaters)",
    heaterActive: "चालू",

    // Breed Standard & Tabs
    breedStandardChart: "ब्रीड स्टँडर्ड चार्ट (BV300 Standards)",
    batchPLTab: "बॅच नफा/तोटा (Batch P&L)",

    revenueToday: "आजचा एकूण महसूल",
    feedCostToday: "आजचा खुराकाचा खर्च",
    operatingProfit: "थेट दैनंदिन नफा (Cash)",
    trueProfit: "खरा नफा (True Profit)",
    simpleProfit: "साधा नफा",
    cashBalance: "रोख / बँक शिल्लक",
    outstandingReceivables: "ग्राहकांची थकबाकी (उधारी)",
    profitStatusSafe: "सुरक्षित नफा मार्जिन",
    profitStatusWarning: "धोकादायक मार्जिन (सावध रहा)",
    profitStatusLoss: "तोट्यात विक्री (तोट्याचा धोका)",

    quickLogTitle: "३०-सेकंद दैनिक नोंद (Quick Entry)",
    quickLogSubtitle: "दिवसभराची माहिती भरून एका क्लिकमध्ये दिवस बंद करा",
    eggsCollectedLabel: "आज गोळा झालेली अंडी",
    feedUsedLabel: "वापरलेला खुराक (किलो)",
    mortalityLabel: "आज झालेले मृत्यू (पक्ष्यांची संख्या)",
    saleQtyLabel: "आज विक्री केलेली अंडी (पर्यायी)",
    saleRateLabel: "विक्री दर प्रति १०० / अंडे",
    saveAndCloseDay: "नोंद साठवा व दिवस बंद करा",
    saving: "साठवत आहे...",
    dayClosedSuccess: "दिवसाची नोंद यशस्वीपणे साठवली! AI विश्लेषण तयार आहे.",
    yesterdayHint: "काल: ",

    fullEntryTitle: "तपशीलवार नोंद (Full 2-Min Entry)",
    sectionBirds: "१. पक्षी शिल्लक व मृत्यू तपशील",
    sectionEggs: "२. अंडी संकलन व प्रतवारी (Grading)",
    sectionFeed: "३. खुराक वाटप व उर्वरित साठा",
    sectionHealth: "४. लसीकरण, औषधोपचार व व्हिजिट",
    sectionEnvironment: "५. शेडचे वातावरण (तापमान / फॅन / लाईट)",
    sectionSales: "६. ग्राहकनिहाय विक्री व पुरवठा",
    sectionExpenses: "७. आजचे रोख व ऑनलाईन खर्च",

    flocksAndBatches: "फ्लॉक्स व बॅच व्यवस्थापन",
    activeBatch: "सक्रिय बॅच",
    newBatch: "नवीन बॅच नोंदणी",
    newShed: "नवीन शेड जोडा",
    selectBatch: "बॅच निवडा",
    batchOverview: "बॅच तपशील",
    breedStandards: "बीव्ही-३०० ब्रीड मानके",
    batchPL: "बॅच संचित नफा/तोटा",
    initialChicks: "सुरुवाती पिल्ले",
    chickCost: "प्रति पिल्लू दर",
    cumulativeMortality: "एकूण मृत्यू",
    livability: "जिवंत प्रमाण",
    hatcherySource: "हॅचरी स्रोत",
    placementDate: "प्लेसमेंट दिनांक",
    shedDistribution: "शेडनिहाय पक्षी विभागणी",
    birdCapacity: "पक्षी क्षमता",
    cageMethod: "उंच पिंजरा पद्धत",
    sensorsActive: "IoT सेन्सर्स ✓",
    phaseChange: "फेज बदला",
    cullBatch: "बॅच समाप्ती (कलिंग)",
    closeBatchConfirm: "तुम्ही ही बॅच समाप्त करू इच्छिता?",

    salesList: "विक्री यादी",
    newSale: "नवीन विक्री नोंद",
    customerLedger: "ग्राहक खाती (उधारी)",
    agingReport: "उधारी वय अहवाल (Aging)",
    invoiceNumber: "बिल / इनव्हॉइस #",
    vehicleNumber: "गाडी नंबर",
    driverName: "चालक / पोहोचवणारी व्यक्ती",
    grossAmount: "एकूण रक्कम",
    discount: "सूट (Discount)",
    netAmount: "निव्वळ रक्कम",
    paidAmount: "जमा रक्कम",
    paymentStatus: "पेमेंट स्थिती",
    paidStatusPaid: "पूर्ण जमा",
    paidStatusPartial: "अंशतः जमा",
    paidStatusPending: "बाकी (उधारी)",
    recordPayment: "पेमेंट जमा करा",

    feedStock: "खुराक साठा (Feed Stock)",
    feedTypes: "खुराकाचे प्रकार",
    reorderAlert: "खुराक संपत आला आहे!",
    dailyExpenseEntry: "खर्च नोंदवा",
    labourCost: "मजुरी खर्च",
    electricityCost: "वीज बिल",
    medicineCost: "औषधोपचार खर्च",

    toolsTitle: "मोफत पोल्ट्री टूल्स व कॅल्क्युलेटर",
    unitConverter: "अंडी युनिट कन्व्हर्टर (ट्रे, गट्टा, शेकडा)",
    breakEvenCalc: "ब्रेक-इव्हन अंडी दर कॅल्क्युलेटर",
    fcrCalc: "FCR कॅल्क्युलेटर (Feed Conversion Ratio)",

    teamMembers: "फार्म कर्मचारी व भूमिका",
    inviteStaff: "नवीन कर्मचाऱ्यास आमंत्रित करा",
    deactivateMember: "अधिकार रद्द करा",

    billingAndPlans: "सदस्यता व योजना",
    currentPlan: "सध्याची योजना",
    upgradePlan: "योजना श्रेणीसुधार (Upgrade)",
    planActiveStatus: "सक्रिय (Active)",
    planTrialStatus: "चाचणी (Trial)",
    birdCapacityUsage: "पक्षी क्षमता वापर",
    shedCapacityUsage: "शेड क्षमता",
    staffCapacityUsage: "कर्मचारी खाती वापर",
    invoicesAndReceipts: "देयके व पावत्या (Invoices)",
    monthlyBilling: "मासिक बिलिंग",
    yearlyBilling: "वार्षिक बिलिंग",
    saveAnnualDiscount: "१७% बचत (२ महिने मोफत)",
    paymentSuccess: "पेमेंट यशस्वी झाले! योजना सक्रिय करण्यात आली आहे.",
    upgradeNow: "आत्ताच अपग्रेड करा",
    manageSubscription: "सदस्यता व्यवस्थापन",
    planLimitsHeader: "योजना मर्यादा व वापर",

    unitEgg: "प्रति अंडे",
    unitPer100: "प्रति १०० अंडी",
    unitTray: "ट्रे (३० अंडी)",
    unitGatta: "गट्टा / पेटी (२१० अंडी)",
    unitCarton: "कार्टन / बॉक्स (३६० अंडी)",

    aiAdvisorTitle: "AI दैनिक सल्लागार",
    todaysActionTitle: "आजच्या सर्वोच्च ३ महत्त्वाच्या कृती",
    aiActionPrioritySubtitle: "AI ॲनालिटिक्स व दैनंदिन आकडेवारीवर आधारित तात्काळ करायच्या कृती",
    aiPriorityBadge: "AI प्राधान्यक्रम",
    smartAlertsTitle: "स्मार्ट नोटिफिकेशन्स व इशारे",
    askLayerOs: "LayerOS ला विचारा (AI Assistant)",
    askPlaceholder: "उदा. मागच्या आठवड्यात प्रति अंडे खर्च किती होता? किंवा कोणाची उधारी सर्वात जास्त आहे?",
    forecast30Days: "पुढील ३० दिवसांचा नफा/तोटा अंदाज",
    whatIfSimulator: "काय घडेल जर? (What-If Simulator)",

    save: "जतन करा",
    cancel: "रद्द करा",
    edit: "बदला",
    delete: "हटवा",
    search: "शोधा...",
    filter: "फिल्टर",
    exportPdf: "PDF अहवाल",
    exportExcel: "Excel मध्ये डाऊनलोड",
    shareWhatsApp: "WhatsApp वर शेअर करा",
    date: "दिनांक",
    customer: "ग्राहक",
    amount: "रक्कम (₹)",
    status: "स्थिती",

    landingEnrollBtn: "आपला पोल्ट्री फार्म नोंदवा",
    landingLoginBtn: "लॉगिन",
    heroHeadline: "प्रत्येक अंड्याचा हिशोब. जास्तीत जास्त नफा.",
    heroSubtitle: "महाराष्ट्र आणि भारतातील व्यावसायिक लेयर पोल्ट्री चालकांसाठी खास तयार केलेले आधुनिक डिजिटल मॅनेजमेंट ॲप.",
    heroEnrollCta: "आपला पोल्ट्री फार्म नोंदवा",
    heroAlreadyRegistered: "आधीच खाते आहे का? लॉगिन करा",
    heroTryDemo: "थेट डेमो पहा (Try Demo)",
    whatIsTitle: "LayerOS म्हणजे काय?",
    whatIsDesc: "LayerOS हे व्यावसायिक लेयर पोल्ट्री चालकांसाठी बनवलेले स्मार्ट मोबाईल ॲप आहे जे रोजची वही-डायरी बंद करते. हे ॲप मालकाला अवघ्या ३ सेकंदात सांगते की आज फार्म नफ्यात आहे की तोट्यात, किती खाद्य लागेल आणि उद्या काय निर्णय घ्यावेत.",
    whoIsTitle: "हे ॲप कोणासाठी आहे?",
    whoOwner: "फार्म मालक (Owner)",
    whoOwnerDesc: "दैनंदिन नफा-तोटा, रोकड ताळेबंद, ब्रेक-इव्हन भाव आणि ३० दिवसांचे आर्थिक नियोजन.",
    whoSupervisor: "सुपरवायझर (Supervisor)",
    whoSupervisorDesc: "फक्त ३० सेकंदात सकाळ-संध्याकाळ अंडी, खुराक आणि मृत्यूची जलद नोंद.",
    whoAccountant: "हिशोबनीस / मुनीम (Accountant)",
    whoAccountantDesc: "अंडी विक्री बिलिंग, उधारी-थकबाकी खातेवही, खर्च पावत्या आणि बँक ईएमआय ट्रॅकिंग.",
    whoVet: "पशुवैद्यकीय डॉक्टर (Vet - Read Only)",
    whoVetDesc: "लसीकरण वेळापत्रक, मृत्यू दर ट्रेंड, औषधोपचार आणि बॅच आरोग्य स्थिती.",
    whatYouEnterTitle: "तुम्ही काय नोंदवता?",
    whatYouEnterSubtitle: "शेतकऱ्याचा वेळ वाचवणारी रचना: क्विक मोडमध्ये ३० सेकंद आणि सविस्तर नोंदीत फक्त २ मिनिटे!",
    enterEggs: "दैनिक अंडी उत्पादन",
    enterEggsDesc: "सकाळ व संध्याकाळची अंडी गोळा करणे, तुटफूट व कच्ची अंडी.",
    enterMortality: "मृत्यू व छाटणी (Mortality)",
    enterMortalityDesc: "रोजचा पक्षी मृत्यू आणि आजचे शिल्लक जिवंत पक्षी.",
    enterFeed: "खुराक वापर (Feed)",
    enterFeedDesc: "रोजच्या खाद्याच्या गोण्या (Bags) किंवा किलो.",
    enterSales: "अंडी विक्री व उधारी",
    enterSalesDesc: "व्यापारी दर, विकलेली अंडी (नग/ट्रे/गट्टा) आणि रोख/उधारी.",
    enterExpenses: "इतर खर्च व औषधे",
    enterExpensesDesc: "मजुरी, औषधे, डिझेल, वीजबिल आणि बँक कर्ज हप्ता.",
    whatYouGetTitle: "तुम्हाला काय मिळते?",
    getHd: "हेन-डे टक्केवारी (HD %)",
    getFeedPerBird: "प्रति पक्षी खुराक (g/bird)",
    getBreakEven: "ब्रेक-इव्हन अंडी भाव",
    getBreakEvenDesc: "ट्रॅफिक-लाइट सिग्नल: आज नफा आहे की तोटा?",
    getTrueProfit: "खरा नफा विरुद्ध रोख नफा",
    getTrueProfitDesc: "पिल्लू घसारा (Pullet Amortisation) आणि शेड भांडवली खर्च धरून खरा नफा.",
    getFeedForecast: "मासिक खुराक अंदाज व नियोजन",
    getAiAdvice: "AI दैनंदिन सल्लागार",
    getAiAdviceDesc: "उद्या काय करावे याबद्दल ३ सर्वात महत्त्वाच्या कृती आणि मार्गदर्शन.",
    getMandiTrends: "मंडी भाव व विक्री सल्ला",
    howItWorksTitle: "हे कसे चालते? (४ सोप्या पायऱ्या)",
    step1Title: "१. फार्मची मोफत नोंदणी करा",
    step1Desc: "आपले नाव, मोबाईल नंबर आणि फार्मचा पत्ता प्रविष्ट करा.",
    step2Title: "२. शेड व पक्ष्यांची माहिती भरा",
    step2Desc: "पक्षांची जात, वय आणि चालू खाद्य/अंड्याचे स्थानिक युनिट्स एकदाच सेट करा.",
    step3Title: "३. रोज फक्त ३० सेकंदात नोंद करा",
    step3Desc: "सकाळ-संध्याकाळ गोळा झालेली अंडी, खुराक गोण्या आणि मृत्यू टाका.",
    step4Title: "४. तात्काळ नफा, विश्लेषण व AI सल्ला मिळवा",
    step4Desc: "ब्रेक-इव्हन भाव, महिन्याचा खर्च, खाद्य नियोजन आणि पुढील दिशा पाहा.",
    samplePreviewTitle: "नमुना अहवाल व प्रत्यक्ष उदाहरण",
    samplePreviewBadge: "प्रमाणित संदर्भ उदाहरण (Sample Reference)",
    sampleNote: "टीप: हे ३०,००० पक्षांच्या संदर्भ दिवसाचे प्रत्यक्ष गणितावर आधारित उदाहरण आहे.",
    featuresGridTitle: "LayerOS ची प्रमुख वैशिष्ट्ये",
    featMarathiFirst: "मराठी-प्रथम आणि सोपी भाषा",
    featMarathiFirstDesc: "इंग्रजी, मराठी आणि हिंदीमध्ये स्पष्ट पोल्ट्री संज्ञा, शेतकरी-अनुकूल डिझाइन.",
    featOffline: "इंटरनेटशिवाय चालते (Offline PWA)",
    featOfflineDesc: "फार्मवर नेटवर्क नसतानाही नोंदी सेव्ह होतात व इंटरनेट आल्यावर आपोआप सिंक होतात.",
    featMultiRole: "कर्मचारी व सुपरवायझर रोल",
    featMultiRoleDesc: "मालक, व्यवस्थापक, सुपरवायझर व हिशोबनीस यांना स्वतंत्र मर्यादित प्रवेश.",
    featDataPrivate: "१००% सुरक्षित व स्वतंत्र डेटा",
    featDataPrivateDesc: "प्रत्येक फार्मचा डेटा पूर्णपणे स्वतंत्र; इतर कोणत्याही फार्मला तुमचा डेटा दिसत नाही.",
    featAiAdvisor: "स्मार्ट AI सल्लागार",
    featAiAdvisorDesc: "उत्पादन घसरल्यास किंवा खाद्य जास्त लागल्यास त्वरित वैज्ञानिक विश्लेषण.",
    featPdfReports: "व्हॉट्सॲप व PDF अहवाल",
    featPdfReportsDesc: "एका क्लिकवर दैनंदिन अहवाल व्हॉट्सॲपवर पाठवा किंवा PDF डाऊनलोड करा.",
    trustTitle: "विश्वास, सुरक्षितता आणि गोपनीयता",
    trustDesc: "तुमच्या फार्मचा डेटा ही तुमची खाजगी मालमत्ता आहे. LayerOS डिजिटल वैयक्तिक डेटा संरक्षण (DPDP) नियमांचे तंतोतंत पालन करते.",
    trustAiDisclaimer: "महत्त्वाची सूचना: AI सल्लागार हा शेतकरी बंधूंना निर्णय घेण्यासाठी मदत करणारा मार्गदर्शक आहे, तो पशुवैद्यकीय डॉक्टरांचा पर्याय किंवा अधिकृत औषधोपचार नाही.",
    pricingTitle: "सुलभ आणि पारदर्शक योजना",
    pricingSubtitle: "सर्व योजनांमध्ये मोफत चाचणी उपलब्ध. कोणताही छुपा खर्च नाही.",
    startFreeTrial: "मोफत चाचणी सुरू करा",
    enrollNow: "आताच नोंदणी करा",
    faqTitle: "वारंवार विचारले जाणारे प्रश्न (FAQ)",
    faqQ1: "LayerOS वापरण्यासाठी इंटरनेट नेहमी चालू असणे आवश्यक आहे का?",
    faqA1: "नाही! LayerOS हे प्रोग्रेसिव्ह वेब ॲप (PWA) आहे. फार्मवर किंवा शेडमध्ये इंटरनेट नसले तरी तुम्ही रोजची अंडी व खाद्याची नोंद करू शकता. नेटवर्क आल्यावर डेटा आपोआप सुरक्षितपणे सिंक होतो.",
    faqQ2: "सुरू करण्यासाठी मला कोणत्या माहितीची गरज आहे?",
    faqA2: "फक्त ३ गोष्टी: फार्मचे नाव, चालू पक्षांची संख्या आणि खाद्याचा चालू दर. बाकी सर्व माहिती (शेड, ग्राहक, बँक कर्ज) तुम्ही नंतर कधीही जोडू शकता.",
    faqQ3: "माझा डेटा सुरक्षित आणि खाजगी राहील का?",
    faqA3: "होय, १००%! प्रत्येक फार्मसाठी डेटाबेसमध्ये स्वतंत्र सुरक्षा कुंपण (Row Level Security) आहे. तुमचा नफा, उत्पादन किंवा अंडी विक्री इतर कोणत्याही फार्मला अथवा व्यक्तीला दिसू शकत नाही.",
    faqQ4: "माझा सुपरवायझर किंवा व्यवस्थापक हे ॲप वापरू शकतात का?",
    faqA4: "नक्कीच! तुम्ही सुपरवायझरना फक्त अंडी व खुराक नोंदवण्याची परवानगी देऊ शकता. नफा-तोटा, बँकेचे कर्ज आणि खरेदी-विक्रीचे गोपनीय आकडे फक्त मालकालाच दिसतात.",
    faqQ5: "हे ॲप कोणत्या भाषांमध्ये उपलब्ध आहे?",
    faqA5: "LayerOS हे मराठी, हिंदी आणि इंग्रजी या तीनही भाषांमध्ये उपलब्ध आहे. तुम्ही एका क्लिकवर हवी ती भाषा बदलू शकता.",
    faqQ6: "यासाठी किती शुल्क आकारले जाते?",
    faqA6: "५,००० पक्षांपर्यंतच्या फार्मसाठी LayerOS पूर्णपणे मोफत आहे! मोठ्या व्यावसायिक फार्म्ससाठी मोफत चाचणी (Trial) उपलब्ध आहे, त्यानंतर अगदी नाममात्र मासिक शुल्क आकारले जाते.",
    faqQ7: "मी नोंदणी न करता आधी ॲप तपासून पाहू शकतो का?",
    faqA7: "होय! तुम्ही मुख्य पानावर 'थेट डेमो पहा' (Try Demo) बटणावर क्लिक करून ३०,००० पक्षांच्या सह्याद्री लेयर फार्मचा संपूर्ण ९० दिवसांचा प्रत्यक्ष अनुभव घेऊ शकता.",
    enrollTitle: "नवीन पोल्ट्री फार्म नोंदणी",
    enrollStep1: "१. मालकाचे खाते",
    enrollStep2: "२. फार्म तपशील",
    enrollStep3: "३. शेड व बॅच",
    enrollStep4: "४. खुराक व दर",
    enrollStep5: "५. अंडी विक्री व युनिट्स",
    enrollStep6: "६. इतर खर्च व कर्ज",
    enrollStep7: "७. खात्री व सुरुवात",
    fullNameLabel: "मालकाचे पूर्ण नाव",
    mobileLabel: "मोबाईल नंबर (+91)",
    emailLabel: "ईमेल पत्ता",
    passwordLabel: "पासवर्ड (किमान ८ अक्षरे व १ अंक)",
    acceptTermsLabel: "मी अटी, शर्ती आणि DPDP डेटा गोपनीयता धोरण मान्य करतो.",
    farmNameLabel: "पोल्ट्री फार्मचे नाव",
    villageLabel: "गाव / शहर",
    talukaLabel: "तालुका",
    districtLabel: "जिल्हा",
    stateLabel: "राज्य",
    pincodeLabel: "पिनकोड",
    preferredLangLabel: "पसंतीची भाषा",
    numberOfShedsLabel: "एकूण शेड्सची संख्या",
    batchCodeLabel: "बॅच कोड / नाव",
    breedLabel: "पक्षांची जात (Breed)",
    birdsPlacedLabel: "सुरुवातीला बसवलेले पक्षी",
    currentBirdsLabel: "सध्या जिवंत असलेले पक्षी",
    enrollAgeWeeksLabel: "सध्याचे वय (आठवडे)",
    housingTypeLabel: "शेडचा प्रकार (Housing)",
    addFlockBtn: "+ आणखी एक बॅच जोडा",
    removeFlockBtn: "बॅच काढा",
    feedBagsPerDayLabel: "दररोज लागणाऱ्या खाद्य गोण्या (५० किलोच्या)",
    feedPricePerKgLabel: "खाद्याचा चालू भाव (प्रति किलो ₹)",
    bagSizeKgLabel: "गोणीचे वजन (किलो)",
    feedSupplierLabel: "खाद्य पुरवठादार (ऐच्छिक)",
    planningHorizonLabel: "खाद्य नियोजन कालावधी",
    expectedFeedStockLabel: "शिल्लक असलेला खुराक स्टॉक (किलो)",
    traySizeLabel: "ट्रेचा आकार (अंडी)",
    traysPerGattaLabel: "गट्ट्यामध्ये किती ट्रे? (स्थानिक पद्धत)",
    sellingPricePerEggLabel: "अंड्याचा चालू विक्री भाव (प्रति नग ₹)",
    mainBuyerTypeLabel: "प्रमुख ग्राहक प्रकार",
    nearestMandiLabel: "जवळची मुख्य अंडी मंडी",
    monthlyLabourLabel: "मासिक मजुरी खर्च (₹)",
    monthlyMedicineLabel: "मासिक औषधे व लस खर्च (₹)",
    monthlyElectricityLabel: "मासिक वीज व डिझेल खर्च (₹)",
    monthlyOtherLabel: "इतर मासिक खर्च (₹)",
    monthlyLoanEmiLabel: "बँक कर्ज मासिक हप्ता/EMI (₹)",
    numberOfEmployeesLabel: "कामावरील एकूण कामगार",
    createMyLayerOSBtn: "माझे LayerOS तयार करा",
    savingEnrollment: "आपला फार्म तयार होत आहे...",
    welcomeTitle: "अभिनंदन! आपले LayerOS तयार झाले आहे",
    welcomeSubtitle: "तुमच्या फार्मचे आकडे आणि हिशोब आता सुरक्षितपणे सेट झाले आहेत.",
    nextAction1: "१. आजची अंडी, खुराक व मृत्यू नोंदवा",
    nextAction2: "२. सुपरवायझर किंवा कर्मचाऱ्याला आमंत्रित करा",
    nextAction3: "३. ३० दिवसांचे खुराक नियोजन आणि नफा पहा",
    goToDashboardBtn: "डॅशबोर्डवर जा (Go to Dashboard)",
    backToHome: "मुख्यपृष्ठ",
    statusPendingApprovalTitle: "खाते मंजुरी प्रलंबित आहे",
    statusPendingApprovalDesc: "आपले पोल्ट्री फार्म नोंदणी यशस्वीरित्या प्राप्त झाली आहे. LayerOS प्रशासकाकडून मंजुरी मिळताच आपले खाते सक्रिय होईल.",
    statusSuspendedTitle: "खाते तात्पुरते स्थगित केले आहे",
    statusSuspendedDesc: "प्रशासकीय किंवा बिलिंग कारणास्तव या फार्मचे खाते स्थगित केले आहे. मदतीसाठी संपर्क साधा.",
    statusRejectedTitle: "नोंदणी नाकारण्यात आली आहे",
    statusRejectedDesc: "नोंदणीची पडताळणी पूर्ण होऊ शकली नाही किंवा माहिती अपूर्ण होती.",
    statusCancelledTitle: "खाते रद्द करण्यात आले आहे",
    statusCancelledDesc: "या फार्मचे खाते किंवा सदस्यता रद्द झाली आहे.",
    statusReasonLabel: "कारण / तपशील",
    callSupportBtn: "कॉल करा (Call Support)",
    whatsappSupportBtn: "व्हॉट्सॲपवर संपर्क करा",
    switchFarmOrLogoutBtn: "लॉगआउट किंवा फार्म बदला",
    adminTitle: "LayerOS प्लॅटफॉर्म ॲडमिन",
    adminSubtitle: "सर्व नोंदणीकृत पोल्ट्री फार्म्सचे थेट नियंत्रण व देखरेख",
    adminNavDashboard: "डॅशबोर्ड (KPIs)",
    adminNavFarms: "सर्व फार्म्स",
    adminNavApprovals: "प्रलंबित मंजुऱ्या",
    adminNavOperators: "ऑपरेटर्स व टीम",
    adminNavAuditLog: "ऑडिट लॉग (Audit Trail)",
    adminNavSettings: "प्लॅटफॉर्म सेटिंग्ज",
    adminLogoutBtn: "ॲडमिन लॉगआउट",
    adminApproveAction: "मंजूर करा (Approve)",
    adminRejectAction: "नाकारा (Reject)",
    adminSuspendAction: "स्थगित करा (Suspend)",
    adminReactivateAction: "पुन्हा सुरू करा (Reactivate)",
    adminExtendPlanAction: "प्लॅन वाढवा (Extend Trial)",
    adminSupportViewAction: "सपोर्ट व्ह्यू (Support View)",
    adminReasonPrompt: "कृतीचे कारण नमूद करा (अनिवार्य):",
    adminReasonPlaceholder: "उदा. फोनवर संपर्क झाला, कागदपत्रे पडताळली, इ.",
    adminTotalFarms: "एकूण फार्म्स",
    adminActiveFarms: "सक्रिय फार्म्स",
    adminPendingFarms: "मंजुरी प्रलंबित",
    adminSuspendedFarms: "स्थगित फार्म्स",
    adminTotalBirds: "एकूण पक्षी क्षमता",
    adminEstimatedMRR: "अंदाजित मासिक महसूल (MRR)",
    adminExpiringIn7Days: "७ दिवसांत संपणारे प्लॅन्स",
    adminConfirmAction: "पुष्टी करा",
    adminCancelAction: "रद्द करा",
    adminSearchPlaceholder: "फार्मचे नाव, मालक किंवा मोबाईल शोधा...",
    adminExportCsv: "CSV डाऊनलोड",
    adminLoginTitle: "प्लॅटफॉर्म ॲडमिन लॉगिन",
    adminLoginSubtitle: "केवळ अधिकृत सुपर ॲडमिन व ऑपरेटरसाठी",
    adminEmailLabel: "ॲडमिन ईमेल",
    adminPasswordLabel: "पासवर्ड",
    adminTotpLabel: "२FA सुरक्षा कोड (TOTP)",
    adminLoginBtn: "कंसोलमध्ये प्रवेश करा",
    adminDemoLoginNotice: "चाचणी क्रेडेंशियल्स: admin@layeros.internal / SuperAdmin@2026",
    adminFilterAll: "सर्व",
    adminRoleSuperAdmin: "सुपर ॲडमिन",
    adminRoleOperator: "ऑपरेटर",
    adminSettingsEnrollmentMode: "नोंदणी स्वीकृती मोड",
    adminSettingsAutoApprove: "आपोआप सक्रिय करा (Auto-Approve)",
    adminSettingsManualApproval: "मॅन्युअल मंजुरी आवश्यक (Manual Approval)",
    adminSettingsTrialDays: "डीफॉल्ट मोफत चाचणी कालावधी (दिवस)",
    adminSettingsSupportPhone: "सपोर्ट हेल्पलाईन नंबर",
    adminSettingsSaveBtn: "सेटिंग्ज जतन करा",
  },
  en: {
    appName: "LayerOS",
    tagline: "Commercial Layer Poultry Management & ERP",
    tryDemo: "Try Sandbox Demo",
    loginTitle: "Sign In to Your Farm",
    loginSubtitle: "Enter your mobile number to log in within 30 seconds",
    phonePlaceholder: "10-digit mobile number",
    sendOtp: "Send OTP",
    enterOtp: "Enter OTP (Demo: 123456)",
    verifyOtp: "Verify & Launch",
    resendOtp: "Resend OTP",
    orContinueWith: "Or try sandbox demo",
    demoModeNotice: "You are currently running in Sahyadri Layer Farm (30,000 birds) demo sandbox.",
    resetDemoData: "Reset Demo Data",

    switchFarm: "Select Farm",
    selectFarmTitle: "Select Farm",
    addNewFarm: "Add New Farm",
    switchRole: "Switch Role",
    switchRoleTitle: "Switch Role",
    lightMode: "Switch to Light Mode",
    darkMode: "Switch to Dark Mode",
    themeLight: "Switch to Light Mode",
    themeDark: "Switch to Dark Mode",
    notifications: "Notifications",
    alertsTitle: "Alerts & Notifications",
    demoBadge: "Demo Sandbox",
    postgresLive: "✓ Postgres Live",
    localMode: "Local Offline Mode",
    birds: "Birds",
    weeks: "Weeks",

    navHome: "Dashboard",
    navQuickLog: "Quick Log",
    navFlocks: "Flocks & Batches",
    navSales: "Egg Sales",
    navExpenses: "Expenses & Accounts",
    navHealth: "Vaccine & Health",
    navMarketRates: "Mandi Rates",
    navForecast: "AI 30-Day Forecast",
    navReports: "Reports",
    navPublicTools: "Calculators & Tools",
    navSettings: "Settings & Team",
    navMore: "More",

    roleOwner: "Owner",
    roleManager: "Manager",
    roleSupervisor: "Supervisor",
    roleAccountant: "Accountant",
    roleViewer: "Viewer",

    financialDecisionTitle: "Daily Financial Status",
    safeProfitStatusMsg: "You are operating at a safe profit today!",
    tightMarginWarningMsg: "Warning: Egg prices are under pressure near break-even!",
    breakEvenRateLabel: "Break-Even Price",
    sellingRateLabel: "Selling Rate",
    profitMarginLabel: "Margin",
    dailyOperatingCashProfit: "Daily Cash Profit",
    dailyTrueNetProfit: "True Net Profit (After Depreciation)",
    activeBirds: "Active Live Birds",
    birdsLostToday: "Dead Today",
    eggsToday: "Eggs Collected Today",
    hdPercentage: "HD% (Hen-Day)",
    productionPercentage: "Production %",
    feedUsed: "Feed Used Today",
    feedPerBird: "Feed per Bird",
    feedRecommendedTomorrow: "Target Feed Tomorrow",
    mortality: "Mortality (Count)",
    mortalityRate: "Mortality Rate %",
    eggStock: "Egg Stock in Shed",
    breakEvenPrice: "Break-Even Egg Price",
    costPerEgg: "Cost per Egg",
    sellingRate: "Today's Selling Price",
    todayMarketRate: "Today's Market Rate",
    fcrDozenLabel: "FCR (per Dozen)",
    targetHdLabel: "Target HD%",
    birdsDeadToday: "dead today",
    ageWeeksLabel: "weeks",
    vsYesterday: "vs yesterday",
    standardLabel: "Standard",
    targetFeedGrams: "Target",
    withinDailyLimit: "Within daily limit ✓",
    revenueBreakdownHint: "Eggs + empty bags + manure",
    feedRatePerKgHint: "₹35.00/kg avg cost",
    bankAndCashSplit: "Bank: ₹3.6L • Cash: ₹68,500",
    overdueDaysHint: "15 customers • ₹60,000 overdue (21+ days)",

    // Environment & Climate Automation
    climateAutomationTitle: "Climate & Shed Automation",
    iotSensorsConnected: "IoT Sensors Connected",
    maxTempLabel: "Max Temperature",
    minTempLabel: "Min",
    humidityLabel: "Humidity (RH)",
    humidityNormal: "Optimal (55-65%)",
    ammoniaLabel: "Ammonia (NH₃)",
    ammoniaSafe: "Safe (< 25 ppm)",
    lightingScheduleLabel: "Lighting Schedule",
    lightingHours: "16 Hours",
    lightingTimeRange: "5:00 AM to 9:00 PM",
    exhaustFansLabel: "Exhaust Fans",
    fansRunning: "Running (Active)",
    fansOff: "Off",
    turnOn: "Turn On",
    turnOff: "Turn Off",
    heaterLabel: "Brooder Heaters",
    heaterActive: "Active",

    // Breed Standard & Tabs
    breedStandardChart: "BV-300 Target Standards",
    batchPLTab: "Batch Profit & Loss (P&L)",

    revenueToday: "Total Revenue Today",
    feedCostToday: "Feed Cost Today",
    operatingProfit: "Operating Profit (Cash)",
    trueProfit: "True Profit (After Overheads)",
    simpleProfit: "Simple Profit",
    cashBalance: "Cash / Bank Balance",
    outstandingReceivables: "Receivables Outstanding",
    profitStatusSafe: "Safe Margin",
    profitStatusWarning: "Tight Margin (Warning)",
    profitStatusLoss: "Selling at a Loss",

    quickLogTitle: "30-Second Quick Entry",
    quickLogSubtitle: "Log daily numbers and close day in one tap",
    eggsCollectedLabel: "Eggs Collected",
    feedUsedLabel: "Feed Used (kg)",
    mortalityLabel: "Mortality (Count)",
    saleQtyLabel: "Eggs Sold (Optional)",
    saleRateLabel: "Selling Rate (per 100 / egg)",
    saveAndCloseDay: "Save & Close Day",
    saving: "Saving...",
    dayClosedSuccess: "Day closed successfully! AI analysis generated.",
    yesterdayHint: "Yesterday: ",

    fullEntryTitle: "Detailed Daily Entry (2-Min)",
    sectionBirds: "1. Bird Count & Mortality",
    sectionEggs: "2. Egg Collection & Grading",
    sectionFeed: "3. Feed Issued & Stock Left",
    sectionHealth: "4. Vaccines & Medical Treatments",
    sectionEnvironment: "5. Shed Climate & Lighting",
    sectionSales: "6. Customer-wise Egg Dispatches",
    sectionExpenses: "7. Today's Expenses & Purchases",

    flocksAndBatches: "Flocks & Batches Management",
    activeBatch: "Active Batch",
    newBatch: "New Flock Batch",
    newShed: "Add New Shed",
    selectBatch: "Select Batch",
    batchOverview: "Flock Overview",
    breedStandards: "BV-300 Target Standards",
    batchPL: "Batch Cumulative P&L",
    initialChicks: "Initial Chicks Placed",
    chickCost: "Chick Cost per Bird",
    cumulativeMortality: "Cumulative Mortality",
    livability: "Livability",
    hatcherySource: "Hatchery Source",
    placementDate: "Placement Date",
    shedDistribution: "Shed Distribution",
    birdCapacity: "Capacity",
    cageMethod: "Elevated Cage System",
    sensorsActive: "IoT Sensors Active",
    phaseChange: "Advance Phase",
    cullBatch: "Cull & Close Batch",
    closeBatchConfirm: "Are you sure you want to close and cull this batch?",

    salesList: "Sales Orders",
    newSale: "New Sale Invoice",
    customerLedger: "Customer Credit Ledger",
    agingReport: "Aging Analysis (0-30+ Days)",
    invoiceNumber: "Invoice #",
    vehicleNumber: "Vehicle Number",
    driverName: "Delivery Person / Driver",
    grossAmount: "Gross Amount",
    discount: "Discount",
    netAmount: "Net Payable",
    paidAmount: "Amount Paid",
    paymentStatus: "Payment Status",
    paidStatusPaid: "Paid in Full",
    paidStatusPartial: "Partially Paid",
    paidStatusPending: "Unpaid / Credit",
    recordPayment: "Record Payment",

    feedStock: "Feed Inventory & Stock",
    feedTypes: "Feed Formulations",
    reorderAlert: "Feed Stock Low Alert!",
    dailyExpenseEntry: "Add Expense",
    labourCost: "Labour Expense",
    electricityCost: "Electricity Bill",
    medicineCost: "Medicine & Vet Care",

    toolsTitle: "Free Poultry Calculators & Tools",
    unitConverter: "Egg Unit Converter (Trays, Gatta, Cartons)",
    breakEvenCalc: "Break-Even Cost Calculator",
    fcrCalc: "Feed Conversion Ratio (FCR) Calculator",

    teamMembers: "Farm Team & Permissions",
    inviteStaff: "Invite Staff Member",
    deactivateMember: "Revoke Access",

    billingAndPlans: "Billing & Plans",
    currentPlan: "Current Plan",
    upgradePlan: "Upgrade Plan",
    planActiveStatus: "Active",
    planTrialStatus: "Free Trial",
    birdCapacityUsage: "Bird Capacity Usage",
    shedCapacityUsage: "Shed Capacity",
    staffCapacityUsage: "Staff Accounts Usage",
    invoicesAndReceipts: "Invoices & Receipts",
    monthlyBilling: "Monthly Billing",
    yearlyBilling: "Yearly Billing",
    saveAnnualDiscount: "Save 17% (2 Months Free)",
    paymentSuccess: "Payment successful! Plan has been upgraded.",
    upgradeNow: "Upgrade Now",
    manageSubscription: "Manage Subscription",
    planLimitsHeader: "Plan Limits & Resource Usage",

    unitEgg: "Per Egg",
    unitPer100: "Per 100 Eggs",
    unitTray: "Tray (30 Eggs)",
    unitGatta: "Gatta / Case (210 Eggs)",
    unitCarton: "Carton / Box (360 Eggs)",

    aiAdvisorTitle: "AI Farm Advisor",
    todaysActionTitle: "Top 3 Priorities for Today",
    aiActionPrioritySubtitle: "Actionable recommendations based on AI analytics & real data",
    aiPriorityBadge: "AI Priority",
    smartAlertsTitle: "Smart Alerts & Warnings",
    askLayerOs: "Ask LayerOS (AI Assistant)",
    askPlaceholder: "e.g., What was my cost per egg last week? Or which customer owes the most?",
    forecast30Days: "30-Day P&L & Cash Flow Forecast",
    whatIfSimulator: "What-If Scenario Simulator",

    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    search: "Search...",
    filter: "Filter",
    exportPdf: "Export PDF",
    exportExcel: "Export Excel",
    shareWhatsApp: "Share to WhatsApp",
    date: "Date",
    customer: "Customer",
    amount: "Amount (₹)",
    status: "Status",

    landingEnrollBtn: "Enroll Your Poultry Farm",
    landingLoginBtn: "Login",
    heroHeadline: "Every egg counted. Profit maximised.",
    heroSubtitle: "Mobile-first layer poultry & egg business management app built for commercial farm owners across Maharashtra and India.",
    heroEnrollCta: "Enroll Your Poultry Farm",
    heroAlreadyRegistered: "Already registered? Login",
    heroTryDemo: "Try Demo",
    whatIsTitle: "What is LayerOS?",
    whatIsDesc: "LayerOS is a mobile-first app designed specifically for commercial layer farm owners. It completely replaces your daily paper register and instantly tells you whether your farm is making profit or loss today, how much feed is required, and what decisions to take next.",
    whoIsTitle: "Who It Is For",
    whoOwner: "Farm Owner",
    whoOwnerDesc: "Daily profit/loss, cash balance, break-even price and 30-day financial forecast.",
    whoSupervisor: "Supervisor",
    whoSupervisorDesc: "Log morning/evening egg collections, feed issues, and mortality in 30 seconds.",
    whoAccountant: "Accountant",
    whoAccountantDesc: "Egg sales billing, trader credit ledger (udhari), expense receipts, and bank loans.",
    whoVet: "Veterinarian (Read-Only)",
    whoVetDesc: "Vaccination schedule, mortality trends, medication log, and flock health status.",
    whatYouEnterTitle: "What You Enter",
    whatYouEnterSubtitle: "Built to save farmer time: 4 numbers in 30 seconds (Quick Mode) or 2 minutes for full records!",
    enterEggs: "Daily Egg Collection",
    enterEggsDesc: "Morning and evening collection, broken and soft-shell eggs.",
    enterMortality: "Mortality & Culls",
    enterMortalityDesc: "Daily dead birds and active live bird count.",
    enterFeed: "Feed Issued",
    enterFeedDesc: "Daily bags or kg consumed per shed.",
    enterSales: "Sales & Trader Credit",
    enterSalesDesc: "Trader selling rates, units sold (tray/gatta), and cash or credit.",
    enterExpenses: "Expenses & Medicine",
    enterExpensesDesc: "Labour wages, medicines, diesel, electricity, and loan EMI.",
    whatYouGetTitle: "What You Get",
    getHd: "Hen-Day Production (HD%)",
    getFeedPerBird: "Feed Intake per Bird (g/bird)",
    getBreakEven: "Break-Even Egg Price",
    getBreakEvenDesc: "Traffic-light alert: Are you profitable today?",
    getTrueProfit: "True Profit vs Operating Profit",
    getTrueProfitDesc: "Economic profit after accounting for bird depreciation, pullet amortisation, and overheads.",
    getFeedForecast: "Monthly Feed Requirement & Cost",
    getAiAdvice: "AI Daily Advisor",
    getAiAdviceDesc: "Tomorrow’s top 3 high-priority actions based on your numbers.",
    getMandiTrends: "Mandi Price & Hold vs Sell",
    howItWorksTitle: "How It Works (4 Simple Steps)",
    step1Title: "1. Enroll Your Farm",
    step1Desc: "Enter your owner name, mobile number, and farm location.",
    step2Title: "2. Set Up Sheds & Flocks",
    step2Desc: "Configure breeds, age, feed bags, and local tray/gatta pack sizes once.",
    step3Title: "3. Log Daily Records",
    step3Desc: "Enter morning/evening eggs, feed bags used, and mortality in seconds.",
    step4Title: "4. Get Instant Profit & AI Insights",
    step4Desc: "See live break-even price, monthly feed requirements, and AI guidance.",
    samplePreviewTitle: "Sample Output Preview",
    samplePreviewBadge: "Verified Reference Day Example",
    sampleNote: "Note: This is based on LayerOS verified reference day benchmark of 30,000 birds.",
    featuresGridTitle: "Core Capabilities",
    featMarathiFirst: "Marathi-First & Intuitive",
    featMarathiFirstDesc: "Full trilingual support across Marathi, Hindi, and English with authentic terminology.",
    featOffline: "Works Without Internet (PWA)",
    featOfflineDesc: "Save entries when offline at the farm shed; automatically syncs when network returns.",
    featMultiRole: "Multi-User Roles",
    featMultiRoleDesc: "Role-based access control for owners, managers, supervisors, and accountants.",
    featDataPrivate: "100% Private & Isolated",
    featDataPrivateDesc: "Strict tenant isolation via PostgreSQL RLS; no cross-farm data visibility.",
    featAiAdvisor: "Smart AI Advisor",
    featAiAdvisorDesc: "Instant biological analysis when production drops or feed intake spikes.",
    featPdfReports: "WhatsApp & PDF Reports",
    featPdfReportsDesc: "Share beautiful one-click daily summaries on WhatsApp or export to PDF/Excel.",
    trustTitle: "Trust, Security & Data Privacy",
    trustDesc: "Your farm records belong solely to you. LayerOS strictly complies with the Digital Personal Data Protection (DPDP) guidelines.",
    trustAiDisclaimer: "Important: The AI Advisor provides operational decision support and is not a substitute for a licensed veterinary prescription.",
    pricingTitle: "Simple & Transparent Pricing",
    pricingSubtitle: "Free trial available on all tiers. No credit card or hidden charges.",
    startFreeTrial: "Start Free Trial",
    enrollNow: "Enroll Now",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Do I need constant internet connection to use LayerOS?",
    faqA1: "No! LayerOS is an installable PWA. You can log eggs and feed offline at the farm shed. All entries are queued in IndexedDB and automatically sync once you reconnect.",
    faqQ2: "What information do I need to get started?",
    faqA2: "Just 3 basics: your farm name, current bird count, and current feed price. Everything else (sheds, customers, loans) can be added anytime later.",
    faqQ3: "Is my farm data safe and private?",
    faqA3: "Yes, 100%! We enforce strict multi-tenant Row Level Security. Your production, egg sales, and profit numbers can never be viewed by any other farm or third party.",
    faqQ4: "Can my farm supervisor or manager use this app?",
    faqA4: "Absolutely! You can invite supervisors with limited permissions to only enter daily egg and feed counts. Sensitive financial profits and loan balances remain visible only to the owner.",
    faqQ5: "What languages does LayerOS support?",
    faqA5: "LayerOS is fully trilingual in Marathi, Hindi, and English. You can switch languages seamlessly from the top bar with one tap.",
    faqQ6: "How much does LayerOS cost?",
    faqA6: "LayerOS is completely free for farms up to 5,000 birds! For larger commercial setups, we offer a free trial followed by transparent, affordable subscriptions.",
    faqQ7: "Can I try the app first without registering?",
    faqA7: "Yes! Simply click 'Try Demo' on the landing page to instantly test drive Sahyadri Layer Farm with 90 days of realistic history, charts, and AI advice.",
    enrollTitle: "Poultry Farm Enrollment",
    enrollStep1: "1. Owner Account",
    enrollStep2: "2. Farm Details",
    enrollStep3: "3. Sheds & Flocks",
    enrollStep4: "4. Feed & Costs",
    enrollStep5: "5. Egg Sales & Units",
    enrollStep6: "6. Expenses & Finance",
    enrollStep7: "7. Review & Launch",
    fullNameLabel: "Owner Full Name",
    mobileLabel: "Mobile Number (+91)",
    emailLabel: "Email Address",
    passwordLabel: "Password (min 8 chars & 1 number)",
    acceptTermsLabel: "I agree to the Terms of Service and DPDP Data Privacy Policy.",
    farmNameLabel: "Poultry Farm Name",
    villageLabel: "Village / Town",
    talukaLabel: "Taluka",
    districtLabel: "District",
    stateLabel: "State",
    pincodeLabel: "PIN Code",
    preferredLangLabel: "Preferred Language",
    numberOfShedsLabel: "Total Number of Sheds",
    batchCodeLabel: "Batch Code / Name",
    breedLabel: "Breed",
    birdsPlacedLabel: "Initial Birds Placed",
    currentBirdsLabel: "Current Live Birds",
    enrollAgeWeeksLabel: "Current Age (Weeks)",
    housingTypeLabel: "Housing Type",
    addFlockBtn: "+ Add Another Flock",
    removeFlockBtn: "Remove Flock",
    feedBagsPerDayLabel: "Feed Bags per Day (50 kg bags)",
    feedPricePerKgLabel: "Current Feed Price (₹ per kg)",
    bagSizeKgLabel: "Bag Weight (kg)",
    feedSupplierLabel: "Feed Supplier (Optional)",
    planningHorizonLabel: "Feed Planning Horizon",
    expectedFeedStockLabel: "Expected Feed Stock on Hand (kg)",
    traySizeLabel: "Tray Size (Eggs)",
    traysPerGattaLabel: "Trays per Peti/Gatta (Local Standard)",
    sellingPricePerEggLabel: "Current Selling Price (₹ per egg)",
    mainBuyerTypeLabel: "Primary Buyer Type",
    nearestMandiLabel: "Nearest Egg Mandi",
    monthlyLabourLabel: "Monthly Labour Wages (₹)",
    monthlyMedicineLabel: "Monthly Medicine & Vaccines (₹)",
    monthlyElectricityLabel: "Monthly Electricity & Diesel (₹)",
    monthlyOtherLabel: "Other Monthly Expenses (₹)",
    monthlyLoanEmiLabel: "Monthly Loan EMI (₹)",
    numberOfEmployeesLabel: "Number of Employees",
    createMyLayerOSBtn: "Create My LayerOS",
    savingEnrollment: "Setting up your farm...",
    welcomeTitle: "Congratulations! Your LayerOS is Ready",
    welcomeSubtitle: "Your farm configuration and calculation engine are ready.",
    nextAction1: "1. Log today’s eggs, feed & mortality",
    nextAction2: "2. Invite supervisor or staff",
    nextAction3: "3. View 30-day feed plan & profit",
    goToDashboardBtn: "Go to Dashboard",
    backToHome: "Homepage",
    statusPendingApprovalTitle: "Account Pending Approval",
    statusPendingApprovalDesc: "Your farm enrollment has been submitted successfully. Access will activate once verified and approved by the platform administrator.",
    statusSuspendedTitle: "Farm Account Suspended",
    statusSuspendedDesc: "This farm account is temporarily suspended. Please reach out to platform support to restore access.",
    statusRejectedTitle: "Farm Enrollment Rejected",
    statusRejectedDesc: "The enrollment request could not be approved due to validation discrepancies.",
    statusCancelledTitle: "Farm Subscription Cancelled",
    statusCancelledDesc: "This farm subscription has been discontinued.",
    statusReasonLabel: "Reason / Remarks",
    callSupportBtn: "Call Support",
    whatsappSupportBtn: "WhatsApp Support",
    switchFarmOrLogoutBtn: "Log Out / Switch Farm",
    adminTitle: "LayerOS Platform Admin",
    adminSubtitle: "Direct supervision & status control of enrolled poultry farms",
    adminNavDashboard: "Dashboard",
    adminNavFarms: "All Farms",
    adminNavApprovals: "Pending Approvals",
    adminNavOperators: "Operators",
    adminNavAuditLog: "Audit Log",
    adminNavSettings: "Platform Settings",
    adminLogoutBtn: "Admin Sign Out",
    adminApproveAction: "Approve Farm",
    adminRejectAction: "Reject Farm",
    adminSuspendAction: "Suspend Farm",
    adminReactivateAction: "Reactivate Farm",
    adminExtendPlanAction: "Extend Plan / Trial",
    adminSupportViewAction: "Support View",
    adminReasonPrompt: "Reason for action (required for DPDP audit):",
    adminReasonPlaceholder: "e.g., Contacted over phone, KYC verified, etc.",
    adminTotalFarms: "Total Farms",
    adminActiveFarms: "Active Farms",
    adminPendingFarms: "Pending Approval",
    adminSuspendedFarms: "Suspended Farms",
    adminTotalBirds: "Total Birds Managed",
    adminEstimatedMRR: "Estimated MRR",
    adminExpiringIn7Days: "Expiring in 7 Days",
    adminConfirmAction: "Confirm Action",
    adminCancelAction: "Cancel",
    adminSearchPlaceholder: "Search farm, owner or mobile...",
    adminExportCsv: "Export CSV",
    adminLoginTitle: "Platform Admin Sign In",
    adminLoginSubtitle: "Restricted to authorized Super Admins & Operators",
    adminEmailLabel: "Admin Email",
    adminPasswordLabel: "Password",
    adminTotpLabel: "2FA Security Code (TOTP)",
    adminLoginBtn: "Access Admin Console",
    adminDemoLoginNotice: "Demo credentials: admin@layeros.internal / SuperAdmin@2026",
    adminFilterAll: "All",
    adminRoleSuperAdmin: "Super Admin",
    adminRoleOperator: "Operator",
    adminSettingsEnrollmentMode: "Enrollment Mode",
    adminSettingsAutoApprove: "Auto-Approve New Farms",
    adminSettingsManualApproval: "Manual Approval Required",
    adminSettingsTrialDays: "Default Free Trial Duration (Days)",
    adminSettingsSupportPhone: "Support Helpline Number",
    adminSettingsSaveBtn: "Save Platform Settings",
  },
  hi: {
    appName: "LayerOS",
    tagline: "लेयर पोल्ट्री व अंडा व्यापार प्रबंधन प्रणाली",
    tryDemo: "बिना साइन-अप डेमो देखें",
    loginTitle: "अपने पोल्ट्री फार्म में लॉगिन करें",
    loginSubtitle: "अपना मोबाइल नंबर दर्ज करें और 30 सेकंड में शुरू करें",
    phonePlaceholder: "10 अंकों का मोबाइल नंबर",
    sendOtp: "ओटीपी (OTP) भेजें",
    enterOtp: "ओटीपी दर्ज करें (डेमो: 123456)",
    verifyOtp: "सत्यापित करें और शुरू करें",
    resendOtp: "ओटीपी पुनः भेजें",
    orContinueWith: "या सैंडबॉक्स डेमो का उपयोग करें",
    demoModeNotice: "आप सह्याद्री लेयर फार्म (30,000 मुर्गियां) डेमो मोड में हैं।",
    resetDemoData: "डेमो डेटा रीसेट करें",

    switchFarm: "फार्म बदलें",
    selectFarmTitle: "फार्म चुनें (Select Farm)",
    addNewFarm: "नया फार्म जोड़ें",
    switchRole: "भूमिका बदलें",
    switchRoleTitle: "भूमिका बदलें (Switch Role)",
    lightMode: "लाइट मोड चालू करें",
    darkMode: "डार्क मोड चालू करें",
    themeLight: "लाइट मोड चालू करें (Light Mode)",
    themeDark: "डार्क मोड चालू करें (Dark Mode)",
    notifications: "सूचनाएं",
    alertsTitle: "सूचनाएं (Alerts)",
    demoBadge: "डेमो मोड (सैंडबॉक्स)",
    postgresLive: "✓ पोस्टग्रेस लाइव",
    localMode: "लोकल ऑफलाइन मोड",
    birds: "पक्षी",
    weeks: "सप्ताह",

    navHome: "डैशबोर्ड",
    navQuickLog: "त्वरित प्रविष्टि (Quick Log)",
    navFlocks: "फ्लॉक व बैच",
    navSales: "अंडा बिक्री",
    navExpenses: "खर्च व खाते",
    navHealth: "टीकाकरण व स्वास्थ्य",
    navMarketRates: "मंडी भाव",
    navForecast: "30-दिवसीय अनुमान (AI)",
    navReports: "रिपोर्ट्स",
    navPublicTools: "मुफ्त कैलकुलेटर (Tools)",
    navSettings: "सेटिंग्स व कर्मचारी",
    navMore: "अन्य",

    roleOwner: "मालिक (Owner)",
    roleManager: "प्रबंधक (Manager)",
    roleSupervisor: "सुपरवाइजर (Supervisor)",
    roleAccountant: "मुनीम (Accountant)",
    roleViewer: "दर्शक (Viewer)",

    financialDecisionTitle: "दैनिक वित्तीय स्थिति",
    safeProfitStatusMsg: "आप आज सुरक्षित मुनाफे में हैं!",
    tightMarginWarningMsg: "सावधानी: अंडा बिक्री भाव ब्रेक-इवन के करीब है!",
    breakEvenRateLabel: "ब्रेक-इवन भाव",
    sellingRateLabel: "बिक्री भाव",
    profitMarginLabel: "मार्जिन",
    dailyOperatingCashProfit: "आज का नकद मुनाफा (Cash)",
    dailyTrueNetProfit: "सच्चा कुल लाभ (True Profit)",
    activeBirds: "सक्रिय मुर्गियां",
    birdsLostToday: "आज मृत्यु",
    eggsToday: "आज के अंडे",
    hdPercentage: "हेन-डे (HD%)",
    productionPercentage: "उत्पादन प्रतिशत",
    feedUsed: "खपत दाना (किलो)",
    feedPerBird: "प्रति मुर्गी दाना",
    feedRecommendedTomorrow: "कल का अनुशंसित दाना",
    mortality: "मृत्यु (संख्या)",
    mortalityRate: "मृत्यु दर %",
    eggStock: "स्टॉक में अंडे",
    breakEvenPrice: "ब्रेक-इवन अंडा भाव",
    costPerEgg: "प्रति अंडा लागत",
    sellingRate: "आज का बिक्री भाव",
    todayMarketRate: "आज का मंडी भाव",
    fcrDozenLabel: "FCR (प्रति दर्जन)",
    targetHdLabel: "टार्गेट HD%",
    birdsDeadToday: "आज मृत",
    ageWeeksLabel: "सप्ताह",
    vsYesterday: "कल की तुलना में",
    standardLabel: "मानक",
    targetFeedGrams: "टार्गेट",
    withinDailyLimit: "दैनिक सीमा में ✓",
    revenueBreakdownHint: "अंडे + खाली बोरियां + खाद",
    feedRatePerKgHint: "₹35.00 प्रति किलो दर",
    bankAndCashSplit: "बैंक: ₹3.6L • नकद: ₹68,500",
    overdueDaysHint: "15 ग्राहक • ₹60,000 बकाया (21+ दिन)",

    // Environment & Climate Automation
    climateAutomationTitle: "शेड का वातावरण व ऑटोमेशन (Climate & Sensors)",
    iotSensorsConnected: "IoT सेंसर कनेक्टेड",
    maxTempLabel: "अधिकतम तापमान",
    minTempLabel: "न्यूनतम",
    humidityLabel: "आर्द्रता (RH)",
    humidityNormal: "उपयुक्त स्तर (55-65%)",
    ammoniaLabel: "अमोनिया (NH₃)",
    ammoniaSafe: "सुरक्षित (सीमा < 25 ppm)",
    lightingScheduleLabel: "प्रकाश अनुसूची",
    lightingHours: "16 घंटे",
    lightingTimeRange: "सुबह 5 से रात 9",
    exhaustFansLabel: "एग्जॉस्ट पंखे (Exhaust Fans)",
    fansRunning: "चालू (सक्रिय)",
    fansOff: "बंद",
    turnOn: "चालू करें",
    turnOff: "बंद करें",
    heaterLabel: "ब्रूडर हीटर (Brooder Heaters)",
    heaterActive: "चालू",

    // Breed Standard & Tabs
    breedStandardChart: "BV-300 ब्रीड मानक चार्ट",
    batchPLTab: "बैच संचित लाभ/हानि (P&L)",

    revenueToday: "आज का कुल राजस्व",
    feedCostToday: "आज का दाना खर्च",
    operatingProfit: "दैनिक परिचालन लाभ (Cash)",
    trueProfit: "सच्चा लाभ (True Profit)",
    simpleProfit: "सरल लाभ",
    cashBalance: "नकद / बैंक बैलेंस",
    outstandingReceivables: "ग्राहकों की उधारी",
    profitStatusSafe: "सुरक्षित मार्जिन",
    profitStatusWarning: "कम मार्जिन (सावधानी)",
    profitStatusLoss: "घाटे में बिक्री",

    quickLogTitle: "30-सेकंड त्वरित प्रविष्टि",
    quickLogSubtitle: "रोजाना डेटा दर्ज करें और एक क्लिक में दिन बंद करें",
    eggsCollectedLabel: "एकत्रित अंडे",
    feedUsedLabel: "उपयोग किया गया दाना (किलो)",
    mortalityLabel: "आज की मृत्यु (संख्या)",
    saleQtyLabel: "बेचे गए अंडे (वैकल्पिक)",
    saleRateLabel: "बिक्री भाव प्रति 100 / अंडा",
    saveAndCloseDay: "सहेजें और दिन बंद करें",
    saving: "सहेज रहा है...",
    dayClosedSuccess: "दिन सफलतापूर्वक बंद हुआ! AI विश्लेषण तैयार है।",
    yesterdayHint: "कल: ",

    fullEntryTitle: "विस्तृत दैनिक प्रविष्टि (2 मिनट)",
    sectionBirds: "1. पक्षी गणना व मृत्यु विवरण",
    sectionEggs: "2. अंडा संकलन व ग्रेडिंग",
    sectionFeed: "3. दाना वितरण व शेष स्टॉक",
    sectionHealth: "4. टीकाकरण व दवाइयां",
    sectionEnvironment: "5. शेड का वातावरण (तापमान/पंखा)",
    sectionSales: "6. ग्राहक अनुसार बिक्री",
    sectionExpenses: "7. आज के खर्चे",

    flocksAndBatches: "फ्लॉक व बैच प्रबंधन",
    activeBatch: "सक्रिय बैच",
    newBatch: "नई बैच पंजीकरण",
    newShed: "नया शेड जोड़ें",
    selectBatch: "बैच चुनें",
    batchOverview: "बैच विवरण",
    breedStandards: "BV-300 ब्रीड मानक",
    batchPL: "बैच संचित लाभ/हानि",
    initialChicks: "आरंभिक चूजे",
    chickCost: "प्रति चूजा लागत",
    cumulativeMortality: "कुल मृत्यु",
    livability: "जीवित दर",
    hatcherySource: "हैचरी स्रोत",
    placementDate: "प्लेसमेंट दिनांक",
    shedDistribution: "शेड अनुसार पक्षी वितरण",
    birdCapacity: "पक्षी क्षमता",
    cageMethod: "एलिवेटेड केज प्रणाली",
    sensorsActive: "IoT सेंसर सक्रिय ✓",
    phaseChange: "चरण बदलें",
    cullBatch: "बैच समाप्त करें (कलिंग)",
    closeBatchConfirm: "क्या आप इस बैच को समाप्त करना चाहते हैं?",

    salesList: "बिक्री आदेश सूची",
    newSale: "नई बिक्री प्रविष्टि",
    customerLedger: "ग्राहक उधारी खाता",
    agingReport: "उधारी समय विश्लेषण (Aging)",
    invoiceNumber: "बिल / इनवॉइस #",
    vehicleNumber: "गाड़ी नंबर",
    driverName: "चालक / डिलीवरी व्यक्ति",
    grossAmount: "कुल राशि",
    discount: "छूट (Discount)",
    netAmount: "शुद्ध राशि",
    paidAmount: "प्राप्त राशि",
    paymentStatus: "भुगतान स्थिति",
    paidStatusPaid: "पूर्ण भुगतान",
    paidStatusPartial: "आंशिक भुगतान",
    paidStatusPending: "बकाया (उधारी)",
    recordPayment: "भुगतान दर्ज करें",

    feedStock: "दाना स्टॉक (Feed Stock)",
    feedTypes: "दाने के प्रकार",
    reorderAlert: "दाना समाप्त होने वाला है!",
    dailyExpenseEntry: "खर्च जोड़ें",
    labourCost: "मजदूरी खर्च",
    electricityCost: "बिजली बिल",
    medicineCost: "दवा व उपचार खर्च",

    toolsTitle: "मुफ्त पोल्ट्री टूल्स व कैलकुलेटर",
    unitConverter: "अंडा यूनिट कन्वर्टर (ट्रे, गट्टा, सैकड़ा)",
    breakEvenCalc: "ब्रेक-इवन अंडा भाव कैलकुलेटर",
    fcrCalc: "FCR कैलकुलेटर (Feed Conversion Ratio)",

    teamMembers: "फार्म कर्मचारी व भूमिकाएं",
    inviteStaff: "नए कर्मचारी को आमंत्रित करें",
    deactivateMember: "अनुमति रद्द करें",

    billingAndPlans: "सदस्यता और योजनाएं",
    currentPlan: "वर्तमान योजना",
    upgradePlan: "योजना अपग्रेड करें",
    planActiveStatus: "सक्रिय (Active)",
    planTrialStatus: "ट्रायल (Trial)",
    birdCapacityUsage: "पक्षी क्षमता उपयोग",
    shedCapacityUsage: "शेड क्षमता",
    staffCapacityUsage: "स्टाफ खाते उपयोग",
    invoicesAndReceipts: "चालान व रसीदें (Invoices)",
    monthlyBilling: "मासिक बिलिंग",
    yearlyBilling: "वार्षिक बिलिंग",
    saveAnnualDiscount: "१७% छूट (२ माह मुफ्त)",
    paymentSuccess: "भुगतान सफल! योजना सक्रिय कर दी गई है।",
    upgradeNow: "अभी अपग्रेड करें",
    manageSubscription: "सदस्यता प्रबंधन",
    planLimitsHeader: "योजना सीमा व संसाधन उपयोग",

    unitEgg: "प्रति अंडा",
    unitPer100: "प्रति 100 अंडे",
    unitTray: "ट्रे (30 अंडे)",
    unitGatta: "गट्टा / पेटी (210 अंडे)",
    unitCarton: "कार्टन / बॉक्स (360 अंडे)",

    aiAdvisorTitle: "AI फार्म सलाहकार",
    todaysActionTitle: "आज की 3 प्रमुख प्राथमिकताएं",
    aiActionPrioritySubtitle: "AI एनालिटिक्स व दैनिक आंकड़ों पर आधारित तात्कालिक कार्य",
    aiPriorityBadge: "AI प्राथमिकता",
    smartAlertsTitle: "स्मार्ट अलर्ट",
    askLayerOs: "LayerOS से पूछें (AI)",
    askPlaceholder: "जैसे: पिछले सप्ताह प्रति अंडा लागत क्या थी? या किस ग्राहक पर सबसे अधिक उधारी है?",
    forecast30Days: "30-दिवसीय लाभ/हानि व नकदी प्रवाह अनुमान",
    whatIfSimulator: "व्हाट-इफ सिम्युलेटर",

    save: "सहेजें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    search: "खोजें...",
    filter: "फ़िल्टर",
    exportPdf: "PDF निर्यात",
    exportExcel: "Excel में डाउनलोड",
    shareWhatsApp: "WhatsApp पर शेयर करें",
    date: "दिनांक",
    customer: "ग्राहक",
    amount: "राशि (₹)",
    status: "स्थिति",

    landingEnrollBtn: "अपना पोल्ट्री फार्म दर्ज करें",
    landingLoginBtn: "लॉगिन",
    heroHeadline: "हर अंडे का सटीक हिसाब. अधिकतम मुनाफा.",
    heroSubtitle: "महाराष्ट्र और भारत के कमर्शियल लेयर पोल्ट्री फार्म मालिकों के लिए बनाया गया आधुनिक डिजिटल ऐप.",
    heroEnrollCta: "अपना पोल्ट्री फार्म दर्ज करें",
    heroAlreadyRegistered: "पहले से खाता है? लॉगिन करें",
    heroTryDemo: "सीधा डेमो देखें (Try Demo)",
    whatIsTitle: "LayerOS क्या है?",
    whatIsDesc: "LayerOS कमर्शियल लेयर पोल्ट्री फार्म मालिकों के लिए बनाया गया स्मार्ट मोबाइल ऐप है जो रोज़ की डायरी-रजिस्टर को हटाता है। यह मालिक को तुरंत बताता है कि आज फार्म मुनाफे में है या नुकसान में, कितना दाना लगेगा और कल क्या निर्णय लेने चाहिए।",
    whoIsTitle: "यह ऐप किसके लिए है?",
    whoOwner: "फार्म मालिक (Owner)",
    whoOwnerDesc: "दैनिक लाभ-हानि, नकद बही-खाता, ब्रेक-इवन दर और 30 दिनों का वित्तीय पूर्वानुमान।",
    whoSupervisor: "सुपरवाइजर (Supervisor)",
    whoSupervisorDesc: "केवल 30 सेकंड में सुबह-शाम के अंडे, दाना और मृत्यु दर की प्रविष्टि।",
    whoAccountant: "लेखाकार / मुनीम (Accountant)",
    whoAccountantDesc: "अंडा बिक्री बिलिंग, उधारी खाता, खर्च रसीदें और बैंक लोन।",
    whoVet: "पशु चिकित्सक (Vet - Read Only)",
    whoVetDesc: "टीकाकरण शेड्यूल, मृत्यु दर रुझान, दवाइयां और फ्लॉक स्वास्थ्य रिपोर्ट।",
    whatYouEnterTitle: "आप क्या दर्ज करते हैं?",
    whatYouEnterSubtitle: "समय बचाने वाला सरल इंटरफ़ेस: क्विक मोड में 30 सेकंड और पूर्ण प्रविष्टि में सिर्फ 2 मिनट!",
    enterEggs: "दैनिक अंडा उत्पादन",
    enterEggsDesc: "सुबह और शाम का अंडा संग्रह, टूटे व पतले छिलके के अंडे।",
    enterMortality: "मृत्यु और छंटाई (Mortality)",
    enterMortalityDesc: "रोजाना मृत पक्षी और कुल जीवित मुर्गियां।",
    enterFeed: "दाना खपत (Feed)",
    enterFeedDesc: "रोजाना खर्च हुई बोरियां या किलोग्राम दाना।",
    enterSales: "बिक्री और उधारी",
    enterSalesDesc: "व्यापारी दर, बिके हुए अंडे (ट्रे/गट्टा) और नकद या उधारी।",
    enterExpenses: "अन्य खर्च व दवाइयां",
    enterExpensesDesc: "मजदूरी, दवाइयां, डीजल, बिजली और लोन की किस्त।",
    whatYouGetTitle: "आपको क्या मिलता है?",
    getHd: "हेन-डे प्रतिशत (HD %)",
    getFeedPerBird: "प्रति मुर्गी दाना (g/bird)",
    getBreakEven: "ब्रेक-इवन अंडा भाव",
    getBreakEvenDesc: "ट्रैफिक-लाइट अलर्ट: आज लाभ है या नुकसान?",
    getTrueProfit: "सच्चा मुनाफा बनाम नकद मुनाफा",
    getTrueProfitDesc: "मुर्गी मूल्यह्रास, पुलेट लागत और ऋण ब्याज जोड़कर वास्तविक आर्थिक लाभ।",
    getFeedForecast: "मासिक दाना आवश्यकता व लागत",
    getAiAdvice: "AI दैनिक सलाहकार",
    getAiAdviceDesc: "कल के लिए 3 सबसे महत्वपूर्ण कदम और वैज्ञानिक सुझाव।",
    getMandiTrends: "मंडी दर और होल्ड/सेल सलाह",
    howItWorksTitle: "यह कैसे काम करता है? (4 आसान कदम)",
    step1Title: "१. फार्म का निःशुल्क पंजीकरण करें",
    step1Desc: "अपना नाम, मोबाइल नंबर और फार्म का पता दर्ज करें।",
    step2Title: "२. शेड और मुर्गियों की जानकारी भरें",
    step2Desc: "नस्ल, उम्र, दाना और स्थानीय ट्रे/गट्टा साइज एक बार सेट करें।",
    step3Title: "३. रोज़ाना केवल 30 सेकंड में प्रविष्टि करें",
    step3Desc: "सुबह-शाम के अंडे, दाने की बोरियां और मृत पक्षी दर्ज करें।",
    step4Title: "४. तुरंत लाभ, विश्लेषण और AI सलाह पाएं",
    step4Desc: "ब्रेक-इवन दर, महीने का खर्च, दाना योजना और AI मार्गदर्शन देखें।",
    samplePreviewTitle: "नमूना रिपोर्ट और वास्तविक उदाहरण",
    samplePreviewBadge: "सत्यापित संदर्भ उदाहरण (Sample Reference)",
    sampleNote: "नोट: यह 30,000 मुर्गियों के सत्यापित संदर्भ दिन पर आधारित उदाहरण है।",
    featuresGridTitle: "LayerOS की मुख्य विशेषताएं",
    featMarathiFirst: "सरल और क्षेत्रीय भाषा",
    featMarathiFirstDesc: "मराठी, हिंदी और अंग्रेजी में स्पष्ट भाषा, किसान-अनुकूल डिजाइन।",
    featOffline: "बिना इंटरनेट के काम करता है (PWA)",
    featOfflineDesc: "फार्म पर नेटवर्क न होने पर भी काम करता है, नेटवर्क आने पर ऑटो-सिंक।",
    featMultiRole: "कर्मचारी और सुपरवाइजर रोल",
    featMultiRoleDesc: "मालिक, प्रबंधक, सुपरवाइजर और मुनीम के लिए अलग-अलग अनुमतियां।",
    featDataPrivate: "१००% सुरक्षित और निजी डेटा",
    featDataPrivateDesc: "कड़ी सुरक्षा, किसी अन्य फार्म को आपका डेटा दिखाई नहीं देता।",
    featAiAdvisor: "स्मार्ट AI सलाहकार",
    featAiAdvisorDesc: "उत्पादन घटने या दाना अधिक लगने पर तुरंत वैज्ञानिक विश्लेषण।",
    featPdfReports: "व्हाट्सएप और PDF रिपोर्ट्स",
    featPdfReportsDesc: "एक क्लिक में दैनिक रिपोर्ट व्हाट्सएप पर भेजें या PDF डाउनलोड करें।",
    trustTitle: "विश्वास, सुरक्षा और डेटा गोपनीयता",
    trustDesc: "आपके फार्म का डेटा आपकी निजी संपत्ति है। LayerOS डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) नियमों का पूरी तरह पालन करता है।",
    trustAiDisclaimer: "महत्वपूर्ण सूचना: AI सलाहकार केवल निर्णय लेने में सहायता के लिए है, यह पशु चिकित्सक का विकल्प नहीं है।",
    pricingTitle: "सरल और पारदर्शी योजनाएं",
    pricingSubtitle: "सभी योजनाओं में निःशुल्क ट्रायल उपलब्ध। कोई छिपा हुआ शुल्क नहीं।",
    startFreeTrial: "निःशुल्क ट्रायल शुरू करें",
    enrollNow: "अभी दर्ज करें",
    faqTitle: "अक्सर पूछे जाने वाले सवाल (FAQ)",
    faqQ1: "क्या LayerOS का उपयोग करने के लिए हमेशा इंटरनेट चाहिए?",
    faqA1: "नहीं! LayerOS बिना इंटरनेट के भी काम करता है। फार्म पर नेटवर्क न होने पर भी आप एंट्री कर सकते हैं, इंटरनेट आने पर डेटा अपने आप सिंक हो जाएगा।",
    faqQ2: "शुरू करने के लिए मुझे क्या जानकारी चाहिए?",
    faqA2: "सिर्फ 3 बातें: फार्म का नाम, मुर्गियों की संख्या और दाने का भाव। बाकी सब आप बाद में कभी भी जोड़ सकते हैं।",
    faqQ3: "क्या मेरा डेटा सुरक्षित और गोपनीय रहेगा?",
    faqA3: "हाँ, 100%! हर फार्म का डेटा पूरी तरह अलग और सुरक्षित रहता है। आपका मुनाफा और अंडे की बिक्री किसी अन्य फार्म को कभी नहीं दिखती।",
    faqQ4: "क्या मेरा सुपरवाइजर या मैनेजर इस ऐप का उपयोग कर सकता है?",
    faqA4: "बिल्कुल! आप सुपरवाइजर को सिर्फ दाना और अंडा दर्ज करने की अनुमति दे सकते हैं। लाभ-हानि का हिसाब केवल मालिक ही देख सकता है।",
    faqQ5: "यह ऐप किन भाषाओं में उपलब्ध है?",
    faqA5: "LayerOS मराठी, हिंदी और अंग्रेजी तीनों भाषाओं में उपलब्ध है। आप एक क्लिक में भाषा बदल सकते हैं।",
    faqQ6: "LayerOS का कितना शुल्क है?",
    faqA6: "5,000 पक्षियों तक के फार्म के लिए यह पूरी तरह निःशुल्क है! बड़े फार्म्स के लिए फ्री ट्रायल उपलब्ध है।",
    faqQ7: "क्या मैं बिना पंजीकरण किए पहले ऐप देख सकता हूँ?",
    faqA7: "हाँ! मुख्य पृष्ठ पर 'Try Demo' बटन दबाकर आप 90 दिनों के वास्तविक डेटा के साथ पूरा ऐप आज़मा सकते हैं।",
    enrollTitle: "नया पोल्ट्री फार्म पंजीकरण",
    enrollStep1: "१. मालिक का खाता",
    enrollStep2: "२. फार्म विवरण",
    enrollStep3: "३. शेड व मुर्गियां",
    enrollStep4: "४. दाना व लागत",
    enrollStep5: "५. अंडा बिक्री व इकाइयां",
    enrollStep6: "६. अन्य खर्च व ऋण",
    enrollStep7: "७. समीक्षा व शुरुआत",
    fullNameLabel: "मालिक का पूरा नाम",
    mobileLabel: "मोबाइल नंबर (+91)",
    emailLabel: "ईमेल पता",
    passwordLabel: "पासवर्ड (कम से कम 8 अक्षर व 1 अंक)",
    acceptTermsLabel: "मैं नियम, शर्तें और DPDP डेटा गोपनीयता नीति स्वीकार करता हूँ।",
    farmNameLabel: "पोल्ट्री फार्म का नाम",
    villageLabel: "गांव / शहर",
    talukaLabel: "तालुका",
    districtLabel: "जिला",
    stateLabel: "राज्य",
    pincodeLabel: "पिन कोड",
    preferredLangLabel: "पसंदीदा भाषा",
    numberOfShedsLabel: "कुल शेड्स की संख्या",
    batchCodeLabel: "बैच कोड / नाम",
    breedLabel: "नस्ल (Breed)",
    birdsPlacedLabel: "शुरू में रखी गई मुर्गियां",
    currentBirdsLabel: "वर्तमान जीवित मुर्गियां",
    enrollAgeWeeksLabel: "वर्तमान आयु (सप्ताह)",
    housingTypeLabel: "शेड का प्रकार (Housing)",
    addFlockBtn: "+ एक और बैच जोड़ें",
    removeFlockBtn: "बैच हटाएं",
    feedBagsPerDayLabel: "प्रतिदिन दाने की बोरियां (50 किग्रा)",
    feedPricePerKgLabel: "दाने का वर्तमान भाव (₹ प्रति किग्रा)",
    bagSizeKgLabel: "बोरी का वजन (किग्रा)",
    feedSupplierLabel: "दाना आपूर्तिकर्ता (वैकल्पिक)",
    planningHorizonLabel: "दाना योजना अवधि",
    expectedFeedStockLabel: "वर्तमान दाना स्टॉक (किग्रा)",
    traySizeLabel: "ट्रे का साइज (अंडे)",
    traysPerGattaLabel: "एक गट्टे/पेटी में कितने ट्रे?",
    sellingPricePerEggLabel: "अंडे का वर्तमान विक्रय दर (₹ प्रति अंडा)",
    mainBuyerTypeLabel: "मुख्य ग्राहक प्रकार",
    nearestMandiLabel: "निकटतम अंडा मंडी",
    monthlyLabourLabel: "मासिक मजदूरी खर्च (₹)",
    monthlyMedicineLabel: "मासिक दवाइयां व टीके (₹)",
    monthlyElectricityLabel: "मासिक बिजली व डीजल (₹)",
    monthlyOtherLabel: "अन्य मासिक खर्च (₹)",
    monthlyLoanEmiLabel: "मासिक लोन किस्त/EMI (₹)",
    numberOfEmployeesLabel: "कुल कर्मचारियों की संख्या",
    createMyLayerOSBtn: "मेरा LayerOS बनाएं",
    savingEnrollment: "आपका फार्म तैयार हो रहा है...",
    welcomeTitle: "बधाई हो! आपका LayerOS तैयार है",
    welcomeSubtitle: "आपके फार्म की गणना और व्यवस्था तैयार है।",
    nextAction1: "१. आज के अंडे, दाना और मृत्यु दर्ज करें",
    nextAction2: "२. सुपरवाइजर या कर्मचारी को आमंत्रित करें",
    nextAction3: "३. 30 दिन का दाना प्लान और लाभ देखें",
    goToDashboardBtn: "डैशबोर्ड पर जाएं",
    backToHome: "होमपेज",
    statusPendingApprovalTitle: "खाता स्वीकृति लंबित है",
    statusPendingApprovalDesc: "आपके पोल्ट्री फार्म का पंजीकरण प्राप्त हो गया है। व्यवस्थापक द्वारा स्वीकृति मिलते ही आपका खाता सक्रिय हो जाएगा।",
    statusSuspendedTitle: "फार्म खाता अस्थायी रूप से निलंबित है",
    statusSuspendedDesc: "प्रशासनिक या बिलिंग कारणों से यह खाता निलंबित किया गया है। समाधान के लिए संपर्क करें।",
    statusRejectedTitle: "फार्म पंजीकरण अस्वीकृत किया गया",
    statusRejectedDesc: "सत्यापन विसंगतियों के कारण पंजीकरण स्वीकार नहीं किया जा सका।",
    statusCancelledTitle: "फार्म सदस्यता रद्द की गई",
    statusCancelledDesc: "इस फार्म की सदस्यता समाप्त कर दी गई है।",
    statusReasonLabel: "कारण / विवरण",
    callSupportBtn: "कॉल करें",
    whatsappSupportBtn: "व्हाट्सएप सहायता",
    switchFarmOrLogoutBtn: "लॉगआउट या फार्म बदलें",
    adminTitle: "LayerOS प्लेटफॉर्म एडमिन",
    adminSubtitle: "पंजीकृत पोल्ट्री फार्म्स का नियंत्रण व पर्यवेक्षण",
    adminNavDashboard: "डैशबोर्ड",
    adminNavFarms: "सभी फार्म्स",
    adminNavApprovals: "लंबित स्वीकृतियां",
    adminNavOperators: "ऑपरेटर्स",
    adminNavAuditLog: "ऑडिट लॉग",
    adminNavSettings: "प्लेटफॉर्म सेटिंग्स",
    adminLogoutBtn: "एडमिन लॉगआउट",
    adminApproveAction: "स्वीकृत करें (Approve)",
    adminRejectAction: "अस्वीकृत करें (Reject)",
    adminSuspendAction: "निलंबित करें (Suspend)",
    adminReactivateAction: "पुनः सक्रिय करें",
    adminExtendPlanAction: "प्लान / ट्रायल बढ़ाएं",
    adminSupportViewAction: "सपोर्ट व्यू",
    adminReasonPrompt: "कार्रवाई का कारण दर्ज करें (अनिवार्य):",
    adminReasonPlaceholder: "उदा. फोन पर संपर्क हुआ, दस्तावेज सत्यापित हुए, आदि।",
    adminTotalFarms: "कुल फार्म्स",
    adminActiveFarms: "सक्रिय फार्म्स",
    adminPendingFarms: "मंजूरी लंबित",
    adminSuspendedFarms: "निलंबित फार्म्स",
    adminTotalBirds: "कुल पक्षी क्षमता",
    adminEstimatedMRR: "अनुमानित मासिक राजस्व",
    adminExpiringIn7Days: "७ दिनों में समाप्त होने वाले प्लान",
    adminConfirmAction: "पुष्टि करें",
    adminCancelAction: "रद्द करें",
    adminSearchPlaceholder: "फार्म, मालिक या मोबाइल खोजें...",
    adminExportCsv: "CSV डाउनलोड",
    adminLoginTitle: "प्लेटफॉर्म एडमिन लॉगिन",
    adminLoginSubtitle: "केवल अधिकृत सुपर एडमिन और ऑपरेटर्स के लिए",
    adminEmailLabel: "एडमिन ईमेल",
    adminPasswordLabel: "पासवर्ड",
    adminTotpLabel: "2FA सुरक्षा कोड (TOTP)",
    adminLoginBtn: "कंसोल में प्रवेश करें",
    adminDemoLoginNotice: "डेमो क्रेडेंशियल्स: admin@layeros.internal / SuperAdmin@2026",
    adminFilterAll: "सभी",
    adminRoleSuperAdmin: "सुपर एडमिन",
    adminRoleOperator: "ऑपरेटर",
    adminSettingsEnrollmentMode: "पंजीकरण स्वीकृति मोड",
    adminSettingsAutoApprove: "स्वतः स्वीकृत करें (Auto-Approve)",
    adminSettingsManualApproval: "मैन्युअल स्वीकृति आवश्यक (Manual)",
    adminSettingsTrialDays: "डिफ़ॉल्ट नि:शुल्क परीक्षण अवधि (दिन)",
    adminSettingsSupportPhone: "सपोर्ट हेल्पलाइन नंबर",
    adminSettingsSaveBtn: "सेटिंग्स सहेजें",
  }
};
