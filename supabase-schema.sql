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

create table if not exists public.garages (
  id text primary key,
  block text not null check (block in ('A блок', 'B блок', 'C блок')),
  number text not null,
  floor text not null,
  area text not null,
  price text not null,
  status text default 'available' check (status in ('available', 'reserved', 'sold')),
  image text not null default '/zogsool.jpg',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.chatbot_leads (
  id uuid primary key,
  name text not null,
  phone text not null,
  apartment_type text default '',
  message text default '',
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id text primary key,
  name text not null,
  address text not null,
  latitude double precision,
  longitude double precision,
  map_embed_url text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.apartments enable row level security;
alter table public.inquiries enable row level security;
alter table public.garages enable row level security;
alter table public.chatbot_leads enable row level security;
alter table public.projects enable row level security;

drop policy if exists "Public can read apartments" on public.apartments;
create policy "Public can read apartments"
  on public.apartments for select
  using (true);

drop policy if exists "Public can read garages" on public.garages;
create policy "Public can read garages"
  on public.garages for select
  using (true);

drop policy if exists "Public can create inquiries" on public.inquiries;
create policy "Public can create inquiries"
  on public.inquiries for insert
  with check (true);

drop policy if exists "Public can create chatbot leads" on public.chatbot_leads;
create policy "Public can create chatbot leads"
  on public.chatbot_leads for insert
  with check (true);

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select
  using (true);

insert into public.projects (id, name, address, latitude, longitude, map_embed_url)
values (
  'toonot-eco',
  'Тоонот Эко apartment',
  'Тоонот Эко apartment',
  null,
  null,
  'https://maps.google.com/maps?q=%D0%A2%D0%BE%D0%BE%D0%BD%D0%BE%D1%82%20%D0%AD%D0%BA%D0%BE%20apartment&t=&z=15&ie=UTF8&iwloc=&output=embed'
)
on conflict (id) do update
set
  name = excluded.name,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  map_embed_url = excluded.map_embed_url,
  updated_at = now();

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
