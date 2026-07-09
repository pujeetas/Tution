# Uniad Enterprise — User Flow [MAIN] Spec

Condensed build spec derived from the Figma page "⭐️ User Flow [MAIN]" (34,991-line frame/text dump). Sections are ordered roughly as they appear in the file. Repeated UI chrome (left sidebar nav, top search/notification bar, footer, wrapper `[FRAME]`/`[INSTANCE]` noise) is described once here and omitted from individual screens below unless it differs.

## Global chrome (appears on almost every logged-in screen)

- **Left sidebar**: Logo ("Uniad Academy"/"Uniad Enterprise"), nav links — Dashboard, Registration, Calendar, Classes, Finances, Start Livestream, Manage Database, Organisation, Users (sometimes split into **Students** and **Admins** as separate links), Settings, Sign-out. A few screens show an expanded/aspirational nav with additional items: Analytics, Communication (Announcements w/ badge, Messages w/ badge), Lessons, Reports, Education Tools (Resources Library, Online Courses, Staff Training, AI Tutors) — treat these as "nice to have" ideas, not confirmed IA.
- **Top bar**: user name + role (e.g. "Kwon / Super Admin"), search field, notification bell.
- **Footer**: copyright + FAQs / Privacy Policy / Terms & Condition links.
- **List/table pattern** (Students, Admins, Classes, Accounts, Invoices, Transactions all reuse this): filter bar with primary "Add X" button, Filters button, search input, Options button, sometimes "View All Columns"; a second row shows "Showing X - Y out of Z records"; rows have a leading checkbox, an eye icon (view) and an sms icon (message) as row actions; pagination footer ("Page 1 of N", Previous/Next).
- **Form Builder wizard pattern** (class/event/invoice creation, registration forms): breadcrumb, title+subtitle, form fields grouped in cards, bottom action row with "Review changes" / "Discard Changes" / primary submit button (usually rendered twice as "button 1 / button 2" — a component-variant artifact, not two real buttons).

---

## 1. Public Landing Page

**Purpose**: Marketing/waitlist page for the (unshipped) product, gated behind an email capture, not part of the logged-in app.

- Hero: "Grow your education business infinitely." + email input + "Join Our Priority List" CTA (appears twice, top and bottom of page).
- Feature highlights: Lessons (scheduling), Payments (invoicing/payments/expenses), Livestreams (unlimited, no extra cost).
- "Personalised All-in-One Business Suite" section — claims "Reduce up to 90% of your administrative tasks."
- Intro video section ("Built Exclusively For You").
- "Smart Automation" / "Flexible Solutions" feature pairs with product screenshots.
- Testimonials section ("Satisfied Educators").
- Closing tagline: "No trial period - it's free... manage student database, flexible scheduling, online payments and livestreams."
- Footer: logo, contact email, App Store link, About/Privacy/Terms links.
- Second "Ready to scale?" CTA block repeating the email capture.

---

## 2. Sign Up / Log In

Already known but confirmed with exact fields:

- **Sign Up**: heading "Sign up for an account". Fields — Email, Password (with show/hide eye toggle), Confirm Password. Checkbox "By clicking Sign Up, I agree to Terms & Conditions". Primary button "Sign Up". Social sign-in row: Google / Facebook / Apple.
- **Log In**: heading "Log in". Fields — Email, Password (eye toggle). "Remember me" checkbox next to the Log in button. Links: "Don't have an account? Sign up here", "Forgot Password?". Same social sign-in row (Google/Facebook/Apple).
- Both screens share a top nav with logo + "Require assistance? Contact Us".

---

## 3. Profile Creation & Onboarding Completion (Individual/Parent POV)

- **Individual Profile Creation**: heading "Create your Profile — Let's set up your personal profile." Fields: Your Name*, Date of Birth*, Phone Number* (with country-code dropdown, default +65), and a key branching question **"Are you an individual or a team?"** (dropdown, default shown "I'm an individual"). Buttons: Previous / Continue.
  - **This dropdown is the conditional switch for the whole app**: selecting "I'm an individual" simplifies every downstream flow (see section 8, Individual vs Team conditional logic).
