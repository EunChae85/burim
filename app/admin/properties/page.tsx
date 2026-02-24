import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import AdminPropertyList from '@/components/admin/AdminPropertyList';

export const revalidate = 0;

export default async function AdminPropertiesPage() {
    const properties = await prisma.property.findMany({
        orderBy: { created_at: 'desc' },
    });

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <Link href="/admin" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-4 transition-colors">
                            <ArrowLeft size={18} />
                            대시보드로 돌아가기
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">등록된 매물 관리</h1>
                        <p className="text-slate-500 text-sm font-medium">총 {properties.length}개의 매물이 등록되어 있습니다.</p>
                    </div>
                    <Link href="/admin/properties/new" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                        <Plus size={20} />
                        신규 매물 등록
                    </Link>
                </div>

                <AdminPropertyList initialProperties={properties} />
            </div>
        </div>
    );
}
