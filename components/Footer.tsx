"use client";

import { useLiff } from "@/components/providers/LiffProvider";

export default function Footer() {
    const { isLiff } = useLiff();

    if (isLiff) return null;

    return (
        <footer className="py-8 text-center text-gray-400 text-xs">
            <p>&copy; {new Date().getFullYear()} 新泰汽車傳動軸. All rights reserved.</p>
        </footer>
    );
}
