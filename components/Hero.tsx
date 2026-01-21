"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Hero() {
    const { data: session } = useSession();
    const router = useRouter();

    const scrollToServices = () => {
        const element = document.getElementById("services");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleBooking = () => {
        if (!session) {
            signIn("google", { callbackUrl: "/booking" });
        } else {
            router.push("/booking");
        }
    };

    return (
        <section className="relative h-screen min-h-[700px] flex items-center justify-center bg-brand-gray overflow-hidden pt-20">
            {/* Base Image with grayscale/brightness filter */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000')] bg-cover bg-center grayscale contrast-125"></div>

            {/* Scan-line / Grid Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#FF6B00 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

            {/* Color Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-gray via-brand-gray/40 to-brand-gray"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(15,23,42,0.8)_100%)]"></div>

            <div className="relative z-10 text-center px-6 max-w-5xl">
                <div className="inline-block mb-6 px-4 py-1 rounded-full border border-brand-orange/30 bg-brand-orange/10 backdrop-blur-sm">
                    <span className="text-brand-orange font-mono text-xs font-black uppercase tracking-[0.3em] animate-pulse">Precision Balanced Engineering</span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-9xl font-black text-white mb-6 md:mb-10 tracking-[ -0.05em] uppercase leading-[0.85] drop-shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    傳動軸<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">異音專家</span>
                </h1>

                <p className="text-base sm:text-lg md:text-2xl text-white/70 mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
                    專注高端車款傳動軸平衡修護，消除抖動與異音。<br className="hidden lg:block" />
                    用最精密的數據，找回您的極致駕馭感。
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <button
                        onClick={handleBooking}
                        className="group relative bg-brand-orange text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-[0_20px_40px_-10px_rgba(255,107,0,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(255,107,0,0.6)] hover:-translate-y-1 active:scale-95 w-full sm:w-auto overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]"></div>
                        <span className="relative z-10">立刻線上預約</span>
                    </button>

                    <button
                        onClick={scrollToServices}
                        className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all w-full sm:w-auto"
                    >
                        了解服務項目
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-brand-orange to-transparent"></div>
            </div>
        </section>
    );
}
