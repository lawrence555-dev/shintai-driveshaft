"use client";

import { Star, MessageSquareQuote } from "lucide-react";

const reviews = [
    {
        name: "林佳樺",
        text: "我是20年四門馬三，因為異音，車廠檢測為傳動軸間隙過大而來，老闆很細心幫我檢查，雖然兩邊都沒有壞😅😅😅，但還是一樣保養好裝回去，收費不貴，回程路上感覺操控變穩，推薦👍🏻👍🏻👍🏻"
    },
    {
        name: "Jason Chiang",
        text: "我是2014四代森林人，最近在開車轉彎時，總是聽到答答答聲，有時有有時沒有，後來查到新泰有在維修傳動軸，馬上預約南下，初見到老闆時，心想怎麼如此幼齒，但是老闆分解傳動軸，就知道功力深厚，仔細的檢查內部零件，判斷是軸承內鋼珠磨損，立刻將損壞零件更換裝回車上，開車去路上測試，真的完全沒有異音了，感謝老闆細心的檢查，真的是現代少數職人精神，值得被推薦。"
    },
    {
        name: "簡大為",
        text: "2018 xc60 t8 里程已17萬，經常需要跑長途和山路。在行駛高速發生車輛劇烈抖動後，下交流道給附近保養廠檢查發現右前傳動軸故障。經車友介紹，聯繫新泰黃老闆，很幸運地可以預約到兩天後馬上維修。維修處理的過程很快，提出維修相關的問題，老闆也很有耐心地回覆，品質與價格公道合理，值得推薦的好店家💕"
    },
    {
        name: "曾先生",
        text: "Volvo 柴油V50 傳動軸抖動嚴重經朋友介紹來修理，修理過程中老闆細心的解釋更換內容物，他也不怕別人看，細心的解釋裏面是怎麼作動的，老闆都有一套SOP流程，這根本就是傳動軸的製造商啊，真的很推薦傳動軸有問題的車友來這裡，去過一次就知道老闆的好～"
    },
    {
        name: "Steven",
        text: "2018年 ALTIS營業車里程28萬KM，近半年來底盤一直傳來異音，最嚴重的是高速抖動，高速公路只能開100KM當路隊長。搜尋到了新泰汽車並預約更換傳動軸，老闆換裝技術了得根本是傳動軸得來速，現在我開高速公路時速120KM遊刃有餘!!! 營業車還有保固 真是棒"
    }
];

export default function Reviews() {
    return (
        <section className="py-24 bg-brand-gray text-white px-6 md:px-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                <MessageSquareQuote size={600} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            客戶好評推薦
                        </h2>
                        <div className="flex items-center gap-2 mt-6">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={28} className="text-brand-orange fill-brand-orange" />
                                ))}
                            </div>
                            <span className="text-2xl font-black ml-2 text-brand-orange">5.0</span>
                            <span className="text-gray-400 font-bold ml-2">Google Maps 滿分評價</span>
                        </div>
                    </div>
                    <a
                        href="https://www.google.com/maps/place/%E6%96%B0%E6%B3%B0%E6%B1%BD%E8%BB%8A%E5%82%B3%E5%8B%95%E8%BB%B4/@23.836759,120.4561208,17z/data=!4m8!3m7!1s0x346eb5c995f37bc9:0xefcd5a5e8790a35a!8m2!3d23.8367541!4d120.4586957!9m1!1b1!16s%2Fg%2F11l2_f8tmf?entry=ttu"
                        target="_blank"
                        className="bg-white text-brand-gray px-8 py-4 rounded-xl font-black text-xl hover:bg-brand-orange hover:text-white transition-all shadow-xl"
                    >
                        查看全部評論 →
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white/5 backdrop-blur-lg p-10 rounded-[2.5rem] border border-white/10 flex flex-col hover:border-brand-orange/50 transition-all hover:bg-white/10 group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center font-black text-xl text-white shadow-lg">
                                    {review.name[0]}
                                </div>
                                <div>
                                    <p className="font-black text-xl">{review.name}</p>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="text-brand-orange fill-brand-orange" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-300 font-bold leading-relaxed text-lg flex-1 italic group-hover:text-white transition-colors">
                                「{review.text}」
                            </p>
                            <div className="mt-8 pt-6 border-t border-white/10 text-brand-orange font-black flex items-center gap-2">
                                車主真實評論 <Star size={16} fill="currentColor" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
