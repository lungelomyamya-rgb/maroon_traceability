# Archived database scripts

These files were used during registration schema iteration.
They are **not** part of the apply path for new projects.

**Canonical baseline:** `../schema.sql`  
**Live inventory:** `../../docs/setup/schema-inventory.md`  
**Runbook:** `../../docs/setup/database-migrations.md`

| File | Why archived |
|------|----------------|
| `schema.sql.before-2026-08-21` | Previous incomplete baseline |
| `drop_and_add_columns.sql` | Destructive column rewrite |
| `create_simple_indexes.sql` | Indexes now in schema.sql |
| `complete_registration_migration.sql` | Added user_profiles etc.; app does not require it for core auth |
| `applySchema.cjs` | Print-only helper; hardcoded project URL |
| `fixProfiles.cjs` | Ad-hoc diagnostic |

Do not run `drop_and_add_columns.sql` against production without a backup and explicit approval.