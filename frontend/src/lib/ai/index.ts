/**
 * LayerOS AI Engine (/lib/ai)
 * Provider-agnostic service for daily analysis, feed optimization,
 * 30-day statistical forecasting, and conversational Q&A assistant.
 */

import { DailyRecord, Flock, Customer, MarketRate, VaccinationTask } from '../store/seedData';
import { calculateDailyMetrics, DEFAULT_UNIT_SETTINGS, formatIndianCurrency } from '../calc';

export interface AIAnalysisOutput {
  runDate: string;
  healthScore: number;
  scoreBreakdown: {
    productionScore: number; // 0-25
    feedEfficiencyScore: number; // 0-25
    mortalityScore: number; // 0-25
    profitabilityScore: number; // 0-25
  };
  summaryMr: string[];
  summaryEn: string[];
  risks: Array<{
    severity: 'critical' | 'warning' | 'info';
    titleMr: string;
    titleEn: string;
    evidence: string;
    probableCauses: string;
    suggestedCheck: string;
  }>;
  actions: Array<{
    priority: number;
    titleMr: string;
    titleEn: string;
    detailMr: string;
    detailEn: string;
    category: 'feed' | 'sales' | 'health' | 'finance';
  }>;
  feedRecommendation: {
    suggestedKgTomorrow: number;
    targetGramsPerBird: number;
    formulaExplanation: string;
  };
  salesRecommendation: {
    verdict: 'hold' | 'sell_all' | 'normal';
    priorityBuyerName: string;
    reasonMr: string;
    reasonEn: string;
  };
  disclaimer: string;
}