- **Individual Profile Created**: confirmation screen — "Account created successfully! Welcome aboard! Let's start your success journey with Uniad Enterprise." Single button "Let's start!" which proceeds into the Form Builder.

---

## 4. Form Builder module

**Purpose**: An admin tool for customizing the registration forms used to collect Student, Parent, Admin (and Staff) data — lets admins add/remove/reorder fields, mark fields compulsory, toggle whole sections on/off, and publish. It also doubles as the generic "wizard shell" used for Add Class, Add Event, and Create Invoice flows (same visual chrome, different field sets) — treat "Form Builder" as a reusable page template, not one single screen.

### 4a. Form type selection
Step "Select Form Type — Choose the type of form you want to create." Shows cards for **Student Form**, **Staff**, **Admin Form**, each with an Incomplete/Complete status pill. "Continue" button.

### 4b. Field editor (per form type)
Once a form type is chosen, shows a breadcrumb (Home / Form / Forms / <Form Name>) and title e.g. "Student Registration Form — Add and customise fields for the Student Registration Form." Body is a draggable list (`ArrayField`) of field rows, each row showing:
- drag handle, field label, required-field asterisk if applicable, a status/avatar area (decorative), and a **⋮ (ellipsis) menu** per field — this is where "Remove field" / "Make compulsory" actions live (menu contents themselves aren't dumped as text, but the affordance is present on every field row).
- A "+ Add item" button to add new fields.
- Section headers (e.g. "Student Details Section", "Parent Details Section") act as group dividers; the Parent Details section header has an **"Include this section" checkbox** — i.e. whole sections can be toggled optional.
- Footer actions: "Review changes" / "Discard Changes" / **"Save and Publish Form"**.

**Confirmed field sets found in the dump:**
- **Student Registration Form** — *Student Details*: Full Name*, Date of Birth (DD/MM/YYYY)*, Phone Number*, Email Address*, Gender, NRIC (Last 4 Digits), Home Address, Postal Code, Level, School Name. *Parent Details* (toggle-able section): Full Name*, Date of Birth*, Phone Number*, Email Address*.
- **Admin Registration Form** — *Personal Details*: Full Name*, Date of Birth*, Phone Number*, Email Address*, Gender, NRIC (Last 4 Digits), Home Address, Postal Code.
- **Staff/Job field-library examples** seen as standalone field prototypes (likely draggable field-type templates rather than one fixed form): Work Phone, Qualifications, and a "Job Details Section" with Employee ID*, Position*, Department*, Supervisor.
- A separate small `ArrayField` example shows "Select Class Section" / "Select Classes" fields — likely part of a class-assignment or bulk-enrollment form variant.

### 4c. Reused as "Add a New Class" wizard
Same shell, title "Add a New Class — Set up and manage your classes." Fields: Class Name*, Lesson Type, Class Schedule* (date/time picker), Levels, Subjects, Class Location, Assign Tutors, Assign Students, Description, Visibility (radio: "Public (Visible to all users)" / "Private (Visible to attendees only)"). Buttons: Review changes / Discard Changes / **Create Class**.

### 4d. Reused as "Add a New Event" wizard
Same shell, title "Add a New Event." Fields: Class Name* (reused label — likely should read "Event Name"), Event Category*, Event Schedule* (date), Event Location, Description, Visibility (Public/Private radio). Submit button is also labeled "Create Class" in the dump — appears to be a copy-paste artifact from the Add Class component, not a real distinct label.
- A **Navigator popover** (triggered from the calendar's "+" control) lets the admin choose between "Add a Class" and "Add an Event" before landing on the respective wizard.
- Once a schedule/type is chosen, a compact inline form appears with **Starts at** (date + time), **Ends at** (date + time), and **Repeat** (dropdown, default "None") — i.e. recurring event/class support.

---

## 5. Admin "Getting Started" checklist (Welcome / first-run dashboard)

**Purpose**: Onboarding checklist shown to a new org admin on first login to guide them through setup.

- Heading: "Welcome to your admin dashboard 🎉 — Let's complete these simple steps to get your classes up and running."
- Sidebar checklist "Getting Started" with a progress bar (e.g. "1/5", "4/5") and ordered tasks:
  1. **Create Registration Forms** — detail panel offers checkboxes for which forms to set up (Student Form, Admin Form) and two paths: "Customise Forms" (→ Form Builder) or "Continue with templates" (skip customization, use defaults).
  2. **Add Users** — detail panel offers checkboxes (Add Students, Add Admins) and button "Add Users" → user-add flow.
  3. **Create Classes** — button "Setup Classes" → Add a New Class wizard.
  4. **Set up Calendar** — copy: "Generate a calendar based on your class schedules." Button "Generate Calendar" (implies calendar auto-populates from class schedules rather than being manually built).
  5. **Configure Finances** — copy: "Set up your finance module to manage billing, invoicing, and payments." Button "Setup Finance".
- Note: "Calendar is already generated through users' created class schedules" confirms Calendar is largely a derived/read view of Class session schedules, with manual one-off Events layered on top.

---

## 6. Calendar

Three view modes, switchable, all sharing the same header (month/week/year label + "+ Add Event" button):

- **Month View**: 7-column day grid; each day cell can show 1–2 event pills (name + time) with a "+N More" overflow indicator when a day has more events than fit.
- **Week View**: hourly time-grid (rows from ~08:00–19:00, wrapping) × 7 day columns; events render as blocks with name/time and, when there's room, a short description.
- **Year View**: a 3×4(ish) grid of mini month-calendars for the whole year, each mini-calendar also has its own "+ Add Event" affordance.
- Clicking "+ Add Event" opens the Navigator popover (Add a Class vs Add an Event) described in §4c/4d.

---

## 7. Students / Admins management

- **List view** (table): columns for Students — Name, Level, Class, Status, Phone Number, Last Logged In; columns for Admins — Name, Phone Number, Email Address, Status. Both support row-select checkboxes, "Options", "View All Columns", search ("Search Names, Classes...").
- **Grid/Card view**: a "GRID VIEW" toggle exists alongside the list view (frame markers present but the card layout itself wasn't dumped for students — see Class Grid View in §9 for the analogous card pattern used for Classes).
- **Bulk Actions** (on multi-select): "Add to New Class", "Add to Existing Class", "Delete Students".
- **Adding users** — clicking "Add Students"/"Add Admins" opens a Navigator dropdown with two paths:
  - **"Add A New Student/Admin"** (manual single entry) → a step-wizard: Step 1 "Student/Admin Details" (same field set as the Registration Form in §4b) → Step 2 "Parent Details" (students only) → Step 3 "Confirmation"/"Preview" (review all entered data) → Next/Previous navigation, final "Submit".
  - **"Import Students/Admins"** (bulk) → a bulk-invite screen: "We will send an email invite to the student/admin to complete the registration form. To invite multiple at once, separate each email with a comma." One textarea field for comma-separated emails; alt action "Add Manually" (drops back to the manual single-entry wizard); primary action "Send Invite". (Confirmed via node `589-36597`: the email field is a `Select`-style component, not a plain `<textarea>` — likely a multi-value/chip email input rather than free text, worth matching if this screen is built literally.)
- **Filters bar** above the table: "Add Students" (primary button), "Filters" (opens more filters), a "Search Names, Classes..." input, and an "Options" button (gear icon) — separate from the per-column sort/filter carets already implied by "View All Columns" above. A second, thinner bar directly below shows the result count, e.g. "Showing 0 - 0 out of 0 students" (empty-state copy, confirms the list paginates and reports a live count).
- **Pagination footer**: "Previous" / "Page X of Y" / "Next", standard across list views.
- **Persistent dashboard chrome** (confirmed via node `521-17207`, top of every authenticated screen, not specific to Students): top bar with a global search box, a notifications bell (unread-dot indicator), and a user widget showing name + role label (e.g. "Kwon" / "Super Admin") — i.e. the logged-in admin's role is surfaced directly in the header, not just in Settings. Footer repeats on every screen: "© 2024 - Uniad Academy. All rights reserved" + FAQs / Privacy Policy / Terms & Condition links.
- **Noise flag**: the top search box's placeholder in this frame reads "What do you want learn..." — reads like leftover LMS/course-marketplace template copy (compare the Horizon UI leftovers already flagged in the README's noise list), not intentional Uniad copy. Don't build the literal placeholder text; a generic "Search Names, Classes..." (as used in the table's own search field) is more consistent with the rest of the product.

---

## 8. Invited-user self-onboarding flow (Student/Parent POV and Admin POV)

Triggered when a student/parent (or admin) receives and completes an email invite. Both POVs share the same screen sequence, differing only in whether the Parent Details step exists:

1. **Onboarding Student/Admin Details** — same field set as §4b's registration form (Full Name*, DOB*, Phone*, Email*, Gender, NRIC, Home Address, Postal Code, plus Level/School Name for students). Stepper shows progress (e.g. "7/14"). "Next" button.
2. **Onboarding Parent Details** *(students only — skipped for admin invites)* — same Full Name*/DOB*/Phone*/Email* fields for the parent, plus a "Select Programs" section where the parent picks up to N existing class programs to enroll the student in (e.g. "Program #1: Sec 4 Chemistry Sat 2PM"). Consent line: "By submitting this form, I agree and consent to your personal data which I provide to Uniad Academy." Previous/Submit.
3. **Account Creation** — heading "Create your Profile — Let's set up your personal profile." Fields: Email (pre-filled from invite), New Password, Confirm Password, T&C checkbox, "Sign Up" button.
4. **Onboarding Confirmation** — read-only review screen of everything entered in steps 1–2 (Student Details, Parent Details, selected Programs), Previous/Submit.
5. **Onboarded Student/Admin** — success screen: "Account created successfully! Welcome aboard! Let's start your success journey with Uniad Enterprise." Button "Let's start!"

### Conditional logic (explicit callouts found in the file)
- "If user selected 'I'm an individual user' for 'Are you an individual or a team?' question in onboarding will only show 'Student Form'" — i.e. solo/individual tutors' Form Builder skips the Admin/Staff form entirely; only the Student registration form exists.
- "...will only show 'Add Students'" — i.e. the Getting Started checklist's "Add Users" step is simplified to just Add Students for individual tutors (no "Add Admins" option, since there's no team to add).

