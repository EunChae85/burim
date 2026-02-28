import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { Metadata } from 'next';
import { ArrowRight, Newspaper } from 'lucide-react';

export const metadata: Metadata = {
    title: "부동산 소식 | 부림공인중개사사무소",
    description: "수원 부동산 전문가가 분석한 최신 시장 동향과 뉴스 리포트를 확인하세요.",
    openGraph: {
        title: "부동산 소식 | 부림부동산",
        description: "수원 실시간 부동산 뉴스 분석",
        type: "website",
    }
};

interface NewsItem {
    id: string;
    slug: string;
    title: string;
    aiTitle: string | null;
    sourceName: string;
    content: string;
    aiContent: string | null;
    createdAt: Date;
}

export default async function NewsListPage() {
    let newsList: NewsItem[] = [];
    try {
        newsList = await prisma.news.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' },
        }) as NewsItem[];
    } catch (error) {
        console.error("News list fetch error:", error);
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-20 md:py-32">
                <header className="mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Newspaper size={24} />
                        </div>
                        <span className="text-blue-600 font-black text-sm uppercase tracking-[0.2em]">Regional Report</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tighter">
                        전문가가 분석한<br />
                        <span className="text-blue-600">수원 부동산 소식</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                        부림공인중개사사무소는 전국적인 뉴스뿐만 아니라, <br className="hidden md:block" />
                        수원 지역에 미치는 영향을 중심으로 핵심적으로 분석해 드립니다.
                    </p>
                </header>

                {newsList.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <Newspaper size={40} />
                        </div>
                        <p className="text-slate-400 font-bold text-lg">새로운 분석 소식을 준비 중입니다.</p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {newsList.map((news: any) => (
                            <article key={news.id} className="group relative">
                                <Link href={`/news/${news.slug}`} className="block bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className="text-blue-600 font-black text-xs uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg">
                                                    {format(new Date(news.createdAt), 'yyyy. MM. dd')}
                                                </span>
                                                <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">
                                                    출처: {news.sourceName}
                                                </span>
                                            </div>

                                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                                                {news.aiTitle || news.title}
                                            </h2>

                                            {/* Preview removed as requested */}

                                            <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest">
                                                분석 내용 확인하기 <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Contact CTA */}
            <section className="bg-slate-900 py-32">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter">
                        궁금한 매물이나 뉴스가 있나요?
                    </h2>
                    <p className="text-slate-400 text-lg mb-12 font-medium">
                        수원 전 지역 부동산의 모든 것. 부림이 성심껏 상담해 드립니다.
                    </p>
                    <Link href="/?scroll=inquiry" className="inline-block px-12 py-6 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-blue-900/40 hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-tight">
                        실시간 상담 예약하기
                    </Link>
                </div>
            </section>
        </div>
    );
}
