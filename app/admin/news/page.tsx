import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Newspaper, Edit2, ExternalLink } from "lucide-react";
import FetchNewsButton from "@/components/admin/FetchNewsButton";
import DeleteNewsButton from "@/components/admin/DeleteNewsButton";

export default async function AdminNewsListPage() {
    let newsList: any[] = [];
    try {
        // @ts-ignore
        newsList = await prisma.news?.findMany({
            orderBy: { createdAt: "desc" },
        }) || [];
    } catch (error) {
        console.error("Admin news list fetch error:", error);
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-3">
                            <Newspaper size={32} />
                            뉴스/소식 관리
                        </h1>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
                            RSS 수집 및 부동산 리포트 관리
                        </p>
                    </div>
                    <FetchNewsButton />
                </header>

                <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest">
                                <th className="px-8 py-5">날짜 / 분류</th>
                                <th className="px-8 py-5">제목 / 출처</th>
                                <th className="px-8 py-5 text-center">지역 연관도</th>
                                <th className="px-8 py-5">상태</th>
                                <th className="px-8 py-5 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {newsList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase italic">
                                        등록된 뉴스가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                newsList.map((news) => (
                                    <tr key={news.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-slate-400 font-black">{format(new Date(news.createdAt), "yyyy.MM.dd")}</span>
                                                <span className={`
                                                    text-[10px] font-black px-2 py-0.5 rounded-md w-fit
                                                    ${news.category === 'LOCAL' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}
                                                `}>
                                                    {news.category === 'LOCAL' ? '수원소식' : '전국정책'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-md">
                                            <p className="text-slate-900 font-black tracking-tight leading-tight mb-1 line-clamp-2">
                                                {news.aiTitle || news.title}
                                            </p>
                                            <p className="text-slate-400 text-[10px] flex items-center gap-1 font-bold">
                                                <ExternalLink size={10} /> {news.sourceName}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`
                                                    text-xs font-black
                                                    ${(news.relevanceScore || 0) <= 3 ? 'text-red-500' : (news.relevanceScore || 0) >= 8 ? 'text-emerald-600' : 'text-slate-600'}
                                                `}>
                                                    {news.relevanceScore || 5}/10
                                                </span>
                                                {(news.relevanceScore || 0) <= 3 && (
                                                    <span className="text-[9px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">관련 없음</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`
                        px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${news.status === 'PUBLISHED'
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                    : 'bg-amber-50 text-amber-600 border border-amber-200'}
                      `}>
                                                {news.status === 'PUBLISHED' ? '발행완료' : '임시저장'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/news/${news.id}`}
                                                    className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                <DeleteNewsButton newsId={news.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