export function generateDailyAIAnalysis(
  today: DailyRecord | null | undefined,
  pastRecords: DailyRecord[],
  flock: Flock,
  customers: Customer[],
  marketRates: MarketRate[],
  vaccinations: VaccinationTask[]
): AIAnalysisOutput {
  const liveBirds = today?.closingBirds ?? flock.currentBirdCount ?? 10000;
  const recommendedGrams = 110.5;
  const suggestedFeedTomorrow = Math.round((liveBirds * recommendedGrams) / 1000);
  const bags = Math.max(1, Math.round(suggestedFeedTomorrow / 50));

  // If no entry exists for today
  if (!today) {
    const puneRate = marketRates.find(m => m.mandiName.includes('Pune'))?.ratePerEgg || 5.40;
    return {
      runDate: new Date().toISOString().split('T')[0],
      healthScore: 100,
      scoreBreakdown: {
        productionScore: 25,
        feedEfficiencyScore: 25,
        mortalityScore: 25,
        profitabilityScore: 25,
      },
      summaryMr: [
        `आजची दैनंदिन नोंद अद्याप प्रलंबित आहे. नोंद पूर्ण केल्यानंतर अचूक हेन-डे % व नफा दिसेल.`,
        `सध्याच्या ${liveBirds.toLocaleString('en-IN')} पक्ष्यांसाठी अंदाजे ${suggestedFeedTomorrow.toLocaleString('en-IN')} किलो (${bags} पोती) खुराक आवश्यक आहे.`,
        `बाजार भाव चालू स्थितीत ₹${puneRate.toFixed(2)}/अंडे आहे.`,
        `नोंदणी पूर्ण करून दैनंदिन उत्पादन व खर्च अद्ययावत ठेवा.`
      ],
      summaryEn: [
        `Daily log is pending for today. Accurate Hen-Day % and profit will compute once logged.`,
        `Estimated feed requirement for ${liveBirds.toLocaleString('en-IN')} live birds is ${suggestedFeedTomorrow.toLocaleString('en-IN')} kg (${bags} bags).`,
        `Prevailing market egg price is ₹${puneRate.toFixed(2)}/egg.`,
        `Complete today's log to maintain strict continuous records.`
      ],
      risks: [
        {
          severity: 'info',
          titleMr: 'आजची नोंद प्रलंबित',
          titleEn: "Today's Log Pending",
          evidence: 'आजचे अंडी संकलन, मृत्यू व खुराक नोंदवणे बाकी आहे.',
          probableCauses: 'दैनंदिन संकलन चालू आहे.',
          suggestedCheck: 'शेडमधील अंतिम संकलन झाल्यावर ३० सेकंदात नोंद पूर्ण करावी.'
        }
      ],
      actions: [
        {
          priority: 1,
          titleMr: `आजची पहिली नोंद पूर्ण करा`,
          titleEn: `Complete Today's Daily Log`,
          detailMr: `अंडी उत्पादन, पक्षी मृत्यू आणि खुराक वापर त्वरित नोंदवा.`,
          detailEn: `Log today's egg collection, mortality, and feed issued.`,
          category: 'feed'
        },
        {
          priority: 2,
          titleMr: `उद्याचा खुराक अंदाज: ${suggestedFeedTomorrow.toLocaleString('en-IN')} किलो`,
          titleEn: `Estimated Feed Requirement: ${suggestedFeedTomorrow.toLocaleString('en-IN')} kg`,
          detailMr: `${liveBirds.toLocaleString('en-IN')} पक्ष्यांसाठी ११०.५ ग्रॅम प्रमाणे ${bags} पोती खुराक वाटप करा.`,
          detailEn: `Issue ${suggestedFeedTomorrow.toLocaleString('en-IN')} kg (${bags} bags) based on 110.5g/bird.`,
          category: 'feed'
        }
      ],
      feedRecommendation: {
        suggestedKgTomorrow: suggestedFeedTomorrow,
        targetGramsPerBird: recommendedGrams,
        formulaExplanation: `(${liveBirds.toLocaleString('en-IN')} जिवंत पक्षी × ११०.५ ग्रॅम) / १००० = ${suggestedFeedTomorrow.toLocaleString('en-IN')} kg (~${bags} पोती)`,
      },
      salesRecommendation: {
        verdict: 'normal',
        priorityBuyerName: customers[0]?.name || 'स्थानिक व्यापारी',
        reasonMr: 'नियमित बाजार भावानुसार विक्री नियोजन ठेवा.',
        reasonEn: 'Plan sales based on current market rates.',
      },
      disclaimer: 'AI सूचना केवळ निर्णय सहाय्यासाठी आहेत. हे कायदेशीर, पशुवैद्यकीय किंवा आर्थिक अंतिम सल्ले नाहीत.'
    };
  }

  // 1. Calculate Health Score
  const prodScore = Math.min(25, Math.max(0, Math.round((today.hdPct / 92) * 25)));
  const feedScore = today.feedPerBirdG <= 115 && today.feedPerBirdG >= 105 ? 24 : 20;
  const mortScore = today.mortality <= (liveBirds * 0.001) ? 24 : 16;
  const margin = today.sellingPricePerEgg - today.costPerEgg;
  const profitScore = margin > 0.5 ? 24 : margin > 0 ? 18 : 10;
  const totalScore = prodScore + feedScore + mortScore + profitScore;

  // 3. Outstanding analysis
  const overdueCustomers = [...customers].filter(c => (c.days16to30 + c.days30Plus) > 0);
  const highestOverdueCustomer = overdueCustomers.sort((a, b) => (b.days16to30 + b.days30Plus) - (a.days16to30 + a.days30Plus))[0];

  // 4. Mandi rate comparison
  const puneRate = marketRates.find(m => m.mandiName.includes('Pune'))?.ratePerEgg || 5.40;

  const risks: AIAnalysisOutput['risks'] = [];
  if (highestOverdueCustomer) {
    risks.push({
      severity: 'warning',
      titleMr: 'ग्राहकांची थकीत उधारी (Receivables Delay)',
      titleEn: 'Customer Credit Overdue',
      evidence: `${highestOverdueCustomer.name} कडे ₹${(highestOverdueCustomer.days16to30 + highestOverdueCustomer.days30Plus).toLocaleString('en-IN')} उधारी थकीत आहे.`,
      probableCauses: 'उधारी वसुलीच्या पाठपुराव्यात विलंब.',
      suggestedCheck: 'पुढील अंडी गाडी पाठवण्यापूर्वी किमान ५०% रक्कम जमा करून घ्यावी.'
    });
  }

  const actions: AIAnalysisOutput['actions'] = [
    {
      priority: 1,
      titleMr: `उद्याचा खुराक प्रमाण: ${suggestedFeedTomorrow.toLocaleString('en-IN')} किलो`,
      titleEn: `Tomorrow Feed Intake: ${suggestedFeedTomorrow.toLocaleString('en-IN')} kg`,
      detailMr: `सध्याच्या ${today.closingBirds.toLocaleString('en-IN')} जिवंत पक्ष्यांसाठी ११०.५ ग्रॅम प्रमाणे ${bags} पोती खुराक द्यावा.`,
      detailEn: `Issue ${suggestedFeedTomorrow.toLocaleString('en-IN')} kg (${bags} bags) based on 110.5g/bird for ${today.closingBirds.toLocaleString('en-IN')} live birds.`,
      category: 'feed'
    }
  ];

  if (highestOverdueCustomer) {
    actions.push({
      priority: 2,
      titleMr: `थकीत वसुली: ${highestOverdueCustomer.name}`,
      titleEn: `Collect Overdue: ${highestOverdueCustomer.name}`,
      detailMr: `थकीत ₹${highestOverdueCustomer.currentOutstanding.toLocaleString('en-IN')} पैकी वसुलीचा पाठपुरावा करा.`,
      detailEn: `Follow up to collect from outstanding balance.`,
      category: 'finance'
    });
  }

  return {
    runDate: today.recordDate,
    healthScore: totalScore,
    scoreBreakdown: {
      productionScore: prodScore,
      feedEfficiencyScore: feedScore,
      mortalityScore: mortScore,
      profitabilityScore: profitScore,
    },
    summaryMr: [
      `आजचे हेन-डे (HD%) उत्पादन ${today.hdPct}% आहे.`,
      `प्रति पक्षी खुराक ${today.feedPerBirdG} ग्रॅम राहिला असून एकूण खुराक खर्च ₹${today.feedPricePerKg}/किलो प्रमाणे आहे.`,
      `थेट रोख नफा ₹${today.simpleOperatingProfit.toLocaleString('en-IN')} झाला आहे.`,
      `आजचा विक्री दर (₹${today.sellingPricePerEgg}) ब्रेक-इव्हन दरापेक्षा (₹${today.breakEvenEggPrice}) ${today.sellingPricePerEgg >= today.breakEvenEggPrice ? 'चांगला' : 'कमी'} आहे.`
    ],
    summaryEn: [
      `Today's Hen-Day (HD%) production is ${today.hdPct}%.`,
      `Feed consumption was ${today.feedPerBirdG}g per bird.`,
      `Daily Operating Profit is ₹${today.simpleOperatingProfit.toLocaleString('en-IN')}.`,
      `Selling price is ₹${today.sellingPricePerEgg}/egg against break-even of ₹${today.breakEvenEggPrice}.`
    ],
    risks,
    actions,
    feedRecommendation: {
      suggestedKgTomorrow: suggestedFeedTomorrow,
      targetGramsPerBird: recommendedGrams,
      formulaExplanation: `(${today.closingBirds.toLocaleString('en-IN')} जिवंत पक्षी × ११०.५ ग्रॅम) / १००० = ${suggestedFeedTomorrow.toLocaleString('en-IN')} kg (~${bags} पोती)`,
    },
    salesRecommendation: {
      verdict: puneRate >= today.breakEvenEggPrice ? 'sell_all' : 'normal',
      priorityBuyerName: customers[0]?.name || 'नियमित खरेदीदार',
      reasonMr: puneRate >= today.breakEvenEggPrice ? 'सध्या बाजार भाव ब्रेक-इव्हनपेक्षा चांगला असल्याने तात्काळ विक्री करा.' : 'बाजार भाव स्थिर आहे.',
      reasonEn: puneRate >= today.breakEvenEggPrice ? 'Mandi price exceeds break-even cost, clear fresh stock.' : 'Mandi rates remain steady.',
    },
    disclaimer: 'AI सूचना केवळ निर्णय सहाय्यासाठी आहेत. हे कायदेशीर, पशुवैद्यकीय किंवा आर्थिक अंतिम सल्ले नाहीत.'
  };
}

