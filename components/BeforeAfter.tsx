"use client";

import { MoveRight } from "lucide-react";

export default function BeforeAfter() {
    return (
        <section className="py-24 bg-white px-6 md:px-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-brand-gray leading-none">
                        維修成果實測
                    </h2>
                    <div className="w-32 h-3 bg-brand-orange mx-auto mt-6"></div>
                    <p className="text-xl text-gray-500 font-bold mt-6">Before & After Comparison</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Before & After Comparison Cards */}
                    <div className="space-y-8">
                        <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl border-4 border-white ring-1 ring-gray-200">
                            <div className="absolute top-6 left-6 z-20 bg-red-600 text-white px-6 py-2 rounded-full font-black text-lg shadow-xl uppercase tracking-widest">
                                Before 維修前
                            </div>
                            <img
                                src="/images/before.png"
                                alt="Driveshaft before repair"
                                className="w-full h-[400px] object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                            <div className="absolute bottom-8 left-8 z-20 text-white">
                                <p className="text-2xl font-black">鏽蝕嚴重、異音源頭</p>
                                <p className="text-gray-300 font-bold">嚴重磨損且缺乏保養的舊品</p>
                            </div>
                        </div>

                        <div className="flex justify-center py-4">
                            <div className="bg-brand-orange p-4 rounded-full text-white shadow-[0_0_30px_rgba(255,107,0,0.5)] animate-bounce">
                                <MoveRight size={32} strokeWidth={3} />
                            </div>
                        </div>

                        <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl border-4 border-white ring-1 ring-brand-orange/30">
                            <div className="absolute top-6 left-6 z-20 bg-green-600 text-white px-6 py-2 rounded-full font-black text-lg shadow-xl uppercase tracking-widest">
                                After 維修後
                            </div>
                            <img
                                src="/images/after.png"
                                alt="Driveshaft after repair"
                                className="w-full h-[400px] object-cover group-hover:scale-105 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/80 via-transparent to-transparent opacity-40"></div>
                            <div className="absolute bottom-8 left-8 z-20 text-white">
                                <p className="text-3xl font-black">專業翻新、靜音順暢</p>
                                <p className="text-white/90 font-bold text-lg">精密平衡處理，呈現原廠級品質</p>
                            </div>
                        </div>
                    </div>

                    {/* Text Description Side */}
                    <div className="lg:pl-12 space-y-10">
                        <div className="border-l-8 border-brand-orange pl-8 space-y-6">
                            <h3 className="text-4xl font-black text-brand-gray tracking-tighter uppercase">
                                讓您的傳動軸<br />
                                <span className="text-brand-orange">重獲新生</span>
                            </h3>
                            <p className="text-xl text-gray-700 font-bold leading-relaxed">
                                我們不只是更換，更是全方位的修復。從鏽蝕清除、零件更換到最關鍵的「動態精密平衡」，確保每一根出廠的傳動軸都符合最高安全標準。
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-brand-light-gray p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <h4 className="text-brand-orange font-black text-xl mb-2">精密校正</h4>
                                <p className="font-bold text-gray-600">消除行駛間的異常抖動，保護底盤機件。</p>
                            </div>
                            <div className="bg-brand-light-gray p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <h4 className="text-brand-orange font-black text-xl mb-2">耐用度保證</h4>
                                <p className="font-bold text-gray-600">採用高品質防塵套與潤滑油脂，延長使用壽命。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
