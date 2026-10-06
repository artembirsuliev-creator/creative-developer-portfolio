create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (char_length(btrim(author_name)) between 2 and 80),
  body text not null check (char_length(btrim(body)) between 20 and 1200),
  rating smallint not null check (rating between 1 and 5),
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists reviews_published_latest_idx
  on public.reviews (created_at desc)
  where status = 'published';

alter table public.reviews enable row level security;

revoke all on table public.reviews from public, anon, authenticated;
grant select, insert on table public.reviews to service_role;
