# TuitionHub SG

A tuition marketplace + centre-management MVP for the Singapore market. Parents browse and book qualified tutors for PSLE, O-Levels and A-Levels; tutors manage their profile and incoming booking requests; tuition centres (`centre` role) onboard, run a Getting Started setup flow, and manage their own staff tutors, students, and admins.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router + Axios
- **Backend:** Node.js + Express
- **Database:** MongoDB with Mongoose
- **Auth:** JWT with `tutor`, `parent`, and `centre` roles

## Project Structure

```
/server          Express REST API
  /config        DB connection
  /controllers   auth, tutors, bookings, students, organizations
  /middleware    JWT auth guard, central error handler
  /models        User, TutorProfile, Booking, Student, Organization
  /routes        API route definitions
  /seed          Sample data seeder
/client          React app (Vite)
  /src
    /components  common, tutor, booking, parent, centre, students, onboarding, layout
    /pages       Home, Login, Register, TutorList, TutorProfile, BookingPage,
                 dashboards (tutor/parent/centre), GettingStarted, StudentsPage, AdminsPage
    /context     AuthContext (global auth state)
    /hooks       useAuth, useTutors, useBookings, useOrgAdmins
    /services    api.js (axios instance + API calls)
    /utils       formatDate, constants
```

Centre accounts complete a post-signup **Getting Started** flow (`client/src/pages/GettingStarted.jsx`) covering org info, a Form Builder for the Student/Admin registration forms, staff tutor setup, and adding admins, before landing on the centre dashboard (`CentreDashboardPage`) with its own Students and Admins management screens.

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

| Method | Endpoint                    | Access          | Description                                          |
| ------ | ---------------------------- | --------------- | ----------------------------------------------------- |
| POST   | `/api/auth/register`         | Public          | Register as tutor, parent, or centre                  |
| POST   | `/api/auth/login`            | Public          | Login, returns JWT                                    |
| GET    | `/api/auth/me`               | Private         | Current user (+ tutor profile if tutor)                |
| PATCH  | `/api/auth/onboarding`       | Private         | Mark the Getting Started flow complete                 |
| PATCH  | `/api/auth/form-config`      | Private         | Save Form Builder field config for registration forms  |
| GET    | `/api/tutors`                | Public          | List tutors; filters: `subject`, `level`, `mode`, `minRate`, `maxRate` |
| GET    | `/api/tutors/:id`            | Public          | Single tutor profile                                   |
| GET    | `/api/tutors/meta/options`   | Public          | Available subjects/levels/modes                        |
| GET    | `/api/tutors/me/profile`     | Tutor           | Own profile                                            |
| PUT    | `/api/tutors/me/profile`     | Tutor           | Create/update own profile                              |
| POST   | `/api/bookings`              | Parent          | Create a booking (status: Pending)                      |
| GET    | `/api/bookings/me`           | Private         | Own bookings (parent: made; tutor: incoming)             |
| PATCH  | `/api/bookings/:id/status`   | Private         | Tutor: Confirm/Complete/Cancel; Parent: Cancel            |
| GET    | `/api/students/me`           | Parent          | Own children                                            |
| POST   | `/api/students`              | Parent          | Add a child                                             |
| PATCH  | `/api/students/:id`          | Parent          | Update a child                                          |
| DELETE | `/api/students/:id`          | Parent          | Remove a child                                          |
| GET    | `/api/students/added`        | Tutor, Centre   | Students added on a parent's behalf                      |
| POST   | `/api/students/add-for-parent` | Tutor, Centre | Add a student for a parent (tutor/centre-initiated)        |
| POST   | `/api/students/bulk-delete`  | Tutor, Centre   | Bulk-delete added students                               |
| GET    | `/api/organizations/me`      | Centre          | Own organization                                        |
| PATCH  | `/api/organizations/me`      | Centre          | Update own organization                                  |
| GET    | `/api/organizations/me/staff`| Centre          | List staff tutors                                        |
| POST   | `/api/organizations/staff`   | Centre          | Create a staff tutor                                     |
| GET    | `/api/organizations/meta/options` | Centre     | Staff tutor field options                                |
| GET    | `/api/organizations/admins`  | Centre          | List org admins                                          |
| POST   | `/api/organizations/admins`  | Centre          | Add an org admin                                          |
| POST   | `/api/organizations/admins/bulk-delete` | Centre | Bulk-delete org admins                             |

Booking lifecycle: **Pending → Confirmed → Completed** (Pending or Confirmed bookings can also be Cancelled).

## Not in this MVP (by design)

- Payments
- Real-time chat
- Video calling
- Email notifications
