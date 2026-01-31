import { signIn, useSession } from "next-auth/react";

// ... context definition ...

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
                if (!liffId) return;

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
                }
            } catch (error: any) {
                console.error("LIFF init failed", error);
                setLiffError(error.toString());
            }
        };

        // Only run when status is settled
        if (status !== "loading") {
            initLiff();
        }
    }, [status]); // Re-run if status changes, but initLiff checks internally

    return (
        <LiffContext.Provider value={{ isLiff, liffError, profile }}>
            {children}
        </LiffContext.Provider>
    );
}
