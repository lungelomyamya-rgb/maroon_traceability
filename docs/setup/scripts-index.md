# Scripts index

**Purpose:** Troubleshooting map for `scripts/` and related `npm run` commands.

**Not covered here:** SQL migrations ([database-migrations.md](./database-migrations.md)), routine dev (`npm run dev`, `test`, `lint`, `build`).

## Prerequisites

- Node version per `.nvmrc` / `package.json` `engines`
- `.env.local` configured — see [environment.md](./environment.md)
- TypeScript scripts: `npx tsx scripts/...`
- CommonJS scripts: `node scripts/...`

## Troubleshooting flows

| Symptom | Try first | Notes |
|---------|-----------|-------|
| Login/register 401 or 500 | `npm run diagnose:supabase` | Needs `NEXT_PUBLIC_SUPABASE_*` in `.env.local` |
| "Supabase not configured" | [environment.md](./environment.md); `npx tsx scripts/setup/fixEnvironment.ts` | Creates or repairs `.env.local` from template |
| Registration adapter fails | `npm run test:registration-fix` | May hit **live** Supabase if `.env.local` points at shared project |
| `users` table missing / RLS errors | `npm run check:database` | See [schema-inventory.md](./schema-inventory.md) and [database-migrations.md](./database-migrations.md) |
| Vercel missing env vars | `scripts/setup/vercel-secrets.ps1` (Windows) or `.sh` | Requires Vercel CLI + `vercel login` |
| Wrong password still "worked" (historical) | Use `/auth/login` with real credentials | Fixed — no DualAuth fallback when Supabase is configured |

## Catalog

| Category | npm script | Path | Purpose |
|----------|------------|------|---------|
| Setup | — | `scripts/setup/fixEnvironment.ts` | Bootstrap or fix `.env.local` from `.env.example` |
| Setup | — | `scripts/setup/fixEnvLocal.ps1` | Windows PowerShell env helper |
| Setup | — | `scripts/setup/vercel-secrets.ps1` / `.sh` | Push env vars to Vercel (requires CLI) |
| Diagnose | `diagnose:supabase` | `scripts/deploy/diagnoseSupabase.ts` | Supabase connectivity, `_test_connection`, auth smoke |
| Diagnose | `diagnose:simple` | `scripts/utils/simpleDiagnose.cjs` | Lightweight env and connectivity check |
| Diagnose | `diagnose:deep` | `scripts/utils/deepDiagnostic.cjs` | Extended diagnostics |
| Diagnose | `check:database` | `scripts/utils/checkDatabaseStatus.cjs` | `users` table presence and basic queries |
| Test | `test:registration-fix` | `scripts/test/testRegistrationFix.ts` | Registration repository smoke test |
| Test | `test:supabase-auth` | `scripts/test/testSupabaseAuth.cjs` | Supabase Auth API checks |
| Test | `test:auth-settings` | `scripts/test/testAuthSettings.cjs` | Auth settings validation |
| Test | `test:full-registration` | `scripts/test/testFullRegistration.cjs` | End-to-end registration test |
| Test | `test:minimal` | `scripts/test/minimalTest.cjs` | Minimal connectivity test |
| Cleanup | `cleanup:dry-run` | `scripts/cleanup/repositoryCleanup.ts` | Preview cleanup (safe) |
| Cleanup | `cleanup:execute`, `cleanup:build`, `cleanup:logs`, `cleanup:all` | `scripts/cleanup/repositoryCleanup.ts` | **Destructive** — modifies repo files |
| Cleanup | `docs:consolidate` / `docs:consolidate:execute` | `scripts/cleanup/documentationConsolidation.ts` | Documentation consolidation |

## Safety

- Run `npm run cleanup:dry-run` before any `cleanup:* --execute` command
- Test and diagnose scripts may read or write the Supabase project configured in `.env.local`
- Never commit secrets; scripts only use local env files
- Cleanup scripts are from the repo-hygiene audit — use on a branch, not directly on `main` without backup

## Maintenance

Update this file in the same PR when adding scripts or `package.json` entries.

## Related

- [environment.md](./environment.md)
- [supabase-setup.md](./supabase-setup.md)
- [deployment.md](./deployment.md)
- [schema-inventory.md](./schema-inventory.md)
- [SUPABASE_REGISTRATION_FIX.md](./SUPABASE_REGISTRATION_FIX.md)