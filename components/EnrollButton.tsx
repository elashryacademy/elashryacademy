"use client";

import { useState } from "react";
import { PlayCircle, Ticket, CheckCircle, Loader2, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import PaymentCheckoutModal from "./PaymentCheckoutModal";

interface EnrollButtonProps {
  courseId: string;
  courseTitle?: string;
  isEnrolled: boolean;
  firstLessonId?: string;
  price: number;
}

export default function EnrollButton({ courseId, courseTitle, isEnrolled, firstLessonId, price }: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleEnroll = async (couponCode?: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, couponCode })
      });

      if (response.ok) {
        toast.success("تم تفعيل الكورس بنجاح!");
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.message || "حدث خطأ ما");
      }
    } catch (error) {
      toast.error("فشل الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <button
        onClick={() => firstLessonId ? router.push(`/courses/${courseId}/lessons/${firstLessonId}`) : toast.error("لا توجد دروس")}
        className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-center flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
      >
        <PlayCircle className="w-6 h-6" />
        ابدأ التعلم الآن
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {price > 0 && !showCoupon ? (
        <div className="flex flex-col gap-3">
            <button
                onClick={() => setShowPayment(true)}
                className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-center flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
            >
                <CreditCard className="w-6 h-6" />
                اشترك في الدورة الآن
            </button>
            <button
                onClick={() => setShowCoupon(true)}
                className="w-full py-4 bg-gray-50 text-gray-500 rounded-[2rem] font-bold text-sm text-center flex items-center justify-center gap-2 border border-gray-100 hover:bg-gray-100 transition-all"
            >
                <Ticket className="w-4 h-4" />
                تفعيل بالكود / كوبون خصم
            </button>
        </div>
      ) : price > 0 ? (
        <div className="space-y-3">
          <input 
            type="text"
            placeholder="أدخل كود التفعيل هنا..."
            className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl font-black outline-none transition-all text-center tracking-widest"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleEnroll(code)}
              disabled={isLoading || !code}
              className="flex-grow py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              تفعيل الكود
            </button>
            <button onClick={() => setShowCoupon(false)} className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase transition-all">إلغاء</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => handleEnroll()}
          disabled={isLoading}
          className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-center flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
        >
          <PlayCircle className="w-6 h-6" />
          {isLoading ? "جاري الاشتراك..." : "اشتراك مجاني"}
        </button>
      )}

      <PaymentCheckoutModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        courseTitle={courseTitle || "الدورة التعليمية"} 
        price={price} 
      />
    </div>
  );
}
