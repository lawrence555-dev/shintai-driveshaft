"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { format, isSameDay, startOfDay, endOfDay, addDays } from "date-fns";
import { zhTW } from "date-fns/locale";
import { BOOKING_SLOTS, getAvailableDates, TimeSlot, getSlotDateTime, isSlotPassed, isDateDisabled } from "@/lib/booking-utils";
import { validateLicensePlate, validatePhone } from "@/lib/validation";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/Select";
import { Calendar, Clock, Car, ChevronRight, CheckCircle2, AlertCircle, Phone, Hash, Wrench, Info } from "lucide-react";
import { createAppointment, getServices, getBookedSlots } from "./actions";

export default function BookingPage() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");
    const [carModel, setCarModel] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [dateExceptions, setDateExceptions] = useState<any[]>([]);
    const [plateError, setPlateError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);

    const availableDates = getAvailableDates(30);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getServices();
                setServices(data);
                const type = searchParams.get("type");
                if (type === "inspection") {
                    const inspectionService = data.find((s: any) => s.name.includes("檢查"));
                    if (inspectionService) setSelectedServiceId(inspectionService.id);
                    else if (data.length > 0) setSelectedServiceId(data[0].id);
                } else if (data.length > 0) {
                    setSelectedServiceId(data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch services:", err);
            }
        };
        fetchServices();

        const type = searchParams.get("type");
        if (type === "inspection") {
            setCarModel("[專業檢查] ");
        }
    }, [searchParams]);

    // Fetch booked slots when dates are loaded
    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (availableDates.length === 0) return;
            try {
                const start = startOfDay(availableDates[0]);
                const end = endOfDay(availableDates[availableDates.length - 1]);
                const { booked, exceptions } = await getBookedSlots(start, end);
                setBookedSlots(booked);
                setDateExceptions(exceptions);
            } catch (err) {
                console.error("Failed to fetch booked slots:", err);
            }
        };
        fetchBookedSlots();
    }, []);

    const isSlotBooked = (date: Date, slot: TimeSlot) => {
        const slotDateTime = getSlotDateTime(date, slot);
        return bookedSlots.some((booked) => new Date(booked).getTime() === slotDateTime.getTime());
    };

    const handleNextStep = () => {
        if (step === 1 && selectedDate && selectedSlot) setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedSlot) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const dateTime = getSlotDateTime(selectedDate, selectedSlot);
            await createAppointment({
                date: dateTime,
                carModel,
                licensePlate,
                phoneNumber,
                serviceId: selectedServiceId,
            });
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || "發生錯誤，請稍後再試。");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-brand-light-gray">
                <Navbar />
                <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold mb-2">預約成功！</h1>
                    <p className="text-gray-600 mb-8">
                        我們已收到您的預約。<br />
                        時間：{selectedDate && format(selectedDate, "yyyy/MM/dd (eee)", { locale: zhTW })} {selectedSlot?.startTime}<br />
                        車牌：{licensePlate}<br />
                        電話：{phoneNumber}
                    </p>
                    <button
                        onClick={() => window.location.href = "/"}
                        className="w-full bg-brand-gray text-white py-3 rounded-lg font-bold"
                    >
                        回首頁
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-brand-light-gray">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-bold text-brand-gray mb-4">預約維修服務</h1>
                    <p className="text-gray-500">請填寫以下資訊，我們將為您安排專屬修護時段</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-center mb-12 space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-brand-orange text-white' : 'bg-gray-200'}`}>1</div>
                    <div className="w-12 h-0.5 bg-gray-200"></div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-brand-orange text-white' : 'bg-gray-200'}`}>2</div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {step === 1 ? (
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Date Selection */}
                                <div>
                                    <h3 className="flex items-center text-lg font-bold mb-6">
                                        <Calendar className="mr-2 text-brand-orange" size={20} />
                                        選擇日期
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {availableDates.map((date) => {
                                            const disabled = isDateDisabled(date, dateExceptions);
                                            const exception = dateExceptions.find(e =>
                                                isSameDay(new Date(e.date), date)
                                            );

                                            return (
                                                <button
                                                    key={date.toISOString()}
                                                    disabled={disabled}
                                                    onClick={() => {
                                                        setSelectedDate(date);
                                                        setSelectedSlot(null);
                                                    }}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${disabled
                                                        ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-60"
                                                        : selectedDate && isSameDay(selectedDate, date)
                                                            ? "border-brand-orange bg-orange-50 text-brand-orange shadow-inner"
                                                            : "border-gray-50 hover:border-gray-200 text-brand-gray"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div className="text-xs opacity-60 uppercase font-bold">
                                                            {format(date, "eee", { locale: zhTW })}
                                                        </div>
                                                        {exception && (
                                                            <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${exception.isHoliday
                                                                    ? "bg-red-100 text-red-600"
                                                                    : "bg-blue-100 text-blue-600"
                                                                }`}>
                                                                {exception.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-xl font-black">
                                                        {format(date, "MM/dd")}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div>
                                    <h3 className="flex items-center text-lg font-bold mb-6">
                                        <Clock className="mr-2 text-brand-orange" size={20} />
                                        選擇時段
                                    </h3>
                                    <div className="space-y-4">
                                        {BOOKING_SLOTS.map((slot) => {
                                            const booked = selectedDate ? isSlotBooked(selectedDate, slot) : false;
                                            const passed = selectedDate ? isSlotPassed(selectedDate, slot) : false;
                                            const isDisabled = booked || passed || !selectedDate;

                                            return (
                                                <button
                                                    key={slot.startTime}
                                                    disabled={isDisabled}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center ${isDisabled
                                                        ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                                                        : selectedSlot?.startTime === slot.startTime
                                                            ? 'border-brand-orange bg-orange-50'
                                                            : 'border-gray-100 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="font-semibold">
                                                        {slot.label}
                                                        {booked && <span className="ml-2 text-xs text-red-500 font-bold">已預約</span>}
                                                        {!booked && passed && <span className="ml-2 text-xs text-gray-400 font-bold">時段已過</span>}
                                                    </div>
                                                    <div className={`font-bold font-mono ${isDisabled ? 'text-gray-400' : 'text-brand-orange'}`}>
                                                        {slot.startTime} - {slot.endTime}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
                                            提示：週日休息不提供預約。每時段僅限一台車輛，確保施工品質。今日過時時段不提供預約。
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex justify-end">
                                <button
                                    disabled={!selectedDate || !selectedSlot}
                                    onClick={handleNextStep}
                                    className="bg-brand-gray text-white px-8 py-3 rounded-lg font-bold flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-all"
                                >
                                    下一步：填寫資訊 <ChevronRight size={20} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 max-w-lg mx-auto">
                            <h3 className="flex items-center text-lg font-bold mb-8">
                                <Car className="mr-2 text-brand-orange" size={20} />
                                填寫車輛與聯絡資訊
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2">預約時段</label>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        {selectedDate && format(selectedDate, "yyyy/MM/dd (eee)", { locale: zhTW })} {selectedSlot?.startTime}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-brand-gray">
                                            <Wrench size={14} className="inline mr-1 text-brand-orange" />
                                            維修項目 <span className="text-red-500">*</span>
                                        </label>
                                        <Select.Root value={selectedServiceId} onValueChange={setSelectedServiceId}>
                                            <SelectTrigger>
                                                <Select.Value placeholder="請選擇維修項目" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {services.map((service) => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{service.name}</span>
                                                            <span className="text-sm opacity-70">({service.duration} 分鐘)</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select.Root>
                                        {/* 預計完工時間 */}
                                        {selectedServiceId && selectedSlot && (() => {
                                            const service = services.find((s: any) => s.id === selectedServiceId);
                                            if (!service) return null;
                                            const [hours, minutes] = selectedSlot.startTime.split(':').map(Number);
                                            const startMinutes = hours * 60 + minutes;
                                            const endMinutes = startMinutes + service.duration;
                                            const endHours = Math.floor(endMinutes / 60);
                                            const endMins = endMinutes % 60;
                                            const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
                                            return (
                                                <p className="mt-2 text-sm text-brand-orange font-bold flex items-center gap-1">
                                                    ⏱ 預計 {endTime} 完工
                                                </p>
                                            );
                                        })()}
                                    </div>


                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-brand-gray">
                                            <Car size={14} className="inline mr-1 text-brand-orange" />
                                            車型 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={carModel}
                                            onChange={(e) => setCarModel(e.target.value)}
                                            placeholder="例如：Toyota RAV4"
                                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-brand-orange outline-none transition-all bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-brand-gray">
                                            <Hash size={14} className="inline mr-1 text-brand-orange" />
                                            車牌號碼 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={licensePlate}
                                            onChange={(e) => {
                                                setLicensePlate(e.target.value.toUpperCase().replace(/[-\s]/g, ''));
                                                setPlateError(null);
                                            }}
                                            onBlur={() => {
                                                if (licensePlate) {
                                                    const err = validateLicensePlate(licensePlate);
                                                    setPlateError(err);
                                                }
                                            }}
                                            placeholder="例如：ABC1234"
                                            className={`w-full p-4 rounded-xl border-2 ${plateError ? 'border-red-400 bg-red-50' : 'border-gray-100 focus:border-brand-orange'} outline-none transition-all bg-white uppercase font-mono text-lg tracking-wider`}
                                        />
                                        {plateError ? (
                                            <p className="mt-1 text-xs text-red-500 font-bold">{plateError}</p>
                                        ) : (
                                            <p className="mt-1 text-xs text-gray-400">
                                                格式：3 英文 + 4 數字（新式）或 2 英文 + 4 數字（舊式），不含 I、O
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-brand-gray">
                                            <Phone size={14} className="inline mr-1 text-brand-orange" />
                                            聯絡電話 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                setPhoneNumber(e.target.value.replace(/[-\s]/g, ''));
                                                setPhoneError(null);
                                            }}
                                            onBlur={() => {
                                                if (phoneNumber) {
                                                    const err = validatePhone(phoneNumber);
                                                    setPhoneError(err);
                                                }
                                            }}
                                            placeholder="例如：0912345678"
                                            className={`w-full p-4 rounded-xl border-2 ${phoneError ? 'border-red-400 bg-red-50' : 'border-gray-100 focus:border-brand-orange'} outline-none transition-all bg-white font-mono`}
                                        />
                                        {phoneError ? (
                                            <p className="mt-1 text-xs text-red-500 font-bold">{phoneError}</p>
                                        ) : (
                                            <p className="mt-1 text-xs text-gray-400">
                                                格式：09 開頭，共 10 碼
                                            </p>
                                        )}
                                    </div>


                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center text-sm">
                                            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                                            {error}
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 border-2 border-gray-100 hover:border-gray-200 py-4 rounded-xl font-bold transition-all"
                                    >
                                        返回修改
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !licensePlate || !phoneNumber || !carModel || !!plateError || !!phoneError}
                                        className="flex-[2] bg-brand-orange hover:bg-orange-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
                                    >
                                        {isSubmitting ? "正在送出..." : "確認預約"}
                                    </button>

                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
