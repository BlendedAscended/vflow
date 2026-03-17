import { NextRequest, NextResponse } from 'next/server';

/**
 * Subdomain routing middleware
 *
 * agency.verbaflowllc.com      → redirects to /agency
 * agency.verbaflowllc.com/foo  → redirects to /agency/foo (preserves path)
 * All other requests            → pass through unchanged
 */
export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') ?? '';

  // Match agency subdomain (prod + local dev)
  const isAgencySubdomain =
    hostname.startsWith('agency.') ||
    hostname === 'agency.verbaflowllc.com' ||
    hostname === 'agency.localhost';

  if (isAgencySubdomain) {
    const { pathname, search } = req.nextUrl;

    // Already on /agency path — pass through
    if (pathname.startsWith('/agency')) {
      return NextResponse.next();
    }

    // Redirect root + sub-paths to /agency equivalent
    const redirectPath = pathname === '/' ? '/agency' : `/agency${pathname}`;
    const url = req.nextUrl.clone();
    url.hostname = url.hostname.replace(/^agency\./, '');
    url.pathname = redirectPath;
    url.search = search;

    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static assets and API routes that don't need it
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
