import { NextResponse } from 'next/server';
import { sql, hasDb } from '@/lib/db';
import { createComplianceIntent, mockReceiptUrl } from '@/lib/payments';
import { COMPLIANCE_FEE_CENTS, FEE_PAYER_MODE, feeDisclosure } from '@/lib/config';

const intents = new Map<string, { candidateId: string; status: string }>();
(globalThis as any).__meridianIntents ??= intents;
const store: Map<string, { candidateId: string; status: string }> = (globalThis as any).__meridianIntents;

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const candidateId = String(b?.candidateId ?? '');
  if (!candidateId) return NextResponse.json({ error: 'Candidate is required' }, { status: 400 });
  const intent = await createComplianceIntent(candidateId);
  store.set(intent.intentId, { candidateId, status: 'requires_payment' });
  if (hasDb) {
    try {
      await sql`insert into payments (candidate_id, provider, amount_cents, currency, intent_id, status, payer_mode, receipt_url)
        values (${candidateId}, 'mock-stripe', ${COMPLIANCE_FEE_CENTS}, 'usd', ${intent.intentId}, 'requires_payment', ${FEE_PAYER_MODE}, ${mockReceiptUrl(intent.intentId)})
        on conflict (intent_id) do nothing`;
    } catch { /* demo continues in memory */ }
  }
  return NextResponse.json({ ...intent, disclosure: feeDisclosure() });
}
