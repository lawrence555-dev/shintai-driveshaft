"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Search, Users, Phone, Car, Edit2, X, Save, History, ChevronRight, ChevronLeft, Calendar, ShieldCheck } from "lucide-react";

interface Vehicle {
    id: string;
    licensePlate: string;
    carModel: string | null;
}

interface Customer {
    id: string;
    name: string | null;
    phoneNumber: string;
    notes: string | null;
    vehicles: (Vehicle & { appointments: Appointment[] })[];
    createdAt: string;
}

interface Appointment {
    id: string;
    date: string;
    status: string;
    carModel: string;
    licensePlate: string | null;
    service: {
        name: string;
    };
    warrantyUntil: string | null;
}

export default function CustomersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<{ name: string; notes: string }>({ name: "", notes: "" });
    // const [appointments, setAppointments] = useState<Appointment[]>([]); // Removed: Use selectedCustomer.appointments directly

    // UI State
    const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCustomers, setTotalCustomers] = useState(0);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/customers?search=${encodeURIComponent(searchQuery)}&page=${page}&limit=20`);
            if (res.ok) {
                const data = await res.json();
                if (data.data) {
                    setCustomers(data.data);
                    setTotalPages(data.totalPages);
                    setTotalCustomers(data.total);
                } else {
                    // Fallback for backward capability
                    setCustomers(Array.isArray(data) ? data : []);
                }
            }
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, page]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        // Debounce search, reset page to 1
        const timer = setTimeout(() => {
            if (page !== 1) {
                setPage(1);
            } else {
                fetchCustomers();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchCustomers();
    }, [page]);

    // fetchAppointments removed - data is now eager loaded

    const handleSelectCustomer = async (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditForm({ name: customer.name || "", notes: customer.notes || "" });
        setIsEditing(false);
        setActiveTab('info');
        // No need to fetch appointments anymore
    };

    const handleSave = async () => {
        if (!selectedCustomer) return;
        try {
            const res = await fetch(`/api/customers/${selectedCustomer.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                const updated = await res.json();
                // Merge existing vehicles/appointments since PATCH response likely shallow
                const updatedWithRelation = {
                    ...updated,
                    vehicles: selectedCustomer.vehicles
                };

                setCustomers(prev => prev.map(c => c.id === updated.id ? updatedWithRelation : c));
                setSelectedCustomer(updatedWithRelation);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to update customer:", error);
        }
    };

    const getSortedAppointments = (customer: Customer): Appointment[] => {
        if (!customer.vehicles) return [];
        return customer.vehicles
            .flatMap(v => v.appointments || [])
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const customerAppointments = selectedCustomer ? getSortedAppointments(selectedCustomer) : [];

    if (status === "loading" || !session) {
        return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-brand-gray flex items-center gap-2">
                        <Users className="text-brand-orange" />
                        客戶管理
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">管理客戶資料與維修歷史</p>
                </div>
                <div className="text-sm text-gray-500">
                    共 {totalCustomers} 位客戶
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer List */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="搜尋姓名、電話、車牌..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 focus:border-brand-orange outline-none"
                            />
                        </div>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">載入中...</div>
                        ) : customers.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">尚無客戶資料</div>
                        ) : (
                            customers.map((customer) => (
                                <button
                                    key={customer.id}
                                    onClick={() => handleSelectCustomer(customer)}
                                    className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-all ${selectedCustomer?.id === customer.id ? 'bg-orange-50 border-l-4 border-l-brand-orange' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-brand-gray">
                                                {customer.name || '未設定姓名'}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Phone size={12} />
                                                    {customer.phoneNumber}
                                                </span>
                                            </div>
                                            {customer.vehicles.length > 0 && (
                                                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1 flex-wrap">
                                                    <Car size={10} />
                                                    {customer.vehicles.map(v => v.licensePlate).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300" />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    <div className="p-4 border-t shrink-0 flex items-center justify-between bg-gray-50">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-bold text-gray-500">
                            Page {page} / {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Customer Detail */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg flex flex-col h-[700px]">
                    {selectedCustomer ? (
                        <>
                            {/* Tabs Header */}
                            <div className="flex items-center border-b px-6 pt-6 gap-6">
                                <button
                                    onClick={() => setActiveTab('info')}
                                    className={`pb-4 px-2 text-lg font-bold transition-all relative ${activeTab === 'info'
                                        ? 'text-brand-orange'
                                        : 'text-gray-400 hover:text-brand-gray'
                                        }`}
                                >
                                    基本資料
                                    {activeTab === 'info' && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-orange rounded-t-full"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`pb-4 px-2 text-lg font-bold transition-all relative ${activeTab === 'history'
                                        ? 'text-brand-orange'
                                        : 'text-gray-400 hover:text-brand-gray'
                                        }`}
                                >
                                    維修歷史
                                    <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                        {customerAppointments.length}
                                    </span>
                                    {activeTab === 'history' && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-orange rounded-t-full"></div>
                                    )}
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {activeTab === 'history' ? (
                                    <div className="space-y-4">
                                        {customerAppointments.length === 0 ? (
                                            <div className="text-center py-20 text-gray-400">
                                                <History size={48} className="mx-auto mb-4 opacity-20" />
                                                <p>尚無維修紀錄</p>
                                            </div>
                                        ) : (
                                            customerAppointments.map((apt) => (
                                                <div key={apt.id} className="p-5 border border-gray-100 rounded-2xl hover:border-brand-orange/30 transition-all bg-gray-50/30">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="font-bold text-lg text-brand-gray mb-1">{apt.service.name}</div>
                                                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                                                <Calendar size={14} />
                                                                {format(new Date(apt.date), "yyyy/MM/dd (eee)", { locale: zhTW })}
                                                            </div>
                                                            {apt.licensePlate && (
                                                                <div className="text-xs text-brand-orange font-mono mt-2 flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md w-fit">
                                                                    <Car size={10} />
                                                                    {apt.licensePlate} {apt.carModel && ` / ${apt.carModel}`}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : apt.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                                {apt.status === 'COMPLETED' ? '已完成' : apt.status === 'CANCELLED' ? '已取消' : '待處理'}
                                                            </span>
                                                            {apt.warrantyUntil && (
                                                                <div className="text-xs text-gray-400 mt-2 flex items-center justify-end gap-1">
                                                                    <ShieldCheck size={12} />
                                                                    保固至 {format(new Date(apt.warrantyUntil), "yyyy/MM/dd")}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    // Info Tab Content
                                    <div className="space-y-8 max-w-2xl">
                                        {/* Action Bar for Display Mode */}
                                        {!isEditing && (
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-4 py-2 border border-brand-orange text-brand-orange rounded-xl hover:bg-orange-50 flex items-center gap-2 font-bold transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                    編輯資料
                                                </button>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-sm font-bold mb-3 text-gray-400 uppercase tracking-wider">客戶姓名</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="w-full p-4 rounded-xl border bg-gray-50 focus:bg-white focus:border-brand-orange outline-none text-lg font-bold"
                                                    />
                                                ) : (
                                                    <div className="text-2xl font-black text-brand-gray">{selectedCustomer.name || '未設定'}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-3 text-gray-400 uppercase tracking-wider">聯絡電話</label>
                                                <div className="text-2xl font-black text-brand-gray font-mono">{selectedCustomer.phoneNumber}</div>
                                            </div>
                                        </div>

                                        {/* Vehicles Section */}
                                        <div>
                                            <label className="block text-sm font-bold mb-3 text-gray-400 uppercase tracking-wider">
                                                名下車輛 ({selectedCustomer.vehicles.length})
                                            </label>
                                            {selectedCustomer.vehicles.length === 0 ? (
                                                <div className="p-4 bg-gray-50 rounded-xl text-gray-400 italic">尚無車輛資料</div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {selectedCustomer.vehicles.map((vehicle) => (
                                                        <div key={vehicle.id} className="p-4 bg-gray-50 rounded-xl flex items-center gap-4 border border-transparent hover:border-gray-200 transition-all">
                                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-orange shadow-sm">
                                                                <Car size={20} />
                                                            </div>
                                                            <div>
                                                                <div className="font-mono font-black text-lg text-brand-gray">{vehicle.licensePlate}</div>
                                                                {vehicle.carModel && (
                                                                    <div className="text-sm text-gray-500 font-bold">{vehicle.carModel}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-3 text-gray-400 uppercase tracking-wider">備註事項</label>
                                            {isEditing ? (
                                                <textarea
                                                    value={editForm.notes}
                                                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                                    rows={4}
                                                    className="w-full p-4 rounded-xl border bg-gray-50 focus:bg-white focus:border-brand-orange outline-none font-medium resize-none"
                                                    placeholder="輸入備註..."
                                                />
                                            ) : (
                                                <div className="p-6 bg-gray-50 rounded-2xl min-h-[100px] text-gray-600 leading-relaxed whitespace-pre-line">
                                                    {selectedCustomer.notes || '無備註內容'}
                                                </div>
                                            )}
                                        </div>

                                        {isEditing && (
                                            <div className="flex items-center gap-4 pt-4 border-t">
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                                >
                                                    取消
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    className="px-8 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-105 transition-all flex items-center gap-2"
                                                >
                                                    <Save size={18} />
                                                    儲存變更
                                                </button>
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-300 pt-8 text-center font-mono">
                                            Client ID: {selectedCustomer.id} | Created: {format(new Date(selectedCustomer.createdAt), "yyyy/MM/dd HH:mm")}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 min-h-[300px]">
                            <div className="text-center">
                                <Users size={64} className="mx-auto mb-6 opacity-20" />
                                <p className="text-xl font-bold">請從左側列表選擇客戶</p>
                                <p className="text-sm mt-2 opacity-50">查看詳細資料與維修歷史</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
