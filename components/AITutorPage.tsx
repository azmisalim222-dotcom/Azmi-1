import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap, Trophy, ArrowRight, Eraser, Loader2, X as XIcon, RefreshCcw, ChevronLeft, Paperclip, FileText, Mic, MicOff, Volume2, StopCircle, GraduationCap, Check, CheckCircle2, XCircle, PlayCircle, Lightbulb, ListTodo, Calendar, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from "@google/genai";
import { Course, ChatMessage, AttachmentItem, QuizData, SmartContent, FlashcardsData, RoadmapData } from '../types';

interface Props {
  onBack: () => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  selectedCourse: Course | null;
}

interface AttachmentState {
  file: File;
  preview: string;
  base64: string;
  mimeType: string;
}

export const AITutorPage: React.FC<Props> = ({ onBack, messages, setMessages, selectedCourse }) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentState[]>([]);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  
  // Interactive Mode State
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);

  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (messages.length === 0) {
      let welcomeText = "أهلاً بك! 👋\nأنا مساعدك الدراسي الذكي.";
      if (selectedCourse) {
        welcomeText += `\nأنا هنا لمساعدتك في مادة **${selectedCourse.title}** بناءً على ملفات المادة.\nجرب أن تطلب مني: "لخص الدرس"، "اختبرني"، أو "اعطني خطة للمذاكرة".`;
      } else {
        welcomeText += `\nجاهز لمساعدتك في الفهم، التلخيص، والاختبارات بناءً على المناهج المعتمدة.`;
      }
      setMessages([{ id: 'welcome', text: welcomeText, isBot: true }]);
    }
  }, [selectedCourse, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!activeQuiz) scrollToBottom();
  }, [messages, activeQuiz, attachments]);

  // --- Voice Logic ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'ar-SA';

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
    } else {
        if (recognitionRef.current) {
            recognitionRef.current.start();
            setIsListening(true);
        } else {
            alert("المتصفح لا يدعم التحدث الصوتي");
        }
    }
  };

  const speakText = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingMessageId === id) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.onend = () => setSpeakingMessageId(null);
    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  // --- File Handling ---
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const validAttachments: AttachmentState[] = [];

    for (const file of newFiles) {
        if (file.size > 10 * 1024 * 1024) {
          alert(`الملف ${file.name} كبير جداً.`);
          continue;
        }

        try {
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });

          const pureBase64 = base64Data.split(',')[1];
          validAttachments.push({
            file,
            preview: base64Data,
            base64: pureBase64,
            mimeType: file.type
          });
        } catch (error) {
          console.error("Error reading file:", error);
        }
    }
    setAttachments(prev => [...prev, ...validAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // --- Parser Logic ---
  const parseSmartResponse = (text: string): SmartContent | null => {
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const data = JSON.parse(jsonStr);
        
        // Detect Type
        if (data.questions && Array.isArray(data.questions)) {
            return { type: 'QUIZ', data: data as QuizData };
        }
        if (data.cards && Array.isArray(data.cards)) {
            return { type: 'FLASHCARDS', data: data as FlashcardsData };
        }
        if (data.steps && Array.isArray(data.steps)) {
            return { type: 'ROADMAP', data: data as RoadmapData };
        }
      }
    } catch (e) {
      console.error("Failed to parse smart JSON", e);
    }
    return null;
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if ((!textToSend.trim() && attachments.length === 0) || isLoading) return;

    const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: textToSend, 
        isBot: false,
        attachments: attachments.map(att => ({
            type: att.mimeType.startsWith('image/') ? 'image' : 'file',
            url: att.preview,
            name: att.file.name
        }))
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    const currentAttachments = [...attachments]; 
    setAttachments([]); 
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key missing");

        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        const contextInfo = selectedCourse 
            ? `Course Context: ${selectedCourse.title}`
            : `General Context`;

        const driveLink = "https://drive.google.com/drive/folders/1b8MGAGojq2mdcIOHlej6s1ST3EspzNNv?usp=sharing";

        const systemPrompt = `
          أنت "مساعد عزمي التعليمي" (Azmi Smart Tutor).
          
          📁 **المرجع الأساسي (Source of Truth):**
          لديك صلاحية الوصول (المحاكاة) لمحتوى المواد الدراسية في هذا الرابط: ${driveLink}
          
          **قواعدك الصارمة:**
          1. عند الإجابة، يجب أن تتصرف وكأنك تبحث داخل مجلدات هذه المواد وتستخرج المعلومات من ملفات PDF الخاصة بها.
          2. لا تخترع معلومات غير موجودة في المناهج الجامعية القياسية لهذه المواد.
          3. إذا لم تجد المعلومة، قل: "لم يتم العثور على هذه المعلومة ضمن ملفات المادة المتوفرة."
          
          **المواد المدعومة:**
          - أساسيات الأمن، HCI، ديجيتال، دوائر إلكترونية وكهربائية.
          - كالكولس (101-260)، ماث (127-200)، فيزياء، كيمياء.
          - شبكات، تنظيم حاسبات، OS، هندسة برمجيات، ديسكريت، وغيرها.

          **السياق الحالي:**
          الطالب يسأل عن مادة: ${contextInfo}

          --------------------------------------------------
          **FORMATTING INSTRUCTIONS (Technical):**
          
          To provide interactive UI (Quizzes, Flashcards, Roadmaps), you MUST output strictly formatted JSON for specific requests. For general chat, use plain text.

          1. IF user asks for a **Quiz/Test/Questions (اختبار/أسئلة)**:
             Output JSON with type 'quiz':
             \`\`\`json
             {
               "title": "Quiz Title",
               "questions": [
                 {
                   "question": "Question text?",
                   "type": "multiple_choice" OR "true_false",
                   "options": ["Option1", "Option2", ...], (For true_false use ["صواب", "خطأ"])
                   "correctIndex": 0,
                   "explanation": "Short explanation why."
                 }
               ]
             }
             \`\`\`

          2. IF user asks for **Summary/Key Points (لخص/مراجعة)**:
             Output JSON with type 'flashcards':
             \`\`\`json
             {
               "topic": "Topic Name",
               "cards": [
                 { "title": "Concept 1", "content": "Brief explanation", "icon": "idea" },
                 { "title": "Concept 2", "content": "Brief explanation", "icon": "star" }
               ]
             }
             \`\`\`

          3. IF user asks for **Study Plan/Roadmap (خطة مذاكرة)**:
             Output JSON with type 'roadmap':
             \`\`\`json
             {
               "goal": "Mastering [Topic]",
               "steps": [
                 { "step": "Phase 1", "details": "What to do", "duration": "2 hours" }
               ]
             }
             \`\`\`

          4. For normal explanations, answer in clear Arabic using Markdown.
        `;

        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { systemInstruction: systemPrompt },
        });
      }

      let apiResponse;
      if (currentAttachments.length > 0) {
          const parts: any[] = [];
          if (textToSend.trim()) parts.push({ text: textToSend });
          else parts.push({ text: "Analyze and explain this content." }); 

          currentAttachments.forEach(att => {
              parts.push({
                  inlineData: { mimeType: att.mimeType, data: att.base64 }
              });
          });
          apiResponse = await chatRef.current.sendMessage({ message: parts });
      } else {
          apiResponse = await chatRef.current.sendMessage({ message: textToSend });
      }

      const responseText = apiResponse.text || "عذراً، لم أستطع الرد.";
      const smartContent = parseSmartResponse(responseText);
      
      if (smartContent) {
          if (smartContent.type === 'QUIZ') {
              setActiveQuiz(smartContent.data as QuizData);
          } else {
              setMessages(prev => [...prev, { 
                  id: Date.now().toString(), 
                  text: "إليك ما طلبت:", 
                  isBot: true,
                  smartContent: smartContent
              }]);
          }
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: responseText, isBot: true }]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "حدث خطأ في الاتصال. حاول مرة أخرى.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Sub-Components for Smart Content ---

  const FlashcardsWidget = ({ data }: { data: FlashcardsData }) => {
      const [index, setIndex] = useState(0);
      return (
          <div className="bg-gradient-to-br from-primary-50 to-white dark:from-dark-800 dark:to-dark-900 rounded-2xl p-4 border border-primary-100 dark:border-white/10 mt-2 w-full max-w-md shadow-sm">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-primary-700 dark:text-primary-300 flex items-center gap-2">
                     <Lightbulb size={18} /> {data.topic}
                 </h3>
                 <span className="text-xs bg-white dark:bg-white/10 px-2 py-1 rounded-full text-gray-500">{index + 1}/{data.cards.length}</span>
             </div>
             
             <div className="relative h-48 perspective-1000">
                 <AnimatePresence mode='wait'>
                     <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute inset-0 bg-white dark:bg-black/20 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-white/5 shadow-inner"
                     >
                         <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{data.cards[index].title}</h4>
                         <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{data.cards[index].content}</p>
                     </motion.div>
                 </AnimatePresence>
             </div>

             <div className="flex justify-between mt-4">
                 <button onClick={() => setIndex(prev => Math.max(0, prev - 1))} disabled={index === 0} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30"><ChevronRight className="rotate-180" /></button>
                 <button onClick={() => setIndex(prev => Math.min(data.cards.length - 1, prev + 1))} disabled={index === data.cards.length - 1} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30"><ChevronLeft className="rotate-180" /></button>
             </div>
          </div>
      )
  };

  const RoadmapWidget = ({ data }: { data: RoadmapData }) => {
      return (
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-4 border border-gray-100 dark:border-white/10 mt-2 w-full max-w-md">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <ListTodo size={18} className="text-green-500" /> {data.goal}
              </h3>
              <div className="space-y-3 relative">
                  <div className="absolute top-2 bottom-2 right-[11px] w-0.5 bg-gray-200 dark:bg-white/10"></div>
                  {data.steps.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-4">
                          <div className="relative z-10 w-6 h-6 rounded-full bg-white dark:bg-dark-800 border-2 border-primary-500 flex items-center justify-center text-[10px] font-bold text-primary-500 shrink-0">
                              {idx + 1}
                          </div>
                          <div className="flex-1 bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
                              <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{step.step}</h4>
                                  {step.duration && <span className="text-[10px] flex items-center gap-1 text-gray-400"><Calendar size={10} /> {step.duration}</span>}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.details}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )
  };

  // --- Quiz Overlay Component ---
  const QuizOverlay = () => {
    if (!activeQuiz) return null;
    
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
    const [checked, setChecked] = useState(false);

    const question = activeQuiz.questions[currentIdx];
    const isTrueFalse = question.type === 'true_false';

    const handleAnswer = (idx: number) => {
        if (checked) return;
        setSelectedOpt(idx);
        setChecked(true);
        if (idx === question.correctIndex) setScore(s => s + 1);
    };

    const next = () => {
        if (currentIdx < activeQuiz.questions.length - 1) {
            setCurrentIdx(p => p + 1);
            setSelectedOpt(null);
            setChecked(false);
        } else {
            setShowResult(true);
        }
    };

    const closeQuiz = () => {
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            text: `🎯 نتيجة الاختبار: ${score} من ${activeQuiz.questions.length}`, 
            isBot: true 
        }]);
        setActiveQuiz(null);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-dark-950 flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-white/5">
                <button onClick={closeQuiz} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><XIcon /></button>
                <div className="flex gap-1">
                    {activeQuiz.questions.map((_, i) => (
                        <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i < currentIdx ? 'bg-primary-500' : i === currentIdx ? 'bg-primary-300 animate-pulse' : 'bg-gray-200 dark:bg-white/10'}`} />
                    ))}
                </div>
                <div className="font-bold text-primary-600">{score} pts</div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
                {showResult ? (
                    <div className="text-center max-w-md w-full animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500">
                            <Trophy size={48} />
                        </div>
                        <h2 className="text-3xl font-black mb-2 dark:text-white">ممتاز!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">لقد أجبت على {score} من {activeQuiz.questions.length} أسئلة بشكل صحيح.</p>
                        <button onClick={closeQuiz} className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:scale-105 transition-transform">إنهاء الاختبار</button>
                    </div>
                ) : (
                    <div className="max-w-xl w-full">
                        <span className="text-xs font-bold text-primary-500 tracking-widest uppercase mb-2 block">سؤال {currentIdx + 1}</span>
                        <h2 className="text-2xl md:text-3xl font-bold mb-8 dark:text-white leading-tight">{question.question}</h2>

                        <div className={`grid gap-4 ${isTrueFalse ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {question.options.map((opt, idx) => {
                                let stateStyle = "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-800 hover:border-primary-400";
                                let icon = null;

                                if (checked) {
                                    if (idx === question.correctIndex) {
                                        stateStyle = "border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500";
                                        icon = <CheckCircle2 className="text-green-500" />;
                                    } else if (idx === selectedOpt) {
                                        stateStyle = "border-red-500 bg-red-50 dark:bg-red-900/20 ring-1 ring-red-500";
                                        icon = <XCircle className="text-red-500" />;
                                    } else {
                                        stateStyle = "opacity-50 border-gray-200 dark:border-white/5";
                                    }
                                }

                                return (
                                    <button 
                                        key={idx} 
                                        onClick={() => handleAnswer(idx)}
                                        disabled={checked}
                                        className={`relative p-6 rounded-2xl border-2 text-right transition-all duration-200 flex items-center justify-between group ${stateStyle} ${isTrueFalse ? 'aspect-square flex-col justify-center text-center gap-4' : ''}`}
                                    >
                                        <span className={`font-bold ${isTrueFalse ? 'text-xl' : 'text-lg'} ${checked ? '' : 'group-hover:text-primary-600'} dark:text-white`}>{opt}</span>
                                        {icon}
                                    </button>
                                );
                            })}
                        </div>

                        {checked && (
                            <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
                                <div className={`p-4 rounded-xl mb-4 text-sm ${selectedOpt === question.correctIndex ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'}`}>
                                    <span className="font-bold block mb-1">{selectedOpt === question.correctIndex ? 'إجابة صحيحة!' : 'إجابة خاطئة'}</span>
                                    {question.explanation}
                                </div>
                                <button onClick={next} className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                                    <span>السؤال التالي</span>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
  };

  // --- Main Render ---
  return (
    <>
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] md:h-[calc(100vh-theme(spacing.24))] mt-20 md:mt-24 bg-white dark:bg-dark-950 rounded-t-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 mx-auto max-w-5xl w-full relative">
       
       {/* Minimalist Header */}
       <div className="h-20 shrink-0 border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-6 bg-white dark:bg-dark-900 z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                <GraduationCap size={24} />
             </div>
             <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">مساعدك الدراسي الذكي</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">جاهز للمساعدة في {selectedCourse ? selectedCourse.title : 'دراستك'}</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => setMessages([])} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="مسح المحادثة">
                <Eraser size={20} />
             </button>
             <button onClick={onBack} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors">
                <XIcon size={20} />
             </button>
          </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-gray-50/50 dark:bg-dark-950">
          {messages.map((msg) => (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               key={msg.id} 
               className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
             >
                <div className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                   <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border ${msg.isBot ? 'bg-white dark:bg-dark-800 border-gray-200 dark:border-white/10 text-primary-500' : 'bg-primary-600 text-white border-transparent'}`}>
                      {msg.isBot ? <Sparkles size={18} /> : <User size={18} />}
                   </div>
                   
                   <div className="space-y-2 w-full">
                      {/* Attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                         <div className="flex flex-wrap gap-2">
                            {msg.attachments.map((att, i) => (
                               att.type === 'image' ? (
                                  <img key={i} src={att.url} className="h-32 rounded-xl border border-gray-200 dark:border-white/10" alt="attachment" />
                               ) : (
                                  <div key={i} className="flex items-center gap-2 p-2 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-white/10 text-xs">
                                     <FileText size={14} /> {att.name}
                                  </div>
                               )
                            ))}
                         </div>
                      )}
                      
                      {/* Text Bubble */}
                      <div className={`p-5 rounded-2xl text-sm md:text-base leading-loose shadow-sm relative group ${msg.isBot ? 'bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5' : 'bg-primary-600 text-white rounded-tr-none'}`}>
                         <div className="whitespace-pre-wrap">{msg.text}</div>
                         
                         {/* Interactive Widgets */}
                         {msg.smartContent && msg.smartContent.type === 'FLASHCARDS' && (
                             <FlashcardsWidget data={msg.smartContent.data as FlashcardsData} />
                         )}
                         {msg.smartContent && msg.smartContent.type === 'ROADMAP' && (
                             <RoadmapWidget data={msg.smartContent.data as RoadmapData} />
                         )}

                         {msg.isBot && (
                            <button onClick={() => speakText(msg.text, msg.id)} className={`absolute -left-8 top-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${speakingMessageId === msg.id ? 'text-red-500 opacity-100' : 'text-gray-400'}`}>
                               {speakingMessageId === msg.id ? <StopCircle size={18} /> : <Volume2 size={18} />}
                            </button>
                         )}
                      </div>
                   </div>
                </div>
             </motion.div>
          ))}
          {isLoading && (
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 flex items-center justify-center"><Loader2 size={18} className="animate-spin text-primary-500" /></div>
                <div className="text-gray-400 text-sm">جاري التفكير...</div>
             </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       {/* Input Area */}
       <div className="shrink-0 bg-white dark:bg-dark-900 p-4 border-t border-gray-100 dark:border-white/5 relative z-20">
          {/* Quick Suggestions */}
          {(!isLoading && (messages.length === 0 || messages[messages.length-1].isBot)) && (
             <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                {[
                  { label: "📘 لخص الدرس", prompt: "لخص لي هذا الموضوع في شكل نقاط (Flashcards) بناءً على الملفات" },
                  { label: "📝 اختبرني", prompt: "أنشئ لي اختبار قصير في هذا الموضوع من أسئلة المنهج" },
                  { label: "💡 اشرح ببساطة", prompt: "اشرح لي هذا المفهوم كما ورد في الملفات ببساطة" },
                  { label: "📊 خطة مذاكرة", prompt: "اقترح لي خطة مذاكرة (Roadmap) لهذا الموضوع" },
                ].map((s, i) => (
                   <button key={i} onClick={() => handleSend(s.prompt)} className="flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-200 transition-all">
                      <span>{s.label}</span>
                   </button>
                ))}
             </div>
          )}

          {/* Attachments Preview */}
          {attachments.length > 0 && (
             <div className="flex gap-2 mb-3 overflow-x-auto">
                {attachments.map((att, i) => (
                   <div key={i} className="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                      {att.mimeType.startsWith('image/') ? <img src={att.preview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-50"><FileText size={20} /></div>}
                      <button onClick={() => handleRemoveAttachment(i)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5"><XIcon size={12} /></button>
                   </div>
                ))}
             </div>
          )}

          <div className="flex items-end gap-2 bg-gray-50 dark:bg-dark-950 p-2 rounded-[2rem] border border-gray-200 dark:border-white/10 transition-all focus-within:ring-2 focus-within:ring-primary-500/20 shadow-sm">
             <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*,.pdf" />
             <button onClick={() => fileInputRef.current?.click()} className={`p-3 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-white/10 ${attachments.length > 0 ? 'text-primary-600' : 'text-gray-400'}`}>
                <Paperclip size={20} />
             </button>
             
             <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="اسألني عن أي شيء في المادة..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 resize-none max-h-32 py-3"
                rows={1}
             />

             <button onClick={toggleListening} className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'}`}>
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
             </button>

             <button onClick={() => handleSend()} disabled={isLoading || (!inputText.trim() && attachments.length === 0)} className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary-500/20">
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className={inputText.trim() ? "translate-x-0.5" : ""} />}
             </button>
          </div>
       </div>

    </div>
    <QuizOverlay />
    </>
  );
};