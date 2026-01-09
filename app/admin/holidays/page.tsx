"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { syncHolidays, getHolidays } from "./actions";
import { Calendar, RefreshCw, Check, AlertCircle, Trash2, Plus, Info } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminHolidaysPage() {
    const [holidays, setHolidays] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    const fetchHolidays = async () => {
        setIsLoading(true);
        try {
            const result = await getHolidays();
            if (result.success) {
                setHolidays(result.data || []);
            } else {
                toast.error("讀取失敗: " + (result.error || "未知錯誤"));
            }
        } catch (err: any) {
            toast.error("讀取資料例外: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const result = await syncHolidays();
            if (result.success) {
                toast.success(`同步完成！共更新 ${result.count} 筆資料`);
                fetchHolidays();
            } else {
                toast.error("同步失敗: " + (result.error || "未知錯誤"));
            }
        } catch (err: any) {
            toast.error("同步例外: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-brand-gray flex items-center gap-2">
                        <Calendar className="text-brand-orange" />
                        國定假日管理
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        自動同步政府公告之公務機關辦公日曆表，確保預約系統正確排班。
                    </p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="bg-brand-orange text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
                >
                    <RefreshCw className={isSyncing ? "animate-spin" : ""} size={18} />
                    {isSyncing ? "同步中..." : "同步獲取最新假日"}
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">日期</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">名稱</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">狀態</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">管理</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    讀取中...
                                </td>
                            </tr>
                        ) : holidays.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    尚未同步資料，請點擊上方按鈕開始同步。
                                </td>
                            </tr>
                        ) : (
                            holidays.map((h) => (
                                <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                        {format(new Date(h.date), "yyyy/MM/dd (eee)", { locale: zhTW })}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-brand-gray">
                                        {h.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {h.isHoliday ? (
                                            <span className="bg-red-50 text-red-600 text-[10px] px-2 py-1 rounded-full font-bold">
                                                不開放預約 (假日)
                                            </span>
                                        ) : (
                                            <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-full font-bold">
                                                開放預約 (補班日)
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                            title="手動排除 (尚未實作)"
                                            disabled
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex gap-4">
                <div className="flex-1 p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 items-start">
                    <Info className="text-brand-orange shrink-0 mt-0.5" size={18} />
                    <div className="text-xs text-orange-800 leading-relaxed">
                        <strong>運作說明：</strong><br />
                        1. 系統會自動排除「假日」日期，使用者將無法點選。<br />
                        2. 針對「補班日」（週六/週日），系統會自動將其變更為可預約時段。<br />
                        3. 若有特定節日需要強制營業或關閉，可使用上方導覽列的「時段管理」進行手動調整。
                    </div>
                </div>
            </div>
        </div>
    );
}
