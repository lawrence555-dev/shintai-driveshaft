"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import { useLiff } from "@/components/providers/LiffProvider";
import LoginSkeleton from "@/components/skeletons/LoginSkeleton";

import { Loader2, AlertCircle } from "lucide-react";

function LoginContent() {
    const { settings } = useSettings();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState<"google" | "line" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { isLiff, isInitialized } = useLiff();

    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const urlError = searchParams.get("error");

    // Check for view=frame param to potentially adjust UI (though typically login page is full screen anyway)
    // We mainly want to ensure we don't flash unnecessary elements if we are auto-logging in.

    useEffect(() => {
        if (urlError) {
            if (urlError === "OAuthAccountNotLinked") {
                setError("此 Email 已被另一個帳號使用，請使用原本的方式登入。");
            } else {
                setError("登入失敗，請稍後再試。");
            }
        }
    }, [urlError]);

    // Auto-login effect
    useEffect(() => {
        if (isLiff && !isLoading && !urlError) {
            console.log("LoginPage: LIFF detected, auto-clicking LINE login...");
            handleLogin("line");
        }
    }, [isLiff, urlError]);

    const handleLogin = async (provider: "google" | "line") => {
        setIsLoading(provider);
        setError(null);
        try {
            await signIn(provider, { callbackUrl });
        } catch (err) {
            console.error(err);
            setError("發生未預期的錯誤");
            setIsLoading(null);
        }
    };

    // If initializing (checking if LIFF) or if it IS LIFF (auto-login proceeding),
    // show Skeleton to prevent Flash of content.
    if (!isInitialized || isLiff) {
        return <LoginSkeleton />;
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-orange/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12 overflow-hidden relative">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex justify-center items-center w-16 h-16 bg-brand-orange rounded-2xl shadow-lg mb-6 text-white font-black text-2xl">
                            ST
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">歡迎回來</h1>
                        <p className="text-gray-400 text-sm">
                            {settings?.businessName || "新泰汽車傳動軸"} 線上預約系統
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 text-sm">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Login Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={() => handleLogin("line")}
                            disabled={isLoading !== null}
                            className="w-full h-14 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            {isLoading === "line" ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    {/* Simple Line Icon */}
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M21.16 8.35c-1.1-3.66-4.93-5.38-8.2-5.35-3.69-.04-8.08 1.63-8.89 6.27-.67 3.82 2.01 7.25 5.22 8.31.57.19.86.53.53 1.25-.09.33-.29 1.14-.54 1.76-.39.81-.69 1.94 1.22 1.34 2.89-.66 5.86-2.9 8.16-4.8 2.01-1.74 3.73-4.59 2.5-8.78zm-13.88 5h-1.33c-.15 0-.27-.12-.27-.27v-3.79c0-.15.12-.27.27-.27H6c.15 0 .27.12.27.27v3.79c-.01.16-.13.27-.28.27zm3.17 0h-1.33c-.15 0-.27-.12-.27-.27v-3.79c0-.15.12-.27.27-.27h1.33c.15 0 .27.12.27.27v3.79c0 .16-.12.27-.27.27zm4.27 0h-1.34c-.15 0-.27-.12-.27-.27v-1.87h-.01L11.5 13.2c-.06.08-.14.12-.23.12h-.03c-.09 0-.17-.04-.23-.11-.06-.06-.09-.15-.09-.23v-3.79c0-.15.12-.27.27-.27h1.33c.15 0 .27.12.27.27v1.89l1.62-2.03c.06-.08.14-.12.23-.12h.03c.09 0 .17.04.23.11.06.06.09.15.09.23v3.79c-.01.16-.13.27-.28.27zm4.22 0h-2.58c-.15 0-.27-.12-.27-.27v-3.79c0-.15.12-.27.27-.27h2.58c.15 0 .27.12.27.27.15 0 .27.12.27.27H19.2v1.27h1.44c.15 0 .27.12.27.27.15 0 .27.12.27.27H19.2v1.27h1.44c.15 0 .27.12.27.27 0 .16-.12.27-.27.27z" />
                                    </svg>
                                    <span>使用 LINE 登入</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => handleLogin("google")}
                            disabled={isLoading !== null}
                            className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                        >
                            {isLoading === "google" ? (
                                <Loader2 className="animate-spin text-gray-600" />
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span>使用 Google 登入</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-xs">
                            登入即代表您同意我們的{" "}
                            <Link href="#" className="text-white hover:underline underline-offset-2">服務條款</Link> 與{" "}
                            <Link href="#" className="text-white hover:underline underline-offset-2">隱私權政策</Link>
                        </p>
                        <Link href="/" className="inline-block mt-4 text-brand-orange hover:text-orange-300 text-sm font-bold transition-colors">
                            ← 回到首頁
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginSkeleton />}>
            <LoginContent />
        </Suspense>
    );
}
