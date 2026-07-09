# Ideation Materials — Screen & Flow Spec

Source: Figma page "Ideation Materials" (early-stage explorations, precursor to the main "Uniad Enterprise" flow). 152 top-level frames covering Student, Tutor, SuperAdmin and Parent POVs, Sign In, Core Modules, Registration, Database Management and Finance.

This page mixes two visual systems: a **mobile app** (iOS status bar, bottom tab nav — Student/Tutor facing) and a **desktop enterprise console** (left sidebar nav, top dashboard bar, footer — Admin/SuperAdmin/Tutor facing). Shared chrome is documented once below rather than repeated per screen.

---

## Shared chrome (appears on nearly every desktop frame)

**Sidebar nav** (`Uniad Academy` logo, occasionally `Learning Lab` — see Open Questions):
- Dashboard, Analytics, Registration, Calendar, Finances (expands to Overview / Invoices / Manage Fields on Finance screens)
- **Communication**: Announcements (badge "1"), Messages (badge "3")
- **Manage Database**: Organisation, Roles & Access Control (only shown on Access Control screens), Users (expands to Students / Teachers / Admins on DB screens), Lessons, Reports
- **Education Tools**: Resources Library, Online Courses, Staff Training, AI Tutors
- Settings, Sign-out (footer of sidebar)

**Dashboard top bar**: user name + role (e.g. "Kwon / Super Admin"), global Search, notification Bell.

**Page footer**: "© 2024 - Uniad Academy. All rights reserved" + FAQs / Privacy Policy / Terms & Condition links.

**Shared table chrome** (Database Management, Finances, Access Control lists): Filters button, search-with-icon input, Add-record button, Export, Edit Columns / View All Columns toggle, paginated footer ("Page X of Y", Previous/Next). Row actions are icon buttons: copy, download, edit (pencil), delete (trash).

**Mobile chrome**: iOS-style status bar (time/battery/notch) on every screen; bottom tab bar with icon+label (order/labels vary slightly by screen: Home, Calendar, Chat, Lessons/Courses, Account/Profile).

---

## Registration Module

Confirmed 3-approach note found on canvas (flowchart annotation, not a screen): registration can happen via **(a)** physical setting, admin fills the form on behalf of Student/Parent; **(b)** physical setting, S/P fills the form themselves on a tablet; **(c)** online, admin sends a link or creates an account for S/P to log in and fill the form themselves. Flow diagram arrows/labels (not real screens, just annotations on the canvas) show: `Student & Parent` → 3-approaches note → branches to `Admin Staff` and `Teacher` roles; `Save as Draft` / `Save&Next` labels on step transitions; a `Branch / Program` node; after S&P registration completes, a note reads **"Student & Parent accounts are created (default PW) / Invoice sent to the accounts"**, followed by a decision node **"Sends Account Login Details?"** (appears for both the S&P and Teacher flows) — this is a real conditional the backend needs to support (send-credentials toggle at account creation).

### Registration hub ("Registration - Register")
Purpose: landing page for starting or resuming a registration.
- "Create New" row: 3 tool-cards — Student/Parent (2,736 Accounts), Staff (183 Accounts), Teacher (40 Accounts) — each launches that role's wizard.
- "Drafts" section: list of in-progress drafts by name + last-saved date.

### Registration — Student & Parent (S&P), 4-step wizard
Step indicator shows: **Student Details → Parent Details → Select Programs → Confirmation**, each with a fraction progress badge (e.g. "7/14") and a checkmark once complete.

1. **Student Details**: Full Name, Gender, Level, Program, Date of Birth (DD/MM/YYYY), NRIC (last 4 digits), Phone Number, Email Address, Home Address, Postal Code, School Name, plus 4 org-customizable fields (labelled "Customisable#1–4": Course Language, Subtitle Language, Course Level, Course durations w/ day picker). Buttons: Cancel, Save & next.
2. **Parent Details**: "Link to Existing Parent Account" selector (reuse an existing parent instead of creating new), then the same personal-info field set as Student Details (Full Name, Gender, DOB, NRIC, Phone, Email, Address, Postal Code) + the same 4 customizable fields. Buttons: Previous, Save & next.
3. **Select Programs**: grid of selectable class/program cards (class name, day/time, branch, assigned tutor) — e.g. "Sec 4 A-Maths, Saturday 2PM-4PM, Tampines Branch 2, Mr. Teo". Buttons: Previous, Save & next.
4. **Confirmation** (frame labelled "Registration - S&P - Payment" but its actual content is an empty confirmation step, not a payment form — see Open Questions): Buttons Previous, Submit.

