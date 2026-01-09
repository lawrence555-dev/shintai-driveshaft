"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";

interface CancelAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export default function CancelAppointmentModal({
    isOpen,
    onClose,
    onConfirm,
    loading
}: CancelAppointmentModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-0">
            <div className="absolute inset-0 bg-brand-gray/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl border-4 border-white overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                        <AlertTriangle size={40} />
                    </div>

                    <h2 className="text-2xl font-black text-brand-gray mb-2">確定要取消預約嗎？</h2>
                    <p className="text-gray-500 font-bold mb-8">此動作無法復原，該時段將會重新釋出給其他客戶預約。</p>

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl font-black transition-all"
                        >
                            暫時不要
                        </button>
                        <button
                            disabled={loading}
                            onClick={onConfirm}
                            className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "確定取消"}
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    );
}
