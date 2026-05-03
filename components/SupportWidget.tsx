"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Phone, Zap, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSettings } from "./SettingsProvider";
import { cn } from "@/lib/utils";

export default function SupportWidget() {
  const { data: session } = useSession();
  const settings = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [onlineAgents, setOnlineAgents] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && session) {
      fetchMessages();
    }
  }, [isOpen, session]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    const res = await fetch("/api/support");
    const data = await res.json();
    if (data.ticket) setMessages(data.ticket.messages);
    setOnlineAgents(data.onlineAgents);
  };

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { content: input, senderId: session?.user?.id, createdAt: new Date() };
    setMessages([...messages, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        body: JSON.stringify({ content: input })
      });
      const aiMsg = await res.json();
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {/* WhatsApp Button */}
      {settings.whatsapp_number && (
        <a
          href={`https://wa.me/${settings.whatsapp_number}`}
          target="_blank"
          className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all animate-bounce"
          title="تواصل عبر واتساب"
        >
          <Phone className="w-7 h-7 fill-current" />
        </a>
      )}

      {/* Main Chat Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-95",
          isOpen ? "bg-gray-100 text-gray-500 rotate-90" : "bg-blue-600 text-white"
        )}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-36 right-0 w-[400px] h-[600px] bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="p-6 bg-blue-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                   <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg">الدعم الذكي</h3>
                  <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">متصل الآن ومستعد للمساعدة</p>
                </div>
              </div>
            </div>
            {onlineAgents.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-black/10 rounded-xl border border-white/10">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {onlineAgents.slice(0, 3).map((agent, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-100 overflow-hidden">
                       <User className="w-full h-full p-1 text-blue-600" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-black">{onlineAgents[0].name} (مناوب الدعم حالياً)</p>
              </div>
            )}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-transparent">
             {messages.length === 0 && (
               <div className="text-center py-10">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-400">مرحباً بك! اسألني أي سؤال عن الأكاديمية أو واجهتك مشكلة؟</p>
               </div>
             )}
             {messages.map((msg, i) => (
               <div key={i} className={cn("flex flex-col", msg.senderId === session.user.id ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm font-bold shadow-sm",
                    msg.senderId === session.user.id 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-bl-none"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 font-black uppercase tracking-tighter">
                    {msg.isAI ? "رد ذكي" : msg.sender?.name || (msg.senderId === session.user.id ? "أنت" : "الدعم")}
                  </span>
               </div>
             ))}
             {loading && (
               <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[10px] font-black uppercase">جاري التفكير...</span>
               </div>
             )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-6 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
            <button type="submit" className="p-3 bg-blue-600 text-white rounded-2xl hover:scale-110 transition-transform active:scale-95 shadow-lg">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
