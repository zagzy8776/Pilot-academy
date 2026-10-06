import { NextResponse } from 'next/server';
import { sql, hasDb } from '@/lib/db';
import { profileSchema } from '@/lib/schemas';

const memory: any[] = (globalThis as any).__meridianCandidates ?? ((globalThis as any).__meridianCandidates = []);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid profile' }, { status: 400 });
  const v = parsed.data;
  const id = `cand_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  // candidates.job_id is a uuid FK to jobs(id). The wizard submits the academy
  // programme (e.g. "1"), which is not a uuid, so Postgres would reject the insert.
  // The choice is already preserved in the profile jsonb, so store null in the FK.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const jobId = UUID_RE.test(String(v.jobId ?? '')) ? String(v.jobId) : null;
  if (hasDb) {
    try {
      const rows: any = await sql`insert into candidates (job_id, full_name, email, phone, profile, status)
        values (${jobId}, ${v.fullName}, ${v.email}, ${v.phone || null}, ${JSON.stringify(v)}::jsonb, 'pending_payment')
        returning id::text as id, status`;
      return NextResponse.json({ candidateId: rows[0].id, status: rows[0].status });
    } catch (e) {
      console.error('[applications] insert failed:', e);
      return NextResponse.json({ error: 'Could not save application' }, { status: 500 });
    }
  }
  memory.push({ id, status: 'pending_payment', profile: v });
  return NextResponse.json({ candidateId: id, status: 'pending_payment' });
}
