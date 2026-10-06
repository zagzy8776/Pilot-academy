import { NextResponse } from 'next/server';
import { sql, hasDb } from '@/lib/db';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get('candidateId') ?? '';
  if (!candidateId) return NextResponse.json({ status: 'unknown' });
  if (hasDb) {
    try {
      const rows: any = await sql`select status from candidates where id=${candidateId}`;
      return NextResponse.json({ status: rows?.[0]?.status ?? 'unknown' });
    } catch { return NextResponse.json({ status: 'unknown' }); }
  }
  const verified: Set<string> = (globalThis as any).__meridianVerified ?? new Set();
  const cands: any[] = (globalThis as any).__meridianCandidates ?? [];
  const c = cands.find((x) => x.id === candidateId);
  return NextResponse.json({ status: verified.has(candidateId) ? 'verified' : c?.status ?? 'pending_payment' });
}
