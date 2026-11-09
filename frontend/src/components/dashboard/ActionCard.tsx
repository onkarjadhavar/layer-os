'use client';

import React from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calc';
import { Sparkles, ArrowRight, Wheat, PhoneCall, TrendingUp, CheckCircle2 } from 'lucide-react';

interface ActionCardProps {
  onNavigateTab?: (tab: string) => void;
}

export function ActionCard({ onNavigateTab }: ActionCardProps) {
  const { customers, todayRecord, flock, marketRates, farm } = useLayerOS();
  const { language, t } = useI18n();

  // 1. Dynamic feed planning based on flock count
  const birdCount = flock?.currentBirdCount || farm.totalCapacity || 10000;
  const targetFeedKg = Math.round(birdCount * 0.110);
  const targetFeedBags = Math.round(targetFeedKg / 50);

  // 2. Dynamic overdue customer detection
  const overdueCustomers = customers.filter(c => c.currentOutstanding > 0);
  const topCustomer = overdueCustomers.length > 0
    ? [...overdueCustomers].sort((a, b) => b.currentOutstanding - a.currentOutstanding)[0]
    : null;

  // 3. Dynamic market comparison
  const primaryRate = marketRates.length > 0 ? marketRates[0] : null;
  const mandiName = primaryRate?.mandiName || 'पुणे (Pune)';
  const rateVal100 = primaryRate?.ratePer100 || 540;
  const ratePerEgg = primaryRate?.ratePerEgg || 5.40;
  const breakEven = todayRecord?.breakEvenEggPrice || 5.21;
  const isProfitableMandi = ratePerEgg >= breakEven;

  const actions = [
    {
      id: "act-01",
      priority: 1,
      title:
        language === 'en'
          ? "Tomorrow's Feed Allocation & Planning"
          : language === 'hi'
          ? "कल के लिए दाना आवंटन व योजना"
          : "उद्याचा खुराक वाटप व नियोजन",
      desc:
        language === 'en'
          ? `Dispatch ${formatIndianNumber(targetFeedKg)} kg (${targetFeedBags} bags) of feed tomorrow for ${formatIndianNumber(birdCount)} birds.`
          : language === 'hi'
          ? `कल के लिए ${formatIndianNumber(birdCount)} पक्षियों हेतु ${formatIndianNumber(targetFeedKg)} किलो (${targetFeedBags} बोरी) दाना दें।`
          : `उद्यासाठी ${formatIndianNumber(birdCount)} पक्षांकरिता ${formatIndianNumber(targetFeedKg)} किलो (${targetFeedBags} पोती) खुराक द्या.`,
      icon: Wheat,
      badge: language === 'en' ? "Feed Plan" : language === 'hi' ? "दाना" : "खुराक नियोजन",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      cta: language === 'en' ? "Log Feed" : language === 'hi' ? "दाना दर्ज करें" : "खुराक नोंदवा",
      tab: "full-entry",
    },
    topCustomer
      ? {
          id: "act-02",
          priority: 2,
          title:
            language === 'en'
              ? `${topCustomer.name} Overdue Collection (${formatIndianCurrency(topCustomer.currentOutstanding)})`
              : language === 'hi'
              ? `${topCustomer.name} बकाया वसूली (${formatIndianCurrency(topCustomer.currentOutstanding)})`
              : `${topCustomer.name} थकीत वसुली (${formatIndianCurrency(topCustomer.currentOutstanding)})`,
          desc:
            language === 'en'
              ? `Outstanding balance of ${formatIndianCurrency(topCustomer.currentOutstanding)} pending. Settle before releasing next dispatch.`
              : language === 'hi'
              ? `${formatIndianCurrency(topCustomer.currentOutstanding)} की उधारी बाकी है। अगली गाड़ी भेजने से पहले जमा करवाएं।`
              : `${formatIndianCurrency(topCustomer.currentOutstanding)} उधारी बाकी आहे. पुढील अंडी पाठवण्यापूर्वी जमा करून घ्या.`,
          icon: PhoneCall,
          badge: language === 'en' ? "Recovery" : language === 'hi' ? "वसूली" : "उधारी वसुली",
          badgeColor: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
          cta: language === 'en' ? "View Ledger" : language === 'hi' ? "खाता देखें" : "ग्राहक खाते / तपशील",
          tab: "sales",
        }
      : {
          id: "act-02",
          priority: 2,
          title:
            language === 'en'
              ? "All Customer Receivables in Good Standing"
              : language === 'hi'
              ? "सभी ग्राहक उधारी खाते सामान्य हैं"
              : "सर्व उधारी खाती सुरळीत आहेत",
          desc:
            language === 'en'
              ? "Zero overdue collection alerts. Regular payments recorded from authorized buyers."
              : language === 'hi'
              ? "कोई बड़ी बकाया राशि लंबित नहीं है। सभी ग्राहक समय पर भुगतान कर रहे हैं।"
              : "कोणतीही मोठी उधारी थकीत नाही. नियमित वेळेत पेमेंट जमा होत आहे.",
          icon: CheckCircle2,
          badge: language === 'en' ? "Clean Book" : language === 'hi' ? "सुरक्षित" : "सुरळीत",
          badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
          cta: language === 'en' ? "Open Sales" : language === 'hi' ? "बिक्री देखें" : "विक्री नोंदवही",
          tab: "sales",
        },
    {
      id: "act-03",
      priority: 3,
      title:
        language === 'en'
          ? `${mandiName} Mandi Rate: ₹${rateVal100}/100 (${isProfitableMandi ? 'Favorable' : 'Tight Margin'})`
          : language === 'hi'
          ? `${mandiName} मंडी भाव: ₹${rateVal100}/100 (${isProfitableMandi ? 'अनुकूल' : 'तंग मार्जिन'})`
          : `${mandiName} बाजार भाव: ₹${rateVal100}/१०० (${isProfitableMandi ? 'फायदेशीर' : 'कमी नफा'})`,
      desc:
        language === 'en'
          ? `${mandiName} rate is ₹${ratePerEgg}/egg against break-even ₹${breakEven}. ${isProfitableMandi ? 'Clear ready eggs instead of holding stock.' : 'Monitor direct customer margins closely.'}`
          : language === 'hi'
          ? `${mandiName} रेट ₹${ratePerEgg} है (ब्रेक-इवन ₹${breakEven})। ${isProfitableMandi ? 'स्टॉक जमा न करें और ताजा माल बेचें।' : 'सीधे ग्राहकों को प्राथमिकता दें।'}`
          : `${mandiName} दर ₹${ratePerEgg} आहे (ब्रेक-इव्हन ₹${breakEven}). ${isProfitableMandi ? 'साठा न ठेवता विक्री करा.' : 'थेट ग्राहकांना प्रीमियम दराने विक्री करा.'}`,
      icon: TrendingUp,
      badge: language === 'en' ? "Market Tip" : language === 'hi' ? "मंडी सलाह" : "विक्री संधी",
      badgeColor: isProfitableMandi
        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
        : "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
      cta: language === 'en' ? "Record Sale" : language === 'hi' ? "बिक्री दर्ज करें" : "विक्री नोंदवा",
      tab: "sales",
    },
  ];

  return (
    <div className="card-layer p-4 sm:p-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[var(--color-amber-soft)] text-[var(--color-walnut)] dark:bg-[#2A1E0D] dark:text-[var(--color-amber)] flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 fill-[var(--color-amber)] text-[var(--color-amber)]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-main)]">
              {t.todaysActionTitle}
            </h3>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mt-0.5">
              {t.aiActionPrioritySubtitle}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--color-sage-pale)] text-[var(--color-forest)] dark:bg-[#1A3024] dark:text-[var(--color-sage)] border border-[var(--color-forest)]/30">
          {t.aiPriorityBadge}
        </span>
      </div>

      <div className="mt-3.5 space-y-2.5">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              className="p-3.5 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[var(--color-sage)] transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 text-[var(--color-forest)] dark:text-[var(--color-sage)]">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[var(--color-text-main)]">
                      {action.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${action.badgeColor}`}
                    >
                      {action.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 line-clamp-2">
                    {action.desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab(action.tab)}
                className="py-1.5 px-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-forest)] hover:text-white hover:border-[var(--color-forest)] text-[var(--color-forest)] dark:text-[var(--color-sage)] text-xs font-bold flex items-center justify-center gap-1.5 transition-all flex-shrink-0 self-start sm:self-center cursor-pointer shadow-2xs"
              >
                <span>{action.cta}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
