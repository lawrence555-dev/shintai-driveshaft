"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { getBlockedSlots, createBlockedSlot, deleteBlockedSlot } from "./actions";
import { format, isSameDay, startOfDay, addDays } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Loader2, Plus, Trash2, Calendar, Clock, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { getAvailableDates, BOOKING_SLOTS, getSlotDateTime } from "@/lib/booking-utils";
import ConfirmModal from "@/components/ConfirmModal";

export default function BlockedSlotsPage() {
    const [blockedSlots, setBlockedSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // New slot form state
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    const availableDates = getAvailableDates(30); // Show next 30 days for blocking

    const fetchBlockedSlots = async () => {
        try {
            const data = await getBlockedSlots();
            setBlockedSlots(data);
        } catch (err) {
            console.error("Failed to fetch blocked slots:", err);
            toast.error("讀取資料失敗");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlockedSlots();
    }, []);

    const handleAdd = async () => {
        if (!selectedDate || !selectedSlot) {
            toast.error("請選擇日期與時段");
            return;
        }

        setSubmitting(true);
        try {
            const dateTime = getSlotDateTime(selectedDate, selectedSlot);
            await createBlockedSlot(dateTime, reason);
            toast.success("已成功封鎖該時段");
            setIsAdding(false);
            setReason("");
            setSelectedSlot(null);
            fetchBlockedSlots();
        } catch (err: any) {
            toast.error(err.message || "設定失敗");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setSelectedSlotId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedSlotId) return;

        const id = selectedSlotId;

        try {
            await deleteBlockedSlot(id);
            toast.success("已解除封鎖");
            fetchBlockedSlots();
        } catch (err: any) {
            toast.error(err.message || "解除失敗");
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-brand-gray tracking-tighter uppercase mb-4">
                        時段管理 <span className="text-brand-orange">Schedule</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-bold">設定不可預約（店休或忙碌）的時間。</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                    >
                        <Plus size={24} /> 新增封鎖時段
                    </button>
                )}
            </header>

            {isAdding && (
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-brand-orange ring-1 ring-orange-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-2xl font-black text-brand-gray mb-8">設定新的不可預約時段</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">第一步：選擇日期</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {availableDates.map((date) => (
                                    <button
                                        key={date.toISOString()}
                                        onClick={() => setSelectedDate(date)}
                                        className={`p-3 rounded-xl border-2 transition-all ${selectedDate && isSameDay(selectedDate, date)
                                            ? 'border-brand-orange bg-orange-50 text-brand-orange'
                                            : 'border-gray-50 hover:border-gray-200 text-gray-400'
                                            }`}
                                    >
                                        <div className="text-[10px] font-bold">{format(date, "MM/dd")}</div>
                                        <div className="text-xs font-black">{format(date, "eee", { locale: zhTW })}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">第二步：選擇時段</label>
                            <div className="space-y-2">
                                {BOOKING_SLOTS.map((slot) => {
                                    const slotDateTime = selectedDate ? getSlotDateTime(selectedDate, slot) : null;
                                    const isAlreadyBlocked = slotDateTime && blockedSlots.some(b =>
                                        new Date(b.date).getTime() === slotDateTime.getTime()
                                    );

                                    return (
                                        <button
                                            key={slot.startTime}
                                            disabled={!!isAlreadyBlocked}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center ${isAlreadyBlocked
                                                ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-60'
                                                : selectedSlot?.startTime === slot.startTime
                                                    ? 'border-brand-orange bg-orange-50 text-brand-orange shadow-inner'
                                                    : 'border-gray-50 hover:border-gray-200 text-gray-400'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{slot.label}</span>
                                                {isAlreadyBlocked && <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-500 uppercase">已封鎖</span>}
                                            </div>
                                            <span className="font-mono">{slot.startTime} - {slot.endTime}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mb-10">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">備註（如：店休、已有私約）</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="請輸入封鎖原因..."
                            className="w-full text-xl font-bold text-brand-gray border-b-2 border-gray-100 focus:border-brand-orange outline-none bg-gray-50/50 p-4 rounded-2xl transition-all"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            disabled={submitting}
                            onClick={handleAdd}
                            className={`flex-1 bg-brand-orange text-white py-5 rounded-2xl font-black text-xl hover:bg-orange-600 shadow-xl transition-all flex items-center justify-center gap-2 ${submitting ? 'opacity-50' : ''}`}
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : <Calendar />} 確認封鎖
                        </button>
                        <button
                            onClick={() => {
                                setIsAdding(false);
                                setReason("");
                            }}
                            className="px-10 py-5 bg-gray-100 text-gray-400 rounded-2xl font-black text-xl hover:bg-gray-200 transition-all border border-transparent"
                        >
                            取消
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-white ring-1 ring-gray-100">
                <h2 className="text-2xl font-black text-brand-gray mb-8 flex items-center gap-3">
                    <div className="w-2 h-8 bg-brand-orange rounded-full"></div>
                    封鎖時段清單
                </h2>

                <div className="space-y-4">
                    {blockedSlots.length > 0 ? (
                        blockedSlots.map((slot) => (
                            <div key={slot.id} className="p-6 bg-brand-light-gray rounded-[2rem] border-2 border-transparent hover:border-brand-orange/20 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-brand-gray shadow-sm shrink-0">
                                        <div className="text-[10px] font-bold opacity-40 uppercase">{format(new Date(slot.date), "MMM")}</div>
                                        <div className="text-2xl font-black">{format(new Date(slot.date), "dd")}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                            <Clock size={12} /> {format(new Date(slot.date), "HH:mm")}
                                            <span className="mx-1">•</span>
                                            {format(new Date(slot.date), "eee", { locale: zhTW })}
                                        </div>
                                        <p className="text-xl font-bold text-brand-gray">{slot.reason || "管理者手動封鎖"}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteClick(slot.id)}
                                    className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                    title="解除封鎖"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                                <Calendar size={40} />
                            </div>
                            <p className="text-gray-400 font-bold">目前沒有封鎖中的時段。</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-[3rem] border-4 border-white ring-1 ring-amber-100 flex items-start gap-4">
                <AlertCircle className="text-amber-500 shrink-0 mt-1" size={24} />
                <div className="text-sm text-amber-700 font-bold leading-relaxed">
                    <p className="text-lg font-black mb-2 uppercase tracking-tighter">注意事項</p>
                    封鎖時段後，該特定日期的特定時間將不會出現在前台的預約選單中。這適用於店內大掃除、員工會議或已被私下預約的情況。若該時段已有客戶預約，封鎖並「不會」自動取消現有訂單，請手動聯絡客戶。
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #f9fafb;
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #e5e7eb;
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #d1d5db;
                }
            `}</style>
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="確定要解除封鎖嗎？"
                message="解除後該時段將重新開放給客戶進行預約，請確認是否繼續。"
                confirmText="確認解除"
                cancelText="先不要"
            />
        </div>
    );
}
