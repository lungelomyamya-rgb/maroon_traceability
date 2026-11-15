-- One-off cleanup: remove contact details that signup used to copy into
-- Supabase Auth user_metadata (auth.users.raw_user_meta_data).
-- Supabase puts user_metadata into every login token, so these values were
-- sent with every API request. Contact details belong in public.users only.
-- name and role stay: the handle_new_user trigger reads them.
-- Safe to run more than once.

update auth.users
set raw_user_meta_data = raw_user_meta_data
  - array['phone', 'address', 'city', 'province', 'postalCode', 'postal_code']
where raw_user_meta_data ?| array['phone', 'address', 'city', 'province', 'postalCode', 'postal_code'];
