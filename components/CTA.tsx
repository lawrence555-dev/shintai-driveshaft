"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ChevronRight } from "lucide-react";

export default function CTA() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleBooking = () => {
        if (!session) {
            signIn("google", { callbackUrl: "/booking?type=inspection" });
        } else {
            router.push("/booking?type=inspection");
        }
    };

    return (
        <section className="py-20 bg-brand-orange relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-8 border border-white/30">
                    <ShieldCheck className="text-white w-8 h-8" />
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic">
                    行車安全不容妥協
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-10 font-bold max-w-2xl mx-auto leading-relaxed">
                    傳動軸異音可能隱藏巨大風險。立刻預約專業檢查，讓我們為您的愛車提供最精密的平衡校正與守護。
                </p>

                <button
                    onClick={handleBooking}
                    className="bg-brand-gray text-white px-10 py-5 rounded-2xl font-black text-xl md:text-2xl transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 flex items-center mx-auto group border-t-2 border-white/10"
                >
                    立即預約專業檢查
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="mt-8 text-white/60 text-sm font-bold uppercase tracking-widest">
                    Quick Booking · Expert Diagnosis · Precision Repair
                </p>
            </div>
        </section>
    );
}
