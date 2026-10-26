'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Sparkles, ArrowRight, Wheat, PhoneCall, TrendingUp } from 'lucide-react';

interface ActionCardProps {
  onNavigateTab?: (tab: string) => void;
}

export function ActionCard({ onNavigateTab }: ActionCardProps) {
  const { language, t } = useI18n();

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
          ? "Dispatch 3,310 kg (66 bags) of feed tomorrow. Afternoon temp exceeds 29°C so increase waterline pressure and flushing."
          : language === 'hi'
          ? "कल के लिए 3,310 किलो (66 बोरी) दाना दें। दोपहर में तापमान 29°C से अधिक रहेगा, अतः पानी की उपलब्धता बढ़ाएं।"
          : "उद्यासाठी ३,३१० किलो (६६ पोती) खुराक द्या. दुपारचे तापमान २९°C पेक्षा जास्त असल्यामुळे पाण्याचे प्रमाण दुपारी वाढवा.",
      icon: Wheat,
      badge: language === 'en' ? "Feed Plan" : language === 'hi' ? "दाना" : "खुराक नियोजन",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      cta: language === 'en' ? "Log Feed" : language === 'hi' ? "दाना दर्ज करें" : "खुराक नोंदवा",
      tab: "full-entry",
    },
    {
      id: "act-02",
      priority: 2,
      title:
        language === 'en'
          ? "Royal Bakers Overdue Collection (₹48,000)"
          : language === 'hi'
          ? "रॉयल बेकर्स बकाया वसूली (₹48,000)"
          : "रॉयल बेकर्स थकीत वसुली (₹४८,०००)",
      desc:
        language === 'en'
          ? "Credit pending for over 21 days. Collect at least 50% (₹24,000) before releasing next vehicle."
          : language === 'hi'
          ? "21 दिनों से अधिक की उधारी बकाया है। अगली गाड़ी भेजने से पहले कम से कम 50% (₹24,000) जमा करवाएं।"
          : "२१ दिवसांपेक्षा जास्त उधारी थकीत आहे. पुढील अंडी गाडी पाठवण्यापूर्वी किमान ५०% (₹२४,०००) जमा करून घ्या.",
      icon: PhoneCall,
      badge: language === 'en' ? "Recovery" : language === 'hi' ? "वसूली" : "उधारी वसुली",
      badgeColor: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
      cta: language === 'en' ? "Call Customer / View" : language === 'hi' ? "ग्राहक को कॉल करें" : "ग्राहक खाते / तपशील",
      tab: "sales",
    },
    {
      id: "act-03",
      priority: 3,
      title:
        language === 'en'
          ? "Pune Mandi Rate Increased (+₹15) – Sell Fresh Stock"
          : language === 'hi'
          ? "पुणे मंडी भाव में तेजी (+₹15) – माल निकालें"
          : "पुणे बाजार भाव वाढले (+₹१५) – माल काढा",
      desc:
        language === 'en'
          ? "Pune rate reached ₹540/100, which is well above your break-even cost (₹5.21). Clear ready eggs instead of holding stock."
          : language === 'hi'
          ? "पुणे मार्केट रेट ₹540 पर पहुंचा जो ब्रेक-इवन भाव (₹5.21) से काफी अधिक है। स्टॉक जमा न करें और ताजा माल बेचें।"
          : "पुणे मार्केटयार्ड दर ₹५४० वर पोहोचला असून ब्रेक-इव्हन दरापेक्षा (₹५.२१) चांगला आहे. साठा न ठेवता विक्री करा.",
      icon: TrendingUp,
      badge: language === 'en' ? "Sales Tip" : language === 'hi' ? "बिक्री सलाह" : "विक्री संधी",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
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

      <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-3 mt-3.5 pb-2 snap-x snap-mandatory no-scrollbar -mx-1 px-1">
        {actions.map(action => {
          return (
            <div
              key={action.id}
              className="min-w-[85%] sm:min-w-[70%] md:min-w-0 snap-start p-4 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex flex-col justify-between hover:border-[var(--color-amber)] transition-all hover:shadow-md flex-shrink-0 md:flex-shrink shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[var(--color-surface)] text-xs font-bold text-[var(--color-text-main)] flex items-center justify-center border border-[var(--color-border)]">
                    #{action.priority}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-[var(--color-text-main)] line-clamp-1">
                  {action.title}
                </h4>
                <p className="text-[11px] font-medium text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
                  {action.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab(action.tab)}
                  className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-forest)] hover:text-white text-[var(--color-forest)] dark:text-[var(--color-sage)] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[var(--color-border)] touch-target active:scale-98 cursor-pointer"
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
