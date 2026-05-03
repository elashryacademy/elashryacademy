"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Users, Video, Award, ChevronLeft, ChevronRight, Star, ArrowLeft } from "lucide-react";
import AdBanner from "./AdBanner";

export default function HomeClient({ settings, featuredCourses = [], categories = [] }: { settings: any, featuredCourses?: any[], categories?: any[] }) {
  const [isAr, setIsAr] = useState(true);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setIsAr(lang === "ar");
  }, []);

  const content = {
    heroTitle: isAr ? (settings.hero_title_ar || "مرحباً بك في") : (settings.hero_title_en || "Welcome to"),
    academyName: settings.site_name || "El Ashry Academy",
    heroDesc: isAr 
      ? (settings.hero_subtitle_ar || "منصتك التعليمية المتكاملة للتعلم والاحتراف. دورات مسجلة، بث مباشر، واختبارات تفاعلية في مكان واحد.")
      : (settings.hero_subtitle_en || "Your integrated educational platform for learning and professionalism. Recorded courses, live streams, and interactive quizzes in one place."),
    exploreBtn: isAr ? "استكشف الدورات" : "Explore Courses",
    joinBtn: isAr ? "ابدأ الآن مجاناً" : "Join for Free",
    featuresTitle: isAr ? "لماذا تختار أكاديميتنا؟" : "Why Choose Our Academy?",
    f1Title: isAr ? "فيديوهات عالية الجودة" : "High Quality Videos",
    f1Desc: isAr ? "دروس مسجلة بدقة عالية يمكنك مشاهدتها في أي وقت." : "High-definition recorded lessons you can watch anytime.",
    f2Title: isAr ? "بث مباشر تفاعلي" : "Interactive Live Stream",
    f2Desc: isAr ? "تفاعل مباشرة مع المدربين واطرح أسئلتك." : "Interact directly with instructors and ask your questions.",
    f3Title: isAr ? "ملفات واختبارات" : "Files & Quizzes",
    f3Desc: isAr ? "مذكرات PDF واختبارات دورية لقياس مستواك." : "PDF notes and periodic quizzes to measure your level.",
    f4Title: isAr ? "شهادات معتمدة" : "Certified Certificates",
    f4Desc: isAr ? "احصل على شهادة عند إتمامك لكل دورة تدريبية." : "Get a certificate upon completion of each training course."
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Ad Banner */}
      <AdBanner position="HOME_TOP" className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-6xl lg:text-8xl font-black text-[var(--foreground)] tracking-tighter mb-8">
              <span className="block mb-2">{content.heroTitle}</span>
              <span className="text-[var(--accent)]">
                {content.academyName}
              </span>
            </h1>
            <p className="mt-8 max-w-2xl mx-auto text-xl lg:text-2xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              {content.heroDesc}
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/courses"
                className="w-full sm:w-auto flex items-center justify-center px-10 py-5 text-lg font-bold rounded-full text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 transition-all active:scale-95 shadow-2xl shadow-black/10 dark:shadow-white/5"
              >
                {content.exploreBtn}
                {isAr ? <ChevronLeft className="mr-2 w-6 h-6" /> : <ChevronRight className="ml-2 w-6 h-6" />}
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto flex items-center justify-center px-10 py-5 border border-[var(--border)] text-lg font-bold rounded-full text-[var(--foreground)] bg-transparent hover:bg-[var(--muted)] transition-all active:scale-95"
              >
                {content.joinBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="bg-[var(--card)] rounded-[3rem] border border-[var(--border)] p-8 lg:p-12 shadow-2xl shadow-black/10 dark:shadow-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
            <StatItem 
              label="طالب ملتحق" 
              value={settings.stats_students || "5000"} 
              icon={<Users className="w-6 h-6" />} 
              color="blue"
            />
            <StatItem 
              label="كورس تعليمي" 
              value={settings.stats_courses || "120"} 
              icon={<BookOpen className="w-6 h-6" />} 
              color="indigo"
            />
            <StatItem 
              label="شرح وحصة" 
              value={settings.stats_lessons || "1500"} 
              icon={<Video className="w-6 h-6" />} 
              color="emerald"
            />
            <StatItem 
              label="خبير تعليمي" 
              value={settings.stats_team || "25"} 
              icon={<Award className="w-6 h-6" />} 
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-16">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4">استكشف حسب التخصص</h2>
                    <p className="text-gray-500 font-bold">ابحث عن مجالك المفضل وابدأ رحلة التعلم اليوم.</p>
                </div>
                <Link href="/search" className="hidden md:flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all">
                    عرض جميع الأقسام <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <Link 
                        key={cat.id} 
                        href={`/search?category=${cat.id}`}
                        className="group p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-blue-600 transition-all text-center"
                    >
                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h3 className="font-black text-lg mb-1">{cat.name}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cat._count.courses} كورس متاح</p>
                    </Link>
                ))}
            </div>
          </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4">أحدث الدورات التدريبية</h2>
                <p className="text-gray-500 font-bold text-lg max-w-2xl mx-auto italic">اكتشف أحدث ما تم إضافته من دروس وشروحات احترافية بأفضل جودة تعليمية.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {featuredCourses.map((course) => (
                    <div key={course.id} className="bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden group hover:border-blue-600 transition-all shadow-xl shadow-black/5">
                        <div className="aspect-video relative overflow-hidden">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            {course.category && (
                                <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 dark:bg-black/90 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-sm shadow-xl">
                                    {course.category.name}
                                </div>
                            )}
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-0.5 text-yellow-400">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-black">5.0</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">({course._count.reviews} تقييم)</span>
                            </div>
                            <h3 className="text-xl font-black mb-4 leading-tight group-hover:text-blue-600 transition-colors">{course.title}</h3>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-400">
                                    {course.instructor.name?.[0]}
                                </div>
                                <span className="text-sm font-bold text-gray-500">{course.instructor.name}</span>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
                                <span className="text-2xl font-black text-gray-900 dark:text-white">{course.price === 0 ? "مجاني" : `${course.price} ج.م`}</span>
                                <Link href={`/courses/${course.id}`} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                                    التفاصيل
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <Link href="/courses" className="inline-flex items-center gap-4 px-12 py-5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:border-blue-600 hover:text-blue-600 transition-all">
                    عرض جميع الدورات
                </Link>
            </div>
          </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[var(--muted)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 dark:text-white">{content.featuresTitle}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={<Video className="w-7 h-7" />} title={content.f1Title} desc={content.f1Desc} color="blue" />
            <FeatureCard icon={<Users className="w-7 h-7" />} title={content.f2Title} desc={content.f2Desc} color="green" />
            <FeatureCard icon={<BookOpen className="w-7 h-7" />} title={content.f3Title} desc={content.f3Desc} color="purple" />
            <FeatureCard icon={<Award className="w-7 h-7" />} title={content.f4Title} desc={content.f4Desc} color="yellow" />
          </div>
        </div>
      </section>

      {/* Footer Ad Banner */}
      <AdBanner position="FOOTER_ABOVE" className="max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8" />
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: any) {
  return (
    <div className="group p-10 bg-[var(--card)] rounded-[2.5rem] border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-500">
      <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-[var(--muted)] text-[var(--accent)] mb-8 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function StatItem({ label, value, icon, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  };

  return (
    <div className="flex flex-col items-center text-center group">
      <div className={`p-4 rounded-2xl mb-5 transition-transform group-hover:scale-110 duration-500 ${colors[color]}`}>
        {icon}
      </div>
      <h3 className="text-3xl lg:text-4xl font-black mb-1 tracking-tight">+{value}</h3>
      <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{label}</p>
    </div>
  );
}
