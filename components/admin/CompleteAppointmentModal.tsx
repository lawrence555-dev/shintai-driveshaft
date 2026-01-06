"use client";

import { useState } from "react";
import { X, Clock, CheckCircle } from "lucide-react";

interface CompleteAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: any;
    onComplete: () => void;
}

export default function CompleteAppointmentModal({
    isOpen,
    onClose,
    appointment,
    onComplete,
}: CompleteAppointmentModalProps) {
    const [actualDuration, setActualDuration] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen || !appointment) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/appointments/${appointment.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "COMPLETED",
                    actualDuration: parseInt(actualDuration)
                }),
            });

            if (res.ok) {
                onComplete();
                onClose();
            }
        } catch (error) {
            console.error("結案失敗:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-0">
            <div className="absolute inset-0 bg-brand-gray/90 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-brand-orange p-8 text-white relative">
                    <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle size={32} strokeWidth={3} />
                        <h2 className="text-2xl font-black tracking-tighter uppercase">完工結案</h2>
                    </div>
                    <p className="text-white/80 font-bold uppercase tracking-widest text-sm">請輸入實際維修工時</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="bg-brand-light-gray p-4 rounded-2xl border border-gray-100 mb-2">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">維修項目</p>
                            <p className="text-lg font-bold text-brand-gray">{appointment.service?.name}</p>
                            <p className="text-sm font-bold text-brand-orange">預計工時：{appointment.service?.duration || 120} 分鐘</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-brand-gray uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} /> 實際工時 (分鐘)
                            </label>
                            <input
                                required
                                type="number"
                                value={actualDuration}
                                onChange={(e) => setActualDuration(e.target.value)}
                                placeholder="例如: 130"
                                className="w-full bg-brand-light-gray border-2 border-transparent focus:border-brand-orange p-4 rounded-2xl text-lg font-bold outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !actualDuration}
                        className="w-full bg-brand-gray hover:bg-black text-white p-5 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? "處理中..." : "確認結案"}
                    </button>
                </form>
            </div>
        </div>
    );
}
