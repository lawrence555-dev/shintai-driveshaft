import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Find all vehicles owned by this customer, then get their appointments
        const vehicles = await prisma.vehicle.findMany({
            where: { customerId: id },
            select: { id: true }
        });

        const vehicleIds = vehicles.map(v => v.id);

        const appointments = await prisma.appointment.findMany({
            where: {
                vehicleId: { in: vehicleIds }
            },
            include: {
                service: { select: { name: true } }
            },
            orderBy: { date: 'desc' }
        });

        return NextResponse.json(appointments);
    } catch (error) {
        console.error("Failed to fetch appointments:", error);
        return NextResponse.json({ error: "查詢失敗" }, { status: 500 });
    }
}
