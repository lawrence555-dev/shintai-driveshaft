import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface WarrantyResult {
    id: string;
    serviceName: string;
    repairDate: Date;
    carModel: string;
    licensePlate: string | null;
    warrantyUntil: Date | null;
    isActive: boolean;
    daysRemaining: number;
    customer: {
        id: string;
        name: string | null;
        phoneNumber: string;
    } | null;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const licensePlate = searchParams.get("licensePlate")?.trim();
    const phoneNumber = searchParams.get("phoneNumber")?.trim();

    // At least one search parameter required
    if (!licensePlate && !phoneNumber) {
        return NextResponse.json({ error: "請輸入車牌或電話" }, { status: 400 });
    }

    try {
        // Build search conditions - both must match (AND logic)
        const cleanPlate = licensePlate?.replace(/[-\s]/g, '').toUpperCase() || '';
        const cleanPhone = phoneNumber?.replace(/\D/g, '') || '';

        // Both conditions must be provided and match
        if (!cleanPlate || cleanPhone.length < 4) {
            return NextResponse.json({ count: 0, warranties: [] });
        }

        // Find all matching completed appointments with warranty
        // Both license plate AND phone must match
        const appointments = await prisma.appointment.findMany({
            where: {
                licensePlate: {
                    contains: cleanPlate,
                    mode: 'insensitive'
                },
                phoneNumber: {
                    endsWith: cleanPhone.slice(-4)
                },
                status: "COMPLETED",
                warrantyUntil: { not: null }
            },
            select: {
                id: true,
                date: true,
                carModel: true,
                licensePlate: true,
                phoneNumber: true,
                warrantyUntil: true,
                service: {
                    select: {
                        name: true,
                        warrantyMonths: true
                    }
                },
                vehicle: {
                    select: {
                        customer: {
                            select: {
                                id: true,
                                name: true,
                                phoneNumber: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                warrantyUntil: 'desc'
            }
        });

        // Transform results
        const now = new Date();
        const results: WarrantyResult[] = appointments.map(apt => ({
            id: apt.id,
            serviceName: apt.service.name,
            repairDate: apt.date,
            carModel: apt.carModel,
            licensePlate: apt.licensePlate,
            warrantyUntil: apt.warrantyUntil,
            isActive: apt.warrantyUntil ? apt.warrantyUntil > now : false,
            daysRemaining: apt.warrantyUntil
                ? Math.ceil((apt.warrantyUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                : 0,
            customer: apt.vehicle?.customer || null
        }));

        return NextResponse.json({
            count: results.length,
            warranties: results
        });
    } catch (error) {
        console.error("Warranty lookup failed:", error);
        return NextResponse.json({ error: "查詢失敗，請稍後再試" }, { status: 500 });
    }
}
