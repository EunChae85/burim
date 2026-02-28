'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle, ArrowLeft, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface NewsEditorProps {
    news: any;
}

export default function NewsEditor({ news }: NewsEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        aiTitle: news.aiTitle || '',
        aiContent: news.aiContent || '',
        status: news.status,
    });

    const handleSave = async (statusOverride?: string) => {
        setLoading(true);
        const targetStatus = statusOverride || formData.status;

        try {
            const res = await fetch(`/api/admin/news/${news.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    status: targetStatus,
                }),
            });

            if (res.ok) {
                alert('저장되었습니다.');
                if (statusOverride) {
                    router.push('/admin/news');
                } else {
                    router.refresh();
                }
            } else {
                alert('저장 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error(error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('정말로 이 뉴스를 삭제하시겠습니까?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/news/${news.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.push('/admin/news');
            } else {
                alert('삭제 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error(error);
            alert('삭제 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <Link href="/admin/news" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
                    <ArrowLeft size={20} />
                    목록으로 돌아가기
                </Link>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSave()}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                    >
                        <Save size={20} />
                        임시 저장
                    </button>
                    <button
                        onClick={() => handleSave('PUBLISHED')}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                        <CheckCircle size={20} />
                        발행하기
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">리포트 제목</label>
                        <input
                            type="text"
                            value={formData.aiTitle}
                            onChange={(e) => setFormData({ ...formData, aiTitle: e.target.value })}
                            className="w-full text-2xl font-black text-slate-900 border-none p-0 focus:ring-0 placeholder:text-slate-200"
                            placeholder="제목을 입력하세요..."
                        />
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">리포트 분석 내용</label>
                        <textarea
                            value={formData.aiContent}
                            onChange={(e) => setFormData({ ...formData, aiContent: e.target.value })}
                            className="w-full h-[600px] text-slate-800 border-none p-0 focus:ring-0 placeholder:text-slate-200 resize-none leading-relaxed"
                            placeholder="내용을 입력하세요..."
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 uppercase italic mb-6">뉴스 정보</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">상태</p>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${formData.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                                    {formData.status === 'PUBLISHED' ? '발행완료' : '임시저장'}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">출처</p>
                                <p className="text-sm font-bold text-slate-700">{news.sourceName}</p>
                                <a href={news.sourceUrl} target="_blank" className="text-xs text-blue-600 flex items-center gap-1 mt-1 hover:underline">
                                    원문 링크 보기 <ExternalLink size={12} />
                                </a>
                            </div>
                            <div className="pt-6 border-t border-slate-50">
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 text-red-400 hover:text-red-600 font-bold text-sm transition-colors"
                                >
                                    <Trash2 size={16} />
                                    이 뉴스 삭제하기
                                </button>
                            </div>
                        </div>
                    </div>

                    {news.factBlock && (
                        <div className="bg-blue-50/50 p-8 rounded-[32px] border border-blue-100">
                            <h3 className="text-sm font-black text-blue-900 uppercase italic mb-4">FACT CHECK</h3>
                            <div className="text-sm text-blue-800 whitespace-pre-wrap leading-relaxed">
                                {news.factBlock}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
