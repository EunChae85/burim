import PropertyList from '@/components/PropertyList';
import { prisma } from '@/lib/prisma';
import { SlidersHorizontal } from 'lucide-react';
import CategoryFilter from './CategoryFilter';

export const revalidate = 60;

export default async function CategoryLayout({
    title,
    description,
    districtFilter,
    typeFilter,
    statusFilter,
    searchParams,
}: {
    title: string;
    description: string;
    districtFilter?: string;
    typeFilter?: string | string[];
    statusFilter?: string;
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { status: statusFilter || 'active' };

    if (districtFilter) where.district = districtFilter;

    if (typeFilter) {
        if (Array.isArray(typeFilter)) {
            where.property_type = { in: typeFilter };
        } else {
            where.property_type = typeFilter;
        }
    }

    // Helper to get single value from potentially array param
    const getParam = (p: string | string[] | undefined) => Array.isArray(p) ? p[0] : p;

    // Apply transaction filter from searchParams
    const transaction = getParam(searchParams?.transaction);
    if (transaction) {
        if (transaction === 'rent' || transaction === '전/월세') {
            where.transaction_type = { in: ['전세', '월세'] };
        } else if (transaction === '매매') {
            where.transaction_type = '매매';
        }
    }

    // Apply search query from searchParams
    const query = getParam(searchParams?.q);
    if (query?.trim()) {
        const q = query.trim();
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { district: { contains: q, mode: 'insensitive' } },
            { property_type: { contains: q, mode: 'insensitive' } },
        ];
    }

    const andConditions = [];

    // Area filter
    const areaRange = getParam(searchParams?.area);
    if (areaRange?.includes('-')) {
        const [min, max] = areaRange.split('-').map(Number);
        andConditions.push({ area: { gte: min, lte: max } });
    }

    // Price filter
    const priceRange = getParam(searchParams?.price);
    if (priceRange?.includes('-')) {
        const [min, max] = priceRange.split('-').map(Number);
        if (where.transaction_type === '매매') {
            andConditions.push({ sale_price: { gte: min, lte: max } });
        } else if (where.transaction_type) {
            // 전세 or 월세 (rent)
            andConditions.push({ deposit: { gte: min, lte: max } });
        } else {
            // No transaction type selected, match either sale_price or deposit
            andConditions.push({
                OR: [
                    { sale_price: { gte: min, lte: max } },
                    { deposit: { gte: min, lte: max } }
                ]
            });
        }
    }

    // Rooms filter
    const rooms = getParam(searchParams?.rooms);
    if (rooms) {
        if (rooms.includes('-')) {
            const [min, max] = rooms.split('-').map(Number);
            andConditions.push({ options: { path: ['room_count'], gte: min.toString(), lte: max.toString() } });
        } else {
            andConditions.push({ options: { path: ['room_count'], equals: rooms } });
        }
    }

    // Direction filter
    const direction = getParam(searchParams?.direction);
    if (direction) {
        andConditions.push({
            options: {
                path: ['direction'],
                equals: direction
            }
        });
    }

    if (andConditions.length > 0) {
        where.AND = andConditions;
    }

    console.log('--- Property Query ---', JSON.stringify(where, null, 2));

    const properties = await prisma.property.findMany({
        where,
        orderBy: [
            { is_featured: 'desc' },
            { created_at: 'desc' },
        ],
    });

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Category Header */}
            <div className="bg-white border-b border-slate-200 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="uppercase tracking-widest text-blue-600 font-black text-xs mb-3 flex items-center gap-2">
                        <SlidersHorizontal size={14} /> 매물 컬렉션
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">{title}</h1>
                    <p className="text-slate-500 font-medium max-w-2xl">{description}</p>
                </div>
            </div>

            {/* Filter Bar */}
            <CategoryFilter count={properties.length} />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <PropertyList properties={properties} />
            </div>
        </div>
    );
}
