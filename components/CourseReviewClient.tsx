"use client";

import { useState } from "react";
import { Star, Send, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function CourseReviewClient({ courseId, reviews, isEnrolled }: { courseId: string, reviews: any[], isEnrolled: boolean }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/courses/${courseId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment })
            });

            if (res.ok) {
                toast.success("تم إضافة تقييمك بنجاح");
                window.location.reload();
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء التقييم");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="text-center">
                        <div className="text-6xl font-black text-gray-900 mb-2">{averageRating}</div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={cn("w-5 h-5", s <= Math.round(parseFloat(averageRating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} />
                            ))}
                        </div>
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest">إجمالي {reviews.length} تقييم</div>
                    </div>

                    <div className="flex-grow space-y-3">
                        {[5, 4, 3, 2, 1].map((s) => {
                            const count = reviews.filter(r => r.rating === s).length;
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                            return (
                                <div key={s} className="flex items-center gap-4">
                                    <span className="text-xs font-black text-gray-400 w-4">{s}</span>
                                    <div className="flex-grow h-2 bg-gray-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: `${percentage}%` }} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-300 w-8">{percentage.toFixed(0)}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {isEnrolled && (
                <div className="bg-blue-50/50 rounded-[2.5rem] p-10 border-2 border-dashed border-blue-100">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                        <Star className="w-5 h-5 text-blue-600" /> قيم تجربتك مع الكورس
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setRating(s)}
                                    className="transition-all hover:scale-110 active:scale-90"
                                >
                                    <Star className={cn("w-8 h-8", s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="اكتب رأيك بصراحة في الكورس والمحتوى..."
                            rows={3}
                            className="w-full bg-white border-none rounded-2xl p-6 text-lg font-bold outline-none ring-2 ring-transparent focus:ring-blue-600 transition-all resize-none shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            إرسال التقييم
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                <h3 className="text-2xl font-black tracking-tighter">آراء الطلاب ({reviews.length})</h3>
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-blue-200 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-black text-lg">
                                            {review.user.name?.[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm">{review.user.name}</h4>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString('ar-EG')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-500 font-medium leading-relaxed italic">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                        <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">لا توجد تقييمات بعد</p>
                    </div>
                )}
            </div>
        </div>
    );
}
