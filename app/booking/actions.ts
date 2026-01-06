"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
    validateLicensePlate,
    validatePhone,
    normalizeLicensePlate,
    normalizePhone
} from "@/lib/validation";

export async function getServices() {
    return await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    });
}

// Get booked slots for a specific date range
export async function getBookedSlots(startDate: Date, endDate: Date) {
    const appointments = await prisma.appointment.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate,
            },
            status: { not: "CANCELLED" },
        },
        select: {
            date: true,
        },
    });
    return appointments.map((a: { date: Date }) => a.date.toISOString());
}

export async function createAppointment(formData: {
    date: Date;
    carModel: string;
    licensePlate: string;
    phoneNumber: string;
    customerName?: string;
    serviceId?: string;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // Validate required fields
    if (!formData.carModel?.trim()) {
        throw new Error("請填寫車型");
    }

    // Validate license plate with strict regex
    const plateError = validateLicensePlate(formData.licensePlate);
    if (plateError) {
        throw new Error(plateError);
    }

    // Validate phone number
    const phoneError = validatePhone(formData.phoneNumber);
    if (phoneError) {
        throw new Error(phoneError);
    }

    // Normalize data for storage
    const normalizedPlate = normalizeLicensePlate(formData.licensePlate);
    const normalizedPhone = normalizePhone(formData.phoneNumber);
    const carModelTrimmed = formData.carModel.trim();

    // Check if slot is already taken
    const existing = await prisma.appointment.findFirst({
        where: {
            date: formData.date,
            status: { not: "CANCELLED" },
        },
    });

    if (existing) {
        throw new Error("該時段已被預約，請選擇其他時段。");
    }

    // Find or create customer by phone number
    let customer = await prisma.customer.findUnique({
        where: { phoneNumber: normalizedPhone },
    });

    if (!customer) {
        // Create new customer
        customer = await prisma.customer.create({
            data: {
                phoneNumber: normalizedPhone,
                name: formData.customerName?.trim() || null,
            },
        });
    } else if (formData.customerName?.trim() && !customer.name) {
        // Update customer name if provided and not set
        customer = await prisma.customer.update({
            where: { id: customer.id },
            data: { name: formData.customerName.trim() },
        });
    }

    // Find or create vehicle by license plate
    let vehicle = await prisma.vehicle.findUnique({
        where: { licensePlate: normalizedPlate },
    });

    if (!vehicle) {
        // Create new vehicle linked to customer
        vehicle = await prisma.vehicle.create({
            data: {
                licensePlate: normalizedPlate,
                carModel: carModelTrimmed,
                customerId: customer.id,
            },
        });
    } else if (vehicle.carModel !== carModelTrimmed) {
        // Update vehicle carModel if changed
        vehicle = await prisma.vehicle.update({
            where: { id: vehicle.id },
            data: { carModel: carModelTrimmed },
        });
    }

    // Default service if not provided
    let serviceId = formData.serviceId;
    if (!serviceId) {
        let service = await prisma.service.findFirst({ where: { isActive: true } });
        if (!service) {
            service = await prisma.service.create({
                data: { name: "一般維修", duration: 120 },
            });
        }
        serviceId = service.id;
    }

    const appointment = await prisma.appointment.create({
        data: {
            date: formData.date,
            carModel: carModelTrimmed,
            licensePlate: normalizedPlate,
            phoneNumber: normalizedPhone,
            userId: session.user.id as string,
            serviceId: serviceId,
            vehicleId: vehicle.id,
        },
    });

    revalidatePath("/booking");
    revalidatePath("/admin");
    revalidatePath("/admin/customers");
    return appointment;
}