### Registration — Admin, 4-step wizard
Steps: **Personal Information → Job Information → Account Creation → Confirmation**.
1. Personal Info: Full Name, Gender, DOB, NRIC last 4, Phone, Email, Home Address, Postal Code + 4 customizable fields.
2. Job Info: Branch, Employee ID, Position/Title, Department, Work Phone, Manager/Supervisor + 4 customizable fields.
3. Account Creation: Staff Login Email (with "Same as contact email" checkbox), User Access Control role dropdown (e.g. "HR Staff").
4. Confirmation: empty review step, Submit.

### Registration — Teacher, 4-step wizard
Same step shape as Admin but Job Info differs: Branch, Employee ID, Position/Title, Department, Work Phone, **Qualifications**, **Programs** (subjects taught) + 4 customizable fields. Account Creation: Staff Login Email + **Staff Access Control** role dropdown (e.g. "Science Teacher"). Confirmation: empty review step, Submit.

### Save as Draft (modal component)
Purpose: confirm leaving a registration wizard mid-way without losing progress.
Fields: none (confirmation text only) — "Save current progress as draft and continue later?"
Buttons: Discard Changes, Save as Draft.

**Consistency note**: all three wizards reuse an identical step-shell (icon + label + progress) and an identical "Fun-Fact"/customizable-fields block, confirming these are meant to be a shared, org-configurable form builder rather than three hand-built forms — worth building as one parametrized component.

---

## Database Management

### Teachers list / Students list ("Database Management - Teachers", "... Students Side Profile", "... Teachers Side Profile")
Purpose: browse and search the org's student or teacher roster.
- Table columns (students): Full Name, Student ID, Level, Class, Status. Table columns (teachers): Full Name, Subject(s), Level, Class, Status.
- Actions: Add Student(s)/Teacher(s), Export, Edit Columns, View All Columns, search, filters.
- "Side Profile" variant: clicking a row opens a compact right-hand panel showing photo, ID, role, name, and key facts — **Student**: Level, Parent Mobile, Enrolled Classes, Location, Status. **Teacher**: Level(s), Mobile, Allocated Classes, Location, Subjects. Panel buttons: View Full Profile, Edit, Delete.

