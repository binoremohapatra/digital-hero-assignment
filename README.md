# Digital Heroes Training Task - LeadDesk

A full-stack web application built for the Digital Heroes assignment. This project includes a stunning landing page for capturing leads and a secure Admin Dashboard for managing and reviewing those leads.

## 🚀 Live Demo
- **Frontend (Vercel):** [https://digital-hero-assignment.vercel.app](https://digital-hero-assignment.vercel.app)
- **Backend (Render):** [https://digital-hero-assignment.onrender.com](https://digital-hero-assignment.onrender.com)

---

## 🔐 Admin Dashboard Access

To access the Admin Dashboard to view and manage incoming leads, use the following credentials:

- **Email:** `admin@leaddesk.com`
- **Password:** `admin123`

> **Note:** If the credentials do not work in a new database environment, please visit `https://digital-hero-assignment.onrender.com/api/auth/seed` once in your browser to seed the admin user automatically.

---

## 🛠 Tech Stack
- **Frontend:** Next.js 15, React 19, Tailwind CSS, Aceternity UI, React Bits, Framer Motion
- **Backend:** Node.js, Express.js, JWT (JSON Web Tokens) for Authentication
- **Database:** PostgreSQL (Neon Serverless Postgres)
- **ORM:** Prisma
- **Validation:** Zod (Frontend & Backend)
- **Styling:** Tailwind CSS with custom Glassmorphism designs

---

## 📁 Project Structure

The project is structured as a Monorepo containing two main folders:

- `/frontend` - The Next.js UI application (Landing Page & Admin Dashboard)
- `/backend` - The Express API server & Prisma Database Configuration

---

## 💻 How to Run Locally

If you want to clone this repository and run it on your local machine, follow these steps:

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file in the `/backend` folder:
   ```env
   DATABASE_URL="your-postgresql-url"
   JWT_SECRET="your-super-secret-jwt-key"
   FRONTEND_URL="http://localhost:3000"
   ```
4. Generate the Prisma Client and push the schema to the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Set up your environment variables by creating a `.env.local` file in the `/frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 4. View the App
- Landing Page: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3000/admin`

---

## ✨ Features
- **Modern Landing Page:** Beautiful, animated UI for users to submit their contact information.
- **Secure Authentication:** JWT-based login system for administrators.
- **Admin Dashboard:** A private route where admins can view all submitted leads.
- **Real-time Status Updates:** Admins can change lead status (Pending, Contacted, Rejected).
- **Search & Filter:** Easily search leads by name/email or filter them by their status.
- **Form Validation:** Strict Zod validation on both client and server sides to prevent bad data.
