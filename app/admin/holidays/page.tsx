"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { syncHolidays, getHolidays, toggleHolidayStatus, deleteHoliday, addManualHoliday } from "./actions";
import { Calendar, RefreshCw, Check, AlertCircle, Trash2, Plus, Info } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminHolidaysPage() {
    const [holidays, setHolidays] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [newName, setNewName] = useState("");

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

    const handleToggle = async (id: string) => {
        try {
            const result = await toggleHolidayStatus(id);
            if (result.success) {
                toast.success("狀態已變更");
                fetchHolidays();
            } else {
                toast.error("變更失敗: " + result.error);
            }
        } catch (err: any) {
            toast.error("錯誤: " + err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("確定要刪除此筆記錄嗎？")) return;
        try {
            const result = await deleteHoliday(id);
            if (result.success) {
                toast.success("已刪除");
                fetchHolidays();
            } else {
                toast.error("刪除失敗: " + result.error);
            }
        } catch (err: any) {
            toast.error("錯誤: " + err.message);
        }
    };

    const handleAddManual = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDate || !newName) return;
        try {
            const result = await addManualHoliday(new Date(newDate), newName, true);
            if (result.success) {
                toast.success("已新增手動記錄");
                setIsAdding(false);
                setNewDate("");
                setNewName("");
                fetchHolidays();
            } else {
                toast.error("新增失敗: " + result.error);
            }
        } catch (err: any) {
            toast.error("錯誤: " + err.message);
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
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-brand-gray text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all"
                    >
                        <Plus size={18} />
                        手動新增
                    </button>
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="bg-brand-orange text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
                    >
                        <RefreshCw className={isSyncing ? "animate-spin" : ""} size={18} />
                        {isSyncing ? "同步中..." : "同步最新假日"}
                    </button>
                </div>
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
                                        <button
                                            onClick={() => handleToggle(h.id)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-[10px] transition-all ${h.isHoliday
                                                ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                                                : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100"
                                                }`}
                                        >
                                            <RefreshCw size={12} />
                                            {h.isHoliday ? "店休 (不開放)" : "營業 (開放預約)"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(h.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                            title="刪除記錄"
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

            {/* Manual Holiday Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-gray/80 backdrop-blur-sm" onClick={() => setIsAdding(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border-4 border-white animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-brand-gray uppercase tracking-tighter">新增自定義日期</h2>
                            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-brand-gray transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddManual} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">日期</label>
                                <input
                                    required
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-brand-orange outline-none transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">名稱</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="例如：店休、臨時加班"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-brand-orange outline-none transition-all"
                                />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 px-6 py-4 border-2 border-gray-100 rounded-2xl font-black text-brand-gray hover:bg-gray-50 transition-all"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-brand-orange text-white rounded-2xl font-black shadow-lg shadow-orange-100 hover:scale-[1.02] transition-all"
                                >
                                    確定新增
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const X = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);
