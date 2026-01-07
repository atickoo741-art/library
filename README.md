# Quant Library

An interactive online library for quant/financial content (algorithms, formulas, proofs, papers, code/strategies). Users can browse/search published items and submit new entries for admin review. Admin can approve/reject/edit submissions; approved entries become public.

## Tech stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Data/Auth**: Supabase (Auth + Postgres + RLS)
- **Data fetching**: TanStack Query
- **Routing**: React Router
- **Forms**: React Hook Form + Zod
- **Rendering**: Markdown + LaTeX (KaTeX) + code highlighting

## Repo structure

```
src/
  api/                 # Supabase query + RPC wrappers
  auth/                # Auth provider + hooks
  components/          # UI + markdown renderer
  pages/               # Routes/pages
  pages/admin/         # Admin-only routes/pages
  routes/              # Route guards
  lib/                 # env + types + supabase client
supabase/
  migrations/0001_init.sql
  seed.sql
```

## Setup

### 1) Create a Supabase project

- Create a Supabase project in the dashboard
- In **Authentication → Providers**, ensure **Email** is enabled

### 2) Run migrations (schema + RLS + RPCs)

In Supabase **SQL Editor**, run:

- `supabase/migrations/0001_init.sql`

### 3) Seed sample content (optional)

In Supabase **SQL Editor**, run:

- `supabase/seed.sql`

### 4) Configure environment variables

Copy the example file and fill in your Supabase values:

```bash
cp .env.example .env.local
```

Set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 5) Install and run

```bash
npm install
npm run dev
```

## Making yourself admin

1. Sign up in the UI using your email.
2. In Supabase **SQL Editor**, run the “promote to admin” snippet at the top of `supabase/seed.sql` with your email.
3. Reload the app; you should now see the **Admin** navigation link.

## What to do next

- Add pagination and better relevance tuning for search (weights, stemming/language config).
- Add an admin editor for `library_items` create/edit (currently supports archive/delete).
- Add file attachments (PDFs) via Supabase Storage for papers.
- Add “draft” submissions editable by the submitter before final submit.
- Add analytics (views, saves) and “featured” curation.
