import { Factory } from "lucide-react";

export default function LoadingSplash({ message }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-[100] bg-brand-light-gray flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-brand-orange text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-200 animate-pulse">
                <span className="text-3xl font-black tracking-tighter">ST</span>
            </div>
            {message && (
                <p className="mt-6 text-brand-gray font-bold opacity-60 tracking-widest text-sm uppercase animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
}
