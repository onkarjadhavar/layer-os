/**
 * LayerOS Translations
 * Marathi-first, English, Hindi dictionaries with authentic poultry farming terminology
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
  navSettings: string;
  navMore: string;

  // Roles
  roleOwner: string;
  roleManager: string;
  roleSupervisor: string;
  roleAccountant: string;
  roleViewer: string;

  // Farm & Flock
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

  // Egg Units
  unitEgg: string;
  unitPer100: string;
  unitTray: string;
  unitGatta: string;
  unitCarton: string;

  // AI & Advice
  aiAdvisorTitle: string;
  todaysActionTitle: string;
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

    navHome: "मुख्य डॅशबोर्ड",
    navQuickLog: "झटपट नोंदणी (Quick Log)",
    navFlocks: "फ्लॉक्स / बॅच",
    navSales: "अंडी विक्री",
    navExpenses: "खर्च व खाती",
    navHealth: "लसीकरण व आरोग्य",
    navMarketRates: "बाजार भाव (Mandi)",
    navForecast: "३०-दिवसीय अंदाज (AI)",
    navReports: "अहवाल (Reports)",
    navSettings: "सेटिंग्ज",
    navMore: "इतर पर्याय",

    roleOwner: "मालक (Owner)",
    roleManager: "व्यवस्थापक (Manager)",
    roleSupervisor: "सुपरवायझर (Supervisor)",
    roleAccountant: "हिशोबनीस (Accountant)",
    roleViewer: "तपासनीस (Viewer)",

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

    unitEgg: "प्रति अंडे",
    unitPer100: "प्रति १०० अंडी",
    unitTray: "ट्रे (३० अंडी)",
    unitGatta: "गट्टा / पेटी",
    unitCarton: "कार्टन / बॉक्स",

    aiAdvisorTitle: "AI दैनिक सल्लागार",
    todaysActionTitle: "उद्यासाठी सर्वोच्च ३ महत्त्वाच्या कृती",
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
  },
  en: {
    appName: "LayerOS",
    tagline: "AI-Powered Layer Poultry & Egg Business ERP",
    tryDemo: "Try Demo Without Signup",
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

    navHome: "Dashboard",
    navQuickLog: "Quick Log",
    navFlocks: "Flocks & Batches",
    navSales: "Egg Sales",
    navExpenses: "Expenses & Accounts",
    navHealth: "Vaccine & Health",
    navMarketRates: "Market Rates",
    navForecast: "AI 30-Day Forecast",
    navReports: "Reports",
    navSettings: "Settings",
    navMore: "More",

    roleOwner: "Owner",
    roleManager: "Manager",
    roleSupervisor: "Supervisor",
    roleAccountant: "Accountant",
    roleViewer: "Viewer",

    activeBirds: "Active Birds",
    birdsLostToday: "Lost Today",
    eggsToday: "Eggs Today",
    hdPercentage: "HD% (Hen-Day)",
    productionPercentage: "Production %",
    feedUsed: "Feed Used Today",
    feedPerBird: "Feed per Bird",
    feedRecommendedTomorrow: "Target Feed Tomorrow",
    mortality: "Mortality (Birds)",
    mortalityRate: "Mortality Rate %",
    eggStock: "Egg Stock in Shed",
    breakEvenPrice: "Break-Even Price",
    costPerEgg: "Cost per Egg",
    sellingRate: "Today's Selling Price",
    todayMarketRate: "Today's Market Rate",

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

    unitEgg: "Per Egg",
    unitPer100: "Per 100 Eggs",
    unitTray: "Tray (30 Eggs)",
    unitGatta: "Gatta / Case",
    unitCarton: "Carton (360)",

    aiAdvisorTitle: "AI Farm Advisor",
    todaysActionTitle: "Top 3 Priorities for Tomorrow",
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

    navHome: "डैशबोर्ड",
    navQuickLog: "त्वरित प्रविष्टि (Quick Log)",
    navFlocks: "फ्लॉक व बैच",
    navSales: "अंडा बिक्री",
    navExpenses: "खर्च व खाते",
    navHealth: "टीकाकरण व स्वास्थ्य",
    navMarketRates: "मंडी भाव",
    navForecast: "30-दिवसीय अनुमान (AI)",
    navReports: "रिपोर्ट्स",
    navSettings: "सेटिंग्स",
    navMore: "अन्य",

    roleOwner: "मालिक (Owner)",
    roleManager: "प्रबंधक (Manager)",
    roleSupervisor: "सुपरवाइजर (Supervisor)",
    roleAccountant: "मुनीम (Accountant)",
    roleViewer: "दर्शक (Viewer)",

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

    unitEgg: "प्रति अंडा",
    unitPer100: "प्रति 100 अंडे",
    unitTray: "ट्रे (30 अंडे)",
    unitGatta: "गट्टा / पेटी",
    unitCarton: "कार्टन / बॉक्स",

    aiAdvisorTitle: "AI फार्म सलाहकार",
    todaysActionTitle: "कल के लिए 3 प्रमुख प्राथमिकताएं",
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
  }
};
