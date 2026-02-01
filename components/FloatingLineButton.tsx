"use client";

import { useSettings } from "@/hooks/useSettings";
import { MessageCircle } from "lucide-react";

export default function FloatingLineButton() {
    const { settings } = useSettings();

    // Only show if setting exists
    if (!settings?.lineOfficialAccountUrl) return null;

    return (
        <a
            href={settings.lineOfficialAccountUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 bg-[#06C755] hover:bg-[#05b34c] text-white p-4 rounded-full shadow-lg shadow-green-100 transition-all hover:scale-110 active:scale-95 flex items-center gap-3 group overflow-hidden"
            title="聯絡官方 LINE"
        >
            <MessageCircle size={28} className="fill-white" />
            <span className="font-bold max-w-0 group-hover:max-w-[100px] transition-all duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                聯絡我們
            </span>

            {/* Ping animation */}
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
        </a>
    );
}
