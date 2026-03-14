# Setu — Community Resource Platform

A monorepo connecting donors, NGOs, workers, and villages for efficient resource redistribution.

## Stack

| Layer    | Tech                                     |
|----------|------------------------------------------|
| Frontend | Next.js 14 (App Router), Tailwind CSS    |
| Backend  | Express 4, Prisma ORM                    |
| Database | PostgreSQL                               |
| Auth     | JWT (bcryptjs)                           |
| State    | Zustand (client), React Query (server)   |
| Shared   | `@setu/shared` types package             |

## Project structure

```
setu/
├── apps/
│   ├── web/                        # Next.js frontend
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── donor/page.tsx
│   │   │   │   ├── platform/page.tsx
│   │   │   │   ├── ngo/page.tsx
│   │   │   │   ├── worker/page.tsx
│   │   │   │   └── village/page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Redirects to /auth/login
│   │   │   └── providers.tsx
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   │   └── DashboardLayout.tsx
│   │   │   └── ui/
│   │   │       └── index.tsx       # Badge, MetricCard, Avatar, etc.
│   │   ├── hooks/
│   │   │   └── useApi.ts           # All React Query hooks
│   │   ├── lib/
│   │   │   ├── api.ts              # Axios instance
│   │   │   └── store/
│   │   │       └── auth.store.ts   # Zustand auth store
│   │   └── types/
│   │
│   └── server/                     # Express backend
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       └── src/
│           ├── config/
│           │   └── prisma.ts
│           ├── controllers/
│           │   ├── auth.controller.ts
│           │   ├── donation.controller.ts
│           │   ├── village.controller.ts
│           │   ├── ngo.controller.ts
│           │   ├── worker.controller.ts
│           │   └── platform.controller.ts
│           ├── middleware/
│           │   ├── auth.middleware.ts
│           │   ├── error.middleware.ts
│           │   └── notFound.middleware.ts
│           ├── routes/
│           │   ├── auth.routes.ts
│           │   ├── donation.routes.ts
│           │   ├── village.routes.ts
│           │   ├── ngo.routes.ts
│           │   ├── worker.routes.ts
│           │   └── platform.routes.ts
│           ├── app.ts
│           └── index.ts
│
└── packages/
    └── shared/                     # Shared TypeScript types
        └── src/
            └── index.ts
```

## Getting started

### 1. Prerequisites

- Node.js 18+
- PostgreSQL running locally
- Yarn (workspaces)

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up environment variables

```bash
# Server
cp apps/server/.env.example apps/server/.env
# Edit DATABASE_URL, JWT_SECRET

# Web
cp apps/web/.env.example apps/web/.env
```

### 4. Set up the database

```bash
cd apps/server
yarn db:migrate    # Run Prisma migrations
yarn db:seed       # Seed test accounts
```

### 5. Run in development

```bash
# From repo root — starts both server and web
yarn dev
```

- Web: http://localhost:3000
- API: http://localhost:4000

## Test accounts (after seed)

| Role     | Email                 | Password    |
|----------|-----------------------|-------------|
| Admin    | admin@setu.in         | admin1234   |
| Donor    | donor@ramesh.in       | donor1234   |
| NGO      | ngo@udaan.in          | ngo1234     |
| Worker   | worker@setu.in        | worker1234  |
| Village  | village@chamba.in     | village1234 |

## API endpoints

### Auth
| Method | Path                | Access  |
|--------|---------------------|---------|
| POST   | /api/auth/register  | Public  |
| POST   | /api/auth/login     | Public  |
| GET    | /api/auth/me        | Any     |

### Donations
| Method | Path                    | Role     |
|--------|-------------------------|----------|
| POST   | /api/donations          | donor    |
| GET    | /api/donations/mine     | donor    |
| GET    | /api/donations/stats    | donor    |
| GET    | /api/donations          | platform |
| POST   | /api/donations/match    | platform |

### Villages
| Method | Path                         | Role     |
|--------|------------------------------|----------|
| POST   | /api/villages/requests       | village  |
| GET    | /api/villages/requests/mine  | village  |
| GET    | /api/villages/stats          | village  |
| GET    | /api/villages/requests       | platform |

### NGOs
| Method | Path                              | Role     |
|--------|-----------------------------------|----------|
| GET    | /api/ngos/profile                 | ngo      |
| GET    | /api/ngos/stats                   | ngo      |
| POST   | /api/ngos/projects                | ngo      |
| PATCH  | /api/ngos/projects/:id/progress   | ngo      |
| GET    | /api/ngos                         | platform |
| PATCH  | /api/ngos/:id/verify              | platform |

### Workers
| Method | Path                                   | Role     |
|--------|----------------------------------------|----------|
| GET    | /api/workers/profile                   | worker   |
| PATCH  | /api/workers/profile                   | worker   |
| GET    | /api/workers/assignment/active         | worker   |
| PATCH  | /api/workers/assignment/:id/progress   | worker   |
| GET    | /api/workers/available                 | platform |
| POST   | /api/workers/assign                    | platform |

### Platform
| Method | Path                           | Role     |
|--------|--------------------------------|----------|
| GET    | /api/platform/stats            | platform |
| GET    | /api/platform/match-suggestions| platform |
