"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Globe, Share2, MessageCircle, Play, Facebook, Youtube, Instagram, Twitter } from "lucide-react";
import { useSettings } from "./SettingsProvider";

export default function Footer() {
  const pathname = usePathname();
  const settings = useSettings();
  const isAdminPage = pathname?.startsWith("/dashboard/admin");

  if (isAdminPage) return null;

  return (
    <footer className="bg-[var(--card)] border-t border-[var(--border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 text-right" dir="rtl">
          {/* Academy Info */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-black tracking-tighter mb-6">{settings.site_name || "EL ASHRY ACADEMY"}</h2>
            <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-xs">
              {settings.site_description || "أكاديمية العشري هي وجهتك الأولى لتعلم البرمجة والتقنيات الحديثة بأفضل الطرق العلمية والعملية، نساعدك لتبني مستقبلك المهني."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8">روابط سريعة</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/courses" className="text-gray-600 dark:text-gray-300 hover:text-[var(--accent)] transition-colors">استكشف الدورات</Link></li>
              <li><Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-[var(--accent)] transition-colors">عن الأكاديمية</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-[var(--accent)] transition-colors">تواصل معنا</Link></li>
              <li><Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-[var(--accent)] transition-colors">الشروط والأحكام</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8">تواصل معنا</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <span className="p-2 bg-[var(--muted)] rounded-lg"><Mail className="w-4 h-4 text-[var(--accent)]" /></span> 
                {settings.contact_email || "info@elashry.com"}
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <span className="p-2 bg-[var(--muted)] rounded-lg"><Phone className="w-4 h-4 text-[var(--accent)]" /></span>
                {settings.contact_phone || "+20 123 456 789"}
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <span className="p-2 bg-[var(--muted)] rounded-lg"><MapPin className="w-4 h-4 text-[var(--accent)]" /></span>
                القاهرة، مصر
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8">تابعنا على</h3>
            <div className="flex gap-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" className="p-4 bg-[var(--muted)] rounded-2xl hover:bg-[var(--border)] transition-all text-gray-600 dark:text-gray-300 hover:text-[var(--accent)] border border-[var(--border)]"><Facebook className="w-5 h-5" /></a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" className="p-4 bg-[var(--muted)] rounded-2xl hover:bg-[var(--border)] transition-all text-gray-600 dark:text-gray-300 hover:text-[var(--accent)] border border-[var(--border)]"><Youtube className="w-5 h-5" /></a>
              )}
              {settings.whatsapp_number && (
                <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" className="p-4 bg-[var(--muted)] rounded-2xl hover:bg-[var(--border)] transition-all text-gray-600 dark:text-gray-300 hover:text-[var(--accent)] border border-[var(--border)]"><MessageCircle className="w-5 h-5" /></a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" className="p-4 bg-[var(--muted)] rounded-2xl hover:bg-[var(--border)] transition-all text-gray-600 dark:text-gray-300 hover:text-[var(--accent)] border border-[var(--border)]"><Instagram className="w-5 h-5" /></a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs font-black tracking-widest uppercase">
            © {new Date().getFullYear()} جميع الحقوق محفوظة لـ <span className="text-[var(--accent)]">El Ashry Academy</span>
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">سياسة الخصوصية</Link>
            <Link href="/cookies" className="hover:text-[var(--accent)] transition-colors">ملفات تعريف الارتباط</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
