"use client";

import { useState } from "react";
import { 
  User, Mail, Lock, Save, Camera, 
  BookOpen, Clock, Award, Play, 
  Settings, Activity, LayoutDashboard,
  ShieldCheck, Users, LogOut, FileText, Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function ProfileClient({ user, session }: { user: any, session: any }) {
  const [activeTab, setActiveTab] = useState("activity");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    image: user.image || "",
    bio: user.bio || "",
    subject: user.subject || "",
    experience: user.experience || "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const toastId = toast.loading("جاري رفع الصورة...");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        toast.success("تم رفع الصورة بنجاح", { id: toastId });
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الرفع", { id: toastId });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("تم تحديث الملف الشخصي بنجاح");
        router.refresh();
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "activity", name: "لوحة التحكم", icon: Activity },
    { id: "settings", name: "إعدادات الحساب", icon: Settings },
  ];

  return (
    <div className="py-12 lg:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Header */}
        <div className="bg-[var(--card)] rounded-[3rem] border border-[var(--border)] overflow-hidden shadow-2xl shadow-black/5 dark:shadow-white/5 mb-12">
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
            <div className="absolute -bottom-16 right-12 flex items-end gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-[var(--card)] p-1.5 shadow-2xl border border-[var(--border)] overflow-hidden">
                  {formData.image ? (
                    <img src={formData.image} alt="Profile" className="w-full h-full rounded-[2rem] object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-[2rem] bg-[var(--muted)] flex items-center justify-center text-[var(--accent)] text-4xl font-black">
                      {user.name?.[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -left-2 p-3 bg-white dark:bg-gray-900 text-blue-600 rounded-2xl shadow-xl cursor-pointer hover:scale-110 transition-transform active:scale-95 border border-gray-100 dark:border-gray-800">
                  <Camera className="w-5 h-5" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-black text-white tracking-tighter">{user.name}</h1>
                  {user.studentCode && (
                    <span className="bg-white/10 text-white px-4 py-1.5 rounded-2xl text-[12px] font-black tracking-widest border border-white/20 backdrop-blur-md flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ID: {user.studentCode}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-blue-100 font-bold text-sm tracking-widest uppercase opacity-80">{user.role}</p>
                  <span className="w-1 h-1 rounded-full bg-blue-300 opacity-50" />
                  <p className="text-blue-100 font-bold text-sm tracking-widest uppercase opacity-80">@{user.username}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-20 pb-8 px-12 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm transition-all",
                    activeTab === tab.id 
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
              {user.role === "ADMIN" && (
                <Link href="/dashboard/admin" className="flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100 transition-all">
                  <LayoutDashboard className="w-4 h-4" />
                  إدارة النظام
                </Link>
              )}
            </div>
            <button onClick={() => signOut()} className="flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "activity" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {user.role === "STUDENT" && <StudentActivity user={user} />}
             {user.role === "TEACHER" && <TeacherActivity user={user} />}
             {user.role === "PARENT" && <ParentActivity user={user} />}
             {user.role === "ADMIN" && (
               <div className="bg-blue-50 dark:bg-blue-900/10 p-12 rounded-[3rem] border border-blue-100 dark:border-blue-900/20 text-center">
                  <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-black mb-4">أهلاً بك يا مدير النظام</h2>
                  <p className="text-gray-500 font-bold mb-8">يمكنك الوصول لجميع صلاحيات التحكم الكاملة من خلال لوحة الإدارة.</p>
                  <Link href="/dashboard/admin" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:scale-105 transition-all">دخول لوحة الإدارة</Link>
               </div>
             )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[var(--card)] rounded-[3rem] border border-[var(--border)] p-12 shadow-2xl shadow-black/5 dark:shadow-white/5">
              <h2 className="text-3xl font-black mb-8 tracking-tighter">تحديث البيانات الشخصية</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">الاسم بالكامل</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-[var(--muted)] border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-[var(--muted)] border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                      required
                    />
                  </div>
                  {user.role === "TEACHER" && (
                    <>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">المادة العلمية</label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="مثال: اللغة العربية، الفيزياء..."
                          className="w-full px-6 py-4 rounded-2xl bg-[var(--muted)] border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">سنوات الخبرة</label>
                        <input
                          type="text"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          placeholder="مثال: 10 سنوات خبرة"
                          className="w-full px-6 py-4 rounded-2xl bg-[var(--muted)] border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                        />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">نبذة تعريفية (Bio)</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="اكتب نبذة عنك وعن أسلوبك في الشرح..."
                          rows={4}
                          className="w-full px-6 py-4 rounded-2xl bg-[var(--muted)] border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all resize-none"
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="اتركها فارغة إذا لا تريد التغيير"
                      className="w-full px-6 py-4 rounded-2xl bg-[var(--muted)] border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StudentActivity({ user }: any) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <ActivityStat label="دوراتك التعليمية" value={user.enrollments.length} icon={BookOpen} color="blue" />
         <ActivityStat label="مذكرات وكتب" value={user.materialPurchases?.length || 0} icon={FileText} color="amber" />
         <ActivityStat label="دروس مكتملة" value={user.progress.length} icon={Clock} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-black mb-8">متابعة التعلم</h3>
          <div className="space-y-4">
             {user.enrollments.length > 0 ? user.enrollments.map((en: any) => (
               <Link href={`/courses/${en.courseId}`} key={en.id} className="bg-[var(--card)] p-6 rounded-[2rem] border border-[var(--border)] hover:border-blue-600 transition-all group flex items-center gap-6">
                  <img src={en.course.thumbnail} className="w-16 h-16 rounded-xl object-cover shadow-lg group-hover:scale-110 transition-transform" />
                  <div className="flex-grow">
                    <h4 className="font-black text-lg mb-1">{en.course.title}</h4>
                    <p className="text-xs font-bold text-gray-400">انقر لمتابعة الدروس</p>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
               </Link>
             )) : (
               <div className="p-8 text-center bg-[var(--muted)] rounded-[2rem] border-2 border-dashed border-[var(--border)] text-gray-400 font-bold">
                  لم تشترك في أي دورات بعد
               </div>
             )}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black mb-8">مكتبتي الخاصة</h3>
          <div className="space-y-4">
             {user.materialPurchases?.length > 0 ? user.materialPurchases.map((p: any) => (
               <div key={p.id} className="bg-[var(--card)] p-6 rounded-[2rem] border border-[var(--border)] hover:border-amber-600 transition-all group flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform shadow-lg border border-amber-100">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-black text-lg mb-1">{p.material.title}</h4>
                    <p className="text-xs font-bold text-gray-400">{p.material.type} • {p.material.format}</p>
                  </div>
                  {p.material.fileUrl && (
                    <a 
                      href={p.material.fileUrl} 
                      target="_blank" 
                      className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                      title="تحميل الملف"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
               </div>
             )) : (
               <div className="p-8 text-center bg-[var(--muted)] rounded-[2rem] border-2 border-dashed border-[var(--border)] text-gray-400 font-bold">
                  لا توجد مذكرات أو كتب مشتراه
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherActivity({ user }: any) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <ActivityStat label="دوراتك المرفوعة" value={user.courses.length} icon={BookOpen} color="emerald" />
         <ActivityStat label="إجمالي الطلاب" value="0" icon={Users} color="blue" />
         <ActivityStat label="حالة الرفع" value={user.canUpload ? "مفعل" : "معلق"} icon={ShieldCheck} color="amber" />
      </div>
      
      <div className="bg-gray-50 dark:bg-white/5 p-12 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800 text-center">
        <h3 className="text-2xl font-black mb-4">إدارة المحتوى</h3>
        <p className="text-gray-500 font-bold mb-8">يمكنك إضافة دورات جديدة وتعديل دروسك الحالية.</p>
        <Link href="/dashboard/admin/courses" className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all inline-block">إضافة دورة جديدة</Link>
      </div>
    </div>
  );
}

function ParentActivity({ user }: any) {
  return (
    <div className="space-y-12">
       <h3 className="text-2xl font-black mb-8">متابعة الأبناء</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {user.children?.map((child: any) => (
            <div key={child.id} className="bg-[var(--card)] p-8 rounded-[2.5rem] border border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center font-black text-2xl text-blue-600">
                  {child.name?.[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1">{child.name}</h4>
                  <p className="text-sm font-bold text-gray-400">@{child.username}</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg">تقرير الأداء</button>
            </div>
          ))}
       </div>
    </div>
  );
}

function ActivityStat({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-[var(--card)] p-8 rounded-[2.5rem] border border-[var(--border)] shadow-xl shadow-black/5">
       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", colors[color])}>
          <Icon className="w-6 h-6" />
       </div>
       <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
       <h4 className="text-3xl font-black">{value}</h4>
    </div>
  );
}
