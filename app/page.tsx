"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BeforeAfter from "@/components/BeforeAfter";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import { useSettings } from "@/hooks/useSettings";

export default function Home() {
  const { settings } = useSettings();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      <BeforeAfter />
      <Reviews />
      <Contact />
      <CTA />

      <footer className="bg-brand-gray text-white py-8 border-t border-white/10 text-center text-sm px-6">
        <p>© 2024 {settings?.businessName || "新泰汽車傳動軸"}. All Rights Reserved. 專業、誠信、精密平衡.</p>
        <p className="mt-2 text-gray-500">地址：{settings?.address || "彰化縣竹塘鄉光明路525號竹田巷17之8號"}</p>
      </footer>
    </main>
  );
}
