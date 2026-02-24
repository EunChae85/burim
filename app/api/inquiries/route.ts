import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { property_id, name, phone, message } = body;

        if (!property_id || !name || !phone || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newInquiry = await prisma.inquiry.create({
            data: {
                property_id,
                name,
                phone,
                message,
            },
        });

        // TODO: Send Email, SMS, Kakao Alimtalk
        console.log('Sending notification for new inquiry:', newInquiry);

        return NextResponse.json(newInquiry, { status: 201 });
    } catch (error) {
        console.error('Error creating inquiry:', error);
        return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
    }
}