### Student Full Profile / Student Full Profile - Edit
Purpose: complete record for one student, view and edit modes.
- Header: avatar, name, role badge, "Connect with" quick-contact icons (SMS, in-app chat, WhatsApp).
- Tabs: **Student Info**, Parent Info, Enrolled Classes, Billing, Documents, Progress Report, Attendance. (Only Student Info tab's content is fleshed out in this page; other tabs are nav stubs — no field detail available.)
- Student Info fields: same set as the S&P registration Student Details step, pre-filled and read-only until Edit Profile is pressed → Edit variant makes fields editable, buttons become Discard Changes / Save.

### Student Full Profile — Documents tab
Purpose: manage uploaded files for a student.
- Table columns: checkbox, file-type icon/badge (PDF/JPG/DOCX/MP4/MP3), File name, File size, Date uploaded, Uploaded by, row menu (⋮).
- Action: Upload Files button.

### Teacher Full Profile
**Flagged as inconsistent/likely unfinished**: frame is titled "Database Management - Teacher Full Profile" but its actual content is a generic course-marketplace instructor template ("Kevin Gilbert / Web Designer & Best-Selling Instructor", tabs Dashboard/Courses/Teachers/Message/Wishlist/Purchase History/Settings) plus an **Account Settings** panel (avatar upload, name/username/email/title fields, Save changes) and a **Change Password** panel (Current/New/Confirm Password, Change Password button). This looks like a copy-pasted design-system template, not a designed Teacher profile — do not build to this content; only the Account Settings + Change Password sub-patterns look intentionally reusable (likely meant for a general "My Account" screen, any role).

### Students: Edit View / Teachers: Edit View (bulk/inline-edit table)
Purpose: power-user table view with inline per-column filters and bulk actions.
- Columns (students): Full Name, Student ID, Level, Class, Location, Parent Name, Parent Phone, Status — each column header has its own search box.
- Columns (teachers): Full Name, Teacher ID, Level, Class, Location, Mobile Number, Address, Status.
- Actions: Add, Export Selected Profile, **Bulk Edit**, Edit Columns, **Upload Data** (bulk import), View less/more columns.

---

## Access Control (also appears — per prior note — on the Archived/Future page; content here is consistent with that, not re-detailed further)

### Access Control (list)
Purpose: overview of all roles and how many users are assigned to each.
- Table: Role Name, Access (icons for which modules the role can touch — Organisation, Calendar, Finances, Communications, Resources, etc.), Assigned Users (count + avatar stack).
- Rows: Admin, Staff, Teacher, Student, Parent (top-level role families).

### Access Control - Edit (variant A — single role editor)
Purpose: edit one role's permissions.
- Sections per module (Organisation, Finances → Invoicing/Receipts, Lessons → Scheduling/Cancellations, Communications → Announcements/Messages): a master Switch to enable the module, then checkboxes for View / Edit / Download / **"Medical Assistant"** / **"Marketing Coordinator"** — the last two checkbox labels look like placeholder/mismatched lorem text left over from a template, not real permission levels (see Open Questions).
- Buttons: Discard Changes, Save.

### Access Control - Edit (variant B — master/detail with granular sub-roles)
Purpose: same permission editor as variant A, but scoped to fine-grained sub-roles rather than the 5 top-level roles.
- Left list: Centre Owner (→Super Admin), Principal (→Admin), Science Teacher (→Teacher), Trainee Teacher (→Teacher), Current Student/Graduated Student/Trial Student (→Student), Parent (→Student) — each selectable via checkbox, paginated.
- Right panel: same module/permission editor as variant A for the selected sub-role, plus Edit/Delete buttons.

---

## Finance Module

### Finances - Overview
Purpose: financial health dashboard + invoice list.
- Stat tiles: Payments Collected ($ + count), Pending Payments, Overdue Payments (each with an amount and a count).
- Activity feeds: Recent Payments, Pending, Overdue (name + action + timestamp).
- Invoices table: Full Name, Subject, Level, Class, Days, Amount, Date, **Status** (Paid / Pending), row actions.
- Actions: Filters, Add Invoice, Export Selected Invoices, search.

### Finances - Single Invoice (create/edit)
Purpose: build one invoice.
- Tabs: Single invoice / Recurring invoice.
- Header fields: Location, Term, Student, PA No., Invoice Date, Due Date.
- Line-items table: Item, Description, Quantity, Price, GST, Discount, Amount — "Add Item" row.
- Totals: Total, GST 9%, Amount Due.
- Buttons: Preview Invoice, Generate Invoice.

### Invoice Template (printable/emailed output)
Purpose: the final invoice document sent to a client.
- Header: logo, "Invoice #01234", org name + address.
- Bill To / Client Contact Info blocks.
- Charges list (line items, e.g. "Primary English (May 24) — S$600.00") + Total.
- Due Date Info block: Client Name, Issue Date, Due Date, Amount Due.
- Footer: "Payments: Make checks payable to..." + org bank/mailing info.

### "Form Builder" frame — actually a Finances billing/auto-invoicing screen
**Flagged**: the frame is named "Form Builder" but its content has nothing to do with form-building — it's a Finances screen with stat tiles (Payments Collected/Pending/Overdue), a Transactions activity feed, a Revenue & Expenses chart, a Lessons-conducted stat, and a table of **Name / Balance / Auto-invoicing (Yes/No)** with per-row eye (view) and sms (message) actions, plus an "Add Transaction" button. This is most likely a **student billing-accounts / auto-invoicing management** screen, mislabeled during design file cleanup. Treat the frame name as noise; build to the content.

---

## Calendar

### Calendar (desktop, SuperAdmin/enterprise)
Purpose: org-wide scheduling calendar.
- Week grid, Mon–Sun, hourly rows (09:00–20:00+).
- Events render as colored blocks with time badge(s), attendee avatars, and (for class events) a sub-card showing class name, room, and student count.
- Header controls: Today button, Search, prev/next arrows, visible date range label, Year/Week/Month/Day view toggle.
- **New Event side panel**: Event Title, color-dot picker, Add Location, Add Date, Add Time, Add Teachers, Add Members (Students), Add Notes.

### Add Event (standalone popup — same fields as the New Event panel above, likely the same component reused as a modal)

### Calendar (mobile, Student view)
Purpose: student's personal day/agenda view.
- Horizontal date strip (day-of-week + date).
- Vertical list of time-stamped class cards: subject, tutor name, room/location, and the last chat message snippet from that class's group chat.

---

## Messaging

### Messages (desktop)
Purpose: org-wide inbox for Admin/SuperAdmin/Tutor.
- Left column: message list with unread count in header ("Messages (3)"), Compose button, search, and per-conversation preview showing counterpart name **+ role tag** (Teacher/Student/Admin/Parent/Super Admin), last message, and relative timestamp.
- Right column: open conversation — day dividers, message bubbles with timestamps, "Write Message" input + Send.

### Notifications (mobile)
Purpose: student's notification inbox.
- List of notification "chat stack" items: avatar, sender name, relative time, notification text (e.g. "Made an announcement", "Changed the lesson timing.", "Assigned you new homework."), unread tag/counter.
- "Read all" action.

### Chatroom (mobile, 1:1)
Purpose: direct chat between student and a specific tutor.
- Message bubbles (own vs. other), a "replied to" quoted-message affordance, date dividers, timestamped/read-receipt text.
- Bottom input field + send icon.

### Chat (mobile, list) — same shape as Notifications but scoped to chat threads, also shows role tag chips (Tutor/Student/Admin) per thread and unread count badges.

---

## Analytics / Dashboard Overview

**Two distinct "Analytics" frames exist and are inconsistent with each other** (see Open Questions):

### Overview (desktop, SuperAdmin home dashboard)
Purpose: at-a-glance KPIs for the whole org.
- Filter dropdowns: "All Branches", "Today".
- Stat tiles row 1: Upcoming Lessons, Completed Lessons, Reschedule Requests, Cancellations.
- Stat tiles row 2: New Enrollments, Total Students, Invoiced Amount, Payments Collected.
- Recent Activity feed (messages, ratings, payments, purchases — mixed event types).
- Revenue line/area chart with date-range popup tooltip.
- Lessons-conducted stat + weekly Lessons chart.
- Course Overview: bar chart of enrollments by day of week.
- Overall Course Rating: average score + 5-star-to-1-star horizontal bar breakdown with %s.

### Analytics (desktop, full charts — SuperAdmin)
Purpose: deeper reporting page, three sections each with its own "This year" filter:
- **Financials**: Profit Analysis (combo bar/line, revenue vs. expenses by month), Expense Report (doughnut: Salaries/Rent/Marketing/Admin/Materials), Revenue by Course (horizontal bar by month).
- **Enrollment and Demographics**: New Intakes (line chart by subject), Enquiries Distribution (pie), Enrollment Demographic (pie, by subject).
- **Academic Performance and Progress**: Average Scores by Class/Subject (radar), Progress Tracking (stepped line), Outcome Success Rate (bar).

### Analytics (desktop, Tutor-scoped variant)
**Flagged as likely an early duplicate of "Overview" reused for the Tutor role, not a real distinct design**: same sidebar shell, greeting shows "John / Tutor" instead of "Kwon / Super Admin", stat tiles are just Upcoming Lessons/Completed Lessons/Cancellations (a subset of the SuperAdmin Overview tiles), and the bottom of the page reuses the **generic Enterprise-Clients table component** (with an "Add User" button) rather than anything analytics-specific. Treat this as evidence that a Tutor dashboard should exist and roughly what stats it needs, not as a finished design.

---

## Tutor-facing: Class & Course Management

### Manage Classes (mobile)
Purpose: tutor's quick view of their classes and lecture videos.
- "Manage Classes" list (class name, tutor, day/time, room, student count) with "See all".
- "Manage Lecture Videos" list (module name, tutor, duration) with "See all".
- Buttons: Create a New Course, Create a New Class.

### Manage Classes (desktop, Kanban board)
Purpose: visual class-lifecycle board (Trello-style).
- Intro text: "Set up and manage your classes. Add, edit, or delete classes as needed."
- Lanes: **Upcoming**, **Active**, **Completed**, **Cancelled**.
- Cards: assigned-teacher/student avatar stack, class title, date/time, a 3-item task checklist (generic "Task" placeholders — not real tasks), color tag chips (Online/Tag/Tag), row menu.
- "Add New" card to create a class inline.
- **Flagged**: this frame is wrapped in a component literally named "Frigade Carousel Checklist" (Frigade is a real third-party onboarding/product-tour SaaS) — this strongly suggests the Kanban board was mocked up by repurposing an onboarding-checklist UI kit, not custom-designed for class management. Treat the Kanban *concept* (lanes by class status) as the real idea; don't treat the checklist/task sub-widget as meaningful.

### New Lesson (mobile form)
Purpose: tutor creates a one-off lesson/task.
- Fields: Title, Date, Start time / End time (AM/PM), Description, category chips (Add category → Homework, Project, Mock, Mock Exam, Lecture, Bootcamp, Crash Course, Workshop, Others).
- Button: Publish.

### Courses Tab (mobile, Tutor "My Courses on Uniad")
Purpose: tutor's self-published on-demand course library (separate from live classes).
- "Create a Course" button.
- Course cards: title, tutor, price, rating, like count, short description/testimonial snippet.
- "Enrolled Courses" section with empty state: "You have yet to enroll in a course. Let's start browsing!"

---

## Student-facing mobile app

### Landing
Purpose: pre-auth splash/marketing screen. Login button, WhatsApp Us button, tagline "Nurturing the love of learning".

### Home
Purpose: student's dashboard home.
- Greeting ("Hello, Kwon / Student"), notification/message bell icons.
- Quick Access grid: Attendance, Library, Courses, AI Tutor, Progress.
- "My Task" widget (count + View All).
- "Upcoming Classes" list (subject, tutor, day/time, room, attendee count) + View All.
- Bottom tab nav.

### Other features
Purpose: secondary/overflow quick-access screen. Repeats Home's Quick Access grid (Attendance/Library/Courses/AI Tutor/Progress) plus a second row: Forum, Career, Placement/Tests, Assignments.

### Browse Resources
Purpose: student resource library search/browse. Search bar ("Search Resources..."), Filter control, "1,000+ Resources from Learners' Centre" heading, resource cards (title, tutor name, description, like/heart toggle).

### Lessons (list — "Enrolled Classes")
Purpose: student's list of enrolled classes; same card layout as Home's Upcoming Classes.

### Lessons (detail — course/class page)
Purpose: single class/course detail view. "About this class" (tutor bio + duration/lesson-count), "What you'll learn" checklist, Content (numbered lecture list with duration; later items shown locked via a lock icon), Sign Up / Message buttons.

### Course List (component)
Purpose: numbered lecture/session list with a play button and a "done" checkmark indicator per completed item; used for progress tracking within a class.

### Course - Desc
Purpose: full marketplace-style course listing page (more elaborate than "Lessons detail" — likely the on-demand-course equivalent of that screen).
- Share and Enroll actions; tabs: Reviews / Details / Description.
- Description text, "What you'll learn" checklist, Content (lecture list, locked/unlocked).
- "Other courses from this Tutor" carousel, "About the Tutor" blurb.
- Price, rating, view/play count, Featured/Bestseller tag chips.

### Profile - Payment
Purpose: checkout flow for a lesson/course payment.
- Order summary: Subtotal, Delivery, Total.
- "Apply Discount Code" input.
- Payment Via: PayNow, GrabPay, Credit Card, Paypal, Google Pay (selectable tiles).
- Check Out button.

### add task
Purpose: appears to be a stub — only a "Create a new task" title and the status bar are populated; no fields/buttons present in this export. Likely unfinished in Figma.

---

## Sign In

### Login (desktop)
Purpose: enterprise console sign-in.
- Split layout: illustration + form.
- Fields: Email (username or email), Password (with show/hide eye toggle).
- Remember me checkbox, Sign In button.
- Social sign-in row: Google, Facebook, Apple.
- Top bar: "Don't have account? Contact Us" (no self-serve signup — consistent with invite/admin-created-account model implied by the registration flow).

---

## Open questions / unclear

1. **Branding inconsistency**: most desktop frames show org name "Uniad Academy" in the sidebar logo, but the very first "Analytics" frame (id 225:13161) and its footer say "Learning Lab" instead. Unclear if this is a leftover from an earlier template pass or intentional multi-tenant branding demo — flag before using literal copy from these frames.
2. **"Registration - S&P - Payment" frame**: name implies a payment step, but its actual content is just the empty Confirmation step (Previous/Submit). No payment UI (card entry, PayNow, etc.) appears anywhere in the registration flow. Unclear whether payment happens elsewhere (e.g., invoice sent post-registration per the flowchart note) or is simply missing from this ideation pass.
3. **Access Control checkbox labels** "Medical Assistant" / "Marketing Coordinator" appearing under every module's permission group (alongside View/Edit/Download) look like mismatched placeholder text rather than real permission levels — needs confirmation from the design source before treating as real requirements.
4. **"Database Management - Teacher Full Profile"** frame content is an unrelated course-marketplace instructor template (Account Settings + Change Password), not an actual teacher profile — likely unfinished/placeholder. The Student Full Profile frame is the one to build from; teacher-profile field parity with student-profile should probably be inferred by analogy (Level(s), Mobile, Allocated Classes, Location, Subjects, per the Side Profile panel) rather than from this frame.
5. **"Form Builder" frame** is misnamed — content is a Finances billing/auto-invoicing table (Name/Balance/Auto-invoicing). No literal form-builder UI (drag-drop field designer) appears anywhere in this page, despite the "Customisable#1–4" fields throughout Registration/Database implying such a builder should exist somewhere. May live only on the main/non-ideation Figma page.
6. **Two conflicting "Analytics" frames** (SuperAdmin full-charts version vs. a Tutor-scoped version that's really a trimmed Overview + generic table): unclear which is the intended Tutor Analytics design, or whether the Tutor variant is simply an abandoned early duplicate. Recommend treating only the SuperAdmin full-charts version as authoritative for an "Analytics" page, and deriving a lightweight Tutor dashboard from the Overview screen's stat-tile subset instead.
7. **"Manage Classes" desktop Kanban** is built inside a component named "Frigade Carousel Checklist" (a third-party onboarding-tour product) — the checklist/task sub-widget on each card is almost certainly a repurposed onboarding-tour artifact, not a designed feature. The lane structure (Upcoming/Active/Completed/Cancelled) is likely the real intended idea.
8. **Tab stubs with no field detail**: Student Full Profile's Parent Info, Enrolled Classes, Billing, Progress Report, and Attendance tabs are present as nav items but have no populated content captured in this export — their field/layout design isn't recoverable from this page alone.
9. **"add task" (mobile)** frame is nearly empty (title only) — likely an unfinished/abandoned frame rather than a real spec for a task-creation screen.
10. Registration wizard step counters show inconsistent fractions across near-duplicate frames (e.g. "7/14" appears on both a Personal Information step glyph and unrelated steps) — these look like Figma placeholder counters rather than meaningful step totals; don't treat the specific numbers as real field counts.