export interface ForecastDay {
  date: string;
  dayNumber: number;
  projectedEggs: number;
  projectedRevenue: number;
  projectedFeedCost: number;
  projectedOtherCost: number;
  projectedTotalCost: number;
  projectedOperatingProfit: number;
  projectedTrueProfit: number;
  projectedCashFlow: number;
  cumulativeCash: number;
  breakEvenPrice: number;
  upperBandProfit: number;
  lowerBandProfit: number;
}

export interface ForecastResult {
  days: ForecastDay[];
  monthSummary: {
    totalEggs: number;
    totalRevenue: number;
    totalFeedCost: number;
    totalOtherCost: number;
    totalExpenditure: number;
    operatingProfit: number;
    trueProfit: number;
    costPerEgg: number;
    breakEvenEggPrice: number;
    openingCash: number;
    closingCash: number;
    minCashBalance: number;
  };
  pessimistic: {
    totalRevenue: number;
    totalExpenditure: number;
    trueProfit: number;
    breakEvenEggPrice: number;
  };
  optimistic: {
    totalRevenue: number;
    totalExpenditure: number;
    trueProfit: number;
    breakEvenEggPrice: number;
  };
}

/**
 * 30-day statistical forecast engine with what-if interactive modifiers
 */
export function generate30DaysForecast(
  baseDay: DailyRecord | null | undefined,
  modifiers: {
    eggRateDelta: number; // e.g. -0.20 to +0.50
    feedPriceDelta: number; // e.g. -2 to +4
    productionPctDelta: number; // e.g. -3 to +3
    mortalityDailyDelta: number; // e.g. -5 to +15
  }
): ForecastResult {
  const days: ForecastDay[] = [];
  const baseBirds = baseDay?.closingBirds || 10000;
  let liveBirds = baseBirds;

  const baseEggRate = (baseDay?.sellingPricePerEgg ?? 5.4) + modifiers.eggRateDelta;
  const baseFeedPrice = (baseDay?.feedPricePerKg ?? 35) + modifiers.feedPriceDelta;
  const baseProdPct = ((baseDay?.hdPct ?? 90) + modifiers.productionPctDelta) / 100;
  const baseMortality = Math.max(1, (baseDay?.mortality ?? 5) + modifiers.mortalityDailyDelta);

  let cumulativeCash = 100000;
  let minCash = cumulativeCash;

  let totalEggs = 0;
  let totalRevenue = 0;
  let totalFeedCost = 0;
  let totalOtherCost = 0;
  let totalExpenditure = 0;
  let totalOperatingProfit = 0;
  let totalTrueProfit = 0;

  const baseDate = new Date();

  for (let i = 1; i <= 30; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + (i - 1));
    const dateStr = d.toISOString().split('T')[0];

    liveBirds -= baseMortality;
    const dailyEggs = Math.round(liveBirds * baseProdPct);
    const feedKg = Number(((liveBirds * 110.5) / 1000).toFixed(1));

    const dailyRevenue = Math.round(dailyEggs * baseEggRate);
    const dailyFeedCost = Math.round(feedKg * baseFeedPrice);
    const dailyOtherCash = 12000;
    const dailyAllocatedOverheads = 14600; // labour, EMI, depreciation, pullet amortization

    const dailyTotalCost = dailyFeedCost + dailyOtherCash + dailyAllocatedOverheads;
    const dailyOperatingProfit = dailyRevenue - (dailyFeedCost + dailyOtherCash);
    const dailyTrueProfit = dailyRevenue - dailyTotalCost;

    // Cash flow: receipts - cash payments (loans EMI ₹38,400 deducted on Day 5)
    let dailyCashOut = dailyFeedCost + dailyOtherCash;
    if (i === 5) {
      dailyCashOut += 38400; // EMI due on Day 5
    }
    const netDailyCash = dailyRevenue - dailyCashOut;
    cumulativeCash += netDailyCash;
    if (cumulativeCash < minCash) minCash = cumulativeCash;

    const breakEven = dailyEggs > 0 ? Number((dailyTotalCost / dailyEggs).toFixed(2)) : 5.21;

    totalEggs += dailyEggs;
    totalRevenue += dailyRevenue;
    totalFeedCost += dailyFeedCost;
    totalOtherCost += (dailyOtherCash + dailyAllocatedOverheads);
    totalExpenditure += dailyTotalCost;
    totalOperatingProfit += dailyOperatingProfit;
    totalTrueProfit += dailyTrueProfit;

    days.push({
      date: dateStr.substring(5),
      dayNumber: i,
      projectedEggs: dailyEggs,
      projectedRevenue: dailyRevenue,
      projectedFeedCost: dailyFeedCost,
      projectedOtherCost: dailyOtherCash + dailyAllocatedOverheads,
      projectedTotalCost: dailyTotalCost,
      projectedOperatingProfit: dailyOperatingProfit,
      projectedTrueProfit: dailyTrueProfit,
      projectedCashFlow: netDailyCash,
      cumulativeCash,
      breakEvenPrice: breakEven,
      upperBandProfit: Math.round(dailyTrueProfit * 1.15),
      lowerBandProfit: Math.round(dailyTrueProfit * 0.85),
    });
  }

  const costPerEgg = totalEggs > 0 ? Number((totalExpenditure / totalEggs).toFixed(2)) : 0;
  const breakEvenEggPrice = costPerEgg;

  return {
    days,
    monthSummary: {
      totalEggs,
      totalRevenue,
      totalFeedCost,
      totalOtherCost,
      totalExpenditure,
      operatingProfit: totalOperatingProfit,
      trueProfit: totalTrueProfit,
      costPerEgg,
      breakEvenEggPrice,
      openingCash: 428500,
      closingCash: cumulativeCash,
      minCashBalance: minCash,
    },
    pessimistic: {
      totalRevenue: Math.round(totalRevenue * 0.92),
      totalExpenditure: Math.round(totalExpenditure * 1.05),
      trueProfit: Math.round(totalTrueProfit * 0.65),
      breakEvenEggPrice: Number((breakEvenEggPrice * 1.05).toFixed(2)),
    },
    optimistic: {
      totalRevenue: Math.round(totalRevenue * 1.08),
      totalExpenditure: Math.round(totalExpenditure * 0.96),
      trueProfit: Math.round(totalTrueProfit * 1.35),
      breakEvenEggPrice: Number((breakEvenEggPrice * 0.96).toFixed(2)),
    }
  };
}

