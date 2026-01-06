"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Search, Users, Phone, Car, Edit2, X, Save, History, ChevronRight } from "lucide-react";

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
    vehicles: Vehicle[];
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
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const fetchCustomers = useCallback(async () => {
        try {
            const res = await fetch(`/api/customers?search=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCustomers();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, fetchCustomers]);

    const fetchAppointments = async (customerId: string) => {
        try {
            const res = await fetch(`/api/customers/${customerId}/appointments`);
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        }
    };

    const handleSelectCustomer = async (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditForm({ name: customer.name || "", notes: customer.notes || "" });
        setIsEditing(false);
        await fetchAppointments(customer.id);
        setShowHistory(false);
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
                setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
                setSelectedCustomer(updated);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to update customer:", error);
        }
    };

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
                    共 {customers.length} 位客戶
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
                </div>

                {/* Customer Detail */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                    {selectedCustomer ? (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold">客戶詳情</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowHistory(!showHistory)}
                                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${showHistory ? 'bg-brand-orange text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <History size={16} />
                                        維修歷史
                                    </button>
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                            >
                                                <X size={16} />
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-4 py-2 bg-brand-orange text-white rounded-lg flex items-center gap-2"
                                            >
                                                <Save size={16} />
                                                儲存
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Edit2 size={16} />
                                            編輯
                                        </button>
                                    )}
                                </div>
                            </div>

                            {showHistory ? (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-600">維修紀錄 ({appointments.length})</h3>
                                    {appointments.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400">尚無維修紀錄</div>
                                    ) : (
                                        appointments.map((apt) => (
                                            <div key={apt.id} className="p-4 border rounded-xl">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-bold">{apt.service.name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {format(new Date(apt.date), "yyyy/MM/dd (eee)", { locale: zhTW })}
                                                        </div>
                                                        {apt.licensePlate && (
                                                            <div className="text-xs text-brand-orange font-mono mt-1 flex items-center gap-1">
                                                                <Car size={10} />
                                                                {apt.licensePlate} {apt.carModel && `(${apt.carModel})`}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : apt.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                            {apt.status === 'COMPLETED' ? '已完成' : apt.status === 'CANCELLED' ? '已取消' : '待處理'}
                                                        </span>
                                                        {apt.warrantyUntil && (
                                                            <div className="text-xs text-gray-400 mt-1">
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
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-gray-600">姓名</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full p-3 rounded-lg border focus:border-brand-orange outline-none"
                                                />
                                            ) : (
                                                <div className="p-3 bg-gray-50 rounded-lg">{selectedCustomer.name || '未設定'}</div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-gray-600">電話</label>
                                            <div className="p-3 bg-gray-50 rounded-lg font-mono">{selectedCustomer.phoneNumber}</div>
                                        </div>
                                    </div>

                                    {/* Vehicles Section */}
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-600">
                                            車輛 ({selectedCustomer.vehicles.length})
                                        </label>
                                        {selectedCustomer.vehicles.length === 0 ? (
                                            <div className="p-3 bg-gray-50 rounded-lg text-gray-400">尚無車輛資料</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {selectedCustomer.vehicles.map((vehicle) => (
                                                    <div key={vehicle.id} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                                                        <Car size={16} className="text-brand-orange" />
                                                        <span className="font-mono font-bold">{vehicle.licensePlate}</span>
                                                        {vehicle.carModel && (
                                                            <span className="text-gray-500">{vehicle.carModel}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-600">備註</label>
                                        {isEditing ? (
                                            <textarea
                                                value={editForm.notes}
                                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                                rows={3}
                                                className="w-full p-3 rounded-lg border focus:border-brand-orange outline-none"
                                            />
                                        ) : (
                                            <div className="p-3 bg-gray-50 rounded-lg min-h-[80px]">{selectedCustomer.notes || '無備註'}</div>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        建立時間：{format(new Date(selectedCustomer.createdAt), "yyyy/MM/dd HH:mm")}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 min-h-[300px]">
                            <div className="text-center">
                                <Users size={48} className="mx-auto mb-4 opacity-30" />
                                <p>請從左側選擇客戶</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
