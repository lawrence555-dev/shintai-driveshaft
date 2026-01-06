import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                vehicles: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!customer) {
            return NextResponse.json({ error: "客戶不存在" }, { status: 404 });
        }

        return NextResponse.json(customer);
    } catch (error) {
        console.error("Failed to fetch customer:", error);
        return NextResponse.json({ error: "查詢失敗" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const body = await request.json();
        const { name, notes } = body;

        const customer = await prisma.customer.update({
            where: { id },
            data: {
                name: name || null,
                notes: notes || null,
            },
            include: {
                vehicles: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error("Failed to update customer:", error);
        return NextResponse.json({ error: "更新失敗" }, { status: 500 });
    }
}
