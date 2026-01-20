"use client";

import { useState, useRef, useEffect } from "react";
import { MoveRight } from "lucide-react";

export default function BeforeAfter() {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        const position = ((x - rect.left) / rect.width) * 100;
        setSliderPos(Math.min(Math.max(position, 0), 100));
    };

    return (
        <section className="py-24 bg-white px-6 md:px-12 border-t border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-1 rounded-full border border-brand-orange/20 bg-brand-orange/5 mb-4">
                        <span className="text-brand-orange font-mono text-xs font-black uppercase tracking-widest">Quality Assurance</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-brand-gray leading-none">
                        維修成果實測
                    </h2>
                    <p className="text-xl text-gray-400 font-bold mt-4 font-mono">DRIVESHAFT REBIRTH COMPARISON</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
                    {/* Interactive Slider Section (3/5) */}
                    <div className="lg:col-span-3">
                        <div
                            ref={containerRef}
                            className="relative aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-8 border-white ring-1 ring-gray-100 cursor-ew-resize select-none"
                            onMouseMove={handleMove}
                            onTouchMove={handleMove}
                        >
                            {/* After Image (Background) */}
                            <img
                                src="/images/after.png"
                                alt="After repair"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/20 to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-10 right-10 z-20 bg-green-600 text-white px-6 py-2 rounded-full font-black text-sm shadow-xl uppercase tracking-[0.2em] backdrop-blur-md bg-opacity-80">
                                After 維修後
                            </div>

                            {/* Before Image (Overlay) */}
                            <div
                                className="absolute inset-0 w-full h-full overflow-hidden"
                                style={{ width: `${sliderPos}%` }}
                            >
                                <img
                                    src="/images/before.png"
                                    alt="Before repair"
                                    className="absolute inset-0 w-[initial] h-full object-cover grayscale brightness-75 max-w-none"
                                    style={{ width: containerRef.current?.offsetWidth }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-10 left-10 z-20 bg-red-600 text-white px-6 py-2 rounded-full font-black text-sm shadow-xl uppercase tracking-[0.2em] backdrop-blur-md bg-opacity-80">
                                    Before 維修前
                                </div>
                            </div>

                            {/* Slider Handle */}
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)] z-30"
                                style={{ left: `${sliderPos}%` }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-brand-orange transition-transform hover:scale-110">
                                    <div className="flex gap-0.5">
                                        <div className="w-1 h-4 bg-brand-orange/30 rounded-full"></div>
                                        <div className="w-1 h-6 bg-brand-orange rounded-full"></div>
                                        <div className="w-1 h-4 bg-brand-orange/30 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 text-center text-gray-400 font-bold italic animate-pulse">
                            ← 拖動滑桿左右對照成果 →
                        </p>
                    </div>

                    {/* Text Description Side (2/5) */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-6">
                            <h3 className="text-4xl font-black text-brand-gray tracking-tighter uppercase leading-[0.9]">
                                讓您的傳動軸<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-500">重獲新生</span>
                            </h3>
                            <p className="text-lg text-gray-600 font-medium leading-relaxed">
                                我們不只是更換，更是全方位的修復。從鏽蝕清除、零件更換到最關鍵的「動態精密平衡」，確保每一根出廠的傳動軸都符合最高安全標準。
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: "精密校正", desc: "消除行駛間的異常抖動，保護底盤機件。" },
                                { title: "耐用度保證", desc: "採用高品質防塵套與潤滑油脂，延長使用壽命。" }
                            ].map((item, idx) => (
                                <div key={idx} className="group bg-brand-light-gray p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:border-brand-orange/30 transition-all">
                                    <h4 className="text-brand-orange font-black text-lg mb-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                                        {item.title}
                                    </h4>
                                    <p className="text-sm font-bold text-gray-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <div className="bg-brand-gray p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-brand-orange/20 transition-all"></div>
                                <p className="text-3xl font-mono font-black mb-2">99.9%</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Balance Accuracy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
