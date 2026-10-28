# OIDC authentication

The backend uses the OpenID Connect authorization-code flow with PKCE. Local development uses a Keycloak realm imported from `docker/keycloak/realm/web-gis-realm.json`; production can use any HTTPS OIDC provider that supports discovery and confidential clients.

## Local demo setup

1. Start Keycloak from the repository root with `docker compose up -d keycloak`.
2. Wait until `http://localhost:8081/realms/web-gis/.well-known/openid-configuration` responds.
3. Merge the values in `backend/.env.example` into the existing `backend/.env`; do not replace database or GeoServer settings already there. The demo client secret must match `WEBGIS_OIDC_CLIENT_SECRET` in `docker-compose.yml`.
4. Merge `frontend/.env.example` into the existing frontend `.env` if `VITE_API_URL` is not already set.
5. Start the backend and frontend development servers.

Local demo users are `demo-viewer` / `viewer-demo-only` and `demo-editor` / `editor-demo-only`. The Keycloak administrator is `admin` / `local-only-admin-password`. These are disposable localhost-only credentials; do not reuse or publish them in a deployed environment. Keycloak is bound to `127.0.0.1:8081` and runs in development mode.

The development backend permits HTTP only for a loopback issuer and callback when `NODE_ENV=development`. Production requires HTTPS for the issuer, callback, frontend URL, and allowed origins. If the frontend and API are on different sites, set `SESSION_COOKIE_SAME_SITE=none` and use HTTPS; otherwise the default `lax` is preferred. Set `TRUST_PROXY=true` only when the backend is behind a trusted reverse proxy that supplies forwarded headers.

## Production configuration

Replace the local Keycloak values with the public HTTPS issuer, client ID, client secret, exact registered callback URI, frontend URL, and CORS origins. Generate a new random `SESSION_SECRET` and store it in the deployment secret manager. Do not expose the local Keycloak service or its demo credentials on a public host.

## Behavior

- `GET /api/auth/login` creates per-login PKCE, state, and nonce values in a server-side session and redirects to the provider.
- `GET /api/auth/callback` validates the authorization response and ID token, rotates the session ID, and redirects to `/dashboard`.
- `GET /api/auth/me` returns the signed-in user's issuer, subject, optional profile claims, and application roles.
- `POST /api/auth/logout` destroys the local session and uses OIDC RP-Initiated Logout when the provider publishes an end-session endpoint.
- Other `/api/*` routes require a valid application session and at least one role in `GIS_READ_ROLES`; users without a read role receive `403`.
- Keycloak realm roles are read from `realm_access.roles` by default; configure `OIDC_ROLES_CLAIM` if another provider uses a different claim path.
- The local Keycloak client has an explicit realm-role protocol mapper that includes `realm_access.roles` in the validated ID token. This lets the backend build the session role list from the provider's signed identity claims.
- The session is stored in PostgreSQL. The browser receives only an `HttpOnly` session cookie; ID tokens remain server-side for logout and are not exposed to frontend JavaScript.
- `GIS_READ_ROLES` defaults to `gis-reader`, `gis-editor`, and `gis-admin`. All three roles currently grant the same API read access.
- `GIS_WRITE_ROLES` defaults to `gis-editor` and `gis-admin`. The public-facilities write endpoints enforce this role list and a trusted `Origin`; other GIS routes remain read-only until they add explicit write authorization.
- `gis-admin` currently shares the public-facilities edit capability. Application-wide administration is not implemented.
- The frontend GIS state still uses its local `viewer` role and does not yet hydrate role-specific controls from `/api/auth/me`. Frontend controls must remain a usability feature; authorization is enforced by the backend.

The current API endpoints are read-only. This change authenticates users but does not yet map provider groups or claims to GIS roles. Define and enforce those permissions before adding write routes or treating authorization by role as complete.

## Database migrations

In development, migrations run at backend startup by default. For production, set `RUN_MIGRATIONS_ON_START=false` and run `npm run migrate` once as a controlled deployment step before starting application instances. The migration runner takes a PostgreSQL advisory lock so concurrent invocations are serialized. Existing migration SQL remains unchanged; compare each environment's applied checksums and schema before proposing any corrective migration.
