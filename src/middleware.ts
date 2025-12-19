// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/unauthorized', '/viewer'];

// List of protected routes that require authentication
const protectedRoutes = ['/farmer', '/retailer', '/inspector', '/logistics', '/packaging'];

// List of static files and API routes to exclude
const staticFiles = [
  '/_next',
  '/favicon.ico',
  '/api',
  '/_vercel',
  '/vercel.svg',
  '/vercel.svg?width=180&height=180',
  '/(.*)\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|mp4|webm|wav|mp3|m4a|aac|oga)$',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes and static files
  if (
    publicRoutes.some(route => pathname.startsWith(route)) ||
    staticFiles.some(staticFile => pathname.startsWith(staticFile)) ||
    staticFiles.some(staticFile => new RegExp(staticFile).test(pathname))
  ) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // For protected routes, let client-side auth handle the checks
    return NextResponse.next();
  }

  // Only redirect root path to viewer, let other routes pass through
  if (pathname === '/') {
    const viewerUrl = new URL('/viewer', request.url);
    return NextResponse.redirect(viewerUrl);
  }

  // For all other routes, let them pass through to client-side routing
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\..*).*)',
  ],
};
