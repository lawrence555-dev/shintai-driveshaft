"use client";

import { useState, useEffect } from "react";
import {
    Search,
    ShieldCheck,
    AlertCircle,
    Loader2,
    CheckCircle2,
    Hash,
    X,
    Phone,
    ExternalLink,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Car
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface WarrantyRecord {
    id: string;
    serviceName: string;
    repairDate: string;
    carModel: string;
    licensePlate: string | null;
    warrantyUntil: string;
    isActive: boolean;
    daysRemaining: number;
}

interface WarrantyLookupDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WarrantyLookupDialog({ isOpen, onClose }: WarrantyLookupDialogProps) {
    const [licensePlate, setLicensePlate] = useState("");
    const [phoneLast4, setPhoneLast4] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<WarrantyRecord[]>([]);
    const [error, setError] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Reset state when closing/opening
    useEffect(() => {
        if (!isOpen) {
            setLicensePlate("");
            setPhoneLast4("");
            setResults([]);
            setError("");
            setExpandedId(null);
        }
    }, [isOpen]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!licensePlate || !phoneLast4) return;

        setLoading(true);
        setError("");
        setResults([]);

        try {
            const res = await fetch(`/api/warranty/lookup?licensePlate=${encodeURIComponent(licensePlate)}&phoneNumber=${encodeURIComponent(phoneLast4)}`);
            const data = await res.json();

            if (res.ok && data.warranties && data.warranties.length > 0) {
                setResults(data.warranties);
                // Auto-expand first item
                setExpandedId(data.warranties[0].id);
            } else {
                setError("查無此保固紀錄，請聯繫店家確認。");
            }
        } catch (err) {
            setError("查詢出錯，請稍後再試。");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getStatusInfo = (record: WarrantyRecord) => {
        if (!record.isActive) {
            return { label: "已過期", color: "bg-gray-100 text-gray-500", icon: <X size={14} /> };
        }
        if (record.daysRemaining <= 30) {
            return { label: "即將到期", color: "bg-yellow-100 text-yellow-600", icon: <AlertTriangle size={14} /> };
        }
        return { label: "保固中", color: "bg-green-100 text-green-600", icon: <CheckCircle2 size={14} /> };
    };

    const renderResults = () => {
        if (results.length === 0) return null;

        const activeCount = results.filter(r => r.isActive).length;

        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Summary Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <Car size={20} className="text-brand-orange" />
                        <span className="font-mono font-black text-brand-gray tracking-tighter">{licensePlate}</span>
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Found <span className="text-brand-orange font-mono">{results.length}</span> records
                    </div>
                </div>

                {/* Warranty List */}
                <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                    {results.map((record) => {
                        const status = getStatusInfo(record);
                        const isExpanded = expandedId === record.id;
                        const startDate = new Date(record.repairDate);
                        const endDate = new Date(record.warrantyUntil);
                        const totalDays = differenceInDays(endDate, startDate);
                        const elapsedDays = differenceInDays(new Date(), startDate);
                        const progress = totalDays > 0
                            ? Math.min(100, Math.max(0, (1 - elapsedDays / totalDays) * 100))
                            : 0;

                        return (
                            <div
                                key={record.id}
                                className={`border rounded-2xl overflow-hidden transition-all ${isExpanded ? 'border-brand-orange shadow-lg' : 'border-gray-100'
                                    } ${!record.isActive ? 'opacity-60' : ''}`}
                            >
                                {/* Header Row - Clickable */}
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${status.color}`}>
                                            {status.icon}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-brand-gray">{record.serviceName}</div>
                                            <div className="text-xs text-gray-400">
                                                {format(startDate, "yyyy/MM/dd")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {record.isActive && (
                                            <div className="text-right">
                                                <div className="text-xl font-mono font-black text-brand-orange leading-none mb-1">
                                                    {record.daysRemaining}
                                                </div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Days Left</div>
                                            </div>
                                        )}
                                        {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {/* Progress Bar */}
                                        {record.isActive && (
                                            <div className="p-4 bg-brand-gray rounded-xl">
                                                <div className="relative h-3 w-full bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`absolute inset-y-0 left-0 transition-all duration-500 ${progress < 20 ? 'bg-red-500' : progress < 50 ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                                                    <span>完工 {format(startDate, "yyyy/MM/dd")}</span>
                                                    <span>到期 {format(endDate, "yyyy/MM/dd")}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Vehicle Info */}
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="p-3 bg-gray-50 rounded-xl">
                                                <div className="text-[10px] font-bold text-gray-400 mb-1">車型</div>
                                                <div className="font-bold text-brand-gray">{record.carModel}</div>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-xl">
                                                <div className="text-[10px] font-bold text-gray-400 mb-1">狀態</div>
                                                <div className={`font-bold ${record.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {status.label}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Contact Button */}
                <a
                    href="tel:0979293225"
                    className="group relative w-full bg-brand-orange text-white p-5 rounded-2xl font-black text-lg transition-all shadow-[0_15px_30px_-5px_rgba(255,107,0,0.4)] hover:shadow-[0_20px_40px_-8px_rgba(255,107,0,0.6)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]"></div>
                    <Phone size={20} className="relative z-10 group-hover:rotate-12 transition-transform" />
                    <span className="relative z-10">聯絡師傅 (0979 293 225)</span>
                    <ExternalLink size={16} className="relative z-10 opacity-50" />
                </a>

                <p className="text-[10px] text-center text-gray-400 font-bold leading-relaxed px-4 uppercase tracking-widest">
                    ※ Please contact us for detailed warranty terms.
                </p>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-gray/80 backdrop-blur-md animate-in fade-in duration-500 pointer-events-auto"
                onClick={onClose}
            />

            {/* Dialog Content */}
            <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.4)] overflow-hidden border-4 border-white animate-in zoom-in fade-in duration-500 flex flex-col max-h-[85vh] pointer-events-auto my-auto self-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-brand-gray rounded-full transition-all z-20"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="bg-brand-gray p-8 pt-10 text-white relative">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-brand-orange mb-1">
                            <ShieldCheck size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">ST-Warranty</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase">
                            保固查詢<span className="text-brand-orange">系統</span>
                        </h2>
                    </div>
                    <ShieldCheck size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto">
                    {results.length === 0 ? (
                        <form onSubmit={handleSearch} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-gray uppercase tracking-widest ml-1">車牌號碼</label>
                                <div className="relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="ABC-1234"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-4 font-mono font-black text-brand-gray tracking-widest focus:border-brand-orange focus:bg-white transition-all outline-none placeholder:font-sans placeholder:tracking-normal"
                                        value={licensePlate}
                                        onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-gray uppercase tracking-widest ml-1">手機末四碼</label>
                                <div className="relative">
                                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        required
                                        type="text"
                                        maxLength={4}
                                        placeholder="5678"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-4 font-bold text-brand-gray focus:border-brand-orange focus:bg-white transition-all outline-none"
                                        value={phoneLast4}
                                        onChange={(e) => setPhoneLast4(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="group relative w-full bg-brand-orange text-white py-5 rounded-xl font-black text-lg transition-all shadow-[0_15px_30px_-5px_rgba(255,107,0,0.3)] hover:shadow-[0_20px_40px_-8px_rgba(255,107,0,0.5)] flex items-center justify-center gap-3 active:scale-[0.98] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]"></div>
                                {loading ? <Loader2 className="animate-spin relative z-10" /> : <span className="relative z-10">立即查詢 Query Now</span>}
                            </button>

                            {error && (
                                <div className="p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-500 font-bold text-sm animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle size={18} className="shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}
                        </form>
                    ) : (
                        renderResults()
                    )}
                </div>
            </div>
        </div>
    );
}
