import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // @ts-ignore
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params; // Await params to get the id
        const { status, actualDuration } = await req.json();

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
