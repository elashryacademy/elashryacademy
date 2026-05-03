"use client";

import { useState } from "react";
import { Plus, Trash2, FolderOpen, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoryManagerClient({ initialCategories }: { initialCategories: any[] }) {
    const [categories, setCategories] = useState(initialCategories);
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName })
            });

            if (res.ok) {
                const newCat = await res.json();
                setCategories([newCat, ...categories]);
                setNewName("");
                toast.success("تم إضافة القسم بنجاح");
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء الإضافة");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id));
                toast.success("تم حذف القسم بنجاح");
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء الحذف");
        }
    };

    return (
        <div className="space-y-12">
            <div className="bg-[var(--card)] rounded-[3rem] p-10 border border-[var(--border)] shadow-2xl shadow-black/5">
                <h3 className="text-2xl font-black mb-8 tracking-tighter">إضافة قسم جديد</h3>
                <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-6">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="اسم القسم (مثال: فيزياء، كيمياء، لغة عربية...)"
                        className="flex-grow bg-[var(--muted)] border-none rounded-2xl px-8 py-4 font-bold outline-none ring-2 ring-transparent focus:ring-blue-600 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading || !newName.trim()}
                        className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        إضافة القسم
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-[var(--card)] rounded-[2.5rem] p-8 border border-[var(--border)] shadow-xl shadow-black/5 hover:border-blue-600 transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                <FolderOpen className="w-6 h-6" />
                            </div>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <h4 className="text-xl font-black mb-2">{cat.name}</h4>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {cat._count?.courses || 0} كورس • {cat._count?.materials || 0} مذكرة
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
