'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function InquiryForm({ propertyId }: { propertyId: string }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ property_id: propertyId, name, phone, message }),
            });

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[32px] text-center shadow-inner">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-emerald-200">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">문의 접수 완료</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                    문의가 안전하게 접수되었습니다. <br />
                    전담 실장이 영업시간 내에 <br />
                    직접 연락 드리겠습니다.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-xs font-black uppercase tracking-widest text-emerald-600 border-b border-emerald-200"
                >
                    추가 문의하기
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
                <div className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Sparkles size={12} /> 전문가 상담
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">문의 보내기</h3>
            </div>

            <div className="space-y-4">
                <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">고객 성함</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium placeholder:text-slate-300"
                        placeholder="이름을 입력하세요"
                    />
                </div>
                <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">연락처</label>
                    <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium placeholder:text-slate-300"
                        placeholder="010-0000-0000"
                    />
                </div>
                <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">문의 내용</label>
                    <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium placeholder:text-slate-300 resize-none"
                        placeholder="궁금하신 사항을 남겨주세요 (예: 방문 상담 예약)"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-indigo-600 hover:bg-slate-900 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-tighter italic"
            >
                {status === 'loading' ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        처리 중...
                    </>
                ) : (
                    <>
                        <Send size={18} />
                        상담 예약하기
                    </>
                )}
            </button>

            {status === 'error' && (
                <div className="flex items-center gap-2 text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-4">
                    <AlertCircle size={14} /> 문의 전송 실패. 상담 전화로 연락 부탁드립니다.
                </div>
            )}

            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em] leading-relaxed text-center opacity-60">
                보안 인증 플랫폼 <br />
                개인정보는 안전하게 보호됩니다.
            </p>
        </form>
    );
}
