"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import liff from "@line/liff";
import { signIn, useSession } from "next-auth/react";

interface LiffContextType {
    isLiff: boolean;
    liffError: string | null;
    profile: any | null;
}

const LiffContext = createContext<LiffContextType>({
    isLiff: false,
    liffError: null,
    profile: null,
});

export const useLiff = () => useContext(LiffContext);

export function LiffProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [isLiff, setIsLiff] = useState(false);
    const [liffError, setLiffError] = useState<string | null>(null);
    const [profile, setProfile] = useState<any | null>(null);

    useEffect(() => {
        const initLiff = async () => {
            try {
                // IMPORTANT: Replace with your actual LIFF ID from LINE Developers Console
                const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID || "2009015961-l55v9gsk";
                if (!liffId) {
                    console.warn("LIFF ID not found in environment variables");
                    return;
                }

                await liff.init({ liffId });

                if (liff.isInClient() || navigator.userAgent.includes("LIFF")) {
                    console.log("LIFF environment detected");
                    setIsLiff(true);
                    const profile = await liff.getProfile();
                    setProfile(profile);

                    // Auto-login logic:
                    // Only trigger if specifically in LIFF app context (not just browser pretending)
                    // and strictly unauthenticated.
                    if (status === "unauthenticated") {
                        // Use redirect: true by default, but verify layout/loading states handle it.
                        console.log("Auto-logging in via LINE...");
                        await signIn("line");
                    }
                } else {
                    // For debugging in browser
                    // setIsLiff(true); // Uncomment to test LIFF UI in browser
                }
            } catch (error: any) {
                console.error("LIFF init failed", error);
                setLiffError(error.toString());
            }
        };

        // Only run when status is settled or if you want to run strictly once on mount (bracket empty)
        // But since we depend on `status` for auto-login, we check it.
        // If status is loading, wait.
        if (status !== "loading") {
            initLiff();
        }
    }, [status]);

    return (
        <LiffContext.Provider value={{ isLiff, liffError, profile }}>
            {children}
        </LiffContext.Provider>
    );
}
