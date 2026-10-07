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
      className="lg:hidden fixed bottom-20 right-4 z-40 bg-[#013E37] hover:bg-[#012E29] text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-[#FFEFB3]/30 transition-transform active:scale-95"
      title="झटपट नोंदणी (Quick Log)"
    >
      <div className="w-6 h-6 rounded-full bg-[#FFEFB3] text-[#013E37] flex items-center justify-center font-bold">
        <Plus className="w-4 h-4 stroke-[3]" />
      </div>
      <span className="text-xs font-semibold tracking-wide flex items-center gap-1">
        <Zap className="w-3.5 h-3.5 text-[#FFEFB3] fill-[#FFEFB3]" />
        + Quick Log
      </span>
    </button>
  );
}
