import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(services);
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, duration, price, warrantyMonths } = body;

        const newService = await prisma.service.create({
            data: {
                name,
                duration: parseInt(duration),
                price: parseInt(price),
                warrantyMonths: parseInt(warrantyMonths || "0"),
            },
        });

        return NextResponse.json(newService);
    } catch (error) {
        console.error("Failed to create service:", error);
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}
