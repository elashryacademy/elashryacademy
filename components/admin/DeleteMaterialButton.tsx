"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeleteMaterialButton({ materialId }: { materialId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذه المادة؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/materials/${materialId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("تم الحذف بنجاح.");
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
