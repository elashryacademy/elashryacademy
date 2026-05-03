"use client";

import { useState } from "react";
import { 
  Save, Loader2, Globe, MessageCircle, Phone, 
  Facebook, Youtube, Instagram, Twitter, 
  Mail, Users, BookOpen, PlayCircle, ShieldCheck 
} from "lucide-react";
import toast from "react-hot-toast";

const SETTING_KEYS = [
  { key: "site_name", label: "اسم المنصة", icon: Globe },
  { key: "site_description", label: "وصف المنصة", icon: Globe },
  { key: "hero_title_ar", label: "عنوان الهيرو (عربي)", icon: Globe },
  { key: "hero_title_en", label: "عنوان الهيرو (إنجليزي)", icon: Globe },
  { key: "hero_subtitle_ar", label: "وصف الهيرو (عربي)", icon: Globe },
  { key: "hero_subtitle_en", label: "وصف الهيرو (إنجليزي)", icon: Globe },
  { key: "whatsapp_number", label: "رقم الواتساب", icon: MessageCircle },
  { key: "contact_phone", label: "رقم الهاتف", icon: Phone },
  { key: "facebook_url", label: "رابط فيسبوك", icon: Facebook },
  { key: "youtube_url", label: "رابط يوتيوب", icon: Youtube },
  { key: "instagram_url", label: "رابط انستجرام", icon: Instagram },
  { key: "twitter_url", label: "رابط تويتر", icon: Twitter },
  { key: "about_content", label: "محتوى صفحة (من نحن)", icon: Globe },
  { key: "contact_address", label: "العنوان في صفحة (اتصل بنا)", icon: Globe },
  { key: "contact_email", label: "البريد في صفحة (اتصل بنا)", icon: Globe },
  { key: "stats_students", label: "عدد الطلاب (إحصائيات)", icon: Users },
  { key: "stats_courses", label: "عدد الكورسات (إحصائيات)", icon: BookOpen },
  { key: "stats_lessons", label: "عدد الشروحات (إحصائيات)", icon: PlayCircle },
  { key: "stats_team", label: "عدد فريق العمل (إحصائيات)", icon: ShieldCheck },
  { key: "require_email_verification", label: "تفعيل التحقق عبر البريد الإلكتروني (true/false)", icon: Mail },
  { key: "require_whatsapp_verification", label: "تفعيل التحقق عبر الواتساب (true/false)", icon: MessageCircle },
  { key: "registration_require_parent_phone", label: "إلزامية رقم ولي الأمر (true/false)", icon: Phone },
  { key: "registration_require_grade", label: "إلزامية السنة الدراسية (true/false)", icon: BookOpen },
  { key: "registration_require_governorate", label: "إلزامية المحافظة والمدينة (true/false)", icon: Globe },
  { key: "default_teacher_commission", label: "نسبة المدرس الافتراضية (مثال: 80 للمدرس و 20 للمنصة)", icon: CreditCard },
];

export default function SettingsManagerClient({ initialSettings }: { initialSettings: any[] }) {
  const [settings, setSettings] = useState(() => {
    const sMap: any = {};
    initialSettings.forEach(s => sMap[s.key] = s.value);
    return sMap;
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({ key, value }));
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsArray }),
      });

      if (res.ok) {
        toast.success("تم حفظ الإعدادات بنجاح");
      } else {
        toast.error("حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">إعدادات المنصة</h2>
          <p className="text-gray-500 font-bold text-sm">تحكم في جميع نصوص وروابط المنصة من هنا.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black flex items-center gap-3 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          حفظ التغييرات
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SETTING_KEYS.map((s) => (
          <div key={s.key} className="bg-[var(--card)] rounded-[2.5rem] p-8 border border-[var(--border)] shadow-xl shadow-black/5">
            <div className="flex items-center gap-4 mb-6 text-blue-600">
              <s.icon className="w-6 h-6" />
              <label className="text-sm font-black uppercase tracking-widest text-gray-400">{s.label}</label>
            </div>
            <input
              type="text"
              value={settings[s.key] || ""}
              onChange={(e) => setSettings({ ...settings, [s.key]: e.target.value })}
              className="w-full bg-[var(--muted)] border-none rounded-2xl px-6 py-4 font-bold outline-none ring-2 ring-transparent focus:ring-blue-600 transition-all"
              placeholder={`أدخل ${s.label}...`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
