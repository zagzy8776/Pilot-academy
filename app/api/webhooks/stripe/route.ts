import { NextResponse } from 'next/server';
import { sql, hasDb } from '@/lib/db';
import { MOCK_WEBHOOK_SECRET } from '@/lib/config';

export async function POST(req: Request) {
  const secret = req.headers.get('x-mock-webhook-secret');
  if (secret !== MOCK_WEBHOOK_SECRET && secret !== 'dev-mock-secret') {
    return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 401 });
  }
  const b = await req.json().catch(() => null);
  const intentId = String(b?.intentId ?? '');
  if (!intentId) return NextResponse.json({ error: 'intentId required' }, { status: 400 });
  const eventId = `evt_mock_${intentId}`;
  if (hasDb) {
    try {
      await sql`insert into webhook_events (provider, event_id, event_type, payload)
        values ('mock-stripe', ${eventId}, 'payment_intent.succeeded', ${JSON.stringify({ intentId })}::jsonb)
        on conflict (event_id) do nothing`;
      const rows: any = await sql`update payments set status='succeeded', updated_at=now() where intent_id=${intentId} returning candidate_id::text as cid`;
      const cid = rows?.[0]?.cid;
      if (cid) await sql`update candidates set status='verified', updated_at=now() where id=${cid}`;
    } catch (e) { return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 }); }
  } else {
    const store: Map<string, any> = (globalThis as any).__meridianIntents ?? new Map();
    const rec = store.get(intentId);
    if (rec) rec.status = 'succeeded';
    const cands: any[] = (globalThis as any).__meridianCandidates ?? [];
    const c = cands.find((x) => x.id === rec?.candidateId);
    if (c) c.status = 'verified';
    (globalThis as any).__meridianVerified ??= new Set<string>();
    if (rec?.candidateId) (globalThis as any).__meridianVerified.add(rec.candidateId);
  }
  return NextResponse.json({ ok: true, intentId, status: 'verified' });
}
