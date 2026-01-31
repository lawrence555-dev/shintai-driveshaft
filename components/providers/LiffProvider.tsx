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
        let isMounted = true;

        const initLiff = async () => {
            try {
                // IMPORTANT: Replace with your actual LIFF ID from LINE Developers Console
                const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID || "2009015961-l55v9gsk";

                if (!liffId) {
                    console.warn("LIFF ID not found in environment variables");
                    return;
                }

                // Prevent multiple inits if already initialized
                if (liff.id) {
                    if (isMounted) setIsLiff(liff.isInClient());
                    return;
                }

                await liff.init({ liffId });

                if (isMounted) {
                    if (liff.isInClient() || navigator.userAgent.includes("LIFF")) {
                        console.log("LIFF environment detected");
                        setIsLiff(true);

                        try {
                            if (liff.isLoggedIn()) {
                                const profile = await liff.getProfile();
                                setProfile(profile);
                            }
                        } catch (e) {
                            console.error("Failed to get LIFF profile", e);
                        }

                        // Auto-login logic:
                        if (status === "unauthenticated") {
                            console.log("Auto-logging in via LINE...");
                            // Check if we are already redirected or processed to avoid loops
                            await signIn("line");
                        }
                    }
                }
            } catch (error: any) {
                console.error("LIFF init failed", error);
                if (isMounted) setLiffError(error.toString());
            }
        };

        if (status !== "loading") {
            // Small delay to ensure widow/dom is ready in some webviews
            const timer = setTimeout(() => {
                initLiff();
            }, 100);
            return () => clearTimeout(timer);
        }

        return () => {
            isMounted = false;
        };
    }, [status]);

    return (
        <LiffContext.Provider value={{ isLiff, liffError, profile }}>
            {children}
        </LiffContext.Provider>
    );
}
