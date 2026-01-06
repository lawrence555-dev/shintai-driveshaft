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
        <section className="relative h-[85vh] lg:h-[95vh] min-h-[600px] lg:min-h-[800px] flex items-center justify-center bg-brand-gray overflow-hidden">
            {/* Background with darker overlay for extreme contrast */}
            <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000')] bg-cover bg-center grayscale brightness-50"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-brand-gray/90 via-brand-gray/60 to-brand-gray"></div>

            <div className="relative z-10 text-center px-6 max-w-5xl">
                <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white mb-6 md:mb-8 tracking-tighter uppercase leading-tight drop-shadow-2xl">
                    傳動軸異音專家<br />
                    <span className="text-brand-orange mt-2 md:mt-4 block">精密平衡修護</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-3xl text-white/90 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-bold drop-shadow-lg italic">
                    傳動軸抖動、異音？我們擁有最專業的平衡技術與維修經驗，<br className="hidden lg:block" />
                    為您的行車安全與舒適品質嚴格把關。
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                    <button
                        onClick={handleBooking}
                        className="bg-brand-orange hover:bg-orange-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-lg font-black text-xl sm:text-2xl transition-all shadow-[0_0_30px_rgba(255,107,0,0.3)] hover:scale-105 active:scale-95 w-full sm:w-auto"
                    >
                        立刻線上預約
                    </button>
                    <button
                        onClick={scrollToServices}
                        className="bg-white/10 backdrop-blur-xl border-2 border-white/40 hover:bg-white/20 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-lg font-black text-xl sm:text-2xl transition-all w-full sm:w-auto"
                    >
                        了解服務項目
                    </button>
                </div>
            </div>
        </section>
    );
}
