import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        let settings = await prisma.siteSettings.findUnique({
            where: { id: 'singleton' },
        });

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    id: 'singleton',
                    phone: '031-123-4567',
                    address: '경기도 수원시 팔달구 매교동 123-45',
                    office_name: '부림공인중개사사무소',
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { phone, address, office_name } = body;

        const settings = await prisma.siteSettings.upsert({
            where: { id: 'singleton' },
            update: { phone, address, office_name },
            create: { id: 'singleton', phone, address, office_name },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Failed to update settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
