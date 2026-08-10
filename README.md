# MFA — Micro-Frontend Architecture Demo

TypeScript throughout (the only framework-mandated exceptions are the `package.json` /
`docker-compose.yml` / `.env` files, which aren't code). Three independently
buildable/deployable front-ends federated at runtime via **Module Federation**, plus a
TypeScript backend and PostgreSQL.

```
Host App (Shell)         Next.js 15 + TypeScript     :3000
Service App (Remote 1)   React + Vite + TypeScript   :5001
Analytics App (Remote 2) React + Webpack + TypeScript:5002
Backend                  Node.js + Express + TS      :4000
Database                 PostgreSQL (via Docker)     :5432
```

Host fetches `ServiceList` from Service App and `Dashboard` from Analytics App at
**runtime** — not bundled at build time. Each remote can be coded, dev-served, and
deployed on its own. A Zustand store (`packages/shared-store`) is shared as a Module
Federation **singleton**, so token/user/theme state stays in sync across all three apps
without prop drilling, since Module Federation loads every remote into the host's same
browser JS realm.

## Project layout

```
MFA/
  apps/
    host/            Next.js shell — layout, routing, auth, remote loading
    service-app/      Vite remote — exposes ./ServiceList
    analytics-app/    Webpack remote — exposes ./Dashboard
  backend/            Express API + PostgreSQL
  packages/
    shared-store/      Zustand global store (MF singleton)
    shared-types/       Shared TS interfaces
  docker-compose.yml   PostgreSQL container
```

## 1. Install dependencies

From the repo root (npm workspaces wires up the `@mfa/*` packages automatically):

```bash
npm install
```

## 2. Start PostgreSQL

```bash
npm run db:up
```

This starts a `postgres:16-alpine` container and runs `backend/src/db/init.sql`
automatically on first boot (creates tables + seed data: an admin user, 4 service
plans, 6 months of revenue). Connect with **DBeaver** using:

- Host: `localhost`, Port: `5432`, Database: `mfa_db`
- User: `mfa_user`, Password: `mfa_password`

## 3. Run everything (4 terminals, in this order)

```bash
npm run dev:backend     # http://localhost:4000
npm run dev:service     # http://localhost:5001  (Vite remote)
npm run dev:analytics   # http://localhost:5002  (Webpack remote)
npm run dev:host        # http://localhost:3000  (Next.js shell)
```

Start the two remotes **before** the host, since the host fetches
`remoteEntry.js` from them on first load of `/services` and `/analytics`.

Open **http://localhost:3000**, log in with `admin@mfa.dev` / any password
(the mock login accepts anything), then visit **Quản lý dịch vụ** and **Thống kê** —
each page pulls its UI live from the corresponding remote.

Each remote is also fully viewable standalone:
- http://localhost:5001 → Service App on its own
- http://localhost:5002 → Analytics App on its own

## Module Federation wiring, at a glance

| App | Role | Config file | Exposes / Consumes |
|---|---|---|---|
| host | Host container | `src/lib/remotes.ts` (`@module-federation/runtime`, client-side loader) | consumes `serviceApp/ServiceList`, `analyticsApp/Dashboard` |
| service-app | Remote 1 | `vite.config.ts` (`@originjs/vite-plugin-federation`) | exposes `./ServiceList` |
| analytics-app | Remote 2 | `webpack.config.ts` (`ModuleFederationPlugin`) | exposes `./Dashboard` |

`react` and `react-dom` are declared as singleton shared dependencies in
`src/lib/remotes.ts`'s `init()` call; `zustand`/`@mfa/shared-store` are
declared as singletons in each remote's own federation config. Together
that's what keeps state and React instances in sync across app boundaries.

**Why the host doesn't use `@module-federation/nextjs-mf`:** it was tried
first, but hit a chain of internal webpack-version incompatibilities on
Next.js 15 (`runtimeTemplate.renderConst is not a function`, then an
`enhanced-resolve` version mismatch) that don't have a documented fix, and
Next.js 16 has since dropped webpack from production builds entirely in
favor of Turbopack — a plugin that patches webpack internals is fighting a
moving target. `@module-federation/runtime` avoids all of this: it loads
each remote's `remoteEntry.js` as a plain client-side script, the same way
a `<script src="...">` tag would, so it never touches Next's bundler.
`next.config.ts` is back to a plain, un-customized config as a result —
see `src/lib/remotes.ts` and `src/pages/services.tsx` / `analytics.tsx` for
how remotes get loaded via `next/dynamic` with `ssr: false`.

## Notes / things to double check before you build for real
- Versions in every `package.json` were written from general knowledge, not
  verified against the npm registry (this container has no network access) —
  run `npm install` and adjust any that are out of date.
- `CORS_ORIGIN=*` in `backend/.env` allows requests from any origin — convenient for
  local dev (LAN IPs vary per machine, and Vite/webpack/Next dev ports are easy to
  lose track of), but replace it with an explicit comma-separated allow-list before
  deploying anywhere real.
- The backend's mock login accepts any password; wire up real bcrypt compare
  against `password_hash` in `users` before shipping this anywhere real.
- In production, each remote's `output.publicPath` / federation `filename` URLs
  need to point at their real deployed origins (e.g. a CDN), not `localhost`.
