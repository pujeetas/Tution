# Figma Spec — Page: Archived/Future

Source: Figma page "Archived/Future" (deferred/future-scope ideas from the "Uniad Enterprise" design), exported as a text dump of frame names + text layers (`figma_page_Archived_Future.txt`, 6,662 lines).

Boilerplate present on nearly every screen and **not** repeated below per-screen:
- **Left sidebar nav**: Logo ("Uniad Academy" / "Uniad Enterprise") → Dashboard, Analytics, Registration, Calendar, Finances, Communication (Announcements [badge "1"], Messages [badge "3"]), Manage Database (Organisation, Roles & Access Control, Users, Lessons, Reports), Education Tools (Resources Library, Online Courses, Staff Training, AI Tutors), then Settings / Sign-out pinned at the bottom.
- **Dashboard Nav header**: user block ("Kwon" / "Super Admin"), search bar, notification bell.
- **Footer**: "© 2024 – Uniad Academy. All rights reserved" + FAQs / Privacy Policy / Terms & Condition links. (Some frames double up a "Learning Lab" footer instance behind the "Uniad Academy" one — likely a leftover/unremoved layer from an earlier template, not a real second footer.)

A **different, shorter sidebar variant** appears on the "Database Management" screens (see §9) — it drops Roles & Access Control / Reports / Education Tools / Communication and instead expands Manage Database into Organisation, Users, **Students, Teachers, Staffs**, Lessons. This looks like a role-scoped or simplified nav rather than a bug, but it's inconsistent with the Access Control screens' sidebar (see Open Questions).

---

## 1. Access Control (Roles & Access Control list)

**Purpose**: Central table of all roles defined for the organisation, with type, access summary, and assigned-user counts. Entry point for the RBAC (role-based access control) system.

**Key fields/columns**: Role Name (with row checkbox), Type, Access, Assigned Users.

**Example rows**:
| Role Name | Type | Assigned Users |
|---|---|---|
| Centre Owner | Super Admin | — |
| Principal | Admin | — |
| Science Teacher | Teacher | — |
| Trainee Teacher | Teacher | 8+ |
| Current Student | Student | 152+ |
| Graduated Student | Student | 304+ |
| Trial Student | Student | 42+ |
| Parent | Parent | 40+ |

**"Access" column**: rendered as a row of module icons rather than text — the icon set present differs per role and appears to encode which top-level modules that role can reach (bank=Organisation, calendar=Calendar, CreditCard=Finances, sms-star=Communication, folder-cloud=Resources Library). E.g. Centre Owner shows all five icons; Trainee Teacher shows calendar/Finances/Communication/Resources (no Organisation); Current/Graduated/Trial Student show only Communication + Resources; Parent shows Finances + Communication + Resources. This is a plausible-but-unconfirmed reading (see Open Questions).

**Key actions**: "Filters" dropdown, search input, "Add New Role" button (top-right, primary). Per-row actions: copy, download-cloud, edit (pencil), delete (trash) icon buttons. Row checkboxes suggest bulk selection.

**Notes**: Paginated, "Page 1 of 40" — clearly a placeholder/dummy pagination count, not reflective of the 8 example rows shown.

---

## 2. Access Control - Edit (role detail / permission editor)

**Purpose**: Two-pane screen for editing a specific role's granular permissions. Left pane is a condensed version of the roles list (Role Name + Type columns only, its own pagination "Page 1 of 2"); right pane is the permission editor for the currently selected role.

**Example**: editing "Trainee Teacher" (Type: Teacher, Assigned Users: 8+).

**Key fields/inputs**: Permissions are grouped by module, each group has a master on/off **Switch** plus a set of **View / Edit / Share** checkboxes:
- **Organisation** → Access Control
- **Finances** → Invoicing, Receipts
- **Lessons** → Scheduling, Cancellations
- **Communications** → Announcements, Messages

Each sub-permission row shows checkboxes labeled View, Edit, Share, and — oddly — also "Medical Assistant" and "Marketing Coordinator" repeated identically under every group (Access Control, Invoicing, Receipts, Scheduling, Cancellations, Announcements, Messages). This reads as a Figma copy/paste artifact (unrelated placeholder role names bled into a permission-checkbox list) rather than intentional design — flagged in Open Questions.

**Key actions**: Edit / Delete buttons at the bottom of the permission panel.

---

