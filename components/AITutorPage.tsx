import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronLeft, Paperclip, FileText, Loader2, X as XIcon, Mic, Volume2 } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Course, ChatMessage } from '../types';

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
  const [attachment, setAttachment] = useState<AttachmentState | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice Input (STT)
  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("خاصية التحدث غير مدعومة في هذا المتصفح. يرجى استخدام Chrome أو Edge.");
        return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onend = () => {
        setIsRecording(false);
    };

    recognition.onerror = () => {
        setIsRecording(false);
    };

    recognition.start();
  };

  // Text-to-Speech (TTS)
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64 = result.split(',')[1];
        setAttachment({
          file,
          preview: URL.createObjectURL(file),
          base64,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !attachment) || isLoading) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      attachments: attachment ? [{
        type: attachment.mimeType.startsWith('image/') ? 'image' : 'file',
        url: attachment.preview,
        name: attachment.file.name
      }] : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    const currentAttachment = attachment;
    setAttachment(null);
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });

      // If there is an attachment (image), we use generateContent for this turn
      if (currentAttachment && currentAttachment.mimeType.startsWith('image/')) {
           const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: {
                 parts: [
                     { inlineData: { mimeType: currentAttachment.mimeType, data: currentAttachment.base64 } },
                     { text: newMessage.text || "Analyze this image" }
                 ]
             }
           });
           
           setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: response.text || "No response text",
                isBot: true
           }]);
      } else {
          // Text only interaction using Chat
          if (!chatSessionRef.current) {
            chatSessionRef.current = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: {
                systemInstruction: `You are an intelligent tutor for 'Azmi Institute'. 
                The student is currently viewing: ${selectedCourse ? selectedCourse.title : 'General Catalog'}.
                ${selectedCourse ? `Course Description: ${selectedCourse.description}` : ''}
                
                Provide clear, academic, and helpful answers. Support Arabic language fully.`,
              }
            });
          }

          const result = await chatSessionRef.current.sendMessage({ message: newMessage.text });
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            text: result.text || "No response",
            isBot: true
          }]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Sorry, something went wrong. Please try again.",
        isBot: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-dark-950">
        {/* Header */}
        <div className="h-16 border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4 bg-white dark:bg-dark-900 shrink-0">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeft className="text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 dark:text-white">المعلم الذكي</span>
                {selectedCourse && <span className="text-xs text-gray-500">{selectedCourse.title}</span>}
            </div>
            <div className="w-10"></div> 
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-dark-950">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.isBot ? 'bg-gradient-to-br from-primary-500 to-secondary-500' : 'bg-gray-200 dark:bg-white/20'}`}>
                            {msg.isBot ? <Bot size={16} className="text-white" /> : <User size={16} className="text-gray-600 dark:text-white" />}
                        </div>
                        <div className={`flex flex-col gap-2 ${msg.isBot ? 'items-start' : 'items-end'}`}>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.isBot 
                                ? 'bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5' 
                                : 'bg-primary-600 text-white rounded-tr-none'
                            }`}>
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mb-3">
                                        <img src={msg.attachments[0].url} alt="attachment" className="max-w-full rounded-lg border border-white/10" />
                                    </div>
                                )}
                                {msg.text}
                            </div>
                            
                            {/* Speak Button for Bot Messages */}
                            {msg.isBot && (
                                <button 
                                    onClick={() => speakText(msg.text)}
                                    className="p-1.5 text-gray-400 hover:text-primary-500 transition-colors bg-white dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10"
                                >
                                    <Volume2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shrink-0">
                             <Bot size={16} className="text-white" />
                        </div>
                        <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-white/5 shadow-sm">
                            <Loader2 size={20} className="animate-spin text-primary-500" />
                        </div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-white/5 shrink-0">
             {attachment && (
                <div className="flex items-center gap-2 mb-3 bg-gray-50 dark:bg-white/5 p-2 rounded-xl w-fit border border-gray-100 dark:border-white/10">
                    {attachment.mimeType.startsWith('image/') ? (
                         <img src={attachment.preview} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                         <FileText size={24} className="text-gray-500" />
                    )}
                    <span className="text-xs text-gray-500 max-w-[150px] truncate">{attachment.file.name}</span>
                    <button onClick={() => setAttachment(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <XIcon size={14} />
                    </button>
                </div>
            )}
            
            <div className="flex items-end gap-2">
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="p-3 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                 >
                    <Paperclip size={20} />
                 </button>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileSelect}
                    accept="image/*"
                 />
                 
                 <div className="flex-1 bg-gray-100 dark:bg-black/20 rounded-2xl flex items-center px-2 py-2 border border-transparent focus-within:border-primary-500/30 transition-colors">
                    <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="اطرح سؤالك هنا..."
                        className="w-full bg-transparent border-none focus:outline-none resize-none max-h-32 py-2 px-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    {/* Mic Button inside Input */}
                    <button 
                        onClick={startRecording}
                        className={`p-2 rounded-xl transition-colors ${isRecording ? 'text-red-500 animate-pulse bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Mic size={20} />
                    </button>
                 </div>

                 <button 
                    onClick={handleSend}
                    disabled={isLoading || (!inputText.trim() && !attachment)}
                    className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20 transition-all"
                 >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className={inputText.trim() ? "translate-x-0.5" : ""} />}
                 </button>
            </div>
        </div>
    </div>
  );
};