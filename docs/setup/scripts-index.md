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
| Login/register 401 or 500 | `npm run diagnose:supabase` | Needs `NEXT_PUBLIC_SUPABASE_*` in `.env.local`; may fail if path mismatch — see below |
| "Supabase not configured" | [environment.md](./environment.md); `npx tsx scripts/setup/fixEnvironment.ts` | Creates or repairs `.env.local` from template |
| Registration adapter fails | `npm run test:registration-fix` | May hit **live** Supabase if `.env.local` points at shared project |
| `users` table missing / RLS errors | `npm run check:database` | See [schema-inventory.md](./schema-inventory.md) and [database-migrations.md](./database-migrations.md) |
| Vercel missing env vars | `scripts/setup/vercel-secrets.ps1` (Windows) or `.sh` | Requires Vercel CLI + `vercel login` |
| Wrong password still "worked" (historical) | Use `/auth/login` with real credentials | Fixed — no DualAuth fallback when Supabase is configured |

If `npm run diagnose:supabase` fails with "cannot find module", use the direct path in [Known path mismatches](#known-path-mismatches).

## Catalog

| Category | npm script | Path | Purpose |
|----------|------------|------|---------|
| Setup | — | `scripts/setup/fixEnvironment.ts` | Bootstrap or fix `.env.local` from `.env.example` |
| Setup | — | `scripts/setup/fixEnvLocal.ps1` | Windows PowerShell env helper |
| Setup | — | `scripts/setup/fixEnv.bat`, `scripts/setup/createCleanEnv.bat` | Windows batch env helpers |
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
| Test | `test:simple-registration` | **broken** — file missing | Listed in `package.json` but no script file exists |
| Dedup | `deduplicate:plan` / `backup` / `execute` | `scripts/build/deduplicate-repo.cjs` | Repo deduplication (audit-era); always plan/backup first |
| Dedup | `structural:dedup:*` | `scripts/deploy/structural-deduplication.cjs` | Structural deduplication; dry-run variants available |
| Dedup | `fix:imports:*` | `scripts/utils/fix-imports.cjs` | Fix import paths (`dry-run` before `fix`) |
| Cleanup | `cleanup:dry-run` | `scripts/cleanup/repositoryCleanup.ts` | Preview cleanup (safe) |
| Cleanup | `cleanup:execute`, `cleanup:build`, `cleanup:logs`, `cleanup:all` | `scripts/cleanup/repositoryCleanup.ts` | **Destructive** — modifies repo files |
| Cleanup | `docs:consolidate` / `docs:consolidate:execute` | `scripts/cleanup/documentationConsolidation.ts` | Documentation consolidation |

## Known path mismatches

Several `package.json` scripts reference files at `scripts/<file>` (repo root), but files live in subfolders. Until `package.json` paths are aligned, run scripts directly:

```bash
npx tsx scripts/deploy/diagnoseSupabase.ts
npx tsx scripts/test/testRegistrationFix.ts
node scripts/utils/checkDatabaseStatus.cjs
node scripts/utils/simpleDiagnose.cjs
node scripts/test/testSupabaseAuth.cjs
```

| npm script | `package.json` path | Actual path |
|------------|---------------------|-------------|
| `diagnose:supabase` | `scripts/diagnoseSupabase.ts` | `scripts/deploy/diagnoseSupabase.ts` |
| `test:registration-fix` | `scripts/testRegistrationFix.ts` | `scripts/test/testRegistrationFix.ts` |
| `diagnose:simple` | `scripts/simpleDiagnose.cjs` | `scripts/utils/simpleDiagnose.cjs` |
| `diagnose:deep` | `scripts/deepDiagnostic.cjs` | `scripts/utils/deepDiagnostic.cjs` |
| `check:database` | `scripts/checkDatabaseStatus.cjs` | `scripts/utils/checkDatabaseStatus.cjs` |
| `test:supabase-auth` | `scripts/testSupabaseAuth.cjs` | `scripts/test/testSupabaseAuth.cjs` |
| `test:auth-settings` | `scripts/testAuthSettings.cjs` | `scripts/test/testAuthSettings.cjs` |
| `test:minimal` | `scripts/minimalTest.cjs` | `scripts/test/minimalTest.cjs` |
| `test:full-registration` | `scripts/testFullRegistration.cjs` | `scripts/test/testFullRegistration.cjs` |
| `deduplicate:*` | `scripts/deduplicate-repo.cjs` | `scripts/build/deduplicate-repo.cjs` |
| `structural:dedup:*` | `scripts/structural-deduplication.cjs` | `scripts/deploy/structural-deduplication.cjs` |
| `fix:imports:*` | `scripts/fix-imports.cjs` | `scripts/utils/fix-imports.cjs` |
| `test:simple-registration` | `scripts/testSimpleRegistration.ts` | **missing** |

`cleanup:*` and `docs:consolidate*` paths in `package.json` are correct.

## Safety

- Run `npm run cleanup:dry-run` before any `cleanup:* --execute` command
- Test and diagnose scripts may read or write the Supabase project configured in `.env.local`
- Never commit secrets; scripts only use local env files
- Dedup and cleanup scripts are from the repo-hygiene audit — use on a branch, not directly on `main` without backup

## Maintenance

Update this file in the same PR when adding scripts or `package.json` entries.

## Related

- [environment.md](./environment.md)
- [supabase-setup.md](./supabase-setup.md)
- [deployment.md](./deployment.md)
- [schema-inventory.md](./schema-inventory.md)
- [SUPABASE_REGISTRATION_FIX.md](./SUPABASE_REGISTRATION_FIX.md)