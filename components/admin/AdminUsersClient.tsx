"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import DeleteUserButton from "./DeleteUserButton";
import UserDetailsModal from "./UserDetailsModal";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

export default function AdminUsersClient({ users, parents }: { users: any[], parents: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleRoleChange = async (userId: string, role: string) => {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        toast.success("تم تغيير الصلاحية بنجاح");
        window.location.reload();
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    } finally {
      setLoading(null);
    }
  };

  const handleLinkParent = async (userId: string, parentId: string) => {
    if (!parentId) return;
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${parentId}/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId: userId })
      });
      if (res.ok) {
        toast.success("تم ربط ولي الأمر بنجاح");
        window.location.reload();
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    } finally {
      setLoading(null);
    }
  };

  const togglePermissions = async (userId: string, current: boolean) => {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/permissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canUpload: !current })
      });
      if (res.ok) {
        toast.success("تم تحديث الصلاحيات");
        window.location.reload();
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    } finally {
      setLoading(null);
    }
  };

  const toggleVerification = async (userId: string, current: boolean) => {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !current })
      });
      if (res.ok) {
        toast.success(current ? "تم إلغاء التفعيل" : "تم التفعيل بنجاح");
        window.location.reload();
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    } finally {
      setLoading(null);
    }
  };

  const handleCommissionChange = async (userId: string, commission: string) => {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/commission`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionRate: parseFloat(commission) })
      });
      if (res.ok) {
        toast.success("تم تحديث النسبة بنجاح");
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className={cn(
          "bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 lg:p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 hover:border-blue-200 transition-all group relative overflow-hidden",
          loading === user.id && "opacity-50 pointer-events-none"
        )}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center justify-center font-black text-3xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        {user.name?.[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-black tracking-tight">{user.name}</h3>
                            {user.studentCode && (
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-lg text-[10px] font-black border border-gray-200">
                                    ID: {user.studentCode}
                                </span>
                            )}
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                user.role === "ADMIN" ? "bg-purple-100 text-purple-600" :
                                user.role === "TEACHER" ? "bg-emerald-100 text-emerald-600" :
                                user.role === "PARENT" ? "bg-amber-100 text-amber-600" :
                                user.role === "SUPPORT" ? "bg-pink-100 text-pink-600" :
                                user.role === "ASSISTANT" ? "bg-indigo-100 text-indigo-600" :
                                "bg-blue-100 text-blue-600"
                            )}>
                                {user.role === "SUPPORT" ? "دعم فني" : user.role === "ASSISTANT" ? "مساعد" : user.role}
                            </span>
                        </div>
                        <p className="text-gray-400 font-bold text-sm tracking-tight flex items-center gap-2">
                            <span className="text-blue-600">@{user.username || "no-username"}</span>
                            <span>•</span>
                            <span>{user.email}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">تفعيل الحساب</p>
                        <button
                          onClick={() => toggleVerification(user.id, user.isVerified)}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border",
                            user.isVerified 
                              ? "bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-500/20" 
                              : "bg-gray-100 text-gray-400 border-gray-200"
                          )}
                        >
                          {user.isVerified ? "نشط" : "غير نشط"}
                        </button>
                    </div>

                    {user.role === "STUDENT" && (
                      <div className="flex flex-col gap-1 min-w-[150px]">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">ربط ولي الأمر</p>
                        <select
                          defaultValue={user.parentId || ""}
                          onChange={(e) => handleLinkParent(user.id, e.target.value)}
                          className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-600"
                        >
                          <option value="">اختر ولي الأمر...</option>
                          {parents.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (@{p.username})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">تغيير الدور</p>
                        <select
                            defaultValue={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-600"
                        >
                            <option value="STUDENT">طالب</option>
                            <option value="TEACHER">مدرس</option>
                            <option value="PARENT">ولي أمر</option>
                            <option value="SUPPORT">دعم فني</option>
                            <option value="ASSISTANT">مساعد</option>
                            <option value="ADMIN">مدير</option>
                        </select>
                    </div>

                    {user.role === "TEACHER" && (
                      <>
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">النسبة للمدرس (%)</p>
                          <input 
                            type="number" 
                            defaultValue={user.commissionRate}
                            onBlur={(e) => handleCommissionChange(user.id, e.target.value)}
                            placeholder="مثال: 80"
                            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-blue-600 w-24"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">صلاحية الرفع</p>
                          <button
                            onClick={() => togglePermissions(user.id, user.canUpload)}
                            className={cn(
                              "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border",
                              user.canUpload 
                                ? "bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/20" 
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                            )}
                          >
                            {user.canUpload ? "مفعل" : "معطل"}
                          </button>
                        </div>
                      </>
                    )}

                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                      title="فحص البيانات"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    <DeleteUserButton userId={user.id} userName={user.name || "مستخدم"} />
                </div>
            </div>
        </div>
      ))}

      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
}
