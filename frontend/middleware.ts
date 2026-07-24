import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('auth_token')?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith('/admin/login');
  
  // Exclude API routes and public assets from middleware check if needed,
  // but we are specifically matching /admin paths via the matcher.
  
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (session) {
    const parsed = await verifyToken(session);
    if (!parsed && !isAuthRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (parsed && isAuthRoute) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
