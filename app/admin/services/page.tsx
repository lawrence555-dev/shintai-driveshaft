"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Plus, Wrench, Clock, DollarSign, Loader2, Trash2, AlertTriangle } from "lucide-react";
import AddServiceModal from "@/components/admin/AddServiceModal";

interface Service {
    id: string;
    name: string;
    duration: number;
    price: number;
    warrantyMonths: number;
    isActive: boolean;
}

export default function ServicesManagement() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services");
            const data = await res.json();
            if (Array.isArray(data)) {
                setServices(data.filter(s => s.isActive !== false));
            }
        } catch (error) {
            console.error("Failed to fetch services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string, name: string) => {
        setDeleteConfirm({ id, name });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return;
        setDeleting(true);

        try {
            const res = await fetch(`/api/services/${deleteConfirm.id}`, { method: "DELETE" });
            if (res.ok) {
                fetchServices();
            }
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setDeleting(false);
            setDeleteConfirm(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-brand-gray tracking-tighter uppercase mb-4">
                        維修項目 <span className="text-brand-orange">Management</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-bold">管理店內提供的所有維修與檢查服務。</p>
                </div>

                <button
                    onClick={() => {
                        setEditingService(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-brand-orange hover:bg-orange-600 text-white px-8 py-5 rounded-[2rem] font-black text-xl transition-all shadow-[0_20px_40px_rgba(255,140,0,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3 w-fit"
                >
                    <Plus size={24} />
                    新增服務項目
                </button>
            </header>

            <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-white ring-1 ring-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4 text-brand-gray">
                    <Wrench size={24} className="text-brand-orange" />
                    <h2 className="text-2xl font-black">所有項目清單</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-10 py-6 text-sm font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">服務名稱</th>
                                <th className="px-10 py-6 text-sm font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">預計工時</th>
                                <th className="px-10 py-6 text-sm font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">建議金額</th>
                                <th className="px-10 py-6 text-sm font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">管理</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-gray-400">
                                            <Loader2 className="animate-spin" size={40} />
                                            <p className="font-bold">載入資料中...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : services.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center text-gray-400">
                                        <p className="text-xl font-bold">目前尚無維修項目</p>
                                        <p className="text-sm">點擊右上方按鈕來新增您的第一個服務。</p>
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => (
                                    <tr key={service.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <span className="text-xl font-black text-brand-gray group-hover:text-brand-orange transition-colors">
                                                {service.name || "(未命名項目)"}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3 text-gray-500 font-bold">
                                                <Clock size={18} />
                                                {service.duration} 分鐘
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2 text-brand-gray font-black text-2xl">
                                                <small className="text-sm text-gray-400">TWD</small>
                                                {service.price}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <button
                                                    onClick={() => handleEdit(service)}
                                                    className="text-brand-orange hover:text-orange-600 font-bold text-sm uppercase tracking-widest transition-colors"
                                                >
                                                    編輯
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(service.id, service.name)}
                                                    className="text-gray-400 hover:text-red-500 font-bold text-sm uppercase tracking-widest transition-colors"
                                                >
                                                    刪除
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddServiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchServices}
                service={editingService}
            />

            {/* Custom Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-brand-gray/80 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-red-100 p-4 rounded-2xl">
                                <AlertTriangle className="text-red-500" size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-brand-gray">確認刪除</h3>
                                <p className="text-gray-500 font-bold">刪除後將無法復原</p>
                            </div>
                        </div>
                        <p className="text-lg text-brand-gray mb-8">
                            確定要刪除「<span className="font-black text-red-500">{deleteConfirm.name || "未命名項目"}</span>」嗎？
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-brand-gray py-4 rounded-xl font-black transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {deleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                                {deleting ? "刪除中..." : "確認刪除"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

