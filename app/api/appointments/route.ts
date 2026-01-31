import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        // @ts-ignore
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const appointments = await prisma.appointment.findMany({
            include: {
                user: { select: { name: true, email: true, image: true } },
                service: true
            },
            orderBy: { date: "desc" },
        });

        return NextResponse.json(appointments);
    } catch (error) {
        console.error("獲取預約失敗:", error);
        return NextResponse.json({ error: "無法獲取預約資料" }, { status: 500 });
    }
}
