"use client";

import { useState } from "react";
import { X, Calendar, Clock, User, Car, Wrench, CheckCircle, Package, AlertTriangle } from "lucide-react";
import CancelAppointmentModal from "./CancelAppointmentModal";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

interface AppointmentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: any;
    onStatusUpdate: () => void;
}

export default function AppointmentDetailModal({
    isOpen,
    onClose,
    appointment,
    onStatusUpdate,
}: AppointmentDetailModalProps) {
    const [loading, setLoading] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    if (!isOpen || !appointment) return null;

    const updateStatus = async (newStatus: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/appointments/${appointment.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                onStatusUpdate();
                onClose();
            }
        } catch (error) {
            console.error("更新失敗:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "CONFIRMED": return "bg-blue-100 text-blue-800 border-blue-200";
            case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
            case "CANCELLED": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "PENDING": return "待確認";
            case "CONFIRMED": return "已確認";
            case "COMPLETED": return "已完成";
            case "CANCELLED": return "已取消";
            default: return status;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <div className="absolute inset-0 bg-brand-gray/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-brand-gray p-8 text-white relative">
                    <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                        <X size={28} />
                    </button>
                    <div className="flex items-center gap-4 mb-2">
                        <span className={`px-4 py-1 rounded-full text-sm font-black border-2 ${getStatusStyle(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                        </span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">預約詳情</h2>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="text-brand-orange" size={24} />
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">預約日期</p>
                                    <p className="text-lg font-bold text-brand-gray">{format(new Date(appointment.date), "yyyy/MM/dd (EEEE)", { locale: zhTW })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="text-brand-orange" size={24} />
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">預約時段</p>
                                    <p className="text-lg font-bold text-brand-gray">{format(new Date(appointment.date), "HH:mm")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="text-brand-orange" size={24} />
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">客戶姓名</p>
                                    <p className="text-lg font-bold text-brand-gray">{appointment.user?.name || "未知"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Car className="text-brand-orange" size={24} />
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">提供車型</p>
                                    <p className="text-lg font-bold text-brand-gray">{appointment.carModel}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-light-gray p-6 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Wrench className="text-brand-orange" size={20} />
                            <p className="text-sm font-black text-brand-gray uppercase tracking-widest">維修項目</p>
                        </div>
                        <p className="text-xl font-bold text-brand-gray">{appointment.service?.name}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        {appointment.status === "PENDING" && (
                            <button
                                disabled={loading}
                                onClick={() => updateStatus("CONFIRMED")}
                                className="flex-1 bg-brand-orange hover:bg-orange-600 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={24} />
                                核准預約
                            </button>
                        )}
                        {appointment.status === "CONFIRMED" && (
                            <button
                                disabled={loading}
                                onClick={() => updateStatus("COMPLETED")}
                                className="flex-1 bg-brand-gray hover:bg-gray-700 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <Package size={24} />
                                標記為完工
                            </button>
                        )}
                        {(appointment.status === "PENDING" || appointment.status === "CONFIRMED") && (
                            <button
                                disabled={loading}
                                onClick={() => setIsCancelModalOpen(true)}
                                className="px-6 bg-white hover:bg-red-50 text-red-600 border-2 border-red-100 hover:border-red-200 p-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2"
                            >
                                <AlertTriangle size={24} />
                                取消預約
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <CancelAppointmentModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={() => updateStatus("CANCELLED")}
                loading={loading}
            />
        </div>
    );
}
