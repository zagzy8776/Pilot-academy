-- Meridian Executive Search schema (PostgreSQL / Neon)
create table if not exists partners (
  id serial primary key,
  name text not null,
  tier text not null default 'platinum',
  sort int not null default 0
);
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  firm_alias text not null,
  location text not null,
  comp_band text not null,
  engagement text not null default 'Retained',
  clearance text not null default 'Executive',
  status text not null default 'active',
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id),
  full_name text not null,
  email text not null,
  phone text,
  profile jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists candidates_email_idx on candidates (email);
create index if not exists candidates_status_idx on candidates (status);
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  kind text not null,
  filename text not null,
  mime text not null,
  size_bytes int not null,
  storage_key text not null,
  sha256 text,
  created_at timestamptz not null default now()
);
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  provider text not null default 'mock-stripe',
  amount_cents int not null,
  currency text not null default 'usd',
  intent_id text unique not null,
  status text not null default 'requires_payment',
  payer_mode text not null default 'deferred',
  receipt_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text unique not null,
  event_type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);
create table if not exists slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  partner text not null default 'Senior Partner Panel',
  taken_by uuid references candidates(id),
  created_at timestamptz not null default now()
);
create table if not exists interviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  slot_id uuid not null references slots(id),
  notes text,
  created_at timestamptz not null default now(),
  unique (slot_id)
);
-- legacy table kept for backwards compatibility
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  program_slug text,
  start_window text,
  notes text,
  created_at timestamptz not null default now()
);
-- Academy catalogue. Read by lib/queries.ts and seeded by db/seed.sql.
create table if not exists programs (
  id integer primary key,
  slug text not null unique,
  name text not null,
  summary text not null,
  min_hours text,
  typical_hours text,
  price_low integer,
  price_high integer,
  price_note text,
  featured boolean not null default false,
  sort integer not null default 0
);
-- Relax legacy NOT NULL constraints so a track can be quoted on request.
alter table programs alter column min_hours drop not null;
alter table programs alter column typical_hours drop not null;
alter table programs alter column price_low drop not null;
alter table programs alter column price_high drop not null;
alter table programs alter column price_note drop not null;
create table if not exists rates (
  id integer primary key,
  label text not null,
  low integer not null,
  high integer not null,
  unit text not null,
  sort integer not null default 0
);
create table if not exists faqs (
  id integer primary key,
  question text not null,
  answer text not null,
  sort integer not null default 0
);
create table if not exists training_steps (
  id integer primary key,
  title text not null,
  body text not null,
  sort integer not null default 0
);
