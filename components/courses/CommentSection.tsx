"use client";

import { useState } from "react";
import { Send, User, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export default function CommentSection({ lessonId, initialComments, user }: { lessonId: string, initialComments: any[], user: any }) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setText("");
        toast.success("تم إضافة التعليق");
      }
    } catch (err) {
      toast.error("فشل إضافة التعليق");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-600" /> التعليقات ({comments.length})
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-10 relative">
            <textarea 
                rows={3}
                placeholder="اكتب سؤالك أو تعليقك هنا..."
                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 rounded-[2rem] p-6 font-bold outline-none transition-all resize-none"
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <button 
                type="submit"
                disabled={loading || !text.trim()}
                className="absolute left-4 bottom-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                {loading ? "جاري الإرسال..." : "إرسال"}
                <Send className="w-3 h-3" />
            </button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 group">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-grow space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="font-black text-sm">{comment.user.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ar })}
                            </p>
                        </div>
                        <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent group-hover:border-blue-100 dark:group-hover:border-blue-900/50 transition-all">
                            <p className="text-sm font-medium leading-relaxed">{comment.content}</p>
                        </div>
                    </div>
                </div>
            ))}

            {comments.length === 0 && (
                <div className="text-center py-10 opacity-50">
                    <p className="font-bold">كن أول من يعلق على هذا الدرس!</p>
                </div>
            )}
        </div>
    </div>
  );
}
