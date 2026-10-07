'use client';

import React from 'react';
import { Zap, Plus } from 'lucide-react';

interface QuickLogFABProps {
  onOpenQuickLog: () => void;
}

export function QuickLogFAB({ onOpenQuickLog }: QuickLogFABProps) {
  return (
    <button
      onClick={onOpenQuickLog}
      className="lg:hidden fixed bottom-20 right-4 z-40 bg-[#1F4D3A] hover:bg-[#173A2C] text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-[#D9A441] transition-transform active:scale-95 animate-pulse"
      title="झटपट नोंदणी (Quick Log)"
    >
      <div className="w-6 h-6 rounded-full bg-[#D9A441] text-[#0B1E15] flex items-center justify-center font-bold">
        <Plus className="w-4 h-4 stroke-[3]" />
      </div>
      <span className="text-xs font-bold tracking-wide flex items-center gap-1">
        <Zap className="w-3.5 h-3.5 text-[#D9A441] fill-[#D9A441]" />
        + Quick Log
      </span>
    </button>
  );
}
