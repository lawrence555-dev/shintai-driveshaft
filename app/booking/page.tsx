"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { format, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addMonths, subMonths, isToday as isTodayFns, startOfDay, endOfDay } from "date-fns";
import { zhTW } from "date-fns/locale";
import { BOOKING_SLOTS, getAvailableDates, TimeSlot, getSlotDateTime, isSlotPassed, isDateDisabled } from "@/lib/booking-utils";
import { validateLicensePlate, validatePhone } from "@/lib/validation";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/Select";
import { Calendar, Clock, Car, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Phone, Hash, Wrench, Info, X } from "lucide-react";
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
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

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

    // Fetch booked slots and holidays when month changes
    useEffect(() => {
        const fetchMonthData = async () => {
            try {
                const monthStart = startOfMonth(currentMonth);
                const monthEnd = endOfMonth(currentMonth);
                const { booked, exceptions } = await getBookedSlots(monthStart, monthEnd);
                setBookedSlots(booked);
                setDateExceptions(exceptions);
            } catch (err) {
                console.error("Failed to fetch month data:", err);
            }
        };
        fetchMonthData();
    }, [currentMonth]);

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

            <div className="max-w-4xl mx-auto px-6 py-28 md:py-32">
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
                                {/* Monthly Calendar Selection */}
                                <div className="md:col-span-2">
                                    <h3 className="flex items-center text-lg font-bold mb-6">
                                        <Calendar className="mr-2 text-brand-orange" size={20} />
                                        選擇日期
                                    </h3>

                                    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100">
                                        <div className="flex items-center justify-between mb-8 px-2">
                                            <button
                                                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                                className="p-2 hover:bg-white rounded-full transition-colors"
                                            >
                                                <ChevronLeft size={24} className="text-brand-gray" />
                                            </button>
                                            <h4 className="text-xl font-black text-brand-gray uppercase tracking-tighter">
                                                {format(currentMonth, "yyyy MMMM", { locale: zhTW })}
                                            </h4>
                                            <button
                                                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                                className="p-2 hover:bg-white rounded-full transition-colors"
                                            >
                                                <ChevronRight size={24} className="text-brand-gray" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 sm:gap-3">
                                            {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                                                <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase py-2">
                                                    {day}
                                                </div>
                                            ))}

                                            {(() => {
                                                const start = startOfWeek(startOfMonth(currentMonth));
                                                const end = endOfWeek(endOfMonth(currentMonth));
                                                const days = eachDayOfInterval({ start, end });

                                                return days.map((date) => {
                                                    const isCurrentMonth = isSameMonth(date, currentMonth);
                                                    const disabled = !isCurrentMonth || isDateDisabled(date, dateExceptions) || (startOfDay(date) < startOfDay(new Date()));
                                                    const isToday = isTodayFns(date);
                                                    const isSelected = selectedDate && isSameDay(selectedDate, date);

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
                                                                setIsSlotModalOpen(true);
                                                            }}
                                                            className={`
                                                                relative aspect-square sm:aspect-auto sm:h-24 p-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-center
                                                                ${!isCurrentMonth ? "opacity-0 pointer-events-none" : ""}
                                                                ${disabled
                                                                    ? "bg-gray-50/50 border-transparent text-gray-300 cursor-not-allowed"
                                                                    : isSelected
                                                                        ? "bg-brand-orange border-brand-orange text-white shadow-lg shadow-orange-100 scale-105 z-10"
                                                                        : "bg-white border-white hover:border-brand-orange/30 text-brand-gray shadow-sm"
                                                                }
                                                                ${isToday && !isSelected ? "ring-2 ring-brand-orange ring-offset-2" : ""}
                                                            `}
                                                        >
                                                            <span className="text-lg sm:text-2xl font-black tracking-tighter">
                                                                {format(date, "d")}
                                                            </span>

                                                            {exception && (
                                                                <span className={`
                                                                    text-[9px] font-black px-1.5 py-0.5 rounded-full mt-1
                                                                    ${exception.isHoliday
                                                                        ? isSelected ? "bg-white/20 text-white" : "bg-red-50 text-red-600 border border-red-100"
                                                                        : isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600 border border-blue-100"
                                                                    }
                                                                `}>
                                                                    {exception.isHoliday ? "休" : "補"}
                                                                </span>
                                                            )}

                                                            {isSelected && !disabled && (
                                                                <div className="absolute top-1 right-1">
                                                                    <CheckCircle2 size={12} className="text-white" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                });
                                            })()}
                                        </div>

                                        <div className="mt-8 flex flex-wrap gap-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">公休日</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></div>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">補班日</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-white border-2 border-brand-orange ring-1 ring-brand-orange ring-offset-1"></div>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">今日</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

            {/* Time Slot Selection Modal */}
            {
                isSlotModalOpen && selectedDate && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                        <div className="absolute inset-0 bg-brand-gray/80 backdrop-blur-sm" onClick={() => setIsSlotModalOpen(false)}></div>
                        <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="bg-brand-gray p-8 text-white relative">
                                <button onClick={() => setIsSlotModalOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                                    <X size={28} />
                                </button>
                                <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">選擇預約時段</h2>
                                <p className="text-brand-orange font-black flex items-center gap-2">
                                    <Calendar size={18} />
                                    {format(selectedDate, "yyyy/MM/dd (EEEE)", { locale: zhTW })}
                                </p>
                            </div>

                            <div className="p-8 space-y-4">
                                {BOOKING_SLOTS.map((slot) => {
                                    const booked = isSlotBooked(selectedDate, slot);
                                    const passed = isSlotPassed(selectedDate, slot);
                                    const isDisabled = booked || passed;

                                    return (
                                        <button
                                            key={slot.startTime}
                                            disabled={isDisabled}
                                            onClick={() => {
                                                setSelectedSlot(slot);
                                                setIsSlotModalOpen(false);
                                                setStep(2);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`w-full p-6 rounded-2xl border-4 transition-all flex justify-between items-center group ${isDisabled
                                                ? 'border-gray-50 bg-gray-50 cursor-not-allowed opacity-40'
                                                : 'border-gray-100 hover:border-brand-orange bg-white hover:scale-[1.02]'
                                                }`}
                                        >
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-brand-orange transition-colors">
                                                    {slot.label}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-2xl font-black text-brand-gray tracking-tighter">
                                                        {slot.startTime}
                                                    </p>
                                                    <span className="text-gray-300">→</span>
                                                    <p className="text-2xl font-black text-gray-400 tracking-tighter">
                                                        {slot.endTime}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                {booked ? (
                                                    <span className="bg-red-50 text-red-600 text-xs font-black px-3 py-1.5 rounded-full border border-red-100">已額滿</span>
                                                ) : passed ? (
                                                    <span className="bg-gray-100 text-gray-400 text-xs font-black px-3 py-1.5 rounded-full">已過時</span>
                                                ) : (
                                                    <ChevronRight size={28} className="text-gray-200 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}

                                <div className="mt-8 p-4 bg-brand-light-gray rounded-2xl flex gap-3 items-start">
                                    <Info className="text-brand-orange shrink-0 mt-0.5" size={18} />
                                    <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                                        提示：每時段僅限一台車輛進場，由異音專家本人親自施工，確保精密平衡品質。若有緊急維修需求，請直接來電洽詢。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </main >
    );
}
