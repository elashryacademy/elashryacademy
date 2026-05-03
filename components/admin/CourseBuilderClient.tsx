"use client";

import { useState } from "react";
import { 
  Plus, Save, Video, FileText, 
  Layers, GripVertical, Trash2, CheckCircle, 
  AlertCircle, X, Loader2, Play, Settings, BookOpen, DollarSign, Type, AlignLeft, Image as ImageIcon, Check, GraduationCap, ShieldCheck,
  Tags
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  content?: string | null;
  order: number;
}

const educationalStages = [
  { id: "PRIMARY", label: "المرحلة الابتدائية", grades: ["الصف الأول الابتدائي", "الصف الثاني الابتدائي", "الصف الثالث الابتدائي", "الصف الرابع الابتدائي", "الصف الخامس الابتدائي", "الصف السادس الابتدائي"] },
  { id: "PREP", label: "المرحلة الإعدادية", grades: ["الصف الأول الإعدادي", "الصف الثاني الإعدادي", "الصف الثالث الإعدادي"] },
  { id: "SECONDARY", label: "المرحلة الثانوية", grades: ["الصف الأول الثانوي", "الصف الثاني الثانوي", "الصف الثالث الثانوي"] },
  { id: "UNIVERSITY", label: "المرحلة الجامعية", grades: ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة", "الفرقة الخامسة", "دراسات عليا"] },
  { id: "GRADUATE", label: "الخريجين والمهنيين", grades: ["خريج", "باحث عن عمل", "موظف / حر"] }
];

export default function CourseBuilderClient({ course, categories = [] }: { course: any, categories?: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"curriculum" | "settings">("curriculum");
  const [lessons, setLessons] = useState<Lesson[]>(course.lessons);
  const [loading, setLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", videoUrl: "", pdfUrl: "", content: "", isLive: false, liveUrl: "", isPreview: false });
  
  const [isPaid, setIsPaid] = useState(course.price > 0);
  const [courseData, setCourseData] = useState({
    title: course.title || "",
    description: course.description || "",
    price: course.price?.toString() || "0",
    thumbnail: course.thumbnail || "",
    level: course.level || "",
    grade: course.grade || "",
    categoryId: course.categoryId || "",
    hasCertificate: course.hasCertificate || false,
    certificateTemplate: course.certificateTemplate || "",
    published: course.published ?? true
  });

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);

    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...courseData,
          price: isPaid ? parseFloat(courseData.price) || 0 : 0
        })
      });

      if (res.ok) {
        toast.success("تم تحديث بيانات الدورة بنجاح");
        router.refresh();
      } else {
        toast.error("فشل التحديث");
      }
    } catch (err) {
      toast.error("خطأ في الاتصال");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/courses/${course.id}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newLesson, order: lessons.length + 1 })
      });

      if (res.ok) {
        const lesson = await res.json();
        setLessons([...lessons, lesson]);
        setIsAdding(false);
        setNewLesson({ title: "", videoUrl: "", pdfUrl: "", content: "", isLive: false, liveUrl: "", isPreview: false });
        toast.success("تم إضافة الدرس بنجاح");
      }
    } catch (err) {
      toast.error("فشل إضافة الدرس");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الدرس؟")) return;

    try {
      const res = await fetch(`/api/courses/${course.id}/lessons/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setLessons(lessons.filter(l => l.id !== id));
        toast.success("تم حذف الدرس");
      }
    } catch (err) {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex items-center gap-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-3xl w-fit">
        <button
            onClick={() => setActiveTab("curriculum")}
            className={cn(
                "px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2",
                activeTab === "curriculum" ? "bg-white dark:bg-gray-900 text-blue-600 shadow-xl" : "text-gray-400 hover:text-gray-600"
            )}
        >
            <BookOpen className="w-4 h-4" /> محتوى الدورة
        </button>
        <button
            onClick={() => setActiveTab("settings")}
            className={cn(
                "px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2",
                activeTab === "settings" ? "bg-white dark:bg-gray-900 text-blue-600 shadow-xl" : "text-gray-400 hover:text-gray-600"
            )}
        >
            <Settings className="w-4 h-4" /> إعدادات الدورة
        </button>
      </div>

      {activeTab === "curriculum" ? (
        <>
          {/* Lessons List */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 overflow-hidden">
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <Layers className="w-5 h-5 text-blue-600" /> دروس الدورة ({lessons.length})
                </h2>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" /> إضافة درس
                </button>
            </div>

            <div className="p-4 space-y-3">
                {lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center font-black text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                {idx + 1}
                            </div>
                            <div>
                                <h3 className="font-black text-lg mb-1">{lesson.title}</h3>
                                <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {lesson.videoUrl && <span className="flex items-center gap-1"><Video className="w-3 h-3 text-red-500" /> فيديو</span>}
                                    {lesson.pdfUrl && <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-blue-500" /> مذكرات PDF</span>}
                                    {(lesson as any).isPreview && <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-md border border-emerald-500/20 text-[8px]">معاينة مجانية</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {lessons.length === 0 && !isAdding && (
                    <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold">لا يوجد دروس مضافة بعد. ابدأ بإضافة درسك الأول!</p>
                    </div>
                )}
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleUpdateCourse} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-10 lg:p-16 shadow-2xl shadow-black/5 space-y-12">
                
                {/* Title & Description */}
                <div className="grid grid-cols-1 gap-10">
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                            <Type className="w-4 h-4" /> عنوان الدورة
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-6 text-xl font-black outline-none transition-all"
                            value={courseData.title}
                            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                            <AlignLeft className="w-4 h-4" /> وصف الدورة
                        </label>
                        <textarea
                            rows={4}
                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-6 text-lg font-bold outline-none transition-all resize-none"
                            value={courseData.description}
                            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                        />
                    </div>
                </div>

                {/* Level & Grade & Category */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                            <Tags className="w-4 h-4" /> القسم / التخصص
                        </label>
                        <select
                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-6 text-lg font-bold outline-none transition-all appearance-none"
                            value={courseData.categoryId}
                            onChange={(e) => setCourseData({ ...courseData, categoryId: e.target.value })}
                        >
                            <option value="">اختر القسم...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" /> المرحلة التعليمية
                        </label>
                        <select
                            required
                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-6 text-lg font-bold outline-none transition-all appearance-none"
                            value={courseData.level}
                            onChange={(e) => setCourseData({ ...courseData, level: e.target.value, grade: "" })}
                        >
                            <option value="">اختر المرحلة...</option>
                            {educationalStages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" /> السنة الدراسية
                        </label>
                        <select
                            required
                            disabled={!courseData.level}
                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-6 text-lg font-bold outline-none transition-all appearance-none disabled:opacity-50"
                            value={courseData.grade}
                            onChange={(e) => setCourseData({ ...courseData, grade: e.target.value })}
                        >
                            <option value="">اختر السنة...</option>
                            {educationalStages.find(s => s.id === courseData.level)?.grades.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> نوع الدورة (مجانية / مدفوعة)
                    </label>
                    <div className="grid grid-cols-2 gap-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setIsPaid(false)}
                            className={cn(
                                "flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all",
                                !isPaid ? "bg-white dark:bg-gray-900 text-emerald-600 shadow-xl" : "text-gray-400"
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
                                isPaid ? "bg-white dark:bg-gray-900 text-blue-600 shadow-xl" : "text-gray-400"
                            )}
                        >
                            {isPaid && <Check className="w-4 h-4" />}
                            مدفوعة
                        </button>
                    </div>

                    {isPaid && (
                        <div className="relative animate-in slide-in-from-top-2">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">ج.م</span>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-6 text-lg font-black outline-none transition-all pl-16"
                                value={courseData.price}
                                onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                {/* Thumbnail */}
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> رابط صورة الدورة
                    </label>
                    <input
                        type="url"
                        className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-6 text-lg font-bold outline-none transition-all"
                        value={courseData.thumbnail}
                        onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.value })}
                    />
                </div>

                {/* Certificate */}
                <div className="p-8 bg-blue-500/5 rounded-3xl border-2 border-dashed border-blue-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-black text-lg">شهادة إتمام الدورة</h4>
                            <p className="text-xs text-gray-400 font-bold mt-1">تفعيل إصدار الشهادات لهذه الدورة</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCourseData({ ...courseData, hasCertificate: !courseData.hasCertificate })}
                        className={cn(
                            "w-16 h-8 rounded-full transition-all relative",
                            courseData.hasCertificate ? "bg-blue-600" : "bg-gray-200"
                        )}
                    >
                        <div className={cn(
                            "absolute top-1 w-6 h-6 bg-white rounded-full transition-all",
                            courseData.hasCertificate ? "right-9" : "right-1"
                        )} />
                    </button>
                </div>

                {courseData.hasCertificate && (
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> رابط قالب الشهادة
                        </label>
                        <input
                            type="url"
                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-6 text-lg font-bold outline-none transition-all"
                            value={courseData.certificateTemplate}
                            onChange={(e) => setCourseData({ ...courseData, certificateTemplate: e.target.value })}
                        />
                    </div>
                )}

                <div className="flex justify-end pt-8">
                    <button
                        type="submit"
                        disabled={savingSettings}
                        className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                    >
                        {savingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        حفظ الإعدادات
                    </button>
                </div>
            </div>
        </form>
      )}

      {/* Add Lesson Modal/Overlay */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden">
                <form onSubmit={handleAddLesson}>
                    <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h2 className="text-2xl font-black tracking-tight">إضافة درس جديد</h2>
                        <button type="button" onClick={() => setIsAdding(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="p-10 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">عنوان الدرس</label>
                            <input 
                                required
                                type="text"
                                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 font-bold outline-none transition-all"
                                placeholder="مثال: مدخل إلى البرمجة الكائنية"
                                value={newLesson.title}
                                onChange={e => setNewLesson({...newLesson, title: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2"><Video className="w-3 h-3" /> رابط الفيديو</label>
                                <input 
                                    type="url"
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 font-bold outline-none transition-all"
                                    placeholder="YouTube / Vimeo URL"
                                    value={newLesson.videoUrl}
                                    onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2"><FileText className="w-3 h-3" /> رابط ملف PDF</label>
                                <input 
                                    type="url"
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 font-bold outline-none transition-all"
                                    placeholder="https://example.com/file.pdf"
                                    value={newLesson.pdfUrl}
                                    onChange={e => setNewLesson({...newLesson, pdfUrl: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">محتوى الدرس (اختياري)</label>
                            <textarea 
                                rows={4}
                                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 font-bold outline-none transition-all resize-none"
                                placeholder="اكتب شرحاً نصياً للدرس هنا..."
                                value={newLesson.content}
                                onChange={e => setNewLesson({...newLesson, content: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-600"
                                    checked={newLesson.isLive}
                                    onChange={e => setNewLesson({...newLesson, isLive: e.target.checked})}
                                />
                                <span className="font-black text-sm">بث مباشر؟</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-emerald-600"
                                    checked={newLesson.isPreview}
                                    onChange={e => setNewLesson({...newLesson, isPreview: e.target.checked})}
                                />
                                <span className="font-black text-sm">متاح مجاناً (معاينة)؟</span>
                            </label>

                            {newLesson.isLive && (
                                <div className="md:col-span-2 mt-2">
                                    <input 
                                        type="url"
                                        className="w-full bg-white dark:bg-gray-900 border-2 border-transparent focus:border-blue-600 rounded-xl p-3 font-bold outline-none transition-all"
                                        placeholder="رابط البث (YouTube/Zoom/Google Meet)"
                                        value={newLesson.liveUrl}
                                        onChange={e => setNewLesson({...newLesson, liveUrl: e.target.value})}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="px-10 py-8 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 font-black text-xs uppercase text-gray-500 hover:text-gray-900 transition-colors">إلغاء</button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            حفظ الدرس
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
