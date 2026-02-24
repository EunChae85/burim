import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const property_type = searchParams.get('property_type');
    const transaction_type = searchParams.get('transaction_type');
    const is_featured = searchParams.get('is_featured');
    const limitStr = searchParams.get('limit');

    const limit = limitStr ? parseInt(limitStr, 10) : 50;

    try {
        const properties = await prisma.property.findMany({
            where: {
                ...(district && { district }),
                ...(property_type && { property_type }),
                ...(transaction_type && { transaction_type }),
                ...(is_featured && { is_featured: is_featured === 'true' }),
                status: 'active',
            },
            take: limit,
            orderBy: [
                { is_featured: 'desc' },
                { created_at: 'desc' },
            ],
        });

        return NextResponse.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Generate slug from title if not provided (simple version)
        const slug = body.slug || `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

        const property = await prisma.property.create({
            data: {
                title: body.title,
                slug: slug,
                district: body.district,
                property_type: body.property_type,
                transaction_type: body.transaction_type,
                deposit: parseInt(body.deposit),
                rent: body.rent ? parseInt(body.rent) : null,
                sale_price: body.sale_price ? parseInt(body.sale_price) : null,
                area: parseFloat(body.area),
                floor: body.floor,
                total_floor: body.total_floor,
                maintenance_fee: parseInt(body.maintenance_fee),
                options: body.options || {},
                location_desc: body.location_desc || null,
                elevator: !!body.elevator,
                parking: !!body.parking,
                thumbnail: body.thumbnail || '',
                images: body.images || [],
                status: 'active',
                is_featured: !!body.is_featured,
                is_shared: !!body.is_shared,
            }
        });

        return NextResponse.json(property, { status: 201 });
    } catch (error: any) {
        console.error('Error creating property:', error);
        return NextResponse.json({ error: error.message || 'Failed to create property' }, { status: 500 });
    }
}