---

## 9. Classes

- **List view**: columns Class Title, Level, Schedule, Teachers (avatar stack), Students (avatar stack + overflow count e.g. "152+"); "Add A New Class" button; row eye/sms actions.
- **Grid/Card view ("Class List_Grid View")**: each class renders as a card — class name + subtitle, Students count stat, Tutors count stat, an overflow menu, and a primary card action button **"Mark Attendance"**. Cards paginate ~4 per row.

---

## 10. Student Profile

**Purpose**: Single-student detail page for admins (breadcrumb: Students / … / <Student Name>).

- Header: avatar, name, role label ("Student"), 3 stat tiles (Enrolled Classes, Upcoming Lessons, "Project Visits" — this last one looks like leftover placeholder copy, not a real Uniad metric).
- Tabs: Student / Parent (switches which profile's personal info is shown) — a 3rd unlabeled "Tab3" placeholder also exists.
- A month/year calendar widget (personal schedule view).
- **Notes** card: list of timestamped notes/updates with a progress % and Edit/Delete row actions (content in the dump is Lorem-ipsum/placeholder — real content unclear).
- **Enrolled Classes** card: list of the student's classes with schedule.
- **Invoices** card: color-coded alert rows — e.g. red "S$300 overdue on 10 Jul 2024", amber "S$200 due on 14 Jul 2024", green "S$300 paid on 7 Jul 2024".
- **Assigned Resources** card: list of files (name + size), e.g. class notes documents.

---

## 11. Admin Dashboard — Overview

**Purpose**: Landing page after login for admins; at-a-glance operational + financial stats.

- Header filters: "All Branches" dropdown, date-range dropdown (e.g. "Today").
- Row 1 stat tiles: Upcoming Lessons, Completed Lessons, Reschedule Requests, Cancellations.
- Row 2 stat tiles: New Enrollments, Total Students, Invoiced Amount ($), Payments Collected ($).
- **Recent Activity** feed: chat/message events, ratings, payments, purchases, each with a relative timestamp (e.g. "Johnny messaged 'Hi I would like to enquire regarding enrollment.'").
- **Revenue** chart: line/area chart over a date range with a hover tooltip showing $ value + date.
- **Lessons** widget: lessons-conducted count, filterable by period ("This week").
- **Enrollment** bar chart: enrollments per day of week, filterable by period.
- **Student Feedback / Overall Course Rating**: average score (e.g. 4.6) + star-distribution bars (5-star down to 1-star, each with a %).
- A second, alternate exploration of this same dashboard (id 777:70289) shows a slightly different card layout: Total Revenue (with WoW/DoD % change + Invoiced sub-figure), Total Students (+ New Enrollment sub-figure), Lessons Conducted (+ Upcoming Lessons sub-figure), a Financials bar chart, a "New Leads" panel, and a mini calendar. Treat this as a duplicate layout exploration of the same widget set, not a separate screen.
- A rough handwritten widget brainstorm list also appears in the file (id 823:49550, not a real screen — just planning notes): Overview / Last week / #Students / #Leads / #Classes / Upcoming events (calendar) / Revenue / Latest payments & activities / Analytics 1 (pie chart?) / Analytics 2 (map?).
- Earlier planning notes (already known) list further candidate widgets: # Students, # Admins, Classes Breakdown, Livestream stats, Top Students/Classes, Attendance tracker, Announcement Board; plus an "Upcoming Events" widget where ongoing events get an inline "Mark attendance" button.

---

## 12. Finances module (Accounts / Invoices / Transactions)

Sub-tabs under "Finances": **Accounts**, **Invoices**, **Transactions**, and (seen once) **Payment Methods**.

- **Accounts tab**: one row per student/family account. Columns: Student Name, Account Balance, Outstanding Invoices (count), Parent Name, Last Payment Date. (Example rows show both $0.00/0-outstanding and negative balances like "-$200.00"/1 outstanding.)
- **Invoices tab**: columns Invoice Date, Student Name, Date Range (billing period, e.g. "1/7/2024 - 31/7/2024"), Amount, Due Date, Status badge (Paid / Unpaid / Overdue). Primary action "Create Invoice".
- **Transactions tab**: columns Date, Student Name, Transaction (Revenue/Expense + signed $ amount, color-coded), Description (free text, e.g. "Lesson Fee received via paynow", "Refund for Sean's lesson (MC received)"). Primary action "Create Transaction".
- **Create New Invoice wizard**: org header block (name/address/phone, auto-filled from org profile), Students* selector (with a "Select a Class" helper to bulk-pick everyone in a class), Invoice Date*, Due Date, "Send via" options (Email / Export as PDF / Send Later), an itemized line-item table (Product, Quantity, Unit Price, Discount %, Final Amount) with "+ Add new item", a Tax line, and a Grand Total. Actions: Preview / Discard changes / **Create Invoice**.

---

## 13. Attendance-taking → Invoicing → Payment flow

End-to-end flow, entry points and steps confirmed against the dump (matches and extends the previously-known summary):

1. **Entry points**: "From Calendar → Select Session" or "From Classes → Select Session" (i.e. clicking a class session in either the Calendar or the Classes list/grid can kick off attendance-taking). The Class card's "Mark Attendance" button (§9) is the other entry point.
2. **Mark Attendance screen**: shows Class Details (Name, Time, # Students), a Date field auto-set to today (with an option to change it manually), and a Student List where each student has an **Attendance Status** dropdown: **Present / Absent (Valid) / Absent (Invalid) / Late**. All students default to "Present"; each row can also take a free-text remark. "Submit" button.
3. **Confirm & Generate Invoice**: billable items are pre-selected based on the attendance just taken (e.g. present/late students get billed, absent-valid may be excused — exact billing rule per status isn't specified in the dump). Admin can optionally add extra line items to the invoice.
4. **Select Student to invoice** → **Choose Payment Method**: FazzPay (if available; ~2% processing fee, automated tracking & logging), Stripe (~5% fee, automated), or Manual (0% fee, manual tracking — e.g. PayNow/bank transfer).
5. **Send out invoice**: via Email + an embedded QR code.
6. **Student receives invoice** and pays:
   - Via **FazzPay/Stripe**: student follows in-invoice payment instructions/link → transaction is **logged automatically** in the database.
   - Via **Manual**: student pays the admin directly (bank transfer/PayNow) → **admin manually logs the transaction** in the database.
7. Either path: the **student's outstanding balance is automatically deducted** once the transaction is recorded.
8. A concrete worked example in the file: a single class ("Class 1") with Student A (balance S$300), Student B (S$400), Student C (S$500) generates three invoices in one batch — "Invoice for Student A - S$300 payment", etc. — demonstrating that invoicing can run per-class across all attended students at once, not just per-student.
9. A precursor setup step is referenced but not detailed: **"Add Course Fee (billing) structure"** — implies admins must configure per-class/per-course fee amounts somewhere (likely under Classes or Finances settings) before this flow can compute billable amounts; no fields for this were present in the dump.

---

## Open questions / unclear

1. **"Profile", "NFT Marketplace", and "Main Dashboard" frames (ids 822:47631, 822:48337, 822:48710)** are near-verbatim **Horizon UI ("Simmmple") admin dashboard template screens** — footer literally reads "© 2022 Horizon UI. All Rights Reserved. Made with love by Simmmple!" and content is crypto/NFT marketplace demo data (ETH bids, "Adela Parkson", etc.), completely unrelated to Uniad. These read as UI-kit reference/inspiration material pasted into the file rather than real product screens. Recommend **not** building these as-is; if the designer intended a real "Profile" page or richer "Main Dashboard," that intent isn't captured in this dump and needs clarification.
2. **Overflow/ellipsis (⋮) menu contents on Form Builder field rows** are never spelled out as text (icon-only in Figma) — the user's own notes say "Remove field"/"Make compulsory" but this isn't independently confirmed by the dump; worth verifying against the visual before building.
3. **"Add an Event" wizard's submit button is labeled "Create Class"** in the dump — almost certainly a copy-paste artifact from the Add Class component rather than an intentional label; verify visually.
4. **GRID VIEW toggle for Students/Admins lists** is referenced (frame markers "GRID VIEW" appear as annotations) but the actual card layout was never dumped for Students/Admins — only the Classes grid view was. Assume it's visually similar to the Classes card pattern but confirm against Figma.
5. **"Payment Methods" as a 4th Finances sub-tab** appears in the tab list on the Accounts screen only, not on Invoices/Transactions screens (which list just 3 tabs). Unclear if this is a real 4th tab that was inconsistently mirrored, or a mistake in one frame.
6. **Attendance status → billing rule** is not specified: it's unclear whether "Absent (Valid)" is excused from billing, billed at a different rate, or billed the same as Present. Needs product decision.
7. **"Add Course Fee (billing) structure"** step referenced as a flow precursor has no fields/screen captured in the dump — where/how admins actually set course pricing is unknown.
8. **Student Profile page content** (Notes, some Enrolled Classes/Assigned Resources entries) is largely Lorem-ipsum/generic template placeholder text (e.g. "Ant Design Title 4", Chinese placeholder names) — treat the layout/card structure as intentional but the sample content as non-authoritative.
9. **Expanded sidebar nav** (Analytics, Communication/Announcements/Messages, Lessons, Reports, Education Tools submenu) appears only on the "Overview" (id 777:69557) frame and nowhere else — unclear if this is the eventual target IA or an unused exploration; the simpler nav (Dashboard/Registration/Calendar/Classes/Finances/Start Livestream/Manage Database/Organisation/Users/Settings) is far more consistent across the rest of the file and is probably the safer baseline.
10. **Two "Onboarded Student" success screens are reused for the Admin invite flow too** (i.e., after an invited Admin completes onboarding, the confirmation screen still says "Onboarded Student" internally) — purely a Figma naming artifact, but flag in case any copy differs for the admin path that wasn't captured.
