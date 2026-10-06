import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const intentId = String(b?.intentId ?? '');
  if (!intentId) return NextResponse.json({ error: 'intentId required' }, { status: 400 });
  await new Promise((r) => setTimeout(r, 1200)); // mock processor latency
  const store: Map<string, any> = (globalThis as any).__meridianIntents ?? new Map();
  const rec = store.get(intentId);
  if (rec) rec.status = 'processing';
  return NextResponse.json({ intentId, status: 'processing', demo: true, note: 'DEMO: no real charge. Webhook confirmation still required.' });
}
