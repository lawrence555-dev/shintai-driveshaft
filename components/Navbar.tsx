"use client";

import Link from "next/link";
import { Settings, UserCircle, LogOut, ShieldCheck } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import WarrantyLookupDialog from "./WarrantyLookupDialog";

import { useSettings } from "@/hooks/useSettings";

export default function Navbar() {
    const { settings } = useSettings();
    const { data: session } = useSession();
    const router = useRouter();
    const [isWarrantyDialogOpen, setIsWarrantyDialogOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleBooking = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!session) {
            signIn("google", { redirectTo: "/booking" });
        } else {
            router.push("/booking");
        }
    };

    return (
        <nav className="fixed top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 bg-brand-gray/80 backdrop-blur-xl text-white py-3 px-4 md:py-4 md:px-12 flex items-center justify-between z-50 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center space-x-2">
                <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter hover:text-brand-orange transition-all duration-300">
                    <span className="text-brand-orange">ST</span> {!isMobile && (settings?.businessName?.includes("新泰") ? "新泰" : (settings?.businessName || "汽車傳動軸"))}
                </Link>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
                {session && (
                    <Link
                        href="/booking/my-bookings"
                        className="text-gray-300 hover:text-brand-orange text-sm font-bold transition-all hidden lg:block uppercase tracking-widest"
                    >
                        我的預約
                    </Link>
                )}

                <button
                    onClick={() => setIsWarrantyDialogOpen(true)}
                    className="flex items-center justify-center border border-brand-orange/50 text-brand-orange hover:bg-brand-orange hover:text-white w-10 h-10 sm:w-auto sm:px-5 sm:py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-[0_0_20px_rgba(255,107,0,0.1)]"
                    title="保固查詢"
                >
                    <ShieldCheck className="sm:hidden" size={20} />
                    <span className="hidden sm:inline">保固查詢</span>
                </button>

                <button
                    onClick={handleBooking}
                    className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2.5 md:px-5 md:py-2.5 rounded-xl font-bold text-[10px] md:text-sm transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] active:scale-95 hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] uppercase tracking-tighter sm:tracking-normal"
                >
                    <span className="sm:hidden">預約</span>
                    <span className="hidden sm:inline">預約維修</span>
                </button>

                <div className="flex items-center space-x-4 pl-4 border-l border-white/10">

                    {session ? (
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full border border-brand-orange/50 p-0.5" />
                                ) : (
                                    <UserCircle size={24} className="text-gray-300" />
                                )}
                                <span className="hidden md:block text-xs font-bold uppercase tracking-tight">{session.user?.name}</span>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                                title="登出"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("google", { redirectTo: "/" })}
                            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                        >
                            <UserCircle size={22} className="group-hover:text-brand-orange transition-colors" />
                            <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Login</span>
                        </button>
                    )}

                    {session?.user?.role === "ADMIN" && (
                        <Link
                            href="/admin"
                            className="text-gray-400 hover:text-brand-orange transition-all p-1 hover:rotate-90 hidden sm:block"
                        >
                            <Settings size={18} />
                        </Link>
                    )}
                </div>
            </div>
            <WarrantyLookupDialog
                isOpen={isWarrantyDialogOpen}
                onClose={() => setIsWarrantyDialogOpen(false)}
            />
        </nav>
    );
}
