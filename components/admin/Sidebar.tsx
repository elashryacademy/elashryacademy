"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  LogOut, 
  ChevronLeft,
  GraduationCap,
  PlusCircle,
  ShieldCheck,
  Home,
  Settings,
  MessageSquare,
  Award,
  ShieldAlert,
  Library,
  CreditCard,
  Ticket,
  Tags,
  Image as ImageIcon,
  MessageCircle,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const getNavItems = () => {
    const role = session?.user?.role;
    if (role === "ADMIN") {
        return [
            { name: "لوحة التحكم", href: "/dashboard/admin", icon: LayoutDashboard },
            { name: "إدارة الدورات", href: "/dashboard/admin/courses", icon: BookOpen },
            { name: "الأقسام / التخصصات", href: "/dashboard/admin/categories", icon: Tags },
            { name: "الكتب والمذكرات", href: "/dashboard/admin/materials", icon: Library },
            { name: "إدارة المستخدمين", href: "/dashboard/admin/users", icon: Users },
            { name: "إدارة الفريق", href: "/dashboard/admin/team", icon: ShieldAlert },
            { name: "الدعم الفني", href: "/dashboard/admin/support", icon: MessageSquare },
            { name: "مركز الإشعارات", href: "/dashboard/admin/notifications", icon: MessageCircle },
            { name: "الشهادات", href: "/dashboard/admin/certificates", icon: Award },
            { name: "وسائل الدفع", href: "/dashboard/admin/payments", icon: CreditCard },
            { name: "أكواد الخصم", href: "/dashboard/admin/coupons", icon: Ticket },
            { name: "تقارير المبيعات", href: "/dashboard/admin/sales", icon: DollarSign },
            { name: "إدارة الإعلانات", href: "/dashboard/admin/ads", icon: ImageIcon },
            { name: "سجل العمليات", href: "/dashboard/admin/audit", icon: History },
            { name: "الإحصائيات", href: "/dashboard/admin/stats", icon: ShieldCheck },
            { name: "الإعدادات العامة", href: "/dashboard/admin/settings", icon: Settings },
        ];
    }
    if (role === "TEACHER") {
        return [
            { name: "لوحة المدرس", href: "/dashboard/teacher", icon: LayoutDashboard },
            { name: "دوراتي التعليمية", href: "/dashboard/teacher/courses", icon: BookOpen },
            { name: "طلابي", href: "/dashboard/teacher/students", icon: Users },
        ];
    }
    if (role === "PARENT") {
        return [
            { name: "متابعة الأبناء", href: "/dashboard/parent", icon: Users },
        ];
    }
    if (role === "SUPPORT" || role === "ASSISTANT") {
        return [
            { name: "لوحة التحكم", href: role === "SUPPORT" ? "/dashboard/admin/support" : "/dashboard/admin", icon: LayoutDashboard },
            { name: "الكتب والمذكرات", href: "/dashboard/admin/materials", icon: Library },
            { name: "الدعم الفني", href: "/dashboard/admin/support", icon: MessageSquare },
        ];
    }
    return [
        { name: "دوراتي", href: "/dashboard", icon: BookOpen },
        { name: "الدعم الفني", href: "/dashboard/support", icon: MessageSquare },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-80 h-full border-l border-[var(--border)] bg-[var(--card)] flex flex-col z-20 shadow-2xl">
      {/* Branding */}
      <div className="p-10">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--accent)] rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase leading-none">
                El Ashry <br/> <span className="text-[var(--accent)] text-xs">{session?.user?.role || "STUDENT"}</span>
            </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2">
        <div className="mb-6">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">القائمة</p>
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group",
                            isActive 
                                ? "bg-[var(--accent)] text-white shadow-xl shadow-blue-500/20" 
                                : "text-gray-500 hover:bg-[var(--muted)] hover:text-gray-900"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-[var(--accent)]")} />
                        <span className="font-black text-sm">{item.name}</span>
                        {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
                    </Link>
                );
            })}
        </div>

        <div>
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">إجراءات</p>
            <Link
                href="/"
                className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-500 hover:bg-[var(--muted)] transition-all font-black text-sm"
            >
                <Home className="w-5 h-5" />
                العودة للموقع
            </Link>
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-[var(--border)]">
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/5 transition-all font-black text-sm"
        >
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
