import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.warn('[db] DATABASE_URL is not set. Pages will use fallback data until configured.');
}

// Lazy proxy: only throws when actually queried without a URL, so `next build` succeeds.
export const sql: any = url
  ? neon(url)
  : new Proxy(
      {},
      {
        get: (_t, prop) => {
          if (prop === 'then') return undefined;
          throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.');
        },
      },
    );

export const hasDb = Boolean(url);
