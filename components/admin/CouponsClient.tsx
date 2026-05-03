"use client";

import { useState } from "react";
import { Plus, Trash2, Ticket, Save, X, Calendar, Users, Hash } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function CouponsClient({ initialCoupons, courses, materials }: { initialCoupons: any[], courses: any[], materials: any[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discount: 0,
    type: "PERCENTAGE", // PERCENTAGE, FIXED
    maxUses: 1,
    expiresAt: "",
    courseId: "",
    materialId: "",
    isForAll: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("تم إنشاء الكود بنجاح");
        window.location.reload();
      } else {
        toast.error("فشل إنشاء الكود");
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكود؟")) return;
    
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم الحذف بنجاح");
        setCoupons(coupons.filter(c => c.id !== id));
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    }
  };

  return (
    <div className="space-y-8">
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all group"
        >
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl group-hover:bg-blue-50 transition-colors">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-black">إنشاء كود خصم جديد</span>
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-8 lg:p-12 shadow-2xl shadow-black/5 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black">كود خصم جديد</h2>
            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">كود الخصم (مثلاً: WELCOME50)</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">القيمة</label>
                  <input
                    type="number"
                    required
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">النوع</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  >
                    <option value="PERCENTAGE">% نسبة مئوية</option>
                    <option value="FIXED">مبلغ ثابت</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">أقصى عدد استخدام</label>
                <input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">تاريخ الانتهاء (اختياري)</label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">تطبيق على</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <button
                     type="button"
                     onClick={() => setFormData({ ...formData, isForAll: true, courseId: "", materialId: "" })}
                     className={cn(
                       "p-4 rounded-2xl border-2 font-black transition-all",
                       formData.isForAll ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 border-transparent"
                     )}
                   >
                     كل الموقع
                   </button>
                   <select
                     disabled={formData.isForAll}
                     value={formData.courseId}
                     onChange={(e) => setFormData({ ...formData, courseId: e.target.value, materialId: "", isForAll: false })}
                     className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 font-bold outline-none border-2 border-transparent focus:border-blue-600"
                   >
                     <option value="">اختر كورس معين...</option>
                     {courses.map(c => (
                       <option key={c.id} value={c.id}>{c.title}</option>
                     ))}
                   </select>
                   <select
                     disabled={formData.isForAll}
                     value={formData.materialId}
                     onChange={(e) => setFormData({ ...formData, materialId: e.target.value, courseId: "", isForAll: false })}
                     className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 font-bold outline-none border-2 border-transparent focus:border-blue-600"
                   >
                     <option value="">اختر مذكرة معينة...</option>
                     {materials.map(m => (
                       <option key={m.id} value={m.id}>{m.title}</option>
                     ))}
                   </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isLoading ? "جاري الإنشاء..." : "إنشاء الكود"}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-10 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <Ticket className="w-6 h-6" />
              </div>
              <button
                onClick={() => handleDelete(coupon.id)}
                className="p-2 text-gray-300 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-2xl font-black tracking-widest mb-2">{coupon.code}</h3>
            <div className="flex items-center gap-2 mb-6">
               <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-black">
                 {coupon.type === "PERCENTAGE" ? `${coupon.discount}%` : `${coupon.discount} ج.م`} خصم
               </span>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                 {coupon.isForAll ? "على كل المحتوى" : coupon.course ? "على كورس" : "على مذكرة"}
               </span>
            </div>

            <div className="space-y-3">
               <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    الاستخدام
                  </div>
                  <span>{coupon.currentUses} / {coupon.maxUses || "∞"}</span>
               </div>
               <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-1000" 
                    style={{ width: `${coupon.maxUses ? (coupon.currentUses / coupon.maxUses) * 100 : 0}%` }}
                  />
               </div>
               
               {coupon.expiresAt && (
                 <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mt-4">
                   <Calendar className="w-3.5 h-3.5" />
                   ينتهي في {new Date(coupon.expiresAt).toLocaleDateString("ar-EG")}
                 </div>
               )}

               {(coupon.course || coupon.material) && (
                 <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-3">
                    <Hash className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold truncate">
                      {coupon.course?.title || coupon.material?.title}
                    </span>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
