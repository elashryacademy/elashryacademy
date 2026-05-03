"use client";

import { useState } from "react";
import { X, UserPlus, Shield, User, Mail, Lock, Phone } from "lucide-react";
import toast from "react-hot-toast";

interface AddUserModalProps {
  onClose: () => void;
}

export default function AddUserModal({ onClose }: AddUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    role: "STUDENT"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("تم إضافة المستخدم بنجاح");
        onClose();
        window.location.reload();
      } else {
        const error = await res.json();
        toast.error(error.error || "حدث خطأ ما");
      }
    } catch (err) {
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
        <div className="p-8 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-1">إضافة مستخدم جديد</h2>
              <p className="text-gray-400 font-bold">قم بتعبئة بيانات المستخدم الجديد.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-red-500 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">الاسم بالكامل</label>
                <div className="relative">
                  <User className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="أدخل الاسم..."
                    className="w-full pr-14 pl-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">اليوزرنيم</label>
                  <input 
                    required
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="username"
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="012xxxxxxx"
                      className="w-full pr-12 pl-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    className="w-full pr-14 pl-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pr-14 pl-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">الصلاحية</label>
                <div className="relative">
                  <Shield className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full pr-14 pl-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold transition-all appearance-none"
                  >
                    <option value="STUDENT">طالب</option>
                    <option value="TEACHER">مدرس</option>
                    <option value="PARENT">ولي أمر</option>
                    <option value="SUPPORT">دعم فني</option>
                    <option value="ASSISTANT">مساعد</option>
                    <option value="ADMIN">مدير</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <UserPlus className="w-6 h-6" />
              {loading ? "جاري الإضافة..." : "إضافة المستخدم الآن"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
