import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://burim-estate.com'),
  title: {
    default: "부림공인중개사 - 매교동/세류동 프리미엄 부동산",
    template: "%s | 부림공인중개사"
  },
  description: "수원 매교동(매교역), 세류동 프리미엄 부동산 매물 중개. 아파트, 오피스텔, 원룸, 상가 전문 부림부동산에서 정확한 정보를 확인하세요.",
  keywords: ["수원부동산", "매교역부동산", "매교동부동산", "세류동부동산", "수원아파트매매", "수원원룸월세", "부림공인중개사", "권선구부동산"],
  authors: [{ name: "부림공인중개사" }],
  creator: "부림공인중개사",
  publisher: "부림공인중개사",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "부림공인중개사 - 수원 프리미엄 부동산",
    description: "매교동/세류동 아파트, 원룸, 상가 전문. 부림에서 당신이 꿈꾸던 가치를 시작하세요.",
    url: 'https://burim-estate.com',
    siteName: '부림공인중개사',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '부림공인중개사 수원 부동산',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "부림공인중개사 - 수원 프리미엄 부동산",
    description: "매교역/세류역 인근 아파트, 원룸 전문 중개.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      <body className={`${noto.className} antialiased selection:bg-blue-100 selection:text-blue-700`}>
        <Header />
        <main className="min-h-[calc(100vh-80px-300px)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
