# Promo Materials — polished reference screens

Source: Figma "Uniad Enterprise (Copy)" page "📢 Promo Materials". Unlike the Ideation/Archived pages, these frames look like finished, marketing-ready screens (populated with realistic sample data) rather than rough flow sketches — treat these as the highest-fidelity reference for final visual/data shape when they overlap with other pages.

## Global shell (present on every screen in this file)

- **Left sidebar**: Logo ("Uniad Academy") + nav: Dashboard, Analytics, Registration, Calendar, Finances, — Communication (Announcements [badge], Messages [badge]), — Manage Database (Organisation, Users, Lessons, Reports), — Education Tools (Resources Library, Online Courses, Staff Training, AI Tutors), then Settings / Sign-out pinned at bottom.
- **Top bar**: current user's name + role (e.g. "Kwon / Super Admin", "John / Tutor"), search box, notification bell.
- **Footer**: copyright + FAQs / Privacy Policy / Terms & Conditions links.

## Registration - Student Details

A registration form screen for entering a student's details (first frame in this page — likely the same "Registration" module referenced elsewhere; not deeply inspected here since Ideation Materials/User Flow MAIN cover Registration in more depth).

## Analytics

A full analytics dashboard, organized into three sections, each with a "This year" (or similar) period dropdown:

- **Financials**: Profit Analysis (combo bar/line chart, revenue vs. expenses over months, e.g. "$65,310"), Expense Report (doughnut chart broken down by Salaries / Rent / Marketing / Admin / Materials, e.g. "$53,200"), Revenue by Course (horizontal bar chart, revenue per course e.g. "Pri - Math", "Pri - Sci", "Pri - Eng", e.g. "$142,310").
- **Enrollment and Demographics**: New Intakes (line chart by course/month, e.g. "523"), Enquiries Distribution (pie chart, e.g. "1,521"), Enrollment Demographic (pie chart by course, e.g. "2,401").
- **Academic Performance and Progress**: Average Scores by Class/Subject (radar chart across courses + "Overall", e.g. "87.5"), Progress Tracking (stepped line chart by day, e.g. "1,493"), Outcome Success Rate (bar chart, e.g. "92.5%").

All charts show a date range subtitle (e.g. "1 Jan 2024 - 1 June 2024").

## Overview (admin dashboard home)

This is the fullest spec of the admin "Dashboard" landing page:

- Header controls: **branch selector** ("All Branches" — confirms multi-branch orgs are core, not edge-case) + **date range selector** ("Today").
- Stat tile row 1: Upcoming Lessons, Completed Lessons, Reschedule Requests, Cancellations.
- Stat tile row 2: New Enrollments, Total Students, Invoiced Amount, Payments Collected.
- **Recent Activity** feed: timestamped events e.g. "Johnny messaged 'Hi I would like to enquire regarding enrollment.'" / "Kimmy gave a 5 star rating on course 'PSLE Mathematics by Mr. Teo'" / "Jimmy made payment for 'JC Math (May 2024)'" / "Dingdong purchased course 'O-Level Bootcamp'" — mixes messages, ratings, payments, and course purchases into one stream.
- **Revenue** chart: area/line chart over a date axis (e.g. "Aug 01" – "Aug 31"), with a hover popup showing a value at a date (e.g. "$51,749" on "7th Aug"), period dropdown ("This month").
- **Lessons** stat: e.g. "75 Lessons conducted" this week, with period dropdown.
- **Enrollment** bar chart: by day of week (Sun–Sat), period dropdown ("This month").
- **Student Feedback**: overall rating (e.g. "4.6") plus a 5-star breakdown with percentages (5★ 56%, 4★ 37%, 3★ 8%, 2★ 1%, 1★ <1%).

## Teaching (tutor-facing dashboard)

The same shell logged in as a Tutor ("John / Tutor") instead of admin:

- Smaller stat tile row: Upcoming Lessons, Completed Lessons, Cancellations (no Reschedule Requests, no financial tiles — tutor view is scoped down from admin's).
- A **Students** table scoped to that tutor's own students: Filters bar (Filters button, "Add User" button, search), columns: Student (name + email), Subject, Level, Class, Days — plus per-row actions (copy, download, delete, edit). Paginated ("Page 1 of 10").
- Sample rows: Wei Jun / English / Primary / J2 / Tue,Wed; Kim An / English / Primary / J2 / Tue,Wed; Jay En / Mathematics / Primary / L1 / Thurs,Fri; Kopi C / Science / Primary / L1 / Thurs,Fri; Jamie Lee / Mathematics / Primary / L2 / Sat,Sun.

## Calendar

Present but mostly graphical (calendar grid) with little distinct text beyond what's already captured for Calendar Month/Week/Year views in the User Flow MAIN page spec — not separately detailed here.

## How this fits the rest of the spec

- Confirms **multi-branch** is a first-class concept on the main dashboard (branch selector), consistent with the Organisation Profile Creation flow in [[03-archived-future]] where an org sets up multiple branches.
- The tutor-scoped "Teaching" dashboard is a distinct, simpler view from the admin "Overview" — worth keeping as two separate dashboard components rather than one dashboard with role-based hiding, since the tutor view has a materially different students-table-first layout.
- Analytics is a substantial dedicated module (9 distinct charts across 3 categories) — bigger scope than a single "Overview" stat row; likely its own nav item and page, matching the "Analytics" sidebar entry seen everywhere.
