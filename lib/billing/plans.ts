export type PlanId = 'starter' | 'grower' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';

export interface PlanLimits {
  maxBirds: number;
  maxSheds: number;
  maxStaff: number;
  aiAdvisorEnabled: boolean;
  mandiForecastEnabled: boolean;
  advancedReportsEnabled: boolean;
  whatsappExportEnabled: boolean;
  prioritySupport: boolean;
}

export interface SubscriptionPlan {
  id: PlanId;
  name: {
    mr: string;
    en: string;
    hi: string;
  };
  tagline: {
    mr: string;
    en: string;
    hi: string;
  };
  priceINR: {
    monthly: number;
    yearly: number;
  };
  popular?: boolean;
  limits: PlanLimits;
  features: {
    mr: string[];
    en: string[];
    hi: string[];
  };
}

export const SUBSCRIPTION_PLANS: Record<PlanId, SubscriptionPlan> = {
  starter: {
    id: 'starter',
    name: {
      mr: 'आरंभ (Starter)',
      en: 'Starter',
      hi: 'आरंभ (Starter)',
    },
    tagline: {
      mr: 'लहान किंवा नवीन पोल्ट्री फार्मसाठी मोफत चाचणी',
      en: 'Free trial for small or emerging layer farms',
      hi: 'छोटे या नए पोल्ट्री फार्म के लिए निःशुल्क ट्रायल',
    },
    priceINR: {
      monthly: 0,
      yearly: 0,
    },
    limits: {
      maxBirds: 5000,
      maxSheds: 1,
      maxStaff: 1,
      aiAdvisorEnabled: false,
      mandiForecastEnabled: false,
      advancedReportsEnabled: false,
      whatsappExportEnabled: false,
      prioritySupport: false,
    },
    features: {
      mr: [
        '५,००० पक्षांपर्यंत मर्यादा',
        '१ शेड व १ युझर (केवळ मालक)',
        '३० सेकंद दैनंदिन नोंद (Quick Log)',
        'मूलभूत नफा-तोटा हिशोब',
      ],
      en: [
        'Up to 5,000 birds capacity',
        '1 shed & 1 user account (owner only)',
        '30-second daily quick logging',
        'Basic profit/loss calculations',
      ],
      hi: [
        '५,००० पक्षियों तक की क्षमता',
        '१ शेड और १ यूजर अकाउंट (केवल मालिक)',
        '३० सेकंड त्वरित दैनिक प्रविष्टि',
        'बुनियादी लाभ-हानि गणना',
      ],
    },
  },
  grower: {
    id: 'grower',
    name: {
      mr: 'ग्रोवर व्यावसायिक (Grower Pro)',
      en: 'Grower Pro',
      hi: 'ग्रोवर व्यावसायिक (Grower Pro)',
    },
    popular: true,
    tagline: {
      mr: 'महाराष्ट्रातील व्यावसायिक लेयर फार्मसाठी सर्वोत्कृष्ट',
      en: 'Ideal for commercial layer farms across Maharashtra',
      hi: 'महाराष्ट्र के व्यावसायिक लेयर फार्म के लिए सर्वश्रेष्ठ',
    },
    priceINR: {
      monthly: 999,
      yearly: 9990, // ~17% discount
    },
    limits: {
      maxBirds: 35000,
      maxSheds: 4,
      maxStaff: 5,
      aiAdvisorEnabled: true,
      mandiForecastEnabled: true,
      advancedReportsEnabled: true,
      whatsappExportEnabled: true,
      prioritySupport: false,
    },
    features: {
      mr: [
        '३५,००० पक्षांपर्यंत क्षमता (मानक व्यावसायिक फार्म)',
        '४ शेड व ५ कर्मचारी खाती (सुपरवायझर, अकाउंटंट)',
        'जेमिनी AI दैनिक सल्लागार व ३० दिवस अंदाज',
        '५ बाजार समित्यांचे लाइव्ह दर व ट्रेंड',
        'व्हॉट्सॲप व PDF इनव्हॉइस एक्सपोर्ट',
        'उधारी/थकबाकी व ग्राहक खातेवही',
      ],
      en: [
        'Up to 35,000 birds capacity (Standard commercial)',
        'Up to 4 sheds & 5 staff roles (Supervisor, Accountant)',
        'Gemini AI Daily Advisor & 30-day forecast',
        'Live Mandi Rates & price trend analysis',
        'WhatsApp & PDF invoicing and customer credit ledger',
        'Multi-unit conversions (Gatta, Peti, Tray)',
      ],
      hi: [
        '३५,००० पक्षियों तक की क्षमता (मानक व्यावसायिक फार्म)',
        '४ शेड और ५ स्टाफ रोल्स (सुपरवाइजर, मुनीम)',
        'जेमिनी AI दैनिक सलाहकार और ३० दिन का पूर्वानुमान',
        '५ मंडियों के लाइव भाव और रुझान',
        'व्हाट्सएप और पीडीएफ चालान व उधारी खाता',
      ],
    },
  },
  enterprise: {
    id: 'enterprise',
    name: {
      mr: 'कमर्शियल (Enterprise)',
      en: 'Commercial Enterprise',
      hi: 'कमर्शियल (Enterprise)',
    },
    tagline: {
      mr: 'मोठ्या पोल्ट्री उद्योग समूहांसाठी अमर्यादित क्षमता',
      en: 'Unlimited scale for large poultry producers & integrators',
      hi: 'बड़े पोल्ट्री उत्पादकों के लिए असीमित क्षमता',
    },
    priceINR: {
      monthly: 2499,
      yearly: 24990,
    },
    limits: {
      maxBirds: Number.POSITIVE_INFINITY,
      maxSheds: Number.POSITIVE_INFINITY,
      maxStaff: Number.POSITIVE_INFINITY,
      aiAdvisorEnabled: true,
      mandiForecastEnabled: true,
      advancedReportsEnabled: true,
      whatsappExportEnabled: true,
      prioritySupport: true,
    },
    features: {
      mr: [
        'अमर्यादित पक्षी क्षमता व शेड',
        'अमर्यादित कर्मचारी खाती व फार्म स्वीचर',
        'प्राधान्य जेमिनी २.५ AI व कस्टम मॉडेल्स',
        'कस्टम युनिट्स, टॅक्स व डेटा बॅकअप',
        'समर्पित फोन व व्हॉट्सॲप सपोर्ट व्यवस्थापक',
      ],
      en: [
        'Unlimited birds & unlimited sheds',
        'Unlimited staff accounts & multi-farm switcher',
        'Priority Gemini 2.5 AI & automated batch predictions',
        'Custom packing units & enterprise data export',
        'Dedicated account manager & phone support',
      ],
      hi: [
        'असीमित पक्षी क्षमता और असीमित शेड',
        'असीमित स्टाफ खाते और मल्टी-फार्म स्विचर',
        'प्राथमिकता जेमिनी २.५ AI और स्वचालित बैच पूर्वानुमान',
        'कस्टम पैकिंग यूनिट्स और एंटरप्राइज डेटा बैकअप',
        'समर्पित खाता प्रबंधक और फोन सहायता',
      ],
    },
  },
};

