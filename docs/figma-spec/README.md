# Uniad Enterprise Figma → build spec

This directory is a condensed, build-ready spec extracted from the Figma file **"Uniad Enterprise (Copy)"** (https://www.figma.com/design/Q4fWovDzSsBrXOV54Fvui3/Uniad-Enterprise--Copy-), which the Uniad team designed but never shipped. Decision (2026-07-08): this repo will be built to match that design as closely as practical, since it's a validated spec from the platform we intend to eventually merge into (see `[[project_uniad_strategy]]` in project memory).

Pulled via the Figma REST API (`GET /v1/files/{file_key}`) on 2026-07-08 and digested page-by-page:

| File | Figma page | Contents |
|---|---|---|
| [01-user-flow-main.md](01-user-flow-main.md) | ⭐️ User Flow [MAIN] | The primary, most-finished flow: landing page, sign up/log in, org/individual onboarding, Form Builder, Getting Started checklist, Calendar, Students/Admins/Classes management, Student Profile, Admin Dashboard Overview, Finances, and the full **attendance → invoicing → payment** flow. **Start here** — this is the highest-confidence source. |
| [02-ideation-materials.md](02-ideation-materials.md) | Ideation Materials | Earlier-stage explorations, both a mobile student/tutor app and a desktop console: Registration (3 approaches), Database Management (student/teacher profiles, documents, bulk edit), Access Control, Finance (Overview/Single Invoice/Invoice Template), Calendar, Messaging, Analytics, tutor course/class management, student-facing mobile screens (Home, Lessons, Course marketplace, Checkout). Rougher and less consistent than MAIN — cross-check before treating as authoritative. |
| [03-archived-future.md](03-archived-future.md) | Archived/Future | Deferred-but-designed features: Roles & Access Control (list + permission editor), the **Organisation onboarding flow** (account type → personal profile → create org → add branches → confirmation, with reasoning for the real step order), the Form Builder's actual field-level capabilities (drag/reorder, required toggle, section include/exclude, publish), "Add Users via [method]" (form/email/URL/CSV), Student Full Profile (view/edit/documents). |
| [04-promo-materials.md](04-promo-materials.md) | 📢 Promo Materials | Polished, realistic-data reference screens — treat as highest-fidelity for visual/data shape where it overlaps other pages: full Analytics module (9 charts), Admin Dashboard Overview (with branch selector, confirming multi-branch), Tutor-facing "Teaching" dashboard. |

Not digested in detail (low product-spec value): 🖋️ Typography, Icons (design-system assets only).

## Confirmed product shape (cross-referenced across all 4 pages)

**Primary nav / IA**: Dashboard, Analytics, Registration, Calendar, Finances, Communication (Announcements, Messages), Manage Database (Organisation, Roles & Access Control, Users, Lessons, Reports), Education Tools (Resources Library, Online Courses, Staff Training, AI Tutors), Settings.

**Core entities**: Organisation (multi-branch — branch selector on the main dashboard, branches each with name/address/phone), Roles (RBAC — top-level role families Admin/Staff/Teacher/Student/Parent, with finer sub-roles like "Centre Owner"/"Principal"/"Science Teacher" and granular per-module View/Edit/Share permissions), Users (Student/Parent/Tutor/Staff/Admin — org-customizable registration forms per type via the **Form Builder**), Classes (with schedule, levels, subjects, location, tutors, students, public/private visibility), Calendar (derived from class schedules + manual one-off Events, Month/Week/Year views), Finances (Accounts/Invoices/Transactions tabs), Documents (per-student file repository).

**The centerpiece flow** — attendance → invoicing → payment — is the most fully-specified part of the whole file and matches this repo's already-planned next milestone (replacing the `simulatePayment` stub): mark attendance per session (Present/Absent Valid/Absent Invalid/Late) → billable items pre-selected from attendance → invoice generated (can batch per-class across all attended students) → sent via email + QR code → paid via FazzPay (~2% fee, auto-logged) / Stripe (~5% fee, auto-logged) / Manual bank transfer or PayNow (0% fee, admin logs manually) → student's outstanding balance auto-deducted. See §13 of `01-user-flow-main.md` for full detail.

**Individual vs. Organisation conditional logic**: a solo tutor picks "Individual" at onboarding and gets a materially simplified app — no Admin/Staff registration form, no "Add Admins," Getting Started checklist trims accordingly. This matches this repo's existing individual-tutor support; the centre/org path is the expansion.

## Known noise — do not build these literally

Two independent digest passes both flagged the same categories of artifact, so treat these as confirmed noise rather than real spec:

1. **Verbatim third-party template leftovers**: the "Profile"/"NFT Marketplace"/"Main Dashboard" frames in User Flow MAIN are an unmodified **Horizon UI ("Simmmple") crypto-dashboard template** (footer literally credits Horizon UI/Simmmple, content is ETH bids and NFT demo data) — unrelated to Uniad, don't build. Similarly, "Database Management - Teacher Full Profile" in Ideation Materials is a generic course-marketplace instructor template ("Kevin Gilbert / Web Designer"), not a designed teacher profile — only its Account Settings / Change Password sub-panels look intentionally reusable. The "Add A New Student" bulk-invite screen (User Flow MAIN §7, node `589-36597`) is built on a **Frigade "Carousel Checklist" component** (a third-party onboarding-checklist UI kit — the frame is literally named `Frigade Carousel Checklist/Min 3 cards`), with a leftover unlabeled button that just says "Button CTA" — the surrounding chrome (any "Review changes" affordance beyond Add Manually/Send Invite) may be inherited template scaffolding rather than an intentional third action; treat only the copy that's actually customized (the invite instructions, the two real buttons) as real spec.
2. **Copy/paste field-label bleed**: "Medical Assistant" / "Marketing Coordinator" checkboxes appear repeated under every permission group in **both** Access Control - Edit variants (Ideation Materials and Archived/Future independently) — clearly placeholder text that leaked from an unrelated mock, not real permission levels.
3. **"Form Builder" is an overloaded frame name** — it refers to at least three different things across the file: (a) the real registration-form-customization tool (drag/reorder/required-toggle/publish — Archived/Future §5, User Flow MAIN §4), (b) the generic wizard shell reused for Add Class / Add Event / Create Invoice (same chrome, different fields), and (c) in Ideation Materials, a screen mislabeled "Form Builder" that's actually a Finances billing/auto-invoicing table. Don't conflate these when cross-referencing.
4. Assorted mislabeled buttons/text worth a visual double-check before building literally: "Add an Event" wizard's submit button says "Create Class"; the Tutor/Student directory screens' "Add Staffs" button and "0 students" empty-state text (should read Tutors/Students respectively); Tutor Registration Form's Job Details section reuses "Employee ID" from the Staff form verbatim. Same copy/paste bleed confirmed again on the **Admins list view** (node `595-39716`) — its empty state also literally reads "Showing 0 - 0 out of 0 students", copied verbatim from the Students list.
5. **Duplicate/orphaned Footer instances with stale branding**: several frames (Getting Started checklist `688-36284`, Add a New Class wizard `689-45577`) render *two* stacked `Footer` component instances — one correctly overridden to "© 2024 - Uniad Academy. All rights reserved", the other left on a "© 2024 - Learning Lab. All rights reserved" override (itself sitting on top of the master component's own default text, "© 2021 - Eduguard. Designed by Templatecookie."). "Learning Lab" isn't a name used anywhere else in the file — it's a leftover from an earlier, unrelated rebrand pass, not a real Uniad product name. Build a single footer with the Uniad Academy copy; don't carry the duplicate layer or its text forward.

## Open product decisions (not resolved by the Figma, need a real call)

- **Billing rule per attendance status** — is "Absent (Valid)" excused from billing, discounted, or billed same as Present? Not specified anywhere in the file.
- **Course/class fee structure setup** — referenced as a precursor step ("Add Course Fee (billing) structure") but no screen for actually configuring per-class pricing was captured in any page.
- **Payment Methods as a 4th Finances tab** — appears inconsistently (present on the Accounts screen, absent on Invoices/Transactions).
- Several Student Full Profile tabs (Parent Info, Enrolled Classes, Billing, Progress Report, Attendance) are named but have no field-level content in any page of this export.

## Suggested build order

Roughly by how fully-specified each area is (most → least ready to build against) and how it maps to this repo's existing progress:

1. **Attendance-taking → Invoicing → Payment** (already the planned next milestone; best-specified flow in the whole file) — replaces `simulatePayment`.
2. **Multi-branch Organisation model** — extends the existing `Organization.js`; needed before Finances/Calendar can be branch-scoped per the Overview dashboard's branch selector.
3. **Form Builder** (registration form customization) — bigger lift, touches registration for every role; the Getting Started checklist implies it's meant to be set up before Add Users/Add Classes, so worth sequencing early once the data model supports org-defined custom fields.
4. **Roles & Access Control (RBAC)** — biggest architectural change (current repo has a flat role field); recommend last among the "foundational" items since it can layer on top of an already-working app.
5. **Analytics module** — purely additive once the underlying data (attendance, invoices, transactions, enrollments) exists to aggregate.
