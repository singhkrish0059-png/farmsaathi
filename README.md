# FarmSaathi 🌱 — From Farmers, Directly to You.
Direct farmer-to-buyer marketplace. FARMER → FARM-SAATHI → BUYER. No middlemen, no payments (MVP).

## Tech stack
Next.js 14 (App Router) · React · TypeScript · Tailwind · Prisma · PostgreSQL · jose (JWT cookie) · bcryptjs · zod

## Setup (step by step)
1. Install Node 18+ and PostgreSQL. Create a database called `farmsaathi`.
2. `cp .env.example .env` and fill in `DATABASE_URL`, `AUTH_SECRET` (`openssl rand -base64 32`), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
3. `npm install`
4. `npx prisma generate && npm run db:push`
5. `npm run db:seed` (creates admin, 10 demo farmers, 20 demo products, 5 enquiries)
6. `npm run dev` then open http://localhost:3000

## Demo accounts
Admin: your `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Farmers: `farmer1@demo.farmsaathi.test` … `farmer10@…`. Buyer: `buyer@demo.farmsaathi.test`. Password for demo users: `demo-pass-123` (override with `DEMO_PASSWORD`). All demo rows have `isDemo = true` and "Demo Data" in their text. Phone numbers are fake.

## Security
bcrypt hashing, httpOnly JWT cookie, role checks on every API route (`requireRole`), owner checks on product edits, verified-only publishing, zod validation, HTML sanitising, upload type/size checks, rate limits on login/register/enquiries, verification documents stored in `private-uploads/` and served only to admins.

## Project structure
`src/app` pages + API · `src/components` UI · `src/lib` auth, db, validation, storage, security, i18n · `prisma` schema + seed

## Not built yet (see "Future improvements")
Complaints UI/API, admin product moderation UI, farmer public profile page, product edit/delete UI, natural-fertilizer finder page, About page, shadcn/ui and toasts, Kannada coverage for forms, tests. Later: payments, GPS radius search (lat/lng columns already exist), ratings, orders, alerts.

Deployment: Vercel or any Node host + managed PostgreSQL; set the env vars; replace `src/lib/storage.ts` with S3/Cloudinary (local disk is not persistent on Vercel) and the in-memory rate limiter with Redis.
