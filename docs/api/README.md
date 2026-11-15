# Maroon API reference

These routes serve the Maroon web app itself. There is no public or partner API yet. The pricing page lists API access as "coming soon".

Source: [`src/app/api/`](../../src/app/api/)

## Base URL

The routes are on the same host as the app:

- Local: `http://localhost:3000`
- Production: the Vercel deployment

`next.config.js` sets `trailingSlash: true`. Call each route with a trailing `/`, for example `/api/auth/register/`. Without it, the server answers with a `308` redirect first.

## Authentication

There is no login endpoint. The browser signs in with Supabase Auth (`supabase.auth.signInWithPassword`) and keeps the session in `sessionStorage`.

Routes that need a signed-in user expect the Supabase access token from that session:

```http
Authorization: Bearer <supabase-access-token>
```

The server checks the token with `supabase.auth.getUser` in [`src/lib/auth/auth.ts`](../../src/lib/auth/auth.ts). A missing or invalid token returns `401`.

## Routes

| Method | Path | Sign-in | Purpose |
|--------|------|---------|---------|
| `POST` | `/api/auth/register/` | No | Create an account |
| `POST` | `/api/address-suggestions/` | Yes | Address search and postal-code lookup |
| `GET`, `PATCH`, `PUT` | `/api/users/{id}/profile/` | Yes, own profile only | Read or update a profile |
| `GET` | `/api/debug/auth/` | Development only | Check a token |

---

### `POST /api/auth/register/`

Creates a Supabase Auth user and a matching `public.users` row.

**Body**

| Field | Rules |
|-------|-------|
| `email` | Required |
| `password` | Required, at least 8 characters |
| `name` | Required, at least 2 characters |
| `role` | Required: `farmer`, `inspector`, `logistics`, `packaging`, `retailer`, or `public` |

`government`, `admin`, `saps`, and `viewer` accounts cannot sign themselves up.

**Success, `200`**

```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "email": "<email>",
    "name": "<name>",
    "role": "farmer",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>",
    "lastLoginAt": null
  }
}
```

**Errors** return `{ "success": false, "error": "<message>" }`:

- `400` for a missing or invalid field, or when Supabase rejects the signup
- `503` when the server Supabase settings are missing
- `500` for anything else

---

### `POST /api/address-suggestions/`

Profile address search, limited to South Africa. The request is sent to the public OpenStreetMap Nominatim service.

The address and coordinates go in the request body, not the URL, so they stay out of request logs.

**Search.** Body: `{ "q": "<typed address>" }`

Returns up to 5 matches:

```json
{
  "suggestions": [
    {
      "label": "<full address>",
      "street": "<street>",
      "city": "<city>",
      "postalCode": "<postal code>",
      "province": "<province>",
      "latitude": "<lat>",
      "longitude": "<lon>"
    }
  ]
}
```

If `q` is shorter than 3 characters, the response is `{ "suggestions": [] }`.

**Postal-code lookup.** Body: `{ "lat": "<lat>", "lon": "<lon>" }`

Both values are decimal strings. The response is `{ "postalCode": "<code>" }`, or `""` when there is no match.

---

### `/api/users/{id}/profile/`

`{id}` must be the signed-in user's own id. Any other id returns `403`.

| Method | Body | Result |
|--------|------|--------|
| `GET` | None | Returns the profile |
| `PATCH` | Any of `name`, `phone`, `address`, `city`, `province`, `postal_code`, `additional_data` | Updates only the fields sent |
| `PUT` | `name` and `email` required. Optional: `phone`, `address`, `city`, `province`, `postal_code` | Replaces those fields |

`email` is validated but not saved by these routes.

**Success, `200`**

```json
{
  "success": true,
  "data": { "id": "<uuid>", "name": "<name>", "email": "<email>", "role": "farmer" },
  "message": "Profile updated successfully",
  "timestamp": "<timestamp>"
}
```

The `data` object is shortened in this example.

**Errors** return `{ "error": "<message>", "code": "AUTH_ERROR", "timestamp": "<timestamp>" }`:

- `400` for invalid input
- `401` when there is no valid token
- `403` for another user's profile
- `404` when the user is not found
- `500` for a database or server error

---

### `GET /api/debug/auth/`

Development only. Every other environment returns `404`.

It shows which user the token belongs to (`id`, `email`, `role`, `name`) and whether an `Authorization` header was sent.

## Not available

The following are not built:

- product, traceability, or analytics endpoints
- webhooks
- SDKs
- rate limiting

Product and traceability screens use demo data in the browser.

## Related

- [adapter-api.md](./adapter-api.md)
- [SECURITY.md](../../SECURITY.md)
