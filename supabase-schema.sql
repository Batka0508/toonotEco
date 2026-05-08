create table if not exists public.apartments (
  id text primary key,
  title text not null,
  description text default '',
  area text not null,
  price text not null,
  total text not null,
  location text default '',
  district text default '',
  rooms text default '',
  floor text default '',
  total_floors text default '',
  status text default 'available' check (status in ('available', 'sold', 'reserved')),
  image text not null default '/placeholder.jpg',
  images jsonb not null default '[]'::jsonb,
  floor_plan_image text default '',
  amenities jsonb not null default '[]'::jsonb,
  tag text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.inquiries (
  id uuid primary key,
  user_id text,
  name text not null,
  phone text not null,
  email text default '',
  apartment text default '',
  message text default '',
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz default now(),
  status text default 'new' check (status in ('new', 'contacted', 'closed', 'read'))
);

alter table public.apartments enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "Public can read apartments" on public.apartments;
create policy "Public can read apartments"
  on public.apartments for select
  using (true);

drop policy if exists "Public can create inquiries" on public.inquiries;
create policy "Public can create inquiries"
  on public.inquiries for insert
  with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
