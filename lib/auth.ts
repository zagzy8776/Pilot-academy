import { cookies } from 'next/headers';
import { ADMIN_TOKEN } from '@/lib/config';

export async function isAdmin() {
  if (!ADMIN_TOKEN) return true; // dev convenience until ADMIN_TOKEN is set
  const store = await cookies();
  return store.get('meridian_admin')?.value === ADMIN_TOKEN;
}

export function adminCookieHeader() {
  return `meridian_admin=${ADMIN_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
}