## 3. Organisation Onboarding Flow ("Organisation Profile Creation 1–6" + "Organisation Profile Created")

The six frames are numbered 1–6 in the Figma layer names, but that numbering does **not** match the actual step order. Based on screen titles, field logic, and button state (Previous/Continue vs. Continue-only vs. terminal), the real flow order is:

**Step 1 — "Organisation Profile Creation 1"**: *"Welcome! To begin this journey, please tell us what type of account you'd be opening."* Two choice cards: **Individual** ("Personal account to manage all your lessons and billing activities") vs **Organisation** ("Own or belong to a company, this is for you"), icons briefcase/user. Single **Continue** button. (This exact screen is duplicated later, verbatim, as "Individual Profile Creation 1" — see §8.)

**Step 2 — "Organisation Profile Creation 2"**: *"Create your Profile — Let's set up your personal profile."* Fields: Your Name*, Date of Birth*, Phone Number* (with +65 country-code prefix). Previous / Continue. This is the account holder's own personal profile, captured regardless of Individual/Organisation choice — logically comes right after the account-type choice, before organisation-specific setup.

**Step 3 — "Organisation Profile Creation 6"**: *"Create your Organisation — Provide essential details about your organisation"* (only relevant to the Organisation path). Fields: Company Name*, Company Registration Number (UEN)*, logo upload ("Upload Logo"), Company Phone Number*, Company Address*, Operational Needs (dropdown, optional). Previous / **"Let's start!"** button. Comes after the personal profile because you need an identified person before you can attach an org to them; the "Create" (vs. "Setup") wording and distinct CTA copy mark it as the next new step.

**Step 4 — "Organisation Profile Creation 3"**: *"Setup your Organisation — Provide essential details about your organisation"* shown with **no branches yet**: just an "Add Branch" button and a Continue button. This is the empty state of the branch-setup step.

**Step 4a — "Organisation Profile Creation 4"**: same "Setup your Organisation" screen, but with the **"Add a New Branch" modal** open on top: Branch Name*, Branch Address*, Branch Phone Number* (+65 prefix), Save button, close (X). This is a dialog state of step 4, not a separate step.

**Step 5 — "Organisation Profile Creation 5"**: same "Setup your Organisation" screen now populated with branches already added — three example branches (Tampines East / 42 Tampines Road / +65 6382 4923, Bukit Batok / 321 Bukit Batok Crescent / +65 6923 1842, Jurong West / 49 Jurong Road / +65 6823 3012), each with an "Add Branch" affordance and a per-branch overflow (⋮) menu. Continue button now available.

**Step 6 — "Organisation Profile Created"**: terminal confirmation — *"Account created successfully! Welcome aboard! Let's start your success journey with Uniad Enterprise."* Single **"Let's Start!"** button, which leads into the Getting Started checklist dashboard (§4).

All screens share a lightweight top nav distinct from the main app: "Uniad Enterprise" logo, "Require assistance? → Contact Us" link/button (no sidebar, no dashboard chrome — this is pre-login/pre-dashboard onboarding).

---

## 4. Getting Started Checklist ("Welcome" dashboard)

**Purpose**: Post-onboarding dashboard home screen that walks a new Super Admin through initial setup via a progress checklist, before they land on the "real" dashboard.

**Structure**: Left checklist sidebar with a progress bar (e.g. "0/5", "1/5", "2/5") and five tasks:
1. **Create Registration Forms** — opens the Form Builder (§5)
2. **Create Classes** — opens the class-creation form (§6)
3. **Add Users** — opens the "Add [Students/Tutors/Staffs] via…" method picker (§7)
4. **Set up Calendar** — single CTA "Generate Calendar" ("Generate a calendar based on your class schedules... avoiding scheduling conflicts") — no further detail screens present in this dump
5. **Configure Finances** — listed in the checklist but no dedicated detail screen appears in this export

Selecting a task shows a right-hand detail panel with description text and a primary CTA button (e.g. "Start Creating Forms", "Setup Classes", "Add Users", "Generate Calendar"). Tasks are marked complete as the admin progresses (checklist header text stays the same welcome copy throughout: *"Welcome to your admin dashboard 🎉 Let's complete these simple steps to get your organisation up and running."*).

---

## 5. Form Builder (Registration Form Builder module)

**Purpose**: Lets an admin design/customize the registration forms used when onboarding Students, Staff, and Tutors, entered via the "Create Registration Forms" checklist task.

