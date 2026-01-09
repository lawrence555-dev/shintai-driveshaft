"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBlockedSlots() {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    return await prisma.blockedSlot.findMany({
        orderBy: { date: "desc" },
    });
}

export async function createBlockedSlot(date: Date, reason?: string) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    // Check if slot is already blocked
    const existing = await prisma.blockedSlot.findFirst({
        where: { date },
    });

    if (existing) {
        throw new Error("此時段已經被封鎖了。");
    }

    const blocked = await prisma.blockedSlot.create({
        data: {
            date,
            reason: reason || null,
        },
    });

    revalidatePath("/admin/blocked-slots");
    revalidatePath("/booking"); // Ensure booking page reflects the change
    return blocked;
}

export async function deleteBlockedSlot(id: string) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await prisma.blockedSlot.delete({
        where: { id },
    });

    revalidatePath("/admin/blocked-slots");
    revalidatePath("/booking");
    return { success: true };
}
