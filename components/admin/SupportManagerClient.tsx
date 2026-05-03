"use client";

import { useState } from "react";
import { MessageSquare, User, Clock, CheckCircle, Search, Send, Power, PowerOff } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function SupportManagerClient({ tickets, isOnline: initialOnline }: { tickets: any[], isOnline: boolean }) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(initialOnline);
  const [reply, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleOnline = async () => {
    try {
      const res = await fetch("/api/admin/support/status", {
        method: "PATCH",
        body: JSON.stringify({ isOnline: !isOnline })
      });
      if (res.ok) {
        setIsOnline(!isOnline);
        toast.success(isOnline ? "أنت الآن غير متصل" : "أنت الآن متصل وتستقبل الرسائل");
      }
    } catch (err) {
      toast.error("فشل تحديث الحالة");
    }
  };

  const handleSendReply = async (e: any) => {
    e.preventDefault();
    if (!reply.trim() || !selectedTicket) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/support/tickets/${selectedTicket.id}`, {
        method: "POST",
        body: JSON.stringify({ content: reply })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setSelectedTicket({
          ...selectedTicket,
          messages: [...selectedTicket.messages, newMsg]
        });
        setInput("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex gap-8">
      {/* Sidebar - Tickets List */}
      <div className="w-1/3 flex flex-col gap-6">
        <div className="flex items-center justify-between p-6 bg-[var(--card)] rounded-[2rem] border border-[var(--border)] shadow-xl shadow-black/5">
           <div>
              <h2 className="text-xl font-black">المحادثات</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">إجمالي الحالات: {tickets.length}</p>
           </div>
           <button 
             onClick={toggleOnline}
             className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border",
               isOnline ? "bg-emerald-500 text-white border-emerald-600" : "bg-red-500/10 text-red-500 border-red-500/20"
             )}
           >
             {isOnline ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
             {isOnline ? "متصل" : "غير متصل"}
           </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
           {tickets.map((t) => (
             <button
               key={t.id}
               onClick={() => setSelectedTicket(t)}
               className={cn(
                 "w-full text-right p-6 rounded-[2rem] border transition-all group",
                 selectedTicket?.id === t.id 
                   ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20" 
                   : "bg-[var(--card)] border-[var(--border)] hover:border-blue-600"
               )}
             >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black">
                      {t.user.name?.[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-sm">{t.user.name}</p>
                      <p className={cn("text-[10px] font-bold uppercase", selectedTicket?.id === t.id ? "text-blue-100" : "text-gray-400")}>@{t.user.username}</p>
                    </div>
                  </div>
                  {t.status === "OPEN" && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                </div>
                <p className={cn("text-xs font-bold line-clamp-1", selectedTicket?.id === t.id ? "text-blue-50" : "text-gray-500")}>
                  {t.messages[t.messages.length - 1]?.content}
                </p>
             </button>
           ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-[var(--card)] rounded-[3rem] border border-[var(--border)] shadow-2xl shadow-black/5 overflow-hidden flex flex-col">
        {selectedTicket ? (
          <>
            {/* Chat Header */}
            <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                    {selectedTicket.user.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{selectedTicket.user.name}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">تذكرة: #{selectedTicket.id.slice(0,8)}</p>
                  </div>
               </div>
               <button className="p-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-100 transition-all">إغلاق التذكرة</button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 dark:bg-transparent">
               {selectedTicket.messages.map((m: any) => (
                 <div key={m.id} className={cn("flex flex-col", m.senderId === selectedTicket.agentId || m.isAI ? "items-start" : "items-end")}>
                    <div className={cn(
                      "max-w-[70%] p-5 rounded-[1.5rem] text-sm font-bold shadow-sm",
                      m.senderId === selectedTicket.agentId ? "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-tl-none" :
                      m.isAI ? "bg-amber-50 dark:bg-amber-900/10 border border-amber-100 text-amber-900 dark:text-amber-100 rounded-tl-none" :
                      "bg-blue-600 text-white rounded-tr-none"
                    )}>
                      {m.content}
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 font-black uppercase tracking-widest">
                       {m.isAI ? "رد ذكي" : m.sender?.name || "المستخدم"} • {new Date(m.createdAt).toLocaleTimeString('ar-EG')}
                    </span>
                 </div>
               ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendReply} className="p-8 border-t border-[var(--border)] flex gap-4">
               <input
                 value={reply}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="اكتب ردك هنا لمساعدة الطالب..."
                 className="flex-1 bg-[var(--muted)] border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all"
               />
               <button type="submit" disabled={loading} className="px-8 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all active:scale-95">
                 <Send className="w-5 h-5" />
                 إرسال
               </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
             <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mb-8">
                <MessageSquare className="w-10 h-10 text-blue-600" />
             </div>
             <h3 className="text-3xl font-black mb-4 tracking-tighter">اختر محادثة للبدء</h3>
             <p className="text-gray-500 font-bold max-w-sm">اختر أي تذكرة من القائمة الجانبية للبدء في الرد على استفسارات الطلاب ومساعدتهم.</p>
          </div>
        )}
      </div>
    </div>
  );
}
