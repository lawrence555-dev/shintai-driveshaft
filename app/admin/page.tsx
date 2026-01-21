"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import zhTwLocale from "@fullcalendar/core/locales/zh-tw";
import AppointmentDetailModal from "@/components/admin/AppointmentDetailModal";
import CompleteAppointmentModal from "@/components/admin/CompleteAppointmentModal";
import { Loader2, Calendar as CalendarIcon, Search, Filter, Phone, Hash, Clock, CheckCircle, Package, AlertCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

export default function AdminDashboard() {
    const calendarRef = useRef<any>(null);
    const [calendarTitle, setCalendarTitle] = useState("");
    const [currentView, setCurrentView] = useState("timeGridWeek");
    const [appointments, setAppointments] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

    // Filtering & Search states
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "#EAB308"; // Yellow-500
            case "CONFIRMED": return "#2563EB"; // Blue-600
            case "COMPLETED": return "#10B981"; // Green-500
            case "CANCELLED": return "#EF4444"; // Red-500
            default: return "#2D2D2D";
        }
    };

    const transformEvents = (data: any[]) => {
        return data.map((app) => ({
            id: app.id,
            title: `${app.user?.name || "客戶"} - ${app.licensePlate || "無車牌"}`,
            start: app.date,
            end: new Date(new Date(app.date).getTime() + (app.service?.duration || 120) * 60000).toISOString(),
            backgroundColor: getStatusColor(app.status),
            borderColor: "transparent",
            extendedProps: { ...app },
        }));
    };

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/appointments");
            if (!res.ok) throw new Error("API 錯誤");
            const data = await res.json();

            if (Array.isArray(data)) {
                setAppointments(transformEvents(data));
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Derived filtered data
    const filteredAppointments = useMemo(() => {
        return appointments.filter(app => {
            const data = app.extendedProps;
            const matchesStatus = statusFilter ? data.status === statusFilter : true;
            const matchesSearch = searchQuery
                ? (data.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    data.phoneNumber?.includes(searchQuery))
                : true;
            return matchesStatus && matchesSearch;
        }).sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
    }, [appointments, statusFilter, searchQuery]);

    const handleEventClick = (info: any) => {
        setSelectedAppointment(info.event.extendedProps);
        setIsDetailModalOpen(true);
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (newStatus === "COMPLETED") {
            const app = appointments.find(a => a.id === id);
            setSelectedAppointment(app.extendedProps);
            setIsCompleteModalOpen(true);
            return;
        }

        try {
            const res = await fetch(`/api/appointments/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) fetchAppointments();
        } catch (error) {
            console.error("更新失敗:", error);
        }
    };

    return (
        <div className="space-y-12">
            <header className="space-y-4 md:space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-brand-gray tracking-tighter uppercase leading-none">
                    <span className="text-brand-orange">SYSTEM</span> CONTROL
                </h1>
                <p className="text-sm md:text-xl text-gray-400 font-bold font-mono tracking-tight uppercase">Driveshaft Management Command Center</p>
            </header>

            {/* Bento Grid Showcase for Stats */}
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3 md:gap-4 mb-10">
                {[
                    { id: "PENDING", label: "PENDING", color: "from-yellow-500/20 to-yellow-600/5", icon: AlertCircle, iconColor: "text-yellow-500", size: "col-span-2" },
                    { id: "CONFIRMED", label: "CONFIRMED", color: "from-blue-500/20 to-blue-600/5", icon: CheckCircle, iconColor: "text-blue-500", size: "col-span-2" },
                    { id: "COMPLETED", label: "COMPLETED", color: "from-emerald-500/20 to-emerald-600/5", icon: Package, iconColor: "text-emerald-500", size: "col-span-2" },
                    { id: "CANCELLED", label: "CANCELLED", color: "from-rose-500/20 to-rose-600/5", icon: X, iconColor: "text-rose-500", size: "col-span-2" },
                    { id: null, label: "TOTAL_LOAD", color: "from-brand-gray/20 to-brand-gray/5", icon: CalendarIcon, iconColor: "text-white", size: "col-span-4 md:col-span-1" },
                ].map((stat) => (
                    <button
                        key={stat.label}
                        onClick={() => setStatusFilter(stat.id)}
                        className={`p-4 rounded-3xl border border-white/5 transition-all duration-500 group relative overflow-hidden backdrop-blur-md bg-gradient-to-br ${stat.color} ${stat.size} ${statusFilter === stat.id
                            ? "ring-2 ring-brand-orange/40 scale-[0.98] border-brand-orange/20"
                            : "hover:scale-[1.02] hover:border-white/10"
                            }`}
                    >
                        <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">{stat.label}</p>
                                <stat.icon size={14} className={`${stat.iconColor} opacity-50 group-hover:opacity-100 transition-opacity`} />
                            </div>
                            <p className="text-3xl md:text-4xl font-black text-brand-gray tracking-tighter font-mono leading-none flex items-baseline gap-1">
                                {String(stat.id ? appointments.filter(e => e.extendedProps.status === stat.id).length : appointments.length).padStart(2, '0')}
                                <span className="text-xs text-gray-400 font-normal">units</span>
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
                {/* Left: Calendar (2/3) */}
                <div className="xl:col-span-2 flex flex-col xl:sticky xl:top-32">
                    <div className="bg-white/70 backdrop-blur-xl p-4 md:p-8 rounded-[2.5rem] shadow-2xl border border-white flex-1 relative overflow-hidden flex flex-col group">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-orange/5 blur-[100px] rounded-full group-hover:bg-brand-orange/10 transition-all duration-1000 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 p-4 hidden md:block">
                            <div className="w-2 h-2 bg-brand-orange rounded-full animate-ping"></div>
                        </div>
                        <h2 className="text-lg md:text-xl font-black text-brand-gray mb-6 md:mb-8 flex items-center gap-3 font-mono uppercase tracking-widest">
                            <span className="text-brand-orange block w-1 h-4 bg-brand-orange rounded-full"></span> SCHEDULING_MATRIX
                        </h2>
                        <div className="flex-1 min-h-[500px] md:min-h-[700px] flex flex-col">
                            {/* Custom Header */}
                            <div className="flex flex-wrap items-center justify-between w-full mb-6 gap-4 border-b border-gray-50 pb-6">
                                {/* Navigation (Left) */}
                                <div className="flex items-center gap-2 flex-nowrap shrink-0 order-2 sm:order-1">
                                    <button
                                        onClick={() => calendarRef.current?.getApi().prev()}
                                        className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-brand-gray/5 text-brand-gray rounded-lg md:rounded-xl hover:bg-brand-orange hover:text-white transition-all active:scale-95"
                                    >
                                        <ChevronLeft size={18} className="md:w-5 md:h-5" />
                                    </button>
                                    <button
                                        onClick={() => calendarRef.current?.getApi().next()}
                                        className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-brand-gray/5 text-brand-gray rounded-lg md:rounded-xl hover:bg-brand-orange hover:text-white transition-all active:scale-95"
                                    >
                                        <ChevronRight size={18} className="md:w-5 md:h-5" />
                                    </button>
                                    <button
                                        onClick={() => calendarRef.current?.getApi().today()}
                                        className="h-8 md:h-10 px-3 md:px-4 flex items-center justify-center bg-brand-gray text-white rounded-lg md:rounded-xl font-black text-[10px] md:text-xs hover:bg-brand-orange transition-all active:scale-95 uppercase tracking-widest font-mono"
                                    >
                                        Today
                                    </button>
                                </div>

                                {/* Title (Center) */}
                                <div className="w-full sm:flex-1 text-center min-w-0 order-1 sm:order-2">
                                    <h3 className="text-base md:text-xl font-black text-brand-gray tracking-tighter font-mono uppercase truncate px-2">
                                        {calendarTitle}
                                    </h3>
                                </div>

                                {/* Views (Right) */}
                                <div className="flex items-center gap-1.5 md:gap-2 flex-nowrap shrink-0 justify-end order-3">
                                    {[
                                        { id: "dayGridMonth", label: "MO" },
                                        { id: "timeGridWeek", label: "WK" },
                                        { id: "timeGridDay", label: "DY" },
                                    ].map((view) => (
                                        <button
                                            key={view.id}
                                            onClick={() => calendarRef.current?.getApi().changeView(view.id)}
                                            className={`h-8 md:h-10 px-2.5 md:px-4 rounded-lg md:rounded-xl text-[10px] font-black transition-all active:scale-95 font-mono tracking-widest ${currentView === view.id
                                                ? "bg-brand-orange text-white"
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                }`}
                                        >
                                            <span className="md:hidden">{view.label}</span>
                                            <span className="hidden md:inline">{view.label === "MO" ? "MONTH" : view.label === "WK" ? "WEEK" : "DAY"}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="calendar-container admin-calendar flex-1">
                                <FullCalendar
                                    ref={calendarRef}
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    initialView={window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek"}
                                    headerToolbar={false}
                                    locale={zhTwLocale}
                                    slotMinTime="08:00:00"
                                    slotMaxTime="19:00:00"
                                    allDaySlot={false}
                                    businessHours={{
                                        daysOfWeek: [1, 2, 3, 4, 5, 6],
                                        startTime: "08:30",
                                        endTime: "17:30",
                                    }}
                                    slotDuration="01:00:00"
                                    slotLabelFormat={{
                                        hour: "numeric",
                                        minute: "2-digit",
                                        meridiem: "short",
                                        hour12: true,
                                    }}
                                    dayHeaderContent={(args) => {
                                        const date = args.date;
                                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                        const day = date.getDate().toString().padStart(2, '0');
                                        const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                                        const weekday = weekdays[date.getDay()];
                                        return {
                                            html: `<div class="font-mono flex flex-col items-center">
                                                <span class="text-[10px] text-gray-400 font-black">${weekday}</span>
                                                <span class="text-xs text-brand-gray font-black">${month}.${day}</span>
                                            </div>`
                                        };
                                    }}
                                    datesSet={(arg) => {
                                        setCalendarTitle(arg.view.title);
                                        setCurrentView(arg.view.type);
                                    }}
                                    height="auto"
                                    events={appointments}
                                    eventClick={handleEventClick}
                                />
                            </div>
                        </div>
                    </div>
                </div>



                {/* Right: Appointment List (1/3) */}
                <div className="flex flex-col">
                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col h-full max-h-[850px] xl:max-h-none overflow-hidden font-base">
                        <div className="flex flex-col gap-6 mb-8">
                            <h2 className="text-xl font-black text-brand-gray flex items-center gap-3 font-mono uppercase tracking-tighter">
                                <span className="text-brand-orange">//</span> LIVE_FEED
                            </h2>

                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="SEARCH_BY_PLATE_OR_PH..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 p-4 pl-12 rounded-xl font-mono text-xs font-bold border border-transparent focus:border-brand-orange outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map((app) => (
                                    <div key={app.id} className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-brand-orange/40 transition-all group overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gray-100 group-hover:bg-brand-orange transition-colors"></div>

                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`w-2 h-2 rounded-full animate-pulse ${app.extendedProps.status === "PENDING" ? "bg-yellow-500" :
                                                        app.extendedProps.status === "CONFIRMED" ? "bg-blue-600" :
                                                            app.extendedProps.status === "CANCELLED" ? "bg-red-500" : "bg-green-500"
                                                        }`}></span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">
                                                        {app.extendedProps.status}
                                                    </span>
                                                </div>
                                                <p className="text-lg font-black text-brand-gray tracking-tight leading-none mb-1">{app.extendedProps.carModel}</p>
                                                <p className="text-xs font-black text-brand-orange font-mono flex items-center gap-1">
                                                    PLATE: {app.extendedProps.licensePlate || "XXXX-XX"}
                                                </p>
                                            </div>
                                            <div className="text-right font-mono text-brand-gray">
                                                <p className="text-xs font-black">{format(new Date(app.start), "MM.dd")}</p>
                                                <p className="text-[10px] font-bold text-gray-400">{format(new Date(app.start), "HH:mm")}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-5">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 font-mono">
                                                <Phone size={12} className="text-gray-300" /> {app.extendedProps.phoneNumber}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 font-mono">
                                                <Clock size={12} className="text-gray-300" /> {String(app.extendedProps.service?.duration || 120).padStart(3, '0')} min
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {app.extendedProps.status === "PENDING" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, "CONFIRMED")}
                                                    className="flex-1 bg-brand-orange text-white py-2 rounded-lg text-[10px] font-black transition-all hover:bg-orange-600 uppercase tracking-widest font-mono"
                                                >
                                                    APPROVE
                                                </button>
                                            )}
                                            {app.extendedProps.status === "CONFIRMED" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, "COMPLETED")}
                                                    className="flex-1 bg-brand-gray text-white py-2 rounded-lg text-[10px] font-black transition-all hover:bg-black uppercase tracking-widest font-mono"
                                                >
                                                    COMPLETE
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSelectedAppointment(app.extendedProps);
                                                    setIsDetailModalOpen(true);
                                                }}
                                                className="px-3 py-2 bg-gray-50 text-gray-400 hover:text-brand-gray rounded-lg text-[10px] font-black border border-transparent hover:border-gray-200 transition-all uppercase font-mono tracking-widest"
                                            >
                                                INFO
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center space-y-3">
                                    <Filter className="mx-auto text-gray-100" size={48} />
                                    <p className="text-gray-300 font-mono text-xs font-black uppercase tracking-widest leading-none">NO_DATA_MATCHED</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .admin-calendar .fc {
          border: none !important;
          --fc-border-color: #f1f5f9;
          --fc-today-bg-color: #fffaf0;
          font-family: var(--font-mono) !important;
        }
        
        .admin-calendar .fc-col-header-cell {
          background: #ffffff !important;
          border-bottom: 2px solid #0f172a !important;
        }
        
        .admin-calendar .fc-timegrid-slot {
          height: 70px !important;
          border-bottom: 1px dashed #f1f5f9 !important;
        }
        
        .admin-calendar .fc-event {
          border-radius: 6px !important;
          padding: 2px !important;
          border: none !important;
          cursor: pointer !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }

        .admin-calendar .fc-timegrid-slot-label-cushion {
          font-family: var(--font-mono);
          font-size: 10px !important;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>

            <AppointmentDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                appointment={selectedAppointment}
                onStatusUpdate={fetchAppointments}
            />

            <CompleteAppointmentModal
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                appointment={selectedAppointment}
                onComplete={fetchAppointments}
            />
        </div>
    );
}
