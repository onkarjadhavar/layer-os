'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { FarmStatus, FARM_STATUS_CONFIGS } from '@/lib/auth/farm-status';
import {
  Clock,
  AlertTriangle,
  XCircle,
  PhoneCall,
  MessageCircle,
  Home,
  LogOut,
  Building2,
} from 'lucide-react';

interface FarmStatusBlockedModalProps {
  farmName: string;
  status: FarmStatus;
  reason?: string;
  onLogout?: () => void;
}

export function FarmStatusBlockedModal({
  farmName,
  status,
  reason,
  onLogout,
}: FarmStatusBlockedModalProps) {
  const { t } = useI18n();
  const config = FARM_STATUS_CONFIGS[status] || FARM_STATUS_CONFIGS.pending_approval;

  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+91 98220 12345';
  const supportWhatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '+91 98220 12345';
  const cleanPhone = supportPhone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = supportWhatsapp.replace(/[^0-9]/g, '');

  const whatsappMessage = encodeURIComponent(
    `Hello LayerOS Support, my farm account (${farmName}) is in '${status}' status. Please assist.`
  );
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${whatsappMessage}`;

  const renderIcon = () => {
    switch (status) {
      case 'pending_approval':
        return <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400 animate-pulse" />;
      case 'suspended':
        return <AlertTriangle className="w-10 h-10 text-rose-600 dark:text-rose-400" />;
      case 'rejected':
      case 'cancelled':
      default:
        return <XCircle className="w-10 h-10 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="farm-status-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
    >
      <div className="w-full max-w-md bg-[#FAF8F3] dark:bg-[#16241D] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#DCD3C3] dark:border-[#263B30] text-center my-8">
        {/* Status Icon Badge */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white dark:bg-[#1F3027] shadow-inner flex items-center justify-center border border-[#E7E2D6] dark:border-[#263B30]">
          {renderIcon()}
        </div>

        {/* Farm Name Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF3EF] dark:bg-[#1A2D23] text-[#1F4D3A] dark:text-[#42BF87] border border-[#1F4D3A]/20 dark:border-[#42BF87]/20 mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span className="truncate max-w-[220px]">{farmName}</span>
        </div>

        {/* Title */}
        <h2
          id="farm-status-title"
          className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white tracking-tight mb-2"
        >
          {t[config.titleKey]}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#4A5D53] dark:text-[#CBDCD4] leading-relaxed mb-5">
          {t[config.descKey]}
        </p>

        {/* Specific Reason (if provided) */}
        {reason && (
          <div className="p-3.5 mb-6 rounded-2xl bg-white dark:bg-[#1F3027] border border-[#DCD3C3] dark:border-[#263B30] text-left">
            <span className="block text-[11px] font-black uppercase tracking-wider text-[#6B7A72] dark:text-[#8E9F96] mb-1">
              {t.statusReasonLabel}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#1B2A24] dark:text-gray-200">
              {reason}
            </p>
          </div>
        )}

        {/* Direct Contact CTAs */}
        <div className="space-y-2.5 mb-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.whatsappSupportBtn}</span>
          </a>

          <a
            href={`tel:${cleanPhone}`}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#1F3027] hover:bg-[#F3EFE6] dark:hover:bg-[#273D32] text-[#1F4D3A] dark:text-[#42BF87] font-bold text-sm border border-[#DCD3C3] dark:border-[#263B30] transition-all active:scale-[0.98]"
          >
            <PhoneCall className="w-4 h-4 text-[#D9A441]" />
            <span>{t.callSupportBtn} ({supportPhone})</span>
          </a>
        </div>

        {/* Navigation & Logout options */}
        <div className="pt-4 border-t border-[#E7E2D6] dark:border-[#263B30] flex items-center justify-between gap-2">
          <Link
            href="/?landing=true"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#6B7A72] dark:text-[#CBDCD4] hover:text-[#1F4D3A] dark:hover:text-white transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.backToHome}</span>
          </Link>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.switchFarmOrLogoutBtn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
