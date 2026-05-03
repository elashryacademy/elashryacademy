"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, CheckCircle2, XCircle, CreditCard, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function PaymentMethodsClient({ initialMethods }: { initialMethods: any[] }) {
  const [methods, setMethods] = useState(initialMethods);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    provider: "vodafone",
    details: "",
    instructions: "",
    isActive: true
  });

  const providers = [
    { id: "vodafone", name: "فودافون كاش" },
    { id: "orange", name: "أورانج كاش" },
    { id: "etisalat", name: "اتصالات كاش" },
    { id: "we", name: "وي كاش" },
    { id: "fawry", name: "فوري" },
    { id: "aman", name: "أمان" },
    { id: "momken", name: "ممكن" },
    { id: "masary", name: "مصاري" },
    { id: "instapay", name: "انستا باي" },
    { id: "paypal", name: "باي بال" },
    { id: "visa", name: "فيزا / ماستر كارد" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingId ? `/api/admin/payments/${editingId}` : "/api/admin/payments";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingId ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
        window.location.reload();
      } else {
        toast.error("فشل الحفظ");
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    
    try {
      const res = await fetch(`/api/admin/payments/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم الحذف بنجاح");
        setMethods(methods.filter(m => m.id !== id));
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    }
  };

  const toggleStatus = async (method: any) => {
    try {
      const res = await fetch(`/api/admin/payments/${method.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !method.isActive })
      });
      if (res.ok) {
        toast.success("تم تغيير الحالة");
        setMethods(methods.map(m => m.id === method.id ? { ...m, isActive: !m.isActive } : m));
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    }
  };

  const startEdit = (method: any) => {
    setEditingId(method.id);
    setFormData({
      name: method.name,
      provider: method.provider,
      details: method.details,
      instructions: method.instructions || "",
      isActive: method.isActive
    });
    setIsAdding(true);
  };

  return (
    <div className="space-y-8">
      {!isAdding ? (
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ name: "", provider: "vodafone", details: "", instructions: "", isActive: true });
          }}
          className="w-full py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all group"
        >
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl group-hover:bg-blue-50 transition-colors">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-black">إضافة وسيلة دفع جديدة</span>
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-8 lg:p-12 shadow-2xl shadow-black/5 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black">{editingId ? "تعديل وسيلة الدفع" : "إضافة وسيلة دفع جديدة"}</h2>
            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">الاسم (مثلاً: فودافون كاش الأكاديمية)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">النوع</label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">التفاصيل (الرقم أو رقم الحساب)</label>
                <input
                  type="text"
                  required
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  placeholder="010xxxxxxx"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">تعليمات الدفع (تظهر للطالب)</label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold resize-none"
                  placeholder="مثلاً: يرجى تحويل المبلغ وتصوير الشاشة وإرسالها للدعم..."
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isLoading ? "جاري الحفظ..." : "حفظ الوسيلة"}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map((method) => (
          <div key={method.id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border",
                  method.isActive ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-gray-50 border-gray-100 text-gray-400"
                )}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black">{method.name}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{method.provider}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(method)}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(method.id)}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">الرقم / الحساب</p>
                <p className="font-bold text-lg tracking-tight">{method.details}</p>
              </div>
              {method.instructions && (
                <p className="text-sm text-gray-500 font-bold leading-relaxed">{method.instructions}</p>
              )}
            </div>

            <button
              onClick={() => toggleStatus(method)}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all",
                method.isActive 
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              )}
            >
              {method.isActive ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {method.isActive ? "نشط الآن" : "معطل حالياً"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
