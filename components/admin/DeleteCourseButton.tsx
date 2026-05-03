"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذه الدورة؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/courses?id=${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("تم حذف الدورة بنجاح.");
        router.refresh();
      } else {
        toast.error("حدث خطأ أثناء الحذف.");
      }
    } catch (error) {
      toast.error("فشل الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
        onClick={handleDelete}
        disabled={loading}
        className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-[var(--border)] hover:text-red-600 transition-all shadow-sm disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
