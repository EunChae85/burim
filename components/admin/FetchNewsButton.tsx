'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FetchNewsButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFetch = async () => {
        if (!confirm('새 뉴스를 수집하고 AI 분석을 시작하시겠습니까?\n(약 10~20초 정도 소요될 수 있습니다.)')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/admin/news-fetch');
            const data = await res.json();

            if (res.ok) {
                if (data.articles && data.articles.length > 0) {
                    alert(`${data.articles.length}개의 새로운 뉴스가 수집되었습니다.`);
                    router.refresh();
                } else if (data.message) {
                    alert(data.message);
                } else {
                    alert('새로운 뉴스가 없습니다. (이미 최신이거나 필터에 맞는 뉴스가 없음)');
                }
            } else {
                alert(`오류 발생: ${data.error || '뉴스 수집 중 문제가 발생했습니다.'}`);
            }
        } catch (error) {
            console.error(error);
            alert('네트워크 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleFetch}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <Plus size={20} />
            )}
            {loading ? '수집 및 AI 분석 중...' : '새 뉴스 수집 실행'}
        </button>
    );
}
