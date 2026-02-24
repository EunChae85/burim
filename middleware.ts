import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes except /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !pathname.startsWith('/api/admin/login')) {
        const token = request.cookies.get('admin_token')?.value;
        console.log(`--- Middleware: ${pathname} ---`, { hasToken: !!token });

        if (!token) {
            console.log('No token found, redirecting to /admin/login');
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            const secretVal = (process.env.ADMIN_SECRET || 'fallback-secret-key').replace(/^["']|["']$/g, '').trim();
            const secret = new TextEncoder().encode(secretVal);
            await jose.jwtVerify(token, secret);
            console.log('Token verified successfully');
            return NextResponse.next();
        } catch (error: any) {
            console.log('Token verification failed:', error.message);
            // Invalid token, redirect to login and clear cookie
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_token');
            return response;
        }
    }

    // Protect /api/admin routes (except login)
    if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
        const token = request.cookies.get('admin_token')?.value || request.headers.get('Authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        try {
            const secretVal = (process.env.ADMIN_SECRET || 'fallback-secret-key').replace(/^["']|["']$/g, '').trim();
            const secret = new TextEncoder().encode(secretVal);
            await jose.jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
