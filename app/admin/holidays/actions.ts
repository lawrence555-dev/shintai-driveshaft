"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface TaiwanCalendarDay {
    date: string;
    date_format: string;
    year: string;
    month: string;
    day: string;
    week: string;
    isHoliday: boolean;
    caption: string;
}

export async function syncHolidays(year?: number) {
    try {
        const session = await auth();
        // @ts-ignore
        if (session?.user?.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const currentYear = year || new Date().getFullYear();
        const yearsToSync = [currentYear, currentYear + 1];
        let totalSynced = 0;

        for (const y of yearsToSync) {
            try {
                console.log(`Syncing holidays for ${y}...`);
                const response = await fetch(`https://api.pin-yi.me/taiwan-calendar/${y}/`, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    }
                });

                if (!response.ok) {
                    console.log(`Fetch skipped for ${y}: ${response.status}`);
                    continue;
                }

                const data: TaiwanCalendarDay[] = await response.json();

                for (const day of data) {
                    const date = new Date(day.date_format);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                    const isSpecialHoliday = day.isHoliday && day.caption !== "";
                    const isWeekdayHoliday = day.isHoliday && !isWeekend;
                    const isMakeupDay = !day.isHoliday && isWeekend;

                    if (isSpecialHoliday || isWeekdayHoliday || isMakeupDay) {
                        // @ts-ignore
                        await prisma.holiday.upsert({
                            where: { date },
                            update: {
                                name: day.caption || (isMakeupDay ? "補班日" : "假日"),
                                isHoliday: day.isHoliday
                            },
                            create: {
                                date,
                                name: day.caption || (isMakeupDay ? "補班日" : "假日"),
                                isHoliday: day.isHoliday
                            }
                        });
                        totalSynced++;
                    }
                }
            } catch (err: any) {
                console.error(`Failed to sync year ${y}:`, err.message);
            }
        }

        try {
            revalidatePath("/admin/holidays");
            revalidatePath("/booking");
        } catch (e) { }

        return { success: true, count: totalSynced };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getHolidays() {
    try {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear - 1, 11, 30);

        // @ts-ignore
        const data = await prisma.holiday.findMany({
            orderBy: { date: "asc" },
            where: {
                date: {
                    gte: startDate
                }
            }
        });
        return { success: true, data };
    } catch (err: any) {
        console.error("getHolidays Error:", err);
        return { success: false, error: err.message };
    }
}

export async function addManualHoliday(date: Date, name: string, isHoliday: boolean) {
    try {
        const session = await auth();
        // @ts-ignore
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        // @ts-ignore
        const result = await prisma.holiday.upsert({
            where: { date },
            update: { name, isHoliday },
            create: { date, name, isHoliday }
        });

        revalidatePath("/admin/holidays");
        revalidatePath("/booking");
        return { success: true, data: result };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function toggleHolidayStatus(id: string) {
    try {
        const session = await auth();
        // @ts-ignore
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        // @ts-ignore
        const current = await prisma.holiday.findUnique({ where: { id } });
        if (!current) return { success: false, error: "Not found" };

        // @ts-ignore
        const result = await prisma.holiday.update({
            where: { id },
            data: { isHoliday: !current.isHoliday }
        });

        revalidatePath("/admin/holidays");
        revalidatePath("/booking");
        return { success: true, data: result };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteHoliday(id: string) {
    try {
        const session = await auth();
        // @ts-ignore
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        // @ts-ignore
        await prisma.holiday.delete({ where: { id } });

        revalidatePath("/admin/holidays");
        revalidatePath("/booking");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
