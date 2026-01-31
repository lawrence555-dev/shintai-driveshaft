import type { Metadata } from "next";
export const dynamic = 'force-dynamic';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

    const businessName = settings?.businessName || "新泰汽車傳動軸";

    return {
      title: `${businessName} - 專業維修與平衡`,
      description: "傳動軸異音專家，精密平衡修護",
    };
  } catch (error) {
    return {
      title: "新泰汽車傳動軸 - 專業維修與平衡",
      description: "傳動軸異音專家，精密平衡修護",
    };
  }
}

import Providers from "@/components/Providers";
import { LiffProvider } from "@/components/providers/LiffProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <LiffProvider>
            {children}
          </LiffProvider>
        </Providers>
      </body>
    </html>
  );
}
