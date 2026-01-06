"use client";

import { useState, useEffect } from "react";
import { X, Wrench, Clock, DollarSign, Loader2 } from "lucide-react";

interface ServiceData {
    id?: string;
    name: string;
    duration: number;
    price: number;
    warrantyMonths: number;
}

interface AddServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    service?: ServiceData | null;
}

export default function AddServiceModal({ isOpen, onClose, onSuccess, service }: AddServiceModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        duration: "120",
        price: "0",
        warrantyMonths: "0",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Sync form data when service prop changes or modal opens
    useEffect(() => {
        if (isOpen) {
            if (service) {
                setFormData({
                    name: service.name || "",
                    duration: service.duration?.toString() || "120",
                    price: service.price?.toString() || "0",
                    warrantyMonths: service.warrantyMonths?.toString() || "0",
                });
            } else {
                setFormData({
                    name: "",
                    duration: "120",
                    price: "0",
                    warrantyMonths: "0",
                });
            }
            setErrors({});
        }
    }, [isOpen, service]);


    if (!isOpen) return null;

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = "服務名稱不能為空";
        if (parseInt(formData.duration) <= 0) newErrors.duration = "預計工時必須大於 0";
        if (parseInt(formData.price) <= 0) newErrors.price = "金額必須大於 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const url = service ? `/api/services/${service.id}` : "/api/services";
            const method = service ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onSuccess();
                onClose();
                if (!service) {
                    setFormData({ name: "", duration: "120", price: "0", warrantyMonths: "0" });
                }
            }
        } catch (error) {
            console.error("Operation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <div
                className="absolute inset-0 bg-brand-gray/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-4 border-white overflow-hidden animate-in fade-in zoom-in duration-300 transition-all">
                <div className="bg-brand-gray p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={28} />
                    </button>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-brand-orange p-3 rounded-2xl shadow-lg shadow-brand-orange/20">
                            <Wrench size={24} />
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase">
                            {service ? "編輯維修項目" : "新增維修項目"}
                        </h2>
                    </div>
                    <p className="text-white/60 font-bold">請輸入項目的詳細資訊</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-black text-brand-gray uppercase tracking-widest ml-1">項目名稱</label>
                            {errors.name && <span className="text-red-500 text-xs font-bold animate-pulse">{errors.name}</span>}
                        </div>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                placeholder="例如：傳動軸精密平衡"
                                className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 font-bold text-brand-gray focus:ring-4 transition-all outline-none ${errors.name ? 'border-red-200 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-100 focus:border-brand-orange focus:ring-brand-orange/10'}`}
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    if (errors.name) setErrors({ ...errors, name: "" });
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2 sm:col-span-1">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-black text-brand-gray uppercase tracking-widest ml-1">預計工時 (分)</label>
                                {errors.duration && <span className="text-red-500 text-[10px] font-bold">{errors.duration}</span>}
                            </div>
                            <div className="relative">
                                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    required
                                    type="number"
                                    className={`w-full bg-gray-50 border-2 rounded-2xl pl-14 pr-6 py-4 font-bold text-brand-gray focus:ring-4 transition-all outline-none ${errors.duration ? 'border-red-200 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-100 focus:border-brand-orange focus:ring-brand-orange/10'}`}
                                    value={formData.duration}
                                    onChange={(e) => {
                                        setFormData({ ...formData, duration: e.target.value });
                                        if (errors.duration) setErrors({ ...errors, duration: "" });
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2 sm:col-span-1">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-black text-brand-gray uppercase tracking-widest ml-1">金額 (TWD)</label>
                                {errors.price && <span className="text-red-500 text-[10px] font-bold">{errors.price}</span>}
                            </div>
                            <div className="relative">
                                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    required
                                    type="number"
                                    className={`w-full bg-gray-50 border-2 rounded-2xl pl-14 pr-6 py-4 font-bold text-brand-gray focus:ring-4 transition-all outline-none ${errors.price ? 'border-red-200 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-100 focus:border-brand-orange focus:ring-brand-orange/10'}`}
                                    value={formData.price}
                                    onChange={(e) => {
                                        setFormData({ ...formData, price: e.target.value });
                                        if (errors.price) setErrors({ ...errors, price: "" });
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-black text-brand-gray uppercase tracking-widest ml-1">保固月數</label>
                            <div className="relative">
                                <Wrench className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    required
                                    type="number"
                                    placeholder="例如：12"
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 py-4 font-bold text-brand-gray focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none"
                                    value={formData.warrantyMonths}
                                    onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-brand-orange hover:bg-orange-600 text-white p-6 rounded-2xl font-black text-xl transition-all shadow-[0_20px_40px_rgba(255,140,0,0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 mt-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            service ? "儲存修改" : "確認新增項目"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

