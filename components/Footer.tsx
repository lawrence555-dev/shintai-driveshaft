"use client";

import { useLiff } from "@/components/providers/LiffProvider";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FooterContent() {
    const { isLiff } = useLiff();
    const searchParams = useSearchParams();

    if (isLiff || searchParams.get("view") === "frame") return null;

    return (
        <footer className="py-8 text-center text-gray-400 text-xs">
            <p>&copy; {new Date().getFullYear()} 新泰汽車傳動軸. All rights reserved.</p>
        </footer>
    );
}

export default function Footer() {
    return (
        <Suspense fallback={null}>
            <FooterContent />
        </Suspense>
    );
}
