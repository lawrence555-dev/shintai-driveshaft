import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
        let settings = await prisma.settings.findUnique({
            where: { id: "default" },
        });

        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    id: "default",
                    businessName: "新泰汽車傳動軸",
                    phoneNumber: "0979 293 225",
                    address: "525 彰化縣竹塘鄉光明路 525 號竹田巷 17 之 8 號",
                    slotDuration: 120,
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        // @ts-ignore
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { businessName, phoneNumber, address, slotDuration, lineNotifyToken, lineOfficialAccountUrl } = body;

        const settings = await prisma.settings.upsert({
            where: { id: "default" },
            update: {
                businessName,
                phoneNumber,
                address,
                slotDuration,
                lineNotifyToken,
                lineOfficialAccountUrl,
            },
            create: {
                id: "default",
                businessName: businessName || "新泰汽車傳動軸",
                phoneNumber: phoneNumber || "0979 293 225",
                address: address || "525 彰化縣竹塘鄉光明路 525 號竹田巷 17 之 8 號",
                slotDuration: slotDuration || 120,
                lineNotifyToken,
                lineOfficialAccountUrl,
            },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Failed to update settings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
