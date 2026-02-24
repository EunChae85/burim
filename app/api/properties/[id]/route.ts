import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const property = await prisma.property.findUnique({
            where: { id: params.id },
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        const property = await prisma.property.update({
            where: { id: params.id },
            data: {
                title: body.title,
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
                status: body.status || 'active',
                is_featured: !!body.is_featured,
                is_shared: !!body.is_shared,
            },
        });

        return NextResponse.json(property);
    } catch (error: any) {
        console.error('Error updating property:', error);
        return NextResponse.json({ error: error.message || 'Failed to update property' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.property.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Property deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting property:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete property' }, { status: 500 });
    }
}
