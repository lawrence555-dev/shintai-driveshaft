import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, duration, price, warrantyMonths, isActive } = body;

        const updatedService = await prisma.service.update({
            where: { id },
            data: {
                name,
                duration: duration ? parseInt(duration.toString()) : undefined,
                price: price ? parseInt(price.toString()) : undefined,
                warrantyMonths: warrantyMonths ? parseInt(warrantyMonths.toString()) : undefined,
                isActive: isActive !== undefined ? isActive : undefined,
            },
        });

        return NextResponse.json(updatedService);
    } catch (error) {
        console.error("Failed to update service:", error);
        return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Soft delete by setting isActive to false
        const deletedService = await prisma.service.update({
            where: { id },
            data: { isActive: false },
        });
        return NextResponse.json(deletedService);
    } catch (error) {
        console.error("Failed to delete service:", error);
        return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
    }
}
