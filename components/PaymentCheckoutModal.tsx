"use client";

import { useState, useEffect } from "react";
import { X, CreditCard, CheckCircle, Copy, MessageCircle, AlertCircle, Loader2, Smartphone, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const ELECTRONIC_METHODS = [
  {
    id: "card",
    name: "بطاقة بنكية (Visa / MasterCard)",
    provider: "PAYMOB",
    type: "CARD",
    icon: CreditCard
  },
  {
    id: "wallet",
    name: "محفظة إلكترونية (Vodafone Cash, etc)",
    provider: "PAYMOB",
    type: "WALLET",
    icon: Smartphone
  },
  {
    id: "fawry",
    name: "فوري (Fawry Pay)",
    provider: "PAYMOB",
    type: "FAWRY",
    icon: Receipt
  }
];

export default function PaymentCheckoutModal({ 
  isOpen, 
  onClose, 
  courseTitle, 
  price,
  courseId
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  courseTitle: string, 
  price: number,
  courseId?: string
}) {
  const [manualMethods, setManualMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/payments")
        .then(res => res.json())
        .then(data => {
          setManualMethods(data);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleElectronicPayment = async (methodType: string) => {
    try {
      setIsProcessing(true);
      const response = await fetch("/api/paymob/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, method: methodType })
      });

      const data = await response.json();
      if (data.paymentKey) {
        const iframeId = process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID || "888636"; // Example ID
        window.location.href = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${data.paymentKey}`;
      } else {
        toast.error("فشل بدء عملية الدفع");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التواصل مع بوابة الدفع");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("تم النسخ للمحافظة");
  };

  const allMethods = [...ELECTRONIC_METHODS, ...manualMethods];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-950 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">إتمام الدفع</h2>
            <p className="text-gray-500 font-bold text-sm">{courseTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-900/20 mb-8">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-600 dark:text-gray-400">إجمالي المبلغ المطلوب:</span>
              <span className="text-2xl font-black text-blue-600">{price} ج.م</span>
            </div>
          </div>

          <h3 className="text-lg font-black mb-4">اختر وسيلة الدفع المناسبة لك:</h3>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 mb-8">
              {allMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  className={cn(
                    "p-6 rounded-2xl border-2 transition-all flex items-center justify-between group",
                    selectedMethod?.id === method.id 
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/10" 
                      : "border-gray-100 dark:border-gray-800 hover:border-blue-300"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                      selectedMethod?.id === method.id ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-blue-600"
                    )}>
                      {method.icon ? <method.icon className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg">{method.name}</p>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {method.provider === "PAYMOB" ? "دفع تلقائي فوري" : method.provider}
                      </p>
                    </div>
                  </div>
                  {selectedMethod?.id === method.id && (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}

          {selectedMethod && selectedMethod.provider === "PAYMOB" && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 pb-8">
               <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 p-6 rounded-2xl flex gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  هذه الوسيلة تدعم التفعيل التلقائي. بمجرد إتمام الدفع، سيفتح الكورس لك فوراً.
                </p>
              </div>

              <button 
                onClick={() => handleElectronicPayment(selectedMethod.type)}
                disabled={isProcessing}
                className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
                الانتقال للدفع الآمن
              </button>
            </div>
          )}

          {selectedMethod && selectedMethod.provider !== "PAYMOB" && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 pb-8">
              <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-blue-600/5 rounded-full -ml-12 -mt-12" />
                
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">تفاصيل الدفع</h4>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-2xl font-black tracking-tight">{selectedMethod.details}</span>
                  <button 
                    onClick={() => copyToClipboard(selectedMethod.details)}
                    className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-blue-50 text-blue-600 transition-all flex items-center gap-2 text-xs font-bold shadow-sm"
                  >
                    <Copy className="w-4 h-4" /> نسخ
                  </button>
                </div>

                {selectedMethod.instructions && (
                  <div className="space-y-3">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">التعليمات</p>
                    <p className="text-sm font-bold text-gray-500 leading-relaxed whitespace-pre-wrap">
                      {selectedMethod.instructions}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-6 rounded-2xl flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
                  بعد إتمام عملية التحويل، يرجى تصوير الشاشة (Screenshot) وإرسالها إلى الدعم الفني عبر الواتساب لتفعيل الكورس يدوياً.
                </p>
              </div>

              <a 
                href={`https://wa.me/201200000000?text=أهلاً، قمت بتحويل مبلغ ${price} ج.م للدورة ${courseTitle}.`}
                target="_blank"
                className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <MessageCircle className="w-6 h-6" />
                إرسال إثبات الدفع عبر الواتساب
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
