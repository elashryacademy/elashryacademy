"use client";

import { useState } from "react";
import { Send, Users, MessageSquare, Mail, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function NotificationManagerClient({ users }: { users: any[] }) {
    const [loading, setLoading] = useState(false);
    const [targetType, setTargetType] = useState<"all" | "specific">("all");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [channels, setChannels] = useState<string[]>(["platform"]);
    const [formData, setFormData] = useState({
        title: "",
        message: ""
    });

    const toggleChannel = (channel: string) => {
        setChannels(prev => 
            prev.includes(channel) 
                ? prev.filter(c => c !== channel) 
                : [...prev, channel]
        );
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (channels.length === 0) return toast.error("برجاء اختيار قناة واحدة على الأقل");
        if (targetType === "specific" && selectedUsers.length === 0) return toast.error("برجاء اختيار مستخدم واحد على الأقل");

        setLoading(true);
        try {
            const res = await fetch("/api/admin/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userIds: targetType === "all" ? "all" : selectedUsers,
                    title: formData.title,
                    message: formData.message,
                    channels
                })
            });

            if (res.ok) {
                toast.success("تم إرسال الإشعارات بنجاح");
                setFormData({ title: "", message: "" });
                setSelectedUsers([]);
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء الإرسال");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="bg-[var(--card)] rounded-[3rem] p-10 lg:p-16 border border-[var(--border)] shadow-2xl shadow-black/5">
                <form onSubmit={handleSend} className="space-y-12">
                    {/* Target Selection */}
                    <div className="space-y-6">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">إرسال إلى</label>
                        <div className="grid grid-cols-2 gap-4 p-2 bg-[var(--muted)]/50 rounded-2xl border border-[var(--border)]">
                            <button
                                type="button"
                                onClick={() => setTargetType("all")}
                                className={cn(
                                    "flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all",
                                    targetType === "all" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-xl" : "text-gray-400"
                                )}
                            >
                                <Users className="w-4 h-4" /> جميع المستخدمين
                            </button>
                            <button
                                type="button"
                                onClick={() => setTargetType("specific")}
                                className={cn(
                                    "flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all",
                                    targetType === "specific" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-xl" : "text-gray-400"
                                )}
                            >
                                <Users className="w-4 h-4" /> مستخدمين محددين
                            </button>
                        </div>

                        {targetType === "specific" && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <select
                                    multiple
                                    className="w-full bg-[var(--muted)] border-none rounded-2xl px-6 py-4 font-bold outline-none ring-2 ring-transparent focus:ring-blue-600 transition-all min-h-[150px]"
                                    onChange={(e) => {
                                        const values = Array.from(e.target.selectedOptions, option => option.value);
                                        setSelectedUsers(values);
                                    }}
                                >
                                    {users.map(user => (
                                        <option key={user.id} value={user.id} className="p-2">{user.name} (@{user.username})</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-gray-400 font-bold mt-2 px-2 uppercase tracking-widest italic">استخدم Ctrl/Cmd للاختيار المتعدد</p>
                            </div>
                        )}
                    </div>

                    {/* Channels Selection */}
                    <div className="space-y-6">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">قنوات الإرسال</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { id: "platform", name: "إشعار في المنصة", icon: MessageSquare, color: "text-blue-600" },
                                { id: "whatsapp", name: "رسالة واتساب", icon: MessageCircle, color: "text-emerald-600" },
                                { id: "email", name: "بريد إلكتروني", icon: Mail, color: "text-indigo-600" },
                            ].map((channel) => (
                                <button
                                    key={channel.id}
                                    type="button"
                                    onClick={() => toggleChannel(channel.id)}
                                    className={cn(
                                        "p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all group",
                                        channels.includes(channel.id) 
                                            ? "border-blue-600 bg-blue-50/50" 
                                            : "border-transparent bg-[var(--muted)] hover:border-gray-200"
                                    )}
                                >
                                    <channel.icon className={cn("w-8 h-8", channels.includes(channel.id) ? channel.color : "text-gray-400")} />
                                    <span className={cn("font-black text-sm", channels.includes(channel.id) ? "text-gray-900" : "text-gray-400")}>
                                        {channel.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">عنوان الإشعار</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-[var(--muted)] border-none rounded-2xl px-8 py-5 font-black text-lg outline-none ring-2 ring-transparent focus:ring-blue-600 transition-all"
                                placeholder="مثال: خبر سار لجميع الطلاب!"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">نص الرسالة</label>
                            <textarea
                                required
                                rows={6}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-[var(--muted)] border-none rounded-2xl px-8 py-5 font-bold text-lg outline-none ring-2 ring-transparent focus:ring-blue-600 transition-all resize-none"
                                placeholder="اكتب تفاصيل الإشعار هنا..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-4 hover:opacity-90 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                        بث الإشعارات الآن
                    </button>
                </form>
            </div>

            <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-6">
                <div className="p-4 bg-amber-100 rounded-2xl text-amber-600">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-black text-amber-900 mb-1 italic">تنبيه هام للمدير</h4>
                    <p className="text-sm font-bold text-amber-700 leading-relaxed">
                        عند الإرسال عبر الواتساب أو البريد الإلكتروني لعدد كبير من المستخدمين، قد يستغرق الأمر بعض الوقت. تأكد من استقرار اتصالك بالإنترنت ولا تغلق الصفحة حتى تكتمل العملية.
                    </p>
                </div>
            </div>
        </div>
    );
}
