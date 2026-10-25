'use client';

import React, { useEffect } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('LayerOS Application Error Boundary Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF8F3] dark:bg-[#0F1A15] text-[#0B1E15] dark:text-[#F0F5F2]">
      <div className="max-w-md w-full bg-white dark:bg-[#16241D] rounded-3xl p-6 sm:p-8 border-2 border-red-300 dark:border-red-900/60 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shadow-inner">
          <AlertOctagon className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1E15] dark:text-white">
            काहीतरी तांत्रिक अडचण आली
          </h1>
          <p className="text-xs sm:text-sm text-[#2D4538] dark:text-[#CBDCD4] font-medium leading-relaxed">
            काळजी करू नका, आपला पोल्ट्री डेटा सुरक्षित आहे. सिस्टीम रीलोड करून पुन्हा प्रयत्न करा.
          </p>
          <p className="text-[11px] text-[#5A7366] dark:text-[#8FA89B] italic">
            An unexpected error occurred. Your farm records remain safely preserved.
          </p>
        </div>

        {error.digest && (
          <div className="bg-[#F8F6F0] dark:bg-[#1A2D23] px-3 py-1.5 rounded-xl border border-[#DCD3C3] dark:border-[#2C4435] text-[10px] font-mono text-[#5A7366] dark:text-[#8FA89B] select-all">
            Error ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-xl font-black text-xs text-white bg-[#1F4D3A] hover:bg-[#173B2C] shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-[#D9A441]" />
            <span>पुन्हा प्रयत्न करा (Retry)</span>
          </button>

          <button
            onClick={() => { window.location.href = '/'; }}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-[#0B1E15] dark:text-white bg-[#F0EBE1] dark:bg-[#203328] hover:bg-[#E4DDCF] flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4 text-[#1F4D3A] dark:text-[#42BF87]" />
            <span>डॅशबोर्डवर जा</span>
          </button>
        </div>
      </div>
    </div>
  );
}
