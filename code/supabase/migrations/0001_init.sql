-- Quant Library - initial schema + RLS + RPCs

-- Extensions (pgcrypto gives gen_random_uuid)
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'));
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = user_id
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  content_type text not null check (content_type in ('algorithm', 'formula', 'proof', 'paper', 'code', 'strategy')),
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  tags text[] not null default '{}'::text[],
  abstract text,
  body_md text,
  code_snippet text,
  author_name text not null,
  source_url text,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  publish_status text not null default 'published' check (publish_status in ('published', 'archived')),
  search_tsv tsvector generated always as (
    -- NOTE: generated columns require IMMUTABLE expressions; cast configs to regconfig.
    setweight(to_tsvector('english'::regconfig, coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english'::regconfig, coalesce(abstract, '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(body_md, '')), 'C') ||
    setweight(to_tsvector('simple'::regconfig, array_to_string(coalesce(tags, '{}'::text[]), ' ')), 'B')
  ) stored
);

create unique index if not exists library_items_slug_unique on public.library_items (slug);
create index if not exists library_items_created_at_idx on public.library_items (created_at desc);
create index if not exists library_items_publish_status_idx on public.library_items (publish_status);
create index if not exists library_items_tags_gin on public.library_items using gin (tags);
create index if not exists library_items_search_tsv_gin on public.library_items using gin (search_tsv);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content_type text not null check (content_type in ('algorithm', 'formula', 'proof', 'paper', 'code', 'strategy')),
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  tags text[] not null default '{}'::text[],
  abstract text,
  body_md text,
  code_snippet text,
  author_name text not null,
  source_url text,
  submitted_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists submissions_submitted_by_idx on public.submissions (submitted_by);
create index if not exists submissions_status_idx on public.submissions (status);
create index if not exists submissions_created_at_idx on public.submissions (created_at desc);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

drop trigger if exists library_items_set_updated_at on public.library_items;
create trigger library_items_set_updated_at
before update on public.library_items
for each row execute procedure public.set_updated_at();

drop trigger if exists submissions_set_updated_at on public.submissions;
create trigger submissions_set_updated_at
before update on public.submissions
for each row execute procedure public.set_updated_at();

create or replace function public.library_items_set_slug()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_slug text;
begin
  if new.slug is null or length(trim(new.slug)) = 0 then
    base_slug := public.slugify(new.title);
    new.slug := base_slug;
    if exists(select 1 from public.library_items li where li.slug = new.slug) then
      new.slug := base_slug || '-' || substr(new.id::text, 1, 8);
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists library_items_before_insert_slug on public.library_items;
create trigger library_items_before_insert_slug
before insert on public.library_items
for each row execute procedure public.library_items_set_slug();

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.library_items enable row level security;
alter table public.submissions enable row level security;

-- Profiles: users can read/update their own profile.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- Library items: everyone can read published, admin can manage all.
drop policy if exists library_items_read_published on public.library_items;
create policy library_items_read_published
on public.library_items
for select
to anon, authenticated
using (publish_status = 'published');

drop policy if exists library_items_admin_read_all on public.library_items;
create policy library_items_admin_read_all
on public.library_items
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists library_items_admin_insert on public.library_items;
create policy library_items_admin_insert
on public.library_items
for insert
to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists library_items_admin_update on public.library_items;
create policy library_items_admin_update
on public.library_items
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists library_items_admin_delete on public.library_items;
create policy library_items_admin_delete
on public.library_items
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- Submissions: authenticated users can create; users see their own; admin sees/updates all.
drop policy if exists submissions_insert_own on public.submissions;
create policy submissions_insert_own
on public.submissions
for insert
to authenticated
with check (auth.uid() = submitted_by);

drop policy if exists submissions_select_own on public.submissions;
create policy submissions_select_own
on public.submissions
for select
to authenticated
using (auth.uid() = submitted_by);

drop policy if exists submissions_admin_select_all on public.submissions;
create policy submissions_admin_select_all
on public.submissions
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists submissions_admin_update on public.submissions;
create policy submissions_admin_update
on public.submissions
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists submissions_admin_delete on public.submissions;
create policy submissions_admin_delete
on public.submissions
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

create or replace function public.search_library_items(
  q text,
  content_type text default null,
  difficulty text default null,
  tags text[] default null,
  sort text default 'relevance',
  limit_n int default 50,
  offset_n int default 0
)
returns table (
  id uuid,
  title text,
  slug text,
  content_type text,
  difficulty text,
  tags text[],
  abstract text,
  body_md text,
  code_snippet text,
  author_name text,
  source_url text,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz,
  publish_status text,
  rank real
)
language sql
stable
set search_path = public
as $$
  with base as (
    select
      li.*,
      case
        when q is null or q = '' then 0::real
        else ts_rank_cd(li.search_tsv, websearch_to_tsquery('english'::regconfig, q))::real
      end as rank
    from public.library_items li
    where li.publish_status = 'published'
      and (
        q is null
        or q = ''
        or li.search_tsv @@ websearch_to_tsquery('english'::regconfig, q)
      )
      and (content_type is null or li.content_type = content_type)
      and (difficulty is null or li.difficulty = difficulty)
      and (tags is null or tags = '{}'::text[] or li.tags @> tags)
  )
  select
    id, title, slug, content_type, difficulty, tags, abstract, body_md, code_snippet,
    author_name, source_url, created_by, created_at, updated_at, publish_status, rank
  from base
  order by
    case when sort = 'newest' then created_at end desc nulls last,
    case when sort <> 'newest' then rank end desc nulls last,
    created_at desc
  limit limit_n offset offset_n;
$$;

create or replace function public.approve_submission(submission_id uuid, notes text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.submissions%rowtype;
  new_item_id uuid;
  new_slug text;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  select * into s
  from public.submissions
  where id = submission_id
  for update;

  if not found then
    raise exception 'submission not found';
  end if;

  if s.status <> 'pending' then
    raise exception 'submission is not pending';
  end if;

  new_item_id := gen_random_uuid();
  new_slug := public.slugify(s.title);
  if exists (select 1 from public.library_items where slug = new_slug) then
    new_slug := new_slug || '-' || substr(submission_id::text, 1, 8);
  end if;

  insert into public.library_items (
    id, title, slug, content_type, difficulty, tags, abstract, body_md, code_snippet,
    author_name, source_url, created_by
  ) values (
    new_item_id, s.title, new_slug, s.content_type, s.difficulty, s.tags, s.abstract, s.body_md, s.code_snippet,
    s.author_name, s.source_url, s.submitted_by
  );

  update public.submissions
  set
    status = 'approved',
    admin_notes = notes,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  where id = submission_id;

  return new_item_id;
end;
$$;

create or replace function public.reject_submission(submission_id uuid, notes text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.submissions%rowtype;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  select * into s
  from public.submissions
  where id = submission_id
  for update;

  if not found then
    raise exception 'submission not found';
  end if;

  if s.status <> 'pending' then
    raise exception 'submission is not pending';
  end if;

  update public.submissions
  set
    status = 'rejected',
    admin_notes = notes,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  where id = submission_id;
end;
$$;

revoke all on function public.approve_submission(uuid, text) from public;
revoke all on function public.reject_submission(uuid, text) from public;
grant execute on function public.approve_submission(uuid, text) to authenticated;
grant execute on function public.reject_submission(uuid, text) to authenticated;

