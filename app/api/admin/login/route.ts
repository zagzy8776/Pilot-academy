import { NextResponse } from 'next/server';
import { ADMIN_TOKEN } from '@/lib/config';
import { adminCookieHeader } from '@/lib/auth';
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const token = String(form?.get('token') ?? '');
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return new NextResponse('Invalid token', { status: 401 });
  }
  const res = NextResponse.redirect(new URL('/admin', req.url));
  res.headers.set('Set-Cookie', adminCookieHeader());
  return res;
}
