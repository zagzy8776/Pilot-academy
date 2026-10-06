import { COMPLIANCE_FEE_CENTS, STRIPE_MODE } from '@/lib/config';

export type PaymentIntent = {
  intentId: string;
  clientSecret: string;
  amountCents: number;
  currency: string;
  mode: string;
};

function mockId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

// Mock Stripe provider. Clearly labelled DEMO, no real charge.
// Swap with Stripe live SDK by implementing the same interface.
export async function createComplianceIntent(candidateId: string): Promise<PaymentIntent> {
  const intentId = mockId('pi_mock');
  return {
    intentId,
    clientSecret: `${intentId}_secret_mock`,
    amountCents: COMPLIANCE_FEE_CENTS,
    currency: 'usd',
    mode: STRIPE_MODE,
  };
}

export function mockReceiptUrl(intentId: string) {
  return `/apply/success?receipt=${encodeURIComponent(intentId)}`;
}
