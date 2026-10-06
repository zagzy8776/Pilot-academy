import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Admin UI handles its own cookie gate; API routes enforce verification + admin token.
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('x-meridian-confidential', 'true');
  return res;
}
export const config = { matcher: ['/admin/:path*', '/api/admin/:path*', '/schedule/:path*'] };
