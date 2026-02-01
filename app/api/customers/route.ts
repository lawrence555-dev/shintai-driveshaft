import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    try {
        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { phoneNumber: { contains: search } },
                { vehicles: { some: { licensePlate: { contains: search, mode: 'insensitive' as const } } } },
                { vehicles: { some: { carModel: { contains: search, mode: 'insensitive' as const } } } },
            ]
        } : undefined;

        const [customers, total] = await Promise.all([
            prisma.customer.findMany({
                where,
                include: {
                    vehicles: {
                        orderBy: { createdAt: 'desc' }
                    }
                },
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.customer.count({ where })
        ]);

        return NextResponse.json({
            data: customers,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Failed to fetch customers:", error);
        return NextResponse.json({ error: "查詢失敗" }, { status: 500 });
    }
}
