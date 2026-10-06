# Meridian Executive Search — Aviation Academy

Elite aviation training & recruitment platform — Next.js 15 + resilient vanilla CSS + Neon Postgres.

## Quick start
1. `npm install`
2. Copy `.env.example` to `.env.local` and add `DATABASE_URL` (Neon **pooled** string). Curated fallback content renders until the DB is connected.
3. `npm run db:setup` — runs `db/schema.sql` then `db/seed.sql` (both idempotent).
4. `npm run dev` — open `/`, `/apply`, `/schedule`, `/admin`.

## Flows
- **Landing (`/`)**: cinematic video hero (`public/media/cockpit.mp4` + `cockpit-poster.jpg`), Partners wall (official EASA/FAA/ICAO/IATA logos), program cards with imagery, a "why Meridian" split section (`public/media/climb.mp4`), stat band, process steps and a closing CTA band.
- **About (`/about`)`, **Programs (`/programs`)`, **Curriculum (`/program-details`)**: image page-heroes, icon feature cards, split media sections, stats and FAQ — all themed aviation.
- **Wizard (`/apply`)**: native React state + server validators. Step 1 profile (conditional sponsorship/mentorship) creates `candidates.status='pending_payment'`. Step 2 vault records `documents` metadata only. Step 3 gate runs mock intent, confirm, then `POST /api/webhooks/stripe` which flips to `verified`. Status stays **Pending** until webhook.
- **Scheduling (`/schedule?candidate=ID`)**: 403-locked until `verified`. Books `slots` into `interviews`.
- **Admin (`/admin`)**: verified-only table with payment intent, mandate, status. Gate via `ADMIN_TOKEN` cookie.

## Database
`npm run db:setup` runs `db/schema.sql` (`create table if not exists`, so it is safe to re-run) and then `db/seed.sql`.

App tables: `partners`, `jobs`, `candidates`, `documents`, `payments`, `webhook_events`, `slots`, `interviews`, `applications`.

- `db/seed.sql` seeds the partners wall with **EASA, FAA, ICAO, IATA**. `partners.name` must match a logo in `public/partners/`; `app/page.tsx` slugifies the name (lowercase, non-alphanumerics stripped) before building `/partners/<slug>.svg`, and falls back to the curated list in `lib/content.ts` if the query fails.
- `candidates.job_id` is a `uuid` FK to `jobs(id)`. The wizard submits a program id such as `"1"`, which is not a uuid, so `app/api/applications/route.ts` stores `null` in the FK and keeps the choice in the `profile` jsonb. Without that guard the insert fails with a 500 the moment the DB is connected.

> **Note:** this database also contains five tables the current code neither creates nor reads —
> `programs`, `faqs`, `rates`, `training_steps` and `schema_migrations`. They were applied by a
> separate migration run (`0001_init.sql`, `0002_application_idempotency.sql`) and hold a full
> FAA flight-school curriculum (Private pilot → Instrument rating → Commercial certificate →
> Zero to airline career, plus hourly rates and student FAQs).

## Payments (mock)
`STRIPE_MODE=mock`, `MOCK_WEBHOOK_SECRET`, `FEE_PAYER_MODE=deferred|mock-employer|mock-candidate`. Swap `lib/payments.ts` with the live Stripe SDK later — same interface, no wizard change.

## Media assets
Place artwork in `public/media/` and authority logos in `public/partners/`:
- `cockpit.mp4` + `cockpit-poster.jpg` — hero background video and poster (airline cockpit).
- `climb.mp4` + `climb-poster.jpg` — "why Meridian" section video and poster.
- `city-plane.jpg`, `plane-clouds.jpg` — page-hero and program-card imagery.
- `partners/easa.svg`, `faa.svg`, `icao.svg`, `iata.svg` — official EASA, FAA, ICAO and IATA logos (full colour), sourced from Wikimedia Commons. Swap in your own licensed files if you hold brand rights.

Swap any file for your own keeping the same filename to restyle the site instantly. All
sections use `object-fit: cover` with tuned focal points, so both portrait and landscape
media work.

## Deploy
Push to GitHub, import into host, set `DATABASE_URL`, `STRIPE_MODE`, `MOCK_WEBHOOK_SECRET`, `FEE_PAYER_MODE`, `ADMIN_TOKEN`.
