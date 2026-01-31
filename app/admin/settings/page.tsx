"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Edit2, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface Settings {
    businessName: string;
    phoneNumber: string;
    address: string;
    slotDuration: number;
    lineNotifyToken: string | null;
    lineOfficialAccountUrl: string | null;
}

export default function SystemSettings() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValues, setTempValues] = useState<Partial<Settings>>({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            toast.error("讀取設定失敗");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (field: keyof Settings, value: any) => {
        setEditingField(field);
        setTempValues({ ...tempValues, [field]: value });
    };

    const handleSave = async (field: keyof Settings) => {
        setSaving(true);
        try {
            const updatedSettings = { ...settings, ...tempValues };
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedSettings),
            });

            if (res.ok) {
                const data = await res.json();
                setSettings(data);
                setEditingField(null);
                toast.success("設定已儲存");
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
            toast.error("儲存失敗");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
            </div>
        );
    }

    const settingsItems = [
        { key: "businessName", label: "商家名稱", value: settings?.businessName },
        { key: "phoneNumber", label: "聯絡電話", value: settings?.phoneNumber },
        { key: "address", label: "營業地址", value: settings?.address },
        { key: "slotDuration", label: "預約時段限制", value: `${settings?.slotDuration} 分鐘 / 單位`, type: "number" },
        { key: "lineOfficialAccountUrl", label: "LINE 官方帳號連結", value: settings?.lineOfficialAccountUrl || "未設定", placeholder: "https://line.me/..." },
        { key: "lineNotifyToken", label: "LINE Notify Token", value: settings?.lineNotifyToken || "未設定", type: "password" },
    ];

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-5xl font-black text-brand-gray tracking-tighter uppercase mb-4">
                    系統設定 <span className="text-brand-orange">Settings</span>
                </h1>
                <p className="text-xl text-gray-500 font-bold">管理網站基本資訊與系統偏好。</p>
            </header>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-white ring-1 ring-gray-100 divide-y divide-gray-100">
                {settingsItems.map((item) => (
                    <div key={item.key} className="py-8 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                            {editingField === item.key ? (
                                <div className="flex items-center gap-3">
                                    <input
                                        type={item.type === "number" ? "number" : "text"}
                                        className="w-full text-xl font-bold text-brand-gray border-b-2 border-brand-orange outline-none bg-orange-50/50 px-2 py-1 rounded"
                                        value={tempValues[item.key as keyof Settings] ?? item.value}
                                        onChange={(e) => setTempValues({
                                            ...tempValues,
                                            [item.key]: item.type === "number" ? parseInt(e.target.value) : e.target.value
                                        })}
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <p className="text-xl font-bold text-brand-gray">
                                    {item.key === "lineNotifyToken" && settings?.lineNotifyToken ? "••••••••••••••••" : item.value}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {editingField === item.key ? (
                                <>
                                    <button
                                        disabled={saving}
                                        onClick={() => handleSave(item.key as keyof Settings)}
                                        className="bg-brand-orange text-white p-3 rounded-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2 font-bold px-5"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        儲存
                                    </button>
                                    <button
                                        onClick={() => setEditingField(null)}
                                        className="text-gray-400 hover:text-gray-600 p-2"
                                    >
                                        <X size={24} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleEdit(item.key as keyof Settings, settings?.[item.key as keyof Settings])}
                                    className="text-brand-orange font-black uppercase tracking-tighter hover:underline flex items-center gap-1 group"
                                >
                                    <Edit2 size={16} className="group-hover:scale-110 transition-transform" />
                                    修改
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-red-50 p-10 rounded-[3rem] border-4 border-white ring-1 ring-red-100">
                <h2 className="text-xl font-black text-red-600 uppercase tracking-widest mb-4">危險區域</h2>
                <button
                    onClick={() => {
                        if (confirm("確定要重設為預設值嗎？")) {
                            // Implement reset logic if needed
                            toast.error("此功能尚未實作");
                        }
                    }}
                    className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl"
                >
                    重設系統資料
                </button>
            </div>
        </div>
    );
}
