"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface MarkCompleteButtonProps {
  lessonId: string;
  initialCompleted: boolean;
}

export default function MarkCompleteButton({ lessonId, initialCompleted }: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleComplete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          completed: !completed
        })
      });

      if (response.ok) {
        setCompleted(!completed);
        if (!completed) {
          toast.success("تم إكمال الدرس بنجاح! أحسنت.");
        } else {
          toast.success("تم إلغاء إكمال الدرس.");
        }
        router.refresh();
      } else {
        toast.error("حدث خطأ ما، حاول مرة أخرى.");
      }
    } catch (error) {
      toast.error("فشل الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleComplete}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-md ${
        completed 
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400" 
          : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 active:scale-95 shadow-xl shadow-black/10"
      } disabled:opacity-50`}
    >
      <CheckCircle className={`w-5 h-5 ${completed ? "fill-current" : ""}`} />
      {completed ? "تم إكمال الدرس" : "تحديد كمكتمل"}
    </button>
  );
}
