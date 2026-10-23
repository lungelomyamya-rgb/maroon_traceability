# Supabase schema inventory

**Captured:** 2026-08-21  
**Project:** Maroon (live)  
**Source of truth for new deploys:** [`database/schema.sql`](../../database/schema.sql)

## Tables the app uses

| Table | Purpose |
|-------|---------|
| `users` | Auth profile rows; registration + login adapters |
| `_test_connection` | Optional health check |

## Tables present in live DB but unused by current app code

| Table | Notes |
|-------|-------|
| `profiles` | Broad profile/subscription fields; no `.from('profiles')` in `src/` |
| `user_profiles` | Extended business fields; from older migration SQL |
| `registration_attempts` | Attempt logging; unused by current routes |

Do **not** drop these in production until Auth triggers / dashboard usage are verified.

## `users` columns (live)

(id, email, name, role, is_active, email_verified, created_at, updated_at,
last_login_at, additional_data, address, postal_code, user_type,
registration_type, phone, city, province)

## Custom type

`user_role` enum: farmer | logistics | inspector | packaging | retailer | viewer  
**Gap:** app also uses saps, admin, government, public — baseline uses CHECK on `users.role` instead.

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