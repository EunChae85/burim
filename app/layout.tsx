import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: "부림공인중개사 - 매교동/세류동 프리미엄 부동산",
  description: "수원 매교동, 세류동, 인계동 프리미엄 부동산 매물 중개 플랫폼. 정확한 정보와 안전한 거래를 약속합니다.",
  openGraph: {
    title: "부림공인중개사 - 수원 프리미엄 부동산",
    description: "매교역, 세류역 인근 아파트, 원룸, 투룸, 상가 전문 공인중개사.",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className={`${inter.className} antialiased selection:bg-blue-100 selection:text-blue-700`}>
        <Header />
        <main className="min-h-[calc(100vh-80px-300px)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
