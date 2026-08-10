# MFA — Micro-Frontend Architecture Demo

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

Stuff
