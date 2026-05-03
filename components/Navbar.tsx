"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { 
  BookOpen, Home, LayoutDashboard, User, Users,
  Moon, Sun, Globe, LogIn, LogOut, ChevronDown, Menu, X, TrendingUp,
  PlayCircle, Star, Newspaper, Info, Phone, Library, Search
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useSettings } from "./SettingsProvider";

const navigation = [
  { name: "الرئيسية", nameEn: "Home", href: "/", icon: Home },
  { name: "الكورسات", nameEn: "Courses", href: "/courses", icon: BookOpen },
  { name: "الكتب والمذكرات", nameEn: "Books & Notes", href: "/materials", icon: Library },
  { name: "الشروحات", nameEn: "Lessons", href: "/lessons", icon: PlayCircle },
  { name: "المراجعات", nameEn: "Reviews", href: "/reviews", icon: Star },
  { name: "المقالات", nameEn: "Articles", href: "/articles", icon: Newspaper },
  { name: "من نحن", nameEn: "About", href: "/about", icon: Info },
  { name: "اتصل بنا", nameEn: "Contact", href: "/contact", icon: Phone },
  { name: "حسابي", nameEn: "My Account", href: "/profile", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const settings = useSettings();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { data: session } = useSession();
  const [lang, setLang] = useState("ar");
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // إخفاء الـ Navbar بالكامل في لوحة الإدارة
  const isAdminPage = pathname?.startsWith("/dashboard/admin");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const savedLang = localStorage.getItem("lang") || "ar";
    setLang(savedLang);
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLang;
  }, [mounted]);

  const toggleLang = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
    window.location.reload();
  };

  if (!mounted || isAdminPage) return null;

  const isAr = lang === "ar";

  const userNavigation = [
    ...navigation,
    ...(session?.user?.role === "ADMIN" 
      ? [{ name: "الإدارة", nameEn: "Admin", href: "/dashboard/admin", icon: TrendingUp }] 
      : []),
    ...(session?.user?.role === "PARENT" 
      ? [{ name: "متابعة الأبناء", nameEn: "Family", href: "/dashboard/parent", icon: Users }] 
      : [])
  ];

  return (
    <nav className="sticky top-0 z-50 glass transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-10 w-auto object-contain py-1 drop-shadow-sm transition-transform hover:scale-105" 
              />
              <span className="text-lg font-black tracking-tighter hidden md:block">
                {settings.site_name || "EL ASHRY ACADEMY"}
              </span>
            </Link>
            
            <div className="hidden md:flex flex-1 max-w-[200px] lg:max-w-xs mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder={isAr ? "ابحث..." : "Search..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-2 px-4 pr-10 focus:ring-2 focus:ring-blue-500 transition-all text-xs lg:text-sm font-bold"
                />
                <Search className={cn("absolute top-2.5 w-4 h-4 text-gray-400", isAr ? "left-3" : "right-3")} />
              </form>
            </div>

            <div className="hidden xl:flex items-center gap-1 ms-2">
              {session && userNavigation.slice(1, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-black transition-all duration-200 flex items-center gap-2",
                    pathname === item.href
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {isAr ? item.name : item.nameEn}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              title={isAr ? "Switch to English" : "التبديل للعربية"}
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">{isAr ? "EN" : "AR"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              {mounted && (resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
            </button>

            {/* Mobile Menu Toggle */}
            {session && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />

            {!session ? (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  {isAr ? "تسجيل الدخول" : "Login"}
                </Link>

                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-blue-500/30 active:scale-95 flex items-center gap-2 group"
                >
                  {isAr ? "ابدأ الآن" : "Start Now"}
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full bg-white animate-pulse",
                    isAr ? "mr-1" : "ml-1"
                  )} />
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 ps-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="text-start hidden sm:block">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px]">{session.user?.name}</p>
                    <p className="text-[10px] text-gray-500">
                      {session.user?.role === "ADMIN" ? (isAr ? "مدير النظام" : "Admin") : (isAr ? "طالب" : "Student")}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm overflow-hidden border border-blue-200 dark:border-blue-800">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      session.user?.name?.[0].toUpperCase()
                    )}
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isProfileOpen && "rotate-180")} />
                </button>

                {isProfileOpen && (
                  <div className={cn(
                    "absolute mt-2 w-48 bg-background rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 overflow-hidden animate-in fade-in zoom-in duration-200",
                    isAr ? "left-0" : "right-0"
                  )}>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      {isAr ? "حسابي الشخصي" : "My Account"}
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/dashboard/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <TrendingUp className="w-4 h-4" />
                        {isAr ? "لوحة الإدارة" : "Admin Panel"}
                      </Link>
                    )}
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {isAr ? "تسجيل الخروج" : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {session && isMenuOpen && (
        <div className="sm:hidden border-t border-gray-100 dark:border-gray-800 bg-background py-4 px-4 space-y-4 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
                type="text"
                placeholder={isAr ? "ابحث عن كورسات، مذكرات..." : "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 pr-10 focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
            />
            <Search className={cn("absolute top-3.5 w-4 h-4 text-gray-400", isAr ? "left-3" : "right-3")} />
          </form>
          
          <div className="space-y-2">
            {userNavigation.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    pathname === item.href
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
                >
                <item.icon className="w-5 h-5" />
                {isAr ? item.name : item.nameEn}
                </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
