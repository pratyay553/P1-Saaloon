import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasAuthCookie = request.cookies.has('is_auth');

  // Define the routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/signin') || request.nextUrl.pathname.startsWith('/signup');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  console.log(`Middleware running for path: ${request.nextUrl.pathname}, hasAuthCookie: ${hasAuthCookie}`);

  if (isProtectedRoute && !hasAuthCookie) {
    console.log("Redirecting to /signin because user lacks is_auth cookie on a protected route");
    const signinUrl = new URL('/signin', request.url);
    signinUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }

  if (isAuthRoute && hasAuthCookie) {
    console.log("Redirecting to /dashboard because user has is_auth cookie on an auth route");
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
