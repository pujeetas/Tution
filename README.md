# TuitionHub SG

A tuition marketplace MVP for the Singapore market. Parents browse and book qualified tutors for PSLE, O-Levels and A-Levels; tutors manage their profile and incoming booking requests.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router + Axios
- **Backend:** Node.js + Express
- **Database:** MongoDB with Mongoose
- **Auth:** JWT with separate `tutor` and `parent` roles

## Project Structure

```
/server          Express REST API
  /config        DB connection
  /controllers   auth, tutors, bookings
  /middleware    JWT auth guard, central error handler
  /models        User, TutorProfile, Booking
  /routes        API route definitions
  /seed          Sample data seeder
/client          React app (Vite)
  /src
    /components  common, tutor, booking, parent
    /pages       Home, Login, Register, TutorList, TutorProfile, BookingPage, dashboards
    /context     AuthContext (global auth state)
    /hooks       useAuth, useTutors, useBookings
    /services    api.js (axios instance + API calls)
    /utils       formatDate, constants
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup

### 1. Backend

```bash
cd server
npm install
copy .env.example .env     # macOS/Linux: cp .env.example .env
```

Edit `server/.env` if needed — defaults assume a local MongoDB at `mongodb://127.0.0.1:27017/tuitionhub-sg`. Set a strong `JWT_SECRET`.

Seed sample data (5 tutors, 2 parents):

```bash
npm run seed
```

Start the API server:

```bash
npm run dev        # nodemon, http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000`, so no client-side env config is needed.

## Test Accounts (after seeding)

All accounts use password **`password123`**.

| Role   | Email                      | Notes                                  |
| ------ | -------------------------- | -------------------------------------- |
| Tutor  | weiling.tan@example.com    | Math/Physics, O & A Levels, both modes |
| Tutor  | marcus.lim@example.com     | English/History, online only           |
| Tutor  | priya.nair@example.com     | Sciences, in-person only               |
| Tutor  | junhao.chen@example.com    | Math/Chinese, PSLE, online             |
| Tutor  | sarah.abdullah@example.com | Economics, A-Levels, both modes        |
| Parent | david.wong@example.com     | Child: Ethan (Primary)                 |
| Parent | meihua.lee@example.com     | Child: Chloe (JC)                      |

## API Overview

| Method | Endpoint                  | Access         | Description                                          |
| ------ | ------------------------- | -------------- | ---------------------------------------------------- |
| POST   | `/api/auth/register`      | Public         | Register as tutor or parent                          |
| POST   | `/api/auth/login`         | Public         | Login, returns JWT                                   |
| GET    | `/api/auth/me`            | Private        | Current user (+ tutor profile if tutor)              |
| GET    | `/api/tutors`             | Public         | List tutors; filters: `subject`, `level`, `mode`, `minRate`, `maxRate` |
| GET    | `/api/tutors/:id`         | Public         | Single tutor profile                                 |
| GET    | `/api/tutors/meta/options`| Public         | Available subjects/levels/modes                      |
| GET    | `/api/tutors/me/profile`  | Tutor          | Own profile                                          |
| PUT    | `/api/tutors/me/profile`  | Tutor          | Create/update own profile                            |
| POST   | `/api/bookings`           | Parent         | Create a booking (status: Pending)                   |
| GET    | `/api/bookings/me`        | Private        | Own bookings (parent: made; tutor: incoming)         |
| PATCH  | `/api/bookings/:id/status`| Private        | Tutor: Confirm/Complete/Cancel; Parent: Cancel       |

Booking lifecycle: **Pending → Confirmed → Completed** (Pending or Confirmed bookings can also be Cancelled).

## Not in this MVP (by design)

- Payments
- Real-time chat
- Video calling
- Email notifications
