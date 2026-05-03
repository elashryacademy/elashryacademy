"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
    BookOpen, 
    Image as ImageIcon, 
    DollarSign, 
    Type, 
    AlignLeft, 
    Save, 
    X, 
    Loader2,
    GraduationCap,
    ShieldCheck,
    Check,
    Tags
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function NewCourseClient({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: "",
    level: "",
    grade: "",
    categoryId: "",
    hasCertificate: false,
    certificateTemplate: "",
  });

  const educationalStages = [
    { id: "PRIMARY", label: "المرحلة الابتدائية", grades: ["الصف الأول الابتدائي", "الصف الثاني الابتدائي", "الصف الثالث الابتدائي", "الصف الرابع الابتدائي", "الصف الخامس الابتدائي", "الصف السادس الابتدائي"] },
    { id: "PREP", label: "المرحلة الإعدادية", grades: ["الصف الأول الإعدادي", "الصف الثاني الإعدادي", "الصف الثالث الإعدادي"] },
    { id: "SECONDARY", label: "المرحلة الثانوية", grades: ["الصف الأول الثانوي", "الصف الثاني الثانوي", "الصف الثالث الثانوي"] },
    { id: "UNIVERSITY", label: "المرحلة الجامعية", grades: ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة", "الفرقة الخامسة", "دراسات عليا"] },
    { id: "GRADUATE", label: "الخريجين والمهنيين", grades: ["خريج", "باحث عن عمل", "موظف / حر"] }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: isPaid ? parseFloat(formData.price) || 0 : 0,
        }),
      });

      if (response.ok) {
        toast.success("تم إنشاء الدورة بنجاح!");
        router.push("/dashboard/admin/courses");
        router.refresh();
      } else {
        toast.error("حدث خطأ أثناء إنشاء الدورة.");
      }
    } catch (error) {
      toast.error("فشل الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 lg:py-20 min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-16">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase">إنشاء دورة جديدة</h1>
            <button 
                onClick={() => router.back()}
                className="p-4 bg-[var(--muted)] hover:bg-[var(--border)] rounded-2xl transition-all"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="bg-[var(--card)] rounded-[3rem] border border-[var(--border)] p-10 lg:p-16 shadow-2xl shadow-black/5 dark:shadow-white/5 space-y-12">
            
            {/* Title */}
            <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                    <Type className="w-4 h-4" /> عنوان الدورة
                </label>
                <input
                    type="text"
                    required
                    className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--accent)] rounded-2xl p-6 text-xl font-black outline-none transition-all placeholder:text-gray-300"
                    placeholder="مثال: احتراف تطوير الويب باستخدام Next.js"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
            </div>

            {/* Description */}
            <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" /> وصف الدورة
                </label>
                <textarea
                    required
                    rows={5}
                    className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--accent)] rounded-2xl p-6 text-lg font-bold outline-none transition-all placeholder:text-gray-300 resize-none"
                    placeholder="اكتب وصفاً مفصلاً عما سيتعلمه الطلاب في هذه الدورة..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Category */}
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <Tags className="w-4 h-4" /> القسم / التخصص
                    </label>
                    <select
                        className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--accent)] rounded-2xl p-6 text-lg font-bold outline-none transition-all appearance-none"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                        <option value="">اختر القسم...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                {/* Level */}
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> المرحلة التعليمية
                    </label>
                    <select
                        required
                        className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--accent)] rounded-2xl p-6 text-lg font-bold outline-none transition-all appearance-none"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value, grade: "" })}
                    >
                        <option value="">اختر المرحلة...</option>
                        {educationalStages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                </div>

                {/* Grade */}
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> السنة الدراسية
                    </label>
                    <select
                        required
                        disabled={!formData.level}
                        className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--accent)] rounded-2xl p-6 text-lg font-bold outline-none transition-all appearance-none disabled:opacity-50"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    >
                        <option value="">اختر السنة...</option>
                        {educationalStages.find(s => s.id === formData.level)?.grades.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                {/* Pricing Selection */}
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> نوع الدورة (مجانية / مدفوعة)
                    </label>
                    <div className="grid grid-cols-2 gap-4 p-2 bg-[var(--muted)]/50 rounded-2xl border border-[var(--border)]">
                        <button
                            type="button"
                            onClick={() => setIsPaid(false)}
                            className={cn(
                                "flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all",
                                !isPaid ? "bg-white dark:bg-gray-800 text-emerald-600 shadow-xl" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {!isPaid && <Check className="w-4 h-4" />}
                            مجانية
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsPaid(true)}
                            className={cn(
                                "flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all",
                                isPaid ? "bg-white dark:bg-gray-800 text-blue-600 shadow-xl" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {isPaid && <Check className="w-4 h-4" />}
                            مدفوعة
                        </button>
                    </div>

                    {isPaid && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                             <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">ج.م</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    required={isPaid}
                                    className="w-full bg-[var(--muted)] border-2 border-transparent focus:border-[var(--accent)] rounded-2xl p-6 text-lg font-black outline-none transition-all pl-16"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                             </div>
                        </div>
                    )}
                </div>

                {/* Thumbnail */}
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> رابط صورة الدورة (Thumbnail)
                    </label>
                    <input
                        type="url"
                        className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--accent)] rounded-2xl p-6 text-lg font-bold outline-none transition-all"
                        placeholder="https://example.com/image.jpg"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    />
                </div>
            </div>

            {/* Certificate Toggle */}
            <div className="p-8 bg-blue-500/5 rounded-3xl border-2 border-dashed border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-600">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-lg">شهادة إتمام الدورة</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">هل تمنح هذه الدورة شهادة معتمدة عند الانتهاء؟</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasCertificate: !formData.hasCertificate })}
                    className={cn(
                        "w-16 h-8 rounded-full transition-all relative",
                        formData.hasCertificate ? "bg-blue-600" : "bg-gray-200"
                    )}
                >
                    <div className={cn(
                        "absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm",
                        formData.hasCertificate ? "right-9" : "right-1"
                    )} />
                </button>
            </div>

            {formData.hasCertificate && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> رابط قالب الشهادة (خلفية الشهادة)
                    </label>
                    <input
                        type="url"
                        className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--accent)] rounded-2xl p-6 text-lg font-bold outline-none transition-all"
                        placeholder="https://example.com/certificate-bg.jpg"
                        value={formData.certificateTemplate}
                        onChange={(e) => setFormData({ ...formData, certificateTemplate: e.target.value })}
                    />
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest px-2 italic">اتركه فارغاً لاستخدام التصميم الافتراضي للمنصة</p>
                </div>
            )}
          </div>

          <div className="flex justify-end gap-6">
            <button
                type="button"
                onClick={() => router.back()}
                className="px-10 py-5 bg-[var(--muted)] text-gray-500 rounded-2xl font-black uppercase tracking-widest hover:bg-[var(--border)] transition-all"
            >
                إلغاء
            </button>
            <button
                type="submit"
                disabled={loading}
                className="px-12 py-5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 transition-all active:scale-95 shadow-2xl shadow-black/20 disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                حفظ ونشر الدورة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
