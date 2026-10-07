'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { answerLayerOsQuery } from '@/lib/ai';
import {
  X,
  Sparkles,
  Send,
  Mic,
  Bot,
  User,
  HelpCircle,
} from 'lucide-react';

interface AskLayerOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export function AskLayerOSModal({ isOpen, onClose }: AskLayerOSModalProps) {
  const { todayRecord, customers } = useLayerOS();
  const { t } = useI18n();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'नमस्कार! मी LayerOS AI सहाय्यक आहे. आपल्या पोल्ट्रीच्या उत्पादनाबद्दल, खुराकाबद्दल, नफ्याबद्दल किंवा ग्राहकांच्या उधारीबद्दल काहीही विचारा.',
    },
  ]);

  if (!isOpen) return null;

  const quickQuestions = [
    'मागच्या आठवड्यात प्रति अंडे खर्च किती होता?',
    'कोणाची उधारी सर्वात जास्त आहे?',
    'उद्या किती खुराक द्यावा?',
    'आजचा खरा नफा किती झाला?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = { sender: 'user', text: query };
    const answer = answerLayerOsQuery(query, todayRecord, customers);
    const botMsg: Message = { sender: 'assistant', text: answer };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'mr-IN';
      recognition.start();
      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setInput(spoken);
        handleSend(spoken);
      };
    } else {
      alert('तुमच्या ब्राउझरमध्ये व्हॉईस इनपुट उपलब्ध नाही. कृपया मजकूर टाईप करा.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-[#16241D] rounded-3xl shadow-2xl border border-[#E7E2D6] dark:border-[#263B30] flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#E7E2D6] dark:border-[#263B30] flex items-center justify-between bg-white dark:bg-[#16241D]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3EF] dark:bg-[#182B22] text-[#1F4D3A] dark:text-[#3BA378] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#D9A441]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                LayerOS AI सहाय्यक (Ask LayerOS)
              </h3>
              <p className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">
                आपल्या फार्मच्या प्रत्यक्ष डेटावरून थेट अचूक उत्तरे
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

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F3]/50 dark:bg-[#0F1A15]/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-[#1F4D3A] text-white flex items-center justify-center flex-shrink-0 text-xs font-black">
                  AI
                </div>
              )}
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#1F4D3A] text-white rounded-tr-none font-bold'
                    : 'bg-white dark:bg-[#16241D] text-[#0B1E15] dark:text-white border border-[#E7E2D6] dark:border-[#263B30] rounded-tl-none font-semibold shadow-sm'
                }`}
              >
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#D9A441] text-[#0B1E15] flex items-center justify-center flex-shrink-0 text-xs font-black">
                  मी
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-white dark:bg-[#16241D] border-t border-[#E7E2D6] dark:border-[#263B30] overflow-x-auto whitespace-nowrap space-x-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="inline-block px-3 py-1 rounded-full bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] text-[11px] font-bold text-[#1F4D3A] dark:text-[#3BA378] hover:border-[#1F4D3A]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white dark:bg-[#16241D] border-t border-[#E7E2D6] dark:border-[#263B30] flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleVoiceInput}
            title="मराठी व्हॉईस इनपुट"
            className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] text-[#1F4D3A] dark:text-[#3BA378] hover:border-[#1F4D3A]"
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="मराठी किंवा इंग्रजीत प्रश्न विचारा..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1B2D24] text-[#0B1E15] dark:text-white text-xs font-bold focus:outline-none focus:border-[#1F4D3A]"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#173A2C] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
