import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                user: true,
                service: true,
            },
            orderBy: { date: "asc" },
        });
        return NextResponse.json(appointments);
    } catch (error) {
        console.error("獲取預約失敗:", error);
        return NextResponse.json({ error: "無法獲取預約資料" }, { status: 500 });
    }
}
