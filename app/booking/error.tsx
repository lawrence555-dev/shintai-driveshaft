"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useLiff } from "@/components/providers/LiffProvider";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const searchParams = useSearchParams();
    const { isLiff } = useLiff();
    const isFrame = searchParams.get("view") === "frame";
    const shouldHideNavbar = isLiff || isFrame;

    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Booking Page Error:", error);
    }, [error]);

    return (
        <main className="min-h-screen bg-brand-light-gray">
            {!shouldHideNavbar && <Navbar />}

            <div className={`max-w-md mx-auto px-6 ${shouldHideNavbar ? 'py-10' : 'py-32'} text-center`}>
                <div className="bg-red-50 border border-red-100 p-8 rounded-3xl shadow-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <AlertCircle size={32} />
                    </div>

                    <h2 className="text-2xl font-black text-gray-800 mb-2">發生錯誤</h2>

                    <p className="text-gray-500 font-bold mb-6 text-sm break-all">
                        {error.message || "系統發生預期外的錯誤，請稍後再試。"}
                    </p>

                    {error.digest && (
                        <p className="text-xs text-gray-400 font-mono mb-6">
                            Error Ref: {error.digest}
                        </p>
                    )}

                    <button
                        onClick={reset}
                        className="w-full bg-brand-gray text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                    >
                        <RotateCcw size={18} />
                        重新載入頁面
                    </button>

                    <div className="mt-4">
                        <button
                            onClick={() => window.location.href = "/"}
                            className="text-gray-400 text-sm font-bold underline decoration-dotted underline-offset-4 hover:text-gray-600"
                        >
                            回首頁
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
