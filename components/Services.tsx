"use client";

import { Wrench, Settings, ShieldCheck, Zap } from "lucide-react";

const services = [
    {
        title: "傳動軸精密平衡",
        description: "針對行駛震動與抖動問題，使用先進設備進行動態平衡。專業校正，確保行車平順與零件壽命。",
        icon: <ShieldCheck className="w-8 h-8" />,
    },
    {
        title: "異音診斷與修復",
        description: "精準查出傳動軸「咖咖咖」異音來源，並進行零件更換或翻修。恢復原廠寂靜品質。",
        icon: <Zap className="w-8 h-8" />,
    },
    {
        title: "萬向接頭更換",
        description: "使用高品質萬向接頭與防塵套，專業施工確保密合度。有效防止油脂洩漏與沙塵入侵。",
        icon: <Wrench className="w-8 h-8" />,
    },
    {
        title: "傳動系統健檢",
        description: "全方位檢查底盤傳動組件，提前掌握潛在故障風險。提供最中肯的維修建議與方案。",
        icon: <Settings className="w-8 h-8" />,
    },
];

export default function Services() {
    return (
        <section id="services" className="py-24 bg-white text-brand-gray px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-8 border-l-8 border-brand-orange pl-6 lg:pl-8">
                    <div>
                        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-brand-gray leading-tight lg:leading-none">專業服務項目</h2>
                        <p className="text-lg lg:text-xl text-gray-500 font-bold mt-2 lg:mt-4">Professional Driveshaft Services</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="p-8 lg:p-10 border-2 border-gray-100 hover:border-brand-orange hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all group bg-white rounded-[2rem] relative overflow-hidden flex flex-col items-start"
                        >
                            <div className="text-brand-orange mb-6 lg:mb-8 group-hover:bg-brand-orange group-hover:text-white transition-all bg-brand-light-gray p-4 lg:p-5 rounded-2xl shadow-inner">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-black mb-3 lg:mb-4 text-brand-gray">{service.title}</h3>
                            <p className="text-gray-700 text-base lg:text-lg leading-relaxed font-bold">
                                {service.description}
                            </p>
                            <div className="mt-6 lg:mt-8 w-10 lg:w-12 h-1 bg-gray-200 group-hover:w-20 lg:group-hover:w-24 group-hover:bg-brand-orange transition-all"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
