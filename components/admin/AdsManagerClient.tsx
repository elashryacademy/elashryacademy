"use client";

import { useState } from "react";
import { 
  Plus, Trash2, Edit2, CheckCircle2, XCircle, 
  Image as ImageIcon, Link as LinkIcon, Code, 
  Layout, Save, X, Loader2, Search
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const POSITIONS = [
  { id: "HOME_TOP", name: "أعلى الصفحة الرئيسية" },
  { id: "HOME_SIDE", name: "جانب الصفحة الرئيسية" },
  { id: "COURSE_DETAILS_TOP", name: "أعلى صفحة الكورس" },
  { id: "COURSE_DETAILS_SIDE", name: "جانب صفحة الكورس" },
  { id: "DASHBOARD_BANNER", name: "بانر لوحة التحكم للطالب" },
  { id: "SEARCH_SIDE", name: "جانب صفحة البحث" },
  { id: "FOOTER_ABOVE", name: "فوق الفوتر" },
];

export default function AdsManagerClient({ initialAds }: { initialAds: any[] }) {
  const [ads, setAds] = useState(initialAds);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    link: "",
    script: "",
    position: "HOME_TOP",
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingId ? `/api/admin/ads/${editingId}` : "/api/admin/ads";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingId ? "تم تحديث الإعلان بنجاح" : "تمت إضافة الإعلان بنجاح");
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
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;
    
    try {
      const res = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم الحذف بنجاح");
        setAds(ads.filter(a => a.id !== id));
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    }
  };

  const toggleStatus = async (ad: any) => {
    try {
      const res = await fetch(`/api/admin/ads/${ad.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !ad.isActive })
      });
      if (res.ok) {
        toast.success("تم تغيير حالة الإعلان");
        setAds(ads.map(a => a.id === ad.id ? { ...a, isActive: !a.isActive } : a));
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    }
  };

  const startEdit = (ad: any) => {
    setEditingId(ad.id);
    setFormData({
      title: ad.title || "",
      image: ad.image || "",
      link: ad.link || "",
      script: ad.script || "",
      position: ad.position,
      isActive: ad.isActive
    });
    setIsAdding(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">إدارة الإعلانات</h1>
          <p className="text-gray-500 font-bold">تحكم في البانرات والإعلانات الخارجية في كافة صفحات المنصة.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({ title: "", image: "", link: "", script: "", position: "HOME_TOP", isActive: true });
            }}
            className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
          >
            <Plus className="w-6 h-6" />
            إضافة إعلان جديد
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-8 lg:p-12 shadow-2xl shadow-black/5 animate-in fade-in zoom-in duration-300 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black">{editingId ? "تعديل الإعلان" : "إضافة إعلان جديد"}</h2>
            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">عنوان الإعلان (داخلي)</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  placeholder="مثلاً: خصم العيد"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">مكان الظهور</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  {POSITIONS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-blue-50/30 dark:bg-blue-900/5 rounded-[2.5rem] border border-blue-100/50 dark:border-blue-900/20">
                <div className="space-y-6">
                  <h3 className="font-black text-blue-600 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    بانر داخلي (صورة ورابط)
                  </h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">رابط الصورة</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-6 py-4 rounded-xl bg-white dark:bg-gray-950 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                      placeholder="https://example.com/ad.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">رابط التوجه عند الضغط</label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-6 py-4 rounded-xl bg-white dark:bg-gray-950 border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                      placeholder="https://example.com/offer"
                    />
                  </div>
                </div>

                <div className="space-y-6 border-r border-blue-100/50 dark:border-blue-900/20 pr-8">
                  <h3 className="font-black text-indigo-600 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    إعلان خارجي (سكريبت)
                  </h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">كود الإعلان (AdSense Code)</label>
                    <textarea
                      rows={5}
                      value={formData.script}
                      onChange={(e) => setFormData({ ...formData, script: e.target.value })}
                      className="w-full px-6 py-4 rounded-xl bg-white dark:bg-gray-950 border-none outline-none focus:ring-2 focus:ring-indigo-600 font-mono text-xs"
                      placeholder="<ins class='adsbygoogle' ...></ins>"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isLoading ? "جاري الحفظ..." : "حفظ الإعلان"}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-12 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 group relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                  {POSITIONS.find(p => p.id === ad.position)?.name || ad.position}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(ad)} className="p-3 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(ad.id)} className="p-3 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black mb-4">{ad.title}</h3>
              
              {ad.image ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                  <img src={ad.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={ad.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <LinkIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : ad.script ? (
                <div className="aspect-video rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 flex flex-col items-center justify-center gap-3 mb-6">
                  <Code className="w-8 h-8 text-indigo-600" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">إعلان برمجي (Script)</span>
                </div>
              ) : null}
            </div>

            <button
              onClick={() => toggleStatus(ad)}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all",
                ad.isActive 
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              )}
            >
              {ad.isActive ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {ad.isActive ? "نشط الآن" : "معطل حالياً"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
