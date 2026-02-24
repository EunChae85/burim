'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, X, Check, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CategoryFilter({ count }: { count: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // We'll use a simple modal-like overlay for filters instead of delicate dropdowns
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const filters = [
        {
            key: 'area', label: '면적', options: [
                { label: '전체', value: '' },
                { label: '33㎡(10평) 이하', value: '0-33' },
                { label: '33㎡~66㎡(10~20평)', value: '33-66' },
                { label: '66㎡~99㎡(20~30평)', value: '66-99' },
                { label: '99㎡(30평) 이상', value: '99-999' },
            ]
        },
        {
            key: 'price', label: '가격', options: [
                { label: '전체', value: '' },
                { label: '1억 이하', value: '0-10000' },
                { label: '1억~3억', value: '10000-30000' },
                { label: '3억~5억', value: '30000-50000' },
                { label: '5억 이상', value: '50000-999999' },
            ]
        },
        {
            key: 'rooms', label: '방 개수', options: [
                { label: '전체', value: '' },
                { label: '1개', value: '1' },
                { label: '2개', value: '2' },
                { label: '3개 이상', value: '3-9' },
            ]
        },
        {
            key: 'direction', label: '방향', options: [
                { label: '전체', value: '' },
                { label: '남향', value: '남향' },
                { label: '동향', value: '동향' },
                { label: '서향', value: '서향' },
                { label: '북향', value: '북향' },
            ]
        },
    ];

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        setActiveFilter(null);
    };

    const handleTransactionChange = (type: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (type === 'all') {
            params.delete('transaction');
        } else {
            params.set('transaction', type);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const currentTransaction = searchParams.get('transaction') || 'all';

    return (
        <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">

                {/* Horizontal Scroll Area */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 flex-1">

                    {/* Transaction Selectors */}
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-full shrink-0">
                        {['all', '매매', 'rent'].map((t) => (
                            <button
                                key={t}
                                onClick={() => handleTransactionChange(t)}
                                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${currentTransaction === t
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {t === 'all' ? '전체' : t === 'rent' ? '전/월세' : t}
                            </button>
                        ))}
                    </div>

                    <div className="w-[1px] h-4 bg-slate-200 shrink-0 mx-2"></div>

                    {/* Filter Tags */}
                    {filters.map((f) => {
                        const currentValue = searchParams.get(f.key);
                        const isActive = !!currentValue;
                        const selectedOption = f.options.find(o => o.value === currentValue);

                        return (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(activeFilter === f.key ? null : f.key)}
                                className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-black uppercase tracking-wider transition-all shrink-0 ${isActive
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                                    }`}
                            >
                                {isActive ? selectedOption?.label : f.label}
                                <ChevronDown size={10} className={`transition-transform duration-200 ${activeFilter === f.key ? 'rotate-180' : ''}`} />
                            </button>
                        );
                    })}
                </div>

                {/* Results Count */}
                <div className="hidden lg:flex items-center shrink-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                        {count} RESULTS
                    </span>
                </div>
            </div>

            {/* Expanded Filter UI - Simple and Robust */}
            {activeFilter && (
                <div className="bg-slate-900 border-t border-slate-800 animate-in slide-in-from-top duration-300">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                {filters.find(f => f.key === activeFilter)?.label} 필터 선택
                            </span>
                            <button
                                onClick={() => setActiveFilter(null)}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {filters.find(f => f.key === activeFilter)?.options.map((opt) => {
                                const isSelected = searchParams.get(activeFilter) === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateFilter(activeFilter, opt.value)}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isSelected
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                                            }`}
                                    >
                                        {opt.label}
                                        {isSelected && <Check size={14} />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
