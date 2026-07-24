# LeadDesk Mini

A modern, production-ready SaaS lead capture and management application built for the Digital Heroes Technical Assessment.

## Tech Stack
- **Framework**: Next.js 14/15 (App Router)
- **Styling**: Tailwind CSS (Dark SaaS aesthetics, glassmorphism)
- **Database**: Prisma ORM (SQLite for local dev, easily swappable to PostgreSQL)
- **Validation**: Zod & React Hook Form
- **Authentication**: Custom JWT-based auth via HTTP-only Cookies using `jose` and `bcryptjs`
- **Icons**: Lucide React

## Architecture & Data Model

The application follows a standard Next.js App Router pattern:
- **Public Routes**: `/` (Landing page with lead form)
- **Protected Routes**: `/admin/*` (Middleware protected)
- **API Routes**: Next.js Serverless Functions for handling data and auth

### Database Schema (Prisma)
- **Admin**: Stores admin credentials. `id`, `email`, `password` (hashed), `createdAt`.
- **Lead**: Stores submitted leads. `id`, `name`, `email`, `budgetRange`, `message`, `status` (NEW, CONTACTED, CLOSED), `createdAt`.

## Authentication Approach
Since this application runs on Next.js edge functions (middleware), the authentication uses `jose` to sign and verify JWT tokens, which is compatible with Vercel Edge Runtime. Passwords are encrypted using `bcryptjs`. The JWT is stored in an HTTP-only, secure, `SameSite=strict` cookie to prevent XSS and CSRF attacks.

## Setup & Deployment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   ```bash
   npx prisma db push
   ```

3. **Seed Admin Credentials**
   The application includes an endpoint to seed a default admin account. Once the server is running, visit:
   `http://localhost:3000/api/auth/seed`

   *Default Admin Credentials:*
   - **Email:** `admin@leaddesk.com`
   - **Password:** `admin123`

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## Swapping to PostgreSQL (Neon, Vercel)
The project currently uses SQLite for simplicity. To deploy to Vercel with a database like Neon PostgreSQL:
1. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
2. Update the `DATABASE_URL` in your `.env` to the PostgreSQL connection string.
3. Run `npx prisma db push` to push the schema to PostgreSQL.
