# ADR 0002: Supabase (PostgreSQL) as database platform

**Status:** Accepted  
**Date:** 2026-08-21

## Context

The app needs authenticated users, a `users` profile table, and server-side registration via `/api/auth/register`. Options considered during the Phase 2 audit included staying on Supabase vs introducing a separate local MySQL/SQL Server.

Live project already runs on Supabase Postgres with tables including `users` (primary app table) and legacy tables (`profiles`, `user_profiles`, `registration_attempts`) not used by current `src/`.

## Decision

- **Keep Supabase (PostgreSQL) as the sole database platform.**
- Do not add local MySQL or parallel SQL Server for this demo.
- Canonical schema for new projects: [`database/schema.sql`](../../../database/schema.sql).
- Schema changes: manual SQL via Supabase SQL Editor (no automated migration runner yet).
- Document live vs app usage in [schema-inventory.md](../../setup/schema-inventory.md).

Registration and admin operations use:

- Browser: anon key + RLS (see live RLS debt in schema inventory)
- Server: `SUPABASE_SERVICE_ROLE_KEY` via `getSupabaseAdmin()`

## Consequences

**Positive**

- Matches production; no dual-DB drift
- Auth, RLS, and Postgres features stay in one place
- `schema.sql` + archive folder give a clear baseline for new envs

**Negative / trade-offs**

- Schema changes require manual SQL and backup discipline on shared prod
- Live RLS on `users` is still overly permissive — tighten in a separate PR (Issue #10 D6)
- Unused legacy tables remain until inventory/trigger check completes (D7)

**Related**

- [database-migrations.md](../../setup/database-migrations.md)
- [environment.md](../../setup/environment.md)
- [supabase-setup.md](../../setup/supabase-setup.md)
- [0001-vercel-only-deployment.md](0001-vercel-only-deployment.md)