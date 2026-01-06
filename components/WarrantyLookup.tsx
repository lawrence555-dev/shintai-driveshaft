"use client";

import { useState, useEffect } from "react";
import {
    Search,
    ShieldCheck,
    Calendar,
    AlertCircle,
    Loader2,
    CheckCircle2,
    Hash,
    Clock,
    X,
    Phone,
    ExternalLink,
    AlertTriangle
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { zhTW } from "date-fns/locale";

// --- 保固結果彈窗組件 ---
function WarrantyResultModal({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: any }) {
    if (!isOpen || !data) return null;

    const startDate = new Date(data.date);
    const endDate = new Date(data.warrantyUntil);
    const today = new Date();

    const totalDays = differenceInDays(endDate, startDate);
    const elapsedDays = differenceInDays(today, startDate);
    const remainingDays = Math.max(0, differenceInDays(endDate, today));

    // 計算進度百分比 (剩餘百分比)
    const rawProgress = totalDays > 0 ? (1 - (elapsedDays / totalDays)) * 100 : 0;
    const progress = Math.min(100, Math.max(0, rawProgress));

    // 決定顏色
    let progressColor = "bg-green-500";
    if (progress < 20) progressColor = "bg-red-500";
    else if (progress < 50) progressColor = "bg-yellow-500";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-brand-gray/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white ring-1 ring-gray-100 flex flex-col animate-in zoom-in slide-in-from-bottom-8 duration-500">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-brand-gray rounded-full transition-all z-10"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="bg-brand-gray p-10 pt-14 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-brand-orange mb-2">
                            <ShieldCheck size={20} />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">ST-Warranty Authentic</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase leading-tight">
                            保固查詢<span className="text-brand-orange">結果</span>
                        </h2>
                    </div>
                    {/* Background decoration */}
                    <ShieldCheck size={160} className="absolute -right-12 -bottom-12 text-white/5 rotate-12" />
                </div>

                {/* Body */}
                <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh]">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">車牌號碼</p>
                            <p className="text-xl font-black text-brand-gray flex items-center gap-2">
                                <Hash size={18} className="text-brand-orange" /> {data.licensePlate || "N/A"}
                            </p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">維修項目</p>
                            <p className="text-xl font-black text-brand-gray">{data.service?.name}</p>
                        </div>
                    </div>

                    {/* Progress Bar Section */}
                    <div className="p-8 bg-gray-50 rounded-[2rem] space-y-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {progress < 20 ? (
                                    <AlertTriangle className="text-red-500 animate-pulse" size={24} />
                                ) : (
                                    <CheckCircle2 className="text-green-500" size={24} />
                                )}
                                <span className="text-lg font-black text-brand-gray">
                                    {progress < 20 ? "保固即將到期" : "保固有效中"}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">剩餘天數</p>
                                <p className="text-3xl font-black text-brand-orange">
                                    {remainingDays} <small className="text-sm">天</small>
                                </p>
                            </div>
                        </div>

                        {/* The Progress Bar */}
                        <div className="relative h-6 w-full bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-inner">
                            <div
                                className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out shadow-lg ${progressColor}`}
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                            </div>
                        </div>

                        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest pt-1 px-1">
                            <div className="flex flex-col gap-1">
                                <span>完工日期</span>
                                <span className="text-brand-gray text-xs">{format(startDate, "yyyy/MM/dd")}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                                <span>到期日期</span>
                                <span className="text-brand-gray text-xs">{format(endDate, "yyyy/MM/dd")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-center text-gray-400 font-bold leading-relaxed px-4">
                        ※ 本保固由新泰汽車提供，僅限於本次維修之特定項目，保固範圍不包含其他人為損壞或非維修部位之自然耗損。
                    </p>
                </div>

                {/* Footer / CTA */}
                <div className="p-10 pt-0">
                    <a
                        href="tel:0912345678" // 建議更換為實際手機
                        className="w-full bg-brand-orange hover:bg-orange-600 text-white p-6 rounded-2xl font-black text-xl transition-all shadow-xl shadow-brand-orange/30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        <Phone size={24} className="group-hover:rotate-12 transition-transform" />
                        如有疑問，點此聯繫師傅
                        <ExternalLink size={18} className="opacity-50" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function WarrantyLookup() {
    const [licensePlate, setLicensePlate] = useState("");
    const [phoneLast4, setPhoneLast4] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!licensePlate || !phoneLast4) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/warranty/lookup?licensePlate=${encodeURIComponent(licensePlate)}&phoneNumber=${encodeURIComponent(phoneLast4)}`);
            const data = await res.json();

            if (res.ok && data.warranties && data.warranties.length > 0) {
                // 取最新的保固資訊
                const latest = data.warranties[0];
                setResult({
                    ...latest,
                    date: latest.repairDate,
                    service: { name: latest.serviceName },
                    licensePlate: latest.licensePlate || licensePlate
                });
                setIsModalOpen(true);
            } else {
                setError("查無此保固紀錄，請聯繫店家確認。");
            }
        } catch (err) {
            setError("查詢出錯，請稍後再試。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="warranty" className="py-24 bg-brand-light-gray scroll-mt-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white ring-1 ring-gray-100 flex flex-col md:flex-row">
                    {/* Left side: Info */}
                    <div className="bg-brand-gray p-12 text-white md:w-5/12 flex flex-col justify-center">
                        <div className="bg-brand-orange w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-brand-orange/20">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase mb-4 leading-tight">
                            車主保固<br />
                            <span className="text-brand-orange">自助查詢</span>
                        </h2>
                        <p className="text-white/60 font-bold leading-relaxed mb-6">
                            輸入車牌號碼與手機末四碼，確保隱私並即時掌握保固狀態。
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm font-bold opacity-80">
                                <div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div>
                                即時到期日提醒
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold opacity-80">
                                <div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div>
                                維修項目追蹤
                            </div>
                        </div>
                    </div>

                    {/* Right side: Search */}
                    <div className="p-12 md:w-7/12 flex flex-col justify-center">
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-brand-gray uppercase tracking-widest ml-1">車牌號碼</label>
                                    <div className="relative">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="ABC-1234"
                                            className="w-full bg-gray-50 border-4 border-transparent rounded-2xl pl-14 pr-6 py-5 font-bold text-lg text-brand-gray focus:border-brand-orange focus:bg-white transition-all outline-none"
                                            value={licensePlate}
                                            onChange={(e) => setLicensePlate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-brand-gray uppercase tracking-widest ml-1">手機末四碼</label>
                                    <div className="relative">
                                        <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            required
                                            type="text"
                                            maxLength={4}
                                            placeholder="5678"
                                            className="w-full bg-gray-50 border-4 border-transparent rounded-2xl pl-14 pr-6 py-5 font-bold text-lg text-brand-gray focus:border-brand-orange focus:bg-white transition-all outline-none"
                                            value={phoneLast4}
                                            onChange={(e) => setPhoneLast4(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-brand-orange hover:bg-orange-600 text-white p-6 rounded-2xl font-black text-xl transition-all shadow-xl shadow-brand-orange/30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "立即查詢保固紀錄"}
                            </button>
                        </form>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 text-center text-red-500 font-bold animate-in fade-in slide-in-from-top-4">
                                <AlertCircle className="mx-auto mb-2" size={32} />
                                <p>{error}</p>
                            </div>
                        )}

                        {!error && !loading && (
                            <div className="mt-8 text-center text-gray-300 font-bold">
                                <p>查無個人資料？請點擊上方按鈕開始</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Result Modal */}
            <WarrantyResultModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={result}
            />
        </section>
    );
}
