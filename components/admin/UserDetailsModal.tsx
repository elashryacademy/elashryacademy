"use client";

import { X, BookOpen, CheckCircle, Clock, Link as LinkIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserDetailsModal({ user, onClose }: { user: any, onClose: () => void }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-950 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 lg:p-12 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-600/20">
              {user.name?.[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">{user.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800">
                  {user.role}
                </span>
                {user.studentCode && (
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
                    ID: {user.studentCode}
                  </span>
                )}
                <p className="text-gray-400 font-bold text-sm">@{user.username}</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white dark:hover:bg-gray-900 rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <StatCard icon={<BookOpen />} label="الدورات المسجلة" value={user._count.enrollments} color="blue" />
            <StatCard icon={<CheckCircle />} label="الدروس المكتملة" value={user._count.progress} color="emerald" />
            <StatCard icon={<Clock />} label="تاريخ الانضمام" value={new Date(user.createdAt).toLocaleDateString('ar-EG')} color="amber" />
          </div>

          <div className="space-y-12">
            {/* Courses Detail */}
            {user.role === "STUDENT" && user.enrollments?.length > 0 && (
              <section>
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  الدورات المشترك بها
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.enrollments.map((en: any) => (
                    <div key={en.courseId} className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between">
                      <span className="font-bold text-sm">{en.course.title}</span>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {user.role === "TEACHER" && user.courses?.length > 0 && (
              <section>
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  الدورات التي يقدمها
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.courses.map((course: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between">
                      <span className="font-bold text-sm">{course.title}</span>
                      <span className={cn(
                        "text-[10px] font-black px-2 py-1 rounded-md uppercase",
                        course.isApproved ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                      )}>
                        {course.isApproved ? "معتمد" : "معلق"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Family Links */}
            {(user.parent || (user.children && user.children.length > 0)) && (
              <section>
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <LinkIcon className="w-5 h-5 text-blue-600" />
                  الروابط العائلية
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {user.parent && (
                    <div className="flex items-center justify-between p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <User className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">ولي الأمر</p>
                          <p className="font-bold">{user.parent.name} (@{user.parent.username})</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {user.children?.map((child: any) => (
                    <div key={child.id} className="flex items-center justify-between p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">ابن / طالب</p>
                          <p className="font-bold">{child.name} (@{child.username})</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Account Details */}
            <section>
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                بيانات الحساب
              </h3>
              <div className="bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {user.role === "TEACHER" && (
                  <>
                    <div className="md:col-span-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">النبذة التعريفية (Bio)</p>
                      <p className="font-bold text-gray-600 dark:text-gray-400 leading-relaxed">{user.bio || "لا يوجد نبذة تعريفية"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">المادة العلمية</p>
                      <p className="font-bold text-lg">{user.subject || "غير محدد"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">الخبرة</p>
                      <p className="font-bold text-lg">{user.experience || "غير محدد"}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">البريد الإلكتروني</p>
                  <p className="font-bold text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">رقم الهاتف</p>
                  <p className="font-bold text-lg" dir="ltr">{user.phone || "غير مسجل"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">رقم الواتساب</p>
                  <p className="font-bold text-lg" dir="ltr">{user.whatsapp || "غير مسجل"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">هاتف ولي الأمر</p>
                  <p className="font-bold text-lg" dir="ltr">{user.parentPhone || "غير مسجل"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">المحافظة / المدينة</p>
                  <p className="font-bold text-lg">{user.governorate} / {user.city}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">تاريخ التحديث</p>
                  <p className="font-bold text-lg">{new Date(user.updatedAt).toLocaleDateString('ar-EG')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">رقم المعرف</p>
                  <p className="font-bold text-sm font-mono text-gray-400">{user.id}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className={cn("p-8 rounded-[2rem] border flex flex-col gap-4", colors[color])}>
      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}
