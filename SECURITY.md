# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

This is a demonstration prototype. Security fixes are applied on the `main` branch.

## Reporting a Vulnerability

**Do not open public GitHub issues for security vulnerabilities.**

Report security issues privately to:

- **Email**: support@maroontraceability.co.za
- **Subject**: `[SECURITY] Maroon Traceability Demo`

Include:

1. Description of the vulnerability
2. Steps to reproduce
3. Impact assessment
4. Suggested fix (if any)

We aim to acknowledge reports within 5 business days. Critical issues will be prioritized for patch and coordinated disclosure.

## Secret Handling for Contributors

### Never commit

- `.env`, `.env.local`, `.env.vercel`, or any file containing real API keys
- `SUPABASE_SERVICE_ROLE_KEY` or other server-only credentials
- Private keys, certificates (`.pem`), or platform CLI tokens

### Safe practices

- Copy [`.env.example`](.env.example) to `.env.local` for local development
- Use Vercel/GitHub secret stores for deployment credentials
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser—never use that prefix for secrets
- `SUPABASE_SERVICE_ROLE_KEY` must only be read in server contexts (API routes, server components)

### Secret scanning

CI runs gitleaks on every push and pull request to `main` (the `secrets` job in `.github/workflows/node.yml`). It scans the current files, not git history. The pre-commit hook does not scan for secrets. If you accidentally commit a secret:

1. Rotate the credential immediately in Supabase/Vercel
2. Remove the file from the repository
3. Follow the history purge procedure below if the secret reached `main`

## History Purge Procedure

If secrets were committed to git history:

1. Rotate all exposed credentials before purging history
2. Use `git filter-repo` or BFG Repo-Cleaner to remove the file from history
3. Force-push only with team approval and branch protection coordination
4. Invalidate any CI tokens that may have been exposed

## Secret Rotation Runbook

When rotating Supabase credentials:

1. Generate new keys in Supabase Dashboard → Project Settings → API
2. Update Vercel project environment variables (and local `.env.local`)
3. Redeploy the application
4. Revoke old keys after verifying the new deployment works
5. Audit registration and auth flows (`/api/auth/register`)

## Application Security Notes

- Debug endpoints under `src/app/api/debug/` must remain disabled or auth-gated in non-local environments
- Registration uses server-side `/api/auth/register` to avoid exposing the service role to the client
- Static export builds must be audited to ensure no server secrets appear in client bundles

## Known Remediation (2026)

`.env.vercel` containing real Supabase credentials was removed from the repository. **Rotate the Supabase service role key and review anon key exposure** if that file was ever pushed to a remote.

The legacy Supabase anon and service-role JWT keys were hardcoded in `scripts/setup/` from 2026-04-22. They have been removed from the tree but remain in git history. The app now uses `sb_publishable_` and `sb_secret_` keys. The legacy JWT keys must be disabled in Supabase (Project Settings -> API Keys -> Legacy API Keys). Disabling them is the fix; history is not rewritten.
