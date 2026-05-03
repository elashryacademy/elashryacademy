"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Loader2, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupportChat({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/support");
      const data = await res.json();
      if (data.ticket) {
        setMessages(data.ticket.messages);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
      });
      if (res.ok) {
        setMessage("");
        fetchMessages();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[90]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95",
          isOpen ? "bg-white text-gray-500 rotate-90" : "bg-blue-600 text-white"
        )}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="p-6 bg-blue-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-sm">الدعم الفني المباشر</h3>
                <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">متصلون الآن للمساعدة</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-white/5"
          >
            {initialLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                  <Sparkles className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-400">مرحباً بك! كيف يمكننا مساعدتك اليوم؟</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div key={idx} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                    <div className={cn(
                      "max-w-[80%] p-4 rounded-2xl text-sm font-bold shadow-sm",
                      isMe 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : msg.isAI 
                          ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 rounded-tl-none" 
                          : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 rounded-tl-none"
                    )}>
                      {msg.isAI && (
                        <div className="flex items-center gap-2 mb-2 text-[8px] font-black uppercase tracking-widest opacity-50">
                          <Sparkles className="w-3 h-3" /> المساعد الذكي
                        </div>
                      )}
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-gray-400 mt-2 font-bold uppercase">
                      {new Date(msg.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              disabled={loading || !message.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
