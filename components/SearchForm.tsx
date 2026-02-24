'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

export default function SearchForm() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/all?q=${encodeURIComponent(query.trim())}`);
        } else {
            router.push('/all');
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative max-w-4xl mx-auto group">
            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white p-2 rounded-2xl flex items-center shadow-2xl border border-white/20">
                <div className="pl-4 pr-2 text-slate-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="어떤 매물을 찾으시나요? (예: 매교동 20평 상가)"
                    className="flex-1 bg-transparent py-4 text-slate-700 outline-none font-medium"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center gap-2 uppercase tracking-tight"
                >
                    검색하기
                    <ArrowRight size={18} />
                </button>
            </div>
        </form>
    );
}
