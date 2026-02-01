"use client";
export const dynamic = 'force-dynamic';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BeforeAfter from "@/components/BeforeAfter";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import { useSettings } from "@/hooks/useSettings";

import { useLiff } from "@/components/providers/LiffProvider";
import BookingSkeleton from "@/components/skeletons/BookingSkeleton";
import FloatingLineButton from "@/components/FloatingLineButton";

export default function Home() {
  const { settings } = useSettings();
  const { isLiff, isInitialized } = useLiff();

  // In LIFF mode, we want to bypass the marketing homepage entirely.
  // We show the skeleton while redirecting or if the user lands here by mistake.
  if (!isInitialized || isLiff) {
    return <BookingSkeleton />;
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      <BeforeAfter />
      <Reviews />
      <Contact />
      <CTA />

      <FloatingLineButton />

      <footer className="bg-brand-gray text-white py-8 border-t border-white/10 text-center text-sm px-6">
        <p>© 2024 {settings?.businessName || "新泰汽車傳動軸"}. All Rights Reserved. 專業、誠信、精密平衡.</p>
        <p className="mt-2 text-gray-500">地址：{settings?.address || "彰化縣竹塘鄉光明路525號竹田巷17之8號"}</p>
      </footer>
    </main>
  );
}
