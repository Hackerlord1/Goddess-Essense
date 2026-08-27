# Goddess Essence 🌸

A modern e-commerce platform for women's fashion built with Next.js 15, Prisma, and Tailwind CSS.

![Goddess Essence](https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=400&fit=crop)

## Features

### Customer Features
- 🛍️ Browse products by category
- 🔍 Search products
- 🛒 Shopping cart
- ❤️ Wishlist
- 👤 User authentication
- 📦 Order tracking
- ⭐ Product reviews

### Admin Features
- 📊 Dashboard with analytics
- 📦 Product management
- 📁 Category management
- 🛒 Order management
- 👥 User management
- ⭐ Review moderation
- 🎟️ Coupon management
- 🖼️ Banner management
- 📧 Newsletter subscribers
- 💳 Payment tracking

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Database:** MySQL with Prisma ORM
- **Authentication:** NextAuth.js (JWT sessions, credentials provider)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Icons:** Lucide React
- **Deploy:** Vercel, or Cloudflare Workers via OpenNext (see below)

## Getting Started

### Prerequisites

- Node.js 18+
- A MySQL database (local, or a hosted provider such as Aiven / PlanetScale)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Hackerlord1/Goddess-Essense.git
   cd goddess-essence
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` from the template and fill in real values:
   ```bash
   cp .env.example .env
   ```
   | Variable | Notes |
   | --- | --- |
   | `DATABASE_URL` | MySQL connection string. |
   | `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | The origin the app is served from (e.g. `http://localhost:3000`). |

4. Set up the database schema and seed data:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```
   The app runs at http://localhost:3000.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js dev server. |
| `npm run build` | `prisma generate` + `next build`. |
| `npm run start` | Serve the production build (Node). |
| `npm run db:push` | Push `prisma/schema.prisma` to the database. |
| `npm run db:seed` | Seed demo products, categories, and banners. |
| `npm run db:studio` | Open Prisma Studio. |
| `npm run db:reset` | Force-reset the schema and re-seed. |
| `npm run deploy` | Build with OpenNext and deploy to Cloudflare Workers. |
| `npm run preview` | Build with OpenNext and preview the Worker locally. |

## Deployment

### Vercel (Node runtime)
Standard Next.js deployment. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, and
`NEXTAUTH_URL` as project environment variables. Prisma's default engine
works as-is.

### Cloudflare Workers (via OpenNext)
`npm run deploy` builds with `@opennextjs/cloudflare` and publishes using
[wrangler.jsonc](wrangler.jsonc). Set secrets with `wrangler secret put <NAME>`.

> **Note:** Prisma's default query engine does **not** run in the Workers
> runtime. For DB-backed routes to work on Workers you must switch
> `lib/prisma.ts` to a driver adapter (e.g. `@prisma/adapter-mariadb`) with
> `previewFeatures = ["driverAdapters"]` in the schema, or use Prisma Accelerate.

## Auth & access control

- Sessions are JWT-based; `id`, `firstName`, `lastName`, and `role` are carried
  on the token (see [lib/auth.ts](lib/auth.ts) and [types/next-auth.d.ts](types/next-auth.d.ts)).
- [middleware.ts](middleware.ts) protects `/account/*` (any signed-in user) and
  `/admin` + `/admin/*` (role `ADMIN` only).
- Admin API routes use `requireAdmin()` from [lib/admin-guard.ts](lib/admin-guard.ts),
  which reads the role from the session token (no extra DB query).
