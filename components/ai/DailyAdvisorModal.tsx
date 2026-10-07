'use client';

import React from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { generateDailyAIAnalysis } from '@/lib/ai';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Wheat,
  TrendingUp,
  ShieldCheck,
  Share2,
} from 'lucide-react';

interface DailyAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyAdvisorModal({ isOpen, onClose }: DailyAdvisorModalProps) {
  const { todayRecord, dailyRecords, flock, customers, marketRates, vaccinations } = useLayerOS();
  const { language } = useI18n();

  if (!isOpen) return null;

  const analysis = generateDailyAIAnalysis(
    todayRecord,
    dailyRecords,
    flock,
    customers,
    marketRates,
    vaccinations
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-[#16241D] rounded-3xl shadow-2xl border border-[#E7E2D6] dark:border-[#263B30] flex flex-col max-h-[90vh] my-6">
        {/* Header */}
        <div className="p-5 border-b border-[#E7E2D6] dark:border-[#263B30] flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#16241D]/95 backdrop-blur-md z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] text-[#1F4D3A] dark:text-[#3BA378] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#D9A441]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-[#0B1E15] dark:text-white flex items-center gap-2">
                <span>AI दैनिक सल्लागार (Daily AI Advisor)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-black bg-[#D9A441] text-[#0B1E15]">
                  स्कोर: {analysis.healthScore}/१००
                </span>
              </h2>
              <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-0.5">
                {todayRecord.recordDate} • बीव्ही-३०० लेयर बॅच (वय ३४ आठवडे)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1F3027] text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-6">
          {/* Health Score Breakdown Card */}
          <div className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30]">
            <div className="text-xs font-black text-[#0B1E15] dark:text-white uppercase tracking-wider mb-3">
              फार्म आरोग्य व कार्यक्षमता गुण (Farm Health Score: {analysis.healthScore}/100)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white dark:bg-[#16241D] border border-gray-200 dark:border-gray-800">
                <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">अंडी उत्पादन</div>
                <div className="text-base font-black text-[#1F4D3A] dark:text-[#3BA378] mt-1">
                  {analysis.scoreBreakdown.productionScore}/२५
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#16241D] border border-gray-200 dark:border-gray-800">
                <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">खुराक कार्यक्षमता</div>
                <div className="text-base font-black text-[#1F4D3A] dark:text-[#3BA378] mt-1">
                  {analysis.scoreBreakdown.feedEfficiencyScore}/२५
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#16241D] border border-gray-200 dark:border-gray-800">
                <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">मृत्यू नियंत्रण</div>
                <div className="text-base font-black text-emerald-600 mt-1">
                  {analysis.scoreBreakdown.mortalityScore}/२५
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#16241D] border border-gray-200 dark:border-gray-800">
                <div className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-bold">नफा मार्जिन</div>
                <div className="text-base font-black text-[#D9A441] mt-1">
                  {analysis.scoreBreakdown.profitabilityScore}/२५
                </div>
              </div>
            </div>
          </div>

          {/* AI Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0B1E15] dark:text-white">
              थोडक्यात सारांश (Executive Summary)
            </h3>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30] space-y-2 text-xs font-semibold text-[#0B1E15] dark:text-white leading-relaxed">
              {(language === 'mr' ? analysis.summaryMr : analysis.summaryEn).map((line, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tomorrow's Feed Formula Recommendation */}
          <div className="p-5 rounded-2xl bg-[#FCF6E9] dark:bg-[#2E2413] border border-[#D9A441]/40">
            <div className="flex items-center gap-2 mb-2">
              <Wheat className="w-4 h-4 text-[#D9A441]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D9A441]">
                उद्याचा अचूक खुराक सल्ला (Scientific Feed Recommendation)
              </h3>
            </div>
            <div className="text-2xl font-black text-[#0B1E15] dark:text-white">
              {analysis.feedRecommendation.suggestedKgTomorrow.toLocaleString('en-IN')} kg
              <span className="text-xs font-bold text-[#2D4538] dark:text-[#CBDCD4] ml-2">
                (६६ पोती • {analysis.feedRecommendation.targetGramsPerBird} ग्रॅम प्रति पक्षी)
              </span>
            </div>
            <p className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] mt-1.5 font-mono font-semibold">
              सूत्र: {analysis.feedRecommendation.formulaExplanation}
            </p>
          </div>

          {/* Identified Risks & Suggested Checks */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0B1E15] dark:text-white">
              ओळखलेले संभाव्य धोके (Identified Risks)
            </h3>
            <div className="space-y-2.5">
              {analysis.risks.map((risk, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs font-black text-[#0B1E15] dark:text-white">
                        {language === 'mr' ? risk.titleMr : risk.titleEn}
                      </h4>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-950">
                      पुरावा: {risk.evidence}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">
                    संभाव्य कारण: {risk.probableCauses}
                  </p>
                  <p className="text-xs font-black text-[#1F4D3A] dark:text-[#3BA378]">
                    सुचवलेली कृती: {risk.suggestedCheck}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Actions */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0B1E15] dark:text-white">
              उद्यासाठी सर्वोच्च प्राधान्य कृती (Tomorrow's Top Actions)
            </h3>
            <div className="space-y-2.5">
              {analysis.actions.map(action => (
                <div
                  key={action.priority}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#16241D] border border-[#E7E2D6] dark:border-[#263B30] flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1F4D3A] text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    {action.priority}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#0B1E15] dark:text-white">
                      {language === 'mr' ? action.titleMr : action.titleEn}
                    </h4>
                    <p className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-0.5">
                      {language === 'mr' ? action.detailMr : action.detailEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer Footer */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 text-[10px] text-[#2D4538] dark:text-[#CBDCD4] font-medium text-center">
            {analysis.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
}
