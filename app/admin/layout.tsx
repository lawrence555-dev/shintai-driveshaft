"use client";

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
    Users
} from "lucide-react";

import { useSettings } from "@/hooks/useSettings";

const sidebarItems = [
    { name: "預約總覽", href: "/admin", icon: LayoutDashboard },
    { name: "客戶管理", href: "/admin/customers", icon: Users },
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

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`${isCollapsed ? "w-20" : "w-72"} bg-brand-gray text-white flex flex-col fixed inset-y-0 shadow-2xl z-50 transition-all duration-300 ease-in-out group/sidebar`}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-4 top-10 bg-brand-orange text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-[60]"
                >
                    {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
                </button>

                <div className={`p-6 border-b border-white/10 overflow-hidden`}>
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-brand-orange p-2 rounded-lg group-hover:scale-110 transition-transform shrink-0">
                            <Home size={24} className="text-white" />
                        </div>
                        {!isCollapsed && (
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

                <nav className="flex-1 p-4 space-y-2 mt-4 overflow-x-hidden">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={isCollapsed ? item.name : ""}
                                className={`flex items-center rounded-2xl font-bold transition-all group relative ${isCollapsed ? "justify-center p-4 px-0" : "gap-4 px-6 py-4"
                                    } ${isActive
                                        ? "bg-brand-orange text-white shadow-[0_10px_30px_rgba(255,140,0,0.3)]"
                                        : "text-white/60 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                <Icon size={22} className={`${isActive ? "text-white" : "group-hover:text-brand-orange"} transition-colors shrink-0`} />
                                {!isCollapsed && (
                                    <span className="whitespace-nowrap transition-opacity duration-300">
                                        {item.name}
                                    </span>
                                )}
                                {!isCollapsed && isActive && (
                                    <ChevronRight size={18} className="ml-auto animate-pulse" />
                                )}

                                {/* Collapsed Tooltip (Alternative to title) */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-2 bg-brand-gray text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-xl">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/10 overflow-hidden">
                    {!isCollapsed ? (
                        <p className="text-xs text-center text-white/30 font-medium whitespace-nowrap">
                            © {new Date().getFullYear()} {settings?.businessName || "新泰汽車傳動軸"}<br />
                            Internal Management System
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
                className={`flex-1 ${isCollapsed ? "ml-20" : "ml-72"} transition-all duration-300 ease-in-out`}
            >
                <div className="p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
