"use client";

import { useState, useEffect, useMemo } from "react";
import {
    ShieldCheck,
    Search,
    Calendar,
    Car,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Hash,
    Filter
} from "lucide-react";
import { format, differenceInDays, isAfter } from "date-fns";
import { zhTW } from "date-fns/locale";

interface Appointment {
    id: string;
    licensePlate: string | null;
    carModel: string;
    warrantyUntil: string | null;
    status: string;
    service: {
        name: string;
        warrantyMonths: number;
    };
    date: string;
}

export default function WarrantyDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchWarranties = async () => {
            try {
                const res = await fetch("/api/appointments");
                const data = await res.json();

                if (Array.isArray(data)) {
                    // 僅顯示已完工且有保固日期的項目
                    const completedWithWarranty = data.filter((app: Appointment) =>
                        app.status === "COMPLETED" && app.warrantyUntil
                    );
                    setAppointments(completedWithWarranty);
                }
            } catch (error) {
                console.error("Failed to fetch warranties:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWarranties();
    }, []);

    const filteredWarranties = useMemo(() => {
        return appointments.filter(app =>
            app.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.carModel.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => new Date(b.warrantyUntil!).getTime() - new Date(a.warrantyUntil!).getTime());
    }, [appointments, searchQuery]);

    const getRemainingDays = (until: string) => {
        const diff = differenceInDays(new Date(until), new Date());
        return diff;
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-brand-gray tracking-tighter uppercase mb-4">
                        保固查詢 <span className="text-brand-orange">Warranty</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-bold">追蹤並管理所有完工車輛的保固狀態。</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                    <input
                        type="text"
                        placeholder="搜尋車牌或車型..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white p-6 pl-16 rounded-[2rem] font-bold border-4 border-transparent focus:border-brand-orange outline-none transition-all shadow-xl shadow-gray-200/50"
                    />
                </div>
            </header>

            <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-white ring-1 ring-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-brand-gray">
                        <ShieldCheck size={28} className="text-brand-orange" />
                        <h2 className="text-2xl font-black">保固列清單</h2>
                    </div>
                    <div className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        共 {filteredWarranties.length} 筆資料
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">車輛資訊</th>
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">維修項目</th>
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">保固到期日</th>
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">保固狀態</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center">
                                        <div className="animate-pulse flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredWarranties.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center text-gray-400">
                                        <Filter size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="text-xl font-bold">找不到符合條件的保固紀錄</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredWarranties.map((app) => {
                                    const remainingDays = getRemainingDays(app.warrantyUntil!);
                                    const isExpired = remainingDays < 0;

                                    return (
                                        <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-brand-light-gray rounded-2xl flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                                                        <Car size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-black text-brand-gray tracking-tight">{app.carModel}</p>
                                                        <p className="text-sm font-bold text-gray-400 flex items-center gap-1">
                                                            <Hash size={14} className="text-brand-orange" /> {app.licensePlate}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="space-y-1">
                                                    <p className="text-lg font-black text-brand-gray">{app.service.name}</p>
                                                    <p className="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest">
                                                        <Clock size={12} /> {app.service.warrantyMonths} 個月保固
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-brand-gray font-bold">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={18} className="text-brand-orange" />
                                                    {format(new Date(app.warrantyUntil!), "yyyy年MM月dd日", { locale: zhTW })}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                {isExpired ? (
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-full text-xs font-black uppercase tracking-widest border border-red-100">
                                                        <AlertTriangle size={14} /> 已過保
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-widest border border-green-100">
                                                            <CheckCircle2 size={14} /> 保固中
                                                        </div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase ml-1">
                                                            剩餘 <span className="text-brand-orange text-sm">{remainingDays}</span> 天
                                                        </p>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
