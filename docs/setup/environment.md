# Environment contract

This document is the source of truth for configuration variables.
Keep it synchronized with [`.env.example`](../../.env.example).
Never commit real secrets — only placeholders in `.env.example`.

## Quick start

1. Copy `.env.example` → `.env.local`
2. Fill Supabase URL + publishable (anon) key + secret (service role) key
3. See [deployment.md](./deployment.md) for Vercel

## Variable reference

| Variable | Required | Exposure | Used for |
| -------- | -------- | -------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (auth/registration) | Client | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client | Publishable / anon key (RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (registration API) | **Server only** | `/api/auth/register`, admin client |
| `NEXT_PUBLIC_APP_NAME` | No | Client | Display name |
| `NEXT_PUBLIC_BASE_URL` | No | Client | App base URL (local default ok) |
| `NEXT_PUBLIC_API_BASE_URL` | No | Client | API base (often unused — prefer relative `/api`) |
| `NEXT_PUBLIC_FINANCE_APP_URL` | No | Client | Varydian cross-app links |
| `NEXT_PUBLIC_BASE_PATH` | No — leave unset on Vercel | Build | Legacy; do not set for maroonagri.co.za |
| `NEXT_PUBLIC_DEV_MODE` | No — do not set on Production | Client | Legacy; remove from Vercel Production |
| Feature flags (`NEXT_PUBLIC_ENABLE_*`) | No | Client | Analytics / monitoring toggles |

## Rules

1. Anything prefixed `NEXT_PUBLIC_` is visible in the browser bundle
2. `SUPABASE_SERVICE_ROLE_KEY` must never use the `NEXT_PUBLIC_` prefix
3. Publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`; Secret key → `SUPABASE_SERVICE_ROLE_KEY` (env names unchanged)
4. After changing `.env.example`, update this doc in the same PR

## Related

- [deployment.md](./deployment.md)
- [supabase-setup.md](./supabase-setup.md)
- [SECURITY.md](../../SECURITY.md)
- [cross-app-varydian-maroon.md](../cross-app-varydian-maroon.md)