"use client";

import { useState } from "react";
import { Plus, Trash2, Hash, BookOpen, CheckCircle, X, Loader2, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function CouponManagerClient({ courses, initialCoupons }: { courses: any[], initialCoupons: any[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ courseId: "", count: 1 });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newCoupons = await res.json();
        setCoupons([...newCoupons, ...coupons]);
        setIsAdding(false);
        toast.success(`تم إنشاء ${newCoupons.length} كود بنجاح`);
      }
    } catch (err) {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("تم النسخ!");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> إنشاء أكواد جديدة
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">الكود</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">الدورة</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">الحالة</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">تاريخ الإنشاء</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 select-all">{coupon.code}</span>
                    <button onClick={() => copyToClipboard(coupon.code)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Copy className="w-4 h-4 text-gray-400" /></button>
                  </div>
                </td>
                <td className="px-8 py-6 font-bold">{coupon.course.title}</td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    coupon.isUsed ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {coupon.isUsed ? "تم الاستخدام" : "متاح"}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-gray-400 font-bold">
                  {new Date(coupon.createdAt).toLocaleDateString("ar-EG")}
                </td>
                <td className="px-8 py-6">
                  <button className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden">
            <form onSubmit={handleGenerate}>
              <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-2xl font-black tracking-tight">إنشاء أكواد جديدة</h2>
                <button type="button" onClick={() => setIsAdding(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">اختر الدورة</label>
                  <select 
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 font-bold outline-none transition-all"
                    value={formData.courseId}
                    onChange={e => setFormData({...formData, courseId: e.target.value})}
                  >
                    <option value="">اختر الدورة...</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">عدد الأكواد</label>
                  <input 
                    type="number" 
                    min="1" max="100"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 font-bold outline-none transition-all"
                    value={formData.count}
                    onChange={e => setFormData({...formData, count: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="px-10 py-8 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 font-black text-xs uppercase text-gray-500 hover:text-gray-900 transition-colors">إلغاء</button>
                <button 
                  type="submit" 
                  disabled={loading || !formData.courseId}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  توليد الأكواد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
