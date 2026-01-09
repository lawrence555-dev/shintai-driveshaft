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
            <header>
                <h1 className="text-5xl font-black text-brand-gray tracking-tighter uppercase mb-4">
                    工作看板 <span className="text-brand-orange">Task Board</span>
                </h1>
                <p className="text-xl text-gray-500 font-bold">查看預約排程並管理維修進度。</p>
            </header>

            {/* Stats Cards / Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                    { id: "PENDING", label: "待確認", color: "bg-yellow-500", icon: AlertCircle },
                    { id: "CONFIRMED", label: "已確認", color: "bg-blue-600", icon: CheckCircle },
                    { id: "COMPLETED", label: "已完成", color: "bg-green-500", icon: Package },
                    { id: "CANCELLED", label: "已取消", color: "bg-red-500", icon: X },
                    { id: null, label: "總計", color: "bg-brand-gray", icon: CalendarIcon },
                ].map((stat) => (
                    <button
                        key={stat.label}
                        onClick={() => setStatusFilter(stat.id)}
                        className={`p-8 rounded-[2rem] shadow-xl border-4 transition-all flex items-center justify-between group ${statusFilter === stat.id
                            ? "bg-white border-brand-orange scale-105"
                            : "bg-white border-white hover:border-gray-200"
                            }`}
                    >
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-brand-gray tracking-tighter">
                                {stat.id ? appointments.filter(e => e.extendedProps.status === stat.id).length : appointments.length}
                            </p>
                        </div>
                        <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
                {/* Left: Calendar (2/3) */}
                <div className="xl:col-span-2 flex flex-col sticky top-32">
                    <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white ring-1 ring-gray-100 flex-1 relative overflow-hidden flex flex-col">
                        <h2 className="text-2xl font-black text-brand-gray mb-6 flex items-center gap-3">
                            <div className="w-2 h-8 bg-brand-orange rounded-full"></div>
                            預約排程日曆
                        </h2>
                        <div className="flex-1 min-h-[750px] flex flex-col">
                            {/* Custom Header */}
                            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center w-full mb-6 gap-4">
                                {/* Navigation (Left) */}
                                <div className="flex items-center gap-1 flex-nowrap shrink-0">
                                    <button
                                        onClick={() => calendarRef.current?.getApi().prev()}
                                        className="h-9 w-9 flex items-center justify-center bg-brand-gray text-white rounded-lg hover:bg-brand-orange transition-all active:scale-95 shadow-md"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => calendarRef.current?.getApi().next()}
                                        className="h-9 w-9 flex items-center justify-center bg-brand-gray text-white rounded-lg hover:bg-brand-orange transition-all active:scale-95 shadow-md"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                    <button
                                        onClick={() => calendarRef.current?.getApi().today()}
                                        className="h-9 px-3 flex items-center justify-center bg-brand-gray text-white rounded-lg font-bold text-xs hover:bg-brand-orange transition-all active:scale-95 shadow-md whitespace-nowrap"
                                    >
                                        今天
                                    </button>
                                </div>

                                {/* Title (Center) */}
                                <div className="flex-1 text-center min-w-0">
                                    <h3 className="text-sm sm:text-base font-bold text-brand-gray tracking-tight whitespace-nowrap">
                                        {calendarTitle}
                                    </h3>
                                </div>

                                {/* Views (Right) */}
                                <div className="flex items-center gap-1 flex-nowrap shrink-0 justify-end">
                                    {[
                                        { id: "dayGridMonth", label: "月" },
                                        { id: "timeGridWeek", label: "週" },
                                        { id: "timeGridDay", label: "天" },
                                    ].map((view) => (
                                        <button
                                            key={view.id}
                                            onClick={() => calendarRef.current?.getApi().changeView(view.id)}
                                            className={`h-9 px-3 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 whitespace-nowrap ${currentView === view.id
                                                ? "bg-brand-orange text-white shadow-brand-orange/20"
                                                : "bg-brand-gray text-white hover:bg-gray-700"
                                                }`}
                                        >
                                            {view.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="calendar-container admin-calendar flex-1">
                                <FullCalendar
                                    ref={calendarRef}
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    initialView="timeGridWeek"
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
                                        const month = (date.getMonth() + 1).toString();
                                        const day = date.getDate().toString();
                                        const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
                                        const weekday = weekdays[date.getDay()];
                                        return `${month}/${day} ${weekday}`;
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
                    <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white ring-1 ring-gray-100 flex flex-col h-full max-h-[850px] xl:max-h-none">
                        <div className="flex flex-col gap-6 mb-8">
                            <h2 className="text-2xl font-black text-brand-gray flex items-center gap-3">
                                <div className="w-2 h-8 bg-brand-orange rounded-full"></div>
                                預約清單
                            </h2>

                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="搜尋車牌或電話..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-brand-light-gray p-5 pl-14 rounded-2xl font-bold border-2 border-transparent focus:border-brand-orange outline-none transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-4">
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((app) => (
                                        <div key={app.id} className="bg-white border-2 border-gray-50 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-brand-orange/30 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`w-3 h-3 rounded-full ${app.extendedProps.status === "PENDING" ? "bg-yellow-500" :
                                                            app.extendedProps.status === "CONFIRMED" ? "bg-blue-600" :
                                                                app.extendedProps.status === "CANCELLED" ? "bg-red-500" : "bg-green-500"
                                                            }`}></span>
                                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                                            {app.extendedProps.status === "PENDING" ? "待確認" :
                                                                app.extendedProps.status === "CONFIRMED" ? "已確認" :
                                                                    app.extendedProps.status === "CANCELLED" ? "已取消" : "已完成"}
                                                        </span>
                                                    </div>
                                                    <p className="text-xl font-black text-brand-gray tracking-tight">{app.extendedProps.carModel}</p>
                                                    <p className="text-sm font-bold text-gray-500 flex items-center gap-1">
                                                        <Hash size={14} className="text-brand-orange" /> {app.extendedProps.licensePlate || "未填寫"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-brand-gray">{format(new Date(app.start), "MM/dd")}</p>
                                                    <p className="text-xs font-bold text-gray-400">{format(new Date(app.start), "HH:mm")}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                    <Phone size={14} className="text-brand-orange" /> {app.extendedProps.phoneNumber || "無電話"}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                    <Clock size={14} className="text-brand-orange" /> {app.extendedProps.service?.name}
                                                </div>
                                            </div>

                                            {app.extendedProps.status === "COMPLETED" && app.extendedProps.actualDuration && (
                                                <div className="bg-brand-light-gray p-3 rounded-xl mb-4 flex justify-between items-center text-xs font-black">
                                                    <span className="text-gray-400 uppercase">工時：{app.extendedProps.service?.duration || 120}m (預計) vs </span>
                                                    <span className={`${app.extendedProps.actualDuration > (app.extendedProps.service?.duration || 120)
                                                        ? "text-red-500"
                                                        : "text-green-500"
                                                        }`}>
                                                        {app.extendedProps.actualDuration}m (實際)
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                {app.extendedProps.status === "PENDING" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(app.id, "CONFIRMED")}
                                                        className="flex-1 bg-brand-orange hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-black transition-all shadow-lg"
                                                    >
                                                        核准預約
                                                    </button>
                                                )}
                                                {app.extendedProps.status === "CONFIRMED" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(app.id, "COMPLETED")}
                                                        className="flex-1 bg-brand-gray hover:bg-black text-white py-3 rounded-xl text-sm font-black transition-all shadow-lg"
                                                    >
                                                        標記完工
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setSelectedAppointment(app.extendedProps);
                                                        setIsDetailModalOpen(true);
                                                    }}
                                                    className="px-4 py-3 border-2 border-gray-100 hover:border-brand-gray rounded-xl text-gray-400 hover:text-brand-gray transition-all"
                                                >
                                                    詳情
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center space-y-3">
                                        <Filter className="mx-auto text-gray-200" size={48} />
                                        <p className="text-gray-400 font-bold">找不到相符的預約</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .admin-calendar .fc {
          border: none !important;
          --fc-border-color: #f3f4f6;
          --fc-today-bg-color: #fff7ed;
          font-family: inherit;
        }
        
        /* 表頭樣式：絕對不折行、縮小字體、最小寬度 */
        .admin-calendar .fc-col-header-cell {
          min-width: 80px !important;
          background: #f9fafb !important;
          border-bottom: 2px solid #f3f4f6 !important;
        }
        .admin-calendar .fc-col-header-cell-cushion {
          padding: 1rem 0.25rem !important;
          display: block !important;
          white-space: nowrap !important;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.8rem !important;
          font-weight: 800 !important;
          color: #6b7280;
          text-decoration: none !important;
        }


        
        /* 今天的日期表頭特別標示 */
        .admin-calendar .fc-day-today .fc-col-header-cell-cushion {
          color: #ff8c00 !important;
        }

        /* 時段顯示優化 */
        .admin-calendar .fc-timegrid-slot-label {
          vertical-align: middle !important;
        }
        .admin-calendar .fc-timegrid-slot-label-cushion {
          font-size: 0.75rem !important;
          font-weight: 700 !important;
          color: #9ca3af;
          text-transform: uppercase;
        }
        
        .admin-calendar .fc-timegrid-slot {
          height: 80px !important; /* 調降高度讓 1 小時一格不會過長 */
          border-bottom: 1px dashed #f3f4f6 !important;
        }
        
        .admin-calendar .fc-event {
          border-radius: 0.75rem !important;
          padding: 0.4rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
          border: none !important;
          cursor: pointer !important;
          transition: transform 0.2s;
        }
        .admin-calendar .fc-event:hover {
          transform: scale(1.02);
          z-index: 50;
        }
        .admin-calendar .fc-event-main {
          padding: 0.25rem !important;
          font-weight: 700 !important;
          font-size: 0.8rem !important;
        }


        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
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
