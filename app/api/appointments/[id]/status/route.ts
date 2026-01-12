import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { status, actualDuration } = await request.json();
        const { id } = await params;

        let warrantyUntil = undefined;
        if (status === "COMPLETED") {
            const appointment = await prisma.appointment.findUnique({
                where: { id },
                include: { service: true }
            });
            if (appointment?.service.warrantyMonths) {
                const now = new Date();
                warrantyUntil = new Date(now.setMonth(now.getMonth() + appointment.service.warrantyMonths));
            }
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: {
                status,
                ...(actualDuration && { actualDuration }),
                ...(warrantyUntil && { warrantyUntil })
            },
        });

        return NextResponse.json(updatedAppointment);
    } catch (error) {
        console.error("更新預約狀態失敗:", error);
        return NextResponse.json({ error: "無法更新預約狀態" }, { status: 500 });
    }
}
