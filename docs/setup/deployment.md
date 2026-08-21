# Deployment Strategy

**Sole production target:** Vercel (`https://www.maroonagri.co.za`).
GitHub Pages has been retired.

## Summary

| Environment | Target | URL | Trigger |
| ----------- | ------ | --- | ------- |
| Production | Vercel | `https://www.maroonagri.co.za` | Push to `main` (Vercel Git integration) |
| Preview | Vercel | Preview URL | Pull requests |
| Local | `npm run dev` | `http://localhost:3000` | Developer machine |

## Vercel

- Config: [`vercel.json`](../../vercel.json)
- Secrets: Vercel project env only — never commit `.env.local` / `.env.vercel`
- Required env: see [`.env.example`](../../.env.example) and [supabase-setup.md](./supabase-setup.md)
- Do **not** set `NEXT_PUBLIC_BASE_PATH` on Vercel (app is served from domain root)

## Environment variables

| Variable | Vercel Production | Local |
| -------- | ----------------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | Required | Required |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required | Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Required | Required |
| `NEXT_PUBLIC_FINANCE_APP_URL` | Optional | Optional |

## Post-deploy verification

1. `GET /api/debug/auth` → **404**
2. `/api/auth/register` responds (not 404)
3. Login / registration smoke test
4. Supabase Auth redirect URLs include `https://www.maroonagri.co.za`

## Deprecated

- GitHub Pages workflow (`pages.yml`) — removed
- `gh-pages` branch — delete after merge
- `.env.vercel` — never commit