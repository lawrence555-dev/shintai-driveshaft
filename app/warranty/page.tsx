"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Calendar, Car, AlertCircle, Loader2 } from "lucide-react";
import { getUserWarranties } from "@/app/booking/actions";
import { format, differenceInMonths, differenceInDays } from "date-fns";
import { zhTW } from "date-fns/locale";
import Footer from "@/components/Footer";

export default function WarrantyPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [warranties, setWarranties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/warranty");
        } else if (status === "authenticated") {
            const fetchData = async () => {
                try {
                    const data = await getUserWarranties();
                    setWarranties(data);
                } catch (error) {
                    console.error("Failed to fetch warranties", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [status, router]);

    if (status === "loading" || (status === "authenticated" && loading)) {
        return (
            <main className="min-h-screen bg-brand-light-gray">
                <Navbar />
                <div className="flex h-[80vh] items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
                </div>
                <Footer />
            </main>
        );
    }

    if (!session) return null; // Logic handled by useEffect

    return (
        <main className="min-h-screen bg-brand-light-gray pb-20">
            <Navbar />

            <div className="max-w-xl mx-auto px-6 py-28 md:py-32">
                <header className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-orange/10 mb-4 text-brand-orange">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-brand-gray mb-2">我的電子保固卡</h1>
                    <p className="text-gray-500 font-bold">保障您的行車安全，紀錄透明公開</p>
                </header>

                <div className="space-y-6">
                    {warranties.length > 0 ? (
                        warranties.map((warranty) => {
                            const expiry = new Date(warranty.warrantyUntil);
                            const now = new Date();
                            const monthsLeft = differenceInMonths(expiry, now);
                            const daysLeft = differenceInDays(expiry, now);

                            return (
                                <div key={warranty.id} className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 relative overflow-hidden group">
                                    {/* Background Decor */}
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-brand-orange/20 to-transparent rounded-full blur-3xl group-hover:bg-brand-orange/30 transition-all"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-widest">VEHICLE ID</p>
                                                <h3 className="text-3xl font-black text-brand-gray tracking-tighter">{warranty.licensePlate}</h3>
                                            </div>
                                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border border-green-200">
                                                保固中
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">
                                                    <Car size={12} /> 車型
                                                </p>
                                                <p className="font-bold text-gray-700">{warranty.carModel}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">
                                                    <ShieldCheck size={12} /> 施作項目
                                                </p>
                                                <p className="font-bold text-gray-700">{warranty.service.name}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">
                                                    <Calendar size={12} /> 保固期限
                                                </p>
                                                <p className="text-xl font-black text-brand-orange">
                                                    {format(expiry, "yyyy 年 MM 月 dd 日", { locale: zhTW })}
                                                </p>
                                                <p className="text-xs font-bold text-gray-400 mt-1">
                                                    (剩餘約 {monthsLeft} 個月 / {daysLeft} 天)
                                                </p>
                                            </div>
                                        </div>

                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-brand-orange rounded-full"
                                                style={{ width: `${Math.min((monthsLeft / (warranty.service.warrantyMonths || 12)) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white/50 border-4 border-dashed border-gray-200 rounded-[3rem] p-12 text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                <ShieldCheck size={40} />
                            </div>
                            <h3 className="text-xl font-black text-gray-400">目前無有效保固</h3>
                            <p className="text-gray-400 text-sm font-bold leading-relaxed">
                                您目前沒有正在進行中的保固服務。<br />
                                若您剛完成維修，請稍待系統更新。
                            </p>
                            <button
                                onClick={() => router.push("/booking")}
                                className="mt-4 bg-brand-gray text-white px-8 py-3 rounded-full font-bold hover:bg-brand-orange transition-all shadow-lg active:scale-95"
                            >
                                立即預約維修
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                    <AlertCircle className="text-blue-500 shrink-0 mt-1" size={20} />
                    <div className="text-xs text-blue-700 leading-relaxed font-bold">
                        <p className="mb-1 uppercase tracking-widest text-[10px] opacity-60">保固說明</p>
                        保固期間內，若因施工不良導致之問題，本店提供免費保修服務。人為因素、車禍或其餘非本部更換之零件損壞，不在此保固範圍內。
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
