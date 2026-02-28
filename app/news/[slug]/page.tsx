import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        // @ts-ignore
        const news = await prisma.news?.findUnique({
            where: { slug: params.slug },
        });

        if (!news) return { title: "뉴스를 찾을 수 없습니다" };

        const title = news.aiTitle || news.title;
        const description = (news.aiContent || news.originalSummary || "").slice(0, 160).replace(/\n/g, ' ');

        return {
            title: `${title} | 부림부동산 지역 뉴스 분석`,
            description,
            alternates: {
                canonical: `https://burim-estate.com/news/${news.slug}`,
            },
            openGraph: {
                title: `${title} | 부림부동산`,
                description,
                type: "article",
                publishedTime: news.createdAt.toISOString(),
                url: `https://burim-estate.com/news/${news.slug}`,
                siteName: "부림공인중개사사무소",
                images: [
                    {
                        url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000",
                        width: 1200,
                        height: 630,
                    }
                ]
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
            }
        };
    } catch (e) {
        return { title: "수원 부동산 소식 | 부림부동산" };
    }
}

export default async function NewsDetailPage({ params }: Props) {
    let news = null;
    try {
        // @ts-ignore
        news = await prisma.news?.findUnique({
            where: { slug: params.slug },
        });
    } catch (error) {
        console.error("News detail fetch error:", error);
    }

    if (!news) {
        notFound();
    }

    const settings = await prisma.siteSettings.findUnique({
        where: { id: 'singleton' },
    });
    const phone = settings?.phone || "031-123-4567";

    // Fetch 3 related properties for the bottom section
    // @ts-ignore
    const relatedProperties = await prisma.property.findMany({
        where: { status: 'active' },
        take: 3,
        orderBy: { created_at: 'desc' }
    });

    const formatPriceLabel = (p: any) => {
        if (p.transaction_type === '매매') return `${(p.sale_price / 10000).toFixed(1)}억`;
        if (p.transaction_type === '전세') return `${(p.deposit / 10000).toFixed(1)}억`;
        return `${p.deposit}/${p.rent}`;
    };

    return (
        <article className="max-w-3xl mx-auto px-4 py-16">
            <header className="mb-12">
                <Link href="/news" className="text-gray-500 hover:text-blue-600 transition-colors mb-8 inline-block font-medium">
                    &larr; 소식 목록으로
                </Link>
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">전문가 부동산 리포트</span>
                    <span className="text-gray-400 text-sm">{format(new Date(news.createdAt), 'yyyy. MM. dd')}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 leading-[1.3] tracking-tight">
                    {news.aiTitle || news.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-500 border-b border-gray-100 pb-8 mt-6">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-600">
                        출처: {news.sourceName}
                    </span>
                    {news.sourceUrl && (
                        <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors hover:bg-blue-100">
                            원본 기사 열기
                        </a>
                    )}
                </div>
            </header>

            {news.factBlock && (
                <div className="bg-slate-50 border border-slate-200 p-4 mb-6 rounded-3xl shadow-sm">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-base font-black mb-6 shadow-md shadow-slate-900/10">
                        <span className="text-lg">✓</span>
                        [FACT CHECK] 핵심 요약
                    </div>
                    <div className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                        {news.factBlock}
                    </div>
                </div>
            )}

            {/* Markdown Content Section */}
            <div className="prose prose-lg max-w-none mb-10 text-gray-800 leading-[1.9] font-medium 
                prose-headings:font-black prose-headings:text-slate-900
                prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8
                prose-p:mb-5 prose-p:leading-[1.9]
                prose-li:my-2 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                prose-strong:text-blue-700 prose-strong:font-black">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h2: ({ node, ...props }) => (
                            <h2 className="inline-flex items-center gap-2 px-5 py-2 bg-slate-800 text-white rounded-xl text-lg font-black shadow-lg shadow-slate-900/10 !mb-4 mt-8 first:mt-0 uppercase tracking-tighter" {...props} />
                        )
                    }}
                >
                    {news.aiContent || news.content}
                </ReactMarkdown>
            </div>
            {relatedProperties.length > 0 && (
                <section className="mb-20 pt-16 border-t border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                        진행 중인 매교/세류 추천 매물
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedProperties.map((prop: any) => (
                            <Link key={prop.id} href={`/property/${prop.slug}`} className="group">
                                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={prop.thumbnail || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600'}
                                            alt={prop.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                            {prop.transaction_type}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{prop.title}</h4>
                                        <p className="text-blue-600 font-black text-sm">{formatPriceLabel(prop)}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <footer className="mt-20 pt-16 border-t border-gray-200">
                <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                        <span className="text-[120px] font-black">?</span>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-black mb-10 leading-tight">
                            수원 전 지역 부동산,<br />
                            최고의 전문가와 상담이 필요하신가요?
                        </h3>

                        <div className="grid gap-4 mb-10">
                            <Link href="/" className="flex items-center gap-4 p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/5 group/link">
                                <span className="text-2xl">📌</span>
                                <span className="font-bold text-lg">매교역 실매물 보기 (전용 단독 리스팅)</span>
                                <span className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity">&rarr;</span>
                            </Link>
                            <Link href="/?scroll=inquiry" className="flex items-center gap-4 p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/5 group/link">
                                <span className="text-2xl">📌</span>
                                <span className="font-bold text-lg">세류동 원룸·상가 상담 신청</span>
                                <span className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity">&rarr;</span>
                            </Link>
                        </div>

                        <div className="bg-blue-600 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-1">대표 상담 전화</p>
                                <p className="text-3xl font-black">{phone}</p>
                            </div>
                            <a href={`tel:${phone}`} className="w-full md:w-auto px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-center shadow-lg active:scale-95 transition-all">
                                전화 연결하기
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-2 text-center">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        부림공인중개사사무소 | 매교동/세류동 전문 중개
                    </p>
                    <p className="text-gray-400 text-[10px] leading-relaxed max-w-lg mx-auto italic">
                        ※ 본 글은 언론 보도 내용을 바탕으로 수원 부동산 전문가 관점에서 해설한 리포트입니다.
                    </p>
                </div>
            </footer>
        </article>
    );
}
