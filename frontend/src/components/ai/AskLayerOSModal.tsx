'use client';

import React, { useState } from 'react';
import { useLayerOS } from '@/lib/store';
import { useI18n } from '@/lib/i18n/context';
import { askLayerOsAction } from '@/lib/ai/actions';
import {
  X,
  Sparkles,
  Send,
  Mic,
  Bot,
  User,
  HelpCircle,
  Loader2,
  Info,
} from 'lucide-react';

interface AskLayerOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  badge?: string;
  source?: 'gemini' | 'rule_based';
}

export function AskLayerOSModal({ isOpen, onClose }: AskLayerOSModalProps) {
  const { farm, flock, todayRecord, marketRates, customers } = useLayerOS();
  const { language, t } = useI18n();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModelBadge, setCurrentModelBadge] = useState<string>('Gemini 2.5 Flash / Fallback');

  const greetings: Record<string, string> = {
    mr: 'नमस्कार! मी LayerOS AI सहाय्यक आहे. आपल्या पोल्ट्रीच्या उत्पादनाबद्दल, खुराकाबद्दल, नफ्याबद्दल किंवा ग्राहकांच्या उधारीबद्दल काहीही विचारा.',
    hi: 'नमस्ते! मैं LayerOS AI सहायक हूँ। अपने पोल्ट्री फार्म के उत्पादन, दाना, लाभ या ग्राहकों की उधारी के बारे में कुछ भी पूछें।',
    en: 'Hello! I am your LayerOS AI Farm Advisor. Ask me anything about egg production, feed, profit margins, or receivables.',
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: greetings[language] || greetings.mr,
      badge: 'LayerOS AI',
      source: 'gemini',
    },
  ]);

  if (!isOpen) return null;

  const quickQuestions: Record<string, string[]> = {
    mr: [
      'मागच्या आठवड्यात प्रति अंडे खर्च किती होता?',
      'कोणाची उधारी सर्वात जास्त आहे?',
      'उद्या किती खुराक द्यावा?',
      'आजचा खरा नफा किती झाला?',
    ],
    hi: [
      'प्रति अंडा लागत क्या है?',
      'किस ग्राहक पर सबसे अधिक उधारी है?',
      'कल कितना दाना देना चाहिए?',
      'आज का सच्चा मुनाफा कितना हुआ?',
    ],
    en: [
      'What is my cost per egg?',
      'Which customer owes the most?',
      'How much feed tomorrow?',
      'What is my true profit today?',
    ],
  };

  const questions = quickQuestions[language] || quickQuestions.mr;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askLayerOsAction({
        farm,
        flock,
        todayRecord,
        marketRates,
        customers,
        query,
        language,
      });

      setCurrentModelBadge(response.badge);
      const botMsg: Message = {
        sender: 'assistant',
        text: response.text,
        badge: response.badge,
        source: response.source,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const fallbackMsg: Message = {
        sender: 'assistant',
        text: 'माफ करा, तांत्रिक अडचणीमुळे उत्तर देता आले नाही. कृपया पुन्हा प्रयत्न करा.',
        badge: 'Rule-based analysis (AI offline)',
        source: 'rule_based',
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.start();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-[#0B1E15] dark:text-white">
                  {t.askLayerOs}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40">
                  {currentModelBadge}
                </span>
              </div>
              <p className="text-[11px] text-[#2D4538] dark:text-[#CBDCD4] font-medium">
                {farm.name} • {t.tagline}
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
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#1F4D3A] text-white flex items-center justify-center flex-shrink-0 text-xs font-black shadow-xs">
                    AI
                  </div>
                )}
                <div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#1F4D3A] text-white rounded-tr-none font-bold shadow-xs'
                        : 'bg-white dark:bg-[#16241D] text-[#0B1E15] dark:text-white border border-[#E7E2D6] dark:border-[#263B30] rounded-tl-none font-semibold shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.badge && m.sender === 'assistant' && (
                    <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-[#55695F] dark:text-[#A1B3AA]">
                      {m.source === 'gemini' ? (
                        <span className="text-emerald-600 dark:text-emerald-400">✨ {m.badge}</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400">⚙️ {m.badge}</span>
                      )}
                    </div>
                  )}
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#D9A441] text-[#0B1E15] flex items-center justify-center flex-shrink-0 text-xs font-black shadow-xs">
                    {language === 'mr' ? 'मी' : language === 'hi' ? 'मैं' : 'Me'}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-bold text-[#55695F] dark:text-[#A1B3AA] p-2 bg-white/60 dark:bg-[#16241D]/60 rounded-xl max-w-xs border border-[#E7E2D6] dark:border-[#263B30]">
              <Loader2 className="w-4 h-4 animate-spin text-[#1F4D3A] dark:text-[#42BF87]" />
              <span>LayerOS AI विचार करत आहे...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-white dark:bg-[#16241D] border-t border-[#E7E2D6] dark:border-[#263B30] overflow-x-auto whitespace-nowrap space-x-2">
          {questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="inline-block px-3 py-1 rounded-full bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] text-[11px] font-bold text-[#1F4D3A] dark:text-[#3BA378] hover:border-[#1F4D3A] disabled:opacity-50"
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
            title="व्हॉईस इनपुट"
            className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1F3027] border border-[#E7E2D6] dark:border-[#263B30] text-[#1F4D3A] dark:text-[#3BA378] hover:border-[#1F4D3A]"
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={t.askPlaceholder}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#DCD3C3] dark:border-[#263B30] bg-[#FAF8F3] dark:bg-[#1B2D24] text-[#0B1E15] dark:text-white text-xs font-bold focus:outline-none focus:border-[#1F4D3A]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#173A2C] transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
