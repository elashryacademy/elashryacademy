"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { 
    Shield, 
    BookOpen, 
    Users as UsersIcon, 
    MessageSquare, 
    Award, 
    Settings, 
    TrendingUp, 
    Upload,
    Check,
    X,
    Loader2
} from "lucide-react";

interface StaffMember {
    id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    canUpload: boolean;
    canManageCourses: boolean;
    canManageUsers: boolean;
    canManageSupport: boolean;
    canManageCertificates: boolean;
    canManageSettings: boolean;
    canViewStats: boolean;
}

export default function StaffManagerClient({ initialStaff }: { initialStaff: StaffMember[] }) {
    const [staff, setStaff] = useState(initialStaff);
    const [updating, setUpdating] = useState<string | null>(null);

    const togglePermission = async (userId: string, permission: keyof StaffMember, current: boolean) => {
        setUpdating(`${userId}-${permission as string}`);
        
        try {
            const member = staff.find(s => s.id === userId);
            if (!member) return;

            const updatedPermissions = {
                canUpload: member.canUpload,
                canManageCourses: member.canManageCourses,
                canManageUsers: member.canManageUsers,
                canManageSupport: member.canManageSupport,
                canManageCertificates: member.canManageCertificates,
                canManageSettings: member.canManageSettings,
                canViewStats: member.canViewStats,
                [permission]: !current
            };

            const res = await fetch(`/api/admin/users/${userId}/permissions`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPermissions)
            });

            if (res.ok) {
                setStaff(staff.map(s => s.id === userId ? { ...s, ...updatedPermissions } : s));
                toast.success("تم تحديث الصلاحية بنجاح");
            } else {
                toast.error("فشل التحديث");
            }
        } catch (err) {
            toast.error("خطأ في الاتصال");
        } finally {
            setUpdating(null);
        }
    };

    const PermissionButton = ({ memberId, permission, current, icon: Icon, label }: any) => {
        const isUpdating = updating === `${memberId}-${permission}`;
        return (
            <button
                onClick={() => togglePermission(memberId, permission, current)}
                disabled={isUpdating}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all group",
                    current 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20" 
                        : "bg-gray-50 border-gray-100 text-gray-400 grayscale hover:grayscale-0 dark:bg-gray-800 dark:border-gray-700"
                )}
            >
                <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    current ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}>
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{label}</p>
                    <p className="text-xs font-bold">{current ? "مفعّل" : "معطل"}</p>
                </div>
                {current ? <Check className="w-4 h-4 mr-auto text-emerald-500" /> : <X className="w-4 h-4 mr-auto text-gray-300" />}
            </button>
        );
    };

    return (
        <div className="grid grid-cols-1 gap-8">
            {staff.map((member) => (
                <div key={member.id} className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-black/5 overflow-hidden transition-all hover:border-blue-100">
                    {/* Member Header */}
                    <div className="p-8 lg:p-10 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/30">
                                {member.name?.[0].toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-2xl font-black tracking-tight">{member.name}</h3>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        member.role === "ADMIN" ? "bg-purple-100 text-purple-600" :
                                        member.role === "TEACHER" ? "bg-emerald-100 text-emerald-600" :
                                        "bg-blue-100 text-blue-600"
                                    )}>
                                        {member.role === "SUPPORT" ? "دعم فني" : member.role === "ASSISTANT" ? "مساعد" : member.role}
                                    </span>
                                </div>
                                <p className="text-gray-400 font-bold text-sm tracking-tight flex items-center gap-2">
                                    <span className="text-blue-600">@{member.username}</span>
                                    <span>•</span>
                                    <span>{member.email}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Permissions Grid */}
                    <div className="p-8 lg:p-10">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 px-2">التحكم في صلاحيات الفريق</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <PermissionButton 
                                memberId={member.id} 
                                permission="canManageCourses" 
                                current={member.canManageCourses} 
                                icon={BookOpen} 
                                label="إدارة الكورسات" 
                            />
                            <PermissionButton 
                                memberId={member.id} 
                                permission="canManageUsers" 
                                current={member.canManageUsers} 
                                icon={UsersIcon} 
                                label="إدارة المستخدمين" 
                            />
                            <PermissionButton 
                                memberId={member.id} 
                                permission="canManageSupport" 
                                current={member.canManageSupport} 
                                icon={MessageSquare} 
                                label="الدعم الفني" 
                            />
                            <PermissionButton 
                                memberId={member.id} 
                                permission="canManageCertificates" 
                                current={member.canManageCertificates} 
                                icon={Award} 
                                label="إدارة الشهادات" 
                            />
                            <PermissionButton 
                                memberId={member.id} 
                                permission="canViewStats" 
                                current={member.canViewStats} 
                                icon={TrendingUp} 
                                label="عرض الإحصائيات" 
                            />
                            <PermissionButton 
                                memberId={member.id} 
                                permission="canManageSettings" 
                                current={member.canManageSettings} 
                                icon={Settings} 
                                label="الإعدادات العامة" 
                            />
                            <PermissionButton 
                                memberId={member.id} 
                                permission="canUpload" 
                                current={member.canUpload} 
                                icon={Upload} 
                                label="صلاحية الرفع" 
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
