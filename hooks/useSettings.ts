"use client";

import { useState, useEffect } from "react";

interface Settings {
    businessName: string;
    phoneNumber: string;
    address: string;
    slotDuration: number;
    lineNotifyToken: string | null;
    lineOfficialAccountUrl: string | null;
}

let cachedSettings: Settings | null = null;
let listeners: Array<(s: Settings) => void> = [];

export function useSettings() {
    const [settings, setSettings] = useState<Settings | null>(cachedSettings);
    const [loading, setLoading] = useState(!cachedSettings);

    useEffect(() => {
        if (cachedSettings) {
            setLoading(false);
            return;
        }

        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                cachedSettings = data;
                setSettings(data);
                listeners.forEach(l => l(data));
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setLoading(false);
            }
        };

        const onSettingsUpdate = (s: Settings) => setSettings(s);
        listeners.push(onSettingsUpdate);

        fetchSettings();

        return () => {
            listeners = listeners.filter(l => l !== onSettingsUpdate);
        };
    }, []);

    return { settings, loading };
}
