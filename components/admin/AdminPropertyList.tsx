'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import type { Property } from '@prisma/client';
import { useRouter } from 'next/navigation';

export default function AdminPropertyList({ initialProperties }: { initialProperties: Property[] }) {
    const [properties, setProperties] = useState(initialProperties);
    const router = useRouter();

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`'${title}' 매물을 삭제하시겠습니까?`)) {
            try {
                const res = await fetch(`/api/properties/${id}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    setProperties(prev => prev.filter(p => p.id !== id));
                    alert('삭제되었습니다.');
                    router.refresh();
                } else {
                    alert('삭제에 실패했습니다.');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">매물명</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">지역/유형</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">거래/가격</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">상태</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {properties.map((property) => (
                            <tr key={property.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{property.title}</div>
                                    <div className="text-xs text-slate-400 font-medium">ID: {property.id.slice(0, 8)}...</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-slate-700">{property.district}</div>
                                    <div className="text-xs text-slate-500">{property.property_type}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-blue-600">{property.transaction_type}</div>
                                    <div className="text-xs text-slate-500">
                                        {property.transaction_type === '매매'
                                            ? `${(property.sale_price || 0) / 10000}억`
                                            : property.transaction_type === '전세'
                                                ? `${(property.deposit || 0) / 10000}억`
                                                : `${property.deposit}/${property.rent}`}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${property.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {property.status === 'active' ? '진행중' : '완료'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/property/${property.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="보기">
                                            <ExternalLink size={18} />
                                        </Link>
                                        <Link href={`/admin/properties/edit/${property.id}`} className="p-2 text-slate-400 hover:text-amber-600 transition-colors" title="수정">
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(property.id, property.title)}
                                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                            title="삭제"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {properties.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-medium">
                                    등록된 매물이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
