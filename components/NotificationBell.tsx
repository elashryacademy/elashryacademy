"use client";

import { useState, useEffect } from "react";
import { Bell, X, Check, Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function NotificationBell({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.isRead).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
            if (res.ok) {
                setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            toast.error("حدث خطأ");
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
            if (res.ok) {
                setNotifications(notifications.filter(n => n.id !== id));
                if (!notifications.find(n => n.id === id).isRead) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
                toast.success("تم حذف الإشعار");
            }
        } catch (error) {
            toast.error("حدث خطأ");
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-95"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 mt-4 w-[350px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-sm font-black uppercase tracking-widest">الإشعارات</h3>
                            <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-gray-400" /></button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        className={cn(
                                            "p-6 border-b border-gray-50 flex gap-4 group transition-all",
                                            !n.isRead ? "bg-blue-50/30" : "hover:bg-gray-50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                            !n.isRead ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                                        )}>
                                            <Info className="w-5 h-5" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className={cn("text-xs mb-1 truncate", !n.isRead ? "font-black" : "font-bold")}>{n.title}</h4>
                                            <p className="text-[11px] text-gray-500 leading-relaxed mb-2 line-clamp-2">{n.message}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{new Date(n.createdAt).toLocaleDateString('ar-EG')}</span>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!n.isRead && (
                                                        <button 
                                                            onClick={() => markAsRead(n.id)}
                                                            className="p-1.5 text-blue-600 hover:bg-white rounded-md shadow-sm border border-gray-100"
                                                            title="تحديد كمقروء"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => deleteNotification(n.id)}
                                                        className="p-1.5 text-red-500 hover:bg-white rounded-md shadow-sm border border-gray-100"
                                                        title="حذف"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <Bell className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                    <p className="text-xs font-bold text-gray-400">لا توجد إشعارات جديدة</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
