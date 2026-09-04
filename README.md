# Store Rating System

A web application where users submit ratings from 1 to 5 for stores registered on
the platform. One login serves all three roles — **System Administrator**,
**Normal User** and **Store Owner** — and each is routed to different
functionality after signing in.

## Tech stack

| Layer    | Choice                                                            |
| -------- | ----------------------------------------------------------------- |
| Frontend | React 19 (Next.js 16 App Router), Tailwind CSS v4, shadcn/base-ui  |
| Backend  | Next.js Route Handlers (Node runtime)                             |
| Database | PostgreSQL via Prisma ORM                                         |
| Auth     | Signed JWT in an httpOnly cookie (`jose`), bcrypt password hashing |
| Tables   | TanStack Table v9 — sorting, filtering, pagination                 |

The backend uses Next.js Route Handlers rather than a separate Express server:
it is the same request/response model with a single deployment and one
type-checked boundary between client and server.

## Getting started

**Prerequisites:** Node.js 20+ and a running PostgreSQL instance.

```bash
git clone <repo-url>
cd rating-system
npm install
cp .env.example .env
```

Fill in both values in `.env`:

- `DATABASE_URL` — your PostgreSQL connection string.
- `AUTH_SECRET` — signs the session cookie. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Then create the schema, load demo data, and start the app:

```bash
npm run db:deploy
npm run db:seed
npm run dev
```

Open <http://localhost:3000>.

### Demo accounts

All seeded accounts use the password **`Password@123`**.

| Role        | Email                      |
| ----------- | -------------------------- |
| Admin       | `admin@ratings.test`       |
| Store Owner | `vijay.owner@ratings.test` |
| Normal User | `parth@ratings.test`       |

The seed exists because the first admin cannot be created through the app:
public signup always creates a `NORMAL_USER`, and `POST /api/user` requires an
existing admin session. Every later account is created from the admin dashboard.

Signing up at `/signup` creates a normal user, so the rating flow can also be
tried with a fresh account.

## Scripts

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Development server                          |
| `npm run build`      | Production build                            |
| `npm run start`      | Serve the production build                  |
| `npm run lint`       | ESLint                                      |
| `npm run db:migrate` | Create and apply a migration (development)  |
| `npm run db:deploy`  | Apply existing migrations                   |
| `npm run db:seed`    | Reset app data and load the demo dataset    |
| `npm run db:reset`   | Drop, re-migrate and re-seed the database   |
