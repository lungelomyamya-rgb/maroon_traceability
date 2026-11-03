# Database / migration runbook

**Database platform:** Supabase (PostgreSQL). There is no separate local MySQL/SQL Server.

SQL for **new** projects: [`database/schema.sql`](../../database/schema.sql).  
Full live inventory: [schema-inventory.md](./schema-inventory.md).  
Historical scripts: [`database/archive/`](../../database/archive/).

There is no automated migration runner yet. Apply via Supabase **SQL Editor**.

## Environments

| Environment | Apply SQL? | Notes |
|-------------|------------|-------|
| Shared Supabase (demo/prod) | Manual only when changing schema | App on Vercel expects tables already present |
| New empty Supabase project | Yes — run `schema.sql` | Then set env vars (see environment.md) |
| Vercel | No | Does not run migrations |
| CI | No | |

Always backup before changing production schema (Dashboard → Database → Backups).

## Apply order

### New / empty project

1. Open Supabase → SQL Editor  
2. Paste and run **`database/schema.sql`**  
3. Confirm Table Editor shows `users` and `_test_connection`  
4. Configure Auth URL / env (supabase-setup.md, environment.md)  
5. Smoke-test: `POST /api/auth/register` and login  

Do **not** run files under `database/archive/`.

### Existing live project (this demo)

Schema already exists. **Do not** re-apply `schema.sql` blindly (may conflict with existing policies/constraints).

To change schema going forward:

1. Write a **new additive** `.sql` file (e.g. `database/migrations/2026-xx-xx_description.sql`)  
2. Run it in SQL Editor after backup  
3. Update `schema.sql` so new projects stay in sync  
4. Update `schema-inventory.md`  

### Archived scripts

See `database/archive/README.md`. Especially avoid `drop_and_add_columns.sql` on production.

## Rollback posture

| Change | Rollback |
|--------|----------|
| New empty project + schema.sql | Delete project or drop objects manually |
| Additive ALTER on live | Reverse ALTER or restore backup |
| Archived destructive scripts | Backup restore only |

**Policy:** forward-only; demo uses one shared Supabase project.  
**Later (Phase 5):** Supabase CLI migrations.

## Known debt (do not ignore forever)

1. Live `users` RLS matches `database/schema.sql`: owner read and update, self-serve insert for farmer, inspector, logistics, packaging, retailer, and public, service-role access, and the `prevent_users_role_change` trigger.
2. Live `public.profiles` is written by `handle_new_user` on Auth signup (`on_auth_user_created`). The app reads `public.users` and does not query `profiles`. Do not drop `profiles`, `user_profiles`, or `registration_attempts`. 
3. Live `users.role` is `varchar` with `users_role_check` for the ten app roles. The old `user_role` enum is unused: no column uses it, and nothing depends on it. `create_user_with_profile` has a `varchar` parameter named `user_role`. `test_registration_flow` mentions the name only in a message. Leave the enum until a later slice drops it.

## Related

- [schema-inventory.md](./schema-inventory.md)
- [environment.md](./environment.md)
- [supabase-setup.md](./supabase-setup.md)
- [deployment.md](./deployment.md)
- [SECURITY.md](../../SECURITY.md)