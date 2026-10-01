# MFA — Micro-Frontend Architecture Demo

The repository contains a Next.js host, two independently served Module Federation remotes, an Express API, and PostgreSQL.

| Application | Technology | Local URL |
| --- | --- | --- |
| Host | Next.js 15, React, TypeScript | `http://localhost:3000` |
| Service remote | Vite, React, TypeScript | `http://localhost:5001` |
| Analytics remote | Webpack, React, TypeScript | `http://localhost:5002` |
| Backend | Express, TypeScript | `http://localhost:4000` |
| Database | PostgreSQL 16 | `localhost:5432` |

The host loads `serviceApp/ServiceList` from the Vite `remoteEntry.js` and `analyticsApp/Dashboard` from the Webpack `remoteEntry.js` at runtime. Each remote can be deployed independently. A browser-global Zustand store shares session, theme, and cart state across the host and remotes. Cart changes are also persisted through the backend API.

## Setup

Install dependencies from the repository root:

```bash
npm install
npm run db:up
```

The database container initializes from `backend/src/db/init.sql` on its first start. Local environment files are ignored by Git. Configure these values in local `.env` files as needed:

| File | Variables |
| --- | --- |
| `backend/.env` | `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN` |
| `apps/host/.env.local` | `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_SERVICE_APP_URL`, `NEXT_PUBLIC_ANALYTICS_APP_URL` |
| `apps/service-app/.env` | `VITE_BACKEND_URL` |
| `apps/analytics-app/.env` | `BACKEND_URL` |

The host has separate URLs for the two remotes. The defaults point to the local ports in the table above.

Start each app in a separate terminal:

```bash
npm run dev:backend
npm run dev:service
npm run dev:analytics
npm run dev:host
```

Open `http://localhost:3000/login`. Protected host routes redirect to sign-in, and analytics access is limited to admin and moderator accounts by both the host and API. For the local demo database, sign in with `admin@mfa.dev` / `password123`; do not reuse these demo credentials outside a local development database.

## Project layout

```text
apps/host/          Next.js shell, auth, navigation, runtime remote loading
apps/service-app/   Vite remote, product catalogue and cart actions
apps/analytics-app/ Webpack remote, product, sales and user dashboards
backend/            Express API and PostgreSQL schema/seed data
packages/            Shared TypeScript contracts and Zustand store
```

Each remote has its own error boundary in the host, so a failed remote does not take down the rest of the app.
