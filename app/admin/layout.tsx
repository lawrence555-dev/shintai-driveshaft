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
    CalendarDays
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
        <div className="flex min-h-screen bg-gray-50 pb-20 md:pb-0">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-brand-gray text-white flex items-center justify-between px-6 z-[60] border-b border-white/5 shadow-lg">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-brand-orange p-1.5 rounded-lg">
                        <Home size={18} className="text-white" />
                    </div>
                    <span className="font-black tracking-tighter uppercase text-sm">
                        {settings?.businessName.substring(0, 4) || "新泰"} ADMIN
                    </span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* Sidebar Overlay (Mobile) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] md:hidden animate-in fade-in duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-[80] transition-all duration-300 ease-in-out bg-brand-gray text-white flex flex-col shadow-2xl
                    ${isMobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"}
                    ${isCollapsed ? "md:w-20" : "md:w-72"}
                `}
            >
                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-4 top-10 bg-brand-orange text-white w-8 h-8 rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform z-[90]"
                >
                    {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
                </button>

                <div className="p-6 border-b border-white/10 overflow-hidden shrink-0">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-brand-orange p-2 rounded-lg group-hover:scale-110 transition-transform shrink-0">
                            <Home size={24} className="text-white" />
                        </div>
                        {(!isCollapsed || isMobileMenuOpen) && (
                            <div className="whitespace-nowrap opacity-100 transition-opacity duration-300">
                                <h1 className="text-xl font-black tracking-tighter uppercase leading-tight">
                                    {settings?.businessName.substring(0, 4) || "新泰汽車"}
                                </h1>
                                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
                                    Admin Dashboard
                                </p>
                            </div>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                title={(isCollapsed && !isMobileMenuOpen) ? item.name : ""}
                                className={`flex items-center rounded-2xl font-bold transition-all group relative ${isCollapsed && !isMobileMenuOpen ? "md:justify-center p-4 px-0" : "gap-4 px-6 py-4"
                                    } ${isActive
                                        ? "bg-brand-orange text-white shadow-[0_10px_30px_rgba(255,140,0,0.3)]"
                                        : "text-white/60 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                <Icon size={22} className={`${isActive ? "text-white" : "group-hover:text-brand-orange"} transition-colors shrink-0`} />
                                {(!isCollapsed || isMobileMenuOpen) && (
                                    <span className="whitespace-nowrap transition-opacity duration-300">
                                        {item.name}
                                    </span>
                                )}
                                {(!isCollapsed || isMobileMenuOpen) && isActive && (
                                    <ChevronRight size={18} className="ml-auto animate-pulse" />
                                )}

                                {/* Desktop Collapsed Tooltip */}
                                {isCollapsed && !isMobileMenuOpen && (
                                    <div className="absolute left-full ml-4 px-3 py-2 bg-brand-gray text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-xl hidden md:block">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/10 overflow-hidden shrink-0">
                    {(!isCollapsed || isMobileMenuOpen) ? (
                        <p className="text-xs text-center text-white/30 font-medium whitespace-nowrap">
                            © {new Date().getFullYear()} {settings?.businessName || "新泰汽車"}<br />
                            Internal Management
                        </p>
                    ) : (
                        <p className="text-[10px] text-center text-white/20 font-black uppercase tracking-tighter">
                            {settings?.businessName.substring(0, 2) || "ST"}
                        </p>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-300 ease-in-out pt-16 md:pt-0 ${isCollapsed ? "md:ml-20" : "md:ml-72"}`}
            >
                <div className="p-4 md:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-gray/95 backdrop-blur-lg border-t border-white/10 px-6 py-3 flex items-center justify-between z-[60] shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
                {sidebarItems.slice(0, 5).map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-brand-orange" : "text-white/40"}`}
                        >
                            <Icon size={20} />
                            <span className="text-[8px] font-black uppercase tracking-tighter">{item.name.substring(0, 2)}</span>
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
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
