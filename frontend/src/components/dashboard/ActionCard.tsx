'use client';

import React from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { Sparkles, ArrowRight, Wheat, PhoneCall, TrendingUp, ClipboardCheck, Users } from 'lucide-react';

interface ActionCardProps {
  onNavigateTab?: (tab: string) => void;
}

export function ActionCard({ onNavigateTab }: ActionCardProps) {
  const { flock, todayRecord, customers, marketRates, dailyRecords } = useLayerOS();
  const { language, t } = useI18n();

  const liveBirds = todayRecord?.closingBirds ?? flock.currentBirdCount ?? 10000;
  const feedKg = Math.round((liveBirds * 110.5) / 1000);
  const feedBags = Math.max(1, Math.round(feedKg / 50));

  const puneRate = marketRates.find(m => m.mandiName.includes('Pune'))?.ratePer100 || 540;
  const breakEven = todayRecord ? Math.round(todayRecord.breakEvenEggPrice * 100) : 521;

  // Real overdue customer check
  const overdueCustomers = [...customers].filter(c => (c.days16to30 + c.days30Plus) > 0);
  const highestOverdue = overdueCustomers.sort((a, b) => (b.days16to30 + b.days30Plus) - (a.days16to30 + a.days30Plus))[0];

  const actions = [];

  // Action 1: If today's log pending, prioritize logging. Otherwise feed planning.
  if (!todayRecord) {
    actions.push({
      id: "act-log",
      priority: 1,
      title: language === 'en' ? "Complete Today's Daily Entry" : language === 'hi' ? "आज की दैनिक प्रविष्टि दर्ज करें" : "आजची दैनंदिन नोंद पूर्ण करा",
      desc: language === 'en'
        ? `Log today's eggs collected, bird mortality, and feed used for ${liveBirds.toLocaleString('en-IN')} birds.`
        : language === 'hi'
        ? `${liveBirds.toLocaleString('en-IN')} पक्षियों के लिए आज का अंडा उत्पादन, मृत्यु और दाना खर्च दर्ज करें।`
        : `${liveBirds.toLocaleString('en-IN')} पक्ष्यांसाठी आजचे अंडी संकलन, मृत्यू व खुराक वापर त्वरित नोंदवा.`,
      icon: ClipboardCheck,
      badge: language === 'en' ? "Pending" : language === 'hi' ? "बाकी" : "नोंद प्रलंबित",
      badgeColor: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
      cta: language === 'en' ? "Log Now" : language === 'hi' ? "दर्ज करें" : "आताच नोंदवा",
      tab: "quick-log",
    });
  } else {
    actions.push({
      id: "act-feed",
      priority: 1,
      title: language === 'en' ? "Tomorrow's Feed Allocation" : language === 'hi' ? "कल का दाना आवंटन" : "उद्याचा खुराक वाटप व नियोजन",
      desc: language === 'en'
        ? `Dispatch ${feedKg.toLocaleString('en-IN')} kg (${feedBags} bags) of feed for ${liveBirds.toLocaleString('en-IN')} birds.`
        : language === 'hi'
        ? `${liveBirds.toLocaleString('en-IN')} पक्षियों के लिए ${feedKg.toLocaleString('en-IN')} किलो (${feedBags} बोरी) दाना दें।`
        : `${liveBirds.toLocaleString('en-IN')} पक्ष्यांसाठी ${feedKg.toLocaleString('en-IN')} किलो (${feedBags} पोती) खुराक द्या.`,
      icon: Wheat,
      badge: language === 'en' ? "Feed Plan" : language === 'hi' ? "दाना" : "खुराक नियोजन",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      cta: language === 'en' ? "View Feed" : language === 'hi' ? "दाना देखें" : "खुराक तपशील",
      tab: "quick-log",
    });
  }

  // Action 2: Customer recovery or sales management
  if (highestOverdue) {
    const overdueAmt = highestOverdue.days16to30 + highestOverdue.days30Plus;
    actions.push({
      id: "act-recovery",
      priority: 2,
      title: language === 'en' ? `${highestOverdue.name} Overdue (₹${overdueAmt.toLocaleString('en-IN')})` : language === 'hi' ? `${highestOverdue.name} बकाया (₹${overdueAmt.toLocaleString('en-IN')})` : `${highestOverdue.name} थकीत वसुली (₹${overdueAmt.toLocaleString('en-IN')})`,
      desc: language === 'en'
        ? `Credit pending for over 15 days. Collect balance before next vehicle dispatch.`
        : language === 'hi'
        ? `15 दिनों से अधिक की उधारी बकाया है। अगली गाड़ी भेजने से पहले जमा करवाएं।`
        : `१५ दिवसांपेक्षा जास्त उधारी थकीत आहे. पुढील गाडी पाठवण्यापूर्वी जमा करून घ्या.`,
      icon: PhoneCall,
      badge: language === 'en' ? "Recovery" : language === 'hi' ? "वसूली" : "उधारी वसुली",
      badgeColor: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
      cta: language === 'en' ? "View Ledger" : language === 'hi' ? "खाता देखें" : "ग्राहक खाते",
      tab: "sales",
    });
  } else {
    actions.push({
      id: "act-sales",
      priority: 2,
      title: language === 'en' ? "Egg Sales & Customer Dispatches" : language === 'hi' ? "अंडा बिक्री व चालान" : "अंडी विक्री व ग्राहक व्यवस्थापन",
      desc: language === 'en'
        ? `Create official egg sales invoices and dispatch receipts directly to buyers.`
        : language === 'hi'
        ? `अंडा बिक्री का चालान और ग्राहकों को व्हाट्सएप रसीद भेजें।`
        : `अंडी विक्रीचे अधिकृत चलन तयार करा आणि ग्राहकांना व्हॉट्सॲप पावती पाठवा.`,
      icon: Users,
      badge: language === 'en' ? "Sales" : language === 'hi' ? "बिक्री" : "विक्री चलन",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
      cta: language === 'en' ? "Record Sale" : language === 'hi' ? "बिक्री दर्ज करें" : "विक्री नोंदवा",
      tab: "sales",
    });
  }

  // Action 3: Mandi Rates
  actions.push({
    id: "act-mandi",
    priority: 3,
    title: language === 'en' ? `Mandi Rate: ₹${puneRate}/100 Eggs` : language === 'hi' ? `मंडी भाव: ₹${puneRate}/100 अंडे` : `बाजार भाव: ₹${puneRate}/१०० अंडी`,
    desc: language === 'en'
      ? `Current NECC benchmark is ₹${(puneRate/100).toFixed(2)}/egg. Check regional mandi rates to set your selling price.`
      : language === 'hi'
      ? `वर्तमान भाव ₹${(puneRate/100).toFixed(2)}/अंडा है। अपने बिक्री मूल्य के लिए क्षेत्रीय भाव जांचें।`
      : `सध्याचा एनईसीसी दर ₹${(puneRate/100).toFixed(2)}/अंडे आहे. आपल्या विक्री दराचे योग्य नियोजन करा.`,
    icon: TrendingUp,
    badge: language === 'en' ? "Market" : language === 'hi' ? "मंडी" : "बाजार भाव",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    cta: language === 'en' ? "Check Rates" : language === 'hi' ? "भाव देखें" : "दर तपासा",
    tab: "market-rates",
  });

  return (
    <div className="card-layer p-4 sm:p-5 rounded-3xl border border-[#D9A441]/50 bg-gradient-to-br from-white to-[#FAF8F3] dark:from-[#16241D] dark:to-[#1B2D24] shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#FCF6E9] dark:bg-[#2E2413] text-[#D9A441] flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 fill-[#D9A441]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0B1E15] dark:text-white">
              {t.todaysActionTitle}
            </h3>
            <p className="text-xs font-semibold text-[#55695F] dark:text-[#CBDCD4] mt-0.5">
              {t.aiActionPrioritySubtitle}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#EAF3EF] dark:bg-[#182B22] text-[#1F4D3A] dark:text-[#3BA378] border border-[#2D6B52]/30">
          {t.aiPriorityBadge}
        </span>
      </div>

      <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-3 mt-3.5 pb-2 snap-x snap-mandatory no-scrollbar -mx-1 px-1">
        {actions.map(action => {
          return (
            <div
              key={action.id}
              className="min-w-[85%] sm:min-w-[70%] md:min-w-0 snap-start p-4 rounded-2xl bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] flex flex-col justify-between hover:border-[#D9A441] transition-all hover:shadow-md flex-shrink-0 md:flex-shrink shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-black text-[#0B1E15] dark:text-white flex items-center justify-center border border-[#DCD3C3]/50">
                    #{action.priority}
                  </div>
                </div>
                <h4 className="text-xs font-black text-[#0B1E15] dark:text-white line-clamp-1">
                  {action.title}
                </h4>
                <p className="text-[11px] font-medium text-[#4D6558] dark:text-[#CBDCD4] mt-1.5 leading-relaxed">
                  {action.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#DCD3C3]/50 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab(action.tab)}
                  className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] hover:bg-[#1F4D3A] hover:text-white text-[#1F4D3A] dark:text-[#42BF87] text-xs font-black flex items-center justify-center gap-1.5 transition-colors border border-[#DCD3C3]/60 dark:border-[#263B30] touch-target active:scale-98"
                >
                  <span>{action.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
