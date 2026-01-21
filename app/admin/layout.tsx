"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Settings,
    Wrench,
    Home,
    ShieldCheck,
    ChevronRight,
    ChevronLeft,
    Menu,
    Users,
    Clock,
    CalendarDays,
    X
} from "lucide-react";

import { useSettings } from "@/hooks/useSettings";

const sidebarItems = [
    { name: "預約總覽", href: "/admin", icon: LayoutDashboard },
    { name: "客戶管理", href: "/admin/customers", icon: Users },
    { name: "時段管理", href: "/admin/blocked-slots", icon: Clock },
    { name: "國假管理", href: "/admin/holidays", icon: CalendarDays },
    { name: "維修項目管理", href: "/admin/services", icon: Wrench },
    { name: "保固看板", href: "/admin/warranty", icon: ShieldCheck },
    { name: "系統設定", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { settings } = useSettings();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 pb-20 md:pb-0 font-sans">
            {/* Mobile Header - Liquid Glass */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-brand-gray/80 backdrop-blur-2xl text-white flex items-center justify-between px-6 z-[60] border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-brand-orange/5 before:to-transparent before:pointer-events-none">
                <div className="absolute inset-0 bg-white/5 opacity-50 blur-xl pointer-events-none"></div>
                <Link href="/admin" className="flex items-center gap-2 relative z-10">
                    <div className="bg-brand-orange p-1.5 rounded-lg shadow-[0_0_15px_rgba(255,107,0,0.4)]">
                        <Home size={18} className="text-white" />
                    </div>
                    <span className="font-mono font-black tracking-tighter uppercase text-xs">
                        {settings?.businessName.substring(0, 4) || "新泰"} <span className="text-brand-orange">ADMIN</span>
                    </span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all relative z-10 border border-white/5 active:scale-95"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar Overlay (Mobile) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] md:hidden animate-in fade-in duration-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Pro Max Style */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-[80] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] bg-brand-gray text-white flex flex-col shadow-2xl
                    ${isMobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"}
                    ${isCollapsed ? "md:w-20" : "md:w-72"}
                `}
            >
                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-4 top-10 bg-brand-orange text-white w-8 h-8 rounded-full items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.5)] hover:scale-110 transition-transform z-[90] border border-white/20"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

                <div className="p-8 border-b border-white/5 overflow-hidden shrink-0">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="bg-brand-orange p-2.5 rounded-xl group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(255,107,0,0.3)]">
                            <Home size={24} className="text-white" />
                        </div>
                        {(!isCollapsed || isMobileMenuOpen) && (
                            <div className="whitespace-nowrap animate-in slide-in-from-left-4 duration-500">
                                <h1 className="text-xl font-black tracking-tighter uppercase leading-tight font-mono">
                                    {settings?.businessName.substring(0, 4) || "新泰汽車"}
                                </h1>
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">
                                    MANAGEMENT_SYSTEM
                                </p>
                            </div>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                title={(isCollapsed && !isMobileMenuOpen) ? item.name : ""}
                                className={`flex items-center transition-all duration-300 group relative ${isCollapsed && !isMobileMenuOpen ? "md:justify-center p-4 px-0" : "gap-4 px-6 py-4 rounded-2xl border border-transparent"
                                    } ${isActive
                                        ? "bg-gradient-to-r from-brand-orange to-brand-orange/80 text-white shadow-[0_15px_35px_rgba(255,107,0,0.25)] border-white/10"
                                        : "text-white/40 hover:text-white hover:bg-white/5 hover:border-white/5"
                                    }`}
                            >
                                <Icon size={20} className={`${isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "group-hover:text-brand-orange"} transition-colors shrink-0`} />
                                {(!isCollapsed || isMobileMenuOpen) && (
                                    <span className="whitespace-nowrap font-bold text-sm">
                                        {item.name}
                                    </span>
                                )}
                                {(!isCollapsed || isMobileMenuOpen) && isActive && (
                                    <div className="ml-auto w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-white/5 overflow-hidden shrink-0 bg-black/10">
                    {(!isCollapsed || isMobileMenuOpen) ? (
                        <p className="text-[10px] text-center text-white/20 font-black tracking-widest uppercase">
                            © {new Date().getFullYear()} {settings?.businessName || "SHINTAI"}<br />
                            <span className="text-brand-orange/40">CORE_MODULE_v2.0</span>
                        </p>
                    ) : (
                        <p className="text-[10px] text-center text-white/20 font-black uppercase">
                            {settings?.businessName.substring(0, 2) || "ST"}
                        </p>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pt-16 md:pt-0 ${isCollapsed ? "md:ml-20" : "md:ml-72"}`}
            >
                <div className="p-4 md:p-12 max-w-7xl mx-auto relative min-h-screen">
                    {/* Background glow for Liquid Glass feel */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/[0.03] blur-[150px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-orange/[0.02] blur-[150px] rounded-full -ml-64 -mb-64 pointer-events-none"></div>

                    <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation - Liquid Glass Finish */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-brand-gray/80 backdrop-blur-2xl border-t border-white/10 px-6 pb-6 pt-3 flex items-center justify-between z-[60] shadow-[0_-10px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/[0.03] to-transparent pointer-events-none"></div>
                {sidebarItems.slice(0, 5).map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex flex-col items-center gap-1.5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isActive ? "text-brand-orange scale-110" : "text-white/30 hover:text-white/50"}`}
                        >
                            {isActive && (
                                <div className="absolute -top-1 w-1 h-1 bg-brand-orange rounded-full shadow-[0_0_10px_#FF6B00]"></div>
                            )}
                            <Icon size={20} className={isActive ? "drop-shadow-[0_0_12px_rgba(255,107,0,0.6)]" : ""} />
                            <span className="text-[8px] font-mono font-black uppercase tracking-widest">{item.name.substring(0, 2)}</span>
                        </Link>
                    );
                })}
            </nav>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}
