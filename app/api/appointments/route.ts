import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const status = searchParams.get("status");
    const hasWarranty = searchParams.get("hasWarranty") === "true";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const search = searchParams.get("search");

    try {
        const session = await auth();
        // @ts-ignore
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const where: any = {};
        if (status) where.status = status;
        if (hasWarranty) where.warrantyUntil = { not: null };
        if (from && to) {
            where.date = {
                gte: new Date(from),
                lte: new Date(to),
            };
        }

        if (search) {
            where.OR = [
                { licensePlate: { contains: search, mode: "insensitive" } },
                { carModel: { contains: search, mode: "insensitive" } }
            ];
        }

        // If pagination params are present, return paginated response
        if (pageParam || limitParam) {
            const page = parseInt(pageParam || "1");
            const limit = parseInt(limitParam || "20");
            const skip = (page - 1) * limit;

            const [appointments, total] = await Promise.all([
                prisma.appointment.findMany({
                    where,
                    include: {
                        user: { select: { name: true, email: true, image: true } },
                        service: true
                    },
                    orderBy: { date: "desc" },
                    skip,
                    take: limit,
                }),
                prisma.appointment.count({ where })
            ]);

            return NextResponse.json({
                data: appointments,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });
        }

        // Default behavior: return all (for Calendar)
        const appointments = await prisma.appointment.findMany({
            where,
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
