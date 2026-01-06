"use client";

import { MapPin, Phone, Clock, Facebook } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export default function Contact() {
    const { settings } = useSettings();

    return (
        <section className="py-24 bg-brand-light-gray text-brand-gray px-6 md:px-12 border-t-2 border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 font-black">
                    <h2 className="text-5xl md:text-7xl mb-6 text-brand-gray leading-none tracking-tighter">聯絡我們</h2>
                    <div className="w-32 h-3 bg-brand-orange mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
                    {/* Info Side */}
                    <div className="space-y-12 lg:space-y-16 flex flex-col justify-center">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-8 group">
                            <div className="bg-brand-gray p-6 rounded-3xl text-brand-orange shadow-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                                <MapPin size={36} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl lg:text-2xl mb-2 text-brand-gray uppercase">門市地址</h3>
                                <p className="text-brand-gray font-black mb-4 text-xl lg:text-2xl leading-tight">
                                    {settings?.address.split('號').map((part, i, arr) => (
                                        <span key={i}>
                                            {part}{i < arr.length - 1 ? '號' : ''}
                                            {i === 0 && <br />}
                                        </span>
                                    )) || "彰化縣竹塘鄉光明路 525 號\n竹田巷 17 之 8 號"}
                                </p>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${settings?.businessName || "新泰汽車傳動軸"}`}
                                    target="_blank"
                                    className="bg-brand-orange text-white px-6 py-3 rounded-xl text-lg font-black shadow-lg hover:shadow-brand-orange/40 transition-all inline-block"
                                >
                                    Google Maps 導航 →
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-8 group">
                            <div className="bg-brand-gray p-6 rounded-3xl text-brand-orange shadow-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                                <Phone size={36} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl lg:text-2xl mb-2 text-brand-gray uppercase">預約電話</h3>
                                <p className="text-brand-gray font-black mb-4 text-4xl lg:text-5xl font-mono tracking-tighter">{settings?.phoneNumber || "0979 293 225"}</p>
                                <a href={`tel:${settings?.phoneNumber?.replace(/\s/g, '') || "0979293225"}`} className="bg-brand-gray text-brand-orange px-6 py-3 rounded-xl text-lg font-black shadow-lg hover:bg-brand-gray/90 transition-all inline-block border border-brand-orange/50">
                                    立即撥打專線 →
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-8 group">
                            <div className="bg-brand-gray p-6 rounded-3xl text-brand-orange shadow-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                                <Facebook size={36} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl lg:text-2xl mb-2 text-brand-gray uppercase">官方臉書</h3>
                                <a
                                    href="https://www.facebook.com/profile.php?id=100057570485268"
                                    target="_blank"
                                    className="text-brand-orange hover:underline text-xl lg:text-2xl font-black transition-all inline-block"
                                >
                                    前往 Facebook 專頁 →
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Map Side */}
                    <div className="h-[400px] lg:h-full min-h-[400px] lg:min-h-[600px] w-full bg-white rounded-[2rem] lg:rounded-[3rem] overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-4 lg:border-8 border-white">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.489126900631!2d120.4561208!3d23.836759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346eb5c995f37bc9%3A0xefcd5a5e8790a35a!2z5paw5rOw5rG96LuK5YKz5YuV6Lu4!5e0!3m2!1szh-TW!2stw!4v1767514503653!5m2!1szh-TW!2stw"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                    </div>
                </div>

                {/* Operating Hours in a refined bar below */}
                <div className="mt-12 lg:mt-16 bg-white p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-2xl border-4 border-white ring-1 ring-gray-200">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 text-center lg:text-left">
                        <div className="flex items-center space-x-6">
                            <div className="bg-brand-orange p-4 rounded-2xl text-white shadow-xl flex-shrink-0">
                                <Clock size={36} />
                            </div>
                            <h3 className="font-black text-2xl lg:text-3xl text-brand-gray whitespace-nowrap">營業時間</h3>
                        </div>
                        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-16 text-lg lg:text-xl text-brand-gray font-black">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <span className="text-gray-400 text-sm uppercase">Mon - Sat</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl lg:text-2xl">08:30 – 12:00</span>
                                    <span className="text-gray-300">/</span>
                                    <span className="text-xl lg:text-2xl">13:30 – 17:30</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-12 w-full lg:w-auto">
                                <span className="text-gray-400 text-sm uppercase">Sun</span>
                                <span className="text-2xl lg:text-3xl text-red-600 italic">休息 CLOSED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
