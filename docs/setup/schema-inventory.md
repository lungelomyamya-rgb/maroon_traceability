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

## Live RLS on `users` (legacy — needs cleanup PR)

Document that live has permissive public SELECT/INSERT policies.  
New projects use the stricter set in `schema.sql`.  
Production tighten: separate change with testing.

## Related

- [database-migrations.md](./database-migrations.md)
- [supabase-setup.md](./supabase-setup.md)