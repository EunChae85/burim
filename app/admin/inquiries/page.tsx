import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { MessageSquare, Calendar, User, Phone, Home, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const revalidate = 0; // Disable caching for this page

export default async function AdminInquiriesPage() {
    const inquiries = await prisma.inquiry.findMany({
        include: {
            property: true,
        },
        orderBy: {
            created_at: 'desc',
        },
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">상담 문의 내역</h1>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">실시간 접수된 고객 상담 요청</p>
                        </div>
                    </div>
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl text-slate-600 hover:text-slate-900 font-bold transition-all shadow-sm border border-slate-100"
                    >
                        <ArrowLeft size={18} />
                        대시보드로 돌아가기
                    </Link>
                </div>

                {inquiries.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm">
                        <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest italic">접수된 문의가 없습니다</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 hover:border-emerald-200 transition-all flex flex-col md:flex-row">
                                <div className="p-8 flex-1">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">신규 문의</div>
                                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                                            <Calendar size={12} /> {format(new Date(inquiry.created_at), 'PPP p', { locale: ko })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">고객성함</p>
                                                    <p className="font-bold text-slate-900">{inquiry.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                                    <Phone size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">연락처</p>
                                                    <a href={`tel:${inquiry.phone}`} className="font-bold text-blue-600 hover:underline">{inquiry.phone}</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                                    <Home size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">관심 매물</p>
                                                    <Link href={`/property/${inquiry.property.slug}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                                                        {inquiry.property.title}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">문의 내용</p>
                                        <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 md:w-20 border-t md:border-t-0 md:border-l border-slate-100 flex items-center justify-center p-4">
                                    <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
