import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, ChevronRight, MessageSquare, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from "@google/genai";
import { COURSES } from '../constants';

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: "أهلاً بك! 👋 أنا مساعد عزمي الشخصي.\nأنا هنا لمساعدتك في:\n1️⃣ معرفة أسعار المواد وطريقة التسجيل.\n2️⃣ شرح سريع لأي مفهوم دراسي.\n3️⃣ عمل كويز سريع لاختبار معلوماتك.\n\nكيف يمكنني خدمتك الآن؟", isBot: true }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const suggestions = [
    "💰 أسعار المواد",
    "📝 اشرح لي مفهوماً",
    "🧪 اختبرني سريعاً",
    "📱 كيف أسجل؟",
    "📅 نصيحة للمذاكرة"
  ];

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim() || isLoading) return;
    
    setMessages(prev => [...prev, { text: textToSend, isBot: false }]);
    setInputText("");
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        // Check for API Key first
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
           throw new Error("API Key is missing");
        }

        // Construct a context string with course names and prices
        const courseContext = COURSES.map(c => `- ${c.title}: ${c.price} SR`).join('\n');
        
        const ai = new GoogleGenAI({ apiKey: apiKey });
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `✅ **مساعد عزمي الشخصي (نسخة الويدجت)**

أنت مساعد ذكي وودود لطلاب "معهد عزمي". دورك هو أن تكون الرفيق الشخصي للطالب داخل الموقع.

**معلوماتك:**
- رقم الواتساب للتسجيل: 966556409492 (استخدم الرابط wa.me/966556409492)
- المواد والأسعار:
${courseContext}

**مهامك:**
1. **المساعدة الإدارية:** الإجابة عن الأسعار، طريقة التسجيل، ومميزات المعهد.
2. **المساعدة الأكاديمية السريعة:** إذا سأل الطالب عن مفهوم علمي (مثلاً: "ما هو التكامل؟" أو "اشرح الـ Class في البرمجة")، قدم شرحاً مختصراً وواضحاً ومفيداً مباشرة.
3. **الاختبارات السريعة:** إذا طلب "اختبرني"، اطرح عليه سؤالاً واحداً فقط (سؤال وجواب) وانتظر إجابته ثم صححها له.

**قواعد الرد:**
- أنت في نافذة دردشة صغيرة، اجعل ردودك **مختصرة ومركزة** (لا تكتب مقالات طويلة).
- كن ودوداً ومشجعاً واستخدم الإيموجي المناسب.
- إذا طلب الطالب اختباراً طويلاً أو شرحاً معقداً جداً، اقترح عليه استخدام صفحة "المعلم الذكي" من القائمة العلوية لتجربة أفضل.
            `,
          },
        });
      }

      const response = await chatRef.current.sendMessage({ message: textToSend });
      setMessages(prev => [...prev, { text: response.text || "عذراً، لم أتمكن من فهم ذلك.", isBot: true }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      let errorMessage = "عذراً، واجهت مشكلة في الاتصال. يرجى المحاولة مرة أخرى.";
      if (error instanceof Error && error.message.includes("API Key")) {
         errorMessage = "عذراً، مفتاح الربط مع الذكاء الاصطناعي غير متوفر حالياً.";
      }
      setMessages(prev => [...prev, { text: errorMessage, isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 md:right-8 w-[90vw] md:w-96 h-[550px] max-h-[80vh] bg-white dark:bg-dark-900 rounded-3xl shadow-2xl z-[100] flex flex-col overflow-hidden border border-gray-200 dark:border-white/10 ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <Bot size={22} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 dark:border-white rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-bold text-white dark:text-black text-sm">مساعد عزمي</h3>
                  <p className="text-gray-400 dark:text-gray-600 text-xs">متصل لخدمتك</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 flex items-center justify-center bg-white/10 dark:bg-black/10 rounded-full text-white dark:text-black hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
              >
                <ChevronRight size={20} className="rotate-90 md:rotate-0" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-950 scroll-smooth">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.isBot 
                      ? 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5' 
                      : 'bg-primary-600 text-white rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 border border-gray-100 dark:border-white/5">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Chips */}
            <div className="bg-white dark:bg-dark-900 px-4 pt-3 pb-1 border-t border-gray-100 dark:border-white/5">
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      disabled={isLoading}
                      className="whitespace-nowrap px-3 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full transition-colors border border-transparent hover:border-primary-200 dark:hover:border-primary-500/30"
                    >
                      {suggestion}
                    </button>
                  ))}
               </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-dark-900 flex gap-2 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب رسالتك..."
                disabled={isLoading}
                className="flex-1 bg-gray-100 dark:bg-black/20 text-gray-800 dark:text-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 transition-all placeholder:text-gray-400"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || !inputText.trim()}
                className="w-11 h-11 flex items-center justify-center bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30 disabled:shadow-none"
              >
                {isLoading ? <Zap size={18} className="animate-spin" /> : <Send size={18} className={inputText.trim() ? "translate-x-0.5" : ""} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-2xl shadow-black/20 z-[90] group overflow-hidden border-2 border-white dark:border-black"
      >
        <span className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-secondary-500 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity"></span>
        <AnimatePresence mode='wait'>
            {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={28} />
                </motion.div>
            ) : (
                <motion.div key="open" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="relative">
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <Sparkles size={28} className="fill-current" />
                </motion.div>
            )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};