### Entry: "Select Form Type"
A 3-card carousel to choose which form to edit: **Student**, **Staff**, **Tutor** — each card shows a completion state ("Incomplete"/"Complete"). Continue button. Cards update to "Complete" as each form is saved/published.

### Field-list canvas (per form type)
Each form type opens a builder canvas titled e.g. "Student Registration Form — Add and customise fields for the Student Registration Form", organized into **collapsible sections** (each an "ArrayField" list), each containing an ordered list of **field rows**. Every field row has:
- a drag-handle (reorderable)
- the field's label/title, with a trailing **`*`** if marked required
- an overflow (⋮) menu whose only two documented actions are **"Remove field"** and **"Make compulsory"** (i.e., toggle required)
- status icons (publish/edit) and what look like presence/avatar indicators (possibly showing which team members reviewed/edited the field last — unclear)
- an **"+ Add item"** button at the end of each section to add a new field

Section-header rows (e.g. "Student Details Section") are not draggable and carry their own "Include this section" checkbox in at least one case (Parent Details Section), implying whole sections can be toggled on/off, not just individual fields.

**Per-form-type field inventory observed:**

- **Student Registration Form** — three sections:
  - *Student Details Section*: Full Name*, Date of Birth (DD/MM/YYYY)*, Phone Number*, Email Address*, Gender, NRIC (Last 4 Digits), Home Address, Postal Code, Level, School Name, Select Branch
  - *Parent Details Section* (has "Include this section" toggle): Full Name*, Date of Birth (DD/MM/YYYY)*, Phone Number*, Email Address*, Gender, NRIC (Last 4 Digits), Home Address, Postal Code
  - *Select Class Section*: Select Classes

- **Staff Registration Form** — two sections:
  - *Personal Details Section*: Full Name*, Date of Birth (DD/MM/YYYY)*, Phone Number*, Email Address*, Gender, NRIC (Last 4 Digits), Home Address, Postal Code
  - *Job Details Section*: Select Branch*, Employee ID*, Position*, Department*, Work Phone, Supervisor

- **Tutor Registration Form** — three sections:
  - *Personal Details Section*: identical field set to Staff's Personal Details Section
  - *Job Details Section*: Select Branch*, **Employee ID***, Position*, Department*, Work Phone, Supervisor, **Qualifications**
  - *Select Class Section*: Select Classes

  Note: the Tutor form's Job Details section reuses "Employee ID" verbatim from the Staff form — likely an un-updated copy/paste (a tutor-specific ID field, e.g. "Tutor ID", would be more expected) — flagged in Open Questions.

**Bottom action bar** (consistent across all three form types): **"Review changes"** (with a transfer/diff icon — presumably a changes-summary view), **"Discard Changes"**, **"Preview Form"**, **"Publish"**.

**Capability summary**: fields can be reordered (drag handle), added ("+ Add item"), removed, and toggled required — per section, per form type. Whole optional sections (e.g. Parent Details on the Student form) can be included/excluded. Changes go through a review → discard/preview/publish cycle rather than saving immediately.

---

## 6. Add a New Class / Manage Classes

