"use client";

import { useSettings } from "@/components/SettingsProvider";
import { Info, Target, Award, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  const settings = useSettings();

  return (
    <div className="min-h-screen py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6">من نحن</h1>
          <p className="text-gray-500 font-bold text-xl max-w-3xl mx-auto">
            تعرف على قصة أكاديمية العشري ورؤيتنا لمستقبل التعليم التقني.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-[3rem] blur-[100px] opacity-10" />
            <img 
              src="/logo.png" 
              alt="About Us" 
              className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-black tracking-tight">رؤيتنا ورسالتنا</h2>
            <p className="text-gray-500 text-lg leading-relaxed font-bold">
              {settings.about_content || "أكاديمية العشري هي منصة تعليمية رائدة تهدف إلى تمكين الشباب العربي في مجالات البرمجيات والتقنيات الحديثة من خلال تقديم محتوى تعليمي عالي الجودة وتطبيقي."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AboutCard icon={<Target className="w-6 h-6" />} title="هدفنا" desc="تخريج دفعات قادرة على سوق العمل" />
              <AboutCard icon={<Award className="w-6 h-6" />} title="الجودة" desc="محتوى علمي محدث باستمرار" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutCard({ icon, title, desc }: any) {
  return (
    <div className="p-6 bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-xl shadow-black/5">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-black text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm font-bold">{desc}</p>
    </div>
  );
}
