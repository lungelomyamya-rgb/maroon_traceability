# ADR 0001: Vercel-only production deployment

**Status:** Accepted  
**Date:** 2026-08-21

## Context

The project previously supported dual deployment: GitHub Pages (static export under `/maroon_traceability`) and Vercel (Next.js with API routes). That caused:

- Confusion over which URL was canonical (`maroonagri.co.za` vs GitHub Pages)
- Asset path bugs (`getAssetPath` prefix logic)
- API routes and Supabase registration only working on Vercel
- Extra maintenance (Pages workflow, `gh-pages` branch)

Production live site: `https://www.maroonagri.co.za`.

## Decision

- **Production and preview deploys use Vercel only.**
- GitHub Pages is retired: no `pages.yml`, no `gh-pages` branch, no `NEXT_PUBLIC_BASE_PATH` for GitHub.
- App assets and routes are served from the domain root (no `/maroon_traceability` prefix).
- Local dev: `npm run dev` on port 3000.

See [deployment.md](../../setup/deployment.md) for env vars and post-deploy checks.

## Consequences

**Positive**

- Single deploy path; API routes and auth work consistently in prod
- Simpler asset URLs and fewer hydration mismatches
- Aligns with Next.js App Router + server routes

**Negative / trade-offs**

- No free static fallback on GitHub Pages
- Vercel project env vars are required for every deploy
- Developers must use Vercel previews or local dev — not Pages

**Follow-up**

- Branch protection on `main` (GitHub settings) — optional platform hardening

**Related**

- [ADR 0002: Supabase database](0002-supabase-postgres-database.md)