# Supabase schema inventory

**Captured:** 2026-08-21  
**Project:** Maroon (live)  
**Source of truth for new deploys:** [`database/schema.sql`](../../database/schema.sql)

## Tables the app uses

| Table | Purpose |
|-------|---------|
| `users` | Auth profile rows; registration + login adapters |
| `_test_connection` | Optional health check |

## Tables present in live database but not queried by current app code

| Table | Notes |
|-------|-------|
| `profiles` | Written by live `handle_new_user` on Auth signup. No `.from('profiles')` in `src/`. Do not drop. |
| `user_profiles` | Extended business fields; from older migration SQL |
| `registration_attempts` | Attempt logging; unused by current routes |

Do **not** drop these in production. `profiles` is required by the live signup Auth trigger.

## `users` columns (live)

(id, email, name, role, is_active, email_verified, created_at, updated_at,
last_login_at, additional_data, address, postal_code, user_type,
registration_type, phone, city, province)

## Role column

`public.users.role` is `varchar` with `users_role_check`. The allowed values match `database/schema.sql`: farmer, inspector, logistics, packaging, retailer, public, government, admin, saps, and viewer.

The old `user_role` enum still exists with only farmer, logistics, inspector, packaging, retailer, and viewer. It is not the type of `users.role`. Do not drop it until nothing else references it.

## Live RLS on `users`

Applied in the Supabase project with the registration-role work. `database/schema.sql` now has the same insert role check and `prevent_users_role_change` trigger.

- Service role full access
- Users can view own data
- Users can update own data
- Users can insert own profile, only for farmer, inspector, logistics, packaging, retailer, and public
- Trigger `prevent_users_role_change` blocks role changes from a normal user session

## Related

- [database-migrations.md](./database-migrations.md)
- [supabase-setup.md](./supabase-setup.md)