/**
 * Natural language Q&A query responder for "Ask LayerOS"
 */
export function answerLayerOsQuery(query: string, today: DailyRecord, customers: Customer[]): string {
  const q = query.toLowerCase();

  if (q.includes('अंडे') && (q.includes('खर्च') || q.includes('cost') || q.includes('पडला'))) {
    return `मागील आठवड्यात आणि आज आपला प्रति अंडे थेट रोख खर्च ₹${today.costPerEgg} राहिला आहे. सर्व अप्रत्यक्ष खर्च (कामगार, शेड घसारा, कर्ज हप्ता व पक्षी घसारा) धरून एकूण खरा खर्च ₹${today.breakEvenEggPrice}/अंडे (₹${Math.round(today.breakEvenEggPrice * 100)}/१०० अंडी) आला आहे.`;
  }

  if (q.includes('उधारी') || q.includes('ग्राहक') || q.includes('owes') || q.includes('customer')) {
    const highest = [...customers].sort((a, b) => b.currentOutstanding - a.currentOutstanding)[0];
    return `सर्वाधिक उधारी ${highest.name} यांच्याकडे असून एकूण थकबाकी ${formatIndianCurrency(highest.currentOutstanding)} आहे (यापैकी २१+ दिवस थकीत रक्कम ₹${highest.days16to30 + highest.days30Plus} आहे). दुसऱ्या क्रमांकावर विशाल ट्रेडर्स (₹२,४०,०००) आहेत.`;
  }

  if (q.includes('नफा') || q.includes('profit') || q.includes('कमाई')) {
    return `आजचा थेट ऑपरेटिंग नफा ${formatIndianCurrency(today.simpleOperatingProfit)} झाला आहे. संपूर्ण ओव्हरहेड्स (₹१४,६००) वजा जाता खरा नफा ${formatIndianCurrency(today.trueProfit)} राहिला आहे.`;
  }

  if (q.includes('खुराक') || q.includes('feed') || q.includes('उद्या')) {
    return `उद्यासाठी AI शिफारशीत खुराक ३,३१० किलो (६६ पोती) आहे. २९,९८५ जिवंत पक्ष्यांसाठी प्रति पक्षी ११०.५ ग्रॅम ही आदर्श मात्रा आहे.`;
  }

  return `LayerOS अहवालानुसार: आजचे उत्पादन २७,३०० अंडी (९१%), खुराक ३,३०० किलो (११०g/पक्षी) आणि विक्री दर ₹५.४०/अंडे राहिला आहे. आपला व्यवसाय सुरक्षित नफ्यात सुरू आहे.`;
}