export interface FarmSubscriptionState {
  farmId: string;
  planId: PlanId;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  razorpaySubscriptionId?: string;
  cancelAtPeriodEnd: boolean;
}

/**
 * Returns plan details for a given plan ID (defaults to 'starter')
 */
export function getSubscriptionPlan(planId?: string | null): SubscriptionPlan {
  if (planId && planId in SUBSCRIPTION_PLANS) {
    return SUBSCRIPTION_PLANS[planId as PlanId];
  }
  return SUBSCRIPTION_PLANS.starter;
}

/**
 * Calculates whether a farm is within the limits of its plan
 */
export function checkPlanUsageLimits(
  planId: PlanId,
  currentUsage: {
    birdCount: number;
    shedCount: number;
    staffCount: number;
  }
): {
  isWithinLimits: boolean;
  birdCapacityExceeded: boolean;
  shedLimitExceeded: boolean;
  staffLimitExceeded: boolean;
  plan: SubscriptionPlan;
} {
  const plan = getSubscriptionPlan(planId);
  const birdCapacityExceeded = currentUsage.birdCount > plan.limits.maxBirds;
  const shedLimitExceeded = currentUsage.shedCount > plan.limits.maxSheds;
  const staffLimitExceeded = currentUsage.staffCount > plan.limits.maxStaff;

  return {
    isWithinLimits: !birdCapacityExceeded && !shedLimitExceeded && !staffLimitExceeded,
    birdCapacityExceeded,
    shedLimitExceeded,
    staffLimitExceeded,
    plan,
  };
}
