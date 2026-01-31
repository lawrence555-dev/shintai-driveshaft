"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import liff from "@line/liff";

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
                } else {
                    // For debugging in browser
                    // setIsLiff(true); // Uncomment to test LIFF UI in browser
                }
            } catch (error: any) {
                console.error("LIFF init failed", error);
                setLiffError(error.toString());
            }
        };

        initLiff();
    }, []);

    return (
        <LiffContext.Provider value={{ isLiff, liffError, profile }}>
            {children}
        </LiffContext.Provider>
    );
}
