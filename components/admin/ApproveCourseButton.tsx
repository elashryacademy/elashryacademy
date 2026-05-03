"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApproveCourseButtonProps {
  courseId: string;
  isApproved: boolean;
}

export default function ApproveCourseButton({ courseId, isApproved }: ApproveCourseButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/courses/${courseId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !isApproved }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update approval status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-3 rounded-xl border transition-all shadow-sm flex items-center justify-center ${
        isApproved
          ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
      }`}
      title={isApproved ? "إلغاء الموافقة" : "موافقة على النشر"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isApproved ? (
        <X className="w-4 h-4" />
      ) : (
        <Check className="w-4 h-4" />
      )}
    </button>
  );
}
