import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function BookingSkeleton() {
    return (
        <main className="min-h-screen bg-brand-light-gray">
            <div className="max-w-4xl mx-auto px-6 py-28 md:py-32">
                <div className="mb-12 text-center">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
                    <div className="h-5 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
                </div>

                {/* Progress Bar Skeleton */}
                <div className="flex items-center justify-center mb-12 space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="w-12 h-0.5 bg-gray-200"></div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                </div>

                {/* Calendar Skeleton */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                    <div className="grid grid-cols-1 gap-12">
                        <div>
                            <div className="flex items-center mb-6">
                                <div className="w-5 h-5 bg-gray-200 rounded mr-2 animate-pulse"></div>
                                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-8 px-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="w-40 h-8 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>

                                <div className="grid grid-cols-7 gap-1 sm:gap-3">
                                    {/* Days config */}
                                    {Array.from({ length: 7 }).map((_, i) => (
                                        <div key={`head-${i}`} className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-8 my-2"></div>
                                    ))}

                                    {/* Dates grid */}
                                    {Array.from({ length: 35 }).map((_, i) => (
                                        <div
                                            key={`cell-${i}`}
                                            className="aspect-square sm:aspect-auto sm:h-24 p-2 rounded-2xl border-2 border-white bg-white flex flex-col items-center justify-center"
                                        >
                                            <div className="w-6 h-6 bg-gray-100 rounded animate-pulse mb-1"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
