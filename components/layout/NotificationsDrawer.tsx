'use client';

import React from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import {
  X,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export function NotificationsDrawer({ isOpen, onClose, onNavigateToTab }: NotificationsDrawerProps) {
  const { alerts, dismissAlert } = useLayerOS();
  const { language } = useI18n();

  if (!isOpen) return null;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertCircle,
          bg: 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border-red-300 dark:border-red-800',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800',
        };
      case 'safe':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800',
        };
      default:
        return {
          icon: Info,
          bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-800',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-[#16241D] h-full shadow-2xl flex flex-col border-l border-[#E7E2D6] dark:border-[#263B30] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#E7E2D6] dark:border-[#263B30] flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#0B1E15] dark:text-white">
              स्मार्ट नोटिफिकेशन्स (Smart Alerts)
            </h2>
            <p className="text-xs text-[#2D4538] dark:text-[#CBDCD4] font-semibold mt-0.5">
              {alerts.length} सक्रिय इशारे
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1F3027] text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-[#2D4538] dark:text-[#CBDCD4]">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2 opacity-80" />
              <p className="text-sm font-bold text-[#0B1E15] dark:text-white">सर्व काही सुरळीत आहे!</p>
              <p className="text-xs mt-1 font-medium">कोणतीही नवीन चेतावणी किंवा अलर्ट नाही.</p>
            </div>
          ) : (
            alerts.map(alert => {
              const style = getSeverityBadge(alert.severity);
              const Icon = style.icon;
              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-2xl border ${style.bg} transition-all relative group shadow-sm`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <h3 className="text-xs font-black leading-tight text-[#0B1E15] dark:text-white">
                        {language === 'mr' ? alert.titleMr : alert.titleEn}
                      </h3>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                      title="काढून टाका"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs mt-1.5 font-medium leading-relaxed">
                    {language === 'mr' ? alert.messageMr : alert.messageEn}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10 dark:border-white/10 text-[11px] font-semibold">
                    <span className="opacity-80">{alert.date}</span>
                    {alert.actionUrl && onNavigateToTab && (
                      <button
                        onClick={() => {
                          const tab = alert.actionUrl?.replace('/', '');
                          onNavigateToTab(tab);
                          onClose();
                        }}
                        className="font-bold underline hover:opacity-80"
                      >
                        तपासा →
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
