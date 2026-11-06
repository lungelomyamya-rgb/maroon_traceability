# Supabase schema inventory

**Captured:** 2026-08-21  
**Project:** Maroon (live)  
**Source of truth for new deploys:** [`database/schema.sql`](../../database/schema.sql)

## Tables the app uses

| Table | Purpose |
|-------|---------|
| `users` | Auth profile rows; registration + login adapters |
| `_test_connection` | Optional health check |

## Tables present in the live database but not queried by current app code

| Table | Notes |
|-------|-------|
| `profiles` | Written by live `handle_new_user` on Auth signup. No `.from('profiles')` in `src/`. Do not drop. |

`profiles` is required by the live signup Auth trigger. Do not drop it. `user_profiles` and `registration_attempts` have been dropped from the live database. They were empty, and the app did not query them.

## `users` columns (live)

(id, email, name, role, is_active, email_verified, created_at, updated_at,
last_login_at, additional_data, address, postal_code, user_type,
registration_type, phone, city, province)

## Role column

`public.users.role` is `varchar` with `users_role_check`. The allowed values match `database/schema.sql`: farmer, inspector, logistics, packaging, retailer, public, government, admin, saps, and viewer.

The old `user_role` enum has been dropped from the live database. It was not the type of `users.role`.

## Live RLS on `users`

Applied in the Supabase project with the registration-role work. `database/schema.sql` now has the same insert role check and `prevent_users_role_change` trigger.

- Service role full access
- Users can view own data
- Users can update own data
- Users can insert own profile, only for farmer, inspector, logistics, packaging, retailer, and public
- Trigger `prevent_users_role_change` blocks role changes from a normal user session

## Dropped live functions

`public.create_user_with_profile` and `public.test_registration_flow` have been dropped from the live database. They were absent from `database/schema.sql`, and the app did not call them.

`public.calculate_profile_completion` and `public.migrate_user_registration_data` have been dropped. They were not `SECURITY DEFINER`. The views `public.user_complete_info` and `public.registration_analytics` have been dropped. They had `security_invoker=on`. None of these four are in `database/schema.sql`, and the app did not call them.

`public.get_user_by_email(character varying)`, `public.get_user_by_email(text)`, `public.is_email_available(character varying)`, and `public.is_email_available(text)` have been dropped. They were `SECURITY DEFINER` and read `public.users`. They were absent from `database/schema.sql`, and the app did not call them.

## Live email functions

`public.check_email_availability(text)` is `SECURITY DEFINER` and returns a boolean. `checkEmailAvailability` in `src/features/registration/adapters/SupabaseRegistrationAdapter.ts` calls it before signup, so `PUBLIC`, `anon`, and `authenticated` keep `EXECUTE`.

## Personal information

The Protection of Personal Information Act 4 of 2013 applies to this demo. `public.users` stores name, email, phone, street address, city, province, and postal code. Signup copies id, email, name, and role into `public.profiles`.

This note is not a compliance claim. A signed-in person can read and correct their own profile. Address search sends the typed street, and sometimes coordinates, to the public OpenStreetMap Nominatim service. `src/app/get-started/page.tsx` describes privacy controls only and makes no POPIA compliance or data-location claim. `src/lib/gdpr.ts` stores a browser-local policy and does not run a POPIA request process.

## Related

- [database-migrations.md](./database-migrations.md)
- [supabase-setup.md](./supabase-setup.md)