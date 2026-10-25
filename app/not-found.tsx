import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF8F3] dark:bg-[#0F1A15] text-[#0B1E15] dark:text-[#F0F5F2]">
      <div className="max-w-md w-full bg-white dark:bg-[#16241D] rounded-3xl p-6 sm:p-8 border border-[#DCD3C3] dark:border-[#263B30] shadow-xl text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF3EF] dark:bg-[#182B22] text-[#1F4D3A] dark:text-[#3BA378] flex items-center justify-center font-black text-2xl">
          <HelpCircle className="w-8 h-8 text-[#D9A441]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black tracking-widest uppercase text-[#D9A441]">
            ४०४ / 404 Not Found
          </span>
          <h1 className="text-2xl font-black text-[#0B1E15] dark:text-white">
            हे पृष्ठ सापडले नाही
          </h1>
          <p className="text-xs sm:text-sm text-[#2D4538] dark:text-[#CBDCD4] font-medium leading-relaxed">
            आपण शोधत असलेले पृष्ठ अस्तित्वात नाही किंवा हलवण्यात आले आहे.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-[#1F4D3A] hover:bg-[#173B2C] shadow-md transition-transform active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>मुख्य डॅशबोर्डवर परत जा</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
