"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Calendar, Clock, Car, Hash, XCircle, Loader2, AlertCircle, MessageCircle } from "lucide-react";
import { getUserBookings, cancelAppointment } from "../actions";
import { toast } from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";
import { useSettings } from "@/hooks/useSettings";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSplash from "@/components/LoadingSplash";
import { useLiff } from "@/components/providers/LiffProvider";

function MyBookingsContent() {
    const { settings } = useSettings();
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { isLiff } = useLiff();

    // Check visibility params strictly
    const isFrame = searchParams.get("view") === "frame";
    const shouldHideNavbar = isLiff || isFrame;

    useEffect(() => {
        if (status === "unauthenticated") {
            const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
            currentParams.delete("callbackUrl");

            const returnUrl = `/booking/my-bookings?${currentParams.toString()}`;
            const loginUrl = new URL("/login", window.location.origin);
            loginUrl.searchParams.set("callbackUrl", returnUrl);

            if (currentParams.has("view")) {
                loginUrl.searchParams.set("view", currentParams.get("view")!);
            }

            router.push(loginUrl.toString());
        }
    }, [status, router, searchParams]);

    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    const fetchBookings = async () => {
        try {
            const data = await getUserBookings();
            setBookings(data);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
            toast.error("讀取預約紀錄失敗");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchBookings();
        }
    }, [session]);

    const handleCancelClick = (id: string) => {
        setSelectedBookingId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedBookingId) return;

        const id = selectedBookingId;

        setCancellingId(id);
        try {
            await cancelAppointment(id);
            toast.success("預約已取消");
            fetchBookings();
        } catch (err: any) {
            toast.error(err.message || "取消失敗");
        } finally {
            setCancellingId(null);
        }
    };

    // Initial Loading State or Unauthenticated (while redirecting)
    if (status === "loading" || status === "unauthenticated" || (status === "authenticated" && loading)) {
        return <LoadingSplash message="預約紀錄讀取中..." />;
    }

    if (!session) return null; // Wait for redirect

    return (
        <main className="min-h-screen bg-brand-light-gray pb-20">
            {!shouldHideNavbar && <Navbar />}

            <div className={`max-w-xl mx-auto px-6 ${shouldHideNavbar ? 'py-6 md:py-10' : 'py-28 md:py-32'}`}>
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-brand-gray mb-4">我的預約紀錄</h1>
                    <p className="text-gray-500 italic">僅顯示即將到來且可取消的預約</p>
                </header>

                <div className="space-y-6">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-brand-orange transition-all relative overflow-hidden group">
                                <div className="absolute top-0 right-0 bg-brand-orange/10 px-4 py-1 rounded-bl-2xl text-[10px] font-black text-brand-orange uppercase tracking-widest text-white">
                                    {booking.status === "PENDING" ? "待店家確認" : "已核准預約"}
                                </div>

                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex flex-col items-center justify-center text-brand-orange shrink-0">
                                        <span className="text-[10px] font-bold opacity-60">DAY</span>
                                        <span className="text-2xl font-black">{format(new Date(booking.date), "dd")}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400">{format(new Date(booking.date), "yyyy/MM/dd (eee)", { locale: zhTW })}</p>
                                        <p className="text-xl font-black text-brand-gray tracking-tight">{booking.carModel}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                        <Clock size={16} className="text-brand-orange" /> {format(new Date(booking.date), "HH:mm")}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                        <Wrench size={16} className="text-brand-orange" /> {booking.service?.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 col-span-2">
                                        <Hash size={16} className="text-brand-orange" /> {booking.licensePlate}
                                    </div>
                                </div>

                                <button
                                    disabled={cancellingId === booking.id}
                                    onClick={() => handleCancelClick(booking.id)}
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-50 text-gray-400 font-bold hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100 group-hover:border-red-100"
                                >
                                    {cancellingId === booking.id ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <XCircle size={18} />
                                    )}
                                    取消此筆預約
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white/50 border-4 border-dashed border-gray-200 rounded-[3rem] p-16 text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                <Calendar size={40} />
                            </div>
                            <p className="text-gray-400 font-bold text-lg">目前沒有可取消的預約紀錄</p>
                            <button
                                onClick={() => window.location.href = "/booking"}
                                className="bg-brand-gray text-white px-8 py-3 rounded-full font-bold hover:bg-brand-orange transition-all shadow-lg active:scale-95"
                            >
                                現在就去預約
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-12 space-y-6">
                    {settings?.lineOfficialAccountUrl && (
                        <a
                            href={settings.lineOfficialAccountUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-[#06C755] hover:bg-[#05b34c] text-white p-6 rounded-2xl flex items-center justify-between shadow-lg shadow-green-100 transition-all active:scale-95 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-3 rounded-full">
                                    <MessageCircle size={24} className="fill-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-lg">加入官方 LINE 帳號</p>
                                    <p className="text-xs font-bold opacity-80">接收預約提醒、專屬優惠不漏接！</p>
                                </div>
                            </div>
                            <div className="bg-white text-[#06C755] px-4 py-2 rounded-xl text-sm font-black group-hover:bg-white/90">
                                立即加入
                            </div>
                        </a>
                    )}

                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                        <AlertCircle className="text-amber-500 shrink-0 mt-1" size={20} />
                        <div className="text-xs text-amber-700 leading-relaxed font-bold">
                            <p className="mb-1 uppercase tracking-widest text-[10px] opacity-60">溫馨提示</p>
                            若您因為臨時行程變更無法前來，請務必於預約時間前取消，讓其他車隊好友能使用該時段。若有任何疑問，歡迎撥打 0979-293-225 直接聯絡老闆。
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmCancel}
                title="確定要取消預約嗎？"
                message="取消後該時段將釋出給其他車友，若您之後需要此時段可能已被預約。"
                confirmText="確認取消"
                cancelText="先不要"
            />
        </main>
    );
}

// Minimal Wrench icon replacement since Lucide may not have it exactly or I missed it
function Wrench({ size, className }: { size: number, className: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    );
}

export default function MyBookingsPage() {
    return (
        <Suspense fallback={<LoadingSplash message="系統載入中..." />}>
            <MyBookingsContent />
        </Suspense>
    );
}
