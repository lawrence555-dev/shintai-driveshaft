"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "確定",
    cancelText = "取消",
    variant = "danger"
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: "bg-red-600 hover:bg-red-700",
        warning: "bg-brand-orange hover:bg-orange-600",
        info: "bg-brand-gray hover:bg-gray-700"
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-brand-orange'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mt-2">
                    <h3 className="text-xl font-bold text-brand-gray">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`inline-flex justify-center rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition-all active:scale-95 ${variantStyles[variant]}`}
                    >
                        {confirmText}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center rounded-xl border-2 border-gray-100 bg-white px-6 py-3 text-sm font-bold text-brand-gray hover:bg-gray-50 transition-all active:scale-95 sm:mt-0"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}
