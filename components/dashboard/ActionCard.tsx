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
      badgeColor: "bg-[#E8F3F1] text-[#013E37] dark:bg-[#0C2B26] dark:text-[#3DAE7E]",
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
      badgeColor: "bg-[#FBF0EF] text-[#A63229] dark:bg-[#2E1412] dark:text-[#E05A50]",
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
      badgeColor: "bg-[#FFF8DC] text-[#7A5C0F] dark:bg-[#3D3416] dark:text-[#E5B84A]",
      cta: "विक्री नोंदवा",
      tab: "sales",
    },
  ];

  return (
    <div className="card-layer p-5 md:p-6 border border-[#E8E4DA] dark:border-[#1E3F36] bg-white dark:bg-[#122A23]">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DA] dark:border-[#1E3F36]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFF8DC] dark:bg-[#3D3416] text-[#C9A23C] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-[#0C1F1A] dark:text-white">
              {t.todaysActionTitle}
            </h3>
            <p className="text-xs font-medium text-[#6B8A7F] dark:text-[#6E9487] mt-0.5">
              AI ॲनालिटिक्स व दैनंदिन आकडेवारीवर आधारित तात्काळ करायच्या कृती
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#E8F3F1] dark:bg-[#0C2B26] text-[#013E37] dark:text-[#3DAE7E] border border-[#013E37]/10 dark:border-[#3DAE7E]/20">
          AI प्राधान्यक्रम
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              className="p-4 rounded-xl bg-[#FAFAF6] dark:bg-[#152E27] border border-[#E8E4DA] dark:border-[#1E3F36] flex flex-col justify-between hover:border-[#C9A23C] dark:hover:border-[#C9A23C]/50 transition-all hover:shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                  <div className="w-6 h-6 rounded-md bg-[#F5F3EE] dark:bg-[#183530] text-[10px] font-bold text-[#6B8A7F] flex items-center justify-center">
                    #{action.priority}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-[#0C1F1A] dark:text-white line-clamp-1">
                  {action.title}
                </h4>
                <p className="text-[11px] font-normal text-[#6B8A7F] dark:text-[#6E9487] mt-1.5 leading-relaxed">
                  {action.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#E8E4DA]/60 dark:border-[#1E3F36]">
                <button
                  onClick={() => onNavigateTab && onNavigateTab(action.tab)}
                  className="w-full py-2 px-3 rounded-lg bg-[#F5F3EE] dark:bg-[#183530] hover:bg-[#013E37] hover:text-white text-[#013E37] dark:text-[#3DAE7E] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8E4DA]/60 dark:border-[#1E3F36] group-hover:bg-[#013E37] group-hover:text-white group-hover:border-[#013E37]"
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
