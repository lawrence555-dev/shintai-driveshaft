"use client";

import Link from "next/link";
import { Settings, UserCircle, LogOut } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import WarrantyLookupDialog from "./WarrantyLookupDialog";

import { useSettings } from "@/hooks/useSettings";

export default function Navbar() {
    const { settings } = useSettings();
    const { data: session } = useSession();
    const router = useRouter();
    const [isWarrantyDialogOpen, setIsWarrantyDialogOpen] = useState(false);

    const handleBooking = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!session) {
            signIn("google", { callbackUrl: "/booking" });
        } else {
            router.push("/booking");
        }
    };

    return (
        <nav className="bg-brand-gray text-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center space-x-2">
                <Link href="/" className="text-2xl font-black tracking-tighter hover:text-brand-orange transition-colors">
                    {settings?.businessName || "新泰汽車傳動軸"}
                </Link>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
                <button
                    onClick={() => setIsWarrantyDialogOpen(true)}
                    className="border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white px-4 py-2 rounded font-semibold transition-all active:scale-95 hidden sm:block"
                >
                    保固查詢
                </button>

                <button
                    onClick={handleBooking}
                    className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold transition-all shadow-lg active:scale-95"
                >
                    預約維修
                </button>

                <div className="flex items-center space-x-4">

                    {session ? (
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-500" />
                                ) : (
                                    <UserCircle size={24} className="text-gray-300" />
                                )}
                                <span className="hidden md:block text-sm font-medium">{session.user?.name}</span>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="登出"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <UserCircle size={24} />
                            <span className="hidden md:block text-sm font-medium">Google 登入</span>
                        </button>
                    )}

                    <Link
                        href="/admin"
                        className="text-gray-300 hover:text-white transition-colors p-1"
                    >
                        <Settings size={20} />
                    </Link>
                </div>
            </div>
            <WarrantyLookupDialog
                isOpen={isWarrantyDialogOpen}
                onClose={() => setIsWarrantyDialogOpen(false)}
            />
        </nav>

    );
}
