-- ============================================================
-- AEC MARKETPLACE - SUPABASE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- USERS TABLE
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  email text,
  contact_number text,
  whatsapp_number text,
  user_type text check (user_type in ('student', 'external')),
  -- Student fields
  department text,
  year text,
  -- External fields
  city text,
  occupation text,
  created_at timestamptz default now()
);

-- PRODUCTS TABLE
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.users(id) on delete cascade,
  name text not null,
  description text,
  price numeric not null,
  category text default 'other',
  images text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- LIKES TABLE
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- WHATSAPP_CLICKS TABLE
create table if not exists public.whatsapp_clicks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete set null,
  product_id uuid references public.products(id) on delete cascade,
  seller_id uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.likes enable row level security;
alter table public.whatsapp_clicks enable row level security;

-- Users policies
create policy "Users can view all profiles" on public.users for select using (true);
create policy "Users can insert own profile" on public.users for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Products policies
create policy "Anyone can view active products" on public.products for select using (is_active = true);
create policy "Authenticated users can insert products" on public.products for insert with check (auth.uid() = seller_id);
create policy "Sellers can update own products" on public.products for update using (auth.uid() = seller_id);

-- Likes policies
create policy "Users can view own likes" on public.likes for select using (auth.uid() = user_id);
create policy "Users can insert likes" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can delete own likes" on public.likes for delete using (auth.uid() = user_id);

-- WhatsApp clicks - allow authenticated insert
create policy "Authenticated users can log clicks" on public.whatsapp_clicks for insert with check (auth.uid() = user_id);
create policy "Allow admin read" on public.whatsapp_clicks for select using (true);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

-- Run in Supabase Storage section or SQL:
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict do nothing;

create policy "Anyone can view product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Authenticated users can upload images" on storage.objects for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "Users can delete own images" on storage.objects for delete using (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- ADMIN VIEW (used by admin dashboard)
-- ============================================================

create or replace view public.admin_stats as
select
  (select count(*) from public.users) as total_users,
  (select count(*) from public.users where user_type = 'student') as total_students,
  (select count(*) from public.users where user_type = 'external') as total_external,
  (select count(distinct seller_id) from public.products where is_active = true) as total_sellers,
  (select count(*) from public.products where is_active = true) as total_products,
  (select count(*) from public.whatsapp_clicks) as total_wa_clicks;
