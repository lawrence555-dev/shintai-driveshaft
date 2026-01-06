import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    try {
        const customers = await prisma.customer.findMany({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { phoneNumber: { contains: search } },
                    { vehicles: { some: { licensePlate: { contains: search, mode: 'insensitive' } } } },
                    { vehicles: { some: { carModel: { contains: search, mode: 'insensitive' } } } },
                ]
            } : undefined,
            include: {
                vehicles: {
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { updatedAt: 'desc' },
            take: 100,
        });

        return NextResponse.json(customers);
    } catch (error) {
        console.error("Failed to fetch customers:", error);
        return NextResponse.json({ error: "查詢失敗" }, { status: 500 });
    }
}
