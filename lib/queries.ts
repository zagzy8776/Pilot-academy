import { sql, hasDb } from '@/lib/db';
import {
  fallbackPrograms,
  fallbackRates,
  fallbackFaqs,
  fallbackTrainingSteps,
  type Program,
  type Rate,
  type Faq,
  type TrainingStep,
} from '@/lib/content';

// Every reader falls back to the curated list in lib/content.ts when the
// database is unreachable, so the marketing pages cannot 500 on a cold DB.
async function load<T>(run: () => Promise<any>, fallback: T): Promise<T> {
  if (!hasDb) return fallback;
  try {
    const rows = await run();
    return rows?.length ? (rows as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getPrograms(): Promise<Program[]> {
  return load(
    () => sql`select id, slug, name, summary, min_hours, typical_hours, price_low, price_high, price_note, featured, sort from programs order by sort`,
    fallbackPrograms,
  );
}

export function getRates(): Promise<Rate[]> {
  return load(
    () => sql`select id, label, low, high, unit, sort from rates order by sort`,
    fallbackRates,
  );
}

export function getFaqs(): Promise<Faq[]> {
  return load(
    () => sql`select id, question, answer, sort from faqs order by sort`,
    fallbackFaqs,
  );
}

export function getTrainingSteps(): Promise<TrainingStep[]> {
  return load(
    () => sql`select id, title, body, sort from training_steps order by sort`,
    fallbackTrainingSteps,
  );
}

export function priceRange(p: Pick<Program, 'price_low' | 'price_high'>): string | null {
  if (p.price_low == null || p.price_high == null) return null;
  return `$${p.price_low.toLocaleString('en-US')} to $${p.price_high.toLocaleString('en-US')}`;
}

export function rateRange(r: Pick<Rate, 'low' | 'high'>): string {
  return `$${r.low.toLocaleString('en-US')} to $${r.high.toLocaleString('en-US')}`;
}
