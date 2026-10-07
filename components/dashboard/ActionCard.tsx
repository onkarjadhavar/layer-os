'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Sparkles, ArrowRight, Wheat, PhoneCall, TrendingUp, CheckCircle2 } from 'lucide-react';

interface ActionCardProps {
  onNavigateTab?: (tab: string) => void;
}

export function ActionCard({ onNavigateTab }: ActionCardProps) {
  const { t } = useI18n();

  const actions = [
    {
      id: "act-01",
      priority: 1,
      title: "उद्याचा खुराक वाटप व नियोजन",
      desc: "उद्यासाठी ३,३१० किलो (६६ पोती) खुराक द्या. दुपारचे तापमान २९°C पेक्षा जास्त असल्यामुळे पाण्याचे प्रमाण दुपारी वाढवा.",
      icon: Wheat,
      badge: "खुराक",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      cta: "खुराक नोंदवा",
      tab: "full-entry",
    },
    {
      id: "act-02",
      priority: 2,
      title: "रॉयल बेकर्स थकीत वसुली (₹४८,०००)",
      desc: "२१ दिवसांपेक्षा जास्त उधारी थकीत आहे. पुढील अंडी गाडी पाठवण्यापूर्वी किमान ५०% (₹२४,०००) जमा करून घ्या.",
      icon: PhoneCall,
      badge: "वसुली",
      badgeColor: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
      cta: "ग्राहकास कॉल करा / तपशील",
      tab: "sales",
    },
    {
      id: "act-03",
      priority: 3,
      title: "पुणे बाजार भाव वाढले (+₹१५) – माल काढा",
      desc: "पुणे मार्केटयार्ड दर ₹५४० वर पोहोचला असून ब्रेक-इव्हन दरापेक्षा (₹५.२१) चांगला आहे. साठा न ठेवता विक्री करा.",
      icon: TrendingUp,
      badge: "विक्री सल्ला",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      cta: "विक्री नोंदवा",
      tab: "sales",
    },
  ];

  return (
    <div className="card-layer p-5 md:p-6 border-2 border-[#D9A441]/40 bg-gradient-to-br from-white to-[#FAF8F3] dark:from-[#16241D] dark:to-[#1B2D24] shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-[#DCD3C3] dark:border-[#263B30]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FCF6E9] dark:bg-[#2E2413] text-[#D9A441] flex items-center justify-center">
            <Sparkles className="w-4 h-4 fill-[#D9A441]" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-black text-[#0B1E15] dark:text-white">
              {t.todaysActionTitle}
            </h3>
            <p className="text-xs font-semibold text-[#2D4538] dark:text-[#CBDCD4] mt-0.5">
              AI ॲनालिटिक्स व दैनंदिन आकडेवारीवर आधारित तात्काळ करायच्या कृती
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#EAF3EF] dark:bg-[#182B22] text-[#1F4D3A] dark:text-[#3BA378] border border-[#2D6B52]/30">
          AI प्राधान्यक्रम
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#16241D] border border-[#DCD3C3] dark:border-[#263B30] flex flex-col justify-between hover:border-[#D9A441] transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#F8F6F0] dark:bg-[#1A2D23] text-xs font-black text-[#0B1E15] dark:text-white flex items-center justify-center border border-[#DCD3C3]/50">
                    #{action.priority}
                  </div>
                </div>
                <h4 className="text-xs font-black text-[#0B1E15] dark:text-white line-clamp-1">
                  {action.title}
                </h4>
                <p className="text-[11px] font-medium text-[#2D4538] dark:text-[#CBDCD4] mt-1.5 leading-relaxed">
                  {action.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#DCD3C3]/50 dark:border-gray-800">
                <button
                  onClick={() => onNavigateTab && onNavigateTab(action.tab)}
                  className="w-full py-2 px-3 rounded-xl bg-[#F8F6F0] dark:bg-[#1A2D23] hover:bg-[#1F4D3A] hover:text-white text-[#1F4D3A] dark:text-[#3BA378] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#DCD3C3]/60 dark:border-[#263B30]"
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