Part of the "Create Classes" checklist task, presented in the same Form-Builder-style frame family (still labeled "Form Builder" in the Figma layer name, though it's really a standalone class-creation form, not a Registration Form Builder screen).

**"Add a New Class" form fields**: Branches* (multi-select), Class Name*, Levels*, Subjects*, Lesson Type*, Class Schedule* (date/time picker), Class Location, Description, Assign Tutors (add via "+" button). Bottom bar: Review changes / Discard Changes / **Create Class**.

**"Manage Classes" list view**: card-per-class layout, e.g. "Sec 4 A-Maths / Saturday 2PM–4PM / Tampines Branch 2 / Mr. Teo" and "Summer Bootcamp / Tuesday 2PM–4PM / Tampines Branch 1 / Ms Layla, Ms Tan", each with a ⋮ overflow menu, plus an "+ Add New Class" tile. Bottom bar here just has Review changes / **Save**.

---

## 7. Add Users via [Method]

Reached from the "Add Users" checklist task. Presented as three near-identical screens, one per user type — "Add students via", "Add tutors via", "Add staffs via" — each a card carousel offering four intake methods:
1. **Submit form** — "Directly fill out the registration form for each [student/tutor/staff]"
2. **Email Invite** — "Send email registration form to [students/tutors/staffs]"
3. **Share URL** — "Generate a shareable URL for [students/tutors/staffs] to complete the registration form"
4. **Import data** — "Import user data from a file (CSV or Excel)"

This confirms the registration forms built in §5 are reused here as the actual intake mechanism (manual entry, emailed link, public shareable link, or bulk CSV/Excel import) rather than being a standalone design exercise.

---

## 8. Individual Profile Creation 1 / Account Type Chooser

Functionally and textually identical to "Organisation Profile Creation 1" (§3, Step 1): same "Welcome!" copy, same Individual/Organisation choice cards, same Continue button. Appears to be a duplicate/reused frame rather than a distinct screen — no separate "Individual-only" flow (skipping organisation/branch setup) is present elsewhere in this export.

---

## 9. Database Management — Tutor Side Profile / Student Side Profile

**Purpose (as built)**: these are **not** compact single-record profile summaries — despite the "Side Profile" name, both frames are directory **list/table views**, shown in an empty state (header text literally reads "Showing 0 - 0 out of 0 students" on both the Tutor and the Student screen — the Tutor screen's text is a copy/paste leftover, since it still says "students").

**Columns**: Full Name, Branch, Department, Position (same four columns on both Tutor and Student variants — "Department"/"Position" reads as staff/tutor-oriented and may not be appropriate for a Student table; possibly unfinished/placeholder).

**Header/title**: page title is just "Tutor" / "Student" respectively.

**Key actions**: Filters dropdown, "Search Names, Classes…" input, **"Add Staffs"** button (mislabeled on both — should presumably read "Add Tutors" / "Add Students"), Export, Edit Columns, View All Columns. Pagination shows "Page 1 of 1" (consistent with the declared 0 rows).

**Sidebar variant**: uses the shorter Manage Database sub-nav (Organisation, Users, **Students, Teachers, Staffs**, Lessons) instead of the Roles & Access Control / Reports / Education Tools set seen elsewhere (see intro note).

My best read is that "Side" in the frame name refers to "which side of the roster" (Tutor-side vs. Student-side of the Manage Database section), not a side-panel UI pattern — but see Open Questions, since no populated/expanded state is present to confirm what selecting a row does.

---

## 10. Log In

**Purpose**: standard authentication screen, same lightweight top nav as the onboarding flow (Uniad Enterprise logo, "Require assistance? → Contact Us"). Marketing panel on the left: "Seamless Collaboration — Effortlessly work together with your team in real-time."

**Fields**: Email (placeholder "Username or email address..."), Password (with show/hide eye toggle).

**Actions**: "Remember me" checkbox, **Log in** button, "Don't have an account? Sign up here", "Forgot Password?" link, and social sign-in row: **Google / Facebook / Apple**.

---

## 11. Database Management — Student Full Profile

**Purpose**: the full detail view for a single student record (breadcrumb: "Students > Lee Wei Jun"), as opposed to the empty-state list in §9.

**Header**: avatar, student name ("Lee Wei Jun"), role tag ("Student"), and a "Connect with" row of three quick-contact icons — SMS, in-app chat, WhatsApp.

**Tabs**: Student Info, Parent Info, Enrolled Classes, Billing, Documents, Progress Report, Attendance. (Only "Student Info" and "Documents" have their content captured in this export — see §12/§13; the other five tabs' content is not present in this page dump.)

**"Student Info" tab — "Basic Informations" section fields** (each rendered as a labeled dropdown/select-style row with an inline pencil "edit" icon, implying inline editing directly on the view without entering a separate edit mode):
Full Name, Gender, Level, Subjects (multi: "English, Mathematics, Science"), Date of Birth (DD/MM/YYYY), Student ID, Phone Number, Email Address, Home Address, Postal Code, School Name (free-text input with a 0/120 character counter).

Example data: Lee Wei Jun, Male, Secondary 4, English/Mathematics/Science, 04/01/2000, Student ID 492P, 87703325, weijun23@uniad.app, 4 Kent Ridge Road, 231851, Pei Hwa Secondary School.

---

## 12. Database Management — Student Full Profile - Edit

Same header/profile card and tab structure as §11. The "Basic Informations" fields are the same set, but rendered without the inline per-field edit-pencil icons (since the whole panel is already in edit mode), and one field shows a placeholder instead of a value ("Phone Number" shows "e.g. 87703325" as a hint rather than the filled value 87703325 seen in the view mode — likely just an inconsistent mock rather than a real cleared value).

**Key actions**: bottom-of-panel **Discard Changes** / **Save** buttons.

---

## 13. Database Management — Student Full Profile - Documents

Same header/tabs; "Documents" tab selected.

**Purpose**: per-student file/document repository.

**Header row**: "Student Documents" title + **"Upload Files"** button (top right).

**Table columns**: row checkbox, File type icon (badge showing extension: PDF/JPG/DOCX/MP4/MP3), File name, File size, Date uploaded, Uploaded by, plus a per-row ⋮ overflow menu.

**Example rows**:
| File | Size | Uploaded | By |
|---|---|---|---|
| Onboarding Documents.pdf | 200 KB | 4 May 2024 | Mr. Teo |
| Screenshot.jpg | 300 KB | 1 Feb 2024 | Ms. Layla |
| Introduction.docx | 300 KB | 5 Jan 2024 | Ms. Layla |
| Lesson Recording.mp4 | 203 MB | 1 Jan 2024 | Ms. Layla |
| Background Music.mp3 | 300 KB | 10 Feb 2023 | Ms. Layla |
| Background Music.mp3 (dup) | 300 KB | 10 Feb 2023 | Ms. Layla |
| Background Music.mp3 (dup) | 300 KB | 10 Feb 2023 | Ms. Layla |

The "Background Music.mp3" row repeats identically three times — this is very likely a Figma placeholder/duplication artifact rather than an intentional example of three same-named files, though it could also be showing what duplicate uploads look like in the UI.

**Pagination**: "Page 1 of 40" — again a placeholder count, unrelated to the ~7 rows actually shown.

---

## Open questions / unclear

1. **Access Control table "Access" column** — I inferred the icon set (bank/calendar/CreditCard/sms-star/folder-cloud) maps to module access (Organisation/Calendar/Finances/Communication/Resources) based on which icons appear per role, but there's no legend/label confirming this; it should be verified against the live Figma or a PM before being treated as spec.
2. **"Medical Assistant" / "Marketing Coordinator" checkboxes** in Access Control - Edit, repeated identically under every single permission group (Access Control, Invoicing, Receipts, Scheduling, Cancellations, Announcements, Messages) — almost certainly a copy/paste artifact in the Figma source rather than intended UI; needs confirming with design before building.
3. **Tutor Registration Form reusing "Employee ID"** in its Job Details section (identical to Staff's field) — likely an unedited copy from the Staff form template; probably should be "Tutor ID" or similar, but unconfirmed.
4. **"Database Management - Tutor/Student Side Profile" naming** — both frames turned out to be empty-state list/table views, not profile summary cards as the frame name suggests. Unclear what "Side" refers to, and no populated or row-expanded state exists in this export to show what clicking into a row does (does it open the "Full Profile" screen in §11, or a slide-out side panel?).
5. **"Add Staffs" button mislabeled** on both the Tutor and Student directory screens (§9) — should presumably read "Add Tutors" / "Add Students" respectively; likely a template copy/paste bug, not intentional.
6. **"Showing 0 - 0 out of 0 students" text on the Tutor screen** — same copy/paste issue, hardcoded to say "students" regardless of which entity type the screen is for.
7. **"Configure Finances" and "Set up Calendar" checklist tasks** have only a one-line description + single CTA button in this export; no dedicated setup screens are present, so their actual scope/fields are unknown from this page alone.
8. **Enrolled Classes / Parent Info / Billing / Progress Report / Attendance tabs** on the Student Full Profile (§11) are named in the tab bar but their content is not present anywhere in this Archived/Future page export — may exist on a different Figma page, or may never have been designed.
9. **"Review changes" button** (with a transfer/diff-style icon) appears on every Form Builder / class-creation bottom bar but its target screen (a diff/changes-summary view, presumably) is not present in this export.
10. **Individual-only onboarding path** — after choosing "Individual" on the account-type screen (§3 Step 1 / §8), no distinct flow (skipping organisation/branch setup) appears in this export; it's unclear whether Individual accounts get a shorter version of steps 2–6 or a completely different flow not captured here.
11. **Sidebar variant inconsistency** — the "Database Management" screens (§9, §11–13) use a materially different, shorter Manage Database sub-nav than the Access Control / Form Builder screens. Unclear if this is intentional (e.g. scoped to a different admin role) or an unfinished/inconsistent set of mockups.
