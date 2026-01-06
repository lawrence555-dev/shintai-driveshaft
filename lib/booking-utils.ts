import { addDays, isSunday, startOfDay, isToday, addMinutes, isBefore } from "date-fns";

export interface TimeSlot {
    label: string;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
}

export const BOOKING_SLOTS: TimeSlot[] = [
    { label: "上午時段", startTime: "08:30", endTime: "10:30" },
    { label: "下午時段 (A)", startTime: "13:30", endTime: "15:30" },
    { label: "下午時段 (B)", startTime: "15:30", endTime: "17:30" },
];

// Get available dates (includes today if not Sunday)
export function getAvailableDates(daysCount: number = 14) {
    const dates = [];
    const today = startOfDay(new Date());

    // Include today if it's not Sunday
    if (!isSunday(today)) {
        dates.push(today);
    }

    for (let i = 1; i <= daysCount; i++) {
        const date = addDays(today, i);
        if (!isSunday(date)) {
            dates.push(date);
        }
    }
    return dates;
}

export function getSlotDateTime(date: Date, slot: TimeSlot) {
    const [hours, minutes] = slot.startTime.split(":").map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
}

// Check if a time slot has passed (with 60-minute buffer for staff scheduling)
// Returns true if current time is past 60 min before the slot's start time
export function isSlotPassed(date: Date, slot: TimeSlot): boolean {
    // Only check for today
    if (!isToday(date)) {
        return false;
    }

    const now = new Date();
    const slotDateTime = getSlotDateTime(date, slot);
    // 60-minute buffer - slot is "passed" if we're past 60 min before start time
    const cutoffTime = addMinutes(slotDateTime, -60);

    return isBefore(cutoffTime, now);
}


// Check if a date is Sunday (for disabling in UI)
export function isDateDisabled(date: Date): boolean {
    return isSunday(date);
}
