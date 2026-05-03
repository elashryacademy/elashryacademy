"use client";

import { useState } from "react";
import { Send, MessageSquare, Clock, Plus, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function SupportTicketClient({ 
    initialSubject,
    existingTickets 
}: { 
    initialSubject?: string;
    existingTickets: any[];
}) {
    const [isCreating, setIsCreating] = useState(!!initialSubject);
    const [subject, setSubject] = useState(initialSubject || "");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    subject, 
                    content: message 
                })
            });

            if (res.ok) {
                toast.success("تم إرسال طلبك بنجاح!");
                setIsCreating(false);
                setSubject("");
                setMessage("");
                window.location.reload();
            } else {
                toast.error("حدث خطأ أثناء الإرسال");
            }
        } catch (err) {
            toast.error("خطأ في الاتصال");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {!isCreating ? (
                <button 
                    onClick={() => setIsCreating(true)}
                    className="w-full p-10 bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800 hover:border-blue-500 transition-all group flex flex-col items-center gap-4 shadow-xl shadow-black/5"
                >
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black">فتح تذكرة دعم جديدة</h3>
                        <p className="text-gray-400 font-bold text-sm">تواصل معنا بخصوص الكتب أو المذكرات أو أي استفسار.</p>
                    </div>
                </button>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-black/5 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="font-black text-xl">تذكرة جديدة</h3>
                        <button onClick={() => setIsCreating(false)} className="text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">إلغاء</button>
                    </div>
                    <form onSubmit={handleCreateTicket} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">موضوع الطلب</label>
                            <input 
                                required
                                type="text" 
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                placeholder="مثال: حجز مذكرة الكيمياء"
                                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 font-bold outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">رسالتك بالتفصيل</label>
                            <textarea 
                                required
                                rows={4}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="اكتب تفاصيل طلبك أو استفسارك هنا..."
                                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-4 font-bold outline-none transition-all resize-none"
                            />
                        </div>
                        <button 
                            disabled={loading}
                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            إرسال الطلب الآن
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-4">طلباتك السابقة</h4>
                {existingTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 hover:border-blue-100 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                                ticket.status === "OPEN" ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"
                            )}>
                                {ticket.status === "OPEN" ? <Clock className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                            </div>
                            <div>
                                <h4 className="font-black text-lg leading-tight mb-1">{ticket.subject || "بدون عنوان"}</h4>
                                <p className="text-gray-400 font-bold text-xs line-clamp-1">{ticket.messages[0]?.content}</p>
                            </div>
                        </div>
                        <div className="text-left">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                ticket.status === "OPEN" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                            )}>
                                {ticket.status === "OPEN" ? "قيد المعالجة" : "مكتمل"}
                            </span>
                        </div>
                    </div>
                ))}
                {existingTickets.length === 0 && !isCreating && (
                    <div className="text-center py-10 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <p className="text-gray-400 font-bold text-sm">لا يوجد طلبات سابقة.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
