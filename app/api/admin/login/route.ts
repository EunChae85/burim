import { NextResponse } from 'next/server';
import * as jose from 'jose';

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').replace(/^["']|["']$/g, '').trim();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'burim1234!').replace(/^["']|["']$/g, '').trim();
const ADMIN_SECRET = (process.env.ADMIN_SECRET || 'fallback-secret-key').replace(/^["']|["']$/g, '').trim();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const secret = new TextEncoder().encode(ADMIN_SECRET);
            const token = await new jose.SignJWT({ role: 'admin' })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('12h')
                .sign(secret);

            const response = NextResponse.json({ success: true });
            response.cookies.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 12, // 12 hours
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
