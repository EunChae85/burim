import SiteSettingsManager from '@/components/admin/SiteSettingsManager';
import Link from 'next/link';
import { Home, LayoutDashboard, MessageSquare, Settings, Newspaper } from 'lucide-react';

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                            <LayoutDashboard size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">관리자 대시보드</h1>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">부림부동산 플랫폼 관리</p>
                        </div>
                    </div>
                    <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
                        <Home size={18} />
                        홈으로 돌아가기
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 group hover:border-blue-200 transition-all">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <LayoutDashboard size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 mb-2 uppercase italic">매물 관리</h2>
                                <p className="text-slate-500 text-sm font-medium mb-6">매물을 등록하고 수정하거나 삭제할 수 있습니다.</p>
                                <div className="space-y-3">
                                    <Link href="/admin/properties/new" className="block text-center w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-all uppercase tracking-tight italic shadow-lg shadow-slate-200">신규 매물 등록</Link>
                                    <Link href="/admin/properties" className="block text-center w-full bg-slate-100 text-slate-900 font-black py-3 rounded-xl hover:bg-slate-200 transition-all uppercase tracking-tight italic">등록된 매물 보기</Link>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 group hover:border-emerald-200 transition-all">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <MessageSquare size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 mb-2 uppercase italic">문의 내역</h2>
                                <p className="text-slate-500 text-sm font-medium mb-6">고객님이 남기신 상담 예약 정보를 확인하세요.</p>
                                <Link href="/admin/inquiries" className="block text-center w-full bg-slate-100 text-slate-900 font-black py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all uppercase tracking-tight italic">문의 확인하기</Link>
                            </div>

                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 group hover:border-blue-200 transition-all">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Newspaper size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 mb-2 uppercase italic">뉴스/소식 관리</h2>
                                <p className="text-slate-500 text-sm font-medium mb-6">수집된 뉴스를 편집하고 발행할 수 있습니다.</p>
                                <Link href="/admin/news" className="block text-center w-full bg-slate-100 text-slate-900 font-black py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all uppercase tracking-tight italic">뉴스 관리하기</Link>
                            </div>
                        </div>

                        {/* Additional Admin Tools could go here */}
                    </div>

                    <div className="lg:col-span-1">
                        <SiteSettingsManager />
                    </div>
                </div>
            </div>
        </div>
    );
}
