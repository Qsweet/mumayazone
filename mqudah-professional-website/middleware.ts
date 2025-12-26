import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware(routing);
// Hardcoded to match server-nest JWT_ACCESS_SECRET for stability
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET || "MqudahAccessSecret2025!");

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. API Proxy Logic (Previous)
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/api')) {
        const url = request.nextUrl.clone();
        url.hostname = '127.0.0.1';
        url.port = '3001';
        url.protocol = 'http';
        return NextResponse.rewrite(url);
    }

    // 2. Protected Route Logic (Hardened)
    const isProtected = pathname.includes('/admin') || pathname.includes('/dashboard');
    const isAdminRoute = pathname.includes('/admin');

    if (isProtected) {
        const token = request.cookies.get('token')?.value; // Matching frontend cookie name

        if (!token) {
            return redirectToLogin(request);
        }

        try {
            // VERIFY TOKEN SIGNATURE & ROLE
            const { payload } = await jwtVerify(token, SECRET_KEY);
            const userRole = payload.role as string;
            console.log(`[Middleware] Access Granted: ${payload.email} (${userRole}) to ${pathname}`);

            // RBAC Enforcement
            // Fix: Check role case-insensitively to match DB enum (ADMIN/STUDENT) vs code (admin/user)
            if (isAdminRoute && userRole.toLowerCase().trim() !== 'admin') {
                console.warn(`[Middleware] Unauthorized Admin Access Attempt by ${payload.email} (${userRole})`);
                // Redirect user to their allowed dashboard or home
                const locale = getLocale(request);
                return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
            }

        } catch (error) {
            console.error("[Middleware] Token Verification Failed!");
            console.error(`[Middleware] Token (start): ${token.substring(0, 10)}...`);
            console.error(`[Middleware] Error Name: ${error.name}`);
            console.error(`[Middleware] Error Message: ${error.message}`);
            // Token invalid/expired -> Redirect to Login
            return redirectToLogin(request);
        }
    }

    // 3. Chain with Intl Middleware
    return intlMiddleware(request);
}

function getLocale(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const localeMatch = pathname.match(/\/(en|ar)\//);
    return localeMatch ? localeMatch[1] : (request.cookies.get('NEXT_LOCALE')?.value || 'en');
}

function redirectToLogin(request: NextRequest) {
    const locale = getLocale(request);
    const redirectUrl = new URL(`/${locale}/login`, request.url);
    // Add return URL for better UX
    redirectUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
}

export const config = {
    matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};
